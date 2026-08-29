'use client';

import React, { useState } from 'react';
import { X, Sparkles, User, Check, Loader2, AlertCircle, Upload } from 'lucide-react';
import { updateProfileAction } from '@/app/actions/profile.actions';
import { uploadUserAvatar } from '@/lib/supabase/storage';

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
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      const tempUrl = URL.createObjectURL(file);
      setCustomAvatarUrl(tempUrl);
      setSelectedAvatar(tempUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim()) {
      setError('El nombre de usuario no puede estar vacío.');
      return;
    }

    setIsSaving(true);

    try {
      let finalAvatar = customAvatarUrl.trim() || selectedAvatar;

      // Si el usuario seleccionó un archivo local, subirlo a Supabase Storage (o Base64 permanente)
      if (avatarFile) {
        try {
          finalAvatar = await uploadUserAvatar(username.trim(), avatarFile);
        } catch (uploadErr) {
          console.warn('Error subiendo avatar a storage:', uploadErr);
        }
      }

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
              Elige tu Avatar o Sube uno Propio
            </label>
            <div className="grid grid-cols-6 gap-2 mb-3">
              {PRESET_AVATARS.map((avatar, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => {
                    setSelectedAvatar(avatar);
                    setCustomAvatarUrl('');
                    setAvatarFile(null);
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

            {/* Subir archivo desde PC o URL */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
              <input
                type="file"
                id="avatarFileUpload"
                accept="image/*"
                onChange={handleAvatarFileChange}
                className="hidden"
              />
              <label
                htmlFor="avatarFileUpload"
                className="py-2 px-3 bg-[#1A1C2B] hover:bg-[#25283d] text-[#1FD1EB] border border-[#2D3349] hover:border-[#1FD1EB]/50 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center justify-center gap-2"
              >
                <Upload className="w-3.5 h-3.5" />
                Subir Foto desde PC
              </label>

              <input
                type="url"
                value={customAvatarUrl.startsWith('blob:') || customAvatarUrl.startsWith('data:') ? '' : customAvatarUrl}
                onChange={(e) => {
                  setCustomAvatarUrl(e.target.value);
                  setAvatarFile(null);
                }}
                placeholder="O pegar URL de imagen..."
                className="bg-[#1A1C2B] border border-[#2D3349] rounded-xl px-3 py-2 text-xs text-white placeholder:text-[#64748B] focus:outline-none focus:border-[#783DF2]"
              />
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
            <label className="block text-xs font-bold text-[#949CB2] uppercase tracking-wider mb-1.5">
              Biografía Gamer
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Cuéntale a la comunidad tus géneros favoritos o estilo de juego..."
              rows={3}
              maxLength={200}
              className="w-full bg-[#1A1C2B] border border-[#2D3349] rounded-xl p-3 text-sm text-white placeholder:text-[#64748B] focus:outline-none focus:border-[#783DF2] focus:ring-1 focus:ring-[#783DF2] resize-none"
            />
            <span className="text-[10px] text-[#64748B] text-right block mt-1">
              {bio.length}/200 caracteres
            </span>
          </div>

          {/* Botones de Acción */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="flex-1 rounded-xl border border-[#2D3349] bg-transparent py-2.5 text-sm font-semibold text-[#949CB2] hover:bg-[#1A1C2B] hover:text-white transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#783DF2] py-2.5 text-sm font-semibold text-white hover:bg-[#682FD0] transition-colors shadow-lg shadow-[#783DF2]/25 disabled:opacity-50"
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
