/* travis::iv — content. Every text has an English (en) and French (fr) version.
   media: add files under assets/media/ and list them here; a missing file shows a placeholder.
   Images: src is what the page shows; optional full is the file opened by "Open in full size". */
window.TRAVIS_DATA = {
  profile: {
    name: 'Mike Hatchi',
    role: {
      en: 'ML/DL & R&D engineer · distributed systems & confidential computing (FHE)',
      fr: 'Ingénieur ML/DL & R&D · systèmes distribués & calcul confidentiel (FHE)'
    },
    bio: {
      en: 'Mike is an ML/DL and R&D engineer. From 2020 to 2025 he ran VRONA, his own company, building machine learning models and decentralized apps in clear or encrypted contexts. Today he builds ØMYSTIK, an open-source FHE peer-to-peer mesh in Rust.',
      fr: 'Mike est ingénieur ML/DL et R&D. De 2020 à 2025, il a dirigé VRONA, sa propre société, qui développait des modèles de machine learning et des applications décentralisées, en clair ou chiffrées. Il construit aujourd\'hui ØMYSTIK, un maillage pair-à-pair FHE open source écrit en Rust.'
    },
    looking: {
      en: 'He is looking for a role as ML/Deep Learning or R&D engineer in distributed systems and confidential computing.',
      fr: 'Il recherche un poste d\'ingénieur ML/Deep Learning ou R&D en systèmes distribués et calcul confidentiel.'
    }
  },

  // Order of groups in the WORK section
  groups: [
    { id: 'lead', title: { en: 'Now', fr: 'Aujourd\'hui' }, projects: ['omystik'] },
    { id: 'sources', title: { en: 'The three sources of ØMYSTIK', fr: 'Les trois sources d\'ØMYSTIK' }, projects: ['fhe-irm', 'fhe-chess', 'mystik-p2p'] },
    { id: 'ml', title: { en: 'Machine & deep learning', fr: 'Machine & deep learning' }, projects: ['bot88', 'odetection', 'f1cars'] },
    { id: 'dist', title: { en: 'Decentralized systems', fr: 'Systèmes décentralisés' }, projects: ['metahackers', 'fhe-geomaze', 'slws'] },
    { id: 'earlier', title: { en: 'Earlier work', fr: 'Travaux antérieurs' }, projects: ['udacity', 'airfoil', 'goat-ga'] }
  ],

  // Top bar TECHNOLOGY (themes) and LANGUAGES: the projects each entry lists (Travis answers
  // with them). Built from each project's stack and tags below; edit freely.
  themes: [
    { label: { en: 'FHE', fr: 'FHE' }, projects: ['omystik', 'fhe-irm', 'fhe-chess', 'fhe-geomaze'] },
    // one entry: machine and deep learning apart made no sense (Mike, 2026-10-19)
    { label: { en: 'Machine & deep learning', fr: 'Machine & deep learning' }, projects: ['fhe-chess', 'bot88', 'odetection', 'udacity', 'f1cars', 'airfoil'] },
    { label: { en: 'Cryptography', fr: 'Cryptographie' }, projects: ['omystik', 'fhe-irm', 'fhe-chess', 'mystik-p2p', 'fhe-geomaze'] },
    { label: { en: 'Blockchain', fr: 'Blockchain' }, projects: ['fhe-irm', 'metahackers', 'fhe-geomaze', 'slws'] },
    { label: { en: 'P2P', fr: 'P2P' }, projects: ['omystik', 'mystik-p2p'] },
  ],
  // TypeScript: FHE.IRM's front-end (IRM.xyz) and the back-end of FHE.IRM and FHE.GeoMaze (FHEVMINT)
  languages: [
    { label: 'Rust', projects: ['omystik', 'mystik-p2p'] },
    { label: 'Python', projects: ['fhe-chess', 'bot88', 'odetection', 'goat-ga', 'udacity', 'f1cars', 'airfoil'] },
    { label: 'Solidity', projects: ['fhe-irm', 'metahackers', 'fhe-geomaze'] },
    { label: 'TypeScript', projects: ['fhe-irm', 'fhe-geomaze'] },
    { label: 'JavaScript', projects: ['fhe-irm', 'fhe-geomaze'] },
    { label: 'C#', projects: ['fhe-geomaze'] }
  ],

  projects: {
    'omystik': {
      title: 'ØMYSTIK',
      year: '2025 → now',
      pillars: ['ML', 'Distributed', 'Confidential'],
      stack: ['Rust', 'FHE', 'P2P', 'Threshold KMS'],
      pitch: {
        en: 'An open-source, non-profit peer-to-peer mesh where nodes compute on encrypted data (FHE).',
        fr: 'Un maillage pair-à-pair open source et à but non lucratif, où les nœuds calculent sur des données chiffrées (FHE).'
      },
      problem: {
        en: 'Sharing computation across machines usually means trusting each machine with your data in clear.',
        fr: 'Partager un calcul entre machines implique en général de leur confier ses données en clair.'
      },
      approach: {
        en: 'Three meshes: Mesh A for encrypted storage, Mesh B and C for encrypted computation with threshold key management. No blockchain component.',
        fr: 'Trois maillages : Mesh A pour le stockage chiffré, Mesh B et C pour le calcul chiffré avec une gestion de clés à seuil. Aucun composant blockchain.'
      },
      result: {
        en: 'Active development, written in Rust. Deep learning under FHE is on the roadmap.',
        fr: 'Développement actif, en Rust. Le deep learning sous FHE est sur la feuille de route.'
      },
      lineage: {
        en: 'Brings together FHE.IRM (encrypted compute + KMS), MYSTIK>p2p (encrypted storage) and FHE.Chess (deep learning under FHE).',
        fr: 'Réunit FHE.IRM (calcul chiffré + KMS), MYSTIK>p2p (stockage chiffré) et FHE.Chess (deep learning sous FHE).'
      },
      links: [
        { label: 'omystik.org', url: 'https://omystik.org' },
        { label: 'Lineage', url: 'https://omystik.org/docs/lineage/' }
      ],
      media: [
        { type: 'vimeo', id: '1235167920', caption: { en: 'OSATCON demo, 2026 (in French)', fr: 'Démo OSATCON, 2026 (en français)' } },
        { type: 'vimeo', id: '1127517075', caption: { en: 'Project intention: Confidential Compute × Intelligent Mesh, October 2025', fr: 'Intention du projet : Confidential Compute × Intelligent Mesh, octobre 2025' } }
      ],
      keywords: ['omystik', 'ØMYSTIK', 'mesh', 'maillage', 'p2p', 'peer', 'rust', 'kms', 'current', 'now', 'actuel', 'aujourd']
    },

    'fhe-irm': {
      title: 'FHE.IRM',
      year: '2024',   // Mike, 2026-10-19: not 2026
      pillars: ['Confidential', 'Distributed'],
      stack: ['Solidity', 'Zama fhEVM', 'React', 'fhevmjs'],
      pitch: {
        en: 'Intelligence Rights Management on encrypted data: need-to-know access where the system never sees the data in clear.',
        fr: 'Intelligence Rights Management sur données chiffrées : un accès au besoin d\'en connaître, sans que le système voie jamais les données en clair.'
      },
      problem: {
        en: 'Intelligence data must be shared across roles (Major, Officer, Operator) strictly on a need-to-know basis.',
        fr: 'Les données de renseignement doivent circuler entre rôles (Major, Officier, Opérateur) strictement selon le besoin d\'en connaître.'
      },
      approach: {
        en: 'Operations and missions are NFTs with role-based access. Sensitive fields are FHE ciphertexts on Zama\'s fhEVM; the secret activation code is checked homomorphically (TFHE.eq). Decryption goes through the Gateway, with results signed by the KMS. Files use hybrid encryption.',
        fr: 'Opérations et missions sont des NFT à accès par rôle. Les champs sensibles sont des chiffrés FHE sur le fhEVM de Zama ; le code secret d\'activation est vérifié de façon homomorphe (TFHE.eq). Le déchiffrement passe par la Gateway, avec des résultats signés par le KMS. Les fichiers utilisent un chiffrement hybride.'
      },
      result: {
        en: 'R&D prototype. Contracts and frontend were built separately and never integrated; some pages and the AES layer are unfinished.',
        fr: 'Prototype de R&D. Contrats et frontend ont été développés séparément sans être intégrés ; certaines pages et la couche AES sont inachevées.'
      },
      lineage: {
        en: 'Its encrypted-computation model and threshold key management now run in ØMYSTIK (Mesh B/C), over a P2P mesh instead of a blockchain.',
        fr: 'Son modèle de calcul chiffré et sa gestion de clés à seuil tournent aujourd\'hui dans ØMYSTIK (Mesh B/C), sur un maillage P2P plutôt qu\'une blockchain.'
      },
      links: [
        { label: 'Lineage', url: 'https://omystik.org/docs/lineage/' }
      ],
      media: [
        { type: 'image', src: 'assets/img/FHE.IRM_principle.png', caption: { en: 'The principle: intelligence sources (SigInt, GeoInt, HumInt) feed encrypted mission NFTs shared between HQ, officers and field operators', fr: 'Le principe : les sources de renseignement (SigInt, GeoInt, HumInt) alimentent des NFT de mission chiffrés, partagés entre le QG, les officiers et les opérateurs sur le terrain' } },
        { type: 'image', src: 'assets/img/web/FHE.IRM_Welcome_1.jpg', full: 'assets/img/FHE.IRM_Welcome_1.png', caption: { en: 'The DApp\'s welcome page', fr: 'La page d\'accueil de la DApp' } },
        { type: 'image', src: 'assets/img/web/FHE.IRM_WhatHow_2.jpg', full: 'assets/img/FHE.IRM_WhatHow_2.png', caption: { en: 'What/How: the Major, Officer and Operator roles', fr: 'What/How : les rôles de Major, Officier et Opérateur' } },
        { type: 'image', src: 'assets/img/web/FHE.IRM_Major_RightMgt_3.jpg', full: 'assets/img/FHE.IRM_Major_RightMgt_3.png', caption: { en: 'Major view: rights management (accreditation levels and ranking)', fr: 'Vue Major : gestion des droits (niveaux d\'accréditation et grades)' } },
        { type: 'image', src: 'assets/img/web/FHE.IRM_Major_OpMod_5.jpg', full: 'assets/img/FHE.IRM_Major_OpMod_5.png', caption: { en: 'Major view: operation details (activation code, units engaged, modifications)', fr: 'Vue Major : détails d\'une opération (code d\'activation, unités engagées, modifications)' } }
      ],
      keywords: ['irm', 'fhe.irm', 'rights', 'droits', 'intelligence', 'renseignement', 'fhevm', 'zama', 'solidity', 'nft', 'need-to-know']
    },

    'fhe-chess': {
      title: 'FHE.Chess',
      year: '2023',
      pillars: ['ML', 'Confidential'],
      stack: ['Python', 'FHE', 'Deep learning'],
      pitch: {
        en: 'Play chess against an AI opponent while every move stays encrypted with FHE.',
        fr: 'Jouer aux échecs contre une IA, chaque coup restant chiffré grâce au FHE.'
      },
      problem: {
        en: 'Can a model play, and decide, on data it never sees in clear?',
        fr: 'Un modèle peut-il jouer, et décider, sur des données qu\'il ne voit jamais en clair ?'
      },
      approach: {
        en: 'A chess AI whose inputs (the moves) are encrypted with fully homomorphic encryption.',
        fr: 'Une IA d\'échecs dont les entrées (les coups) sont chiffrées par chiffrement entièrement homomorphe.'
      },
      result: {
        en: 'Public repository; Mike\'s earliest work combining deep learning and FHE.',
        fr: 'Dépôt public ; le premier travail de Mike combinant deep learning et FHE.'
      },
      lineage: {
        en: 'Source of the "deep learning under FHE" line on the ØMYSTIK roadmap.',
        fr: 'À l\'origine de la ligne « deep learning sous FHE » de la feuille de route d\'ØMYSTIK.'
      },
      links: [{ label: 'GitHub', url: 'https://github.com/vrona/FHE.Chess' }],
      media: [
        { type: 'image', src: 'assets/media/fhe-chess-modes.png', caption: { en: 'The FHE.Chess app and its modes: human vs human, play White or Black against the AI, AI vs AI', fr: 'L\'application FHE.Chess et ses modes : humain contre humain, jouer les Blancs ou les Noirs contre l\'IA, IA contre IA' } }
      ],
      keywords: ['chess', 'échecs', 'echecs', 'fhe.chess']
    },

    'mystik-p2p': {
      title: 'MYSTIK>p2p',
      year: '2025',
      pillars: ['Distributed', 'Confidential'],
      stack: ['Rust', 'P2P', 'Encrypted storage'],
      pitch: {
        en: 'Encrypted peer-to-peer storage, now living inside ØMYSTIK as Mesh A.',
        fr: 'Stockage pair-à-pair chiffré, intégré aujourd\'hui à ØMYSTIK sous le nom de Mesh A.'
      },
      problem: { en: 'Store data across peers without any peer being able to read it.', fr: 'Stocker des données chez des pairs sans qu\'aucun ne puisse les lire.' },
      approach: { en: 'Encrypted storage distributed over a peer-to-peer network.', fr: 'Un stockage chiffré réparti sur un réseau pair-à-pair.' },
      result: { en: 'Public, as part of the ØMYSTIK repository.', fr: 'Public, au sein du dépôt ØMYSTIK.' },
      lineage: { en: 'Implemented as Mesh A in ØMYSTIK.', fr: 'Implémenté comme Mesh A dans ØMYSTIK.' },
      links: [{ label: 'GitHub', url: 'https://github.com/vrona/mystik_p2p' }, { label: 'ØMYSTIK on GitHub', url: 'https://omystik.org' }],
      media: [
        { type: 'vimeo', id: '1236501249', caption: { en: 'MYSTIK>p2p, March 2025', fr: 'MYSTIK>p2p, mars 2025' } }
      ],
      keywords: ['mystik', 'p2p storage', 'stockage', 'storage', 'mesh a']
    },

    'bot88': {
      title: 'BOT88',
      year: '2019',
      pillars: ['ML'],
      stack: ['Python', 'Keras', 'DDPG', 'Azure GPU'],
      pitch: {
        en: 'A self-driving racing agent that learns from raw vision alone, on a high-fidelity racing simulator.',
        fr: 'Un pilote autonome qui apprend à partir de la seule vision brute, sur un simulateur de course haute fidélité.'
      },
      problem: {
        en: 'Can an agent learn a racing line the way a driver does, from what it sees, with no lane or surface detection?',
        fr: 'Un agent peut-il apprendre une trajectoire comme un pilote, à partir de ce qu\'il voit, sans détection de voies ni de surface ?'
      },
      approach: {
        en: 'DDPG with an asymmetric actor-critic, driving a Porsche 911 GT3 R on the Catalunya circuit in Project CARS 2. Trained on an Azure GPU machine.',
        fr: 'DDPG avec un acteur-critique asymétrique, au volant d\'une Porsche 911 GT3 R sur le circuit de Catalunya dans Project CARS 2. Entraîné sur une machine GPU Azure.'
      },
      result: {
        en: 'Capstone of Udacity\'s Machine Learning Engineer nanodegree (MLE-ND), on a free subject. Mike set the bar very high, drawing on research papers for a solution of his own that mixes concepts, with a published write-up.',
        fr: 'Projet final du nanodegree Machine Learning Engineer d\'Udacity (MLE-ND), au sujet libre. Mike a placé la barre très haut, en s\'appuyant sur des articles de recherche pour une solution de sa conception qui mêle plusieurs concepts, avec une publication.'
      },
      lineage: null,
      links: [
        { label: 'GitHub', url: 'https://github.com/vrona/BOT88' },
        { label: 'Paper (PDF)', url: 'assets/media/bot88-paper.pdf' }
      ],
      media: [
        { type: 'vimeo', id: '1236671242', square: true, loop: true, caption: { en: 'Training of the DDPG agent driving a racing car in Project CARS 2', fr: 'Entraînement de l\'agent DDPG au volant d\'une voiture de course dans Project CARS 2' } },
        { type: 'pdf', src: 'assets/media/bot88-paper.pdf', caption: { en: 'Paper: Deep Reinforcement Learning Racing Track Agent', fr: 'Publication : Deep Reinforcement Learning Racing Track Agent' } }
      ],
      keywords: ['bot88', 'racing', 'course', 'self-driving', 'autonome', 'reinforcement', 'renforcement', 'ddpg', 'porsche', 'project cars', 'pilote']
    },

    'odetection': {
      title: 'ODetection',
      year: '2021',
      pillars: ['ML'],
      stack: ['Python', 'YOLOv5', 'Synthetic data', 'AWS'],
      pitch: {
        en: 'Spotting hazardous debris on a racing track with computer vision.',
        fr: 'Repérer les débris dangereux sur une piste de course par vision par ordinateur.'
      },
      problem: {
        en: 'Danger comes from objects out of the line of sight of marshals and drivers.',
        fr: 'Le danger vient des objets hors de vue des commissaires et des pilotes.'
      },
      approach: {
        en: 'YOLOv5 adapted to motorsport and trained on a custom synthetic dataset. Computed on AWS.',
        fr: 'YOLOv5 adapté au sport automobile et entraîné sur un jeu de données synthétique dédié. Calculs sur AWS.'
      },
      result: { en: 'Working detector on synthetic racing scenes.', fr: 'Détecteur fonctionnel sur des scènes de course synthétiques.' },
      lineage: null,
      links: [{ label: 'GitHub', url: 'https://github.com/vrona/ODetection' }],
      media: [
        { type: 'vimeo', id: '540742847', caption: { en: 'Motorsports debris detection, April 2021', fr: 'Détection de débris en sport automobile, avril 2021' } },
        { type: 'vimeo', id: '551375927', caption: { en: 'Debris detection on the 2020 Tuscan Grand Prix', fr: 'Détection de débris sur le Grand Prix de Toscane 2020' } }
      ],
      keywords: ['odetection', 'debris', 'débris', 'yolo', 'detection', 'détection', 'vision', 'synthetic', 'synthétique']
    },

    'goat-ga': {
      title: 'GOAT_GA',
      year: '2023',
      pillars: [],   // a Python app, no machine learning
      stack: ['Python'],
      pitch: {
        en: 'A Python app for warehouse logistics: it helps the activity manager (GA, "Gestionnaire Activité") dispatch order pickers between the warehouse\'s blocks.',
        fr: 'Une application Python pour la logistique d\'entrepôt : elle aide le gestionnaire d\'activité (GA) à répartir les préparateurs de commandes entre les blocs de l\'entrepôt.'
      },
      problem: {
        en: 'Knowing how many order pickers each block needs to reach the picking goal.',
        fr: 'Savoir combien de préparateurs chaque bloc demande pour atteindre l\'objectif de préparation.'
      },
      approach: {
        en: 'Python modules compute the pickers\' speeds and, from the gap between optimal and actual speed, the share of pickers each block needs.',
        fr: 'Des modules Python calculent la vitesse des préparateurs et, à partir de l\'écart entre vitesse optimale et vitesse réelle, la part de préparateurs nécessaire à chaque bloc.'
      },
      result: { en: 'Public repository.', fr: 'Dépôt public.' },
      lineage: null,
      links: [{ label: 'GitHub', url: 'https://github.com/vrona/GOAT_GA' }],
      media: [],
      keywords: ['goat', 'recommend', 'recommandation', 'task', 'tâche', 'warehouse', 'entrepot', 'entrepôt', 'logistics', 'logistique', 'picker', 'pickers', 'preparateur', 'préparateur', 'gestionnaire activite', 'gestionnaire activité']
    },

    'metahackers': {
      title: 'MetaHackers',
      year: '2023',
      pillars: ['Distributed'],
      stack: ['Solidity', 'Smart contracts', 'On-chain storage'],
      pitch: {
        en: 'Fully on-chain NFTs: image and metadata stored in the smart contract itself.',
        fr: 'Des NFT entièrement on-chain : image et métadonnées stockées dans le smart contract lui-même.'
      },
      problem: { en: 'Most NFTs depend on off-chain storage that can disappear.', fr: 'La plupart des NFT dépendent d\'un stockage hors chaîne qui peut disparaître.' },
      approach: { en: 'Image and metadata generated and stored entirely on-chain in Solidity.', fr: 'Image et métadonnées générées et stockées entièrement on-chain, en Solidity.' },
      result: { en: 'Public repository.', fr: 'Dépôt public.' },
      lineage: null,
      links: [{ label: 'GitHub', url: 'https://github.com/vrona/MetaHackers' }],
      media: [
        { type: 'image', src: 'assets/img/metahacker_test.svg', caption: { en: 'A test render of a MetaHacker card (SVG), with its "rain of code" background', fr: 'Un rendu de test d\'une carte MetaHacker (SVG), avec son fond « pluie de code »' } }
      ],
      keywords: ['metahackers', 'on-chain', 'onchain', 'nft', 'solidity', 'smart contract', 'blockchain']
    },

    // From vrona.io; year from Mike.
    'fhe-geomaze': {
      title: 'FHE.GeoMaze',
      year: '2024',
      pillars: ['Confidential', 'Distributed'],
      stack: ['Unity', 'C#', 'Solidity', 'Zama fhEVM', 'fhevmjs', 'Node.js'],
      pitch: {
        en: 'A Unity web3 demo game where some of the game states are computed while encrypted (FHE).',
        fr: 'Un jeu de démonstration web3 sous Unity, dont une partie des états de jeu est calculée en restant chiffrée (FHE).'
      },
      problem: {
        en: 'Can a web3 game use its game states while they stay encrypted?',
        fr: 'Un jeu web3 peut-il utiliser ses états de jeu pendant qu\'ils restent chiffrés ?'
      },
      approach: {
        en: 'A Unity client (C#) generates a maze shaped like a terrain, with a random mesh that changes at each launch. It talks over a socket to a JavaScript / Node.js backend using fhevmjs and Metamask. The game logic runs in Solidity smart contracts on Zama\'s fhEVM, deployed on devnet.zama.ai.',
        fr: 'Un client Unity (C#) génère un labyrinthe en forme de terrain, avec un maillage aléatoire qui change à chaque lancement. Il communique par socket avec un backend JavaScript / Node.js qui utilise fhevmjs et Metamask. La logique de jeu tourne dans des smart contracts Solidity sur le fhEVM de Zama, déployés sur devnet.zama.ai.'
      },
      result: {
        en: 'Demo game.',
        fr: 'Jeu de démonstration.'
      },
      lineage: null,
      links: [],
      media: [
        { type: 'vimeo', id: '1236503244', caption: { en: 'Game environment demo', fr: 'Démo de l\'environnement de jeu' } }
      ],
      keywords: ['geomaze', 'geo maze', 'maze', 'labyrinthe', 'unity', 'game', 'jeu', 'web3', 'fhevm']
    },

    // From vrona.io; year from Mike.
    'slws': {
      title: 'SLWS (aka \'Sir Lewis\')',
      year: '2021',
      pillars: ['Distributed'],
      stack: ['Ethereum', 'ERC-1155', 'OpenSea'],
      pitch: {
        en: 'The tokenization of \'Sir Lewis\', an artwork by Laïs, as an NFT on Ethereum.',
        fr: 'La tokenisation de « Sir Lewis », une œuvre de Laïs, en NFT sur Ethereum.'
      },
      problem: {
        en: 'Give an artwork a digital ownership on a public blockchain. The NFT covers the digital picture of the artwork, not the physical piece.',
        fr: 'Donner à une œuvre une propriété numérique sur une blockchain publique. Le NFT porte sur l\'image numérique de l\'œuvre, pas sur l\'œuvre physique.'
      },
      approach: {
        en: 'A collaboration between IIROW BC®, VRONA\'s blockchain division ("The Blockchain studio for Artists & Athletes"), and the artist Laïs: visual artist, character designer, illustrator and beatmaker, founder and designer of the Seigi Heroes brand. IIROW BC® handled the tokenization of the work, the content and the music production.',
        fr: 'Une collaboration entre IIROW BC®, la division blockchain de VRONA (« The Blockchain studio for Artists & Athletes »), et l\'artiste Laïs : artiste visuel, character designer, illustrateur et beatmaker, fondateur et designer de la marque Seigi Heroes. IIROW BC® a pris en charge la tokenisation de l\'œuvre, le contenu et la production musicale.'
      },
      result: {
        en: 'Minted via OpenSea as the NFT \'SLWS\' (ERC-1155, Ethereum). The artwork, \'Sir Lewis\', is a 75 × 109.7 cm drawing in black stone and charcoal of the Formula One record-breaker Lewis Hamilton.',
        fr: 'Minté via OpenSea sous le nom « SLWS » (ERC-1155, Ethereum). L\'œuvre, « Sir Lewis », est un dessin de 75 × 109,7 cm à la pierre noire et au fusain représentant Lewis Hamilton, recordman de la Formule 1.'
      },
      lineage: null,
      links: [],
      media: [
        { type: 'vimeo', id: '1236502212', caption: { en: 'SLWS (aka \'Sir Lewis\'), September 2021', fr: 'SLWS (« Sir Lewis »), septembre 2021' } }
      ],
      keywords: ['slws', 'sir lewis', 'lewis hamilton', 'hamilton', 'lais', 'iirow', 'opensea', 'art', 'oeuvre', 'artwork', 'tokenization', 'tokenisation']
    },

    'udacity': {
      title: 'Udacity nanodegrees',
      year: '2018 → 2019',
      pillars: ['ML'],
      stack: ['Python', 'Neural networks', 'Deep RL'],
      pitch: {
        en: 'AI Programming with Python (AIP-ND, 2018: neural networks and their maths), then Machine Learning Engineer (MLE-ND, 2019), whose capstone was BOT88.',
        fr: 'AI Programming with Python (AIP-ND, 2018 : les réseaux de neurones et leurs maths), puis Machine Learning Engineer (MLE-ND, 2019), dont le projet final fut BOT88.'
      },
      problem: { en: 'The foundations: neural networks, machine learning and deep reinforcement learning.', fr: 'Les bases : réseaux de neurones, machine learning et apprentissage par renforcement profond.' },
      approach: {
        en: 'Course projects, among them a quadcopter that learns to fly with deep RL, then a capstone on a free subject, BOT88, with the bar set very high: research papers and a solution of his own that mixes concepts.',
        fr: 'Des projets de cours, dont un quadricoptère qui apprend à voler par deep RL, puis un projet final au sujet libre, BOT88, avec la barre placée très haut : des articles de recherche et une solution de sa conception qui mêle plusieurs concepts.'
      },
      result: { en: 'Both nanodegrees completed.', fr: 'Les deux nanodegrees obtenus.' },
      lineage: null,
      links: [
        { label: 'AIP-ND', url: 'https://github.com/MikeHatchi/AIP-ND' },
        { label: 'Quadcopter', url: 'https://github.com/MikeHatchi/Quadcopter_Deep_RL_agent' },
        { label: 'Boston housing', url: 'https://github.com/MikeHatchi/boston_housing' },
        { label: 'Finding donors', url: 'https://github.com/MikeHatchi/finding_donors' },
        { label: 'Customer segments', url: 'https://github.com/MikeHatchi/customer_segments' },
        { label: 'Titanic survival', url: 'https://github.com/MikeHatchi/titanic_survival' },
        { label: 'Dog breeds', url: 'https://github.com/MikeHatchi/dog_breeds' },
        { label: 'Taxi-v2', url: 'https://github.com/MikeHatchi/OpenAI_gym_Taxi-v2' }
      ],
      media: [],
      keywords: ['udacity', 'nanodegree', 'aip-nd', 'mle-nd', 'quadcopter', 'quadricoptère', 'capstone']
    },

    'f1cars': {
      title: 'F1Cars',
      year: '2019',
      pillars: ['ML'],
      stack: ['Python', 'PyTorch', 'CNN'],
      pitch: { en: 'A CNN that classifies 2018 Formula 1 cars and drivers from images.', fr: 'Un CNN qui classe les voitures et pilotes de Formule 1 de 2018 à partir d\'images.' },
      problem: { en: 'The 2018 halo hides the helmet, the usual way to tell drivers apart.', fr: 'Le halo de 2018 masque le casque, habituellement utilisé pour distinguer les pilotes.' },
      approach: { en: 'Image dataset gathered from the web, convolutional network in PyTorch.', fr: 'Jeu d\'images collecté sur le web, réseau convolutif en PyTorch.' },
      result: { en: 'Public repository.', fr: 'Dépôt public.' },
      lineage: null,
      links: [{ label: 'GitHub', url: 'https://github.com/vrona/F1Cars' }],
      media: [
        { type: 'image', src: 'assets/img/F1_cars_2018.png', caption: { en: 'Samples of the 2018 Formula 1 car images gathered to train the classifier', fr: 'Échantillons des images de Formule 1 2018 réunies pour entraîner le classifieur' } }
      ],
      keywords: ['f1', 'formula', 'formule', 'cnn', 'classifier', 'classification']
    },

    'airfoil': {
      title: 'Airfoil-DNA',
      year: '2020',
      pillars: ['ML'],
      stack: ['Python', 'Jupyter'],
      pitch: { en: 'Extracting the "DNA" of 1,600 airfoils from the UIUC database.', fr: 'Extraire l\'« ADN » de 1 600 profils d\'aile de la base UIUC.' },
      problem: { en: 'Find the shared structure behind many airfoil shapes.', fr: 'Trouver la structure commune à de nombreuses formes de profils.' },
      approach: { en: 'Data analysis over the UIUC airfoil coordinates database.', fr: 'Analyse de données sur la base de coordonnées de profils UIUC.' },
      result: { en: 'Public repository.', fr: 'Dépôt public.' },
      lineage: null,
      links: [{ label: 'GitHub', url: 'https://github.com/vrona/Airfoil-DNA' }],
      media: [],
      keywords: ['airfoil', 'aile', 'profil', 'uiuc', 'aero']
    }
  },

  timeline: [
    { year: '2018', text: { en: 'Udacity nanodegree: AI Programming with Python.', fr: 'Nanodegree Udacity : AI Programming with Python.' }, project: 'udacity' },
    { year: '2019', text: { en: 'Machine learning: Udacity nanodegree, BOT88 deep RL racing agent.', fr: 'Machine learning : nanodegree Udacity, BOT88, pilote autonome en deep RL.' }, project: 'bot88' },
    { year: '2020', text: { en: 'COVID-19 pandemic: CORD-19, an NLP compiler of risk factors, in answer to a Kaggle research challenge.', fr: 'Pandémie de COVID-19 : CORD-19, un compilateur NLP des facteurs de risque, en réponse à un challenge de recherche Kaggle.' } },
    { year: '2020', text: { en: 'COVID-19 pandemic: contributes to EpidIA, an open-source app to help decide the end of the lockdown.', fr: 'Pandémie de COVID-19 : contribue à EpidIA, une application open source d\'aide à la décision pour la sortie du confinement.' } },
    { year: '2020', text: { en: 'Founds VRONA: ML models and decentralized apps, in clear or encrypted contexts.', fr: 'Fonde VRONA : modèles de ML et applications décentralisées, en clair ou chiffrées.' } },
    { year: '2021', text: { en: 'ODetection: computer vision for racing safety.', fr: 'ODetection : vision par ordinateur pour la sécurité en course.' }, project: 'odetection' },
    { year: '2021', text: { en: 'Creates IIROW-BC, VRONA\'s blockchain division.', fr: 'Création d\'IIROW-BC, la division blockchain de VRONA.' } },
    { year: '2021', text: { en: 'SLWS: the artwork "Sir Lewis" by Laïs, tokenized as an NFT.', fr: 'SLWS : l\'œuvre « Sir Lewis » de Laïs, tokenisée en NFT.' }, project: 'slws' },
    { year: '2022', text: { en: 'DApp: MetaHacker NFT, 100% on-chain, for the client Winsiders.', fr: 'DApp : MetaHacker NFT 100 % on-chain pour le client Winsiders.' } },
    { year: '2023', text: { en: 'Fully homomorphic encryption: FHE.Chess. On-chain systems: MetaHackers.', fr: 'Chiffrement entièrement homomorphe : FHE.Chess. Systèmes on-chain : MetaHackers.' }, project: 'fhe-chess' },
    { year: '2023', text: { en: 'GOAT_GA', fr: 'GOAT_GA' }, project: 'goat-ga' },
    { year: '2024', text: { en: 'FHE.IRM: rights management on encrypted data with Zama\'s fhEVM.', fr: 'FHE.IRM : gestion de droits sur données chiffrées avec le fhEVM de Zama.' }, project: 'fhe-irm' },
    { year: '2024', text: { en: 'FHE.GeoMaze: a web3 game whose states are computed while encrypted.', fr: 'FHE.GeoMaze : un jeu web3 dont les états sont calculés en restant chiffrés.' }, project: 'fhe-geomaze' },
    { year: '2024', text: { en: 'Algorithm design for the client Partikuls.', fr: 'Algorithmie pour le client Partikuls.' } },
    { year: '2025', text: { en: 'MYSTIK>p2p: encrypted peer-to-peer storage, later Mesh A of ØMYSTIK.', fr: 'MYSTIK>p2p : stockage pair-à-pair chiffré, devenu le Mesh A d\'ØMYSTIK.' }, project: 'mystik-p2p' },
    { year: '2025', text: { en: 'HR LLM agent for the client Partikuls.', fr: 'Agent LLM RH pour le client Partikuls.' } },
    { year: '2025', text: { en: 'VRONA closes. ØMYSTIK starts: FHE peer-to-peer mesh in Rust.', fr: 'Fermeture de VRONA. Début d\'ØMYSTIK : maillage pair-à-pair FHE en Rust.' }, project: 'omystik' },
    { year: '2026', text: { en: 'ØMYSTIK in active development.', fr: 'ØMYSTIK en développement actif.' }, project: 'omystik' }
  ]
};
