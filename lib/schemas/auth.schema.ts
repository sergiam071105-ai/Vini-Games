import { z } from 'zod';

/**
 * Esquema de validación para Inicio de Sesión
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'El correo electrónico es requerido' })
    .email({ message: 'Ingresa un formato de correo válido (ej: usuario@vinigames.com)' }),
  password: z
    .string()
    .min(1, { message: 'La contraseña es requerida' })
    .min(6, { message: 'La contraseña debe tener al menos 6 caracteres' }),
});

export type LoginInput = z.infer<typeof loginSchema>;

/**
 * Esquemas para Onboarding en 4 pasos
 */
export const onboardingStep1Schema = z.object({
  username: z
    .string()
    .min(3, { message: 'El Gamer Tag debe tener al menos 3 caracteres' })
    .max(20, { message: 'El Gamer Tag no puede superar los 20 caracteres' })
    .regex(/^[a-zA-Z0-9_-]+$/, {
      message: 'Solo se permiten letras, números, guiones (-) y guiones bajos (_)',
    }),
  avatarUrl: z.string().min(1, { message: 'Debes seleccionar un avatar gamer' }),
  fullName: z.string().optional(),
});

export const onboardingStep2Schema = z.object({
  favoriteCategories: z
    .array(z.string())
    .min(1, { message: 'Selecciona al menos 1 categoría o género de juego favorita' }),
});

export const onboardingStep3Schema = z.object({
  exploration: z.number().min(0).max(100),
  competitive: z.number().min(0).max(100),
  narrative: z.number().min(0).max(100),
  collection: z.number().min(0).max(100),
});

export const onboardingStep4Schema = z
  .object({
    email: z
      .string()
      .min(1, { message: 'El correo electrónico es requerido' })
      .email({ message: 'Ingresa un correo electrónico válido' }),
    password: z
      .string()
      .min(6, { message: 'La contraseña debe tener al menos 6 caracteres' }),
    confirmPassword: z.string().min(1, { message: 'Confirma tu contraseña' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

export const fullOnboardingSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'El Gamer Tag debe tener al menos 3 caracteres' })
    .max(20, { message: 'El Gamer Tag no puede superar los 20 caracteres' }),
  avatarUrl: z.string().min(1),
  fullName: z.string().optional(),
  favoriteCategories: z.array(z.string()).min(1),
  gamerDna: z.object({
    exploration: z.number().min(0).max(100),
    competitive: z.number().min(0).max(100),
    narrative: z.number().min(0).max(100),
    collection: z.number().min(0).max(100),
  }),
  email: z.string().email(),
  password: z.string().min(6),
});

export type OnboardingStep1Input = z.infer<typeof onboardingStep1Schema>;
export type OnboardingStep2Input = z.infer<typeof onboardingStep2Schema>;
export type OnboardingStep3Input = z.infer<typeof onboardingStep3Schema>;
export type OnboardingStep4Input = z.infer<typeof onboardingStep4Schema>;
export type FullOnboardingInput = z.infer<typeof fullOnboardingSchema>;
