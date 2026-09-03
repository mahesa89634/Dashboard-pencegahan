import React, { useState } from 'react';
import { 
  GraduationCap, 
  Plus, 
  Search, 
  Calendar, 
  FileSpreadsheet, 
  Edit, 
  Trash2, 
  Flame, 
  LifeBuoy, 
  ShieldCheck, 
  ArrowDownAZ, 
  Eye, 
  Tag, 
  Sparkles,
  Layers,
  Image as ImageIcon
} from 'lucide-react';
import { PembinaanActivity, PembinaanCategory } from '../../types';
import { formatDateDisplay, sortByDateDesc } from '../../utils/dateUtils';

interface PembinaanViewProps {
  materials: PembinaanActivity[];
  onOpenAddModal: () => void;
  onEditMaterial: (item: PembinaanActivity) => void;
  onDeleteMaterial: (id: string, name: string) => void;
  onSelectMaterial?: (item: PembinaanActivity) => void;
  onExportExcel: () => void;
  isAdmin: boolean;
}

export const PEMBINAAN_CATEGORIES: PembinaanCategory[] = [
  'Pembinaan Aparatur Kebakaran',
  'Pembinaan Aparatur Pencarian dan Pertolongan',
  'Pembinaan Redkar'
];

export default function PembinaanView({
  materials,
  onOpenAddModal,
  onEditMaterial,
  onDeleteMaterial,
  onSelectMaterial,
  onExportExcel,
  isAdmin
}: PembinaanViewProps) {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Filter based on search query & category
  const filteredActivities = materials.filter((item) => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.date && item.date.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Otomatis urutkan seluruh laporan dari tanggal kegiatan terbaru ke terlama
  const sortedActivities = sortByDateDesc(filteredActivities);

  // Helper category badges & styling
  const getCategoryTheme = (category: string) => {
    switch (category) {
      case 'Pembinaan Aparatur Kebakaran':
        return {
          badge: 'bg-amber-50 text-amber-900 border-amber-200',
          icon: Flame,
          iconColor: 'text-amber-600',
          gradient: 'from-amber-600 to-red-600',
          dot: 'bg-amber-500'
        };
      case 'Pembinaan Aparatur Pencarian dan Pertolongan':
        return {
          badge: 'bg-blue-50 text-blue-900 border-blue-200',
          icon: LifeBuoy,
          iconColor: 'text-blue-600',
          gradient: 'from-blue-600 to-sky-600',
          dot: 'bg-blue-500'
        };
      case 'Pembinaan Redkar':
        return {
          badge: 'bg-emerald-50 text-emerald-900 border-emerald-200',
          icon: ShieldCheck,
          iconColor: 'text-emerald-600',
          gradient: 'from-emerald-600 to-teal-600',
          dot: 'bg-emerald-500'
        };
      default:
        return {
          badge: 'bg-slate-100 text-slate-800 border-slate-200',
          icon: Tag,
          iconColor: 'text-slate-600',
          gradient: 'from-slate-700 to-slate-900',
          dot: 'bg-slate-500'
        };
    }
  };

  // Counts per category
  const kebakaranCount = materials.filter(m => m.category === 'Pembinaan Aparatur Kebakaran').length;
  const sarCount = materials.filter(m => m.category === 'Pembinaan Aparatur Pencarian dan Pertolongan').length;
  const redkarCount = materials.filter(m => m.category === 'Pembinaan Redkar').length;

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* 1. STATS / SUMMARY OVERVIEW CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Kegiatan */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-xs">
            <GraduationCap className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Total Kegiatan</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-slate-900 font-mono">{materials.length}</span>
              <span className="text-xs text-slate-500 font-medium">Laporan Terarsip</span>
            </div>
          </div>
        </div>

        {/* Aparatur Kebakaran */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center shrink-0">
            <Flame className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Aparatur Kebakaran</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-amber-700 font-mono">{kebakaranCount}</span>
              <span className="text-xs text-slate-500 font-medium">Kegiatan Taktis</span>
            </div>
          </div>
        </div>

        {/* Pencarian & Pertolongan */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center shrink-0">
            <LifeBuoy className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Pencarian & SAR</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-blue-700 font-mono">{sarCount}</span>
              <span className="text-xs text-slate-500 font-medium">Vertical & Water</span>
            </div>
          </div>
        </div>

        {/* Pembinaan Redkar */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Pembinaan REDKAR</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-emerald-700 font-mono">{redkarCount}</span>
              <span className="text-xs text-slate-500 font-medium">Bina Relawan</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. FILTER TABS & SEARCH TOOLBAR */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari judul kegiatan, deskripsi, atau tanggal..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              id="export-pembinaan-btn"
              onClick={onExportExcel}
              className="px-3.5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl transition-all border border-slate-200 flex items-center gap-1.5 cursor-pointer shadow-2xs"
              title="Ekspor ke format Excel / CSV"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" /> Unduh Excel
            </button>
            <button
              id="add-pembinaan-btn"
              onClick={onOpenAddModal}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-emerald-900/10 flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4" /> Tambah Laporan Pembinaan
            </button>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-500 flex items-center gap-1 mr-1">
            <Layers className="w-3.5 h-3.5 text-slate-400" /> Kategori:
          </span>

          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-[#0F172A] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Semua Kegiatan ({materials.length})
          </button>

          <button
            onClick={() => setSelectedCategory('Pembinaan Aparatur Kebakaran')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedCategory === 'Pembinaan Aparatur Kebakaran'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200/80'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Aparatur Kebakaran ({kebakaranCount})</span>
          </button>

          <button
            onClick={() => setSelectedCategory('Pembinaan Aparatur Pencarian dan Pertolongan')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedCategory === 'Pembinaan Aparatur Pencarian dan Pertolongan'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200/80'
            }`}
          >
            <LifeBuoy className="w-3.5 h-3.5" />
            <span>Pencarian & Pertolongan ({sarCount})</span>
          </button>

          <button
            onClick={() => setSelectedCategory('Pembinaan Redkar')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedCategory === 'Pembinaan Redkar'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200/80'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Pembinaan REDKAR ({redkarCount})</span>
          </button>
        </div>

        {/* Sub-toolbar: Sorting Status Indicator */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-900 px-2.5 py-1 rounded-lg border border-emerald-200/80 font-bold text-[11px]">
              <ArrowDownAZ className="w-3.5 h-3.5 text-emerald-700" />
              <span>Urutan: Tanggal Kegiatan Terbaru ke Terlama</span>
            </span>
            <span className="text-slate-400 hidden sm:inline">•</span>
            <span className="text-slate-500 hidden sm:inline">
              Menampilkan {sortedActivities.length} dari {materials.length} kegiatan
            </span>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">
            Damkarmat Kota Bima
          </span>
        </div>
      </div>

      {/* 3. ACTIVITIES CARD GRID */}
      {sortedActivities.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <GraduationCap className="w-12 h-12 text-slate-300 mx-auto" />
          <h4 className="text-base font-bold text-slate-700">Tidak ada laporan kegiatan yang sesuai</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Coba pilih kategori lain atau ubah kata kunci pencarian Anda.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedActivities.map((act) => {
            const theme = getCategoryTheme(act.category);
            const CategoryIcon = theme.icon;

            return (
              <div
                key={act.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group hover:border-slate-300"
              >
                {/* Image Section */}
                <div className="relative h-48 bg-slate-900 overflow-hidden">
                  {act.image ? (
                    <img
                      src={act.image}
                      alt={act.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${theme.gradient} flex flex-col items-center justify-center text-white p-4 text-center`}>
                      <CategoryIcon className="w-12 h-12 opacity-80 mb-2" />
                      <span className="text-xs font-bold tracking-wider uppercase opacity-90">Dokumentasi Lapangan</span>
                    </div>
                  )}

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30 pointer-events-none" />

                  {/* Top Badges over image */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-white/95 text-slate-900 backdrop-blur-md shadow-xs flex items-center gap-1.5 border border-white/40">
                      <span className={`w-2 h-2 rounded-full ${theme.dot}`} />
                      <span className="truncate max-w-[170px]">{act.category}</span>
                    </span>

                    <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-white font-mono text-[10px] font-bold">
                      {act.id}
                    </span>
                  </div>

                  {/* Bottom date badge over image */}
                  <div className="absolute bottom-3 left-3 pointer-events-none">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-950/80 text-white backdrop-blur-md border border-white/10 shadow-xs">
                      <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                      {formatDateDisplay(act.date)}
                    </span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <h3 className="font-extrabold text-base text-slate-900 leading-snug group-hover:text-emerald-700 transition-colors">
                      {act.title}
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed font-normal line-clamp-3">
                      {act.description}
                    </p>
                  </div>

                  {/* Category Pill Footer */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className={`px-2.5 py-1 rounded-lg text-[10.5px] font-bold border flex items-center gap-1.5 ${theme.badge}`}>
                      <CategoryIcon className={`w-3.5 h-3.5 ${theme.iconColor}`} />
                      <span className="truncate">{act.category}</span>
                    </span>

                    {act.image && (
                      <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
                        <ImageIcon className="w-3 h-3 text-slate-400" /> Foto Terlampir
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="px-5 py-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onSelectMaterial?.(act)}
                    className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition-all border border-slate-200 flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-500" /> Lihat Detail
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onEditMaterial(act)}
                      className="px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition-all border border-slate-200 flex items-center gap-1 cursor-pointer shadow-2xs"
                      title="Ubah Laporan"
                    >
                      <Edit className="w-3.5 h-3.5 text-slate-600" /> Ubah
                    </button>
                    <button
                      onClick={() => onDeleteMaterial(act.id, act.title)}
                      className="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-bold transition-all border border-red-200 flex items-center gap-1 cursor-pointer"
                      title="Hapus Laporan"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Hapus
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
