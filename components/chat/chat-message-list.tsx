'use client';

import React, { useEffect, useRef } from 'react';
import { Bot, User, Sparkles } from 'lucide-react';
import { ChatMessage } from '@/types/chat.types';
import { ChatProductCard } from '@/components/chat/chat-product-card';

interface ChatMessageListProps {
  messages: ChatMessage[];
  isLoading: boolean;
  userAvatar?: string;
  userName?: string;
}

/**
 * Renderizador simple de texto con soporte para negritas (**texto**), saltos de línea y listas.
 */
function FormattedContent({ text }: { text: string }) {
  const paragraphs = text.split('\n\n');

  return (
    <div className="space-y-2.5 text-xs sm:text-sm leading-relaxed text-[#F8FAFC]">
      {paragraphs.map((para, pIdx) => {
        const lines = para.split('\n');
        return (
          <p key={pIdx}>
            {lines.map((line, lIdx) => {
              const parts = line.split(/(\*\*.*?\*\*)/g);
              return (
                <React.Fragment key={lIdx}>
                  {lIdx > 0 && <br />}
                  {parts.map((part, idx) => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                      return (
                        <strong key={idx} className="font-bold text-[#1FD1EB]">
                          {part.slice(2, -2)}
                        </strong>
                      );
                    }
                    return part;
                  })}
                </React.Fragment>
              );
            })}
          </p>
        );
      })}
    </div>
  );
}

export function ChatMessageList({
  messages,
  isLoading,
  userName = 'Gamer',
}: ChatMessageListProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll contenido EXCLUSIVAMENTE dentro del contenedor de chat
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, isLoading]);

  return (
    <div
      ref={containerRef}
      className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 space-y-6 scrollbar-thin scrollbar-thumb-[#2E334A] hover:scrollbar-thumb-[#783DF2]"
    >
      {messages.map((message) => {
        const isAssistant = message.role === 'assistant';

        return (
          <div
            key={message.id}
            className={`flex gap-3.5 ${
              isAssistant ? 'items-start' : 'items-start flex-row-reverse'
            } animate-in fade-in duration-300`}
          >
            {/* Avatar del Emisor */}
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg ${
                isAssistant
                  ? 'bg-gradient-to-br from-[#783DF2] to-[#1FD1EB] text-white border border-[#1FD1EB]/40'
                  : 'bg-[#1A1C2B] text-[#783DF2] border border-[#2E334A]'
              }`}
            >
              {isAssistant ? (
                <Bot className="w-5 h-5" />
              ) : (
                <User className="w-5 h-5 text-[#1FD1EB]" />
              )}
            </div>

            {/* Burbuja del Mensaje */}
            <div className={`max-w-2xl space-y-3 ${isAssistant ? 'text-left' : 'text-right'}`}>
              
              {/* Encabezado con Nombre y Hora */}
              <div className={`flex items-center gap-2 text-[11px] text-[#94A3B8] ${isAssistant ? 'justify-start' : 'justify-end'}`}>
                <span className="font-bold text-[#F8FAFC]">
                  {isAssistant ? 'ViniChat Assistant' : userName}
                </span>
                <span>•</span>
                <span>
                  {new Date(message.createdAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>

              {/* Contenedor del Mensaje */}
              <div
                className={`p-4 rounded-2xl border shadow-xl ${
                  isAssistant
                    ? 'bg-[#131521] border-[#2E334A] text-left'
                    : 'bg-[#783DF2]/15 border-[#783DF2]/40 text-left'
                }`}
              >
                <FormattedContent text={message.content} />
              </div>

              {/* Tarjetas de Videojuegos Recomendados Embebidas */}
              {isAssistant &&
                message.recommendedGames &&
                message.recommendedGames.length > 0 && (
                  <div className="pt-2 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#1FD1EB]">
                      <Sparkles className="w-3.5 h-3.5 text-[#783DF2]" />
                      <span>Títulos Recomendados de la Tienda:</span>
                    </div>

                    <div className="grid grid-cols-1 gap-2.5">
                      {message.recommendedGames.map((game) => (
                        <ChatProductCard key={game.id} game={game} />
                      ))}
                    </div>
                  </div>
                )}

            </div>
          </div>
        );
      })}

      {/* Indicador de Escritura del Asistente (Typing Indicator) */}
      {isLoading && (
        <div className="flex gap-3.5 items-start animate-in fade-in duration-200">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#783DF2] to-[#1FD1EB] text-white border border-[#1FD1EB]/40 flex items-center justify-center flex-shrink-0 shadow-lg">
            <Bot className="w-5 h-5 animate-pulse" />
          </div>

          <div className="bg-[#131521] border border-[#2E334A] rounded-2xl p-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#1FD1EB] animate-bounce" />
            <span className="w-2 h-2 rounded-full bg-[#783DF2] animate-bounce [animation-delay:0.2s]" />
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-bounce [animation-delay:0.4s]" />
            <span className="text-xs text-[#94A3B8] ml-2">ViniChat está explorando el catálogo...</span>
          </div>
        </div>
      )}
    </div>
  );
}
