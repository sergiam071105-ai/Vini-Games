'use client';

import React, { useState } from 'react';
import { X, Sparkles, User, Check, Loader2, AlertCircle } from 'lucide-react';
import { updateProfileAction } from '@/app/actions/profile.actions';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUsername: string;
  currentFullName: string;
  currentBio: string;
  currentAvatarUrl: string;
  onProfileUpdated: (updated: { username: string; fullName: string; bio: string; avatarUrl: string }) => void;
}

const PRESET_AVATARS = [
  'https://api.dicebear.com/7.x/bottts/svg?seed=CyberGamer',
  'https://api.dicebear.com/7.x/bottts/svg?seed=NeonWarrior',
  'https://api.dicebear.com/7.x/bottts/svg?seed=PixelMaster',
  'https://api.dicebear.com/7.x/bottts/svg?seed=ShadowRunner',
  'https://api.dicebear.com/7.x/bottts/svg?seed=ViniBoss',
  'https://api.dicebear.com/7.x/bottts/svg?seed=QuantumQuest',
];

export function EditProfileModal({
  isOpen,
  onClose,
  currentUsername,
  currentFullName,
  currentBio,
  currentAvatarUrl,
  onProfileUpdated,
}: EditProfileModalProps) {
  const [username, setUsername] = useState(currentUsername);
  const [fullName, setFullName] = useState(currentFullName);
  const [bio, setBio] = useState(currentBio);
  const [selectedAvatar, setSelectedAvatar] = useState(currentAvatarUrl);
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim()) {
      setError('El nombre de usuario no puede estar vacío.');
      return;
    }

    setIsSaving(true);
    const finalAvatar = customAvatarUrl.trim() || selectedAvatar;

    try {
      const res = await updateProfileAction({
        username: username.trim(),
        fullName: fullName.trim(),
        bio: bio.trim(),
        avatarUrl: finalAvatar,
      });

      if (!res.success) {
        setError(res.error || 'No se pudo actualizar el perfil.');
        return;
      }

      onProfileUpdated({
        username: username.trim(),
        fullName: fullName.trim(),
        bio: bio.trim(),
        avatarUrl: finalAvatar,
      });

      onClose();
    } catch (err: any) {
      setError(err?.message || 'Error inesperado al guardar.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl border border-[#2D3349] bg-[#131521] p-6 shadow-2xl text-white">
        
        {/* Botón Cerrar */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 rounded-full p-1.5 text-[#949CB2] hover:bg-[#1A1C2B] hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Encabezado */}
        <div className="flex items-center gap-3 border-b border-[#2D3349] pb-4 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#783DF2]/20 text-[#783DF2]">
            <User className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Editar Perfil Gamer</h2>
            <p className="text-xs text-[#949CB2]">Personaliza tu identidad en la plataforma</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/30 p-3 text-xs text-[#EF4444]">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Selector de Avatar */}
          <div>
            <label className="block text-xs font-bold text-[#949CB2] uppercase tracking-wider mb-2">
              Elige tu Avatar
            </label>
            <div className="grid grid-cols-6 gap-2 mb-3">
              {PRESET_AVATARS.map((avatar, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => {
                    setSelectedAvatar(avatar);
                    setCustomAvatarUrl('');
                  }}
                  className={`relative aspect-square rounded-2xl overflow-hidden border-2 bg-[#1C1730] p-1 transition-all ${
                    selectedAvatar === avatar && !customAvatarUrl
                      ? 'border-[#783DF2] ring-2 ring-[#783DF2]/50 scale-105'
                      : 'border-transparent hover:border-[#2D3349]'
                  }`}
                >
                  <img src={avatar} alt={`Avatar ${idx + 1}`} className="h-full w-full object-cover" />
                  {selectedAvatar === avatar && !customAvatarUrl && (
                    <div className="absolute inset-0 bg-[#783DF2]/30 flex items-center justify-center">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Username */}
          <div>
            <label className="block text-xs font-bold text-[#949CB2] uppercase tracking-wider mb-1.5">
              Nombre de Usuario (@tag)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-[#949CB2]">@</span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9_-]/g, ''))}
                placeholder="tu_username"
                maxLength={30}
                required
                className="w-full bg-[#1A1C2B] border border-[#2D3349] rounded-xl pl-8 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#783DF2] focus:ring-1 focus:ring-[#783DF2]"
              />
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-[#949CB2] uppercase tracking-wider mb-1.5">
              Nombre Visible
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Ej. Eduardo Ribera"
              maxLength={50}
              className="w-full bg-[#1A1C2B] border border-[#2D3349] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#783DF2] focus:ring-1 focus:ring-[#783DF2]"
            />
          </div>

          {/* Bio */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-bold text-[#949CB2] uppercase tracking-wider">
                Biografía Gamer
              </label>
              <span className="text-[10px] text-[#949CB2]">{bio.length} / 160</span>
            </div>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Escribe algo sobre tu estilo de juego, tus sagas favoritas..."
              maxLength={160}
              rows={3}
              className="w-full bg-[#1A1C2B] border border-[#2D3349] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#783DF2] focus:ring-1 focus:ring-[#783DF2] resize-none"
            />
          </div>

          {/* Botones de Acción */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#2D3349]">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-[#949CB2] hover:bg-[#1A1C2B] hover:text-white transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 rounded-xl bg-[#783DF2] hover:bg-[#8B4DFF] px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-[#783DF2]/30 transition-all disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Guardar Cambios</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
