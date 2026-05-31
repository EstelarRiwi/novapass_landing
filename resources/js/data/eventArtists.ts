export interface Artist {
  name: string
  role: string
  photo?: string
}

// Artist photos:
// - Real artists: Wikipedia Commons thumbnails
// - Fictional people: randomuser.me stable portraits (same number = same face)
// - Groups/logos: placehold.co colored tiles

const WP = 'https://upload.wikimedia.org/wikipedia/commons/thumb'

const PHOTOS: Record<string, string> = {
  // Real artists
  'Karol G':         `${WP}/c/cb/2023-11-16_Gala_de_los_Latin_Grammy%2C_15.jpg/330px-2023-11-16_Gala_de_los_Latin_Grammy%2C_15.jpg`,
  'Feid':            `${WP}/1/13/Feid_image_3.jpg/330px-Feid_image_3.jpg`,
  'J Balvin':        `${WP}/0/0c/J_Balvin%2C_Noisey_Meets%3B_Oct_2018.jpg/330px-J_Balvin%2C_Noisey_Meets%3B_Oct_2018.jpg`,
  'Bad Bunny':       `${WP}/b/b1/Bad_Bunny_2019_by_Glenn_Francis_%28cropped%29.jpg/330px-Bad_Bunny_2019_by_Glenn_Francis_%28cropped%29.jpg`,
  'Blessd':          `${WP}/f/f7/Blessd_en_Premios_Nuestra_Tierra_2022.jpg/330px-Blessd_en_Premios_Nuestra_Tierra_2022.jpg`,
  'Maluma':          `${WP}/9/9a/2023-11-16_Gala_de_los_Latin_Grammy%2C_20_%28Maluma%29.jpg/330px-2023-11-16_Gala_de_los_Latin_Grammy%2C_20_%28Maluma%29.jpg`,
  'Ed Sheeran':      `${WP}/c/c1/Ed_Sheeran-6886_%28cropped%29.jpg/330px-Ed_Sheeran-6886_%28cropped%29.jpg`,
  'Martin Garrix':   `${WP}/7/74/Martin_Garrix_%40_Web_Summit_2017.jpg/330px-Martin_Garrix_%40_Web_Summit_2017.jpg`,
  'Armin van Buuren':`${WP}/9/90/Armin_van_Buuren%2C_November_2025_%28cropped%29.jpg/330px-Armin_van_Buuren%2C_November_2025_%28cropped%29.jpg`,
  'David Guetta':    `${WP}/4/4f/2023-11-16_Gala_de_los_Latin_Grammy%2C_22_%28David_Guetta%29.jpg/330px-2023-11-16_Gala_de_los_Latin_Grammy%2C_22_%28David_Guetta%29.jpg`,
  'Hardwell':        `${WP}/a/a7/Hardwell_2018_%28cropped%29.jpg/330px-Hardwell_2018_%28cropped%29.jpg`,
  'Jhay Cortez':     'https://randomuser.me/api/portraits/men/75.jpg',

  // Fictional individuals (randomuser.me — stable per number)
  'Andrés Torres':         'https://randomuser.me/api/portraits/men/61.jpg',
  'Valentina Cruz':        'https://randomuser.me/api/portraits/women/44.jpg',
  'Carlos Mendoza':        'https://randomuser.me/api/portraits/men/9.jpg',
  'Dir. Roberto Vélez':    'https://randomuser.me/api/portraits/men/5.jpg',
  'Miguel Ángel Rivera':   'https://randomuser.me/api/portraits/men/34.jpg',
  'Laura Jiménez':         'https://randomuser.me/api/portraits/women/68.jpg',
  'Carmen Herrera':        'https://randomuser.me/api/portraits/women/77.jpg',
  'Diego Morales':         'https://randomuser.me/api/portraits/men/47.jpg',
  'Santiago López Trio':   'https://randomuser.me/api/portraits/men/21.jpg',
  'María Camila Reyes':    'https://randomuser.me/api/portraits/women/55.jpg',
  'James Peterson':        'https://randomuser.me/api/portraits/men/18.jpg',
  'Ana Rodríguez':         'https://randomuser.me/api/portraits/women/64.jpg',
  'Luis Herrera':          'https://randomuser.me/api/portraits/men/36.jpg',
  'Sarah Chen':            'https://randomuser.me/api/portraits/women/95.jpg',
  'Nico Gómez':            'https://randomuser.me/api/portraits/men/33.jpg',

  // Groups — colored logo tiles
  'Grupo Flamenco Andaluz': 'https://placehold.co/200x200/7C1D1D/fde8c8?text=GFA&font=playfair-display',
  'Blackworks':             'https://placehold.co/200x200/0f0720/9333ea?text=BW&font=montserrat',
  'Hamlet Cast':            'https://placehold.co/200x200/1c1917/f5f0eb?text=◈&font=playfair-display',
}

