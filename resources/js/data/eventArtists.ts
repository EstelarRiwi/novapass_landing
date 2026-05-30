export interface Artist {
  name: string
  role: string
  photo?: string
}

// Static artist lineup per event. Keyed by trimmed event ID.
// photo is optional — component renders a gradient avatar with initials when absent.
const EVENT_ARTISTS: Record<string, Artist[]> = {
  // Karol G — Mañana Será Bonito Fest
  'evnt-karolg-2026-00000000000014': [
    { name: 'Karol G', role: 'Artista Principal' },
    { name: 'Feid', role: 'Invitado Especial' },
    { name: 'J Balvin', role: 'Invitado Especial' },
  ],

  // Feid — FERXXO World Tour
  'evnt-feid-2026-0000000000000010': [
    { name: 'Feid', role: 'Artista Principal' },
    { name: 'Blessd', role: 'Telonero' },
  ],

  // Blessd — El Bendito Tour
  'evnt-blessd-2026-000000000000011': [
    { name: 'Blessd', role: 'Artista Principal' },
    { name: 'Maluma', role: 'Invitado Especial' },
  ],

  // Ed Sheeran — Mathematics Tour
  'evnt-edsheeran-2026-000000000000012': [
    { name: 'Ed Sheeran', role: 'Artista Principal' },
  ],

  // Tomorrowland Colombia 2026
  'evnt-tomorrow-2026-0000000000000013': [
    { name: 'Martin Garrix', role: 'Headliner' },
    { name: 'Armin van Buuren', role: 'Headliner' },
    { name: 'David Guetta', role: 'Headliner' },
    { name: 'Hardwell', role: 'Artista' },
  ],

  // Bad Bunny — Most Wanted Tour
  'evnt-badbunny-2026-00000000000000016': [
    { name: 'Bad Bunny', role: 'Artista Principal' },
    { name: 'Jhay Cortez', role: 'Invitado Especial' },
  ],

  // Festival Estelar 2026
  'aaaa1111-0000-0000-0000-000000000001': [
    { name: 'Karol G', role: 'Headliner' },
    { name: 'Feid', role: 'Headliner' },
    { name: 'Bad Bunny', role: 'Headliner' },
    { name: 'Blessd', role: 'Artista' },
    { name: 'J Balvin', role: 'Artista' },
  ],

  // Blackworks — Electronic Night
  'evnt-blackwrks-2026-00000000000015': [
    { name: 'Blackworks', role: 'Artista Principal' },
    { name: 'Nico Gómez', role: 'DJ Support' },
  ],

  // Romeo y Julieta — Teatro Clásico
  'evnt-0000-0000-0000-000000000001': [
    { name: 'Andrés Torres', role: 'Romeo' },
    { name: 'Valentina Cruz', role: 'Julieta' },
    { name: 'Carlos Mendoza', role: 'Director' },
  ],

  // El Fantasma de la Ópera
  'evnt-0000-0000-0000-000000000002': [
    { name: 'Miguel Ángel Rivera', role: 'El Fantasma' },
    { name: 'Laura Jiménez', role: 'Christine' },
  ],

  // Noche de Flamenco
  'evnt-0000-0000-0000-000000000003': [
    { name: 'Carmen Herrera', role: 'Bailaora Principal' },
    { name: 'Diego Morales', role: 'Guitarrista' },
    { name: 'Grupo Flamenco Andaluz', role: 'Ensamble' },
  ],

  // Festival de Jazz — Edición Especial
  'evnt-0000-0000-0000-000000000004': [
    { name: 'Santiago López Trio', role: 'Artista Principal' },
    { name: 'María Camila Reyes', role: 'Vocalista' },
    { name: 'James Peterson', role: 'Invitado Internacional' },
  ],

  // Tech Summit NovaPass
  'aaaa2222-0000-0000-0000-000000000002': [
    { name: 'Ana Rodríguez', role: 'Keynote Speaker' },
    { name: 'Luis Herrera', role: 'Panel: Innovación' },
    { name: 'Sarah Chen', role: 'Panel: IA' },
  ],
}

export function getEventArtists(eventId: string): Artist[] {
  return EVENT_ARTISTS[eventId.trim()] ?? []
}
