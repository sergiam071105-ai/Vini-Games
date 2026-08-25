'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Coins, 
  Flame, 
  User, 
  LogOut, 
  Menu, 
  X,
  Library,
  Heart,
  MessageSquare,
  ShieldAlert,
  Home,
  Gamepad2,
  Search
} from 'lucide-react';
import { getLevelProgress } from '@/lib/gamification/level-calculator';
import { useWishlist } from '@/lib/context/wishlist-context';

interface Profile {
  id: string;
  role: 'VISITOR' | 'USER' | 'ADMIN';
  username: string | null;
  avatar_url: string | null;
  gamecoins_balance: number;
  total_xp: number;
  current_level: number;
  current_streak: number;
}

interface HeaderProps {
  profile: Profile | null;
}

export function Header({ profile }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { wishlistCount } = useWishlist();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // If no profile, use mock guest stats for Sprint 1 demo
  const displayProfile = profile || {
    id: '',
    role: 'USER' as const,
    username: 'Invitado_Gamer',
    avatar_url: null,
    gamecoins_balance: 120,
    total_xp: 120, // Nivel 2
    current_level: 2,
    current_streak: 3
  };

  const { level, percentage } = getLevelProgress(displayProfile.total_xp);

  const navLinks = [
    { href: '/', label: 'Inicio', icon: Home },
    { href: '/catalog', label: 'Tienda', icon: Gamepad2 },
    { href: '/library', label: 'Biblioteca', icon: Library },
    { href: '/wishlist', label: 'Deseados', icon: Heart },
    { href: '/chat', label: 'ViniChat', icon: MessageSquare },
  ];

  return (
    <header className="sticky top-0 z-50 w-full h-[82px] bg-[#0B0D18]/90 backdrop-blur-md border-b border-[#2D3349] px-4 md:px-8 flex items-center">
      <div className="w-full flex items-center justify-between gap-4">
        
        {/* Brand Logo & Desktop Navigation */}
        <div className="flex items-center gap-6 flex-shrink-0">
          <Link href="/" className="flex items-center flex-shrink-0 hover:opacity-90 transition-opacity select-none">
            <Image 
              src="/logo.png" 
              alt="ViniGames Logo" 
              width={110}
              height={62}
              priority
              className="w-[110px] h-[62px] object-contain flex-shrink-0"
            />
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-[#1A1C2B] text-[#1FD1EB]' 
                      : 'text-[#949CB2] hover:text-[#F5F7FF] hover:bg-[#1A1C2B]/50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                  {link.href === '/wishlist' && wishlistCount > 0 && (
                    <span className="ml-1 px-1.5 py-0.2 bg-pink-500/20 text-pink-400 border border-pink-500/40 text-[10px] font-bold rounded-full">
                      {wishlistCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="hidden lg:flex items-center relative w-48 xl:w-64">
          <Search className="absolute left-3 h-4 w-4 text-[#949CB2] pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar juegos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1A1C2B] border border-[#2D3349] rounded-xl pl-9 pr-4 py-1.5 text-xs text-[#F5F7FF] placeholder-[#949CB2] focus:outline-none focus:border-[#783DF2] focus:ring-1 focus:ring-[#783DF2]/30 transition-all"
          />
        </form>

        {/* Gamer Status Widgets */}
        <div className="hidden md:flex items-center gap-4 flex-shrink-0">
          
          {/* Level / XP Progress Widget */}
          <div className="flex flex-col gap-1 w-44 bg-[#1A1C2B] border border-[#2D3349] rounded-lg px-3 py-1.5">
            <div className="flex justify-between items-center text-[10px] font-bold text-[#949CB2]">
              <span>LVL {level}</span>
              <span className="text-[#783DF2]">{percentage}% XP</span>
            </div>
            <div className="w-full h-1.5 bg-[#080A13] rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#783DF2] to-[#aa87ff] rounded-full transition-all duration-500" 
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>

          {/* GameCoins Balance Widget */}
          <div className="flex items-center gap-1.5 bg-[#1A1C2B] border border-[#2D3349] rounded-lg px-3 py-1.5">
            <Coins className="h-4 w-4 text-[#1FD1EB]" />
            <span className="text-xs font-bold text-[#F5F7FF]">
              ◈ {displayProfile.gamecoins_balance}
            </span>
          </div>

          {/* Streak Widget */}
          <div className="flex items-center gap-1.5 bg-[#1A1C2B] border border-[#2D3349] rounded-lg px-3 py-1.5">
            <Flame className="h-4 w-4 text-[#10B981]" />
            <span className="text-xs font-bold text-[#F5F7FF]">
              🔥 {displayProfile.current_streak} días
            </span>
          </div>

          {/* User Account / Profile Dropdown */}
          {profile ? (
            <div className="relative">
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 bg-[#1A1C2B] hover:bg-[#131421] border border-[#2D3349] rounded-lg p-1.5 transition-colors cursor-pointer"
              >
                <div className="h-6 w-6 rounded bg-[#783DF2] flex items-center justify-center font-bold text-[#F5F7FF] text-xs">
                  {displayProfile.username?.substring(0, 2).toUpperCase() || 'G'}
                </div>
              </button>
              
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[#1A1C2B] border border-[#2D3349] rounded-lg shadow-xl py-1">
                  <div className="px-4 py-2 border-b border-[#2D3349]">
                    <p className="text-xs text-[#949CB2]">Identidad Gamer</p>
                    <p className="text-sm font-bold text-[#F5F7FF] truncate">@{displayProfile.username}</p>
                  </div>
                  {displayProfile.role === 'ADMIN' && (
                    <Link 
                      href="/admin" 
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-[#1FD1EB] hover:bg-[#131421] transition-colors"
                    >
                      <ShieldAlert className="h-4 w-4" />
                      Panel ViniAdmin
                    </Link>
                  )}
                  <Link 
                    href="/profile" 
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-xs text-[#F5F7FF] hover:bg-[#131421] transition-colors"
                  >
                    <User className="h-4 w-4" />
                    Mi Perfil
                  </Link>
                  <button
                    onClick={async () => {
                      // Import dynamic actions to prevent issues
                      const { signOutAction } = await import('@/app/actions/auth.actions');
                      await signOutAction();
                      setDropdownOpen(false);
                    }}
                    className="flex w-full items-center gap-2 px-4 py-2 text-xs text-[#EF4444] hover:bg-[#131421] transition-colors text-left"
                  >
                    <LogOut className="h-4 w-4" />
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link 
              href="/login" 
              className="bg-[#783DF2] hover:bg-[#783DF2]/80 text-[#F5F7FF] text-xs font-bold px-4 py-2 rounded-lg transition-colors"
            >
              Iniciar Sesión
            </Link>
          )}

        </div>

        {/* Mobile Navigation controls */}
        <div className="flex md:hidden items-center gap-2 flex-shrink-0">
          {/* Coins for mobile */}
          <div className="flex items-center gap-1 bg-[#1A1C2B] rounded-lg px-2.5 py-1">
            <Coins className="h-3.5 w-3.5 text-[#1FD1EB]" />
            <span className="text-[11px] font-bold text-[#F5F7FF]">
              {displayProfile.gamecoins_balance}
            </span>
          </div>

          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-[#949CB2] hover:text-[#F5F7FF] p-1.5 rounded-lg bg-[#1A1C2B]"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden w-full bg-[#080A13] border-t border-[#2D3349] mt-3 py-4 flex flex-col gap-4">
          {/* Mobile Search */}
          <form onSubmit={(e) => { handleSearchSubmit(e); setMobileMenuOpen(false); }} className="flex lg:hidden items-center relative mx-4 mb-2">
            <Search className="absolute left-3 h-4 w-4 text-[#949CB2] pointer-events-none" />
            <input
              type="text"
              placeholder="Buscar juegos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1A1C2B] border border-[#2D3349] rounded-xl pl-9 pr-4 py-2 text-xs text-[#F5F7FF] placeholder-[#949CB2] focus:outline-none focus:border-[#783DF2] focus:ring-1 focus:ring-[#783DF2]/30 transition-all"
            />
          </form>

          <nav className="flex flex-col gap-1.5 px-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-sm font-medium ${
                    isActive 
                      ? 'bg-[#1A1C2B] text-[#1FD1EB]' 
                      : 'text-[#949CB2] hover:text-[#F5F7FF] hover:bg-[#1A1C2B]/50'
                  }`}
                >
                  <Icon className="h-4.5 w-4.5" />
                  {link.label}
                  {link.href === '/wishlist' && wishlistCount > 0 && (
                    <span className="ml-auto px-2 py-0.5 bg-pink-500/20 text-pink-400 border border-pink-500/40 text-xs font-bold rounded-full">
                      {wishlistCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Gamification widgets in Mobile Menu */}
          <div className="border-t border-[#2D3349] pt-4 px-4 flex flex-col gap-3">
            {/* Level / XP info */}
            <div className="flex flex-col gap-1 bg-[#1A1C2B] border border-[#2D3349] rounded-lg p-3">
              <div className="flex justify-between items-center text-[10px] font-bold text-[#949CB2]">
                <span>LVL {level}</span>
                <span className="text-[#783DF2]">{percentage}% XP</span>
              </div>
              <div className="w-full h-1.5 bg-[#080A13] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#783DF2] to-[#aa87ff]" 
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>

            <div className="flex gap-2">
              {/* Streak */}
              <div className="flex-1 flex items-center justify-center gap-1.5 bg-[#1A1C2B] border border-[#2D3349] rounded-lg py-2">
                <Flame className="h-4 w-4 text-[#10B981]" />
                <span className="text-xs font-bold text-[#F5F7FF]">
                  🔥 {displayProfile.current_streak} días
                </span>
              </div>
            </div>

            {/* Mobile Auth Button */}
            {profile ? (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 bg-[#1A1C2B] rounded-lg p-2">
                  <div className="h-8 w-8 rounded bg-[#783DF2] flex items-center justify-center font-bold text-[#F5F7FF] text-sm">
                    {displayProfile.username?.substring(0, 2).toUpperCase() || 'G'}
                  </div>
                  <div className="truncate">
                    <p className="text-[10px] text-[#949CB2]">Conectado como</p>
                    <p className="text-xs font-bold text-[#F5F7FF]">@{displayProfile.username}</p>
                  </div>
                </div>
                {displayProfile.role === 'ADMIN' && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 border border-[#1FD1EB] text-[#1FD1EB] text-xs font-bold py-2 rounded-lg hover:bg-[#1FD1EB]/10 transition-colors"
                  >
                    <ShieldAlert className="h-4 w-4" />
                    Panel ViniAdmin
                  </Link>
                )}
                <button
                  onClick={async () => {
                    const { signOutAction } = await import('@/app/actions/auth.actions');
                    await signOutAction();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 border border-[#EF4444] text-[#EF4444] text-xs font-bold py-2 rounded-lg hover:bg-[#EF4444]/10 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <Link 
                href="/login" 
                onClick={() => setMobileMenuOpen(false)}
                className="w-full bg-[#783DF2] hover:bg-[#783DF2]/80 text-[#F5F7FF] text-center text-xs font-bold py-2.5 rounded-lg transition-colors"
              >
                Iniciar Sesión
              </Link>
            )}
          </div>
        </div>
      )}

    </header>
  );
}
