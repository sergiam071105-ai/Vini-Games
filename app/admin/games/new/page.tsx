'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  Save,
  Upload,
  Sparkles,
  Gamepad2,
  AlertCircle,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import {
  getAllCategoriesAction,
  createGameAdminAction,
} from '@/app/actions/games.admin.actions';
import { uploadGameCover } from '@/lib/supabase/storage';

export default function NewGamePage() {
  const router = useRouter();

  const [categories, setCategories] = useState<{ id: number; name: string; slug: string }[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [developer, setDeveloper] = useState('');
  const [releaseDate, setReleaseDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [basePrice, setBasePrice] = useState<number>(250);
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [isActive, setIsActive] = useState(true);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);

  // Image Upload State
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string>('/games/neon-odyssey.jpg');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Cargar categorías disponibles
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllCategoriesAction();
        setCategories(data);
        if (data.length > 0) {
          setSelectedCategoryIds([data[0].id]);
        }
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  // Generador automático de slug
  const handleTitleChange = (val: string) => {
    setTitle(val);
    const generatedSlug = val
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');
    setSlug(generatedSlug);
  };

  const handleToggleCategory = (catId: number) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(catId) ? prev.filter((id) => id !== catId) : [...prev, catId]
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const finalPrice = Math.round(Number(basePrice) * (1 - Number(discountPercent) / 100));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (selectedCategoryIds.length === 0) {
      setError('Debes seleccionar al menos una categoría para el videojuego.');
      return;
    }

    setIsUploading(true);

    try {
      let finalCoverUrl = coverPreview;

      // 1. Subir carátula a Supabase Storage si se seleccionó archivo
      if (coverFile) {
        try {
          finalCoverUrl = await uploadGameCover(slug || 'game-cover', coverFile);
        } catch (uploadErr: any) {
          console.warn('Error subiendo imagen al storage, usando imagen fallback:', uploadErr);
          finalCoverUrl = '/games/neon-odyssey.jpg';
        }
      }

      // 2. Invocar Server Action de creación
      const res = await createGameAdminAction({
        title,
        slug,
        developer,
        releaseDate,
        description,
        basePrice: Number(basePrice),
        discountPercent: Number(discountPercent),
        coverImageUrl: finalCoverUrl,
        isActive,
        categoryIds: selectedCategoryIds,
      });

      if (!res.success) {
        setError(res.error || 'Error al registrar el videojuego');
      } else {
        setSuccess(true);
        setTimeout(() => {
          router.push('/admin/games');
        }, 1200);
      }
    } catch (err: any) {
      setError(err.message || 'Error inesperado al conectar con el servidor');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-4xl mx-auto">
      
      {/* Encabezado */}
      <div className="flex items-center justify-between border-b border-[#2E334A] pb-5">
        <div>
          <Link
            href="/admin/games"
            className="inline-flex items-center gap-1.5 text-xs text-[#94A3B8] hover:text-[#1FD1EB] mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Volver al catálogo
          </Link>
          <h1 className="text-2xl font-extrabold text-[#F8FAFC] flex items-center gap-2.5">
            <Gamepad2 className="w-6 h-6 text-[#783DF2]" />
            Registrar Nuevo Videojuego
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1">
            Completa la ficha técnica, precios y sube la portada oficial.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-[#EF4444]/15 border border-[#EF4444]/40 rounded-2xl flex items-center gap-3 text-xs text-[#EF4444] animate-in fade-in">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 bg-[#10B981]/15 border border-[#10B981]/40 rounded-2xl flex items-center gap-3 text-xs text-[#10B981] animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>¡Videojuego registrado exitosamente! Redirigiendo al catálogo...</span>
        </div>
      )}

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Columna Izquierda: Portada y Previsualización (1 col) */}
          <div className="space-y-4">
            <div className="bg-[#131521] border border-[#2E334A] rounded-2xl p-4 text-center">
              <label className="block text-xs font-bold text-[#F8FAFC] mb-2 text-left">
                Portada del Videojuego
              </label>

              <div className="w-full aspect-[4/5] rounded-xl overflow-hidden bg-[#090B14] relative border border-[#2E334A] mb-3 group">
                <Image
                  src={coverPreview}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-xs text-white font-bold flex items-center gap-1.5">
                    <Upload className="w-4 h-4" /> Cambiar
                  </span>
                </div>
              </div>

              <input
                type="file"
                id="coverUpload"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <label
                htmlFor="coverUpload"
                className="w-full py-2 bg-[#1A1C2B] hover:bg-[#25283d] text-[#1FD1EB] border border-[#2E334A] hover:border-[#1FD1EB]/50 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center justify-center gap-2 mb-2"
              >
                <Upload className="w-3.5 h-3.5" />
                Subir desde PC (Supabase Storage)
              </label>

              {/* O ingresar URL directa */}
              <div className="text-left mt-2">
                <label className="text-[10px] text-[#94A3B8] font-bold block mb-1">
                  O pegar URL de imagen externa:
                </label>
                <input
                  type="url"
                  placeholder="https://... (Steam, IGDB, Unsplash)"
                  value={coverPreview.startsWith('blob:') || coverPreview.startsWith('data:') ? '' : coverPreview}
                  onChange={(e) => {
                    if (e.target.value.trim()) {
                      setCoverFile(null);
                      setCoverPreview(e.target.value.trim());
                    }
                  }}
                  className="w-full px-3 py-1.5 bg-[#090B14] border border-[#2E334A] focus:border-[#783DF2] rounded-lg text-[11px] text-[#F8FAFC] outline-none transition-all"
                />
              </div>
              <span className="text-[10px] text-[#94A3B8] mt-1.5 block">
                Formatos: JPG, PNG, WEBP o enlaces HTTPS
              </span>
            </div>

            {/* Previsualización de Precios */}
            <div className="bg-[#131521] border border-[#2E334A] rounded-2xl p-4 space-y-2 text-xs">
              <span className="font-bold text-[#F8FAFC] block border-b border-[#2E334A] pb-2">
                Resumen Financiero
              </span>
              <div className="flex justify-between text-[#94A3B8]">
                <span>Precio Base:</span>
                <span>Bs. {basePrice || 0}</span>
              </div>
              <div className="flex justify-between text-[#10B981]">
                <span>Descuento:</span>
                <span>{discountPercent || 0}%</span>
              </div>
              <div className="flex justify-between font-bold text-sm pt-2 border-t border-[#2E334A] text-[#F8FAFC]">
                <span>Precio Final:</span>
                <span className="text-[#1FD1EB]">Bs. {finalPrice}</span>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Campos del Formulario (2 cols) */}
          <div className="md:col-span-2 space-y-4">
            <div className="bg-[#131521] border border-[#2E334A] rounded-2xl p-6 space-y-4">
              
              {/* Título y Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#94A3B8] mb-1.5">
                    Título del Videojuego *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Cyber Rush 2077"
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="w-full bg-[#1A1C2B] border border-[#2E334A] focus:border-[#783DF2] rounded-xl px-3.5 py-2.5 text-xs text-[#F8FAFC] placeholder-[#94A3B8]/60 focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#94A3B8] mb-1.5">
                    Slug URL (Autogenerado) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ej. cyber-rush-2077"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full bg-[#1A1C2B] border border-[#2E334A] focus:border-[#783DF2] rounded-xl px-3.5 py-2.5 text-xs text-[#F8FAFC] placeholder-[#94A3B8]/60 focus:outline-none transition-all font-mono"
                  />
                </div>
              </div>

              {/* Estudio y Fecha de Estreno */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#94A3B8] mb-1.5">
                    Estudio Desarrollador *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. CD Projekt Red"
                    value={developer}
                    onChange={(e) => setDeveloper(e.target.value)}
                    className="w-full bg-[#1A1C2B] border border-[#2E334A] focus:border-[#783DF2] rounded-xl px-3.5 py-2.5 text-xs text-[#F8FAFC] placeholder-[#94A3B8]/60 focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#94A3B8] mb-1.5">
                    Fecha de Estreno *
                  </label>
                  <input
                    type="date"
                    required
                    value={releaseDate}
                    onChange={(e) => setReleaseDate(e.target.value)}
                    className="w-full bg-[#1A1C2B] border border-[#2E334A] focus:border-[#783DF2] rounded-xl px-3.5 py-2.5 text-xs text-[#F8FAFC] focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* Precios y Descuentos */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#94A3B8] mb-1.5">
                    Precio Base en Bolivianos (Bs.) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    required
                    value={basePrice}
                    onChange={(e) => setBasePrice(Number(e.target.value))}
                    className="w-full bg-[#1A1C2B] border border-[#2E334A] focus:border-[#783DF2] rounded-xl px-3.5 py-2.5 text-xs text-[#F8FAFC] focus:outline-none transition-all font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#94A3B8] mb-1.5">
                    Descuento Promocional (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="90"
                    step="5"
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(Number(e.target.value))}
                    className="w-full bg-[#1A1C2B] border border-[#2E334A] focus:border-[#783DF2] rounded-xl px-3.5 py-2.5 text-xs text-[#F8FAFC] focus:outline-none transition-all font-mono"
                  />
                </div>
              </div>

              {/* Categorías Multi-Select */}
              <div>
                <label className="block text-xs font-bold text-[#94A3B8] mb-2">
                  Categorías y Géneros Asociados * (Selecciona al menos una)
                </label>
                {loadingCategories ? (
                  <div className="text-xs text-[#94A3B8]">Cargando categorías...</div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => {
                      const isSelected = selectedCategoryIds.includes(cat.id);
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => handleToggleCategory(cat.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#783DF2] text-[#F8FAFC] shadow-md shadow-[#783DF2]/30 border border-[#783DF2]'
                              : 'bg-[#1A1C2B] text-[#94A3B8] hover:text-[#F8FAFC] border border-[#2E334A]'
                          }`}
                        >
                          {cat.name}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-xs font-bold text-[#94A3B8] mb-1.5">
                  Descripción Oficial del Videojuego *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Escribe la sinopsis, características destacadas y requisitos generales..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#1A1C2B] border border-[#2E334A] focus:border-[#783DF2] rounded-xl p-3 text-xs text-[#F8FAFC] placeholder-[#94A3B8]/60 focus:outline-none transition-all resize-none"
                />
              </div>

              {/* Estado Activo Switch */}
              <div
                onClick={() => setIsActive(!isActive)}
                className="flex items-center justify-between p-4 bg-[#1A1C2B] hover:bg-[#202336] rounded-xl border border-[#2E334A] hover:border-[#783DF2]/50 transition-all cursor-pointer select-none"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#F8FAFC]">
                      Publicar de Inmediato en el Catálogo
                    </span>
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                        isActive
                          ? 'bg-[#10B981]/20 border-[#10B981]/40 text-[#10B981]'
                          : 'bg-[#EF4444]/20 border-[#EF4444]/40 text-[#EF4444]'
                      }`}
                    >
                      {isActive ? 'PUBLICAR (ACTIVO)' : 'GUARDAR OCULTO'}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#94A3B8] block mt-0.5">
                    {isActive
                      ? 'El videojuego estará visible de inmediato en la tienda y catálogo.'
                      : 'El videojuego se guardará como inactivo (oculto para los usuarios).'}
                  </span>
                </div>

                <button
                  type="button"
                  aria-checked={isActive}
                  role="switch"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsActive(!isActive);
                  }}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer flex-shrink-0 ${
                    isActive ? 'bg-[#10B981]' : 'bg-[#2E334A]'
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                      isActive ? 'left-7' : 'left-1'
                    }`}
                  />
                </button>
              </div>

            </div>

            {/* Botones de Envío */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <Link
                href="/admin/games"
                className="px-5 py-2.5 bg-[#1A1C2B] hover:bg-[#25283d] text-[#94A3B8] hover:text-[#F8FAFC] rounded-xl text-xs font-semibold transition-colors"
              >
                Cancelar
              </Link>

              <button
                type="submit"
                disabled={isUploading || success}
                className="px-6 py-2.5 bg-[#783DF2] hover:bg-[#6929e4] disabled:opacity-50 text-[#F8FAFC] font-bold text-xs rounded-xl transition-all shadow-lg shadow-[#783DF2]/30 flex items-center gap-2 uppercase tracking-wider cursor-pointer"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#1FD1EB]" />
                    <span>Guardando...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Guardar Videojuego</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </div>

      </form>

    </div>
  );
}
