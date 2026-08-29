import { createClient } from "./client";

/**
 * Convierte un archivo File en un Data URL Base64 permanente
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

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
  try {
    const supabase = createClient();
    const fileExt = file.name.split(".").pop() || "png";
    const cleanExt = fileExt.toLowerCase().replace(/[^a-z0-9]/g, "");
    const filePath = `user-${userId}-${Date.now()}.${cleanExt}`;

    const { error } = await supabase.storage.from("avatars").upload(filePath, file, {
      cacheControl: "3600",
      upsert: true,
    });

    if (error) {
      console.warn("Fallo subida a Supabase Storage avatars, usando Base64 permanente:", error);
      return await fileToBase64(file);
    }

    return getPublicImageUrl("avatars", filePath);
  } catch (err) {
    console.warn("Excepción en uploadUserAvatar, usando Base64 permanente:", err);
    return await fileToBase64(file);
  }
}

/**
 * Sube la carátula de un videojuego a Supabase Storage con fallback a Base64
 */
export async function uploadGameCover(gameSlug: string, file: File): Promise<string> {
  try {
    const supabase = createClient();
    const fileExt = file.name.split(".").pop() || "jpg";
    const cleanExt = fileExt.toLowerCase().replace(/[^a-z0-9]/g, "");
    const cleanSlug = gameSlug.toLowerCase().replace(/[^a-z0-9-]/g, "-") || "game";
    const filePath = `${cleanSlug}-cover-${Date.now()}.${cleanExt}`;

    const { error } = await supabase.storage.from("game-covers").upload(filePath, file, {
      cacheControl: "3600",
      upsert: true,
    });

    if (error) {
      console.warn("Fallo subida a Supabase Storage game-covers, usando Base64 permanente:", error);
      return await fileToBase64(file);
    }

    return getPublicImageUrl("game-covers", filePath);
  } catch (err) {
    console.warn("Excepción en uploadGameCover, usando Base64 permanente:", err);
    return await fileToBase64(file);
  }
}
