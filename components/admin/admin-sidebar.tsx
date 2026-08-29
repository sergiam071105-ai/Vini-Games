'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Gamepad2,
  TrendingUp,
  MessageSquareText,
  Users,
  ArrowLeft,
  Shield,
  Menu,
  X,
} from 'lucide-react';
import { getAvatarUrl } from '@/lib/utils/avatar-helper';

interface AdminSidebarProps {
  userEmail?: string;
  adminName?: string;
  adminAvatarUrl?: string | null;
}

const ADMIN_NAV_LINKS = [
  {
    href: '/admin',
    label: 'Dashboard General',
    icon: LayoutDashboard,
    badge: 'KPIs',
  },
  {
    href: '/admin/games',
    label: 'Catálogo de Juegos',
    icon: Gamepad2,
    badge: 'CRUD',
  },
  {
    href: '/admin/sales',
    label: 'Órdenes & Ventas',
    icon: TrendingUp,
    badge: 'Finanzas',
  },
  {
    href: '/admin/reviews',
    label: 'Moderación de Reseñas',
    icon: MessageSquareText,
    badge: 'Social',
  },
  {
    href: '/admin/users',
    label: 'Equipo & Admins',
    icon: Users,
    badge: 'Staff',
  },
];

export function AdminSidebar({
  userEmail,
  adminName = 'Vinicius (Lead)',
  adminAvatarUrl,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#0B0D18] text-[#F8FAFC]">
      {/* Encabezado del Panel */}
      <div className="p-5 border-b border-[#2E334A] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#783DF2] to-[#1FD1EB] flex items-center justify-center text-white shadow-lg shadow-[#783DF2]/30">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-[#F8FAFC]">ViniAdmin</h2>
            <p className="text-[10px] text-[#1FD1EB] font-bold tracking-wider uppercase">
              Control Maestro
            </p>
          </div>
        </div>
      </div>

      {/* Navegación Principal */}
      <div className="flex-1 p-3 space-y-1.5 overflow-y-auto">
        <p className="px-3 py-2 text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">
          Módulos del Sistema
        </p>

        {ADMIN_NAV_LINKS.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-[#783DF2]/25 to-[#1FD1EB]/10 text-[#F8FAFC] border border-[#783DF2]/40 shadow-lg shadow-[#783DF2]/10'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1A1C2B] border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? 'text-[#1FD1EB]' : 'text-[#94A3B8]'
                  }`}
                />
                <span>{link.label}</span>
              </div>
              <span
                className={`text-[9px] px-2 py-0.5 rounded-md font-extrabold ${
                  isActive
                    ? 'bg-[#783DF2] text-white'
                    : 'bg-[#1A1C2B] text-[#94A3B8]'
                }`}
              >
                {link.badge}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Pie de Sidebar: Perfil y Salida a Tienda */}
      <div className="p-4 border-t border-[#2E334A] bg-[#131521]/60 space-y-3">
        <div className="flex items-center gap-2.5 px-2">
          <div className="w-8 h-8 rounded-xl overflow-hidden border border-[#783DF2] bg-[#1C1730] flex-shrink-0 shadow-md">
            <img
              src={getAvatarUrl(adminAvatarUrl, adminName)}
              alt={adminName}
              className="h-full w-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = getAvatarUrl(null, adminName);
              }}
            />
          </div>
          <div className="truncate">
            <p className="text-xs font-bold text-[#F8FAFC] truncate">{adminName}</p>
            <p className="text-[10px] text-[#94A3B8] truncate">{userEmail || 'admin@vinigames.bo'}</p>
          </div>
        </div>

        <Link
          href="/"
          className="w-full bg-[#1A1C2B] hover:bg-[#25283d] border border-[#2E334A] hover:border-[#1FD1EB]/50 text-[#94A3B8] hover:text-[#1FD1EB] text-xs font-bold py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-2 uppercase tracking-wider"
          aria-label="Volver a la tienda pública de ViniGames"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Volver a la Tienda
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden w-full bg-[#0B0D18] border-b border-[#2E334A] p-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#783DF2] to-[#1FD1EB] flex items-center justify-center text-white">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-extrabold text-[#F8FAFC]">ViniAdmin</h2>
            <span className="text-[9px] text-[#1FD1EB] font-bold">Consola de Control</span>
          </div>
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 bg-[#1A1C2B] text-[#94A3B8] hover:text-white rounded-lg border border-[#2E334A]"
          aria-label={mobileMenuOpen ? 'Cerrar menú de administración' : 'Abrir menú de administración'}
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Overlay Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl z-10 border-r border-[#2E334A]">
            {sidebarContent}
          </div>
        </div>
      )}

      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:flex w-64 lg:w-72 border-r border-[#2E334A] flex-col h-screen sticky top-0 flex-shrink-0">
        {sidebarContent}
      </aside>
    </>
  );
}
