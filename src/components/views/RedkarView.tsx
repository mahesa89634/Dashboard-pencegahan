import React, { useState } from 'react';
import { 
  Flame, 
  Plus, 
  Search, 
  Phone, 
  MapPin, 
  FileSpreadsheet, 
  Edit, 
  Trash2, 
  UserCheck, 
  ShieldCheck, 
  MessageSquare,
  Award,
  Filter,
  ArrowDownAZ
} from 'lucide-react';
import { RedkarVolunteer } from '../../types';
import { KELURAHAN_KOTA_BIMA } from '../../data/kelurahanData';

interface RedkarViewProps {
  volunteers: RedkarVolunteer[];
  onOpenAddModal: () => void;
  onEditVolunteer: (item: RedkarVolunteer) => void;
  onDeleteVolunteer: (id: string, name: string) => void;
  onExportExcel: () => void;
  isAdmin: boolean;
}

export default function RedkarView({
  volunteers,
  onOpenAddModal,
  onEditVolunteer,
  onDeleteVolunteer,
  onExportExcel,
  isAdmin
}: RedkarViewProps) {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [subdistrictFilter, setSubdistrictFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Filter volunteers based on query, kelurahan, and status
  const filteredVolunteers = volunteers.filter(v => {
    const matchesSearch = 
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.subdistrict.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.phone.includes(searchQuery);
    
    const matchesSubdistrict = subdistrictFilter === 'all' || v.subdistrict === subdistrictFilter;
    const matchesStatus = statusFilter === 'all' || v.status === statusFilter;

    return matchesSearch && matchesSubdistrict && matchesStatus;
  });

  // Urutkan daftar kartu relawan yang tampil secara otomatis berdasarkan abjad nama Kelurahan Penugasan (Ascending A-Z)
  const sortedVolunteers = [...filteredVolunteers].sort((a, b) => {
    const kelA = (a.subdistrict || '').trim();
    const kelB = (b.subdistrict || '').trim();
    const kelCompare = kelA.localeCompare(kelB, 'id', { sensitivity: 'base' });
    if (kelCompare !== 0) return kelCompare;
    return (a.name || '').localeCompare(b.name || '', 'id', { sensitivity: 'base' });
  });

  const activeCount = volunteers.filter(v => v.status === 'Aktif').length;
  const standbyCount = volunteers.filter(v => v.status === 'Siaga').length;
  const trainingCount = volunteers.filter(v => v.status === 'Pelatihan').length;

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* 1. TOP METRICS HEADER */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Relawan REDKAR</span>
          <div className="flex items-center justify-between mt-2">
            <span className="text-2xl font-black text-slate-900 font-mono">{volunteers.length}</span>
            <span className="p-2 bg-amber-50 text-amber-600 rounded-xl"><Flame className="w-5 h-5" /></span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Status Aktif (Siap Operasi)</span>
          <div className="flex items-center justify-between mt-2">
            <span className="text-2xl font-black text-emerald-600 font-mono">{activeCount}</span>
            <span className="p-2 bg-emerald-50 text-emerald-600 rounded-xl"><ShieldCheck className="w-5 h-5" /></span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">Status Siaga (Standby)</span>
          <div className="flex items-center justify-between mt-2">
            <span className="text-2xl font-black text-sky-600 font-mono">{standbyCount}</span>
            <span className="p-2 bg-sky-50 text-sky-600 rounded-xl"><UserCheck className="w-5 h-5" /></span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Tahap Pembinaan & Pelatihan</span>
          <div className="flex items-center justify-between mt-2">
            <span className="text-2xl font-black text-amber-600 font-mono">{trainingCount}</span>
            <span className="p-2 bg-amber-50 text-amber-600 rounded-xl"><Award className="w-5 h-5" /></span>
          </div>
        </div>
      </div>

      {/* 2. FILTER & ACTIONS TOOLBAR */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama relawan, nomor HP, atau peran..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-medium"
            />
          </div>

          {/* Filter Kelurahan & Status */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Kelurahan Penugasan Filter Dropdown */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1">
              <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
              <label htmlFor="filter-kelurahan" className="text-[11px] font-bold text-slate-600 whitespace-nowrap">
                Kelurahan:
              </label>
              <select
                id="filter-kelurahan"
                value={subdistrictFilter}
                onChange={(e) => setSubdistrictFilter(e.target.value)}
                className="bg-transparent text-xs font-bold text-slate-900 outline-none cursor-pointer pr-1 py-1"
              >
                <option value="all">Semua Kelurahan ({volunteers.length})</option>
                {KELURAHAN_KOTA_BIMA.map((kel) => {
                  const count = volunteers.filter(v => v.subdistrict === kel).length;
                  return (
                    <option key={kel} value={kel}>
                      Kelurahan {kel} {count > 0 ? `(${count})` : ''}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Status Filter Dropdown */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1">
              <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <select
                id="filter-status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent text-xs font-bold text-slate-900 outline-none cursor-pointer pr-1 py-1"
              >
                <option value="all">Semua Status</option>
                <option value="Aktif">Status: Aktif</option>
                <option value="Siaga">Status: Siaga</option>
                <option value="Pelatihan">Status: Pelatihan</option>
              </select>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              id="export-redkar-btn"
              onClick={onExportExcel}
              className="px-3.5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl transition-all border border-slate-200 flex items-center gap-1.5 cursor-pointer shadow-2xs"
              title="Ekspor ke format CSV/Excel"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" /> Unduh Excel
            </button>
            <button
              id="add-redkar-btn"
              onClick={onOpenAddModal}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-amber-900/10 flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4" /> Daftar Relawan Baru
            </button>
          </div>
        </div>

        {/* Sub-toolbar: Sorting Status Indicator & Count */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2.5 border-t border-slate-100 text-xs">
          <div className="flex flex-wrap items-center gap-2 text-slate-600 font-medium">
            <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-900 px-2.5 py-1 rounded-lg border border-amber-200/80 font-bold text-[11px]">
              <ArrowDownAZ className="w-3.5 h-3.5 text-amber-700" />
              <span>Urutan: Abjad Kelurahan Penugasan (Ascending A-Z)</span>
            </span>

            {subdistrictFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 text-[11px] bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg font-semibold border border-slate-200">
                <MapPin className="w-3 h-3 text-red-500" />
                Kelurahan {subdistrictFilter}
              </span>
            )}

            <span className="text-slate-400 hidden sm:inline">•</span>
            <span className="text-slate-500 hidden sm:inline">
              Menampilkan {sortedVolunteers.length} dari {volunteers.length} relawan
            </span>
          </div>

          <div className="text-[11px] text-slate-400 font-medium">
            Mencakup 41 Kelurahan Kota Bima
          </div>
        </div>
      </div>

      {/* 3. RESPONSIVE DIRECTORY GRID */}
      {sortedVolunteers.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <Flame className="w-12 h-12 text-slate-300 mx-auto" />
          <h4 className="text-base font-bold text-slate-700">Tidak ada relawan yang sesuai</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Coba pilih kelurahan lain atau cari dengan kata kunci yang berbeda.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {sortedVolunteers.map((v) => (
            <div
              key={v.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between space-y-4 group hover:border-amber-300"
            >
              <div className="space-y-3">
                {/* Header with Avatar and ID */}
                <div className="flex items-center gap-3">
                  <div className="w-13 h-13 rounded-full overflow-hidden bg-amber-100 shrink-0 border-2 border-amber-400/50 shadow-xs">
                    {v.image ? (
                      <img 
                        src={v.image} 
                        alt={v.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-black text-amber-800 text-sm">
                        {v.name.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <span className="text-[9.5px] font-mono font-bold text-slate-400 block">{v.id}</span>
                    <h4 className="font-extrabold text-sm text-slate-900 truncate leading-tight group-hover:text-amber-600 transition-colors">
                      {v.name}
                    </h4>
                    <span className="text-[11px] text-slate-500 font-medium block truncate mt-0.5">
                      {v.role}
                    </span>
                  </div>
                </div>

                {/* Tags & Meta - Without "Bergabung" Row */}
                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1 text-slate-700 bg-amber-50/80 border border-amber-200/80 px-2.5 py-0.5 rounded-lg text-[10.5px] font-bold truncate">
                      <MapPin className="w-3 h-3 text-red-500 shrink-0" />
                      Kel. {v.subdistrict}
                    </span>

                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${
                      v.status === 'Aktif'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : v.status === 'Siaga'
                          ? 'bg-sky-50 text-sky-700 border-sky-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {v.status}
                    </span>
                  </div>

                  {/* Direct Contact Button */}
                  <a
                    href={`https://wa.me/${v.phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border border-emerald-200 shadow-2xs"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Hubungi: {v.phone}</span>
                  </a>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-1.5">
                <button
                  onClick={() => onEditVolunteer(v)}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                  title="Ubah Data Relawan"
                >
                  <Edit className="w-3 h-3" /> Ubah
                </button>
                <button
                  onClick={() => onDeleteVolunteer(v.id, v.name)}
                  className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                  title="Hapus Relawan"
                >
                  <Trash2 className="w-3 h-3" /> Hapus
                </button>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
