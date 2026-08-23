'use server';

import { createClient } from '@/lib/supabase/server';
import { loginSchema, type LoginInput } from '@/lib/schemas/auth.schema';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export type AuthActionResult = {
  success: boolean;
  message?: string;
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

/**
 * Server Action para iniciar sesión con correo y contraseña
 */
export async function loginAction(input: LoginInput): Promise<AuthActionResult> {
  // 1. Validar esquema con Zod
  const validation = loginSchema.safeParse(input);

  if (!validation.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of validation.error.issues) {
      const field = issue.path[0] as string;
      if (!fieldErrors[field]) {
        fieldErrors[field] = [];
      }
      fieldErrors[field].push(issue.message);
    }
    return {
      success: false,
      error: 'Por favor, corrige los campos del formulario.',
      fieldErrors,
    };
  }

  const { email, password } = validation.data;
  const supabase = await createClient();

  // 2. Autenticar en Supabase Auth
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    let friendlyMessage = 'Error al iniciar sesión. Inténtalo de nuevo.';
    if (error.message.includes('Invalid login credentials')) {
      friendlyMessage = 'Credenciales inválidas. Verifica tu correo y contraseña.';
    } else if (error.message.includes('Email not confirmed')) {
      friendlyMessage = 'Debes confirmar tu correo electrónico antes de ingresar.';
    } else if (error.message.includes('rate limit')) {
      friendlyMessage = 'Demasiados intentos fallidos. Por favor, espera unos minutos.';
    }

    return {
      success: false,
      error: friendlyMessage,
    };
  }

  // 3. Actualizar fecha de último login en profiles si existe sesión
  if (data.user) {
    try {
      await supabase
        .from('profiles')
        .update({
          last_login_date: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', data.user.id);
    } catch {
      // Si falla la actualización de last_login_date no interrumpe el login
    }
  }

  // 4. Revalidar rutas para refrescar estado en servidor
  revalidatePath('/', 'layout');

  return {
    success: true,
    message: '¡Bienvenido de vuelta a ViniGames!',
  };
}

/**
 * Server Action para cerrar sesión
 */
export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/login');
}
