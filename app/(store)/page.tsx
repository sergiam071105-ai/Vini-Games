import { createClient } from '@/lib/supabase/server';
import { HeroBanner } from '@/components/store/hero-banner';
import { GameCard, Game } from '@/components/store/game-card';
import { Sparkles, Percent, Flame, Calendar, Gamepad2 } from 'lucide-react';

// 12 High-Quality Mock Games for Sprint 1 Showcase/Demo
const MOCK_GAMES: Game[] = [
  {
    id: 1,
    title: 'Neon Odyssey',
    slug: 'neon-odyssey',
    base_price: 129.00,
    discount_percent: 30,
    final_price: 90.30,
    cover_image_url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop',
    rating_avg: 4.8
  },
  {
    id: 2,
    title: 'Shadow Protocol',
    slug: 'shadow-protocol',
    base_price: 99.00,
    discount_percent: 15,
    final_price: 84.15,
    cover_image_url: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=600&auto=format&fit=crop',
    rating_avg: 4.5
  },
  {
    id: 3,
    title: 'Chrono Nexus',
    slug: 'chrono-nexus',
    base_price: 149.00,
    discount_percent: 0,
    final_price: 149.00,
    cover_image_url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=600&auto=format&fit=crop',
    rating_avg: 4.2
  },
  {
    id: 4,
    title: 'Vortex Apex',
    slug: 'vortex-apex',
    base_price: 79.00,
    discount_percent: 50,
    final_price: 39.50,
    cover_image_url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=600&auto=format&fit=crop',
    rating_avg: 4.0
  },
  {
    id: 5,
    title: 'Elysium Legends',
    slug: 'elysium-legends',
    base_price: 119.00,
    discount_percent: 10,
    final_price: 107.10,
    cover_image_url: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=600&auto=format&fit=crop',
    rating_avg: 4.7
  },
  {
    id: 6,
    title: 'Pixel Quest',
    slug: 'pixel-quest',
    base_price: 49.00,
    discount_percent: 0,
    final_price: 49.00,
    cover_image_url: 'https://images.unsplash.com/photo-1612287230202-1bf1d85d1bdf?q=80&w=600&auto=format&fit=crop',
    rating_avg: 4.6
  },
  {
    id: 7,
    title: 'Infernal Edge',
    slug: 'infernal-edge',
    base_price: 89.00,
    discount_percent: 25,
    final_price: 66.75,
    cover_image_url: 'https://images.unsplash.com/photo-1580234810907-b40315b76418?q=80&w=600&auto=format&fit=crop',
    rating_avg: 4.1
  },
  {
    id: 8,
    title: 'Cyber Strike',
    slug: 'cyber-strike',
    base_price: 109.00,
    discount_percent: 20,
    final_price: 87.20,
    cover_image_url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop',
    rating_avg: 4.4
  },
  {
    id: 9,
    title: 'Eco Horizon',
    slug: 'eco-horizon',
    base_price: 59.00,
    discount_percent: 0,
    final_price: 59.00,
    cover_image_url: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=600&auto=format&fit=crop',
    rating_avg: 4.3
  },
  {
    id: 10,
    title: 'Tactical Command',
    slug: 'tactical-command',
    base_price: 129.00,
    discount_percent: 0,
    final_price: 129.00,
    cover_image_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600&auto=format&fit=crop',
    rating_avg: 4.5
  },
  {
    id: 11,
    title: 'Rogue Catalyst',
    slug: 'rogue-catalyst',
    base_price: 39.00,
    discount_percent: 30,
    final_price: 27.30,
    cover_image_url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=600&auto=format&fit=crop',
    rating_avg: 3.9
  },
  {
    id: 12,
    title: 'Zen Drift',
    slug: 'zen-drift',
    base_price: 69.00,
    discount_percent: 40,
    final_price: 41.40,
    cover_image_url: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=600&auto=format&fit=crop',
    rating_avg: 4.8
  }
];

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
        discount_percent: g.discount_percent,
        final_price: Number(g.final_price),
        cover_image_url: g.cover_image_url,
        rating_avg: Number(g.rating_avg)
      }));
    }
  } catch (error) {
    console.error('Error fetching games in page:', error);
  }

  // Use DB games if present, otherwise fall back to our mock dataset for Sprint 1 demo
  const gamesList = dbGames.length > 0 ? dbGames : MOCK_GAMES;

  // Find the featured game (Neon Odyssey by default)
  const featuredGame = gamesList.find(g => g.slug === 'neon-odyssey') || gamesList[0];

  // Filter games with active discounts for the Offers section
  const discountedGames = gamesList.filter(g => g.discount_percent > 0).slice(0, 4);

  // Remaining games represent catalog recommendations
  const recommendedGames = gamesList.slice(0, 8);

  return (
    <div className="flex flex-col gap-10">
      
      {/* 1. Hero Showcase Banner */}
      <section aria-label="Juego Destacado">
        <HeroBanner game={featuredGame} />
      </section>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Side: Games Sections (3 cols wide) */}
        <div className="lg:col-span-3 flex flex-col gap-10">
          
          {/* 2. Offers Section */}
          <section aria-label="Ofertas Especiales">
            <div className="flex items-center gap-2 border-b border-[#2D3349] pb-3 mb-6">
              <Percent className="h-5 w-5 text-[#10B981]" />
              <h2 className="text-xl font-extrabold text-[#F5F7FF] tracking-wide">
                Ofertas Especiales
              </h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {discountedGames.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          </section>

          {/* 3. DNA Recommendations Section */}
          <section aria-label="Recomendados Gamer DNA">
            <div className="flex items-center gap-2 border-b border-[#2D3349] pb-3 mb-6">
              <Sparkles className="h-5 w-5 text-[#1FD1EB]" />
              <h2 className="text-xl font-extrabold text-[#F5F7FF] tracking-wide">
                Recomendados según tu Gamer DNA
              </h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {recommendedGames.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          </section>

        </div>

        {/* Right Side: Sidebar Widgets (1 col wide) */}
        <div className="flex flex-col gap-6 sticky top-24 self-start">
          
          {/* 4. Streak & Gamification Sidebar Widget */}
          <div className="bg-[#1A1C2B] border border-[#2D3349] rounded-2xl p-5 flex flex-col gap-4">
            <div className="flex items-center gap-2 border-b border-[#2D3349] pb-2.5">
              <Flame className="h-5 w-5 text-[#10B981]" />
              <h3 className="font-extrabold text-sm text-[#F5F7FF] uppercase tracking-wider">
                Misión Diaria
              </h3>
            </div>
            
            <div className="flex flex-col gap-3">
              <p className="text-xs text-[#949CB2] leading-relaxed">
                ¡Mantén tu racha de conexión activa! Inicia sesión todos los días para ganar XP y desbloquear medallas exclusivas de UTEPSA.
              </p>
              
              {/* Daily calendar check dots */}
              <div className="flex justify-between items-center bg-[#080A13] border border-[#2D3349] rounded-xl p-3 mt-1">
                {[1, 2, 3, 4, 5, 6, 7].map((day) => {
                  const isChecked = day <= 3; // Match the 3-day mock streak
                  return (
                    <div key={day} className="flex flex-col items-center gap-1.5">
                      <div className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                        isChecked 
                          ? 'bg-[#10B981] text-[#080A13] shadow-md shadow-[#10B981]/25' 
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
                <span>Racha actual: <strong>3 días consecutivos</strong></span>
              </div>
            </div>
          </div>

          {/* Gamer DNA quick info */}
          <div className="bg-[#1A1C2B] border border-[#2D3349] rounded-2xl p-5 flex flex-col gap-3">
            <div className="flex items-center gap-2 border-b border-[#2D3349] pb-2.5">
              <Gamepad2 className="h-5 w-5 text-[#783DF2]" />
              <h3 className="font-extrabold text-sm text-[#F5F7FF] uppercase tracking-wider">
                Tu ADN Gamer
              </h3>
            </div>
            
            <div className="flex flex-col gap-2">
              <p className="text-xs text-[#949CB2] leading-relaxed">
                Tu perfil de jugador actual se inclina a los arquetipos narrativos y de exploración.
              </p>
              
              <div className="flex flex-col gap-2.5 mt-2">
                {[
                  { label: 'Narrativo', pct: 60, color: 'bg-[#783DF2]' },
                  { label: 'Exploración', pct: 24, color: 'bg-[#1FD1EB]' },
                  { label: 'Coleccionismo', pct: 16, color: 'bg-[#10B981]' },
                  { label: 'Competitivo', pct: 0, color: 'bg-zinc-600' }
                ].map((item) => (
                  <div key={item.label} className="flex flex-col gap-1">
                    <div className="flex justify-between items-center text-[10px] font-bold text-[#F5F7FF]">
                      <span>{item.label}</span>
                      <span>{item.pct}%</span>
                    </div>
                    <div className="w-full h-1 bg-[#080A13] rounded-full overflow-hidden">
                      <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.pct}%` }} />
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
