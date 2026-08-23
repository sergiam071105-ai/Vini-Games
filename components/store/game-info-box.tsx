import { Star, ShoppingCart, Heart, ArrowRight } from "lucide-react";

interface GameInfoBoxProps {
  title: string;
  categories: { id: number; name: string }[];
  ratingAvg: number;
  ratingCount: number;
  shortDescription: string;
  basePrice: number;
  discountPercent: number;
  finalPrice: number | null;
}

export function GameInfoBox({
  title,
  categories,
  ratingAvg,
  ratingCount,
  shortDescription,
  basePrice,
  discountPercent,
  finalPrice,
}: GameInfoBoxProps) {
  const priceToDisplay = finalPrice ?? basePrice;
  const hasDiscount = discountPercent > 0;

  return (
    <div className="flex flex-col h-full">
      <h1 className="text-4xl font-bold text-white mb-2">{title}</h1>
      
      <div className="flex items-center gap-2 text-sm text-[#1FD1EB] font-semibold mb-4">
        {categories.map((cat, index) => (
          <span key={cat.id}>
            {cat.name}
            {index < categories.length - 1 && <span className="text-zinc-500 mx-2">•</span>}
          </span>
        ))}
      </div>

      <div className="flex items-center gap-2 mb-6">
        <Star className="w-5 h-5 fill-white text-white" />
        <span className="text-white font-bold text-lg">{ratingAvg.toFixed(1)}</span>
        <span className="text-zinc-500 text-sm ml-1">{ratingCount.toLocaleString()} reseñas</span>
      </div>

      <p className="text-zinc-400 text-[15px] leading-relaxed mb-8 max-w-lg">
        {shortDescription}
      </p>

      <div className="mt-auto">
        <span className="text-zinc-500 text-xs uppercase font-semibold tracking-wider mb-2 block">Precio</span>
        <div className="flex items-center gap-4 mb-4">
          <span className="text-3xl font-bold text-white">
            Bs. {priceToDisplay.toFixed(2)}
          </span>
          {hasDiscount && (
            <span className="bg-[#783DF2] text-white text-sm font-bold px-3 py-1 rounded-md">
              -{discountPercent}%
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button className="flex-1 bg-[#783DF2] hover:bg-[#6A32DB] text-white py-4 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all">
            Comprar ahora <ArrowRight className="w-5 h-5" />
          </button>
          <button className="w-14 h-14 border border-[#2E334A] hover:border-[#783DF2] bg-[#1A1C2B] rounded-xl flex items-center justify-center text-zinc-400 hover:text-pink-400 transition-all group">
            <Heart className="w-6 h-6 group-hover:fill-pink-400/20" />
          </button>
        </div>
      </div>
    </div>
  );
}
