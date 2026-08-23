import { Star } from "lucide-react";

export function GameReviews() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Caja Izquierda: Score */}
      <div className="lg:col-span-3 bg-[#151722] rounded-xl p-8 flex flex-col justify-center border border-transparent">
        <div className="text-[3.5rem] font-bold text-white leading-none mb-3">4.8</div>
        <div className="flex gap-1 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} className="w-4 h-4 fill-[#1FD1EB] text-[#1FD1EB]" />
          ))}
        </div>
        <div className="text-white font-semibold text-sm mb-1">Excelente</div>
        <div className="text-zinc-500 text-xs">92% lo recomienda</div>
      </div>

      {/* Medio: Lista de Reviews */}
      <div className="lg:col-span-6 flex flex-col gap-4">
        <div className="bg-[#151722] rounded-xl p-6 flex flex-col justify-between h-full border border-transparent">
          <p className="text-white text-[15px] font-medium mb-4">"Muy buena ambientación y combate."</p>
          <div className="flex justify-between items-end mt-auto">
            <span className="text-zinc-500 text-xs">@LunaPlayer</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="w-3 h-3 fill-[#1FD1EB] text-[#1FD1EB]" />
              ))}
            </div>
          </div>
        </div>

        <div className="bg-[#151722] rounded-xl p-6 flex flex-col justify-between h-full border border-transparent">
          <p className="text-white text-[15px] font-medium mb-4">"La historia me sorprendió bastante."</p>
          <div className="flex justify-between items-end mt-auto">
            <span className="text-zinc-500 text-xs">@PixelEdu</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="w-3 h-3 fill-[#1FD1EB] text-[#1FD1EB]" />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Caja Derecha: CTA */}
      <div className="lg:col-span-3 bg-[#151722] rounded-xl p-6 flex flex-col border border-transparent">
        <h3 className="text-white font-semibold mb-2">¿Ya jugaste?</h3>
        <p className="text-zinc-400 text-xs mb-6">Compra el juego para poder dejar tu reseña.</p>
        <button className="mt-auto w-full border border-[#783DF2] text-[#1FD1EB] hover:bg-[#783DF2]/10 py-3 rounded-lg text-sm font-semibold transition-colors">
          Escribir reseña
        </button>
      </div>
    </div>
  );
}
