'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Send,
  Plus,
  Trash2,
  Sparkles,
  Bot,
  MessageSquare,
  Zap,
  ArrowLeft,
  Menu,
  X,
  PanelLeft,
} from 'lucide-react';
import Link from 'next/link';
import {
  getChatSessionsAction,
  createChatSessionAction,
  getChatMessagesAction,
  sendChatMessageAction,
  deleteChatSessionAction,
} from '@/app/actions/chat.actions';
import { ChatSession, ChatMessage } from '@/types/chat.types';
import { ChatMessageList } from '@/components/chat/chat-message-list';
import { ChatInput } from '@/components/chat/chat-input';

export default function ChatPage() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSessionsLoading, setIsSessionsLoading] = useState<boolean>(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState<boolean>(true);

  // Cargar sesiones al montar
  const loadSessions = useCallback(async () => {
    try {
      setIsSessionsLoading(true);
      const res = await getChatSessionsAction();
      if (res && res.length > 0) {
        setSessions(res);
        setCurrentSessionId(res[0].id);
      } else {
        const newSession = await createChatSessionAction('Consultas de Descubrimiento Gamer');
        if (newSession) {
          setSessions([newSession]);
          setCurrentSessionId(newSession.id);
        }
      }
    } finally {
      setIsSessionsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  // Cargar mensajes cuando cambia la sesión activa
  useEffect(() => {
    if (!currentSessionId) return;

    let isMounted = true;
    const loadMessages = async () => {
      const msgs = await getChatMessagesAction(currentSessionId);
      if (isMounted) {
        setMessages(msgs);
      }
    };

    loadMessages();

    return () => {
      isMounted = false;
    };
  }, [currentSessionId]);

  // Crear nueva sesión
  const handleNewSession = async () => {
    setIsLoading(true);
    try {
      const newSession = await createChatSessionAction(`Consulta Gamer #${sessions.length + 1}`);
      if (newSession) {
        setSessions((prev) => [newSession, ...prev]);
        setCurrentSessionId(newSession.id);
        setIsMobileSidebarOpen(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Eliminar sesión
  const handleDeleteSession = async (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await deleteChatSessionAction(sessionId);
    const updated = sessions.filter((s) => s.id !== sessionId);
    setSessions(updated);
    if (currentSessionId === sessionId) {
      if (updated.length > 0) {
        setCurrentSessionId(updated[0].id);
      } else {
        handleNewSession();
      }
    }
  };

  // Enviar mensaje
  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    // Mensaje optimista del usuario
    const optimisticUserMsg: ChatMessage = {
      id: `temp-user-${Date.now()}`,
      sessionId: currentSessionId,
      role: 'user',
      content,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, optimisticUserMsg]);
    setIsLoading(true);

    try {
      const res = await sendChatMessageAction({
        sessionId: currentSessionId,
        content,
      });

      if (res.success && res.assistantMessage) {
        setMessages((prev) => [
          ...prev.filter((m) => m.id !== optimisticUserMsg.id),
          res.userMessage || optimisticUserMsg,
          res.assistantMessage!,
        ]);

        // Actualizar título de la sesión si es la primera pregunta
        setSessions((prev) =>
          prev.map((s) =>
            s.id === currentSessionId && s.title.startsWith('Consulta Gamer')
              ? { ...s, title: content.slice(0, 30) + '...' }
              : s
          )
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const activeSession = sessions.find((s) => s.id === currentSessionId);

  return (
    <div className="w-full flex flex-col h-[calc(100vh-8.5rem)] min-h-[500px] max-h-[820px] bg-[#090B14] border border-[#2E334A] rounded-2xl overflow-hidden shadow-2xl relative">
      
      <div className="flex flex-1 h-full min-h-0 overflow-hidden">
        
        {/* Sidebar de Sesiones Gamer (Desktop / Tablet) */}
        <aside className={`${isDesktopSidebarOpen ? 'flex w-72 lg:w-80' : 'hidden'} flex-col h-full min-h-0 bg-[#0B0D18] border-r border-[#2E334A] flex-shrink-0 transition-all duration-200`}>
          
          {/* Header del Sidebar */}
          <div className="p-4 border-b border-[#2E334A]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#783DF2] to-[#1FD1EB] flex items-center justify-center text-white shadow-md shadow-[#783DF2]/30">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm font-extrabold text-[#F8FAFC]">ViniChat IA</h2>
                  <span className="text-[10px] text-[#1FD1EB] font-semibold flex items-center gap-1">
                    <Zap className="w-2.5 h-2.5" /> En línea • DeepSeek Engine
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handleNewSession}
              disabled={isLoading}
              className="w-full bg-[#783DF2] hover:bg-[#6929e4] text-[#F8FAFC] font-bold text-xs py-2.5 px-3 rounded-xl transition-all shadow-md shadow-[#783DF2]/20 flex items-center justify-center gap-2 uppercase tracking-wider cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Nueva Consulta
            </button>
          </div>

          {/* Lista de Sesiones */}
          <div className="flex-1 overflow-y-auto p-3 space-y-1.5 scrollbar-none">
            <span className="text-[10px] uppercase tracking-wider text-[#94A3B8] font-bold px-2 py-1 block">
              Historial de Conversaciones
            </span>

            {isSessionsLoading ? (
              <div className="space-y-2 p-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-10 bg-[#1A1C2B] animate-pulse rounded-xl" />
                ))}
              </div>
            ) : sessions.length === 0 ? (
              <div className="text-center py-8 text-xs text-[#94A3B8]">
                No hay conversaciones previas
              </div>
            ) : (
              sessions.map((s) => {
                const isActive = s.id === currentSessionId;
                return (
                  <div
                    key={s.id}
                    onClick={() => setCurrentSessionId(s.id)}
                    className={`flex items-center justify-between p-2.5 rounded-xl text-xs transition-all cursor-pointer group ${
                      isActive
                        ? 'bg-[#1A1C2B] text-[#1FD1EB] border border-[#783DF2]/40 shadow-sm'
                        : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1A1C2B]/50'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0 pr-2">
                      <MessageSquare className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? 'text-[#783DF2]' : ''}`} />
                      <span className="truncate font-medium">{s.title}</span>
                    </div>

                    <button
                      onClick={(e) => handleDeleteSession(s.id, e)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-[#94A3B8] hover:text-[#EF4444] rounded transition-opacity"
                      title="Eliminar conversación"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer del Sidebar con Tips */}
          <div className="p-3 border-t border-[#2E334A] bg-[#131521]/60 text-[11px] text-[#94A3B8]">
            <div className="flex items-center gap-2 mb-1 text-[#F8FAFC] font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-[#1FD1EB]" />
              <span>Sugerencia Gamer</span>
            </div>
            <span>Pregunta por ofertas combinadas o juegos similares a tus favoritos.</span>
          </div>

        </aside>

        {/* Panel Principal de Chat */}
        <section className="flex-1 flex flex-col h-full min-h-0 overflow-hidden bg-[#090B14]">
          
          {/* Header Superior del Chat */}
          <div className="flex items-center justify-between p-3.5 sm:p-4 border-b border-[#2E334A] bg-[#0B0D18]/70">
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setIsDesktopSidebarOpen(!isDesktopSidebarOpen);
                  setIsMobileSidebarOpen(true);
                }}
                className="p-2 bg-[#1A1C2B] text-[#94A3B8] hover:text-[#1FD1EB] rounded-lg border border-[#2E334A] transition-colors cursor-pointer flex items-center gap-1.5"
                title="Historial de chats"
              >
                <PanelLeft className="w-4 h-4 text-[#783DF2]" />
                <span className="text-xs font-semibold hidden sm:inline">Chats</span>
              </button>

              <div>
                <h1 className="text-sm sm:text-base font-bold text-[#F8FAFC] flex items-center gap-2">
                  <span>{activeSession?.title || 'ViniChat Asistente Gamer'}</span>
                  <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full bg-[#783DF2]/20 border border-[#783DF2]/40 text-[#1FD1EB] text-[10px] font-extrabold uppercase">
                    AI Assistant
                  </span>
                </h1>
                <span className="text-[11px] text-[#94A3B8]">
                  Respuestas en tiempo real con recomendaciones interactivas
                </span>
              </div>
            </div>

            <Link
              href="/catalog"
              className="hidden sm:flex items-center gap-1.5 text-xs text-[#94A3B8] hover:text-[#1FD1EB] px-3 py-1.5 bg-[#1A1C2B] rounded-lg border border-[#2E334A] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Ver Catálogo</span>
            </Link>
          </div>

          {/* Feed de Mensajes */}
          <ChatMessageList
            messages={messages}
            isLoading={isLoading}
          />

          {/* Barra de Entrada de Texto con Chips */}
          <ChatInput
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
          />

        </section>

      </div>

      {/* Drawer Lateral para Móviles */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            onClick={() => setIsMobileSidebarOpen(false)}
            className="fixed inset-0 bg-[#090B14]/80 backdrop-blur-sm"
          />
          <div className="relative w-72 bg-[#0B0D18] h-full flex flex-col border-r border-[#2E334A] z-10 animate-in slide-in-from-left duration-200">
            <div className="p-4 border-b border-[#2E334A] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-[#1FD1EB]" />
                <span className="text-sm font-bold text-[#F8FAFC]">Historial de Chat</span>
              </div>
              <button
                onClick={() => setIsMobileSidebarOpen(false)}
                className="p-1 text-[#94A3B8] hover:text-[#F8FAFC]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3">
              <button
                onClick={handleNewSession}
                className="w-full bg-[#783DF2] text-[#F8FAFC] font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Nueva Consulta
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
              {sessions.map((s) => (
                <div
                  key={s.id}
                  onClick={() => {
                    setCurrentSessionId(s.id);
                    setIsMobileSidebarOpen(false);
                  }}
                  className={`p-2.5 rounded-xl text-xs truncate ${
                    s.id === currentSessionId
                      ? 'bg-[#1A1C2B] text-[#1FD1EB] font-bold'
                      : 'text-[#94A3B8]'
                  }`}
                >
                  {s.title}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
