import { CategoryItem, GameItem } from '@/types/catalog';

export const MOCK_CATEGORIES: CategoryItem[] = [
  {
    "id": 1,
    "name": "Acción",
    "slug": "accion",
    "icon_name": "Sword"
  },
  {
    "id": 2,
    "name": "RPG",
    "slug": "rpg",
    "icon_name": "Shield"
  },
  {
    "id": 3,
    "name": "Aventura",
    "slug": "aventura",
    "icon_name": "Compass"
  },
  {
    "id": 4,
    "name": "Estrategia",
    "slug": "estrategia",
    "icon_name": "Brain"
  },
  {
    "id": 5,
    "name": "Indie",
    "slug": "indie",
    "icon_name": "Sparkles"
  },
  {
    "id": 6,
    "name": "Terror",
    "slug": "terror",
    "icon_name": "Ghost"
  },
  {
    "id": 7,
    "name": "Carreras",
    "slug": "carreras",
    "icon_name": "Car"
  },
  {
    "id": 8,
    "name": "Deportes",
    "slug": "deportes",
    "icon_name": "Trophy"
  }
];

export const MOCK_GAMES: GameItem[] = [
  {
    "id": 1,
    "title": "Neon Odyssey: Cyber Genesis",
    "slug": "neon-odyssey",
    "description": "Sumérgete en un futuro distópico dominado por mega-corporaciones e inteligencias artificiales rebeldes. Forja tu propio destino con implantes cibernéticos de combate.",
    "short_description": "Un RPG de acción cyberpunk con combates vertiginosos y narrativa ramificada.",
    "cover_image_url": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1091500/header.jpg",
    "banner_image_url": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1091500/capsule_616x353.jpg",
    "trailer_url": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    "developer": "ViniStudios",
    "publisher": "ViniGames Publishing",
    "release_date": "2026-03-15",
    "base_price": 120,
    "discount_percent": 25,
    "final_price": 90,
    "rating_avg": 4.9,
    "rating_count": 342,
    "age_rating": "18+",
    "is_featured": true,
    "is_active": true,
    "categories": []
  },
  {
    "id": 2,
    "title": "Shadows of Eldoria",
    "slug": "shadows-of-eldoria",
    "description": "Explora un vasto reino en ruinas poblado por criaturas míticas y dioses caídos. Domina el arte de la esgrima arcana y desentraña los secretos del Eclipse Eterno.",
    "short_description": "Aventura de fantasía oscura épica con mundo abierto desafiante.",
    "cover_image_url": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1245620/header.jpg",
    "banner_image_url": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1245620/capsule_616x353.jpg",
    "trailer_url": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    "developer": "Mythic Forge",
    "publisher": "Arcane Interactive",
    "release_date": "2025-11-20",
    "base_price": 150,
    "discount_percent": 15,
    "final_price": 127.5,
    "rating_avg": 4.8,
    "rating_count": 512,
    "age_rating": "16+",
    "is_featured": true,
    "is_active": true,
    "categories": []
  },
  {
    "id": 3,
    "title": "Hollow Abyss: Remnants",
    "slug": "hollow-abyss-remnants",
    "description": "Un metroidvania 2D dibujado a mano donde descenderás a cavernas olvidadas habitadas por insectos guerreros y vestigios de una civilización perdida.",
    "short_description": "Metroidvania de atmósfera melancólica y combate de precisión.",
    "cover_image_url": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/367520/header.jpg",
    "banner_image_url": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/367520/capsule_616x353.jpg",
    "trailer_url": null,
    "developer": "Team Velvet",
    "publisher": "Velvet Arts",
    "release_date": "2025-08-10",
    "base_price": 45,
    "discount_percent": 0,
    "final_price": 45,
    "rating_avg": 4.95,
    "rating_count": 1204,
    "age_rating": "10+",
    "is_featured": false,
    "is_active": true,
    "categories": []
  },
  {
    "id": 4,
    "title": "Vortex Apex",
    "slug": "vortex-apex",
    "description": "Carreras antigravitatorias a velocidades hipersónicas a través de pistas suspendidas sobre megalópolis flotantes con bandas sonoras synthwave.",
    "short_description": "Carreras antigravedad futuristas a más de 1000 km/h.",
    "cover_image_url": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1551360/header.jpg",
    "banner_image_url": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1551360/capsule_616x353.jpg",
    "trailer_url": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    "developer": "HyperDrive Studio",
    "publisher": "NextGen Motors",
    "release_date": "2026-01-28",
    "base_price": 70,
    "discount_percent": 30,
    "final_price": 49,
    "rating_avg": 4.4,
    "rating_count": 180,
    "age_rating": "Everyone",
    "is_featured": false,
    "is_active": true,
    "categories": []
  },
  {
    "id": 5,
    "title": "Elysium Legends",
    "slug": "elysium-legends",
    "description": "Explora un mundo de leyenda, forja alianzas y combate en calabozos ancestrales para salvar al reino de Elysium.",
    "short_description": "Aventura épica de rol y combate mágico.",
    "cover_image_url": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1086940/header.jpg",
    "banner_image_url": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1086940/capsule_616x353.jpg",
    "trailer_url": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    "developer": "Celestial Games",
    "publisher": "ViniGames Publishing",
    "release_date": "2026-02-10",
    "base_price": 119,
    "discount_percent": 10,
    "final_price": 107.1,
    "rating_avg": 4.7,
    "rating_count": 450,
    "age_rating": "+13",
    "is_featured": true,
    "is_active": true,
    "categories": []
  },
  {
    "id": 11,
    "title": "Cyber Pulse 2088",
    "slug": "cyber-pulse-2088",
    "description": "Hackea implantes cibernéticos, pilota drones de combate y domina el bajo mundo de Neo-Santa Cruz en un shooter RPG vertiginoso.",
    "short_description": "Shooter táctico cyberpunk en primera persona con pirateo neuronal.",
    "cover_image_url": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1091500/header.jpg",
    "banner_image_url": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1091500/capsule_616x353.jpg",
    "trailer_url": "https://www.youtube.com/watch?v=8X2kIfS6fb8",
    "developer": "ViniStudios Cyber",
    "publisher": "ViniGames Publishing",
    "release_date": "2026-04-10",
    "base_price": 130,
    "discount_percent": 30,
    "final_price": 91,
    "rating_avg": 4.8,
    "rating_count": 512,
    "age_rating": "18+",
    "is_featured": true,
    "is_active": true,
    "categories": [
      {
        "id": 1,
        "name": "Acción",
        "slug": "accion"
      },
      {
        "id": 8,
        "name": "Deportes",
        "slug": "deportes"
      }
    ]
  },
  {
    "id": 12,
    "title": "Chronos of the Forgotten Realm",
    "slug": "chronos-forgotten-realm",
    "description": "Controla el flujo del tiempo para resolver acertijos milenarios y derrotar a los guardianes del reloj cósmico en este RPG de acción.",
    "short_description": "RPG de acción y manipulación temporal con combates fluidos.",
    "cover_image_url": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1086940/header.jpg",
    "banner_image_url": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1086940/capsule_616x353.jpg",
    "trailer_url": null,
    "developer": "TimeLock Interactive",
    "publisher": "ViniGames Publishing",
    "release_date": "2026-02-18",
    "base_price": 110,
    "discount_percent": 15,
    "final_price": 93.5,
    "rating_avg": 4.7,
    "rating_count": 284,
    "age_rating": "12+",
    "is_featured": true,
    "is_active": true,
    "categories": [
      {
        "id": 2,
        "name": "RPG",
        "slug": "rpg"
      },
      {
        "id": 3,
        "name": "Aventura",
        "slug": "aventura"
      }
    ]
  },
  {
    "id": 13,
    "title": "Aethelgard: The Broken Crown",
    "slug": "aethelgard-broken-crown",
    "description": "Un RPG souls-like brutal ambientado en un imperio nórdico en decadencia. Enfréntate a colosos ancestrales con un sistema de parry milimétrico.",
    "short_description": "Souls-like de fantasía nórdica implacable y combates de alta precisión.",
    "cover_image_url": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1245620/header.jpg",
    "banner_image_url": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1245620/capsule_616x353.jpg",
    "trailer_url": null,
    "developer": "Valkyrie Blade Studio",
    "publisher": "NorthGate Games",
    "release_date": "2025-11-20",
    "base_price": 160,
    "discount_percent": 25,
    "final_price": 120,
    "rating_avg": 4.9,
    "rating_count": 670,
    "age_rating": "18+",
    "is_featured": true,
    "is_active": true,
    "categories": [
      {
        "id": 1,
        "name": "Acción",
        "slug": "accion"
      },
      {
        "id": 2,
        "name": "RPG",
        "slug": "rpg"
      }
    ]
  },
  {
    "id": 14,
    "title": "Solaris: Deep Horizon",
    "slug": "solaris-deep-horizon",
    "description": "Simulador de exploración espacial y minería en asteroides. Construye estaciones orbitales y defiende tus cargueros de piratas interestelares.",
    "short_description": "Simulación y supervivencia espacial en un universo procedural infinito.",
    "cover_image_url": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1716740/header.jpg",
    "banner_image_url": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1716740/capsule_616x353.jpg",
    "trailer_url": null,
    "developer": "AstroCorp Sim",
    "publisher": "Cosmic Frontier",
    "release_date": "2026-03-01",
    "base_price": 145,
    "discount_percent": 20,
    "final_price": 116,
    "rating_avg": 4.6,
    "rating_count": 310,
    "age_rating": "Everyone",
    "is_featured": false,
    "is_active": true,
    "categories": [
      {
        "id": 6,
        "name": "Terror",
        "slug": "terror"
      },
      {
        "id": 8,
        "name": "Deportes",
        "slug": "deportes"
      }
    ]
  },
  {
    "id": 15,
    "title": "Silent Whisper: Whispering Woods",
    "slug": "silent-whisper-whispering-woods",
    "description": "Survival horror psicológico en primera persona. Sobrevive en un bosque embrujado utilizando solo tu linterna y una grabadora de audio misteriosa.",
    "short_description": "Terror psicológico inmersivo donde el sonido es tu única guía de supervivencia.",
    "cover_image_url": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2050650/header.jpg",
    "banner_image_url": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2050650/capsule_616x353.jpg",
    "trailer_url": null,
    "developer": "Gothic Soul",
    "publisher": "DarkRealm Entertainment",
    "release_date": "2025-12-05",
    "base_price": 85,
    "discount_percent": 40,
    "final_price": 51,
    "rating_avg": 4.5,
    "rating_count": 195,
    "age_rating": "18+",
    "is_featured": false,
    "is_active": true,
    "categories": [
      {
        "id": 5,
        "name": "Indie",
        "slug": "indie"
      },
      {
        "id": 1,
        "name": "Acción",
        "slug": "accion"
      }
    ]
  },
  {
    "id": 16,
    "title": "Apex Rally 2026",
    "slug": "apex-rally-2026",
    "description": "Simulador definitivo de rally todoterreno con física de neumáticos hiperrealista, clima dinámico en tiempo real y más de 80 etapas internacionales.",
    "short_description": "El simulador de rally más exigente con física y telemetría profesional.",
    "cover_image_url": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1849250/header.jpg",
    "banner_image_url": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1849250/capsule_616x353.jpg",
    "trailer_url": null,
    "developer": "Torque Dynamics",
    "publisher": "Speed Motorsport",
    "release_date": "2026-01-10",
    "base_price": 140,
    "discount_percent": 20,
    "final_price": 112,
    "rating_avg": 4.8,
    "rating_count": 360,
    "age_rating": "Everyone",
    "is_featured": false,
    "is_active": true,
    "categories": [
      {
        "id": 7,
        "name": "Carreras",
        "slug": "carreras"
      }
    ]
  },
  {
    "id": 17,
    "title": "Kingdoms of Iron & Magic",
    "slug": "kingdoms-of-iron-and-magic",
    "description": "Construye tu propio imperio medieval fantástico, comanda ejércitos masivos en asedios en tiempo real y forja alianzas en un mapa persistente.",
    "short_description": "Estrategia en tiempo real con asedios épicos y gestión de reinos.",
    "cover_image_url": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/813780/header.jpg",
    "banner_image_url": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/813780/capsule_616x353.jpg",
    "trailer_url": null,
    "developer": "Crown & Blade Games",
    "publisher": "Iron Gate Global",
    "release_date": "2025-07-22",
    "base_price": 95,
    "discount_percent": 15,
    "final_price": 80.75,
    "rating_avg": 4.7,
    "rating_count": 450,
    "age_rating": "12+",
    "is_featured": false,
    "is_active": true,
    "categories": [
      {
        "id": 6,
        "name": "Terror",
        "slug": "terror"
      },
      {
        "id": 2,
        "name": "RPG",
        "slug": "rpg"
      }
    ]
  },
  {
    "id": 18,
    "title": "Valkyrie: Echoes of Valhalla",
    "slug": "valkyrie-echoes-valhalla",
    "description": "Comanda a las valquirias en batallas tácticas por turnos en el Yggdrasil. Desbloquea runas de poder ancestral y evita el Ragnarök.",
    "short_description": "Estrategia táctica nórdica con combates por turnos e invocación rúnica.",
    "cover_image_url": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2358720/header.jpg",
    "banner_image_url": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2358720/capsule_616x353.jpg",
    "trailer_url": null,
    "developer": "Nordic Mythos",
    "publisher": "ViniGames Publishing",
    "release_date": "2026-05-15",
    "base_price": 115,
    "discount_percent": 10,
    "final_price": 103.5,
    "rating_avg": 4.9,
    "rating_count": 420,
    "age_rating": "12+",
    "is_featured": true,
    "is_active": true,
    "categories": [
      {
        "id": 2,
        "name": "RPG",
        "slug": "rpg"
      },
      {
        "id": 6,
        "name": "Terror",
        "slug": "terror"
      }
    ]
  },
  {
    "id": 19,
    "title": "Grand Theft Auto VI",
    "slug": "grand-theft-auto-vi",
    "description": "Explora el estado de Leonida y las calles iluminadas por neón de Vice City en la experiencia de mundo abierto más inmersiva, ambiciosa y detallada jamás creada por Rockstar Games.",
    "short_description": "El regreso a Vice City con una revolucionaria narrativa criminal en mundo abierto.",
    "cover_image_url": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/271590/header.jpg",
    "banner_image_url": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/271590/capsule_616x353.jpg",
    "trailer_url": "https://www.youtube.com/watch?v=QdBZY2fkU-0",
    "developer": "Rockstar North",
    "publisher": "Rockstar Games",
    "release_date": "2026-11-15",
    "base_price": 350,
    "discount_percent": 10,
    "final_price": 315,
    "rating_avg": 5,
    "rating_count": 14200,
    "age_rating": "18+",
    "is_featured": true,
    "is_active": true,
    "categories": [
      {
        "id": 1,
        "name": "Acción",
        "slug": "accion"
      },
      {
        "id": 3,
        "name": "Aventura",
        "slug": "aventura"
      }
    ]
  },
  {
    "id": 20,
    "title": "Doom: The Dark Ages",
    "slug": "doom-the-dark-ages",
    "description": "La precuela cinematográfica de los aclamados DOOM (2016) y DOOM Eternal. Conviértete en el arma definitiva de dioses y reyes en una sangrienta guerra oscura medieval demoníaca.",
    "short_description": "Combate visceral de fantasía oscura medieval con el legendario Doom Slayer.",
    "cover_image_url": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/3017860/header.jpg",
    "banner_image_url": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/3017860/capsule_616x353.jpg",
    "trailer_url": "https://www.youtube.com/watch?v=4TRe5k_758M",
    "developer": "id Software",
    "publisher": "Bethesda Softworks",
    "release_date": "2026-07-06",
    "base_price": 280,
    "discount_percent": 15,
    "final_price": 238,
    "rating_avg": 4.9,
    "rating_count": 5800,
    "age_rating": "18+",
    "is_featured": true,
    "is_active": true,
    "categories": [
      {
        "id": 1,
        "name": "Acción",
        "slug": "accion"
      },
      {
        "id": 5,
        "name": "Indie",
        "slug": "indie"
      }
    ]
  },
  {
    "id": 21,
    "title": "Marvel's Wolverine",
    "slug": "marvels-wolverine",
    "description": "Desata las garras de adamantium en una aventura de acción visceral protagonizada por Logan. Combate brutal, regeneración en tiempo real y una apasionante trama madura.",
    "short_description": "Acción salvaje y descarnada con el mutante más temido de los X-Men.",
    "cover_image_url": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1817070/header.jpg",
    "banner_image_url": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1817070/capsule_616x353.jpg",
    "trailer_url": null,
    "developer": "Insomniac Games",
    "publisher": "PlayStation Publishing",
    "release_date": "2026-09-20",
    "base_price": 310,
    "discount_percent": 20,
    "final_price": 248,
    "rating_avg": 4.9,
    "rating_count": 4900,
    "age_rating": "18+",
    "is_featured": true,
    "is_active": true,
    "categories": [
      {
        "id": 1,
        "name": "Acción",
        "slug": "accion"
      },
      {
        "id": 3,
        "name": "Aventura",
        "slug": "aventura"
      }
    ]
  },
  {
    "id": 22,
    "title": "Forza Horizon 6: Nippon Express",
    "slug": "forza-horizon-6-nippon",
    "description": "Conduce por carreteras de montaña, autopistas de Tokio y santuarios tradicionales en el festival automovilístico Horizon más impresionante de la historia.",
    "short_description": "El festival de carreras definitivo llega a los espectaculares biomas de Japón.",
    "cover_image_url": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1551360/header.jpg",
    "banner_image_url": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1551360/capsule_616x353.jpg",
    "trailer_url": null,
    "developer": "Playground Games",
    "publisher": "Xbox Game Studios",
    "release_date": "2026-05-19",
    "base_price": 290,
    "discount_percent": 25,
    "final_price": 217.5,
    "rating_avg": 4.9,
    "rating_count": 6200,
    "age_rating": "Everyone",
    "is_featured": true,
    "is_active": true,
    "categories": [
      {
        "id": 7,
        "name": "Carreras",
        "slug": "carreras"
      }
    ]
  },
  {
    "id": 23,
    "title": "Gears of War: E-Day",
    "slug": "gears-of-war-e-day",
    "description": "Revive el día cero de la invasión Locust junto a Marcus Fenix y Dominic Santiago en una sobrecogedora experiencia desarrollada en Unreal Engine 5.",
    "short_description": "El origen del horror Locust. La guerra por la supervivencia de la humanidad.",
    "cover_image_url": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/553850/header.jpg",
    "banner_image_url": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/553850/capsule_616x353.jpg",
    "trailer_url": null,
    "developer": "The Coalition",
    "publisher": "Xbox Game Studios",
    "release_date": "2026-10-12",
    "base_price": 275,
    "discount_percent": 15,
    "final_price": 233.75,
    "rating_avg": 4.8,
    "rating_count": 3800,
    "age_rating": "18+",
    "is_featured": true,
    "is_active": true,
    "categories": [
      {
        "id": 1,
        "name": "Acción",
        "slug": "accion"
      },
      {
        "id": 8,
        "name": "Deportes",
        "slug": "deportes"
      }
    ]
  },
  {
    "id": 24,
    "title": "Mina the Hollower",
    "slug": "mina-the-hollower",
    "description": "Una joya indie inspirada en las aventuras góticas de 8 bits de Game Boy Color. Excava bajo tierra y azota a monstruos eldritch en la maldita isla de Tenebrous.",
    "short_description": "Aventura gótica de acción 8-bits de los creadores de Shovel Knight.",
    "cover_image_url": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1875580/header.jpg",
    "banner_image_url": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1875580/capsule_616x353.jpg",
    "trailer_url": null,
    "developer": "Yacht Club Games",
    "publisher": "Yacht Club Games",
    "release_date": "2026-05-29",
    "base_price": 105,
    "discount_percent": 20,
    "final_price": 84,
    "rating_avg": 4.9,
    "rating_count": 2100,
    "age_rating": "10+",
    "is_featured": false,
    "is_active": true,
    "categories": [
      {
        "id": 4,
        "name": "Estrategia",
        "slug": "estrategia"
      },
      {
        "id": 3,
        "name": "Aventura",
        "slug": "aventura"
      }
    ]
  },
  {
    "id": 25,
    "title": "Resident Evil Requiem",
    "slug": "resident-evil-requiem",
    "description": "El nuevo capítulo de survival horror que redefine el terror en tercera persona. Adéntrate en un complejo biotecnológico subterráneo infestado de aberraciones genéticas.",
    "short_description": "Terror y supervivencia implacable con atmósfera claustrofóbica fotorrealista.",
    "cover_image_url": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2050650/header.jpg",
    "banner_image_url": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2050650/capsule_616x353.jpg",
    "trailer_url": null,
    "developer": "Capcom Dev 1",
    "publisher": "Capcom",
    "release_date": "2026-08-14",
    "base_price": 290,
    "discount_percent": 20,
    "final_price": 232,
    "rating_avg": 4.8,
    "rating_count": 4100,
    "age_rating": "18+",
    "is_featured": true,
    "is_active": true,
    "categories": [
      {
        "id": 5,
        "name": "Indie",
        "slug": "indie"
      },
      {
        "id": 1,
        "name": "Acción",
        "slug": "accion"
      }
    ]
  },
  {
    "id": 26,
    "title": "Fable: Albion Reborn",
    "slug": "fable-albion-reborn",
    "description": "Un nuevo comienzo para la legendaria franquicia británica. ¿Qué significa ser un héroe? En un mundo lleno de magia, humor ácido y consecuencias morales, cada elección transforma tu leyenda.",
    "short_description": "RPG de acción épico con humor británico y elecciones morales que cambian el mundo.",
    "cover_image_url": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1086940/header.jpg",
    "banner_image_url": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1086940/capsule_616x353.jpg",
    "trailer_url": null,
    "developer": "Playground Games",
    "publisher": "Xbox Game Studios",
    "release_date": "2026-10-30",
    "base_price": 310,
    "discount_percent": 15,
    "final_price": 263.5,
    "rating_avg": 4.7,
    "rating_count": 3200,
    "age_rating": "16+",
    "is_featured": true,
    "is_active": true,
    "categories": [
      {
        "id": 2,
        "name": "RPG",
        "slug": "rpg"
      },
      {
        "id": 3,
        "name": "Aventura",
        "slug": "aventura"
      }
    ]
  }
];
