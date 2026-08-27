import { z } from 'zod';

export const sendChatMessageSchema = z.object({
  sessionId: z.string().min(1, { message: 'El ID de sesión es requerido' }),
  message: z
    .string()
    .min(2, { message: 'El mensaje debe tener al menos 2 caracteres' })
    .max(1000, { message: 'El mensaje no puede exceder los 1000 caracteres' }),
});

export const createChatSessionSchema = z.object({
  title: z
    .string()
    .min(2, { message: 'El título debe tener al menos 2 caracteres' })
    .max(100, { message: 'El título no puede exceder los 100 caracteres' })
    .optional(),
});

export const deleteChatSessionSchema = z.object({
  sessionId: z.string().min(1, { message: 'El ID de sesión es requerido' }),
});

export type SendChatMessageInput = z.infer<typeof sendChatMessageSchema>;
export type CreateChatSessionInput = z.infer<typeof createChatSessionSchema>;
export type DeleteChatSessionInput = z.infer<typeof deleteChatSessionSchema>;
