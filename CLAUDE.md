# CLAUDE.md — clubspellen TTC Wielsbeke-Spotit

Hub voor de browserspellen van tafeltennisclub TTC Wielsbeke-Spotit (Vlaanderen).
Lees eerst `kit/STIJLGIDS.md`: daar staan kleuren, toon, onderdelen, poorten en afspraken.

## Structuur
- `kit/` — de enige bron van de huisstijl. `template/` — sjabloon voor een nieuw spel.
- `Pipsout/`, `ballenraper/`, `smash/`, `tafeltennisrun/`, `noppenladder/` (spel 5, in opbouw) — **elk een eigen git-repo** (remote op
  github.com/ttcwielsbeke). Commit in de juiste repo; deze hub negeert die mappen.
- `ballenraper` = het spel BALLENJAGER (oude mapnaam, de Supabase-tabel heet nog `scores_ballenraper`).

## Regels
- Vanilla HTML/CSS/JS, geen build, geen npm-dependencies, geen frameworks. GitHub Pages serveert de repo zoals hij is.
- Alle tekst voor spelers en alle docs in het **Nederlands (Vlaams)**; code-commentaar ook.
- Geluid enkel gesynthetiseerd (Web Audio). Geen externe assets behalve Google Fonts (Press Start 2P).
- Een spel gebruikt de kit als **kopie** in `<spel>/kit/`. Nooit die kopie aanpassen: pas `kit/` aan
  en draai `python kit/tools/sync-kit.py <spel>`.
- De vier bestaande spellen gebruiken de kit (nog) niet; ze hebben hun eigen `style.css`/`board.js`.
  Niet ongevraagd migreren.
- Nieuw spel: `python tools/nieuw-spel.py <slug> --titel "TITEL!"` (of de skill `nieuw-spel`).
- Supabase anon/publishable key in `config.js` is bewust publiek; beveiliging zit in RLS-policies.
  Nooit een service_role key in een repo.
- Lokaal testen: `.claude/launch.json` van de hub (poorten 8120–8132, ogsave 8124).
- Tests waar ze bestaan: `node --test` (tafeltennisrun).
