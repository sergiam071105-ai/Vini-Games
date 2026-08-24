import { UserRound, Pencil } from "lucide-react";
import Button from "@/components/ui/button";
export default function ProfilePage() {
  return (
    <div className="w-full text-white">
      <section className="rounded-3xl bg-[#131521] p-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-center">
          <div className="flex h-40 w-40 shrink-0 items-center justify-center rounded-full border border-[#783DF2]/30 bg-[#1C1730]">
            <UserRound className="h-20 w-20 text-[#783DF2]" />
          </div>

          <div className="flex-1">
            <h1 className="text-4xl font-bold">Eduardo</h1>

            <p className="mt-1 text-sm text-[#949CB2]">@eduardo</p>

            <p className="mt-5 text-sm font-semibold text-[#1FD1EB]">
              NIVEL 12 • EXPLORADOR
            </p>

            <div className="mt-5 max-w-md">
              <div className="h-3 overflow-hidden rounded-full bg-[#2E334A]">
                <div className="h-full w-[72%] rounded-full bg-[#783DF2]" />
              </div>

              <p className="mt-2 text-sm text-[#949CB2]">1,240 / 1,500 XP</p>
            </div>

            <p className="mt-5 text-sm text-[#949CB2]">
              Explorando mundos, coleccionando historias y buscando el próximo
              gran juego.
            </p>
          </div>

          <Button
            variant="secondary"
            className="self-start flex items-center gap-2"
          >
            <Pencil className="h-4 w-4" />
            Editar perfil
          </Button>
        </div>
      </section>
      {/* Estadísticas del perfil */}
      <section className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl bg-[#131521] p-6">
          <div className="flex items-center gap-5">
            <span className="text-3xl">🎮</span>

            <div>
              <p className="text-2xl font-bold">48</p>
              <p className="mt-1 text-sm text-[#949CB2]">Juegos</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-[#131521] p-6">
          <div className="flex items-center gap-5">
            <span className="text-3xl">🏆</span>

            <div>
              <p className="text-2xl font-bold">17</p>
              <p className="mt-1 text-sm text-[#949CB2]">Logros</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-[#131521] p-6">
          <div className="flex items-center gap-5">
            <span className="text-3xl">🔥</span>

            <div>
              <p className="text-2xl font-bold">7</p>
              <p className="mt-1 text-sm text-[#949CB2]">Racha</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-[#131521] p-6">
          <div className="flex items-center gap-5">
            <span className="text-3xl text-[#1FD1EB]">◇</span>

            <div>
              <p className="text-2xl font-bold">1,250</p>
              <p className="mt-1 text-sm text-[#949CB2]">GameCoins</p>
            </div>
          </div>
        </div>
      </section>
      {/* Navegación del perfil */}
      <section className="mt-8">
        <div className="flex gap-8 border-b border-white/5">
          <button className="border-b-2 border-[#783DF2] pb-3 text-sm font-semibold text-white">
            Mis juegos
          </button>

          <button className="pb-3 text-sm text-[#949CB2]">Logros</button>

          <button className="pb-3 text-sm text-[#949CB2]">Recompensas</button>

          <button className="pb-3 text-sm text-[#949CB2]">Reseñas</button>
        </div>
      </section>

      {/* Juegos recientes */}
      <section className="mt-7">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Juegos recientes</h2>

          <button className="text-sm font-semibold text-[#1FD1EB]">
            Ver biblioteca →
          </button>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {/* Juego 1 */}
          <div className="flex gap-5 rounded-2xl bg-[#131521] p-4">
            <div className="h-[180px] w-[130px] shrink-0 rounded-xl bg-[#1A1C2E]" />

            <div className="flex flex-1 flex-col py-3">
              <h3 className="font-bold">NEON ODYSSEY</h3>

              <p className="mt-3 text-xs text-[#949CB2]">Acción • RPG</p>

              <p className="mt-6 text-sm font-semibold text-[#1FD1EB]">★ 4.8</p>

              <div className="mt-auto">
                <div className="h-2 overflow-hidden rounded-full bg-[#2E334A]">
                  <div className="h-full w-[70%] rounded-full bg-[#783DF2]" />
                </div>

                <p className="mt-2 text-xs text-[#949CB2]">70% completado</p>
              </div>
            </div>
          </div>

          {/* Juego 2 */}
          <div className="flex gap-5 rounded-2xl bg-[#131521] p-4">
            <div className="h-[180px] w-[130px] shrink-0 rounded-xl bg-[#1A1C2E]" />

            <div className="flex flex-1 flex-col py-3">
              <h3 className="font-bold">VOID RUNNER</h3>

              <p className="mt-3 text-xs text-[#949CB2]">Indie • Aventura</p>

              <p className="mt-6 text-sm font-semibold text-[#1FD1EB]">★ 4.6</p>

              <div className="mt-auto">
                <div className="h-2 overflow-hidden rounded-full bg-[#2E334A]">
                  <div className="h-full w-[52%] rounded-full bg-[#783DF2]" />
                </div>

                <p className="mt-2 text-xs text-[#949CB2]">52% completado</p>
              </div>
            </div>
          </div>

          {/* Juego 3 */}
          <div className="flex gap-5 rounded-2xl bg-[#131521] p-4">
            <div className="h-[180px] w-[130px] shrink-0 rounded-xl bg-[#1A1C2E]" />

            <div className="flex flex-1 flex-col py-3">
              <h3 className="font-bold">DARK REALM</h3>

              <p className="mt-3 text-xs text-[#949CB2]">RPG • Fantasía</p>

              <p className="mt-6 text-sm font-semibold text-[#1FD1EB]">★ 4.9</p>

              <div className="mt-auto">
                <div className="h-2 overflow-hidden rounded-full bg-[#2E334A]">
                  <div className="h-full w-[34%] rounded-full bg-[#783DF2]" />
                </div>

                <p className="mt-2 text-xs text-[#949CB2]">34% completado</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Gamer DNA y recompensas */}
      <section className="mt-7 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Gamer DNA */}
        <div className="rounded-2xl bg-[#131521] p-6">
          <h2 className="text-xl font-bold">🧬 Gamer DNA</h2>

          <h3 className="mt-4 text-2xl font-bold text-[#1FD1EB]">Explorador</h3>

          <div className="mt-6 space-y-5">
            {/* Exploración */}
            <div className="flex items-center gap-4">
              <p className="w-24 text-xs text-[#949CB2]">Exploración</p>

              <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#2E334A]">
                <div className="h-full w-[60%] rounded-full bg-[#783DF2]" />
              </div>

              <p className="w-10 text-right text-xs font-semibold">60%</p>
            </div>

            {/* Narrativa */}
            <div className="flex items-center gap-4">
              <p className="w-24 text-xs text-[#949CB2]">Narrativa</p>

              <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#2E334A]">
                <div className="h-full w-[24%] rounded-full bg-[#783DF2]" />
              </div>

              <p className="w-10 text-right text-xs font-semibold">24%</p>
            </div>

            {/* Colección */}
            <div className="flex items-center gap-4">
              <p className="w-24 text-xs text-[#949CB2]">Colección</p>

              <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#2E334A]">
                <div className="h-full w-[16%] rounded-full bg-[#783DF2]" />
              </div>

              <p className="w-10 text-right text-xs font-semibold">16%</p>
            </div>
          </div>
        </div>

        {/* Racha y recompensas */}
        <div className="rounded-2xl bg-[#131521] p-6">
          <h2 className="text-xl font-bold">🔥 Racha y recompensas</h2>

          <p className="mt-4 text-sm text-[#949CB2]">
            Mantén tu actividad para desbloquear recompensas.
          </p>

          <div className="mt-6 flex items-center gap-4">
            <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-[#2E334A]">
              <div className="h-full w-[70%] rounded-full bg-[#783DF2]" />
            </div>

            <p className="text-sm font-semibold text-[#1FD1EB]">7 / 10 días</p>
          </div>

          <p className="mt-6 text-sm">Próxima recompensa: Avatar épico</p>

          <button className="mt-6 rounded-xl bg-[#783DF2] px-8 py-3 text-sm font-semibold transition hover:bg-[#8B4DFF]">
            Ver recompensas
          </button>
        </div>
      </section>
    </div>
  );
}
