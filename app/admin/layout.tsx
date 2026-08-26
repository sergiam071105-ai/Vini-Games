import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ShieldAlert, 
  DollarSign, 
  Gamepad2, 
  Users, 
  BarChart3, 
  ArrowLeft,
  Sparkles,
  LayoutDashboard,
  Layers
} from 'lucide-react';
import { createClient } from '@/lib/supabase/server';

export const metadata = {
  title: 'Panel ViniAdmin | ViniGames',
  description: 'Consola de administración comercial, financiera y de auditoría de ViniGames.',
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  let userProfile = null;

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      userProfile = data;
    }
  } catch (err) {
    console.error('Error fetching admin user:', err);
  }

  const navItems = [
    { href: '/admin/sales', label: 'Ventas & Auditoría', icon: DollarSign, active: true },
    { href: '/catalog', label: 'Catálogo de Juegos', icon: Gamepad2 },
    { href: '/library', label: 'Biblioteca Digital', icon: Layers },
  ];

  return (
    <div className="min-h-screen bg-[#080A13] text-[#F5F7FF] flex flex-col selection:bg-[#783DF2] selection:text-white">
      {/* Top Admin Header con estilo Dark Gamer Figma */}
      <header className="sticky top-0 z-50 w-full h-[78px] bg-[#0E101B]/90 backdrop-blur-xl border-b border-[#2D3349] px-4 md:px-8 flex items-center justify-between">
        <div className="flex items-center gap-6">
          {/* Logo ViniAdmin */}
          <Link href="/admin/sales" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#783DF2] via-[#9D68FF] to-[#1FD1EB] flex items-center justify-center text-white shadow-[0_0_20px_rgba(120,61,242,0.45)] transition-transform group-hover:scale-105">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg text-white tracking-wider">ViniAdmin</span>
                <span className="bg-[#783DF2]/20 border border-[#783DF2]/60 text-[#1FD1EB] text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider shadow-[0_0_10px_rgba(31,209,235,0.2)]">
                  Pro
                </span>
              </div>
              <span className="text-[11px] text-[#949CB2] block -mt-0.5 font-medium">
                Auditoría Comercial & Finanzas
              </span>
            </div>
          </Link>

          {/* Admin Navigation Pills */}
          <nav className="hidden md:flex items-center gap-1.5 ml-4 bg-[#090B14] p-1 rounded-xl border border-[#2D3349]/80">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    item.active
                      ? 'bg-[#783DF2] text-white shadow-[0_0_15px_rgba(120,61,242,0.4)]'
                      : 'text-[#949CB2] hover:text-white hover:bg-[#1A1C2B]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 bg-[#1A1C2B] hover:bg-[#252A40] border border-[#2D3349] hover:border-[#783DF2] text-[#949CB2] hover:text-white px-4 py-2 rounded-xl text-xs font-bold transition-all hover:shadow-[0_0_15px_rgba(120,61,242,0.25)]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Volver a la Tienda</span>
          </Link>

          <div className="flex items-center gap-2.5 pl-3 border-l border-[#2D3349]">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#783DF2] to-[#5826B0] text-white font-black text-xs flex items-center justify-center shadow-md border border-[#783DF2]/40">
              {userProfile?.username ? userProfile.username.charAt(0).toUpperCase() : 'S'}
            </div>
            <div className="hidden lg:block text-left">
              <div className="text-xs font-bold text-white leading-tight">
                @{userProfile?.username || 'Sergio_Alvarez'}
              </div>
              <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Auditor Financiero
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Admin Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-8 flex flex-col">
        {children}
      </main>

      {/* Admin Footer */}
      <footer className="w-full border-t border-[#2D3349]/70 py-6 px-4 text-center text-xs text-[#949CB2] bg-[#0E101B]">
        ViniGames Platform © 2026 — Facultad de Tecnología UTEPSA • Módulo de Gestión Comercial y Finanzas
      </footer>
    </div>
  );
}
