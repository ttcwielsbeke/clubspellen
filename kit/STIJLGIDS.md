# Stijlgids — de clubspellen van TTC Wielsbeke-Spotit

Eén plek voor alles wat elk clubspel deelt. Open `kit/index.html` voor de visuele versie
(kleuren, letters, knoppen, logo's naast elkaar).

## 1. Wat een clubspel is

| regel | waarom |
|---|---|
| **Eén `index.html`, geen build, geen npm, geen assets van buiten** (behalve het lettertype) | wat in de repo staat, staat online; iedereen in de club kan het openen |
| **Gsm eerst**, staand, 460 px breed (runner: 620 px, volledig scherm) | gespeeld in de kantine en op de bus |
| **Alle geluid gesynthetiseerd** met Web Audio | geen `.mp3`, geen rechtenvragen |
| **Erelijst per spel** in hetzelfde Supabase-project, met lokale terugval | werkt ook zonder verbinding |
| **Dagzaal / dagbaan**: wie vandaag speelt, speelt hetzelfde (seed = datum, klok van Brussel) | eerlijke dagranking zonder server |
| Uitzondering: NOPPENVEGER heeft altijd willekeurige borden (een vast bord wordt een geheugenspel); 'vandaag' is daar een erelijst die elke dag leeg begint. | een vast bord laat je het spel uit het hoofd leren |
| **Nederlands (Vlaams)**, `lang="nl"`, `og:locale` `nl_BE` | het is een clubspel |

## 2. Toon: de Wielsbeke nieuwsflits

Elk spel begint als een **verzonnen krantenkop** over het bestuur, de jeugd of de noppen —
de grap van de Facebookpagina, maar dan echt.

- **Kicker**: `WIELSBEKE NIEUWSFLITS` · **kop**: serif, één zin, droog. *"Bestuur van TTC
  Wielsbeke-Spotit introduceert videogame die de politieke agenda van de club in de verf moet zetten."*
- **Spelnaam** in hoofdletters, vaak met `!`: PIPS OUT!, BALLENJAGER, ULTRA SMASH!, TAFELTENNISRUN.
- **Ticker** onderaan: 8–12 kopjes. Vaste figuren: het bestuur, de materiaalcommissie, de
  trainer, de jeugdspeler, de kantine, de noppenspeler, sponsor Spotit (mag zelfspot).
- **Quips** na afloop: kort, cursief, plagend maar nooit gemeen.
- Tafeltenniswoorden kloppen: noppen, rubber, blad, opslag, chopper, 3-sterren bal, ballenkar.
- Nooit echte leden belachelijk maken bij naam.

## 3. Kleuren

Twee lagen. De **clubkleuren** zijn het echte merk; het **arcadepalet** is de look van de spellen.

### Clubkleuren — uit het logo

| token | hex | gebruik |
|---|---|---|
| `--club-black` | `#111111` | het batje, clubshirt |
| `--club-red` | `#e30613` | streep 1 |
| `--club-green` | `#78be20` | streep 2 |
| `--club-blue` | `#0092d6` | streep 3 |

De drie strepen staan altijd in die volgorde (rood, groen, blauw) en lopen vol over de breedte.
⚠️ TAFELTENNISRUN tekent het shirt met `#fe0000 #b6ff00 #0094fe`; de logokleuren hierboven zijn de
juiste. Bij een volgende aanpassing aan dat spel gelijktrekken.

### Arcadepalet — de spellen

| token | hex | gebruik |
|---|---|---|
| `--ink` | `#02132b` | randen, harde schaduw, tekstschaduw |
| `--blue-deep` | `#062a56` | buitenrand achtergrond |
| `--blue` | `#0b3a75` | hoofdkleur, `theme-color` |
| `--blue-mid` | `#1a5ca8` | gloed in het midden |
| `--blue-lt` | `#2f7fd4` | invoer, actieve randen |
| `--chrome` | `#9ed4ff` | kaders rond HUD, speelveld, knoppen |
| `--red` | `#c8242a` | hoofdknop, spelnaam regel 1, hartjes, de noppenspeler |
| `--red-dark` | `#8d1519` | onderrand rode knop |
| `--gold` | `#ffd23f` | spelnaam regel 2, score, titels, "jij" |
| `--green` | `#5ed13f` | tijdbalk vol (dan `--warn` `#ffb400`, dan `--crit` `#e03026`) |
| `--orange` | `#ff8a1f` | vuur, bonus |
| `--flash` | `#e8634a` | label NIEUWSFLITS, streep onder de kop |

**Spelobjecten** (in `tokens.js`, `TTCW.world`): witte bal `#f4f4f4`, oranje 3-sterren bal `#ef7d18`,
tafel `#1f4fa3`, parket `#c7652c`, lijnen `#f5e9c8`. De **noppenspeler** (rood shirt, rode noppen)
is de vaste tegenstander van het clubuniversum: hergebruik hem.

### Sponsor

Spotit-navy `#00203a` en -turkoois `#18b0be` zijn **gemeten** uit `sponsor/spotit.png`. Vraag
de officiële waarden aan de sponsor voor je ze ergens groot gebruikt.

## 4. Letters

- **Press Start 2P** (Google Fonts) voor alles in het spel. Kleine maten: 7–11 px voor tekst,
  15 px cijfers in de HUD, 19 px titels, 30 px spelnaam. Altijd met harde schaduw (`3px 3px 0`).
- **Georgia / serif** enkel voor de krantenkop van de nieuwsflits.
- Op canvas: `TTCW.font`. Wacht op het lettertype (`document.fonts.load`) vóór je tekst tekent.

## 5. Onderdelen (kit/arcade.css)

| klasse | wat |
|---|---|
| `#app` › `#hud` › `.hudbox` | de bovenbalk: blauwe chroomvakjes |
| `.digits`, `.bar` › `.bar-fill(.warn/.crit)`, `.hearts` › `.heart(.gone)` | score, tijd, levens |
| `#stage` › `#game` | het speelveld met stralen en vignet |
| `.overlay` | schermen over het speelveld (titel, einde, erelijst) |
| `.poster-kicker`, `.poster-head`, `.logo` › `span`, `.tagline` | het titelscherm |
| `.btn`, `.btn.ghost`, `.btn.small`, `.btnrow` | rode hoofdknop, blauwe tweede knop |
| `.namerow`, `.board`, `.tabs` › `.tab.on` | naam ingeven, erelijst, vandaag / aller tijden |
| `#ticker` | de nieuwsflits onderaan |
| `.clubline` › `.club`, `.sponsor` | clublogo + hoofdsponsor op het titelscherm |
| `#mute` | geluid aan/uit, rechtsboven |

Regels: **één rode knop per scherm** (de hoofdactie), de rest ghost. Elke knop minstens 32 px hoog.

## 6. Logo's en sponsor

| bestand | wanneer |
|---|---|
| `logo/clublogo.png` | het echte clublogo (636×368). Titelscherm, og-kaart, muur in de hal. Altijd op wit. |
| `logo/ttc-bat.svg` | vierkant, vector, zonder lettertype. Favicon, GitHub-avatar, kleine maten. |
| `logo/ttc-bat-512.png` | hetzelfde als PNG, klaar om te uploaden. |
| `sponsor/spotit.png` | hoofdsponsor (426×118). Altijd op wit, met het woord "hoofdsponsor". |

**Sponsorregel**: elk spel toont het clublogo en Spotit op het titelscherm (`.clubline`) en mag
Spotit in de wereld zelf verwerken (bord aan de muur, shirt). Het logo nooit vervormen, verkleuren
of op een drukke achtergrond zetten. Een grap over de sponsor mag, het logo zelf blijft netjes.

## 7. Link-preview (og.jpg)

1200×630 JPEG, gemaakt uit het **echte spel** (`tools/og.html` in elk spel), nooit nagetekend.
Indeling: het spel links in een chroomkader, de spelnaam rechts (rood + goud), clublogo eronder,
de drie clubstrepen onderaan. Opslaan met `python ../kit/tools/ogsave.py`, gestart **vanuit de map van het spel** (poort 8124, schrijft enkel `og.jpg` in die map).

## 8. Techniek en afspraken

| afspraak | waarde |
|---|---|
| url | `https://ttcwielsbeke.github.io/<slug>/` (GitHub Pages, `main`, `/`) |
| repo | `github.com/ttcwielsbeke/<slug>`, met `.nojekyll` |
| localStorage | `ttcw_<wat>_<slug>` per spel (`ttcw_board_<slug>`, `ttcw_sound_<slug>`, `ttcw_tips_<slug>`, `ttcw_secret_<slug>`), `ttcw_<wat>` gedeeld (`ttcw_name`). Kies de sleutel vóór de eerste publieke versie: hernoemen wist de lokale gegevens van spelers |
| Supabase | project `aqaikstibteqcdgxtuiw`, tabel `scores_<slug>` met kolom `game`, enkel select + insert voor anon |
| tijdzone | `Europe/Brussels` voor dagseed en "vandaag" |
| spelklok | `performance.now()`, niet de rAF-tijdstempel |
| minder beweging | `prefers-reduced-motion` respecteren: geen ticker-animatie, geen schudden |

### Poorten (lokaal)

| poort | wat |
|---|---|
| 8120 | de hub (deze stijlgids: <http://localhost:8120/kit/>) |
| 8123 | PIPS OUT! |
| 8124 | `ogsave.py` |
| 8130 | BALLENJAGER |
| 8131 | ULTRA SMASH! |
| 8132 | TAFELTENNISRUN |
| 8134 | NOPPENVEGER |
| 8135+ | nieuwe spellen (`tools/nieuw-spel.py` kiest de volgende vrije) |

## 9. De kit gebruiken

Elk nieuw spel krijgt een **kopie** van de kit in `kit/` (geen link naar een gedeelde url):

```bash
python kit/tools/sync-kit.py <slug>          # kit bijwerken in één spel
python kit/tools/sync-kit.py --check --all   # welke spellen hebben een oude kit?
```

Waarom een kopie: een spel dat online staat, verandert nooit zonder dat iemand het pusht; het
werkt offline en lokaal; en elk spel kan op zijn eigen tempo meegaan met een nieuwe kit.
