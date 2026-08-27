'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  Save,
  Upload,
  Gamepad2,
  AlertCircle,
  Loader2,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import {
  getAllCategoriesAction,
  getAdminGameByIdAction,
  updateGameAdminAction,
} from '@/app/actions/games.admin.actions';
import { uploadGameCover } from '@/lib/supabase/storage';

export default function EditGamePage() {
  const router = useRouter();
  const params = useParams();
  const gameId = Number(params?.id);

  const [categories, setCategories] = useState<{ id: number; name: string; slug: string }[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [developer, setDeveloper] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [description, setDescription] = useState('');
  const [basePrice, setBasePrice] = useState<number>(0);
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [isActive, setIsActive] = useState(true);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);

  // Image Upload State
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string>('/games/neon-odyssey.jpg');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Cargar datos del videojuego y categorías
  useEffect(() => {
    if (!gameId) return;

    const loadGameData = async () => {
      setLoading(true);
      try {
        const [cats, gameData] = await Promise.all([
          getAllCategoriesAction(),
          getAdminGameByIdAction(gameId),
        ]);

        setCategories(cats);

        if (gameData) {
          setTitle(gameData.title);
          setSlug(gameData.slug);
          setDeveloper(gameData.developer);
          setReleaseDate(gameData.releaseDate ? gameData.releaseDate.split('T')[0] : '');
          setDescription(gameData.description);
          setBasePrice(gameData.basePrice);
          setDiscountPercent(gameData.discountPercent);
          setIsActive(gameData.isActive);
          setCoverPreview(gameData.coverImageUrl || '/games/neon-odyssey.jpg');
          setSelectedCategoryIds(gameData.categories.map((c) => c.id));
        } else {
          setError('No se encontró el videojuego solicitado.');
        }
      } catch (err: any) {
        setError(err.message || 'Error cargando datos');
      } finally {
        setLoading(false);
      }
    };

    loadGameData();
  }, [gameId]);

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

    setIsSaving(true);

    try {
      let finalCoverUrl = coverPreview;

      // Subir nueva carátula si se cambió el archivo
      if (coverFile) {
        try {
          finalCoverUrl = await uploadGameCover(slug, coverFile);
        } catch (uploadErr: any) {
          console.warn('Error subiendo imagen al storage, manteniendo la anterior:', uploadErr);
        }
      }

      const res = await updateGameAdminAction(gameId, {
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
        setError(res.error || 'Error al actualizar el videojuego');
      } else {
        setSuccess(true);
        setTimeout(() => {
          router.push('/admin/games');
        }, 1200);
      }
    } catch (err: any) {
      setError(err.message || 'Error al conectar con el servidor');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center text-center space-y-3">
        <Loader2 className="w-8 h-8 text-[#783DF2] animate-spin" />
        <p className="text-xs text-[#94A3B8]">Cargando ficha del videojuego...</p>
      </div>
    );
  }

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
            Editar: {title || 'Videojuego'}
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1">
            Modifica precios, promociones, categorías y visibilidad del producto.
          </p>
        </div>

        <Link
          href={`/games/${slug}`}
          target="_blank"
          className="hidden sm:flex items-center gap-1.5 text-xs text-[#94A3B8] hover:text-[#1FD1EB] px-3 py-1.5 bg-[#131521] border border-[#2E334A] rounded-lg transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Ver Ficha Pública</span>
        </Link>
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
          <span>¡Cambios guardados exitosamente! Redirigiendo...</span>
        </div>
      )}

      {/* Formulario de Edición */}
      <form onSubmit={handleSubmit} className="space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Columna Izquierda: Portada y Precios */}
          <div className="space-y-4">
            <div className="bg-[#131521] border border-[#2E334A] rounded-2xl p-4 text-center">
              <label className="block text-xs font-bold text-[#F8FAFC] mb-2 text-left">
                Portada Actual
              </label>

              <div className="w-full aspect-[4/5] rounded-xl overflow-hidden bg-[#090B14] relative border border-[#2E334A] mb-3 group">
                <Image
                  src={coverPreview}
                  alt={title}
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
                id="coverEditUpload"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <label
                htmlFor="coverEditUpload"
                className="w-full py-2 bg-[#1A1C2B] hover:bg-[#25283d] text-[#1FD1EB] border border-[#2E334A] hover:border-[#1FD1EB]/50 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center justify-center gap-2"
              >
                <Upload className="w-3.5 h-3.5" />
                Actualizar Imagen
              </label>
            </div>

            {/* Resumen Financiero Dinámico */}
            <div className="bg-[#131521] border border-[#2E334A] rounded-2xl p-4 space-y-2 text-xs">
              <span className="font-bold text-[#F8FAFC] block border-b border-[#2E334A] pb-2">
                Precios y Promoción
              </span>
              <div className="flex justify-between text-[#94A3B8]">
                <span>Precio Base:</span>
                <span>Bs. {basePrice || 0}</span>
              </div>
              <div className="flex justify-between text-[#10B981]">
                <span>Descuento Activo:</span>
                <span>{discountPercent || 0}%</span>
              </div>
              <div className="flex justify-between font-bold text-sm pt-2 border-t border-[#2E334A] text-[#F8FAFC]">
                <span>Precio de Venta:</span>
                <span className="text-[#1FD1EB]">Bs. {finalPrice}</span>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Campos */}
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
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-[#1A1C2B] border border-[#2E334A] focus:border-[#783DF2] rounded-xl px-3.5 py-2.5 text-xs text-[#F8FAFC] focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#94A3B8] mb-1.5">
                    Slug URL *
                  </label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full bg-[#1A1C2B] border border-[#2E334A] focus:border-[#783DF2] rounded-xl px-3.5 py-2.5 text-xs text-[#F8FAFC] focus:outline-none transition-all font-mono"
                  />
                </div>
              </div>

              {/* Estudio y Fecha */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#94A3B8] mb-1.5">
                    Estudio Desarrollador *
                  </label>
                  <input
                    type="text"
                    required
                    value={developer}
                    onChange={(e) => setDeveloper(e.target.value)}
                    className="w-full bg-[#1A1C2B] border border-[#2E334A] focus:border-[#783DF2] rounded-xl px-3.5 py-2.5 text-xs text-[#F8FAFC] focus:outline-none transition-all"
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

              {/* Precios y Descuento */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#94A3B8] mb-1.5">
                    Precio Base (Bs.) *
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

              {/* Categorías */}
              <div>
                <label className="block text-xs font-bold text-[#94A3B8] mb-2">
                  Categorías y Géneros Asociados *
                </label>
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
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-xs font-bold text-[#94A3B8] mb-1.5">
                  Descripción Oficial *
                </label>
                <textarea
                  rows={4}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#1A1C2B] border border-[#2E334A] focus:border-[#783DF2] rounded-xl p-3 text-xs text-[#F8FAFC] focus:outline-none transition-all resize-none"
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
                      Estado en Catálogo
                    </span>
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                        isActive
                          ? 'bg-[#10B981]/20 border-[#10B981]/40 text-[#10B981]'
                          : 'bg-[#EF4444]/20 border-[#EF4444]/40 text-[#EF4444]'
                      }`}
                    >
                      {isActive ? 'ACTIVO' : 'INACTIVO'}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#94A3B8] block mt-0.5">
                    {isActive
                      ? 'Visible para todos los jugadores en la tienda.'
                      : 'Oculto / Baja lógica aplicada.'}
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

            {/* Botones */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <Link
                href="/admin/games"
                className="px-5 py-2.5 bg-[#1A1C2B] hover:bg-[#25283d] text-[#94A3B8] hover:text-[#F8FAFC] rounded-xl text-xs font-semibold transition-colors"
              >
                Cancelar
              </Link>

              <button
                type="submit"
                disabled={isSaving || success}
                className="px-6 py-2.5 bg-[#783DF2] hover:bg-[#6929e4] disabled:opacity-50 text-[#F8FAFC] font-bold text-xs rounded-xl transition-all shadow-lg shadow-[#783DF2]/30 flex items-center gap-2 uppercase tracking-wider cursor-pointer"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#1FD1EB]" />
                    <span>Guardando...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Actualizar Videojuego</span>
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
