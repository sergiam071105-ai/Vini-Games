import React from 'react';
import Link from 'next/link';
import { TrendingUp, DollarSign, ShoppingBag, ShieldCheck, ArrowRight } from 'lucide-react';

export default function AdminSalesPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between border-b border-[#2E334A] pb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-[#F8FAFC] flex items-center gap-2.5">
            <TrendingUp className="w-7 h-7 text-[#783DF2]" />
            Auditoría de Órdenes & Ventas
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1">
            Registro transaccional de compras simuladas con códigos TX-XXXX.
          </p>
        </div>
      </div>

      <div className="bg-[#131521] border border-[#2E334A] rounded-2xl p-8 text-center max-w-xl mx-auto space-y-4">
        <div className="w-16 h-16 rounded-full bg-[#783DF2]/20 border border-[#783DF2]/40 flex items-center justify-center mx-auto text-[#1FD1EB]">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-bold text-[#F8FAFC]">Módulo de Reportes Transaccionales</h2>
        <p className="text-xs text-[#94A3B8] leading-relaxed">
          Las transacciones generadas en el checkout simulado se almacenan en la tabla <code className="text-[#1FD1EB] bg-[#1A1C2B] px-1.5 py-0.5 rounded">orders</code> y <code className="text-[#1FD1EB] bg-[#1A1C2B] px-1.5 py-0.5 rounded">order_items</code>.
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
