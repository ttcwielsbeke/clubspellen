# CLAUDE.md — clubspellen TTC Wielsbeke-Spotit

Hub voor de browserspellen van tafeltennisclub TTC Wielsbeke-Spotit (Vlaanderen).
Lees eerst `kit/STIJLGIDS.md`: daar staan kleuren, toon, onderdelen, poorten en afspraken.

## Structuur
- `kit/` — de enige bron van de huisstijl. `template/` — sjabloon voor een nieuw spel.
- `Pipsout/`, `ballenjager/`, `smash/`, `tafeltennisrun/`, `noppenladder/` (spel 5, in opbouw), `noppenveger/` (spel 6, live) — **elk een eigen git-repo** (remote op
  github.com/ttcwielsbeke). Commit in de juiste repo; deze hub negeert die mappen.
- BALLENJAGER heette eerst BALLENRAPER (een speler vond die naam niet ok). Intern blijft de oude naam: Supabase-tabel `scores_ballenraper`, `game: 'ballenraper'` in config.js en de localStorage-sleutels. Niet hernoemen, anders zijn de scores weg. `ttcwielsbeke.github.io/ballenraper/` is een doorverwijzing (repo `ttcwielsbeke/ballenraper`), mag weg vanaf maart 2027.

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
