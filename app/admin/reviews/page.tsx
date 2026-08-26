import React from 'react';
import Link from 'next/link';
import { MessageSquareText, Star, ShieldCheck, ArrowRight } from 'lucide-react';

export default function AdminReviewsPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between border-b border-[#2E334A] pb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-[#F8FAFC] flex items-center gap-2.5">
            <MessageSquareText className="w-7 h-7 text-[#783DF2]" />
            Moderación de Reseñas Comunitarias
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1">
            Supervisión y control de calidad de opiniones emitidas con compra verificada.
          </p>
        </div>
      </div>

      <div className="bg-[#131521] border border-[#2E334A] rounded-2xl p-8 text-center max-w-xl mx-auto space-y-4">
        <div className="w-16 h-16 rounded-full bg-[#10B981]/20 border border-[#10B981]/40 flex items-center justify-center mx-auto text-[#10B981]">
          <Star className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-bold text-[#F8FAFC]">Panel de Moderación Gamer</h2>
        <p className="text-xs text-[#94A3B8] leading-relaxed">
          Las reseñas verificadas de los jugadores se almacenan en la tabla <code className="text-[#1FD1EB] bg-[#1A1C2B] px-1.5 py-0.5 rounded">reviews</code> con estados <code className="text-[#10B981] bg-[#1A1C2B] px-1.5 py-0.5 rounded">APPROVED</code> y <code className="text-[#EF4444] bg-[#1A1C2B] px-1.5 py-0.5 rounded">PENDING</code>.
        </p>
        <Link
          href="/admin/games"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#783DF2] hover:bg-[#6929e4] text-[#F8FAFC] font-bold text-xs rounded-xl transition-all shadow-md shadow-[#783DF2]/30 uppercase tracking-wider"
        >
          Gestionar Catálogo
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
