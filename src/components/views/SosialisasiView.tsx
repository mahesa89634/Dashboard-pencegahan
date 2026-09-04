import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  MapPin, 
  Calendar, 
  FileSpreadsheet, 
  UserCheck, 
  Edit, 
  Trash2, 
  Sparkles,
  BookOpenCheck,
  Building,
  School,
  LayoutGrid,
  Table as TableIcon,
  ArrowDownNarrowWide
} from 'lucide-react';
import { SocializationRecap } from '../../types';
import { formatDateDisplay, sortByDateDesc } from '../../utils/dateUtils';

interface SosialisasiViewProps {
  socializations: SocializationRecap[];
  onOpenAddModal: () => void;
  onEditSocialization: (item: SocializationRecap) => void;
  onDeleteSocialization: (id: string, name: string) => void;
  onSelectDetail: (item: SocializationRecap) => void;
  onExportExcel: () => void;
  isAdmin: boolean;
}

export default function SosialisasiView({
  socializations,
  onOpenAddModal,
  onEditSocialization,
  onDeleteSocialization,
  onSelectDetail,
  onExportExcel,
  isAdmin
}: SosialisasiViewProps) {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('cards');

  const filteredItems = socializations.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.speaker.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Automatically sort by date descending (newest to oldest)
  const sortedItems = sortByDateDesc(filteredItems);

  const totalParticipants = socializations.reduce((acc, curr) => acc + (Number(curr.participants) || 0), 0);

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* 1. TOP HIGHLIGHT STATS BANNER */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-[#1A237E] to-indigo-900 rounded-2xl p-5 text-white shadow-xs">
          <span className="text-xs font-bold text-indigo-200 uppercase tracking-wider block">Total Warga Teredukasi</span>
          <div className="flex items-center justify-between mt-2">
            <span className="text-3xl font-black font-mono text-yellow-300">{totalParticipants}</span>
            <span className="p-3 bg-white/10 rounded-xl"><Users className="w-6 h-6 text-yellow-300" /></span>
          </div>
          <p className="text-[11px] text-slate-300 mt-2">Peserta pelatihan mitigasi bahaya kebakaran</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Total Sesi Sosialisasi</span>
          <div className="flex items-center justify-between mt-2">
            <span className="text-3xl font-black font-mono text-slate-900">{socializations.length}</span>
            <span className="p-3 bg-indigo-50 text-indigo-600 rounded-xl"><BookOpenCheck className="w-6 h-6" /></span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Di sekolah, instansi, kantor & lingkungan RT/RW</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Target Pembinaan Warga</span>
          <div className="flex items-center justify-between mt-2">
            <span className="text-3xl font-black font-mono text-emerald-600">100%</span>
            <span className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><Sparkles className="w-6 h-6" /></span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Kesiapsiagaan dini kebocoran gas LPG & hidran</p>
        </div>
      </div>

      {/* 2. FILTER & ACTION TOOLBAR */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari kegiatan sosialisasi, lokasi, atau pemateri..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              id="export-social-btn"
              onClick={onExportExcel}
              className="px-3.5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl transition-all border border-slate-200 flex items-center gap-1.5 cursor-pointer"
              title="Ekspor ke format file CSV/Excel"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" /> Unduh Excel
            </button>
            <button
              id="add-social-btn"
              onClick={onOpenAddModal}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-indigo-900/10 flex items-center gap-1.5 cursor-pointer active:scale-95 whitespace-nowrap"
            >
              <Plus className="w-4 h-4" /> Buat Kegiatan Baru
            </button>
          </div>
        </div>

        {/* Sub-toolbar: Sorting Status & View Mode Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-2 text-slate-600 font-medium">
            <span className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-lg border border-indigo-200/70 font-semibold text-[11px]">
              <ArrowDownNarrowWide className="w-3.5 h-3.5" />
              <span>Urutan: Tanggal Terbaru ke Terlama (Descending)</span>
            </span>
            <span className="text-slate-400 hidden sm:inline">•</span>
            <span className="text-slate-500 hidden sm:inline">Menampilkan {sortedItems.length} dari {socializations.length} kegiatan</span>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80">
            <button
              id="social-view-table-btn"
              onClick={() => setViewMode('table')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white text-indigo-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" /> Tabel
            </button>
            <button
              id="social-view-cards-btn"
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'cards'
                  ? 'bg-white text-indigo-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" /> Kartu
            </button>
          </div>
        </div>
      </div>

      {/* 3. DATA LIST DISPLAY */}
      {sortedItems.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <Users className="w-12 h-12 text-slate-300 mx-auto" />
          <h4 className="text-base font-bold text-slate-700">Tidak ada kegiatan sosialisasi yang ditemukan</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Ubah kata kunci pencarian Anda atau tambahkan agenda kegiatan sosialisasi baru.
          </p>
        </div>
      ) : viewMode === 'table' ? (
        /* TABLE VIEW (Urut dari yang terbaru ke terlama) */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Agenda Sosialisasi</th>
                  <th className="py-3.5 px-4">Lokasi Kegiatan</th>
                  <th className="py-3.5 px-4">Tanggal Pelaksanaan</th>
                  <th className="py-3.5 px-4">Pemateri / Instruktur</th>
                  <th className="py-3.5 px-4 text-center">Peserta</th>
                  <th className="py-3.5 px-4">Ringkasan Materi</th>
                  <th className="py-3.5 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {sortedItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        {item.image ? (
                          <img 
                            src={item.image} 
                            alt={item.title} 
                            referrerPolicy="no-referrer"
                            className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0" 
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-400 shrink-0">
                            <Users className="w-5 h-5 stroke-[1.5]" />
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-slate-900 text-xs">
                            {item.title}
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono block">{item.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-600 max-w-[200px]">
                      <div className="flex items-start gap-1">
                        <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                        <span className="line-clamp-2 leading-tight">{item.location}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-800 font-mono text-[11.5px] whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2 py-1 rounded-md font-semibold">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {formatDateDisplay(item.date)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-indigo-700 font-medium whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <UserCheck className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                        <span className="truncate max-w-[140px]">{item.speaker}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <span className="inline-block px-2.5 py-1 rounded-full text-[10.5px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {item.participants} Warga
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 max-w-[240px]">
                      <p className="line-clamp-2 leading-tight text-[11px]">
                        {item.description || '-'}
                      </p>
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onSelectDetail(item)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-indigo-600 hover:text-white text-slate-700 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                        >
                          Detail
                        </button>
                        <button
                          onClick={() => onEditSocialization(item)}
                          className="p-1.5 bg-slate-50 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors cursor-pointer border border-slate-200"
                          title="Ubah Data Sosialisasi"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteSocialization(item.id, item.title)}
                          className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-bold transition-colors cursor-pointer border border-red-100"
                          title="Hapus Kegiatan"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* GRID CARDS VIEW (Urut dari yang terbaru ke terlama) */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {sortedItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col overflow-hidden group hover:border-indigo-300"
            >
              {/* Image banner */}
              <div className="h-44 w-full bg-slate-100 relative overflow-hidden">
                {item.image ? (
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-indigo-50 text-indigo-400">
                    <Users className="w-10 h-10 stroke-[1.5]" />
                    <span className="text-[10px] font-medium mt-1">Edukasi Damkarmat Kota Bima</span>
                  </div>
                )}

                {/* Participant badge */}
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-full text-[10.5px] font-black bg-indigo-600/90 backdrop-blur-md text-white border border-indigo-400 shadow-xs flex items-center gap-1">
                    <Users className="w-3 h-3" /> {item.participants} Peserta
                  </span>
                </div>

                <div className="absolute top-3 right-3">
                  <span className="px-2 py-0.5 rounded bg-slate-950/70 backdrop-blur-md text-white font-mono text-[9.5px] font-bold">
                    {item.id}
                  </span>
                </div>
              </div>

              {/* Body Content */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="font-extrabold text-base text-slate-900 tracking-tight leading-snug group-hover:text-indigo-600 transition-colors">
                    {item.title}
                  </h3>

                  <div className="space-y-1.5 text-xs text-slate-600">
                    <div className="flex items-start gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                      <span className="line-clamp-2 leading-tight">{item.location}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-slate-600 font-mono text-[11px]">
                      <Calendar className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      <span className="font-semibold">Dilaksanakan: {formatDateDisplay(item.date)}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg text-[11px] font-semibold">
                      <UserCheck className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">Pemateri: {item.speaker}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 pt-1">
                    {item.description}
                  </p>
                </div>

                {/* Footer Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onSelectDetail(item)}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer active:scale-95"
                  >
                    Lihat Rekap
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onEditSocialization(item)}
                      className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                      title="Ubah Data Sosialisasi"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteSocialization(item.id, item.title)}
                      className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                      title="Hapus Kegiatan"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}

