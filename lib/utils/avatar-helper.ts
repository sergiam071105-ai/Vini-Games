/**
 * Mapeo de identificadores de avatar a URLs públicas de alta fidelidad
 */
const AVATAR_MAP: Record<string, string> = {
  cyber_ninja: 'https://api.dicebear.com/7.x/bottts/svg?seed=CyberNinja',
  mecha_titan: 'https://api.dicebear.com/7.x/bottts/svg?seed=MechaTitan',
  neon_wizard: 'https://api.dicebear.com/7.x/bottts/svg?seed=NeonWarrior',
  shadow_assassin: 'https://api.dicebear.com/7.x/bottts/svg?seed=ShadowRunner',
  synth_valkyrie: 'https://api.dicebear.com/7.x/bottts/svg?seed=ViniBoss',
  quantum_hacker: 'https://api.dicebear.com/7.x/bottts/svg?seed=QuantumQuest',
  pixel_paladin: 'https://api.dicebear.com/7.x/bottts/svg?seed=PixelMaster',
  astro_scout: 'https://api.dicebear.com/7.x/bottts/svg?seed=CyberGamer',
};

/**
 * Obtiene una URL de avatar válida, segura y sin errores 404
 */
export function getAvatarUrl(
  avatarUrl: string | null | undefined,
  username?: string | null
): string {
  if (!avatarUrl || avatarUrl.trim() === '') {
    const seed = encodeURIComponent(username?.trim() || 'ViniGamer');
    return `https://api.dicebear.com/7.x/bottts/svg?seed=${seed}`;
  }

  const clean = avatarUrl.trim();

  // Si es un ID de avatar de Onboarding
  if (AVATAR_MAP[clean]) {
    return AVATAR_MAP[clean];
  }

  // Si ya es una URL web completa (HTTPS, HTTP o Base64 Data URL)
  if (clean.startsWith('http://') || clean.startsWith('https://') || clean.startsWith('data:')) {
    return clean;
  }

  // Si tiene un formato de archivo local inexistente (ej. /avatars/default_ninja.png)
  const seed = encodeURIComponent(username?.trim() || clean.replace(/[^a-zA-Z0-9]/g, '') || 'Gamer');
  return `https://api.dicebear.com/7.x/bottts/svg?seed=${seed}`;
}
