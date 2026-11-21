# Clubspellen — TTC Wielsbeke-Spotit

De hub van alle videospellen van de club: de gedeelde huisstijl, het sjabloon voor een
nieuw spel, en de spellen zelf (elk in een eigen repo).

```
TTC Wielsbeke games/            ← deze hub (voorstel: eigen repo ttcwielsbeke/clubspellen)
├── kit/                        ← DE huisstijl: kleuren, letters, knoppen, erelijst, logo's, sponsor
│   ├── STIJLGIDS.md            ←   de regels, in woorden
│   ├── index.html              ←   de regels, om te zien (http://localhost:8120/kit/)
│   ├── tokens.css · tokens.js  ←   kleuren voor CSS en voor canvas
│   ├── arcade.css · ttcw.js    ←   gedeelde onderdelen en helpers
│   ├── board.js                ←   gedeelde erelijst (lokaal + Supabase, vandaag/aller tijden)
│   ├── logo/ · sponsor/        ←   clublogo, batje (svg/png), Spotit
│   └── tools/                  ←   sync-kit.py, ogsave.py
├── template/                   ← startpunt voor een nieuw spel (werkend voorbeeldspel)
├── tools/nieuw-spel.py         ← maakt een nieuw spel uit template/ + kit/
├── .claude/                    ← launch.json voor alle spellen, skill "nieuw-spel"
│
├── Pipsout/         ← repo ttcwielsbeke/pipsout          PIPS OUT!         :8123
├── ballenraper/     ← repo ttcwielsbeke/ballenraper      BALLENJAGER       :8130
├── smash/           ← repo ttcwielsbeke/smash            ULTRA SMASH!      :8131
├── tafeltennisrun/  ← repo ttcwielsbeke/tafeltennisrun   TAFELTENNISRUN    :8132
└── noppenladder/    ← spel 5, in opbouw
```

De spelmappen zijn **eigen git-repo's** en worden door deze hub genegeerd (`.gitignore`).

## Een nieuw spel

```bash
python tools/nieuw-spel.py servicekoning --titel "SERVICEKONING!"
```

Dat kopieert `template/`, zet de kit erin, kiest een vrije poort en doet `git init`.
Daarna: maak `github.com/ttcwielsbeke/<slug>` aan, push, en zet Pages aan.
Bestaat de map al (zoals `noppenladder/`), voeg dan `--bestaande-map` toe: er wordt niets overschreven.

## De huisstijl aanpassen

1. Pas `kit/` aan (en `kit/index.html` als het iets zichtbaars is).
2. `python kit/tools/sync-kit.py --check --all` toont welke spellen een oude kopie hebben.
3. `python kit/tools/sync-kit.py <slug>` per spel, testen, committen en pushen in dat spel.

## Lokaal spelen

```bash
python -m http.server 8120
```

Stijlgids op <http://localhost:8120/kit/>, een spel op <http://localhost:8120/Pipsout/> enz.
(De poorten per spel staan in `.claude/launch.json` en in de stijlgids.)
