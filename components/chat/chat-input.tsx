'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Compass, Flame, Swords, ShieldAlert, Loader2 } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const QUICK_PROMPTS = [
  {
    icon: Sparkles,
    label: 'Recomendaciones según mi ADN',
    query: '¿Qué videojuegos me recomiendas según mi ADN Gamer y perfil?',
  },
  {
    icon: Flame,
    label: 'Ofertas destacadas',
    query: '¿Cuáles son los juegos con mayores descuentos y ofertas activas?',
  },
  {
    icon: Swords,
    label: 'Cooperativos & Multijugador',
    query: 'Recomiéndame juegos cooperativos y multijugador para jugar con amigos.',
  },
  {
    icon: Compass,
    label: 'Estrategia & Sci-Fi',
    query: 'Busco videojuegos de estrategia y ciencia ficción espacial.',
  },
];

export function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    onSendMessage(input.trim());
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleQuickPromptClick = (query: string) => {
    if (isLoading) return;
    onSendMessage(query);
  };

  return (
    <div className="flex-shrink-0 border-t border-[#2E334A] bg-[#0B0D18]/95 backdrop-blur-md p-4 space-y-3">
      
      {/* Chips de Preguntas Frecuentes Gamer */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {QUICK_PROMPTS.map((prompt, idx) => {
          const Icon = prompt.icon;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => handleQuickPromptClick(prompt.query)}
              disabled={isLoading}
              aria-label={`Preguntar sugerencia: ${prompt.label}`}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1A1C2B] hover:bg-[#25283d] border border-[#2E334A] hover:border-[#783DF2]/50 rounded-full text-xs font-semibold text-[#94A3B8] hover:text-[#1FD1EB] whitespace-nowrap transition-all cursor-pointer disabled:opacity-50"
            >
              <Icon className="w-3.5 h-3.5 text-[#783DF2]" />
              <span>{prompt.label}</span>
            </button>
          );
        })}
      </div>

      {/* Barra de Entrada de Texto */}
      <form onSubmit={handleSubmit} className="flex items-end gap-2">
        <div className="relative flex-1 bg-[#131521] border border-[#2E334A] focus-within:border-[#783DF2] focus-within:ring-1 focus-within:ring-[#783DF2]/40 rounded-2xl p-2 transition-all">
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            aria-label="Escribe tu consulta para ViniChat"
            placeholder="Pregúntale a ViniChat sobre géneros, ofertas, requisitos o recomendaciones..."
            className="w-full bg-transparent border-0 text-xs sm:text-sm text-[#F8FAFC] placeholder-[#94A3B8]/60 focus:outline-none resize-none max-h-28 py-1 px-2"
          />
        </div>

        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          aria-label="Enviar mensaje a ViniChat"
          className="p-3 bg-[#783DF2] hover:bg-[#6929e4] disabled:bg-[#1A1C2B] text-[#F8FAFC] disabled:text-[#94A3B8] rounded-2xl transition-all shadow-lg shadow-[#783DF2]/20 cursor-pointer disabled:cursor-not-allowed flex-shrink-0"
          title="Enviar mensaje"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin text-[#1FD1EB]" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </form>

      <div className="flex items-center justify-between text-[10px] text-[#94A3B8]/70 px-1">
        <span>Presiona <kbd className="px-1 py-0.5 bg-[#1A1C2B] rounded border border-[#2E334A] text-[#F8FAFC] font-mono">Enter</kbd> para enviar • <kbd className="px-1 py-0.5 bg-[#1A1C2B] rounded border border-[#2E334A] text-[#F8FAFC] font-mono">Shift+Enter</kbd> para salto de línea</span>
        <span className="hidden sm:inline">ViniChat IA v3.0</span>
      </div>

    </div>
  );
}
