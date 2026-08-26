'use client';

import React from 'react';
import { Search, Filter, RotateCcw, ArrowUpDown, Calendar } from 'lucide-react';
import { OrderStatus } from '@/types/admin-sales.types';

export interface SalesFilterState {
  searchQuery: string;
  status: 'ALL' | OrderStatus;
  datePreset: 'ALL' | '7d' | '30d' | 'month';
  sortBy: 'newest' | 'highest_price' | 'lowest_price';
}

interface SalesFiltersProps {
  filters: SalesFilterState;
  onFilterChange: (newFilters: SalesFilterState) => void;
  onReset: () => void;
  totalFiltered: number;
}

export function SalesFilters({
  filters,
  onFilterChange,
  onReset,
  totalFiltered,
}: SalesFiltersProps) {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, searchQuery: e.target.value });
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ ...filters, status: e.target.value as 'ALL' | OrderStatus });
  };

  const handleDatePresetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ ...filters, datePreset: e.target.value as SalesFilterState['datePreset'] });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ ...filters, sortBy: e.target.value as SalesFilterState['sortBy'] });
  };

  const isFiltered = filters.searchQuery !== '' || filters.status !== 'ALL' || filters.datePreset !== 'ALL' || filters.sortBy !== 'newest';

  return (
    <div className="bg-[#1A1C2B] border border-[#2E334A] rounded-2xl p-4 md:p-5 flex flex-col gap-4">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Buscador predictivo por código, usuario o email */}
        <div className="relative flex-1 min-w-[260px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={handleSearchChange}
            placeholder="Buscar por código TX-XXXX, usuario (@...) o email..."
            className="w-full bg-[#090B14] border border-[#2E334A] focus:border-[#783DF2] focus:ring-1 focus:ring-[#783DF2] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 transition-all outline-none"
          />
        </div>

        {/* Controles y Selectores */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Selector de Estado */}
          <div className="relative flex items-center min-w-[150px] flex-1 sm:flex-none">
            <Filter className="absolute left-3 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
            <select
              value={filters.status}
              onChange={handleStatusChange}
              className="w-full bg-[#090B14] border border-[#2E334A] focus:border-[#783DF2] rounded-xl pl-9 pr-8 py-2.5 text-xs font-semibold text-zinc-200 outline-none cursor-pointer appearance-none"
            >
              <option value="ALL">Todos los Estados</option>
              <option value="COMPLETED">Completadas</option>
              <option value="PENDING">Pendientes</option>
              <option value="CANCELLED">Canceladas</option>
            </select>
          </div>

          {/* Selector de Fecha */}
          <div className="relative flex items-center min-w-[150px] flex-1 sm:flex-none">
            <Calendar className="absolute left-3 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
            <select
              value={filters.datePreset}
              onChange={handleDatePresetChange}
              className="w-full bg-[#090B14] border border-[#2E334A] focus:border-[#783DF2] rounded-xl pl-9 pr-8 py-2.5 text-xs font-semibold text-zinc-200 outline-none cursor-pointer appearance-none"
            >
              <option value="ALL">Cualquier Fecha</option>
              <option value="7d">Últimos 7 Días</option>
              <option value="30d">Últimos 30 Días</option>
              <option value="month">Este Mes</option>
            </select>
          </div>

          {/* Ordenamiento */}
          <div className="relative flex items-center min-w-[150px] flex-1 sm:flex-none">
            <ArrowUpDown className="absolute left-3 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
            <select
              value={filters.sortBy}
              onChange={handleSortChange}
              className="w-full bg-[#090B14] border border-[#2E334A] focus:border-[#783DF2] rounded-xl pl-9 pr-8 py-2.5 text-xs font-semibold text-zinc-200 outline-none cursor-pointer appearance-none"
            >
              <option value="newest">Más Recientes</option>
              <option value="highest_price">Mayor Monto (Bs.)</option>
              <option value="lowest_price">Menor Monto (Bs.)</option>
            </select>
          </div>

          {/* Botón de Reset si hay filtros aplicados */}
          {isFiltered && (
            <button
              onClick={onReset}
              className="px-3 py-2.5 bg-[#090B14] hover:bg-[#2E334A]/50 text-zinc-400 hover:text-white border border-[#2E334A] rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Limpiar filtros"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Limpiar
            </button>
          )}
        </div>
      </div>

      {/* Contador de resultados */}
      <div className="flex items-center justify-between text-xs text-zinc-400 px-1">
        <span>
          Mostrando <strong className="text-white">{totalFiltered}</strong> transacciones encontradas
        </span>
      </div>
    </div>
  );
}
