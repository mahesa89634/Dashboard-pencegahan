import React from 'react';
import { 
  ShieldAlert, 
  Flame, 
  Users, 
  BookOpen, 
  GraduationCap, 
  PlusCircle, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  ArrowRight, 
  Download, 
  FileSpreadsheet, 
  ShieldCheck, 
  Activity, 
  PhoneCall,
  ChevronRight,
  Sparkles,
  Building2,
  Calendar
} from 'lucide-react';
import { InspeksiItem, SocializationRecap, RedkarVolunteer, AparaturMaterial, NspmDocument } from '../../types';
import { formatDateDisplay } from '../../utils/dateUtils';

interface DashboardHomeProps {
  inspeksiList: InspeksiItem[];
  socializations: SocializationRecap[];
  volunteers: RedkarVolunteer[];
  pembinaanMaterials: AparaturMaterial[];
  nspmDocs: NspmDocument[];
  onNavigate: (view: string) => void;
  onOpenInspeksiModal: () => void;
  onOpenRedkarModal: () => void;
  onOpenSocializationModal: () => void;
  onSelectInspeksi: (item: InspeksiItem) => void;
  onSelectSocialization: (item: SocializationRecap) => void;
  onExportInspeksi: () => void;
  onExportSocialization: () => void;
  onExportRedkar: () => void;
  isAdmin: boolean;
}

