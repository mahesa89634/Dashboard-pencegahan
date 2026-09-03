import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  ShieldAlert, 
  UserCheck, 
  Cloud, 
  Clock, 
  Calendar, 
  RotateCcw,
  Sparkles,
  Phone,
  Search
} from 'lucide-react';

interface HeaderProps {
  currentView: string;
  isAdmin: boolean;
  onOpenAdminLogin: () => void;
  onLogoutAdmin: () => void;
  onNavigateHome: () => void;
  onOpenMobileSidebar: () => void;
}

export default function Header({
  currentView,
  isAdmin,
  onOpenAdminLogin,
  onLogoutAdmin,
  onNavigateHome,
  onOpenMobileSidebar
}: HeaderProps) {
  const [time, setTime] = useState<string>('');
  const [date, setDate] = useState<string>('');

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' WITA');
      setDate(now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' }));
    };
    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const viewTitles: Record<string, { title: string; subtitle: string }> = {
    home: {
      title: 'Pusat Komando & Ringkasan Pencegahan',
      subtitle: 'Pantau status proteksi kebakaran, kegiatan relawan REDKAR & kepatuhan bangunan Kota Bima'
    },
    inspeksi: {
      title: 'Layanan & Sistem Proteksi Bangunan',
      subtitle: 'Audit sarana proteksi aktif & pasif (APAR, Hydrant, Sprinkler, Jalur Evakuasi) gedung & fasilitas publik'
    },
    edukasi: {
      title: 'Pemberdayaan & Edukasi Warga',
      subtitle: 'Sosialisasi bahaya kebakaran, mitigasi tabung LPG & program Damkar Goes to School'
    },
    redkar: {
      title: 'Relawan Pemadam Kebakaran (REDKAR)',
      subtitle: 'Database relawan terlatih per kecamatan di seluruh wilayah administratif Kota Bima'
    },
    pembinaan: {
      title: 'Pembinaan Aparatur Damkarmat',
      subtitle: 'Dokumentasi & laporan kegiatan pembinaan aparatur kebakaran, pertolongan & REDKAR Kota Bima'
    },
    nspm: {
      title: 'Norma, Standar, Prosedur & Manual (NSPM)',
      subtitle: 'Katalog regulasi Perda Kota Bima, SNI, dan protap penanggulangan kebakaran resmi'
    }
  };

  const currentInfo = viewTitles[currentView] || viewTitles.home;

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 lg:px-8 py-3 shadow-xs">
      <div className="flex items-center justify-between gap-4">
        {/* Left Side: Mobile Menu Button + View Title */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            id="mobile-sidebar-toggle"
            onClick={onOpenMobileSidebar}
            className="p-2 -ml-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 lg:hidden cursor-pointer"
            title="Buka Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="min-w-0">
            <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight truncate">
              {currentInfo.title}
            </h2>
            <p className="text-[11px] text-slate-500 font-medium hidden sm:block truncate">
              {currentInfo.subtitle}
            </p>
          </div>
        </div>

        {/* Right Side: Status Badges, Clock & Admin Action */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Real-time Cloud Sync Pill */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200/80 rounded-full text-emerald-800 text-[11px] font-medium shadow-2xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-mono font-semibold text-[10.5px]">Firestore Cloud Realtime Live</span>
          </div>

          {/* Date & Time Widget */}
          <div className="hidden xl:flex flex-col text-right pr-1">
            <div className="text-[11px] font-black text-slate-800 font-mono flex items-center justify-end gap-1">
              <Clock className="w-3 h-3 text-slate-400" />
              {time}
            </div>
            <div className="text-[9.5px] text-slate-500 flex items-center justify-end gap-1">
              <Calendar className="w-3 h-3 text-slate-400" />
              {date}
            </div>
          </div>

          {/* Admin Login/Logout Button */}
          {isAdmin ? (
            <button
              id="header-admin-btn"
              onClick={onLogoutAdmin}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95 border border-emerald-500"
              title="Klik untuk Keluar dari Mode Admin"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Admin Yugho114</span>
              <span className="text-[10px] bg-emerald-700/60 px-1.5 py-0.5 rounded text-emerald-100 uppercase text-[8.5px]">Aktif</span>
            </button>
          ) : (
            <button
              id="header-login-btn"
              onClick={onOpenAdminLogin}
              className="bg-slate-900 hover:bg-slate-850 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95 border border-slate-700"
              title="Masuk Mode Admin untuk Ubah / Hapus Data"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Mode Tamu</span>
              <span className="text-[9.5px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-mono">Masuk</span>
            </button>
          )}

          {/* Reset / Home Button */}
          <button
            id="header-reset-btn"
            onClick={onNavigateHome}
            className="p-1.5 sm:px-3 sm:py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-all flex items-center gap-1 cursor-pointer active:scale-95 border border-slate-200"
            title="Kembali ke Ringkasan Beranda"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden md:inline">Beranda</span>
          </button>
        </div>
      </div>
    </header>
  );
}
