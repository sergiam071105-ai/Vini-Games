import { z } from 'zod';

export const checkoutCardSchema = z.object({
  cardNumber: z
    .string()
    .trim()
    .min(16, { message: 'El número de tarjeta debe tener al menos 16 dígitos' })
    .max(19, { message: 'Número de tarjeta demasiado largo' }),
  cardHolder: z
    .string()
    .trim()
    .min(3, { message: 'El nombre del titular es requerido (min. 3 caracteres)' })
    .max(80),
  expiryDate: z
    .string()
    .trim()
    .regex(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/, {
      message: 'Formato de fecha inválido (usa MM/YY, ej: 12/28)',
    }),
  cvv: z
    .string()
    .trim()
    .regex(/^[0-9]{3,4}$/, { message: 'El CVV debe contener 3 o 4 dígitos' }),
});

export const processOrderSchema = z.object({
  gameIds: z.array(z.number().int().positive()).min(1, { message: 'El carrito no puede estar vacío' }),
  paymentMethod: z.enum(['SIMULATED_CARD', 'GAMECOINS', 'WALLET']).default('SIMULATED_CARD'),
  cardData: checkoutCardSchema.optional(),
});

export type CheckoutCardInput = z.infer<typeof checkoutCardSchema>;
export type ProcessOrderInput = z.infer<typeof processOrderSchema>;