export default function DashboardHome({
  inspeksiList,
  socializations,
  volunteers,
  pembinaanMaterials,
  nspmDocs,
  onNavigate,
  onOpenInspeksiModal,
  onOpenRedkarModal,
  onOpenSocializationModal,
  onSelectInspeksi,
  onSelectSocialization,
  onExportInspeksi,
  onExportSocialization,
  onExportRedkar,
  isAdmin
}: DashboardHomeProps) {
  // Calculated stats
  const criticalCount = inspeksiList.filter(i => i.status === 'Kritis').length;
  const needFixCount = inspeksiList.filter(i => i.status === 'Perlu Perbaikan').length;
  const safeCount = inspeksiList.filter(i => i.status === 'Aman').length;
  const totalParticipants = socializations.reduce((acc, curr) => acc + (Number(curr.participants) || 0), 0);
  const activeVolunteers = volunteers.filter(v => v.status === 'Aktif').length;

  // Kelurahan distribution count
  const kelurahanMap = new Map<string, number>();
  volunteers.forEach(v => {
    const kel = v.subdistrict || 'Lainnya';
    kelurahanMap.set(kel, (kelurahanMap.get(kel) || 0) + 1);
  });
  const kelurahanCounts = Array.from(kelurahanMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'id'));

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* 1. TOP HERO EMERGENCY & COMMAND BANNER */}
      <div className="bg-gradient-to-r from-[#1A237E] via-[#283593] to-[#D32F2F] rounded-2xl p-5 md:p-7 text-white shadow-lg relative overflow-hidden">
        {/* Background Grid Accent */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/15 backdrop-blur-sm rounded-full text-xs font-bold text-yellow-300 border border-white/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sistem Manajemen Proteksi Kebakaran Terpadu Kota Bima</span>
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight leading-tight">
              Selamat Datang di Command Center Damkarmat
            </h1>
            <p className="text-xs sm:text-sm text-slate-100 leading-relaxed font-medium">
              Aplikasi berbasis komputasi cloud untuk memonitor audit kelayakan proteksi gedung, pergerakan relawan REDKAR, mitigasi kebakaran warga, dan kepatuhan standar NSPM di 5 kecamatan Kota Bima.
            </p>
          </div>

          {/* Emergency Quick Action Call Box */}
          <div className="w-full lg:w-auto shrink-0 bg-slate-950/40 backdrop-blur-md p-4 rounded-xl border border-white/15 flex flex-col sm:flex-row lg:flex-col gap-3 justify-between items-center text-center">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500 animate-ping"></span>
              <span className="text-xs font-bold uppercase tracking-wider text-red-200">Unit Reaksi Cepat</span>
            </div>
            <div className="text-left sm:text-center lg:text-center">
              <span className="text-[10px] text-slate-300 block">Hotline Darurat Kota Bima</span>
              <span className="text-sm sm:text-base font-black text-white font-mono tracking-wider">085135767642 / (0374) 6644372</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full">
              <a
                href="tel:085135767642"
                className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-500 text-white font-black text-xs rounded-lg transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <PhoneCall className="w-3.5 h-3.5" /> 085135767642
              </a>
              <a
                href="tel:03746644372"
                className="flex-1 px-3 py-2 bg-white/20 hover:bg-white/30 text-white font-bold text-xs rounded-lg transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap border border-white/20"
              >
                ☎️ (0374) 6644372
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 2. STATS KPI BENTO GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1: Inspeksi Bangunan */}
        <div 
          onClick={() => onNavigate('inspeksi')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all cursor-pointer group hover:border-red-300 relative overflow-hidden"
        >
          <div className="flex justify-between items-start">
            <div className="p-3 bg-red-50 text-red-600 rounded-xl group-hover:bg-red-600 group-hover:text-white transition-colors">
              <ShieldAlert className="w-6 h-6" />
            </div>
            {criticalCount > 0 && (
              <span className="text-[10px] font-black bg-red-100 text-red-700 px-2 py-0.5 rounded-full border border-red-200 animate-pulse">
                {criticalCount} Kritis
              </span>
            )}
          </div>
          <div className="mt-4">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tracking-tight">
              {inspeksiList.length}
            </span>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-0.5">
              Gedung / Sarana Diperiksa
            </h3>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span> {safeCount} Aman
            </span>
            <span className="flex items-center gap-1 text-amber-600 font-medium">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span> {needFixCount} Perlu Perbaikan
            </span>
          </div>
        </div>

        {/* Stat 2: Relawan REDKAR */}
        <div 
          onClick={() => onNavigate('redkar')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all cursor-pointer group hover:border-amber-300 relative overflow-hidden"
        >
          <div className="flex justify-between items-start">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl group-hover:bg-amber-500 group-hover:text-white transition-colors">
              <Flame className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full border border-amber-200">
              5 Kecamatan
            </span>
          </div>
          <div className="mt-4">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tracking-tight">
              {volunteers.length}
            </span>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-0.5">
              Relawan REDKAR Bima
            </h3>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span className="text-emerald-600 font-semibold">{activeVolunteers} Personil Aktif</span>
            <span className="text-slate-400 group-hover:text-slate-700 flex items-center gap-0.5">
              Detail <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Stat 3: Pemberdayaan Warga */}
        <div 
          onClick={() => onNavigate('edukasi')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all cursor-pointer group hover:border-indigo-300 relative overflow-hidden"
        >
          <div className="flex justify-between items-start">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <Users className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full border border-indigo-200">
              {socializations.length} Kegiatan
            </span>
          </div>
          <div className="mt-4">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tracking-tight">
              {totalParticipants}
            </span>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-0.5">
              Warga Teredukasi Mitigasi
            </h3>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Dapur Aman & Sekolah</span>
            <span className="text-slate-400 group-hover:text-slate-700 flex items-center gap-0.5">
              Detail <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Stat 4: NSPM & Standarisasi */}
        <div 
          onClick={() => onNavigate('nspm')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all cursor-pointer group hover:border-sky-300 relative overflow-hidden"
        >
          <div className="flex justify-between items-start">
            <div className="p-3 bg-sky-50 text-sky-600 rounded-xl group-hover:bg-sky-600 group-hover:text-white transition-colors">
              <BookOpen className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold bg-sky-100 text-sky-800 px-2 py-0.5 rounded-full border border-sky-200">
              SNI & PERDA
            </span>
          </div>
          <div className="mt-4">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tracking-tight">
              {nspmDocs.length}
            </span>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-0.5">
              Dokumen Protap NSPM
            </h3>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Akses Regulasi Terbuka</span>
            <span className="text-slate-400 group-hover:text-slate-700 flex items-center gap-0.5">
              Unduh <Download className="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>

      {/* 3. QUICK ACTION BUTTONS BAR */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-slate-600 font-mono">Aksi Cepat:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              id="dash-add-inspeksi-btn"
              onClick={onOpenInspeksiModal}
              className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <PlusCircle className="w-4 h-4" /> Tambah Inspeksi
            </button>
            <button
              id="dash-add-redkar-btn"
              onClick={onOpenRedkarModal}
              className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Flame className="w-4 h-4" /> Daftar Relawan
            </button>
            <button
              id="dash-add-social-btn"
              onClick={onOpenSocializationModal}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Users className="w-4 h-4" /> Buat Sosialisasi
            </button>
            <button
              id="dash-pembinaan-btn"
              onClick={() => onNavigate('pembinaan')}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <GraduationCap className="w-4 h-4" /> Pembinaan Aparatur
            </button>
          </div>
        </div>
      </div>

      {/* 4. DUAL COLUMN WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT 2 COLS: Recent Inspections Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-red-600" />
                Audit & Inspeksi Bangunan Terkini
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Pemeriksaan kepatuhan proteksi aktif gedung publik & niaga Kota Bima
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                id="dash-export-inspeksi"
                onClick={onExportInspeksi}
                className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-bold transition-colors border border-slate-200 flex items-center gap-1 cursor-pointer"
                title="Export ke Format CSV/Excel"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" /> Unduh Excel
              </button>
              <button
                onClick={() => onNavigate('inspeksi')}
                className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
              >
                Lihat Semua ({inspeksiList.length}) <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Table container */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-y border-slate-200/80">
                <tr>
                  <th className="py-2.5 px-3">Gedung / Sarana</th>
                  <th className="py-2.5 px-3">Alamat</th>
                  <th className="py-2.5 px-3">Tanggal</th>
                  <th className="py-2.5 px-3 text-center">Status Kelayakan</th>
                  <th className="py-2.5 px-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {inspeksiList.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center gap-1.5">
                        <Building2 className="w-8 h-8 text-slate-300" />
                        <span className="font-bold text-xs text-slate-600">Belum ada data audit / inspeksi gedung</span>
                        <span className="text-[11px] text-slate-400">Gunakan tombol "Tambah Inspeksi" untuk merekam hasil audit baru</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  inspeksiList.slice(0, 5).map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900 text-[12.5px] flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
                          <span>{item.name}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">{item.id}</span>
                      </td>
                      <td className="py-3 px-3 text-slate-600 max-w-[200px] truncate" title={item.address}>
                        {item.address}
                      </td>
                      <td className="py-3 px-3 text-slate-600 font-mono text-[11px] whitespace-nowrap">
                        {formatDateDisplay(item.date)}
                      </td>
                      <td className="py-3 px-3 text-center whitespace-nowrap">
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
                      <td className="py-3 px-3 text-right whitespace-nowrap">
                        <button
                          onClick={() => onSelectInspeksi(item)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-[#1A237E] hover:text-white text-slate-700 rounded-lg text-[11px] font-bold transition-colors cursor-pointer"
                        >
                          Detail
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT 1 COL: Volunteer Distribution & Quick Links */}
        <div className="space-y-6">
          {/* Subdistricts Distribution Widget */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-black text-slate-900 tracking-tight flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-500" />
                Sebaran Relawan per Kelurahan
              </h3>
              <button 
                onClick={() => onNavigate('redkar')}
                className="text-[11px] font-bold text-amber-700 hover:underline"
              >
                Lihat 41 Kelurahan
              </button>
            </div>

            <div className="space-y-3">
              {kelurahanCounts.length === 0 ? (
                <div className="text-center py-4 text-xs text-slate-400">Belum ada data relawan</div>
              ) : (
                kelurahanCounts.slice(0, 5).map((kel) => {
                  const percentage = volunteers.length > 0 ? Math.round((kel.count / volunteers.length) * 100) : 0;
                  return (
                    <div key={kel.name} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-700">Kel. {kel.name}</span>
                        <span className="text-slate-900 font-mono font-bold">{kel.count} Orang ({percentage}%)</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-amber-500 to-red-500 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-[11px]">
              <span className="text-slate-500 font-medium">Total Personil Terdaftar:</span>
              <span className="font-bold text-slate-900 font-mono">{volunteers.length} Relawan</span>
            </div>
          </div>

          {/* Socialization Highlight Widget */}
          <div className="bg-gradient-to-br from-indigo-900 to-[#1A237E] rounded-2xl p-5 text-white shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-300" />
                <h4 className="font-black text-sm text-white">Edukasi Warga Terkini</h4>
              </div>
              <span className="text-[9px] bg-white/20 px-2 py-0.5 rounded-full font-bold uppercase">
                {socializations.length} Sesi
              </span>
            </div>

            {socializations.length > 0 ? (
              <div className="bg-white/10 rounded-xl p-3 border border-white/10 space-y-2">
                <h5 className="font-bold text-xs text-yellow-300">{socializations[0].title}</h5>
                <p className="text-[11px] text-slate-200 leading-snug line-clamp-2">
                  {socializations[0].description}
                </p>
                <div className="flex items-center justify-between text-[10px] text-slate-300 pt-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {formatDateDisplay(socializations[0].date)}
                  </span>
                  <span className="font-bold text-white bg-indigo-800/80 px-2 py-0.5 rounded">
                    {socializations[0].participants} Peserta
                  </span>
                </div>
              </div>
            ) : (
              <div className="bg-white/10 rounded-xl p-3 border border-white/10 text-center space-y-1">
                <p className="text-xs text-indigo-100 font-medium">Belum ada rekap edukasi warga</p>
                <p className="text-[10px] text-indigo-300">Klik "Buat Sosialisasi" untuk input kegiatan</p>
              </div>
            )}

            <button
              onClick={() => onNavigate('edukasi')}
              className="w-full py-2 bg-white text-indigo-950 font-black text-xs rounded-xl hover:bg-slate-100 transition-colors flex items-center justify-center gap-1 cursor-pointer shadow-xs"
            >
              Lihat Seluruh Rekap Edukasi <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
