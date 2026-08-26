'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Gamepad2,
  Search,
  Plus,
  Edit,
  Power,
  CheckCircle2,
  XCircle,
  ArrowUpDown,
  Filter,
  Loader2,
  ExternalLink,
} from 'lucide-react';
import {
  getAdminGamesAction,
  toggleGameActiveStatusAction,
  AdminGameItem,
} from '@/app/actions/games.admin.actions';

export default function AdminGamesPage() {
  const [games, setGames] = useState<AdminGameItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');
  const [togglingId, setTogglingId] = useState<number | null>(null);

  const fetchGames = async () => {
    setLoading(true);
    try {
      const data = await getAdminGamesAction();
      setGames(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  const handleToggleActive = async (id: number) => {
    setTogglingId(id);
    try {
      const res = await toggleGameActiveStatusAction(id);
      if (res.success && res.newStatus !== undefined) {
        setGames((prev) =>
          prev.map((g) => (g.id === id ? { ...g, isActive: res.newStatus! } : g))
        );
      }
    } finally {
      setTogglingId(null);
    }
  };

  // Filtrado reactivo en cliente
  const filteredGames = games.filter((g) => {
    const matchesSearch =
      g.title.toLowerCase().includes(search.toLowerCase()) ||
      g.developer.toLowerCase().includes(search.toLowerCase()) ||
      g.slug.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;

    if (statusFilter === 'ACTIVE') return g.isActive;
    if (statusFilter === 'INACTIVE') return !g.isActive;
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2E334A] pb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#F8FAFC] flex items-center gap-3">
            <Gamepad2 className="w-7 h-7 text-[#783DF2]" />
            Catálogo de Videojuegos
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1">
            Administración centralizada de títulos, precios, descuentos y visibilidad en la tienda.
          </p>
        </div>

        <Link
          href="/admin/games/new"
          className="self-start sm:self-auto px-4 py-2.5 bg-[#783DF2] hover:bg-[#6929e4] text-[#F8FAFC] rounded-xl text-xs font-bold transition-all shadow-lg shadow-[#783DF2]/30 flex items-center gap-2 uppercase tracking-wider cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Nuevo Videojuego
        </Link>
      </div>

      {/* Barra de Búsqueda y Filtros */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#131521] border border-[#2E334A] rounded-2xl p-4">
        
        {/* Buscador */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por título o desarrollador..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#1A1C2B] border border-[#2E334A] focus:border-[#783DF2] rounded-xl pl-9 pr-4 py-2 text-xs text-[#F8FAFC] placeholder-[#94A3B8] focus:outline-none transition-all"
          />
        </div>

        {/* Pestañas de Filtro de Estado */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto bg-[#1A1C2B] p-1 rounded-xl border border-[#2E334A]">
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              statusFilter === 'ALL'
                ? 'bg-[#783DF2] text-[#F8FAFC] shadow-sm'
                : 'text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            Todos ({games.length})
          </button>

          <button
            onClick={() => setStatusFilter('ACTIVE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              statusFilter === 'ACTIVE'
                ? 'bg-[#10B981] text-white shadow-sm'
                : 'text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            Activos ({games.filter((g) => g.isActive).length})
          </button>

          <button
            onClick={() => setStatusFilter('INACTIVE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              statusFilter === 'INACTIVE'
                ? 'bg-[#EF4444] text-white shadow-sm'
                : 'text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            Inactivos ({games.filter((g) => !g.isActive).length})
          </button>
        </div>

      </div>

      {/* Tabla Principal */}
      <div className="bg-[#131521] border border-[#2E334A] rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-center space-y-3">
            <Loader2 className="w-8 h-8 text-[#783DF2] animate-spin" />
            <p className="text-xs text-[#94A3B8]">Cargando catálogo de videojuegos...</p>
          </div>
        ) : filteredGames.length === 0 ? (
          <div className="py-16 text-center text-xs text-[#94A3B8]">
            No se encontraron videojuegos que coincidan con los filtros aplicados.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] text-[#94A3B8] uppercase tracking-wider bg-[#0B0D18]/80 border-b border-[#2E334A]">
                <tr>
                  <th className="py-3.5 px-4">Videojuego</th>
                  <th className="py-3.5 px-4">Estudio</th>
                  <th className="py-3.5 px-4">Categorías</th>
                  <th className="py-3.5 px-4">Precio Base</th>
                  <th className="py-3.5 px-4">Descuento</th>
                  <th className="py-3.5 px-4">Precio Final</th>
                  <th className="py-3.5 px-4">Estado</th>
                  <th className="py-3.5 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2E334A]/50">
                {filteredGames.map((game) => (
                  <tr
                    key={game.id}
                    className={`hover:bg-[#1A1C2B]/50 transition-colors ${
                      !game.isActive ? 'opacity-60 bg-red-950/5' : ''
                    }`}
                  >
                    {/* Videojuego */}
                    <td className="py-3 px-4 flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#090B14] flex-shrink-0 relative border border-[#2E334A]">
                        <Image
                          src={game.coverImageUrl}
                          alt={game.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <Link
                          href={`/games/${game.slug}`}
                          target="_blank"
                          className="font-bold text-sm text-[#F8FAFC] hover:text-[#1FD1EB] transition-colors flex items-center gap-1.5"
                        >
                          {game.title}
                          <ExternalLink className="w-3 h-3 text-[#94A3B8]" />
                        </Link>
                        <span className="text-[11px] text-[#94A3B8] font-mono">
                          /{game.slug}
                        </span>
                      </div>
                    </td>

                    {/* Estudio */}
                    <td className="py-3 px-4 text-[#94A3B8] font-medium">{game.developer}</td>

                    {/* Categorías */}
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {game.categories.map((c) => (
                          <span
                            key={c.id}
                            className="px-2 py-0.5 rounded-md bg-[#1A1C2B] text-[#94A3B8] border border-[#2E334A]/60 text-[10px] font-medium"
                          >
                            {c.name}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Precio Base */}
                    <td className="py-3 px-4 text-[#94A3B8]">Bs. {game.basePrice}</td>

                    {/* Descuento */}
                    <td className="py-3 px-4">
                      {game.discountPercent > 0 ? (
                        <span className="px-2 py-0.5 rounded bg-[#10B981]/20 border border-[#10B981]/40 text-[#10B981] text-[10px] font-extrabold">
                          -{game.discountPercent}% OFF
                        </span>
                      ) : (
                        <span className="text-[#94A3B8] text-[11px]">0%</span>
                      )}
                    </td>

                    {/* Precio Final */}
                    <td className="py-3 px-4 font-black text-sm text-[#1FD1EB]">
                      Bs. {game.finalPrice}
                    </td>

                    {/* Estado */}
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleActive(game.id)}
                        disabled={togglingId === game.id}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
                          game.isActive
                            ? 'bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/40 hover:bg-[#EF4444]/20 hover:text-[#EF4444] hover:border-[#EF4444]/50'
                            : 'bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/40 hover:bg-[#10B981]/20 hover:text-[#10B981] hover:border-[#10B981]/50'
                        }`}
                        title={game.isActive ? 'Click para desactivar (baja lógica)' : 'Click para activar en catálogo'}
                      >
                        {togglingId === game.id ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : game.isActive ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : (
                          <XCircle className="w-3 h-3" />
                        )}
                        <span>{game.isActive ? 'Activo' : 'Inactivo'}</span>
                      </button>
                    </td>

                    {/* Acciones */}
                    <td className="py-3 px-4 text-right">
                      <Link
                        href={`/admin/games/${game.id}/edit`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1A1C2B] hover:bg-[#783DF2] text-[#F8FAFC] rounded-lg transition-colors text-xs font-semibold border border-[#2E334A]"
                      >
                        <Edit className="w-3 h-3" />
                        <span>Editar</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
