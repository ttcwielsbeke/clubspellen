/* ============================================================
   TTC Wielsbeke-Spotit — ttcw.js
   Kleine helpers die elk clubspel opnieuw schreef:
   nieuwsticker, geluid aan/uit, delen, "minder beweging".
   Laden na tokens.js. Geen afhankelijkheden.
   ============================================================ */
(function (root) {
'use strict';

const REDUCED = typeof matchMedia === 'function' &&
                matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- nieuwsticker die echt voorbijschuift ----------
   ticker(el.querySelector('.tick-text'), ['Kop 1', 'Kop 2'])           */
function ticker(textEl, headlines, speed = 58){
  let i = 0;
  (function tick(){
    textEl.textContent = headlines[i++ % headlines.length];
    if (REDUCED || !textEl.animate){ setTimeout(tick, 7000); return; }
    const win = textEl.parentElement.clientWidth, txt = textEl.scrollWidth;
    if (!win){ setTimeout(tick, 1200); return; }        // ticker verborgen (kleine schermen)
    const a = textEl.animate(
      [{ transform: 'translateX(' + win + 'px)' }, { transform: 'translateX(' + (-txt) + 'px)' }],
      { duration: (win + txt) / speed * 1000, easing: 'linear' });
    a.onfinish = tick;
  })();
}

/* ---------- geluid aan/uit, onthouden per spel ----------
   const snd = muteButton(document.getElementById('mute'), 'mijnspel');
   if (snd.on) ...                                                       */
function muteButton(btn, game, defaultOn = true){
  const key = 'ttcw_sound_' + game;
  let on = defaultOn;
  try { const v = localStorage.getItem(key); if (v !== null) on = v === '1'; } catch (_){}
  const paint = () => { btn.classList.toggle('off', !on); btn.setAttribute('aria-pressed', String(!on));
                        btn.title = on ? 'Geluid uit' : 'Geluid aan'; };
  const api = {
    get on(){ return on; },
    set(v){ on = !!v; try { localStorage.setItem(key, on ? '1' : '0'); } catch (_){} paint(); }
  };
  btn.addEventListener('click', () => api.set(!on));
  paint();
  return api;
}

/* ---------- score delen in de clubgroep ---------- */
async function share(text){
  const full = text + ' ' + location.href;
  try {
    if (navigator.share) { await navigator.share({ text: full }); return 'shared'; }
    await navigator.clipboard.writeText(full);
    return 'copied';                     // toon zelf: "Gekopieerd! Plak maar in de clubgroep."
  } catch (_){ return 'cancelled'; }
}

/* ---------- getallen zoals een Belg ze leest: 12.345 ---------- */
const fmt = n => Math.round(n).toLocaleString('nl-BE');

/* ---------- korte trilling op Android (iOS negeert dit) ---------- */
const buzz = ms => { try { if (!REDUCED && navigator.vibrate) navigator.vibrate(ms); } catch (_){} };

const api = { REDUCED, ticker, muteButton, share, fmt, buzz };
root.TTCW = Object.assign(root.TTCW || {}, { ui: api });
if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
