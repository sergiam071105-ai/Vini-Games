'use client';

import React, { useState } from 'react';
import {
  X,
  ShieldAlert,
  User,
  Mail,
  Lock,
  Sparkles,
  Upload,
  Check,
  Loader2,
  AlertCircle,
  Eye,
  EyeOff,
  RefreshCw,
} from 'lucide-react';
import { createAdminAccountAction } from '@/app/actions/admin-users.actions';
import { uploadUserAvatar } from '@/lib/supabase/storage';

interface CreateAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdminCreated: () => void;
}

const PRESET_AVATARS = [
  'https://api.dicebear.com/7.x/bottts/svg?seed=CyberNinja',
  'https://api.dicebear.com/7.x/bottts/svg?seed=MechaTitan',
  'https://api.dicebear.com/7.x/bottts/svg?seed=NeonWarrior',
  'https://api.dicebear.com/7.x/bottts/svg?seed=ViniBoss',
  'https://api.dicebear.com/7.x/bottts/svg?seed=QuantumQuest',
  'https://api.dicebear.com/7.x/bottts/svg?seed=PixelMaster',
];

export function CreateAdminModal({
  isOpen,
  onClose,
  onAdminCreated,
}: CreateAdminModalProps) {
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('AdminPass2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(PRESET_AVATARS[0]);
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [role, setRole] = useState<'ADMIN' | 'USER'>('ADMIN');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const generatePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%&*';
    let res = '';
    for (let i = 0; i < 12; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(res);
  };

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
    setSuccessMsg(null);

    if (!username.trim()) {
      setError('El Gamer Tag / Nombre de usuario es obligatorio.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Introduce un correo electrónico válido.');
      return;
    }
    if (!password || password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setIsSubmitting(true);

    try {
      let finalAvatar = customAvatarUrl.trim() || selectedAvatar;

      if (avatarFile) {
        try {
          finalAvatar = await uploadUserAvatar(username.trim(), avatarFile);
        } catch (uploadErr) {
          console.warn('Error subiendo avatar a storage:', uploadErr);
        }
      }

      const res = await createAdminAccountAction({
        username: username.trim(),
        fullName: fullName.trim() || undefined,
        email: email.trim(),
        password: password,
        avatarUrl: finalAvatar,
        role: role,
      });

      if (!res.success) {
        setError(res.error || 'No se pudo crear la cuenta.');
        return;
      }

      setSuccessMsg(res.message || 'Cuenta creada exitosamente.');
      setTimeout(() => {
        onAdminCreated();
        onClose();
      }, 1200);
    } catch (err: any) {
      setError(err?.message || 'Error inesperado al crear administrador.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-3xl border border-[#2D3349] bg-[#131521] p-6 shadow-2xl text-white max-h-[90vh] overflow-y-auto">
        
        {/* Botón Cerrar */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 rounded-full p-1.5 text-[#949CB2] hover:bg-[#1A1C2B] hover:text-white transition-colors cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Encabezado */}
        <div className="flex items-center gap-3 border-b border-[#2D3349] pb-4 mb-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#783DF2]/20 text-[#783DF2] border border-[#783DF2]/40 shadow-lg shadow-[#783DF2]/20">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              Crear Cuenta de Administrador
            </h2>
            <p className="text-xs text-[#949CB2]">
              Asigna permisos de gestión comercial, auditoría y control de catálogo.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/30 p-3 text-xs text-[#EF4444] animate-in fade-in">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 flex items-center gap-2 rounded-xl bg-[#10B981]/15 border border-[#10B981]/40 p-3 text-xs text-[#10B981] animate-in fade-in">
            <Check className="h-4 w-4 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Selector de Rol */}
          <div>
            <label className="block text-xs font-bold text-[#949CB2] uppercase tracking-wider mb-1.5">
              Nivel de Acceso / Rol
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('ADMIN')}
                className={`py-2.5 px-4 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  role === 'ADMIN'
                    ? 'bg-[#783DF2]/25 border-[#783DF2] text-white shadow-lg shadow-[#783DF2]/20'
                    : 'bg-[#1A1C2B] border-[#2D3349] text-[#949CB2] hover:border-[#783DF2]/50'
                }`}
              >
                <ShieldAlert className="w-4 h-4 text-[#1FD1EB]" />
                ADMINISTRADOR (Staff)
              </button>

              <button
                type="button"
                onClick={() => setRole('USER')}
                className={`py-2.5 px-4 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  role === 'USER'
                    ? 'bg-[#1FD1EB]/20 border-[#1FD1EB] text-white shadow-lg shadow-[#1FD1EB]/20'
                    : 'bg-[#1A1C2B] border-[#2D3349] text-[#949CB2] hover:border-[#1FD1EB]/50'
                }`}
              >
                <User className="w-4 h-4 text-[#10B981]" />
                USUARIO ESTÁNDAR
              </button>
            </div>
          </div>

          {/* Nombre y Gamer Tag */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#949CB2] uppercase tracking-wider mb-1.5">
                Nombre Completo
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ej. Sergio Montibeller"
                className="w-full bg-[#1A1C2B] border border-[#2D3349] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#783DF2] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#949CB2] uppercase tracking-wider mb-1.5">
                Gamer Tag (@username) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#949CB2]">@</span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9_-]/g, ''))}
                  placeholder="admin_sergio"
                  required
                  className="w-full bg-[#1A1C2B] border border-[#2D3349] rounded-xl pl-7 pr-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#783DF2] transition-all font-mono"
                />
              </div>
            </div>
          </div>

          {/* Correo Electrónico */}
          <div>
            <label className="block text-xs font-bold text-[#949CB2] uppercase tracking-wider mb-1.5">
              Correo Electrónico *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#949CB2]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@vinigames.bo"
                required
                className="w-full bg-[#1A1C2B] border border-[#2D3349] rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#783DF2] transition-all"
              />
            </div>
          </div>

          {/* Contraseña con Generador */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-[#949CB2] uppercase tracking-wider">
                Contraseña Temporal *
              </label>
              <button
                type="button"
                onClick={generatePassword}
                className="text-[10px] text-[#1FD1EB] hover:underline flex items-center gap-1 cursor-pointer font-bold"
              >
                <RefreshCw className="w-3 h-3" /> Auto-generar
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#949CB2]" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[#1A1C2B] border border-[#2D3349] rounded-xl pl-9 pr-10 py-2.5 text-xs text-white focus:outline-none focus:border-[#783DF2] transition-all font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#949CB2] hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Selector de Avatar */}
          <div>
            <label className="block text-xs font-bold text-[#949CB2] uppercase tracking-wider mb-2">
              Avatar del Administrador
            </label>
            <div className="grid grid-cols-6 gap-2 mb-2">
              {PRESET_AVATARS.map((avatar, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => {
                    setSelectedAvatar(avatar);
                    setCustomAvatarUrl('');
                    setAvatarFile(null);
                  }}
                  className={`relative aspect-square rounded-2xl overflow-hidden border-2 bg-[#1C1730] p-1 transition-all cursor-pointer ${
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="file"
                id="adminAvatarFile"
                accept="image/*"
                onChange={handleAvatarFileChange}
                className="hidden"
              />
              <label
                htmlFor="adminAvatarFile"
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

          {/* Botones de Acción */}
          <div className="flex gap-3 pt-3 border-t border-[#2D3349]">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 rounded-xl border border-[#2D3349] bg-transparent py-2.5 text-xs font-bold text-[#949CB2] hover:bg-[#1A1C2B] hover:text-white transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#783DF2] to-[#682FD0] py-2.5 text-xs font-bold text-white hover:opacity-90 transition-all shadow-lg shadow-[#783DF2]/30 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Creando Cuenta...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Crear Administrador</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
