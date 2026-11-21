/* ============================================================
   TTC Wielsbeke-Spotit — huisstijl voor canvas-tekenwerk
   Dezelfde kleuren als tokens.css, maar voor ctx.fillStyle.
   Werkt in de browser (window.TTCW) en in Node (require).
   ============================================================ */
(function (root) {
  const TTCW = {

    /* het clublogo: zwart batje, drie strepen */
    club: {
      black: '#111111', white: '#ffffff',
      red: '#e30613', green: '#78be20', blue: '#0092d6',
      stripes: ['#e30613', '#78be20', '#0092d6']
    },

    /* het arcadepalet dat alle spellen delen */
    c: {
      ink: '#02132b', blueDeep: '#062a56', blue: '#0b3a75', blueMid: '#1a5ca8',
      blueLt: '#2f7fd4', blueHi: '#7ec1ff', chrome: '#9ed4ff',
      red: '#c8242a', redDark: '#8d1519', redShadow: '#5d0e11',
      gold: '#ffd23f', goldShadow: '#6b4c00', green: '#5ed13f', orange: '#ff8a1f',
      flash: '#e8634a', white: '#f4f4f4', outline: '#0a1424'
    },

    /* wat in elk spel terugkomt, zodat het overal hetzelfde oogt */
    world: {
      ball: '#f4f4f4',               // gewone witte bal
      ball3star: '#ef7d18',          // oranje 3-sterren bal
      table: '#1f4fa3', tableDark: '#163a7a', tableLegs: '#2a2f36',
      tableGreen: '#1f7a4a',         // groene tafel (bovenaanzicht in BALLENJAGER)
      floor: '#c7652c', floorDark: '#a4501d', floorLine: '#f5e9c8',
      skin: '#f0c39a', hair: '#3a2618'
    },

    /* het clubshirt: zwart met de drie strepen */
    shirt: {
      shirt: '#161616', trim: '#f4f4f4', hem: '#0a0a0a', shorts: '#111111',
      stripes: ['#e30613', '#78be20', '#0092d6']
    },

    /* de noppenspeler van PIPS OUT!: de vaste "slechterik" van het clubuniversum */
    nopper: {
      shirt: '#c8242a', trim: '#8d1519', shorts: '#1c2430',
      pips: ['#f0716a', '#d94a44', '#8b1a1f']
    },

    /* rubberkleuren die echt te koop zijn (ITTF 2021) */
    rubbers: {
      red:   ['#e0413f', '#c8242a', '#8d1519'],
      black: ['#3a3f47', '#2a2f36', '#161616']
    },

    sponsor: { navy: '#00203a', teal: '#18b0be' },

    font: '"Press Start 2P", "Courier New", monospace',

    /* tekst met een harde 8-bit schaduw, zoals de logo's in de spellen */
    shadowText(ctx, text, x, y, fill, shadow, off = 3) {
      ctx.fillStyle = shadow; ctx.fillText(text, x + off, y + off);
      ctx.fillStyle = fill;   ctx.fillText(text, x, y);
    },

    /* de drie clubstrepen, bv. onderaan een scherm of op een shirt */
    stripes(ctx, x, y, w, h, gap = h * 0.7) {
      TTCW.club.stripes.forEach((col, i) => {
        ctx.fillStyle = col; ctx.fillRect(x, y + i * (h + gap), w, h);
      });
    }
  };

  root.TTCW = TTCW;
  if (typeof module !== 'undefined' && module.exports) module.exports = TTCW;
})(typeof globalThis !== 'undefined' ? globalThis : this);
