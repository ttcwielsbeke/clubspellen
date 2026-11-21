/* ============================================================
   {{TITEL}} — instellingen
   Het enige bestand dat je moet aanraken om de erelijst van
   dit-toestel-alleen naar heel-de-club om te schakelen.
   ============================================================ */
window.GAME_CONFIG = {

  leaderboard: {
    game: '{{SLUG}}',

    /* 'local'    = ieder zijn eigen lijst, op zijn eigen toestel.
       'supabase' = één gedeelde ranglijst voor heel de club.
       Begin met 'local'. Overschakelen: eerst de tabel aanmaken
       (SQL in README.md), dan 'supabase' zetten en pushen.         */
    provider: 'local',

    url: 'https://aqaikstibteqcdgxtuiw.supabase.co',     // hetzelfde clubproject als de andere spellen
    key: 'sb_publishable_yt1HRtTr-Z8WCiZv3_uCkQ_on2j5ZJ4', // publieke sleutel: hoort publiek te zijn
    table: 'scores_{{SLUG}}',

    limit: 25
  },

  /* Bovengrens tegen verzonnen scores. Hou ze gelijk met de SQL-policy. */
  maxScore: 1000000
};