const EVENT_ARTISTS: Record<string, Artist[]> = {
  // Karol G — Mañana Será Bonito Fest
  'evnt-karolg-2026-00000000000014': [
    { name: 'Karol G',   role: 'Artista Principal' },
    { name: 'Feid',      role: 'Invitado Especial' },
    { name: 'J Balvin',  role: 'Invitado Especial' },
  ],

  // Feid — FERXXO World Tour
  'evnt-feid-2026-0000000000000010': [
    { name: 'Feid',   role: 'Artista Principal' },
    { name: 'Blessd', role: 'Telonero' },
  ],

  // Blessd — El Bendito Tour
  'evnt-blessd-2026-000000000000011': [
    { name: 'Blessd',  role: 'Artista Principal' },
    { name: 'Maluma',  role: 'Invitado Especial' },
  ],

  // Ed Sheeran — Mathematics Tour
  'evnt-edsheeran-2026-000000000000012': [
    { name: 'Ed Sheeran', role: 'Artista Principal' },
  ],

  // Tomorrowland Colombia 2026
  'evnt-tomorrow-2026-0000000000000013': [
    { name: 'Martin Garrix',    role: 'Headliner' },
    { name: 'Armin van Buuren', role: 'Headliner' },
    { name: 'David Guetta',     role: 'Headliner' },
    { name: 'Hardwell',         role: 'Artista' },
  ],

  // Bad Bunny — Most Wanted Tour
  'evnt-badbunny-2026-00000000000000016': [
    { name: 'Bad Bunny',   role: 'Artista Principal' },
    { name: 'Jhay Cortez', role: 'Invitado Especial' },
  ],

  // Festival Estelar 2026
  'aaaa1111-0000-0000-0000-000000000001': [
    { name: 'Karol G',   role: 'Headliner' },
    { name: 'Feid',      role: 'Headliner' },
    { name: 'Bad Bunny', role: 'Headliner' },
    { name: 'Blessd',    role: 'Artista' },
    { name: 'J Balvin',  role: 'Artista' },
  ],

  // Blackworks — Electronic Night
  'evnt-blackwrks-2026-00000000000015': [
    { name: 'Blackworks', role: 'Artista Principal' },
    { name: 'Nico Gómez', role: 'DJ Support' },
  ],

  // Hamlet — Producción Contemporánea
  'evnt-0000-0000-0000-000000000005': [
    { name: 'Hamlet Cast',       role: 'Elenco Principal' },
    { name: 'Dir. Roberto Vélez', role: 'Director' },
  ],

  // Romeo y Julieta — Teatro Clásico
  'evnt-0000-0000-0000-000000000001': [
    { name: 'Andrés Torres',  role: 'Romeo' },
    { name: 'Valentina Cruz', role: 'Julieta' },
    { name: 'Carlos Mendoza', role: 'Director' },
  ],

  // El Fantasma de la Ópera
  'evnt-0000-0000-0000-000000000002': [
    { name: 'Miguel Ángel Rivera', role: 'El Fantasma' },
    { name: 'Laura Jiménez',       role: 'Christine' },
  ],

  // Noche de Flamenco
  'evnt-0000-0000-0000-000000000003': [
    { name: 'Carmen Herrera',        role: 'Bailarina Principal' },
    { name: 'Diego Morales',          role: 'Guitarrista' },
    { name: 'Grupo Flamenco Andaluz', role: 'Ensamble' },
  ],

  // Festival de Jazz — Edición Especial
  'evnt-0000-0000-0000-000000000004': [
    { name: 'Santiago López Trio', role: 'Artista Principal' },
    { name: 'María Camila Reyes',  role: 'Vocalista' },
    { name: 'James Peterson',      role: 'Invitado Internacional' },
  ],

  // Tech Summit NovaPass
  'aaaa2222-0000-0000-0000-000000000002': [
    { name: 'Ana Rodríguez', role: 'Keynote Speaker' },
    { name: 'Luis Herrera',  role: 'Panel: Innovación' },
    { name: 'Sarah Chen',    role: 'Panel: IA' },
  ],
}

// Inject photos into each artist entry
const withPhotos: Record<string, Artist[]> = {}
for (const [id, artists] of Object.entries(EVENT_ARTISTS)) {
  withPhotos[id] = artists.map(a => ({
    ...a,
    photo: PHOTOS[a.name] ?? a.photo,
  }))
}

export function getEventArtists(eventId: string): Artist[] {
  return withPhotos[eventId.trim()] ?? []
}
