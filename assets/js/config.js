/* travis::iv — site configuration. Edit this file, nothing else needs to change. */
window.TRAVIS_CONFIG = {
  // Contact (top bar + Travis's answers). Leave empty to hide a link.
  contact: {
    email: '',                 // e.g. 'you@example.com' (not shown in the top bar)
    github: 'https://github.com/MikeHatchi',
    linkedin: 'https://www.linkedin.com/in/michaeljohnhatchi/',
    // Discord profile of "travis.iv" (account id 734775961542852701): visitors can
    // message or add Mike from there
    discord: 'https://discord.com/users/734775961542852701'
  },

  // Live model behind Travis: the URL of the Cloudflare Worker in worker/
  // (e.g. 'https://travis-iv.<your-subdomain>.workers.dev'), printed by `wrangler deploy`.
  // null = Travis runs in local mode: he answers from data.js and reads GitHub live.
  // He also falls back to local mode whenever the Worker fails or is slow.
  agentEndpoint: 'https://travis-iv.mikehatchi.workers.dev',
  // How long the chat waits for Travis's verified answer: the Worker's RESPONSE_WINDOW_MS plus a margin
  agentTimeoutMs: 33000,

  // News: generated file first (GitHub Action, later), then live GitHub commits.
  newsFile: 'data/news.json',
  newsRepos: ['omystik/omystik', 'omystik/kms'],
  newsCount: 3,

  // Repos Travis can read live when asked "what's new in …".
  // key = how visitors may name it, value = owner/repo on GitHub.
  liveRepos: {
    'omystik': 'omystik/omystik',
    'ømystik': 'omystik/omystik',
    'kms': 'omystik/kms',
    'fhe.chess': 'vrona/FHE.Chess',
    'fhe chess': 'vrona/FHE.Chess',
    'bot88': 'vrona/BOT88',
    'odetection': 'vrona/ODetection',
    'metahackers': 'vrona/MetaHackers',
    'goat': 'vrona/GOAT_GA'
  }
};
