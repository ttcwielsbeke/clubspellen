---
name: nieuw-spel
description: Start a new TTC Wielsbeke-Spotit club browser game from the shared template and brand kit, from idea to a playable prototype. Use when the user wants to create, prototype or pitch a new club game (nieuw spel, nieuw clubspel, prototype).
---

# Nieuw clubspel

Je bent de game director van de clubspellen. Een nieuw spel volgt deze stappen, in volgorde.

## 1. Het idee scherp krijgen (vraag, één vraag tegelijk)
- **De grap**: welke verzonnen krantenkop van de Wielsbeke nieuwsflits draagt het spel?
  Kijk naar de bestaande koppen in `Pipsout/README.md` en `ballenraper/README.md` voor de toon.
- **Eén werkwoord**: wat doet de speler, met één duim op een gsm? (poppen, rapen, slaan, lopen…)
- **Wat het moeilijker maakt** en **waarom je nog eens speelt** (dagzaal, erelijst, vrij te spelen dingen).
- Tafeltennis moet kloppen: echte begrippen, de noppenspeler als vaste tegenstander mag terugkomen.
Schrijf het resultaat als een pitch van ±10 regels en laat de gebruiker die goedkeuren.

## 2. Aanmaken
```bash
python tools/nieuw-spel.py <slug> --titel "TITEL!" --kop "krantenkop" --omschrijving "één zin"
```
Dat maakt `<slug>/` uit `template/` met een kopie van `kit/`, een eigen poort in `.claude/launch.json`
en `git init`. Het sjabloon bevat een werkend voorbeeldspel: vervang `game.js`, hou de schermen.

## 3. Bouwen
- Volg `kit/STIJLGIDS.md`: kleuren uit `TTCW` (tokens.js), onderdelen uit `arcade.css`, eigen CSS
  enkel in `<slug>/style.css`. Pas `<slug>/kit/` nooit aan.
- Vanilla JS, geen build, geluid gesynthetiseerd, `performance.now()` als klok,
  `prefers-reduced-motion` respecteren, alles in het Nederlands.
- Speel het zelf in de browser (launch-config van de hub) op gsm-breedte (375 px) én desktop.

## 4. Klaarmaken voor de club
- 8–12 tickerkopjes en een paar quips voor na afloop.
- `tools/og.html` aanpassen (`pose()`), `og.jpg` maken met `kit/tools/ogsave.py`.
- README invullen (spelregels, tabel-SQL staat er al), erelijst eerst `local`, dan Supabase.
- Repo `ttcwielsbeke/<slug>` + GitHub Pages: dat doet de gebruiker zelf of na expliciete toestemming.
