/* Mini générateur de QR code (mode octets, correction d'erreur M, versions 1 à 10).
   Aucune dépendance. Usage : QR.svg("https://exemple.fr/?k=abc") -> chaîne SVG. */
(function (root) {
  'use strict';

  // Version : [mots de code de correction par bloc, [nb blocs, mots de données par bloc], ...]
  var EC_M = {
    1: [10, [1, 16]],
    2: [16, [1, 28]],
    3: [26, [1, 44]],
    4: [18, [2, 32]],
    5: [24, [2, 43]],
    6: [16, [4, 27]],
    7: [18, [4, 31]],
    8: [22, [2, 38], [2, 39]],
    9: [22, [3, 36], [2, 37]],
    10: [26, [4, 43], [1, 44]]
  };
  var ALIGN = { 1: [], 2: [6, 18], 3: [6, 22], 4: [6, 26], 5: [6, 30], 6: [6, 34], 7: [6, 22, 38], 8: [6, 24, 42], 9: [6, 26, 46], 10: [6, 28, 50] };

  function dataCapacity(v) {
    var e = EC_M[v], n = 0;
    for (var i = 1; i < e.length; i++) n += e[i][0] * e[i][1];
    return n;
  }

  function utf8(str) {
    var s = unescape(encodeURIComponent(str)), out = [];
    for (var i = 0; i < s.length; i++) out.push(s.charCodeAt(i));
    return out;
  }

  // --- Corps de Galois GF(256), polynôme 0x11D ---
  var EXP = new Array(512), LOG = new Array(256);
  (function () {
    var x = 1;
    for (var i = 0; i < 255; i++) {
      EXP[i] = x; LOG[x] = i;
      x <<= 1; if (x & 0x100) x ^= 0x11D;
    }
    for (i = 255; i < 512; i++) EXP[i] = EXP[i - 255];
  })();
  function gmul(a, b) { return (a === 0 || b === 0) ? 0 : EXP[LOG[a] + LOG[b]]; }

  function rsGenerator(deg) {
    var g = [1];
    for (var i = 0; i < deg; i++) {
      var next = new Array(g.length + 1).fill(0);
      for (var j = 0; j < g.length; j++) {
        next[j] ^= g[j];
        next[j + 1] ^= gmul(g[j], EXP[i]);
      }
      g = next;
    }
    return g; // g[0] = 1 (coefficient du terme de plus haut degré)
  }
  function rsRemainder(data, deg) {
    var gen = rsGenerator(deg), rem = new Array(deg).fill(0);
    for (var i = 0; i < data.length; i++) {
      var factor = data[i] ^ rem[0];
      rem.shift(); rem.push(0);
      for (var j = 0; j < deg; j++) rem[j] ^= gmul(gen[j + 1], factor);
    }
    return rem;
  }

  function encodeData(bytes, version) {
    var cap = dataCapacity(version), bits = [];
    function put(val, len) { for (var i = len - 1; i >= 0; i--) bits.push((val >>> i) & 1); }
    put(4, 4); // mode octets
    put(bytes.length, version < 10 ? 8 : 16);
    bytes.forEach(function (b) { put(b, 8); });
    put(0, Math.min(4, cap * 8 - bits.length)); // terminateur
    while (bits.length % 8) bits.push(0);
    var cw = [];
    for (var i = 0; i < bits.length; i += 8) {
      var v = 0; for (var k = 0; k < 8; k++) v = (v << 1) | bits[i + k];
      cw.push(v);
    }
    for (var pad = 0xEC; cw.length < cap; pad ^= 0xEC ^ 0x11) cw.push(pad);
    return cw;
  }

  function addEcAndInterleave(data, version) {
    var e = EC_M[version], ecLen = e[0], blocks = [], pos = 0;
    for (var g = 1; g < e.length; g++) {
      for (var b = 0; b < e[g][0]; b++) {
        var d = data.slice(pos, pos + e[g][1]); pos += e[g][1];
        blocks.push({ d: d, ec: rsRemainder(d, ecLen) });
      }
    }
    var out = [], maxD = Math.max.apply(null, blocks.map(function (b) { return b.d.length; }));
    for (var i = 0; i < maxD; i++) blocks.forEach(function (b) { if (i < b.d.length) out.push(b.d[i]); });
    for (i = 0; i < ecLen; i++) blocks.forEach(function (b) { out.push(b.ec[i]); });
    return out;
  }

  function bit(x, i) { return ((x >>> i) & 1) !== 0; }

  function build(codewords, version) {
    var size = version * 4 + 17, m = [], fn = [], y, x;
    for (y = 0; y < size; y++) { m.push(new Array(size).fill(false)); fn.push(new Array(size).fill(false)); }
    function setFn(x, y, dark) { m[y][x] = dark; fn[y][x] = true; }

    function finder(cx, cy) {
      for (var dy = -4; dy <= 4; dy++) for (var dx = -4; dx <= 4; dx++) {
        var d = Math.max(Math.abs(dx), Math.abs(dy)), xx = cx + dx, yy = cy + dy;
        if (xx >= 0 && xx < size && yy >= 0 && yy < size) setFn(xx, yy, d !== 2 && d !== 4);
      }
    }
    function alignment(cx, cy) {
      for (var dy = -2; dy <= 2; dy++) for (var dx = -2; dx <= 2; dx++)
        setFn(cx + dx, cy + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1);
    }
    function formatBits(mask) {
      var data = (0 << 3) | mask, rem = data; // niveau M = 00
      for (var i = 0; i < 10; i++) rem = (rem << 1) ^ ((rem >>> 9) * 0x537);
      var bits = ((data << 10) | rem) ^ 0x5412;
      for (i = 0; i <= 5; i++) setFn(8, i, bit(bits, i));
      setFn(8, 7, bit(bits, 6)); setFn(8, 8, bit(bits, 7)); setFn(7, 8, bit(bits, 8));
      for (i = 9; i < 15; i++) setFn(14 - i, 8, bit(bits, i));
      for (i = 0; i < 8; i++) setFn(size - 1 - i, 8, bit(bits, i));
      for (i = 8; i < 15; i++) setFn(8, size - 15 + i, bit(bits, i));
      setFn(8, size - 8, true);
    }
    function versionBits() {
      if (version < 7) return;
      var rem = version;
      for (var i = 0; i < 12; i++) rem = (rem << 1) ^ ((rem >>> 11) * 0x1F25);
      var bits = (version << 12) | rem;
      for (i = 0; i < 18; i++) {
        var a = size - 11 + (i % 3), b = Math.floor(i / 3);
        setFn(a, b, bit(bits, i)); setFn(b, a, bit(bits, i));
      }
    }

    for (var i = 0; i < size; i++) { setFn(6, i, i % 2 === 0); setFn(i, 6, i % 2 === 0); }
    finder(3, 3); finder(size - 4, 3); finder(3, size - 4);
    var ap = ALIGN[version], last = ap.length - 1;
    for (i = 0; i < ap.length; i++) for (var j = 0; j < ap.length; j++) {
      if ((i === 0 && j === 0) || (i === 0 && j === last) || (i === last && j === 0)) continue;
      alignment(ap[i], ap[j]);
    }
    formatBits(0); versionBits();

    // Placement des données en zigzag
    var k = 0;
    for (var right = size - 1; right >= 1; right -= 2) {
      if (right === 6) right = 5;
      for (var vert = 0; vert < size; vert++) for (var jj = 0; jj < 2; jj++) {
        x = right - jj;
        var upward = ((right + 1) & 2) === 0;
        y = upward ? size - 1 - vert : vert;
        if (!fn[y][x] && k < codewords.length * 8) {
          m[y][x] = bit(codewords[k >>> 3], 7 - (k & 7)); k++;
        }
      }
    }

    function applyMask(mask) {
      for (var y = 0; y < size; y++) for (var x = 0; x < size; x++) {
        var inv;
        switch (mask) {
          case 0: inv = (x + y) % 2 === 0; break;
          case 1: inv = y % 2 === 0; break;
          case 2: inv = x % 3 === 0; break;
          case 3: inv = (x + y) % 3 === 0; break;
          case 4: inv = (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0; break;
          case 5: inv = (x * y) % 2 + (x * y) % 3 === 0; break;
          case 6: inv = ((x * y) % 2 + (x * y) % 3) % 2 === 0; break;
          default: inv = ((x + y) % 2 + (x * y) % 3) % 2 === 0;
        }
        if (!fn[y][x] && inv) m[y][x] = !m[y][x];
      }
    }

    function penalty() {
      var score = 0, x, y, n, line;
      function lineScore(get) {
        var s = 0, run = 1;
        for (var i = 1; i < size; i++) {
          if (get(i) === get(i - 1)) run++;
          else { if (run >= 5) s += 3 + run - 5; run = 1; }
        }
        if (run >= 5) s += 3 + run - 5;
        // motif 1:1:3:1:1 entouré de blanc
        var str = ''; for (i = 0; i < size; i++) str += get(i) ? '1' : '0';
        var re = /10111010000|00001011101/g, mt;
        while ((mt = re.exec(str))) { s += 40; re.lastIndex = mt.index + 1; }
        return s;
      }
      for (y = 0; y < size; y++) score += lineScore(function (i) { return m[y][i]; });
      for (x = 0; x < size; x++) score += lineScore(function (i) { return m[i][x]; });
      for (y = 0; y < size - 1; y++) for (x = 0; x < size - 1; x++) {
        var c = m[y][x];
        if (c === m[y][x + 1] && c === m[y + 1][x] && c === m[y + 1][x + 1]) score += 3;
      }
      var dark = 0; m.forEach(function (r) { r.forEach(function (v) { if (v) dark++; }); });
      var total = size * size;
      score += (Math.ceil(Math.abs(dark * 20 - total * 10) / total) - 1) * 10;
      return score;
    }

    var best = 0, bestScore = Infinity;
    for (var mask = 0; mask < 8; mask++) {
      applyMask(mask); formatBits(mask);
      var p = penalty();
      if (p < bestScore) { bestScore = p; best = mask; }
      applyMask(mask); // annule
    }
    applyMask(best); formatBits(best);
    return m;
  }

  function matrix(text) {
    var bytes = utf8(String(text)), version = 0;
    for (var v = 1; v <= 10; v++) {
      var need = 4 + (v < 10 ? 8 : 16) + bytes.length * 8;
      if (need <= dataCapacity(v) * 8) { version = v; break; }
    }
    if (!version) throw new Error('Texte trop long pour le QR code (' + bytes.length + ' octets)');
    return build(addEcAndInterleave(encodeData(bytes, version), version), version);
  }

  function svg(text, opts) {
    opts = opts || {};
    var m = matrix(text), n = m.length, q = 4, d = '';
    for (var y = 0; y < n; y++) for (var x = 0; x < n; x++)
      if (m[y][x]) d += 'M' + (x + q) + ',' + (y + q) + 'h1v1h-1z';
    var t = n + 2 * q;
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + t + ' ' + t + '"' +
      (opts.size ? ' width="' + opts.size + '" height="' + opts.size + '"' : '') +
      ' shape-rendering="crispEdges" role="img" aria-label="QR code">' +
      '<rect width="' + t + '" height="' + t + '" fill="#fff"/><path d="' + d + '" fill="#000"/></svg>';
  }

  root.QR = { matrix: matrix, svg: svg };
})(typeof window !== 'undefined' ? window : globalThis);
