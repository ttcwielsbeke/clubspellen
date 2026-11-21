# {{TITEL}} — TTC Wielsbeke-Spotit

> *"{{KRANTENKOP}}"*
> — Wielsbeke nieuwsflits

{{OMSCHRIJVING}}

## Spelen

Open `index.html`, of speel online op <https://ttcwielsbeke.github.io/{{SLUG}}/>.

- …

## Technisch

Geen build, geen dependencies, geen server. Alle geluid is gesynthetiseerd.

| bestand | inhoud |
|---|---|
| `index.html` | HUD, schermen, ticker, og-tags |
| `style.css` | enkel wat eigen is aan dit spel |
| `game.js` | het spel |
| `config.js` | erelijst-instellingen |
| `kit/` | **kopie** van de clubhuisstijl — niet hier aanpassen, zie onder |
| `og.jpg` | 1200×630 kaart voor de link-preview |
| `tools/og.html` | maakt `og.jpg` opnieuw uit het echte spel |

### De kit

`kit/` is een kopie van de gedeelde huisstijl (kleuren, knoppen, erelijst, logo's, sponsor) uit
de map `kit/` van de clubspellen-hub. Een aanpassing aan de huisstijl gebeurt dáár, en wordt
daarna overgezet met:

```bash
python ../kit/tools/sync-kit.py {{SLUG}}
```

## Lokaal draaien

```bash
python -m http.server {{POORT}}
```

Dan naar <http://localhost:{{POORT}}>.

## Hosten op GitHub Pages

Repo: <https://github.com/ttcwielsbeke/{{SLUG}}>. Eenmalig: **Settings → Pages → Deploy from a
branch → `main` / `/ (root)`**. Elke `git push` naar `main` is meteen een release.

## Erelijst (Supabase)

Zolang `config.js` op `provider: 'local'` staat, blijft de lijst op het toestel. Overschakelen:
plak dit in de SQL Editor van het clubproject, zet `provider: 'supabase'` en push.

```sql
create table public.scores_{{SLUG}} (
  id         bigint generated always as identity primary key,
  game       text        not null default '{{SLUG}}',
  name       text        not null,
  score      bigint      not null,
  level      integer     not null default 1,
  ts         bigint      not null,
  created_at timestamptz not null default now()
);
create index on public.scores_{{SLUG}} (score desc);
alter table public.scores_{{SLUG}} enable row level security;

create policy "ranglijst lezen" on public.scores_{{SLUG}} for select to anon using (true);
create policy "score toevoegen" on public.scores_{{SLUG}} for insert to anon with check (
  game = '{{SLUG}}'
  and char_length(btrim(name)) between 1 and 16
  and score between 0 and 1000000          -- gelijk houden met maxScore in config.js
);
```

Bewust **geen** update- of delete-policy.

## Op de clubwebsite zetten

| veld | waarde |
|---|---|
| titel | {{TITEL}} |
| omschrijving | {{OMSCHRIJVING}} |
| afbeelding | `https://ttcwielsbeke.github.io/{{SLUG}}/og.jpg` (1200×630) |
| link | `https://ttcwielsbeke.github.io/{{SLUG}}/` |
