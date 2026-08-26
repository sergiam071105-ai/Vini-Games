import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Gamepad2,
  TrendingUp,
  Percent,
  Plus,
  ArrowRight,
  ShieldCheck,
  Layers,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { getAdminGamesAction, getAllCategoriesAction } from '@/app/actions/games.admin.actions';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const games = await getAdminGamesAction();
  const categories = await getAllCategoriesAction();

  const totalGames = games.length;
  const activeGames = games.filter((g) => g.isActive).length;
  const discountedGames = games.filter((g) => g.discountPercent > 0).length;
  const avgPrice =
    totalGames > 0
      ? Math.round(games.reduce((acc, g) => acc + g.finalPrice, 0) / totalGames)
      : 0;

  const recentGames = games.slice(0, 5);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Encabezado del Dashboard */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2E334A] pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#1FD1EB] uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4 text-[#10B981]" />
            Panel Ejecutivo ViniAdmin
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#F8FAFC]">
            Dashboard de Control y Catálogo
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1">
            Resumen en vivo del catálogo, estados de publicación y métricas comerciales.
          </p>
        </div>

        <Link
          href="/admin/games/new"
          className="self-start sm:self-auto px-4 py-2.5 bg-[#783DF2] hover:bg-[#6929e4] text-[#F8FAFC] rounded-xl text-xs font-bold transition-all shadow-lg shadow-[#783DF2]/30 flex items-center gap-2 uppercase tracking-wider cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Registrar Videojuego
        </Link>
      </div>

      {/* Grid de Métricas y KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Catálogo Total */}
        <div className="bg-[#131521] border border-[#2E334A] rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-[#783DF2]/50 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-[#94A3B8] font-semibold">Títulos en Catálogo</span>
            <div className="w-8 h-8 rounded-lg bg-[#783DF2]/20 text-[#783DF2] flex items-center justify-center">
              <Gamepad2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#F8FAFC] mb-1">{totalGames}</div>
          <span className="text-[11px] text-[#10B981] font-semibold">
            {activeGames} activos ({Math.round((activeGames / (totalGames || 1)) * 100)}%)
          </span>
        </div>

        {/* KPI 2: Descuentos */}
        <div className="bg-[#131521] border border-[#2E334A] rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-[#10B981]/50 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-[#94A3B8] font-semibold">En Oferta Activa</span>
            <div className="w-8 h-8 rounded-lg bg-[#10B981]/20 text-[#10B981] flex items-center justify-center">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#10B981] mb-1">{discountedGames}</div>
          <span className="text-[11px] text-[#94A3B8]">
            Con precios promocionales vigentes
          </span>
        </div>

        {/* KPI 3: Precio Promedio */}
        <div className="bg-[#131521] border border-[#2E334A] rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-[#1FD1EB]/50 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-[#94A3B8] font-semibold">Precio Promedio</span>
            <div className="w-8 h-8 rounded-lg bg-[#1FD1EB]/20 text-[#1FD1EB] flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#1FD1EB] mb-1">Bs. {avgPrice}</div>
          <span className="text-[11px] text-[#94A3B8]">
            Moneda oficial boliviana
          </span>
        </div>

        {/* KPI 4: Categorías */}
        <div className="bg-[#131521] border border-[#2E334A] rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-[#783DF2]/50 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-[#94A3B8] font-semibold">Categorías Registradas</span>
            <div className="w-8 h-8 rounded-lg bg-[#783DF2]/20 text-[#1FD1EB] flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#F8FAFC] mb-1">{categories.length}</div>
          <span className="text-[11px] text-[#94A3B8]">
            Filtros temáticos gamer
          </span>
        </div>

      </div>

      {/* Tabla Resumen de Videojuegos Recientes */}
      <div className="bg-[#131521] border border-[#2E334A] rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#2E334A]">
          <div>
            <h2 className="text-base font-bold text-[#F8FAFC]">Videojuegos Recientes en Catálogo</h2>
            <p className="text-xs text-[#94A3B8]">Últimos títulos sincronizados en la base de datos.</p>
          </div>
          <Link
            href="/admin/games"
            className="text-xs font-bold text-[#1FD1EB] hover:text-[#783DF2] flex items-center gap-1.5 transition-colors"
          >
            Ver Catálogo Completo
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[11px] text-[#94A3B8] uppercase tracking-wider border-b border-[#2E334A]/80">
              <tr>
                <th className="py-3 px-2">Videojuego</th>
                <th className="py-3 px-2">Estudio</th>
                <th className="py-3 px-2">Categorías</th>
                <th className="py-3 px-2">Precio Base</th>
                <th className="py-3 px-2">Descuento</th>
                <th className="py-3 px-2">Precio Final</th>
                <th className="py-3 px-2">Estado</th>
                <th className="py-3 px-2 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2E334A]/40">
              {recentGames.map((game) => (
                <tr key={game.id} className="hover:bg-[#1A1C2B]/50 transition-colors">
                  <td className="py-3 px-2 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-[#090B14] flex-shrink-0 relative border border-[#2E334A]">
                      <Image
                        src={game.coverImageUrl}
                        alt={game.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="font-bold text-[#F8FAFC] truncate max-w-[180px]">
                      {game.title}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-[#94A3B8]">{game.developer}</td>
                  <td className="py-3 px-2">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {game.categories.map((c) => (
                        <span
                          key={c.id}
                          className="px-1.5 py-0.2 rounded bg-[#1A1C2B] text-[#94A3B8] text-[10px]"
                        >
                          {c.name}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-2 text-[#94A3B8]">Bs. {game.basePrice}</td>
                  <td className="py-3 px-2">
                    {game.discountPercent > 0 ? (
                      <span className="px-1.5 py-0.5 rounded bg-[#10B981]/20 text-[#10B981] font-bold">
                        -{game.discountPercent}%
                      </span>
                    ) : (
                      <span className="text-[#94A3B8]">0%</span>
                    )}
                  </td>
                  <td className="py-3 px-2 font-bold text-[#1FD1EB]">
                    Bs. {game.finalPrice}
                  </td>
                  <td className="py-3 px-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        game.isActive
                          ? 'bg-[#10B981]/20 text-[#10B981]'
                          : 'bg-[#EF4444]/20 text-[#EF4444]'
                      }`}
                    >
                      {game.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-right">
                    <Link
                      href={`/admin/games/${game.id}/edit`}
                      className="px-2.5 py-1 bg-[#1A1C2B] hover:bg-[#783DF2] text-[#F8FAFC] rounded-lg transition-colors inline-block"
                    >
                      Editar
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
