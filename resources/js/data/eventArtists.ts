export interface Artist {
  name: string
  role: string
  photo?: string
}

// Photos keyed by artist name.
// Real artists: Wikipedia Commons. Fictional: randomuser.me. Groups: placehold.co.
const WP = 'https://upload.wikimedia.org/wikipedia/commons/thumb'

export const ARTIST_PHOTOS: Record<string, string> = {
  // Real artists — Wikipedia Commons
  'Karol G':          `${WP}/c/cb/2023-11-16_Gala_de_los_Latin_Grammy%2C_15.jpg/330px-2023-11-16_Gala_de_los_Latin_Grammy%2C_15.jpg`,
  'Feid':             `${WP}/1/13/Feid_image_3.jpg/330px-Feid_image_3.jpg`,
  'J Balvin':         `${WP}/0/0c/J_Balvin%2C_Noisey_Meets%3B_Oct_2018.jpg/330px-J_Balvin%2C_Noisey_Meets%3B_Oct_2018.jpg`,
  'Bad Bunny':        `${WP}/b/b1/Bad_Bunny_2019_by_Glenn_Francis_%28cropped%29.jpg/330px-Bad_Bunny_2019_by_Glenn_Francis_%28cropped%29.jpg`,
  'Blessd':           `${WP}/f/f7/Blessd_en_Premios_Nuestra_Tierra_2022.jpg/330px-Blessd_en_Premios_Nuestra_Tierra_2022.jpg`,
  'Maluma':           `${WP}/9/9a/2023-11-16_Gala_de_los_Latin_Grammy%2C_20_%28Maluma%29.jpg/330px-2023-11-16_Gala_de_los_Latin_Grammy%2C_20_%28Maluma%29.jpg`,
  'Ed Sheeran':       `${WP}/c/c1/Ed_Sheeran-6886_%28cropped%29.jpg/330px-Ed_Sheeran-6886_%28cropped%29.jpg`,
  'Martin Garrix':    `${WP}/7/74/Martin_Garrix_%40_Web_Summit_2017.jpg/330px-Martin_Garrix_%40_Web_Summit_2017.jpg`,
  'Armin van Buuren': `${WP}/9/90/Armin_van_Buuren%2C_November_2025_%28cropped%29.jpg/330px-Armin_van_Buuren%2C_November_2025_%28cropped%29.jpg`,
  'David Guetta':     `${WP}/4/4f/2023-11-16_Gala_de_los_Latin_Grammy%2C_22_%28David_Guetta%29.jpg/330px-2023-11-16_Gala_de_los_Latin_Grammy%2C_22_%28David_Guetta%29.jpg`,
  'Hardwell':         `${WP}/a/a7/Hardwell_2018_%28cropped%29.jpg/330px-Hardwell_2018_%28cropped%29.jpg`,
  'Jhay Cortez':      'https://randomuser.me/api/portraits/men/75.jpg',

  // Fictional individuals — randomuser.me (stable per number)
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
  'Hamlet Cast':           'https://randomuser.me/api/portraits/men/14.jpg',

  // Groups — colored logo tiles
  'Grupo Flamenco Andaluz': 'https://placehold.co/200x200/7C1D1D/fde8c8?text=GFA&font=playfair-display',
  'Blackworks':             'https://placehold.co/200x200/0f0720/9333ea?text=BW&font=montserrat',
}
