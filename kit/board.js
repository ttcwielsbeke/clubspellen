/* ============================================================
   TTC Wielsbeke-Spotit — gedeelde erelijst voor nieuwe spellen
   Samengevoegd uit PIPS OUT! (lokaal + Supabase) en BALLENJAGER
   (vandaag / aller tijden op de klok van Brussel).

   Twee opslagplaatsen achter dezelfde deur:
     local    — localStorage, ieder op zijn eigen toestel
     supabase — één gedeelde ranglijst voor heel de club
   Er wordt altijd ook lokaal weggeschreven, zodat je eigen score
   niet verdwijnt als het net even niet meezit.

   Gebruik:
     const board = TTCWBoard.create({
       game: 'mijnspel',                  // ook de localStorage-sleutel
       provider: 'supabase', url, key,    // uit config.js
       table: 'scores_mijnspel',
       limit: 25,
       plausible: e => e.score <= 99999   // bovengrens tegen verzonnen scores
     });
     await board.top({ today: true })  → { rows, remote, offline }
     await board.submit('Jo', 1234, 7) → { entry, rank, offline } of null

   De tabel (SQL) staat in kit/STIJLGIDS.md onder "Erelijst".
   De bestaande vier spellen hebben elk hun eigen board.js; die
   blijven zoals ze zijn.
   ============================================================ */
(function (root) {
'use strict';

const TZ = 'Europe/Brussels';

/* ---------- namen: kort, zonder rommel ---------- */
function cleanName(raw){
  return String(raw || '')
    .split('').filter(c => c >= ' ').join('')   // stuurtekens eruit
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 16);
}

/* ---------- middernacht volgens Wielsbeke, niet volgens het toestel ---------- */
function offsetMs(d){
  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone: TZ, hour12: false,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  });
  const p = {};
  for (const deel of dtf.formatToParts(d)) p[deel.type] = deel.value;
  const alsUTC = Date.UTC(+p.year, +p.month - 1, +p.day,
                          p.hour === '24' ? 0 : +p.hour, +p.minute, +p.second);
  return alsUTC - d.getTime();
}
function dayStart(d){
  const nu = d || new Date();
  try {
    const off = offsetMs(nu);
    const klok = new Date(nu.getTime() + off);
    const mid = Date.UTC(klok.getUTCFullYear(), klok.getUTCMonth(), klok.getUTCDate());
    return mid - offsetMs(new Date(mid - off));   // de nacht van het uurverzet
  } catch (_){
    const l = new Date(nu); l.setHours(0, 0, 0, 0);
    return l.getTime();
  }
}
/* '2026-11-21' — de seed voor "iedereen speelt vandaag hetzelfde" */
function dayKey(d){
  try {
    return new Intl.DateTimeFormat('en-CA', {
      timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit'
    }).format(d || new Date());
  } catch (_){
    const l = d || new Date();
    return l.getFullYear() + '-' + String(l.getMonth() + 1).padStart(2, '0') +
           '-' + String(l.getDate()).padStart(2, '0');
  }
}

function create(cfg){
  cfg = cfg || {};
  const GAME  = cfg.game || 'spel';
  const LIMIT = cfg.limit || 25;
  const KEY   = 'ttcw_board_' + GAME;
  const KEEP  = 80;
  const ok    = e => Number.isFinite(e.score) && e.score >= 0 &&
                     (cfg.plausible ? cfg.plausible(e) : true);
  const useRemote = cfg.provider === 'supabase' && !!cfg.url && !!cfg.key;

  /* ---------- lokaal ---------- */
  function readLocal(){
    try {
      const rows = JSON.parse(localStorage.getItem(KEY));
      return Array.isArray(rows) ? rows.filter(r => r && ok(r)) : [];
    } catch (_){ return []; }
  }
  function writeLocal(rows){
    try { localStorage.setItem(KEY, JSON.stringify(rows.slice(0, KEEP))); }
    catch (_){ /* privémodus: dan maar niet */ }
  }
  function addLocal(e){
    const rows = readLocal(); rows.push(e);
    rows.sort((a, b) => b.score - a.score);
    writeLocal(rows);
  }

  /* ---------- enkel de beste score per naam ---------- */
  function bestPerName(rows, since){
    const seen = new Map();
    for (const r of rows){
      if (since && r.ts < since) continue;
      const k = cleanName(r.name).toLowerCase();
      if (!k) continue;
      if (!seen.has(k) || seen.get(k).score < r.score) seen.set(k, r);
    }
    return [...seen.values()].sort((a, b) => b.score - a.score).slice(0, LIMIT);
  }

  /* ---------- Supabase, via gewone REST (geen bibliotheek) ---------- */
  const rest = {
    url(q){ return String(cfg.url).replace(/\/+$/, '') + '/rest/v1/' + (cfg.table || 'scores') + (q || ''); },
    head(extra){
      return Object.assign({
        apikey: cfg.key, Authorization: 'Bearer ' + cfg.key, 'Content-Type': 'application/json'
      }, extra || {});
    },
    async top(since){
      const r = await fetch(this.url(
        '?select=name,score,level,ts&game=eq.' + encodeURIComponent(GAME) +
        (since ? '&ts=gte.' + since : '') +
        '&order=score.desc&limit=' + (LIMIT * 4)), { headers: this.head() });
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return bestPerName(await r.json());
    },
    async insert(e){
      const r = await fetch(this.url(), {
        method: 'POST', headers: this.head({ Prefer: 'return=minimal' }),
        body: JSON.stringify(Object.assign({ game: GAME }, e))
      });
      if (!r.ok) throw new Error('HTTP ' + r.status + ' ' + (await r.text()).slice(0, 120));
    }
  };

  return {
    isRemote: useRemote,
    cleanName, dayStart, dayKey,

    /* { rows, remote, offline } — offline: de gedeelde lijst was niet
       bereikbaar, dit is wat er op dit toestel staat. */
    async top(opts){
      const since = opts && opts.today ? dayStart() : 0;
      if (!useRemote) return { rows: bestPerName(readLocal(), since), remote: false, offline: false };
      try { return { rows: await rest.top(since), remote: true, offline: false }; }
      catch (_){ return { rows: bestPerName(readLocal(), since), remote: true, offline: true }; }
    },

    /* { entry, rank, offline } of null als de score niet kan kloppen */
    async submit(name, score, level){
      const e = { name: cleanName(name) || 'Anoniem', score: Math.round(score),
                  level: Math.round(level || 1), ts: Date.now() };
      if (!ok(e)) return null;
      addLocal(e);                         // altijd, ook als het versturen mislukt
      if (!useRemote){
        return { entry: e, rank: bestPerName(readLocal()).findIndex(r => r.ts === e.ts) + 1, offline: false };
      }
      try {
        await rest.insert(e);
        const rows = await rest.top();
        return { entry: e, rank: rows.findIndex(r => r.ts === e.ts) + 1, offline: false };
      } catch (_){
        return { entry: e, rank: 0, offline: true };
      }
    },

    clear(){ try { localStorage.removeItem(KEY); } catch (_){} }
  };
}

const TTCWBoard = { create, cleanName, dayStart, dayKey, TZ };
root.TTCWBoard = TTCWBoard;
if (typeof module !== 'undefined' && module.exports) module.exports = TTCWBoard;
})(typeof globalThis !== 'undefined' ? globalThis : this);
