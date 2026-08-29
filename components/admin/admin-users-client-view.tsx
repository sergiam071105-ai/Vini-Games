'use client';

import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  User,
  Users,
  Search,
  Plus,
  Flame,
  Coins,
  Calendar,
  Sparkles,
  ArrowUpDown,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Key,
} from 'lucide-react';
import { AdminUserItem, toggleUserRoleAction } from '@/app/actions/admin-users.actions';
import { CreateAdminModal } from '@/components/admin/create-admin-modal';
import { getAvatarUrl } from '@/lib/utils/avatar-helper';

interface AdminUsersClientViewProps {
  initialUsers: AdminUserItem[];
}

export function AdminUsersClientView({ initialUsers }: AdminUsersClientViewProps) {
  const [users, setUsers] = useState<AdminUserItem[]>(initialUsers);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'ADMIN' | 'USER'>('ALL');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const totalAdmins = users.filter((u) => u.role === 'ADMIN').length;
  const totalStandardUsers = users.filter((u) => u.role === 'USER').length;
  const totalCoins = users.reduce((acc, u) => acc + u.gamecoinsBalance, 0);

  const handleToggleRole = async (user: AdminUserItem) => {
    const newRole: 'ADMIN' | 'USER' = user.role === 'ADMIN' ? 'USER' : 'ADMIN';
    const confirmMessage =
      newRole === 'ADMIN'
        ? `¿Deseas promover a @${user.username} a ADMINISTRADOR con acceso total al panel?`
        : `¿Deseas revocar los privilegios de Administrador de @${user.username}?`;

    if (!window.confirm(confirmMessage)) return;

    setTogglingId(user.id);
    try {
      const res = await toggleUserRoleAction(user.id, newRole);
      if (res.success && res.newRole) {
        setUsers((prev) =>
          prev.map((u) => (u.id === user.id ? { ...u, role: res.newRole! } : u))
        );
        setToastMessage(`Rol de @${user.username} actualizado a ${newRole === 'ADMIN' ? 'ADMINISTRADOR' : 'USUARIO'}`);
        setTimeout(() => setToastMessage(null), 3000);
      }
    } finally {
      setTogglingId(null);
    }
  };

  const filteredUsers = users.filter((u) => {
    const q = search.toLowerCase();
    const matchesSearch =
      u.username.toLowerCase().includes(q) ||
      (u.fullName && u.fullName.toLowerCase().includes(q)) ||
      u.email.toLowerCase().includes(q);

    if (!matchesSearch) return false;

    if (roleFilter === 'ADMIN') return u.role === 'ADMIN';
    if (roleFilter === 'USER') return u.role === 'USER';
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2E334A] pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#1FD1EB] uppercase tracking-wider mb-1">
            <ShieldAlert className="w-4 h-4 text-[#783DF2]" />
            Control de Seguridad & Staff
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#F8FAFC]">
            Gestión de Administradores & Usuarios
          </h1>
          <p className="text-xs text-[#949CB2] mt-1">
            Crea cuentas de staff con permisos administrativos, gestiona roles y audita usuarios registrados.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          className="self-start sm:self-auto px-4 py-2.5 bg-gradient-to-r from-[#783DF2] to-[#682FD0] hover:opacity-95 text-[#F8FAFC] rounded-xl text-xs font-bold transition-all shadow-lg shadow-[#783DF2]/30 flex items-center gap-2 uppercase tracking-wider cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Crear Administrador
        </button>
      </div>

      {toastMessage && (
        <div className="p-3.5 bg-[#10B981]/15 border border-[#10B981]/40 rounded-xl flex items-center gap-3 text-xs text-[#10B981] animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* KPI Cards de Seguridad y Usuarios */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-[#131521] border border-[#2E334A] rounded-2xl p-5 shadow-lg relative overflow-hidden group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider">
              Administradores
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#783DF2]/20 text-[#783DF2] flex items-center justify-center border border-[#783DF2]/30">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white">{totalAdmins} Staff</div>
          <p className="text-[11px] text-[#1FD1EB] mt-1">Acceso total a la consola</p>
        </div>

        <div className="bg-[#131521] border border-[#2E334A] rounded-2xl p-5 shadow-lg relative overflow-hidden group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider">
              Usuarios Registrados
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#1FD1EB]/20 text-[#1FD1EB] flex items-center justify-center border border-[#1FD1EB]/30">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white">{users.length} Gamers</div>
          <p className="text-[11px] text-[#10B981] mt-1">{totalStandardUsers} cuentas estándar</p>
        </div>

        <div className="bg-[#131521] border border-[#2E334A] rounded-2xl p-5 shadow-lg relative overflow-hidden group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider">
              GameCoins Circulantes
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#F59E0B]/20 text-[#F59E0B] flex items-center justify-center border border-[#F59E0B]/30">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white">{totalCoins.toLocaleString()} GC</div>
          <p className="text-[11px] text-[#94A3B8] mt-1">Economía interna de recompensas</p>
        </div>

        <div className="bg-[#131521] border border-[#2E334A] rounded-2xl p-5 shadow-lg relative overflow-hidden group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider">
              Seguridad Supabase
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#10B981]/20 text-[#10B981] flex items-center justify-center border border-[#10B981]/30">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#10B981]">Activa (RLS)</div>
          <p className="text-[11px] text-[#94A3B8] mt-1">Políticas de acceso blindadas</p>
        </div>

      </div>

      {/* Barra de Búsqueda y Filtros */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#131521] border border-[#2E334A] rounded-2xl p-4">
        
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por @username, nombre o correo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#090B14] border border-[#2E334A] focus:border-[#783DF2] rounded-xl text-xs text-[#F8FAFC] placeholder:text-[#64748B] outline-none transition-all"
          />
        </div>

        {/* Filtro por Rol */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setRoleFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              roleFilter === 'ALL'
                ? 'bg-[#783DF2] text-white shadow-md'
                : 'bg-[#090B14] text-[#94A3B8] hover:text-white border border-[#2E334A]'
            }`}
          >
            Todos ({users.length})
          </button>
          <button
            type="button"
            onClick={() => setRoleFilter('ADMIN')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              roleFilter === 'ADMIN'
                ? 'bg-[#783DF2] text-white shadow-md'
                : 'bg-[#090B14] text-[#94A3B8] hover:text-white border border-[#2E334A]'
            }`}
          >
            <ShieldAlert className="w-3 h-3 text-[#1FD1EB]" />
            Admins ({totalAdmins})
          </button>
          <button
            type="button"
            onClick={() => setRoleFilter('USER')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              roleFilter === 'USER'
                ? 'bg-[#10B981] text-white shadow-md'
                : 'bg-[#090B14] text-[#94A3B8] hover:text-white border border-[#2E334A]'
            }`}
          >
            <User className="w-3 h-3" />
            Usuarios ({totalStandardUsers})
          </button>
        </div>

      </div>

      {/* Tabla de Usuarios y Administradores */}
      <div className="bg-[#131521] border border-[#2E334A] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#94A3B8]">
            <thead className="bg-[#090B14] text-[#F8FAFC] uppercase text-[10px] tracking-wider font-extrabold border-b border-[#2E334A]">
              <tr>
                <th className="py-3.5 px-4">Usuario Gamer</th>
                <th className="py-3.5 px-4">Nombre Completo</th>
                <th className="py-3.5 px-4">Rol & Permisos</th>
                <th className="py-3.5 px-4 text-center">Nivel / XP</th>
                <th className="py-3.5 px-4 text-center">Racha</th>
                <th className="py-3.5 px-4 text-center">GameCoins</th>
                <th className="py-3.5 px-4 text-right">Acciones de Staff</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2E334A]">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-xs text-[#94A3B8]">
                    No se encontraron usuarios o administradores que coincidan con la búsqueda.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-[#1A1C2B]/50 transition-colors">
                    
                    {/* Usuario Gamer */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl overflow-hidden border border-[#783DF2] bg-[#1C1730] shrink-0 shadow-md">
                          <img
                            src={getAvatarUrl(user.avatarUrl, user.username)}
                            alt={user.username}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = getAvatarUrl(null, user.username);
                            }}
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="text-white font-bold text-xs truncate">
                            @{user.username}
                          </div>
                          <div className="text-[#64748B] text-[10px] truncate">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Nombre Completo */}
                    <td className="py-3.5 px-4 text-white font-medium">
                      {user.fullName || <span className="text-[#64748B] italic">No asignado</span>}
                    </td>

                    {/* Rol & Permisos */}
                    <td className="py-3.5 px-4">
                      {user.role === 'ADMIN' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black bg-[#783DF2]/20 text-[#1FD1EB] border border-[#783DF2]/40 shadow-[0_0_10px_rgba(120,61,242,0.3)]">
                          <ShieldAlert className="w-3 h-3 text-[#1FD1EB]" />
                          ADMINISTRADOR
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30">
                          <User className="w-3 h-3" />
                          USUARIO
                        </span>
                      )}
                    </td>

                    {/* Nivel / XP */}
                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2 py-0.5 rounded-md bg-[#1C1730] border border-[#783DF2]/30 text-[#1FD1EB] font-bold text-[10px]">
                        LVL {user.currentLevel} ({user.totalXp} XP)
                      </span>
                    </td>

                    {/* Racha */}
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center gap-1 text-[#10B981] font-bold">
                        <Flame className="w-3.5 h-3.5" />
                        {user.currentStreak} días
                      </span>
                    </td>

                    {/* GameCoins */}
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center gap-1 text-[#F59E0B] font-bold">
                        <Coins className="w-3.5 h-3.5" />
                        {user.gamecoinsBalance} GC
                      </span>
                    </td>

                    {/* Acciones de Staff */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleToggleRole(user)}
                        disabled={togglingId === user.id}
                        className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer border ${
                          user.role === 'ADMIN'
                            ? 'bg-[#EF4444]/10 hover:bg-[#EF4444]/20 text-[#EF4444] border-[#EF4444]/30'
                            : 'bg-[#783DF2]/15 hover:bg-[#783DF2]/30 text-[#1FD1EB] border-[#783DF2]/40'
                        } disabled:opacity-50`}
                      >
                        {togglingId === user.id ? (
                          <span className="flex items-center gap-1">
                            <Loader2 className="w-3 h-3 animate-spin" /> Actualizando...
                          </span>
                        ) : user.role === 'ADMIN' ? (
                          'Revocar Admin'
                        ) : (
                          'Promover a Admin'
                        )}
                      </button>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Creación de Administrador */}
      <CreateAdminModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onAdminCreated={async () => {
          const { getAdminUsersListAction } = await import('@/app/actions/admin-users.actions');
          const updated = await getAdminUsersListAction();
          setUsers(updated);
        }}
      />

    </div>
  );
}
