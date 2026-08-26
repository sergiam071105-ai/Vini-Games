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
  ExternalLink
} from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

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
    { href: '/admin/sales', label: 'Auditoría de Ventas', icon: DollarSign, activeMatch: '/admin/sales' },
    { href: '/admin', label: 'Resumen Financiero', icon: BarChart3, activeMatch: '/admin' },
    { href: '/catalog', label: 'Ver Catálogo', icon: Gamepad2 },
  ];

  return (
    <div className="min-h-screen bg-[#080A13] text-[#F5F7FF] flex flex-col">
      {/* Top Admin Header */}
      <header className="sticky top-0 z-50 w-full h-[76px] bg-[#0E101B]/95 backdrop-blur-md border-b border-[#2E334A] px-4 md:px-8 flex items-center justify-between">
        <div className="flex items-center gap-6">
          {/* Logo & Admin Badge */}
          <Link href="/admin/sales" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#783DF2] to-[#1FD1EB] flex items-center justify-center text-white shadow-[0_0_20px_rgba(120,61,242,0.5)]">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg text-white tracking-wider">ViniAdmin</span>
                <span className="bg-[#783DF2]/20 border border-[#783DF2]/50 text-[#1FD1EB] text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider">
                  Auditoría
                </span>
              </div>
              <span className="text-[11px] text-zinc-400 block -mt-0.5">
                Panel Comercial & Financiero
              </span>
            </div>
          </Link>

          {/* Admin Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1.5 ml-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-zinc-300 hover:text-white hover:bg-[#1A1C2B] transition-colors"
                >
                  <Icon className="w-4 h-4 text-[#783DF2]" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Actions: Back to Store & Admin Profile */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 bg-[#1A1C2B] hover:bg-[#2E334A] border border-[#2E334A] text-zinc-300 hover:text-white px-4 py-2 rounded-xl text-xs font-semibold transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Volver a la Tienda</span>
          </Link>

          <div className="flex items-center gap-2.5 pl-2 border-l border-[#2E334A]">
            <div className="w-8 h-8 rounded-xl bg-[#783DF2] text-white font-bold text-xs flex items-center justify-center shadow-md">
              {userProfile?.username ? userProfile.username.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="hidden lg:block text-left">
              <div className="text-xs font-bold text-white">
                @{userProfile?.username || 'Sergio_Admin'}
              </div>
              <div className="text-[10px] text-emerald-400 font-semibold">
                ● Rol Administrador
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Admin Content Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-8 flex flex-col">
        {children}
      </main>

      {/* Admin Footer */}
      <footer className="w-full border-t border-[#2E334A] py-6 px-4 text-center text-xs text-zinc-500 bg-[#0E101B]">
        ViniGames Platform © 2026 — Facultad de Tecnología UTEPSA • Sistema de Auditoría y Gestión Financiera
      </footer>
    </div>
  );
}
