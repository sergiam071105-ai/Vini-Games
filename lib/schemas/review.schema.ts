import { z } from 'zod';

export const createReviewSchema = z.object({
  gameId: z.number().int().positive({ message: 'ID de juego inválido' }),
  rating: z.number().int().min(1, { message: 'Debes seleccionar al menos 1 estrella' }).max(5, { message: 'La calificación máxima es 5 estrellas' }),
  title: z.string().trim().min(3, { message: 'El título debe tener al menos 3 caracteres' }).max(100, { message: 'El título no puede exceder 100 caracteres' }),
  content: z.string().trim().min(10, { message: 'La reseña debe tener al menos 10 caracteres' }).max(2000, { message: 'La reseña no puede exceder 2000 caracteres' }),
});

export const voteReviewSchema = z.object({
  reviewId: z.number().int().positive({ message: 'ID de reseña inválido' }),
  isHelpful: z.boolean(),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type VoteReviewInput = z.infer<typeof voteReviewSchema>;
