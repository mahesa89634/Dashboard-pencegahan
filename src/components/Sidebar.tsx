import React from 'react';
import { 
  LayoutDashboard, 
  ShieldAlert, 
  Users, 
  GraduationCap, 
  BookOpen, 
  Flame, 
  PhoneCall, 
  UserCheck, 
  LogOut, 
  Lock,
  FileSpreadsheet,
  HelpCircle,
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  isAdmin: boolean;
  onOpenAdminLogin: () => void;
  onLogoutAdmin: () => void;
  inspeksiCount: number;
  criticalCount: number;
  volunteerCount: number;
  socializationCount: number;
  pembinaanCount?: number;
  nspmCount: number;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export default function Sidebar({
  currentView,
  onNavigate,
  isAdmin,
  onOpenAdminLogin,
  onLogoutAdmin,
  inspeksiCount,
  criticalCount,
  volunteerCount,
  socializationCount,
  pembinaanCount,
  nspmCount,
  isMobileOpen,
  onCloseMobile
}: SidebarProps) {
  const menuItems = [
    {
      id: 'home',
      label: 'Pusat Komando (Home)',
      icon: LayoutDashboard,
      badge: null,
      description: 'Ringkasan & KPI Statistik'
    },
    {
      id: 'inspeksi',
      label: 'Layanan & Sistem Proteksi',
      icon: ShieldAlert,
      badge: criticalCount > 0 ? `${criticalCount} Kritis` : `${inspeksiCount}`,
      badgeColor: criticalCount > 0 ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-700 text-slate-200',
      description: 'Audit APAR, Hydrant & Gedung'
    },
    {
      id: 'edukasi',
      label: 'Pemberdayaan Warga',
      icon: Users,
      badge: `${socializationCount}`,
      badgeColor: 'bg-indigo-700 text-white',
      description: 'Sosialisasi & Edukasi Mitigasi'
    },
    {
      id: 'redkar',
      label: 'Relawan REDKAR',
      icon: Flame,
      badge: `${volunteerCount}`,
      badgeColor: 'bg-amber-600 text-white',
      description: 'Relawan Pemadam Bima'
    },
    {
      id: 'pembinaan',
      label: 'Pembinaan Aparatur',
      icon: GraduationCap,
      badge: pembinaanCount !== undefined ? `${pembinaanCount}` : null,
      badgeColor: 'bg-emerald-600 text-white',
      description: 'Dokumentasi & Laporan Kegiatan Aparatur'
    },
    {
      id: 'nspm',
      label: 'NSPM & Regulasi',
      icon: BookOpen,
      badge: `${nspmCount}`,
      badgeColor: 'bg-sky-600 text-white',
      description: 'Norma, Standar & Perda'
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Main Sidebar Container */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#0F172A] text-slate-100 flex flex-col border-r border-slate-800 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-800/80 bg-[#0B1120] flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Emblem Logo */}
            <div className="relative w-10 h-10 select-none flex items-center justify-center shrink-0">
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-500 via-yellow-300 to-amber-600 p-0.5 shadow-md flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-[#161C5F]" />
              </div>
              <svg className="w-6 h-6 relative z-10 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.5 19.5L19.5 4.5" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M19.5 19.5L4.5 4.5" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M12 2.5C15.5 2.5 17.5 4.5 17.5 8C17.5 13.5 12 17.5 12 17.5C12 17.5 6.5 13.5 6.5 8C6.5 4.5 8.5 2.5 12 2.5Z" fill="#D32F2F" stroke="#FFFFFF" strokeWidth="1.2" />
                <path d="M12 5.5C13.2 7 13.8 8.8 12.8 10.2C11.8 11.6 10.2 11.6 10.2 10.2C10.2 8.8 11 7.5 12 5.5Z" fill="#FBBF24" />
              </svg>
              <span className="absolute -bottom-0.5 bg-yellow-400 text-slate-950 font-black text-[6px] px-1 rounded border border-amber-600 shadow-xs z-20">BIMA</span>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-extrabold text-sm tracking-tight text-white">DAMKARMAT</h1>
                <span className="text-[9px] font-black bg-red-600 text-white px-1.5 py-0.2 rounded font-mono uppercase">Kota Bima</span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">Dashboard Pencegahan & Proteksi</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
          <div className="px-3 py-1.5 text-[9.5px] font-bold uppercase tracking-wider text-slate-400 font-mono">
            Menu Utama
          </div>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => {
                  onNavigate(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all duration-200 text-left group cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-red-600 to-red-700 text-white font-bold shadow-lg shadow-red-900/20'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg transition-colors ${
                    isActive ? 'bg-white/15 text-white' : 'bg-slate-800 text-slate-400 group-hover:text-amber-400 group-hover:bg-slate-700'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs block leading-tight">{item.label}</span>
                    <span className={`text-[9.5px] block ${isActive ? 'text-red-100' : 'text-slate-400'}`}>
                      {item.description}
                    </span>
                  </div>
                </div>

                {item.badge && (
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full font-mono shrink-0 ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Emergency Callout Card */}
        <div className="p-3">
          <div className="bg-gradient-to-br from-red-950/80 to-slate-900 border border-red-800/50 rounded-2xl p-3 text-center relative overflow-hidden shadow-md">
            <div className="flex items-center justify-center gap-1.5 text-red-400 mb-1">
              <PhoneCall className="w-4 h-4 animate-bounce" />
              <span className="font-extrabold text-[11px] uppercase tracking-wider text-red-200">Hotline Darurat Kota Bima</span>
            </div>
            <p className="text-[10px] text-slate-300">Posko Induk Damkarmat Kota Bima</p>
            <div className="mt-2 space-y-1.5">
              <a 
                href="tel:085135767642"
                className="block w-full py-1.5 bg-red-600 hover:bg-red-500 text-white font-black text-xs rounded-xl tracking-wide shadow-md transition-all active:scale-95"
              >
                📞 085135767642
              </a>
              <a 
                href="tel:03746644372"
                className="block w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-red-200 font-bold text-[11px] rounded-xl tracking-wide border border-red-900/60 transition-all active:scale-95"
              >
                ☎️ (0374) 6644372
              </a>
            </div>
          </div>
        </div>

        {/* Admin Footer & Session Status */}
        <div className="p-3 border-t border-slate-800/80 bg-[#0B1120] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${isAdmin ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            <div>
              <span className="text-[11px] font-bold block text-white">
                {isAdmin ? 'Admin: Yugho114' : 'Mode Tamu (Read-Only)'}
              </span>
              <span className="text-[9px] text-slate-400 block font-mono">
                {isAdmin ? 'Akses Penuh Kelola Data' : 'Login untuk Ubah/Hapus'}
              </span>
            </div>
          </div>

          {isAdmin ? (
            <button
              id="sidebar-logout-btn"
              onClick={onLogoutAdmin}
              className="p-1.5 bg-slate-800 hover:bg-red-900/60 text-slate-300 hover:text-red-300 rounded-lg transition-colors cursor-pointer"
              title="Keluar Mode Admin"
            >
              <LogOut className="w-4 h-4" />
            </button>
          ) : (
            <button
              id="sidebar-login-btn"
              onClick={onOpenAdminLogin}
              className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[10px] rounded-lg transition-all shadow-xs flex items-center gap-1 cursor-pointer"
              title="Masuk Mode Admin"
            >
              <Lock className="w-3 h-3" /> Login
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
