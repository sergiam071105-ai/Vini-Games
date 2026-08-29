'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { getAvatarUrl } from '@/lib/utils/avatar-helper';

export interface AdminUserItem {
  id: string;
  username: string;
  fullName: string | null;
  email: string;
  avatarUrl: string;
  role: 'ADMIN' | 'USER' | 'VISITOR';
  currentLevel: number;
  totalXp: number;
  gamecoinsBalance: number;
  currentStreak: number;
  createdAt: string;
}

export interface CreateAdminAccountInput {
  username: string;
  fullName?: string;
  email: string;
  password?: string;
  avatarUrl?: string;
  role?: 'ADMIN' | 'USER';
}

/**
 * Obtiene la lista completa de usuarios y administradores registrados
 */
export async function getAdminUsersListAction(): Promise<AdminUserItem[]> {
  try {
    const supabase = await createClient();

    const { data: profiles, error } = await supabase
      .from('profiles')
      .select(`
        id,
        username,
        full_name,
        avatar_url,
        role,
        current_level,
        total_xp,
        gamecoins_balance,
        current_streak,
        created_at
      `)
      .order('created_at', { ascending: false });

    if (error || !profiles) {
      console.warn('Error fetching profiles in admin users action:', error);
      return [];
    }

    return profiles.map((p) => {
      const uname = p.username || 'Gamer';
      return {
        id: p.id,
        username: uname,
        fullName: p.full_name,
        email: `${uname.toLowerCase().replace(/[^a-z0-9]/g, '')}@vinigames.com`,
        avatarUrl: getAvatarUrl(p.avatar_url, uname),
        role: (p.role as any) || 'USER',
        currentLevel: p.current_level || 1,
        totalXp: p.total_xp || 0,
        gamecoinsBalance: p.gamecoins_balance || 0,
        currentStreak: p.current_streak || 0,
        createdAt: p.created_at || new Date().toISOString(),
      };
    });
  } catch (err) {
    console.error('Excepción en getAdminUsersListAction:', err);
    return [];
  }
}

/**
 * Crea una nueva cuenta de Administrador o Usuario directamente en la base de datos
 */
export async function createAdminAccountAction(
  input: CreateAdminAccountInput
): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const { username, fullName, email, password = 'AdminPassword123!', avatarUrl, role = 'ADMIN' } = input;

    if (!username.trim() || !email.trim()) {
      return { success: false, error: 'El nombre de usuario y el correo son obligatorios.' };
    }

    const cleanUsername = username.trim().replace(/[^a-zA-Z0-9_-]/g, '');
    const cleanEmail = email.trim().toLowerCase();
    const finalAvatar = avatarUrl?.trim() || getAvatarUrl(null, cleanUsername);

    const supabase = await createClient();

    // 1. Verificar si el username ya existe en profiles
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('id, username')
      .ilike('username', cleanUsername)
      .maybeSingle();

    if (existingUser) {
      return { success: false, error: `El Gamer Tag @${cleanUsername} ya está en uso.` };
    }

    // 2. Registrar en Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: cleanEmail,
      password: password,
      options: {
        data: {
          username: cleanUsername,
          full_name: fullName || null,
          avatar_url: finalAvatar,
          role: role,
        },
      },
    });

    if (authError) {
      // Si el error es de límite de envío de correos o usuario existente
      if (authError.message.toLowerCase().includes('already registered')) {
        return { success: false, error: 'Este correo electrónico ya está registrado en la plataforma.' };
      }
    }

    const userId = authData?.user?.id;

    if (userId) {
      // 3. Upsert en profiles con rol ADMIN y estadísticas gamer iniciales
      const { error: profileError } = await supabase.from('profiles').upsert({
        id: userId,
        username: cleanUsername,
        full_name: fullName?.trim() || null,
        avatar_url: finalAvatar,
        role: role,
        dna_exploration: 30,
        dna_competitive: 30,
        dna_narrative: 20,
        dna_collection: 20,
        total_xp: role === 'ADMIN' ? 500 : 100,
        gamecoins_balance: role === 'ADMIN' ? 1000 : 100,
        current_level: role === 'ADMIN' ? 5 : 1,
        current_streak: role === 'ADMIN' ? 7 : 1,
        longest_streak: role === 'ADMIN' ? 7 : 1,
        last_login_date: new Date().toISOString().split('T')[0],
        updated_at: new Date().toISOString(),
      });

      if (profileError) {
        console.error('Error insertando perfil de admin:', profileError);
        return { success: false, error: `Error creando perfil: ${profileError.message}` };
      }
    }

    revalidatePath('/admin/users');
    revalidatePath('/admin');
    revalidatePath('/', 'layout');

    return {
      success: true,
      message: `¡Cuenta de ${role === 'ADMIN' ? 'Administrador' : 'Usuario'} @${cleanUsername} creada con éxito!`,
    };
  } catch (err: any) {
    console.error('Excepción en createAdminAccountAction:', err);
    return { success: false, error: err?.message || 'Error inesperado al crear la cuenta.' };
  }
}

/**
 * Cambia el rol de un usuario existente (Promover a ADMIN o Degradar a USER)
 */
export async function toggleUserRoleAction(
  userId: string,
  newRole: 'ADMIN' | 'USER'
): Promise<{ success: boolean; newRole?: 'ADMIN' | 'USER'; error?: string }> {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from('profiles')
      .update({
        role: newRole,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/admin/users');
    revalidatePath('/admin');
    revalidatePath('/', 'layout');

    return { success: true, newRole };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Error al actualizar el rol.' };
  }
}
