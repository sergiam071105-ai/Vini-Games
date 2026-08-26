import { z } from 'zod';

export const gameAdminSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, { message: 'El título debe tener al menos 3 caracteres' })
    .max(120, { message: 'El título no puede exceder 120 caracteres' }),
  slug: z
    .string()
    .trim()
    .min(3, { message: 'El slug debe tener al menos 3 caracteres' })
    .regex(/^[a-z0-9-]+$/, {
      message: 'El slug solo puede contener letras minúsculas, números y guiones (ej. cyber-odyssey)',
    }),
  developer: z
    .string()
    .trim()
    .min(2, { message: 'El estudio desarrollador es requerido (min. 2 caracteres)' })
    .max(100),
  description: z
    .string()
    .trim()
    .min(10, { message: 'La descripción debe tener al menos 10 caracteres' }),
  basePrice: z
    .number({ message: 'El precio debe ser un valor numérico' })
    .min(0, { message: 'El precio base no puede ser negativo' }),
  discountPercent: z
    .number({ message: 'El descuento debe ser un valor numérico' })
    .min(0, { message: 'El descuento mínimo es 0%' })
    .max(90, { message: 'El descuento máximo permitido es 90%' })
    .default(0),
  coverImageUrl: z.string().optional(),
  releaseDate: z.string().optional(),
  isActive: z.boolean().default(true),
  categoryIds: z
    .array(z.number().int().positive())
    .min(1, { message: 'Debes seleccionar al menos una categoría' }),
});

export type GameAdminInput = z.infer<typeof gameAdminSchema>;
