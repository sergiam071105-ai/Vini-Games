'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  UserRound, 
  Pencil, 
  Gamepad2, 
  Trophy, 
  Flame, 
  Coins, 
  MessageSquare, 
  Sparkles, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  Lock, 
  Star,
  ExternalLink,
  ShieldCheck,
  Compass,
  Swords,
  BookOpen,
  Boxes
} from 'lucide-react';
import { getLevelProgress } from '@/lib/gamification/level-calculator';
import { FullProfilePayload, UserProfileData } from '@/app/actions/profile.actions';
import { EditProfileModal } from '@/components/profile/edit-profile-modal';

interface ProfileClientViewProps {
  initialData: FullProfilePayload;
}

export function ProfileClientView({ initialData }: ProfileClientViewProps) {
  const [profile, setProfile] = useState<UserProfileData>(initialData.profile);
  const [activeTab, setActiveTab] = useState<'games' | 'achievements' | 'reviews' | 'rewards'>('games');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { level, percentage } = getLevelProgress(profile.totalXp);

  // Calcular arquetipo dominante del Gamer DNA
  const dnaScores = [
    { name: 'Exploración', score: profile.dnaExploration, icon: Compass, color: '#1FD1EB' },
    { name: 'Competitivo', score: profile.dnaCompetitive, icon: Swords, color: '#EF4444' },
    { name: 'Narrativa', score: profile.dnaNarrative, icon: BookOpen, color: '#783DF2' },
    { name: 'Colección', score: profile.dnaCollection, icon: Boxes, color: '#F59E0B' },
  ];
  const dominantDna = [...dnaScores].sort((a, b) => b.score - a.score)[0];

  const handleProfileUpdated = (updated: { username: string; fullName: string; bio: string; avatarUrl: string }) => {
    setProfile((prev) => ({
      ...prev,
      username: updated.username,
      fullName: updated.fullName,
      bio: updated.bio,
      avatarUrl: updated.avatarUrl,
    }));
  };

  return (
    <div className="w-full space-y-8 text-white animate-in fade-in duration-300">
      
      {/* 1. Header Banner de Perfil */}
      <section className="relative overflow-hidden rounded-3xl border border-[#2D3349] bg-[#131521] p-6 md:p-8 shadow-xl">
        {/* Glow decorativo de fondo */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#783DF2]/15 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-[#1FD1EB]/10 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center">
          
          {/* Avatar del Jugador */}
          <div className="relative flex-shrink-0">
            <div className="h-32 w-32 md:h-36 md:w-36 overflow-hidden rounded-3xl border-2 border-[#783DF2]/60 bg-[#1C1730] shadow-lg shadow-[#783DF2]/20">
              {profile.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt={profile.username}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <UserRound className="h-16 w-16 text-[#783DF2]" />
                </div>
              )}
            </div>
            <div className="absolute -bottom-2 -right-2 rounded-xl border border-[#2D3349] bg-[#0B0D18] px-2.5 py-1 text-[11px] font-black text-[#1FD1EB] shadow-md">
              LVL {level}
            </div>
          </div>

          {/* Información del Perfil */}
          <div className="flex-1 space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white">
                {profile.fullName || profile.username}
              </h1>
              <span className="rounded-full bg-[#1A1C2B] border border-[#2D3349] px-3 py-0.5 text-xs font-semibold text-[#949CB2]">
                @{profile.username}
              </span>
              {profile.role === 'ADMIN' && (
                <span className="flex items-center gap-1 rounded-full bg-[#1FD1EB]/10 border border-[#1FD1EB]/30 px-2.5 py-0.5 text-[10px] font-bold text-[#1FD1EB]">
                  <ShieldCheck className="h-3 w-3" />
                  ADMIN
                </span>
              )}
            </div>

            <p className="text-xs font-bold uppercase tracking-wider text-[#1FD1EB]">
              NIVEL {level} • {dominantDna.name.toUpperCase()} CIBERNÉTICO
            </p>

            {/* Barra de Progreso de XP */}
            <div className="max-w-md space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-[#949CB2]">
                <span>{profile.totalXp} XP Acumulados</span>
                <span className="text-[#783DF2] font-bold">{percentage}% para Nivel {level + 1}</span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-[#080A13] border border-[#2D3349]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#783DF2] to-[#1FD1EB] transition-all duration-700 shadow-sm"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>

            {/* Biografía */}
            <p className="text-xs md:text-sm text-[#949CB2] max-w-xl leading-relaxed">
              {profile.bio}
            </p>
          </div>

          {/* Botón Editar Perfil */}
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="self-start md:self-center flex items-center gap-2 rounded-2xl border border-[#2D3349] bg-[#1A1C2B] hover:bg-[#25283D] hover:border-[#783DF2]/50 px-5 py-3 text-xs font-bold text-[#F5F7FF] transition-all cursor-pointer shadow-md hover:shadow-[#783DF2]/20 active:scale-95"
          >
            <Pencil className="h-4 w-4 text-[#1FD1EB]" />
            Editar Perfil
          </button>
        </div>
      </section>

      {/* 2. Estadísticas Rápidas (4 Métricas Clave) */}
      <section className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        
        {/* Juegos en Biblioteca */}
        <div 
          onClick={() => setActiveTab('games')}
          className="group cursor-pointer rounded-2xl border border-[#2D3349] bg-[#131521] hover:border-[#783DF2]/60 p-5 transition-all hover:-translate-y-0.5 shadow-md"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#783DF2]/15 text-[#783DF2] group-hover:scale-110 transition-transform">
              <Gamepad2 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-black text-white">{profile.gamesCount}</p>
              <p className="text-xs font-semibold text-[#949CB2]">Juegos en Biblioteca</p>
            </div>
          </div>
        </div>

        {/* Logros Desbloqueados */}
        <div 
          onClick={() => setActiveTab('achievements')}
          className="group cursor-pointer rounded-2xl border border-[#2D3349] bg-[#131521] hover:border-[#1FD1EB]/60 p-5 transition-all hover:-translate-y-0.5 shadow-md"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1FD1EB]/15 text-[#1FD1EB] group-hover:scale-110 transition-transform">
              <Trophy className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-black text-white">{profile.achievementsCount}</p>
              <p className="text-xs font-semibold text-[#949CB2]">Logros Obtenidos</p>
            </div>
          </div>
        </div>

        {/* Racha Diaria */}
        <div 
          onClick={() => setActiveTab('rewards')}
          className="group cursor-pointer rounded-2xl border border-[#2D3349] bg-[#131521] hover:border-[#10B981]/60 p-5 transition-all hover:-translate-y-0.5 shadow-md"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#10B981]/15 text-[#10B981] group-hover:scale-110 transition-transform">
              <Flame className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-black text-white">{profile.currentStreak} días</p>
              <p className="text-xs font-semibold text-[#949CB2]">Racha Activa (Récord: {profile.longestStreak})</p>
            </div>
          </div>
        </div>

        {/* Saldo GameCoins */}
        <Link 
          href="/gamification"
          className="group rounded-2xl border border-[#2D3349] bg-[#131521] hover:border-[#F59E0B]/60 p-5 transition-all hover:-translate-y-0.5 shadow-md"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F59E0B]/15 text-[#F59E0B] group-hover:scale-110 transition-transform">
              <Coins className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-black text-white">{profile.gamecoinsBalance} GC</p>
              <p className="text-xs font-semibold text-[#949CB2]">Saldo GameCoins</p>
            </div>
          </div>
        </Link>
      </section>

      {/* 3. Gamer DNA y Racha Activa */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        
        {/* Radar Gamer DNA */}
        <div className="rounded-3xl border border-[#2D3349] bg-[#131521] p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-[#1FD1EB]" />
              Gamer DNA
            </h2>
            <span className="rounded-xl bg-[#1FD1EB]/10 border border-[#1FD1EB]/30 px-3 py-1 text-xs font-bold text-[#1FD1EB]">
              Arquetipo: {dominantDna.name}
            </span>
          </div>

          <p className="text-xs text-[#949CB2]">
            Perfil psicológico gamer calculado a partir de tus preferencias y estilo de juego en ViniGames.
          </p>

          <div className="space-y-3 pt-2">
            {dnaScores.map((dna) => {
              const Icon = dna.icon;
              return (
                <div key={dna.name} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="flex items-center gap-1.5 text-white">
                      <Icon className="h-3.5 w-3.5" style={{ color: dna.color }} />
                      {dna.name}
                    </span>
                    <span style={{ color: dna.color }}>{dna.score}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-[#080A13] border border-[#2D3349]">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${dna.score}%`, backgroundColor: dna.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Racha y Progreso de Recompensas */}
        <div className="rounded-3xl border border-[#2D3349] bg-[#131521] p-6 shadow-xl flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <Flame className="h-5 w-5 text-[#10B981]" />
                Racha y Próxima Recompensa
              </h2>
              <span className="rounded-xl bg-[#10B981]/10 border border-[#10B981]/30 px-3 py-1 text-xs font-bold text-[#10B981]">
                {profile.currentStreak} / 7 Días
              </span>
            </div>

            <p className="mt-2 text-xs text-[#949CB2]">
              Inicia sesión todos los días para multiplicar tus ganancias de GameCoins y reclamar cofres exclusivos.
            </p>

            <div className="mt-5 space-y-2">
              <div className="flex justify-between text-xs font-bold text-[#949CB2]">
                <span>Progreso semanal</span>
                <span className="text-[#10B981]">{Math.min(100, Math.round((profile.currentStreak / 7) * 100))}%</span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-[#080A13] border border-[#2D3349]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#10B981] to-[#1FD1EB] transition-all duration-700"
                  style={{ width: `${Math.min(100, (profile.currentStreak / 7) * 100)}%` }}
                />
              </div>
            </div>

            <div className="mt-4 rounded-2xl bg-[#1A1C2B] border border-[#2D3349] p-3.5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#783DF2]/20 text-[#783DF2]">
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-white">Próximo hito: Cofre Épico (Día 7)</p>
                <p className="text-[11px] text-[#949CB2]">+200 GameCoins y Medalla de Constancia</p>
              </div>
            </div>
          </div>

          <Link
            href="/gamification"
            className="flex items-center justify-center gap-2 rounded-2xl bg-[#783DF2] hover:bg-[#8B4DFF] px-6 py-3 text-xs font-bold text-white shadow-lg shadow-[#783DF2]/30 transition-all active:scale-95"
          >
            <span>Ir al Hub de Gamificación</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* 4. Navegación por Pestañas */}
      <section className="space-y-6">
        <div className="flex border-b border-[#2D3349] gap-2 md:gap-4 overflow-x-auto pb-2">
          {[
            { key: 'games', label: `Mis Juegos (${initialData.libraryGames.length})`, icon: Gamepad2 },
            { key: 'achievements', label: `Logros (${initialData.achievements.length})`, icon: Trophy },
            { key: 'reviews', label: `Mis Reseñas (${initialData.reviews.length})`, icon: MessageSquare },
            { key: 'rewards', label: 'Recompensas & Racha', icon: Flame },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex items-center gap-2 px-4 py-3 text-xs md:text-sm font-bold transition-all rounded-2xl cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-[#783DF2] text-white shadow-lg shadow-[#783DF2]/30'
                    : 'text-[#949CB2] hover:text-white hover:bg-[#131521]'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* 4.1 Pestaña: Mis Juegos */}
        {activeTab === 'games' && (
          <div className="space-y-4 animate-in fade-in">
            {initialData.libraryGames.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {initialData.libraryGames.map((game) => (
                  <div
                    key={game.id}
                    className="group flex gap-4 rounded-2xl border border-[#2D3349] bg-[#131521] p-4 transition-all hover:border-[#783DF2]/60 hover:-translate-y-0.5 shadow-md"
                  >
                    <div className="relative h-28 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-[#1A1C2B] border border-[#2D3349]">
                      <img
                        src={game.coverUrl}
                        alt={game.title}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-white line-clamp-1 group-hover:text-[#1FD1EB] transition-colors">
                          {game.title}
                        </h3>
                        <p className="text-[11px] text-[#949CB2] mt-0.5">{game.developer}</p>
                        <div className="flex items-center gap-1 text-[11px] text-[#1FD1EB] font-bold mt-1">
                          <Clock className="h-3 w-3" />
                          <span>{game.hoursPlayed || 0} hrs jugadas</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-[#2D3349]">
                        <span className="text-[10px] font-bold uppercase text-[#10B981]">
                          ● {game.installStatus === 'INSTALLED' ? 'Instalado' : 'Listo para jugar'}
                        </span>
                        <Link
                          href={`/games/${game.slug}`}
                          className="text-[11px] font-bold text-[#783DF2] hover:text-[#1FD1EB] flex items-center gap-1"
                        >
                          Ver ficha
                          <ExternalLink className="h-3 w-3" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-[#2D3349] bg-[#131521] p-12 text-center max-w-lg mx-auto space-y-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1A1C2B] text-[#949CB2]">
                  <Gamepad2 className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-bold text-white">Tu biblioteca está esperando tu primer juego</h3>
                <p className="text-xs text-[#949CB2] leading-relaxed">
                  Explora las ofertas del catálogo oficial y suma títulos legendarios a tu colección gamer.
                </p>
                <Link
                  href="/catalog"
                  className="inline-flex items-center gap-2 rounded-2xl bg-[#783DF2] hover:bg-[#8B4DFF] px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-[#783DF2]/30 transition-all"
                >
                  Explorar Catálogo
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}
          </div>
        )}

        {/* 4.2 Pestaña: Logros */}
        {activeTab === 'achievements' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {initialData.achievements.map((ach) => (
                <div
                  key={ach.id}
                  className={`rounded-2xl border p-4 transition-all ${
                    ach.unlocked
                      ? 'border-[#783DF2]/50 bg-[#131521] shadow-md shadow-[#783DF2]/10'
                      : 'border-[#2D3349]/60 bg-[#131521]/60 opacity-60'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-3xl flex-shrink-0">{ach.badgeIcon}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-white">{ach.title}</h3>
                        {ach.unlocked ? (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-[#10B981]">
                            <CheckCircle2 className="h-3 w-3" />
                            Desbloqueado
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-[#949CB2]">
                            <Lock className="h-3 w-3" />
                            Bloqueado
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#949CB2] mt-1">{ach.description}</p>
                      <div className="mt-3 flex items-center gap-2 text-[11px] font-bold">
                        <span className="text-[#783DF2]">+{ach.xpReward} XP</span>
                        <span className="text-[#949CB2]">•</span>
                        <span className="text-[#F59E0B]">+{ach.gamecoinsReward} GC</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4.3 Pestaña: Reseñas */}
        {activeTab === 'reviews' && (
          <div className="space-y-4 animate-in fade-in">
            {initialData.reviews.length > 0 ? (
              <div className="space-y-3">
                {initialData.reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="rounded-2xl border border-[#2D3349] bg-[#131521] p-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-14 w-11 flex-shrink-0 overflow-hidden rounded-lg bg-[#1A1C2B]">
                        <img src={rev.gameCoverUrl} alt={rev.gameTitle} className="h-full w-full object-cover" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">{rev.gameTitle}</h4>
                        <div className="flex items-center gap-1 text-xs text-[#F59E0B] font-bold my-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${i < rev.rating ? 'fill-[#F59E0B] text-[#F59E0B]' : 'text-[#2D3349]'}`}
                            />
                          ))}
                          <span className="ml-1 text-[#949CB2]">({rev.rating}/5)</span>
                        </div>
                        <p className="text-xs text-[#949CB2] line-clamp-2">{rev.comment}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end md:self-center">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        rev.status === 'APPROVED'
                          ? 'bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30'
                          : 'bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30'
                      }`}>
                        {rev.status === 'APPROVED' ? 'Aprobada' : 'Pendiente de moderación'}
                      </span>
                      <Link
                        href={`/games/${rev.gameSlug}`}
                        className="rounded-xl border border-[#2D3349] bg-[#1A1C2B] px-3 py-1.5 text-xs font-bold text-white hover:border-[#783DF2] transition-colors"
                      >
                        Ver en tienda
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-[#2D3349] bg-[#131521] p-10 text-center max-w-lg mx-auto space-y-3">
                <MessageSquare className="h-10 w-10 text-[#949CB2] mx-auto opacity-50" />
                <h3 className="text-sm font-bold text-white">Aún no has publicado reseñas</h3>
                <p className="text-xs text-[#949CB2]">
                  Comparte tu opinión sobre los videojuegos de tu biblioteca y ayuda a otros jugadores de la comunidad.
                </p>
              </div>
            )}
          </div>
        )}

        {/* 4.4 Pestaña: Recompensas */}
        {activeTab === 'rewards' && (
          <div className="rounded-3xl border border-[#2D3349] bg-[#131521] p-8 text-center space-y-6 animate-in fade-in max-w-2xl mx-auto">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#783DF2]/20 text-[#783DF2]">
              <Coins className="h-8 w-8" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white">Tienda de Canje con GameCoins</h3>
              <p className="text-xs text-[#949CB2] max-w-md mx-auto leading-relaxed">
                Usa tus {profile.gamecoinsBalance} GameCoins acumulados para canjear cupones de descuento exclusivos, marcos de avatar y multiplicadores de experiencia.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
              <div className="rounded-2xl border border-[#2D3349] bg-[#1A1C2B] p-4">
                <p className="text-xs font-bold text-[#1FD1EB]">Cupón 10% OFF</p>
                <p className="text-[11px] text-[#949CB2] mt-1">Descuento aplicable a cualquier compra digital.</p>
                <p className="text-xs font-bold text-white mt-3">◈ 200 GC</p>
              </div>
              <div className="rounded-2xl border border-[#2D3349] bg-[#1A1C2B] p-4">
                <p className="text-xs font-bold text-[#783DF2]">Marco Neón Épico</p>
                <p className="text-[11px] text-[#949CB2] mt-1">Personaliza el borde de tu avatar en la plataforma.</p>
                <p className="text-xs font-bold text-white mt-3">◈ 500 GC</p>
              </div>
            </div>
            <Link
              href="/gamification"
              className="inline-flex items-center gap-2 rounded-2xl bg-[#783DF2] hover:bg-[#8B4DFF] px-8 py-3 text-xs font-bold text-white shadow-lg shadow-[#783DF2]/30 transition-all"
            >
              <span>Explorar Catálogo de Recompensas</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}

      </section>

      {/* Modal de Edición de Perfil */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        currentUsername={profile.username}
        currentFullName={profile.fullName}
        currentBio={profile.bio}
        currentAvatarUrl={profile.avatarUrl}
        onProfileUpdated={handleProfileUpdated}
      />

    </div>
  );
}
