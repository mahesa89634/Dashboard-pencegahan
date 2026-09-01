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
  Filter
} from 'lucide-react';
import { InspeksiItem } from '../../types';

interface InspeksiViewProps {
  inspeksiList: InspeksiItem[];
  onOpenAddModal: () => void;
  onEditInspeksi: (item: InspeksiItem) => void;
  onDeleteInspeksi: (id: string, name: string) => void;
  onSelectDetail: (item: InspeksiItem) => void;
  onExportExcel: () => void;
  isAdmin: boolean;
}

export default function InspeksiView({
  inspeksiList,
  onOpenAddModal,
  onEditInspeksi,
  onDeleteInspeksi,
  onSelectDetail,
  onExportExcel,
  isAdmin
}: InspeksiViewProps) {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredItems = inspeksiList.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.notes && item.notes.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
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

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
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
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-red-900/10 flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4" /> Tambah Laporan
          </button>
        </div>
      </div>

      {/* 3. RESPONSIVE GRID CARDS */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <ShieldAlert className="w-12 h-12 text-slate-300 mx-auto" />
          <h4 className="text-base font-bold text-slate-700">Tidak ada data inspeksi yang sesuai</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Coba ubah kata kunci pencarian atau ganti filter status di atas.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map((item) => {
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
                      <div className="flex items-center gap-1.5 text-slate-500 font-mono text-[11px]">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>Diperiksa: {item.date}</span>
                      </div>
                    </div>

                    {/* Notes excerpt */}
                    {item.notes && (
                      <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-[11.5px] text-slate-600 leading-relaxed line-clamp-3">
                        <span className="font-bold text-slate-700 block mb-0.5">Temuan / Catatan:</span>
                        {item.notes}
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
