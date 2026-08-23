"use client";

import { useState } from "react";
import { ShoppingCart, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface FloatingBuyBoxProps {
  gameId: number;
  title: string;
  basePrice: number;
  discountPercent: number;
  finalPrice: number | null;
}

export function FloatingBuyBox({
  gameId,
  title,
  basePrice,
  discountPercent,
  finalPrice,
}: FloatingBuyBoxProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const priceToDisplay = finalPrice ?? basePrice;
  const hasDiscount = discountPercent > 0;

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    // Simular retraso de Server Action
    await new Promise((resolve) => setTimeout(resolve, 800));
    console.log(`Added game ${gameId} to cart`);
    setIsAddingToCart(false);
  };

  const handleToggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    console.log(`Toggled wishlist for game ${gameId}`);
  };

  return (
    <Card className="sticky top-24 bg-zinc-900 border-zinc-800 p-6 flex flex-col gap-6">
      <CardContent className="p-0">
        <h2 className="text-2xl font-bold text-foreground mb-4">{title}</h2>
        
        <div className="flex items-center gap-3 mb-6">
          {hasDiscount && (
            <Badge className="bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 text-lg py-1">
              -{discountPercent}%
            </Badge>
          )}
          <div className="flex flex-col">
            {hasDiscount && (
              <span className="text-sm text-zinc-500 line-through">
                Bs. {basePrice.toFixed(2)}
              </span>
            )}
            <span className="text-3xl font-bold text-foreground">
              Bs. {priceToDisplay.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Button 
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-6 text-lg font-semibold"
            onClick={handleAddToCart}
            disabled={isAddingToCart}
          >
            {isAddingToCart ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin">⏳</span> Agregando...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" /> Añadir al Carrito
              </span>
            )}
          </Button>

          <Button 
            variant="outline"
            className={`w-full py-6 text-lg font-semibold border-zinc-700 ${
              isWishlisted ? "text-pink-500 bg-pink-500/10 border-pink-500/50 hover:bg-pink-500/20" : "text-foreground hover:bg-zinc-800"
            }`}
            onClick={handleToggleWishlist}
          >
            <span className="flex items-center gap-2">
              <Heart className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`} /> 
              {isWishlisted ? "En Wishlist" : "Añadir a Wishlist"}
            </span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
