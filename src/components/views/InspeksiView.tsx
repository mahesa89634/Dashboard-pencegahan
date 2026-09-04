import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Plus, 
  Search, 
  MapPin, 
  Calendar, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Edit, 
  Trash2, 
  FileSpreadsheet, 
  Building, 
  Camera, 
  Info,
  Filter,
  LayoutGrid,
  Table as TableIcon,
  ArrowDownNarrowWide,
  Lock,
  Unlock,
  KeyRound,
  ShieldCheck
} from 'lucide-react';
import { InspeksiItem } from '../../types';
import { formatDateDisplay, sortByDateDesc } from '../../utils/dateUtils';

interface InspeksiViewProps {
  inspeksiList: InspeksiItem[];
  onOpenAddModal: () => void;
  onEditInspeksi: (item: InspeksiItem) => void;
  onDeleteInspeksi: (id: string, name: string) => void;
  onSelectDetail: (item: InspeksiItem) => void;
  onExportExcel: () => void;
  isAdmin: boolean;
  isLeadershipUnlocked: boolean;
  onOpenPinModal: () => void;
  onLockLeadership: () => void;
}

export default function InspeksiView({
  inspeksiList,
  onOpenAddModal,
  onEditInspeksi,
  onDeleteInspeksi,
  onSelectDetail,
  onExportExcel,
  isAdmin,
  isLeadershipUnlocked,
  onOpenPinModal,
  onLockLeadership
}: InspeksiViewProps) {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('cards');

  const canViewNotes = isAdmin || isLeadershipUnlocked;

  const filteredItems = inspeksiList.filter(item => {
    const matchesNameOrAddress = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.address.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesNotes = canViewNotes && item.notes && item.notes.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSearch = matchesNameOrAddress || matchesNotes;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Automatically sort by date descending (newest to oldest)
  const sortedItems = sortByDateDesc(filteredItems);

  const criticalCount = inspeksiList.filter(i => i.status === 'Kritis').length;
  const needFixCount = inspeksiList.filter(i => i.status === 'Perlu Perbaikan').length;
  const safeCount = inspeksiList.filter(i => i.status === 'Aman').length;

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* 1. TOP STATS HEADER */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Bangunan / Objek</span>
          <div className="flex items-center justify-between mt-2">
            <span className="text-2xl font-black text-slate-900 font-mono">{inspeksiList.length}</span>
            <span className="p-2 bg-slate-100 text-slate-700 rounded-xl"><Building className="w-5 h-5" /></span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-bold text-red-600 uppercase tracking-wider">Status Kritis (Bahaya)</span>
          <div className="flex items-center justify-between mt-2">
            <span className="text-2xl font-black text-red-600 font-mono">{criticalCount}</span>
            <span className="p-2 bg-red-50 text-red-600 rounded-xl"><AlertTriangle className="w-5 h-5" /></span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Perlu Perbaikan</span>
          <div className="flex items-center justify-between mt-2">
            <span className="text-2xl font-black text-amber-600 font-mono">{needFixCount}</span>
            <span className="p-2 bg-amber-50 text-amber-600 rounded-xl"><Clock className="w-5 h-5" /></span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Kondisi Aman / Layak</span>
          <div className="flex items-center justify-between mt-2">
            <span className="text-2xl font-black text-emerald-600 font-mono">{safeCount}</span>
            <span className="p-2 bg-emerald-50 text-emerald-600 rounded-xl"><CheckCircle2 className="w-5 h-5" /></span>
          </div>
        </div>
      </div>

      {/* 2. FILTER & CONTROLS TOOLBAR */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari gedung, alamat, atau temuan proteksi..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all font-medium"
            />
          </div>

          {/* Status Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                statusFilter === 'all' 
                  ? 'bg-[#1A237E] text-white shadow-xs' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Semua ({inspeksiList.length})
            </button>
            <button
              onClick={() => setStatusFilter('Kritis')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                statusFilter === 'Kritis' 
                  ? 'bg-red-600 text-white shadow-xs' 
                  : 'bg-red-50 text-red-700 hover:bg-red-100'
              }`}
            >
              Kritis ({criticalCount})
            </button>
            <button
              onClick={() => setStatusFilter('Perlu Perbaikan')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                statusFilter === 'Perlu Perbaikan' 
                  ? 'bg-amber-600 text-white shadow-xs' 
                  : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
              }`}
            >
              Perbaikan ({needFixCount})
            </button>
            <button
              onClick={() => setStatusFilter('Aman')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                statusFilter === 'Aman' 
                  ? 'bg-emerald-600 text-white shadow-xs' 
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
              }`}
            >
              Aman ({safeCount})
            </button>
          </div>

          {/* Action Buttons & Leadership PIN */}
          <div className="flex flex-wrap items-center gap-2">
            {!isAdmin ? (
              !isLeadershipUnlocked ? (
                <button
                  id="open-leadership-pin-btn"
                  type="button"
                  onClick={onOpenPinModal}
                  className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95 whitespace-nowrap border border-amber-400/60"
                  title="Buka sensor temuan khusus pimpinan dengan PIN"
                >
                  <KeyRound className="w-3.5 h-3.5 text-slate-950" />
                  <span>Akses Pimpinan</span>
                </button>
              ) : (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold shadow-2xs">
                  <Unlock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Akses Pimpinan Aktif</span>
                  <button
                    type="button"
                    onClick={onLockLeadership}
                    className="ml-1 px-1.5 py-0.5 rounded bg-emerald-200/70 hover:bg-emerald-200 text-emerald-900 text-[10.5px] font-extrabold cursor-pointer transition-colors"
                    title="Kunci kembali sensor temuan"
                  >
                    Kunci
                  </button>
                </div>
              )
            ) : (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-bold shadow-2xs">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span>Mode Admin (Sensor Nonaktif)</span>
              </div>
            )}

            <button
              id="export-inspeksi-btn"
              onClick={onExportExcel}
              className="px-3.5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl transition-all border border-slate-200 flex items-center gap-1.5 cursor-pointer"
              title="Ekspor ke format file CSV/Excel"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" /> Unduh Excel
            </button>
            <button
              id="add-inspeksi-btn"
              onClick={onOpenAddModal}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-red-900/10 flex items-center gap-1.5 cursor-pointer active:scale-95 whitespace-nowrap"
            >
              <Plus className="w-4 h-4" /> Tambah Laporan
            </button>
          </div>
        </div>

        {/* Sub-toolbar: Sorting Status & View Mode Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
          <div className="flex flex-wrap items-center gap-2 text-slate-600 font-medium">
            <span className="inline-flex items-center gap-1.5 bg-red-50 text-red-700 px-2.5 py-1 rounded-lg border border-red-200/70 font-semibold text-[11px]">
              <ArrowDownNarrowWide className="w-3.5 h-3.5" />
              <span>Urutan: Tanggal Terbaru ke Terlama (Descending)</span>
            </span>

            {!canViewNotes ? (
              <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-800 px-2.5 py-1 rounded-lg border border-amber-200 font-semibold text-[11px]">
                <Lock className="w-3 h-3 text-amber-600" />
                <span>Sensor Temuan: Aktif (Mode Tamu)</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-lg border border-emerald-200 font-semibold text-[11px]">
                <Unlock className="w-3 h-3 text-emerald-600" />
                <span>Sensor Temuan: Terbuka ({isAdmin ? 'Otoritas Admin' : 'PIN Terverifikasi'})</span>
              </span>
            )}

            <span className="text-slate-400 hidden lg:inline">•</span>
            <span className="text-slate-500 hidden lg:inline">Menampilkan {sortedItems.length} dari {inspeksiList.length} laporan</span>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80">
            <button
              id="inspeksi-view-table-btn"
              onClick={() => setViewMode('table')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white text-[#1A237E] shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" /> Tabel
            </button>
            <button
              id="inspeksi-view-cards-btn"
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'cards'
                  ? 'bg-white text-[#1A237E] shadow-2xs'
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
          <ShieldAlert className="w-12 h-12 text-slate-300 mx-auto" />
          <h4 className="text-base font-bold text-slate-700">Tidak ada data inspeksi yang sesuai</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Coba ubah kata kunci pencarian atau ganti filter status di atas.
          </p>
        </div>
      ) : viewMode === 'table' ? (
        /* TABLE VIEW (Urut dari yang terbaru ke terlama) */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Gedung / Sarana</th>
                  <th className="py-3.5 px-4">Alamat & Lokasi</th>
                  <th className="py-3.5 px-4">Tanggal Pemeriksaan</th>
                  <th className="py-3.5 px-4 text-center">Status Kelayakan</th>
                  <th className="py-3.5 px-4">Temuan / Catatan</th>
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
                            alt={item.name} 
                            referrerPolicy="no-referrer"
                            className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0" 
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 shrink-0">
                            <Building className="w-5 h-5 stroke-[1.5]" />
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-slate-900 text-xs">
                            {item.name}
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono block">{item.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-600 max-w-[220px]">
                      <div className="flex items-start gap-1">
                        <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                        <span className="line-clamp-2 leading-tight">{item.address}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-800 font-mono text-[11.5px] whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2 py-1 rounded-md font-semibold">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {formatDateDisplay(item.date)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[10.5px] font-bold border ${
                        item.status === 'Kritis'
                          ? 'bg-red-50 border-red-200 text-red-700'
                          : item.status === 'Perlu Perbaikan'
                            ? 'bg-amber-50 border-amber-200 text-amber-800'
                            : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 max-w-[260px]">
                      {canViewNotes ? (
                        <p className="line-clamp-2 leading-tight text-[11px]">
                          {item.notes || '-'}
                        </p>
                      ) : (
                        <button
                          type="button"
                          onClick={onOpenPinModal}
                          className="w-full text-left p-1.5 rounded-lg bg-red-50/80 hover:bg-red-100 border border-red-200/80 transition-colors cursor-pointer group"
                          title="Klik untuk memasukkan PIN Pimpinan"
                        >
                          <div className="flex items-start gap-1.5">
                            <Lock className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                            <span className="text-[10.5px] font-bold text-red-700 leading-tight block">
                              🔒 Dokumen Terkunci
                            </span>
                          </div>
                        </button>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onSelectDetail(item)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-[#1A237E] hover:text-white text-slate-700 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                        >
                          Detail
                        </button>
                        <button
                          onClick={() => onEditInspeksi(item)}
                          className="p-1.5 bg-slate-50 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors cursor-pointer border border-slate-200"
                          title="Ubah Data Laporan"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteInspeksi(item.id, item.name)}
                          className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-bold transition-colors cursor-pointer border border-red-100"
                          title="Hapus Laporan"
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
          {sortedItems.map((item) => {
            const isCritical = item.status === 'Kritis';
            const isNeedFix = item.status === 'Perlu Perbaikan';
            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col overflow-hidden group hover:border-slate-300"
              >
                {/* Card Image / Header Photo */}
                <div className="h-44 w-full bg-slate-100 relative overflow-hidden">
                  {item.image ? (
                    <img 
                      src={item.image} 
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400">
                      <Building className="w-10 h-10 stroke-[1.5]" />
                      <span className="text-[10px] font-medium mt-1">Dokumentasi Lapangan Damkar</span>
                    </div>
                  )}

                  {/* Status Badge Tag */}
                  <div className="absolute top-3 left-3">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black tracking-wide uppercase border backdrop-blur-md shadow-xs ${
                      isCritical
                        ? 'bg-red-600/90 text-white border-red-500 animate-pulse'
                        : isNeedFix
                          ? 'bg-amber-500/90 text-white border-amber-400'
                          : 'bg-emerald-600/90 text-white border-emerald-400'
                    }`}>
                      {item.status}
                    </span>
                  </div>

                  {/* ID Tag */}
                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-0.5 rounded bg-slate-950/70 backdrop-blur-md text-white font-mono text-[9.5px] font-bold">
                      {item.id}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-extrabold text-base text-slate-900 tracking-tight leading-snug group-hover:text-[#1A237E] transition-colors">
                      {item.name}
                    </h3>

                    <div className="space-y-1 text-xs text-slate-600">
                      <div className="flex items-start gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                        <span className="line-clamp-2 leading-tight">{item.address}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-600 font-mono text-[11px]">
                        <Calendar className="w-3.5 h-3.5 text-red-600 shrink-0" />
                        <span className="font-semibold">Diperiksa: {formatDateDisplay(item.date)}</span>
                      </div>
                    </div>

                    {/* Notes excerpt */}
                    {item.notes && (
                      <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-[11.5px] relative overflow-hidden">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-slate-700 block">Temuan / Catatan:</span>
                          {!canViewNotes && (
                            <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-100 px-1.5 py-0.5 rounded flex items-center gap-1">
                              <Lock className="w-2.5 h-2.5" /> Disensor
                            </span>
                          )}
                        </div>

                        {canViewNotes ? (
                          <p className="text-slate-600 leading-relaxed line-clamp-3">
                            {item.notes}
                          </p>
                        ) : (
                          <div 
                            onClick={onOpenPinModal} 
                            className="cursor-pointer group relative"
                            title="Klik untuk memasukkan PIN Pimpinan"
                          >
                            <p className="text-slate-400 select-none filter blur-[3.5px] leading-relaxed line-clamp-2">
                              {item.notes}
                            </p>
                            <div className="mt-1.5 flex items-start gap-1.5 text-red-700 font-bold text-[10.5px] bg-red-50 group-hover:bg-red-100 border border-red-200 p-2 rounded-lg transition-colors">
                              <Lock className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                              <span className="leading-tight">
                                🔒 Dokumen Terkunci
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons Footer */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => onSelectDetail(item)}
                      className="px-3 py-1.5 bg-[#1A237E] hover:bg-[#283593] text-white rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer active:scale-95"
                    >
                      Lihat Detail
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onEditInspeksi(item)}
                        className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                        title="Ubah Data Laporan"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteInspeksi(item.id, item.name)}
                        className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                        title="Hapus Laporan"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
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

