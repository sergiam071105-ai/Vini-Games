import React from 'react';
import { getAdminUsersListAction } from '@/app/actions/admin-users.actions';
import { AdminUsersClientView } from '@/components/admin/admin-users-client-view';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Gestión de Administradores & Usuarios | ViniAdmin',
  description: 'Consola de control de staff, creación de cuentas de administrador y asignación de roles en ViniGames.',
};

export default async function AdminUsersPage() {
  const users = await getAdminUsersListAction();

  return <AdminUsersClientView initialUsers={users} />;
}
