import { createClient } from "./client";

/**
 * Obtiene la URL pública de un archivo en Supabase Storage
 */
export function getPublicImageUrl(
  bucket: "game-covers" | "game-media" | "avatars",
  path: string
): string {
  const supabase = createClient();
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

/**
 * Sube una imagen de avatar para un usuario
 */
export async function uploadUserAvatar(userId: string, file: File): Promise<string> {
  const supabase = createClient();
  const fileExt = file.name.split(".").pop();
  const filePath = `${userId}-${Math.random()}.${fileExt}`;

  const { error } = await supabase.storage.from("avatars").upload(filePath, file, {
    cacheControl: "3600",
    upsert: true,
  });

  if (error) {
    throw new Error(`Error subiendo avatar: ${error.message}`);
  }

  return getPublicImageUrl("avatars", filePath);
}

/**
 * Sube la carátula de un videojuego
 */
export async function uploadGameCover(gameSlug: string, file: File): Promise<string> {
  const supabase = createClient();
  const fileExt = file.name.split(".").pop();
  const filePath = `${gameSlug}/cover.${fileExt}`;

  const { error } = await supabase.storage.from("game-covers").upload(filePath, file, {
    cacheControl: "3600",
    upsert: true,
  });

  if (error) {
    throw new Error(`Error subiendo portada: ${error.message}`);
  }

  return getPublicImageUrl("game-covers", filePath);
}
