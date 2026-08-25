'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Library, Search, Sparkles, ArrowRight, Gamepad2, ArrowLeft } from 'lucide-react';
import { LibraryGameItem, getUserLibraryGamesAction } from '@/app/actions/library.actions';
import { LibraryGameCard } from '@/components/store/library-game-card';

export default function LibraryPage() {
  const [games, setGames] = useState<LibraryGameItem[]>([]);
  const [filterTab, setFilterTab] = useState<'all' | 'installed' | 'recent'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchLibrary = async () => {
    setIsLoading(true);
    try {
      const data = await getUserLibraryGamesAction();
      setGames(data);
    } catch (err) {
      console.error('Error fetching library games:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLibrary();
  }, []);

  const filteredGames = games
    .filter((g) => {
      if (filterTab === 'installed') {
        return g.installStatus === 'INSTALLED' || g.installStatus === 'READY_TO_PLAY';
      }
      return true;
    })
    .filter((g) => g.title.toLowerCase().includes(searchQuery.toLowerCase().trim()))
    .sort((a, b) => {
      if (filterTab === 'recent') {
        const dateA = a.lastPlayedAt ? new Date(a.lastPlayedAt).getTime() : 0;
        const dateB = b.lastPlayedAt ? new Date(b.lastPlayedAt).getTime() : 0;
        return dateB - dateA;
      }
      return new Date(b.acquiredAt).getTime() - new Date(a.acquiredAt).getTime();
    });

  const installedCount = games.filter(
    (g) => g.installStatus === 'INSTALLED' || g.installStatus === 'READY_TO_PLAY'
  ).length;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Encabezado */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#2E334A] pb-6">
        <div>
          <Link
            href="/catalog"
            className="inline-flex items-center gap-1.5 text-xs text-[#949CB2] hover:text-[#1FD1EB] mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Volver a la tienda
          </Link>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#F5F7FF] flex items-center gap-3">
            <Library className="w-7 h-7 text-[#783DF2]" />
            Mi Biblioteca
          </h1>
          <p className="text-xs text-[#949CB2] mt-1">
            Tus juegos guardados, progreso y tiempo de juego actual.
          </p>
        </div>

        {/* Buscador dentro de la Biblioteca */}
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#949CB2] pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar en mi biblioteca..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#131521] border border-[#2E334A] rounded-xl pl-10 pr-4 py-2 text-xs text-[#F5F7FF] placeholder-[#949CB2] focus:outline-none focus:border-[#783DF2] transition-all"
          />
        </div>
      </div>

      {/* Pestañas de Filtrado (Figma biblioteca-vinigames) */}
      <div className="flex items-center gap-2 border-b border-[#2E334A]/50 pb-4">
        <button
          onClick={() => setFilterTab('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            filterTab === 'all'
              ? 'bg-[#783DF2] text-[#F5F7FF] shadow-md shadow-[#783DF2]/30'
              : 'bg-[#131521] border border-[#2E334A] text-[#949CB2] hover:text-[#F5F7FF]'
          }`}
        >
          Todos ({games.length})
        </button>

        <button
          onClick={() => setFilterTab('installed')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            filterTab === 'installed'
              ? 'bg-[#783DF2] text-[#F5F7FF] shadow-md shadow-[#783DF2]/30'
              : 'bg-[#131521] border border-[#2E334A] text-[#949CB2] hover:text-[#F5F7FF]'
          }`}
        >
          Instalados ({installedCount})
        </button>

        <button
          onClick={() => setFilterTab('recent')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            filterTab === 'recent'
              ? 'bg-[#783DF2] text-[#F5F7FF] shadow-md shadow-[#783DF2]/30'
              : 'bg-[#131521] border border-[#2E334A] text-[#949CB2] hover:text-[#F5F7FF]'
          }`}
        >
          Jugados Recientes
        </button>
      </div>

      {/* Contenido Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-[#131521] border border-[#2E334A] rounded-2xl p-5 h-80 animate-pulse" />
          ))}
        </div>
      ) : filteredGames.length === 0 ? (
        <div className="bg-[#131521] border border-[#2E334A] rounded-2xl p-12 text-center flex flex-col items-center justify-center max-w-xl mx-auto shadow-xl">
          <div className="w-20 h-20 rounded-full bg-[#1A1C2B] border border-[#2E334A] flex items-center justify-center mb-4 text-[#949CB2]">
            <Gamepad2 className="w-10 h-10 opacity-40 text-[#783DF2]" />
          </div>
          <h2 className="text-xl font-bold text-[#F5F7FF] mb-2">
            {searchQuery ? 'No se encontraron juegos con ese título' : 'Tu biblioteca está vacía'}
          </h2>
          <p className="text-xs text-[#949CB2] max-w-sm mb-6 leading-relaxed">
            {searchQuery
              ? 'Intenta con otro término de búsqueda o limpia el filtro.'
              : 'Explora nuestro catálogo, adquiere tus primeros videojuegos y empieza a acumular horas y logros.'}
          </p>
          <Link
            href="/catalog"
            className="px-6 py-3 bg-[#783DF2] hover:bg-[#6929e4] text-[#F5F7FF] font-bold text-xs rounded-xl transition-all shadow-lg shadow-[#783DF2]/30 uppercase tracking-wider flex items-center gap-2"
          >
            Explorar Catálogo
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGames.map((game) => (
            <LibraryGameCard key={game.gameId} game={game} onRefresh={fetchLibrary} />
          ))}
        </div>
      )}

    </div>
  );
}
