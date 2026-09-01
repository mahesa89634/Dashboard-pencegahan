import React, { useState, useRef } from 'react';
import { 
  Camera, 
  UploadCloud, 
  Trash2, 
  ShieldCheck, 
  Zap, 
  RefreshCw, 
  Sparkles, 
  Maximize2,
  CheckCircle2,
  FileImage
} from 'lucide-react';
import { compressImageFile, formatBytes, CompressionResult } from '../utils/imageCompressor';

interface ImageUploaderProps {
  label: string;
  subLabel?: string;
  value: string;
  onChange: (dataUrl: string) => void;
  onToast: (msg: string) => void;
  accentColor?: 'red' | 'indigo' | 'amber' | 'emerald';
  idPrefix?: string;
}

export default function ImageUploader({
  label,
  subLabel = 'Otomatis di-resize maks lebar 800px & dikompres JPEG untuk Firestore',
  value,
  onChange,
  onToast,
  accentColor = 'red',
  idPrefix = 'img-uploader'
}: ImageUploaderProps) {
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionStats, setCompressionStats] = useState<CompressionResult | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const colorStyles = {
    red: {
      btn: 'bg-red-600 hover:bg-red-700 text-white',
      borderActive: 'border-red-500 bg-red-50/50',
      badge: 'bg-red-50 text-red-700 border-red-200',
      icon: 'text-red-600',
      focusRing: 'focus:ring-red-500/20'
    },
    indigo: {
      btn: 'bg-indigo-600 hover:bg-indigo-700 text-white',
      borderActive: 'border-indigo-500 bg-indigo-50/50',
      badge: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      icon: 'text-indigo-600',
      focusRing: 'focus:ring-indigo-500/20'
    },
    amber: {
      btn: 'bg-amber-600 hover:bg-amber-700 text-white',
      borderActive: 'border-amber-500 bg-amber-50/50',
      badge: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: 'text-amber-600',
      focusRing: 'focus:ring-amber-500/20'
    },
    emerald: {
      btn: 'bg-emerald-600 hover:bg-emerald-700 text-white',
      borderActive: 'border-emerald-500 bg-emerald-50/50',
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: 'text-emerald-600',
      focusRing: 'focus:ring-emerald-500/20'
    }
  }[accentColor];

  const processFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      onToast('⚠️ Format file tidak didukung! Mohon pilih gambar (JPG, PNG, WebP).');
      return;
    }

    try {
      setIsCompressing(true);
      const result = await compressImageFile(file, 800, 0.75);
      setCompressionStats(result);
      onChange(result.dataUrl);
      setIsCompressing(false);
      onToast(
        `⚡ Foto dikompres: ${formatBytes(result.originalSize)} ➔ ${formatBytes(result.compressedSize)} (-${result.savedPercent}%). Aman untuk Firestore!`
      );
    } catch (err: any) {
      setIsCompressing(false);
      console.error('Error compressing image:', err);
      onToast(`⚠️ Gagal memproses gambar: ${err.message || 'Error tidak dikenal'}`);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
    // Reset file input value so selecting the same file triggers change
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleRemoveImage = () => {
    onChange('');
    setCompressionStats(null);
    onToast('🗑️ Foto telah dihapus.');
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
          <Camera className={`w-3.5 h-3.5 ${colorStyles.icon}`} />
          {label}
        </label>
        <span className="text-[10px] text-slate-400 font-medium hidden sm:inline">
          Otomatis &le; 800px JPEG
        </span>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        id={`${idPrefix}-file-input`}
        onChange={handleFileChange}
        className="hidden"
      />

      {isCompressing ? (
        <div className="p-6 border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50 flex flex-col items-center justify-center space-y-2 text-center animate-pulse">
          <div className="p-3 bg-white rounded-full shadow-xs">
            <RefreshCw className={`w-6 h-6 animate-spin ${colorStyles.icon}`} />
          </div>
          <p className="text-xs font-bold text-slate-700">Sedang Mengompresi Foto...</p>
          <p className="text-[11px] text-slate-500">
            Mengubah resolusi maks 800px & optimasi JPEG agar &lt; 100 KB
          </p>
        </div>
      ) : value ? (
        <div className="space-y-2">
          {/* Image Preview Container */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 group shadow-xs">
            <img
              src={value}
              alt="Dokumentasi"
              referrerPolicy="no-referrer"
              className="w-full h-44 sm:h-52 object-cover transition-transform duration-300 group-hover:scale-102"
            />

            {/* Gradient Overlay with Badges */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30 pointer-events-none" />

            {/* Top Badges */}
            <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-600/90 text-white backdrop-blur-md border border-emerald-400/30 flex items-center gap-1 shadow-xs">
                <CheckCircle2 className="w-3 h-3" /> Siap Disimpan ke Cloud
              </span>
              <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-white font-mono text-[9px] font-bold">
                JPEG 800px
              </span>
            </div>

            {/* Bottom Actions Overlay */}
            <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5">
              <button
                type="button"
                id={`${idPrefix}-change-btn`}
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 bg-white/90 hover:bg-white text-slate-800 text-[11px] font-bold rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Ganti Foto
              </button>
              <button
                type="button"
                id={`${idPrefix}-remove-btn`}
                onClick={handleRemoveImage}
                className="p-1.5 bg-red-600/90 hover:bg-red-600 text-white rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
                title="Hapus Foto"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Compression breakdown stats banner if just compressed */}
          {compressionStats && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex flex-wrap items-center justify-between gap-2 text-xs text-emerald-900 animate-fadeIn">
              <div className="flex items-center gap-2">
                <span className="p-1 bg-emerald-100 rounded-lg text-emerald-700">
                  <Zap className="w-3.5 h-3.5" />
                </span>
                <div>
                  <span className="font-bold">Kompresi Berhasil: </span>
                  <span className="text-slate-500 line-through mr-1">
                    {formatBytes(compressionStats.originalSize)}
                  </span>
                  <span className="font-mono font-bold text-emerald-700">
                    ➔ {formatBytes(compressionStats.compressedSize)}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="px-2 py-0.5 bg-emerald-200/80 text-emerald-800 rounded-md font-bold text-[10.5px]">
                  Hemat {compressionStats.savedPercent}%
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  ({compressionStats.width}×{compressionStats.height}px)
                </span>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Upload Drag and Drop Zone */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-5 sm:p-6 text-center cursor-pointer transition-all ${
            isDragging
              ? colorStyles.borderActive
              : 'border-slate-300 hover:border-slate-400 bg-slate-50/70 hover:bg-slate-100/70'
          }`}
        >
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="p-3 bg-white rounded-2xl shadow-xs border border-slate-200/80 text-slate-600 group-hover:scale-110 transition-transform">
              <UploadCloud className={`w-6 h-6 ${colorStyles.icon}`} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">
                Pilih atau Tarik File Foto ke Sini
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">{subLabel}</p>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <span className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600 shadow-2xs">
                📸 Kamera / Galeri
              </span>
              <span className="px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-[10px] font-bold shadow-2xs flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Auto Kompres &lt; 100KB
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
