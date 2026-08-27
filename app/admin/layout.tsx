import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { AdminSidebar } from '@/components/admin/admin-sidebar';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Panel ViniAdmin | ViniGames',
  description: 'Consola de administración comercial, catálogo, finanzas y auditoría de ViniGames.',
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  let userEmail = 'admin@vinigames.bo';
  let adminName = 'Vinicius (Lead)';

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      userEmail = user.email || userEmail;
      const { data: profile } = await supabase
        .from('profiles')
        .select('username, role')
        .eq('id', user.id)
        .maybeSingle();

      if (profile?.username) {
        adminName = profile.username;
      }
    }
  } catch (err) {
    console.warn('Error verificando sesión de admin en layout:', err);
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#080A13] text-[#F8FAFC]">
      {/* Sidebar Persistente de ViniAdmin (Mobile Drawer + Desktop Sidebar) */}
      <AdminSidebar userEmail={userEmail} adminName={adminName} />
      
      {/* Contenedor Principal */}
      <main className="flex-1 flex flex-col min-h-screen md:h-screen md:overflow-y-auto bg-[#090B14]">
        <div className="p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6">
          {children}
        </div>
      </main>
    </div>
  );
}
