/* ============================================================
   {{TITEL}} — het spel
   Dit is een werkend voorbeeldspelletje ("tik de balletjes")
   dat laat zien hoe de kit in elkaar hangt: canvas met de
   clubkleuren, HUD, hartjes, geluid, erelijst, ticker, delen.
   Vervang de spellogica; hou de schermen en de lijm.
   ============================================================ */
(() => {
'use strict';

const C   = TTCW.c, W0 = TTCW.world, UI = TTCW.ui;
const CFG = window.GAME_CONFIG;
const $   = id => document.getElementById(id);

const cv = $('game'), ctx = cv.getContext('2d');
const W = cv.width, H = cv.height;

const board = TTCWBoard.create(Object.assign({}, CFG.leaderboard, {
  plausible: e => e.score <= CFG.maxScore
}));
const sound = UI.muteButton($('mute'), CFG.leaderboard.game);

/* ---------- kopjes voor de nieuwsticker: de clubhumor ---------- */
UI.ticker($('tickText'), [
  'Bestuur lanceert nieuw videospel. Kantine vreest voor de omzet.',
  'Jeugdspeler tikt 400 balletjes in één training. Trainer sprakeloos.',
  'Sponsor Spotit vraagt zich af waarin het precies geïnvesteerd heeft.'
]);

/* ---------- geluid: alles gesynthetiseerd, geen .mp3 ---------- */
let ac = null;
function pok(freq = 880, dur = .06){
  if (!sound.on) return;
  try {
    ac = ac || new (window.AudioContext || window.webkitAudioContext)();
    const o = ac.createOscillator(), g = ac.createGain(), t = ac.currentTime;
    o.type = 'triangle'; o.frequency.setValueAtTime(freq, t);
    o.frequency.exponentialRampToValueAtTime(freq / 2, t + dur);
    g.gain.setValueAtTime(.25, t); g.gain.exponentialRampToValueAtTime(.001, t + dur);
    o.connect(g).connect(ac.destination); o.start(t); o.stop(t + dur);
  } catch (_){}
}

/* ---------- spelstaat ---------- */
let S = null;
const ROUND = 30;   // seconden

function fresh(){
  return { score: 0, lives: 3, time: ROUND, balls: [], spawn: 0, running: true, last: performance.now() };
}
function spawnBall(){
  const gold = Math.random() < .08;
  S.balls.push({ x: 30 + Math.random() * (W - 60), y: -20, r: gold ? 15 : 18,
                 vy: 90 + Math.random() * 60 + (ROUND - S.time) * 4, gold });
}

/* ---------- tekenen: parketvloer, tafel, balletjes ---------- */
function draw(){
  ctx.fillStyle = W0.floor; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = W0.floorDark;
  for (let x = 0; x < W; x += 40) ctx.fillRect(x, 0, 2, H);
  ctx.fillStyle = W0.table; ctx.fillRect(0, H - 60, W, 60);
  ctx.fillStyle = W0.floorLine; ctx.fillRect(0, H - 60, W, 4); ctx.fillRect(W / 2 - 2, H - 60, 4, 60);
  TTCW.stripes(ctx, 0, H - 14, W, 3, 1);

  for (const b of S ? S.balls : []){
    ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
    ctx.fillStyle = b.gold ? C.gold : W0.ball; ctx.fill();
    ctx.lineWidth = 3; ctx.strokeStyle = C.outline; ctx.stroke();
  }
}

/* ---------- lus op de wandklok, niet op de rAF-tijd (zie BALLENJAGER) ---------- */
function loop(){
  if (!S || !S.running) return;
  // ruime grens: een trage gsm of preview mag niet in slow motion lopen,
  // maar na een tabwissel springt de klok ook niet in één keer naar het einde
  const now = performance.now(), dt = Math.min(.25, (now - S.last) / 1000); S.last = now;

  S.time -= dt; S.spawn -= dt;
  if (S.spawn <= 0){ spawnBall(); S.spawn = Math.max(.35, .9 - (ROUND - S.time) * .015); }
  for (const b of S.balls) b.y += b.vy * dt;
  const dropped = S.balls.filter(b => b.y - b.r > H - 60 && !b.gold).length;
  S.balls = S.balls.filter(b => b.y - b.r <= H - 60);
  if (dropped){ loseLife(); }

  hud(); draw();
  if (S.time <= 0 || S.lives <= 0) return over();
  requestAnimationFrame(loop);
}

function hit(x, y){
  if (!S || !S.running) return;
  const i = S.balls.findIndex(b => Math.hypot(b.x - x, b.y - y) < b.r + 10);
  if (i < 0) return;
  const b = S.balls.splice(i, 1)[0];
  S.score += b.gold ? 50 : 10;
  if (b.gold) S.time = Math.min(ROUND, S.time + 3);
  pok(b.gold ? 1320 : 880);
  $('score').classList.remove('bump'); void $('score').offsetWidth; $('score').classList.add('bump');
}

function loseLife(){
  S.lives--; pok(160, .2); UI.buzz(60);
  const h = $('hearts').children[S.lives];
  if (h){ h.classList.add('losing', 'gone'); }
}

function hud(){
  $('score').textContent = UI.fmt(S.score);
  const f = $('timebar'), p = Math.max(0, S.time / ROUND);
  f.style.width = (p * 100) + '%';
  f.classList.toggle('warn', p < .4 && p >= .2); f.classList.toggle('crit', p < .2);
}

/* ---------- schermen ---------- */
function show(id){
  for (const s of document.querySelectorAll('.overlay')) s.classList.toggle('hidden', s.id !== id);
}
function start(){
  S = fresh(); show(null);
  for (const h of $('hearts').children) h.classList.remove('gone', 'losing');
  document.body.classList.add('spelen');
  requestAnimationFrame(loop);
}
function over(){
  S.running = false; document.body.classList.remove('spelen');
  $('final').textContent = UI.fmt(S.score);
  $('quip').textContent = S.score > 400 ? 'De trainer knikt. Dat is veel.' : 'In de kantine wordt al gegniffeld.';
  $('noted').classList.add('hidden'); $('nameForm').classList.remove('hidden');
  try { $('playerName').value = localStorage.getItem('ttcw_name') || ''; } catch (_){}
  show('screen-over');
}

async function showBoard(today = true){
  for (const t of document.querySelectorAll('.tab')){
    const on = (t.dataset.today === '1') === today;
    t.classList.toggle('on', on); t.setAttribute('aria-selected', String(on));
  }
  show('screen-board');
  const ol = $('board'); ol.innerHTML = '<li class="leeg">laden…</li>';
  const { rows, offline } = await board.top({ today });
  ol.innerHTML = '';
  if (!rows.length) ol.innerHTML = '<li class="leeg">nog niemand — jij eerst?</li>';
  rows.forEach((r, i) => {
    const li = document.createElement('li');
    li.innerHTML = '<span class="rk">' + (i + 1) + '</span><span class="nm"></span><span class="sc"></span>';
    li.querySelector('.nm').textContent = r.name;          // namen nooit als HTML
    li.querySelector('.sc').textContent = UI.fmt(r.score);
    ol.appendChild(li);
  });
  if (offline) ol.insertAdjacentHTML('beforeend', '<li class="leeg">geen verbinding: lijst van dit toestel</li>');
}

$('btnStart').onclick = start;
$('btnAgain').onclick = start;
$('btnBoard').onclick = () => showBoard(true);
$('btnBack').onclick  = () => show(S && !S.running ? 'screen-over' : 'screen-title');
for (const t of document.querySelectorAll('.tab')) t.onclick = () => showBoard(t.dataset.today === '1');
$('btnShare').onclick = async () => {
  const r = await UI.share('Ik haalde ' + UI.fmt(S.score) + ' punten in {{TITEL}}, het videospel van TTC Wielsbeke-Spotit.');
  if (r === 'copied') alert('Gekopieerd! Plak maar in de clubgroep.');
};
$('nameForm').onsubmit = async e => {
  e.preventDefault();
  const name = $('playerName').value;
  try { localStorage.setItem('ttcw_name', board.cleanName(name)); } catch (_){}
  const res = await board.submit(name, S.score, 1);
  $('nameForm').classList.add('hidden');
  $('noted').classList.remove('hidden');
  $('noted').textContent = !res ? 'Die score kan niet kloppen.'
    : res.offline ? 'Bewaard op dit toestel (geen verbinding).'
    : res.rank ? 'Nummer ' + res.rank + ' van de club!' : 'Genoteerd.';
  refreshBest();
};

const pt = e => { const r = cv.getBoundingClientRect();
                  return [(e.clientX - r.left) * W / r.width, (e.clientY - r.top) * H / r.height]; };
cv.addEventListener('pointerdown', e => hit(...pt(e)));
cv.addEventListener('pointermove', e => { if (e.buttons) hit(...pt(e)); });

async function refreshBest(){
  const { rows } = await board.top();
  $('best').textContent = rows.length ? UI.fmt(rows[0].score) + ' — ' + rows[0].name : '—';
}

draw(); refreshBest(); show('screen-title');
window.__GAME = { get state(){ return S; } };   // handig om te testen in de console
})();
