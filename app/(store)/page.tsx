import { createClient } from '@/lib/supabase/server';
import { HeroBanner } from '@/components/store/hero-banner';
import { GameCard, Game } from '@/components/store/game-card';
import { OffersCarousel } from '@/components/store/offers-carousel';
import { Sparkles, Flame, Calendar, Gamepad2, Compass, BookOpen, Boxes, Swords } from 'lucide-react';
import { MOCK_GAMES } from '@/lib/mock-data/games';
import Link from 'next/link';

export default async function StoreHomePage() {
  const supabase = await createClient();
  let dbGames: Game[] = [];

  try {
    const { data } = await supabase
      .from('games')
      .select('*')
      .order('id', { ascending: true });
      
    if (data && data.length > 0) {
      dbGames = data.map(g => ({
        id: g.id,
        title: g.title,
        slug: g.slug,
        base_price: Number(g.base_price),
        discount_percent: g.discount_percent || 0,
        final_price: Number(g.final_price || (Number(g.base_price) * (1 - (g.discount_percent || 0) / 100))),
        cover_image_url: g.cover_image_url || '/games/neon-odyssey.jpg',
        rating_avg: Number(g.rating_avg || 4.8)
      }));
    }
  } catch (error) {
    console.error('Error fetching games in page:', error);
  }

  // Cargar datos reales del usuario (Racha y Gamer DNA)
  let userStreak = 1;
  let dna = {
    narrative: 35,
    exploration: 40,
    collection: 15,
    competitive: 10,
  };
  let dominantArchetype = 'Exploración';
  let isAuthenticated = false;

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      isAuthenticated = true;
      const { data: profile } = await supabase
        .from('profiles')
        .select('current_streak, dna_narrative, dna_exploration, dna_collection, dna_competitive')
        .eq('id', user.id)
        .maybeSingle();

      if (profile) {
        userStreak = profile.current_streak || 1;
        dna = {
          narrative: profile.dna_narrative ?? 25,
          exploration: profile.dna_exploration ?? 40,
          collection: profile.dna_collection ?? 20,
          competitive: profile.dna_competitive ?? 15,
        };

        const list = [
          { name: 'Exploración', val: dna.exploration },
          { name: 'Narrativo', val: dna.narrative },
          { name: 'Coleccionismo', val: dna.collection },
          { name: 'Competitivo', val: dna.competitive },
        ].sort((a, b) => b.val - a.val);
        dominantArchetype = list[0].name;
      }
    }
  } catch (err) {
    console.error('Error loading user profile DNA in storefront:', err);
  }

  const overrides = (globalThis as any).GAME_ACTIVE_OVERRIDES as Map<number, boolean> | undefined;

  // Deduplicación estricta y filtrado de juegos activos
  const seenIds = new Set<number>();
  const seenSlugs = new Set<string>();
  const gamesList: Game[] = [];

  // 1. Añadir juegos de la base de datos
  for (const g of dbGames) {
    const isAct = overrides?.has(g.id) ? overrides.get(g.id)! : true;
    if (isAct && !seenIds.has(g.id) && !seenSlugs.has(g.slug)) {
      seenIds.add(g.id);
      seenSlugs.add(g.slug);
      gamesList.push(g);
    }
  }

  // 2. Añadir juegos de MOCK_GAMES que no colisionen
  for (const g of MOCK_GAMES) {
    const isAct = overrides?.has(g.id) ? overrides.get(g.id)! : (g.is_active !== false);
    if (isAct && !seenIds.has(g.id) && !seenSlugs.has(g.slug)) {
      seenIds.add(g.id);
      seenSlugs.add(g.slug);
      gamesList.push({
        id: g.id,
        title: g.title,
        slug: g.slug,
        base_price: g.base_price,
        discount_percent: g.discount_percent,
        final_price: g.final_price,
        cover_image_url: g.cover_image_url,
        rating_avg: g.rating_avg,
      });
    }
  }

  // Seleccionar juego destacado para el Hero Showcase (GTA VI o Cyberpunk 2077)
  const featuredGame = gamesList.find(g => g.slug === 'grand-theft-auto-vi') || gamesList.find(g => g.slug === 'cyberpunk-2077') || gamesList[0];

  // Todos los juegos con descuento activo ordenados por mayor descuento para el Carrusel de Ofertas
  const discountedGames = gamesList
    .filter(g => g.discount_percent > 0)
    .sort((a, b) => b.discount_percent - a.discount_percent);

  // Juegos recomendados para la sección de catálogo
  const recommendedGames = gamesList.slice(0, 8);

  // Días completados en el ciclo semanal de 7 días
  const currentWeekDay = ((userStreak - 1) % 7) + 1;

  return (
    <div className="flex flex-col gap-10">
      
      {/* 1. Hero Showcase Banner */}
      {featuredGame && (
        <section aria-label="Juego Destacado">
          <HeroBanner game={featuredGame} />
        </section>
      )}

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Side: Games Sections (3 cols wide) */}
        <div className="lg:col-span-3 flex flex-col gap-10">
          
          {/* 2. Carrusel de Ofertas Especiales Desplazable de Izquierda a Derecha */}
          <OffersCarousel games={discountedGames} />

          {/* 3. DNA Recommendations Section */}
          <section aria-label="Recomendados Gamer DNA">
            <div className="flex items-center gap-2 border-b border-[#2D3349] pb-3 mb-6">
              <Sparkles className="h-5 w-5 text-[#1FD1EB]" />
              <h2 className="text-xl font-extrabold text-[#F5F7FF] tracking-wide">
                Recomendados según tu Gamer DNA ({dominantArchetype})
              </h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {recommendedGames.map((game) => (
                <GameCard key={`dna-${game.id}-${game.slug}`} game={game} />
              ))}
            </div>
          </section>

        </div>

        {/* Right Side: Sidebar Widgets (1 col wide) */}
        <div className="flex flex-col gap-6 sticky top-24 self-start">
          
          {/* 4. Streak & Gamification Sidebar Widget */}
          <div className="bg-[#1A1C2B] border border-[#2D3349] rounded-2xl p-5 flex flex-col gap-4 shadow-lg">
            <div className="flex items-center justify-between border-b border-[#2D3349] pb-2.5">
              <div className="flex items-center gap-2">
                <Flame className="h-5 w-5 text-[#10B981]" />
                <h3 className="font-extrabold text-sm text-[#F5F7FF] uppercase tracking-wider">
                  Misión Diaria
                </h3>
              </div>
              <Link 
                href="/gamification" 
                className="text-[10px] font-bold text-[#1FD1EB] hover:underline"
              >
                Ver Hub →
              </Link>
            </div>
            
            <div className="flex flex-col gap-3">
              <p className="text-xs text-[#949CB2] leading-relaxed">
                ¡Mantén tu racha de conexión activa! Inicia sesión todos los días para ganar XP y desbloquear medallas exclusivas de UTEPSA.
              </p>
              
              {/* Daily calendar check dots */}
              <div className="flex justify-between items-center bg-[#080A13] border border-[#2D3349] rounded-xl p-3 mt-1">
                {[1, 2, 3, 4, 5, 6, 7].map((day) => {
                  const isChecked = day <= currentWeekDay;
                  return (
                    <div key={day} className="flex flex-col items-center gap-1.5">
                      <div className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                        isChecked 
                          ? 'bg-[#10B981] text-[#080A13] shadow-md shadow-[#10B981]/25 scale-105' 
                          : 'bg-[#1A1C2B] border border-[#2D3349] text-[#949CB2]'
                      }`}>
                        {day}
                      </div>
                      <span className="text-[8px] text-[#949CB2] font-mono">Día</span>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center gap-2 mt-2 text-xs text-[#1FD1EB]">
                <Calendar className="h-4 w-4" />
                <span>Racha actual: <strong>{userStreak} {userStreak === 1 ? 'día' : 'días consecutivos'}</strong></span>
              </div>
            </div>
          </div>

          {/* Gamer DNA quick info */}
          <div className="bg-[#1A1C2B] border border-[#2D3349] rounded-2xl p-5 flex flex-col gap-3 shadow-lg">
            <div className="flex items-center justify-between border-b border-[#2D3349] pb-2.5">
              <div className="flex items-center gap-2">
                <Gamepad2 className="h-5 w-5 text-[#783DF2]" />
                <h3 className="font-extrabold text-sm text-[#F5F7FF] uppercase tracking-wider">
                  Tu ADN Gamer
                </h3>
              </div>
              <Link
                href="/profile"
                className="text-[10px] font-bold text-[#783DF2] hover:text-[#1FD1EB] transition-colors"
              >
                Ver Perfil →
              </Link>
            </div>
            
            <div className="flex flex-col gap-2">
              <p className="text-xs text-[#949CB2] leading-relaxed">
                Tu perfil de jugador actual se inclina al arquetipo <strong className="text-white">{dominantArchetype}</strong>.
              </p>
              
              <div className="flex flex-col gap-2.5 mt-2">
                {[
                  { label: 'Exploración', pct: dna.exploration, color: 'bg-[#1FD1EB]' },
                  { label: 'Narrativo', pct: dna.narrative, color: 'bg-[#783DF2]' },
                  { label: 'Coleccionismo', pct: dna.collection, color: 'bg-[#10B981]' },
                  { label: 'Competitivo', pct: dna.competitive, color: 'bg-[#EF4444]' }
                ].map((item) => (
                  <div key={item.label} className="flex flex-col gap-1">
                    <div className="flex justify-between items-center text-[10px] font-bold text-[#F5F7FF]">
                      <span>{item.label}</span>
                      <span>{item.pct}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#080A13] rounded-full overflow-hidden border border-[#2D3349]/40">
                      <div 
                        className={`h-full ${item.color} rounded-full transition-all duration-700`} 
                        style={{ width: `${item.pct}%` }} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
