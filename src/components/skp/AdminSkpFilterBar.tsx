import React from 'react';
import { 
  Printer, 
  Calendar, 
  Filter, 
  RotateCcw, 
  ShieldCheck, 
  FileText,
  CheckCircle2
} from 'lucide-react';
import { MONTHS_LIST, YEARS_LIST, getPeriodLabel } from '../../utils/dateUtils';

interface AdminSkpFilterBarProps {
  isAdmin: boolean;
  selectedMonth: string;
  onMonthChange: (month: string) => void;
  selectedYear: string;
  onYearChange: (year: string) => void;
  onPrintPdf: () => void;
  filteredCount?: number;
  totalCount?: number;
  label?: string;
}

export default function AdminSkpFilterBar({
  isAdmin,
  selectedMonth,
  onMonthChange,
  selectedYear,
  onYearChange,
  onPrintPdf,
  filteredCount,
  totalCount,
  label = 'data'
}: AdminSkpFilterBarProps) {
  // Hanya ditampilkan jika hak akses Admin Yugho114 Aktif
  if (!isAdmin) return null;

  const isFilterActive = selectedMonth !== 'all' || selectedYear !== 'all';
  const periodLabel = getPeriodLabel(selectedMonth, selectedYear);

  return (
    <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-4 md:p-4.5 border border-indigo-500/30 text-white shadow-md print:hidden space-y-3.5 transition-all">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
        {/* Title & Authority Badge */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-red-600/90 border border-red-400 flex items-center justify-center shrink-0 shadow-xs">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-extrabold text-sm text-white tracking-tight">
                Filter Periode Laporan & Bukti SKP
              </h4>
              <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full text-[10px] font-bold">
                <ShieldCheck className="w-3 h-3" /> Admin Yugho114 Aktif
              </span>
            </div>
            <p className="text-[11px] text-slate-300">
              Saring kegiatan berdasarkan bulan/tahun untuk penerbitan laporan resmi capaian kinerja ASN.
            </p>
          </div>
        </div>

        {/* Action: Cetak Laporan SKP (PDF) */}
        <div className="w-full lg:w-auto flex items-center gap-2 shrink-0">
          <button
            id="btn-print-skp-report"
            type="button"
            onClick={onPrintPdf}
            className="w-full lg:w-auto px-4 py-2.5 bg-gradient-to-r from-red-600 via-red-700 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-bold text-xs rounded-xl shadow-md border border-red-400/50 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 whitespace-nowrap"
            title="Cetak Laporan Resmi SKP ke format PDF dengan Kop Surat & Tanda Tangan"
          >
            <Printer className="w-4 h-4 text-white" />
            <span>Cetak Laporan SKP (PDF)</span>
          </button>
        </div>
      </div>

      {/* Filter Dropdowns Controls */}
      <div className="pt-2.5 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Dropdown Pilih Bulan */}
          <div className="flex items-center gap-1.5 bg-white/10 px-2.5 py-1.5 rounded-xl border border-white/15">
            <Calendar className="w-3.5 h-3.5 text-indigo-300 shrink-0" />
            <span className="text-[11px] font-bold text-indigo-200">Bulan:</span>
            <select
              id="filter-skp-month"
              value={selectedMonth}
              onChange={(e) => onMonthChange(e.target.value)}
              className="bg-slate-900 text-white font-bold text-xs rounded-lg px-2.5 py-1 border border-white/20 focus:outline-none focus:ring-1 focus:ring-indigo-400 cursor-pointer"
            >
              {MONTHS_LIST.map((m) => (
                <option key={m.value} value={m.value} className="bg-slate-900 text-white">
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          {/* Dropdown Pilih Tahun */}
          <div className="flex items-center gap-1.5 bg-white/10 px-2.5 py-1.5 rounded-xl border border-white/15">
            <Filter className="w-3.5 h-3.5 text-indigo-300 shrink-0" />
            <span className="text-[11px] font-bold text-indigo-200">Tahun:</span>
            <select
              id="filter-skp-year"
              value={selectedYear}
              onChange={(e) => onYearChange(e.target.value)}
              className="bg-slate-900 text-white font-bold text-xs rounded-lg px-2.5 py-1 border border-white/20 focus:outline-none focus:ring-1 focus:ring-indigo-400 cursor-pointer"
            >
              {YEARS_LIST.map((y) => (
                <option key={y.value} value={y.value} className="bg-slate-900 text-white">
                  {y.label}
                </option>
              ))}
            </select>
          </div>

          {/* Tombol Reset jika filter sedang aktif */}
          {isFilterActive && (
            <button
              id="btn-reset-skp-filter"
              type="button"
              onClick={() => {
                onMonthChange('all');
                onYearChange('all');
              }}
              className="px-2.5 py-1.5 bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white rounded-xl text-xs font-semibold flex items-center gap-1 border border-white/10 transition-colors cursor-pointer"
              title="Tampilkan semua data (Reset filter bulan & tahun)"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Semua Data</span>
            </button>
          )}
        </div>

        {/* Periode Aktif & Counter Badge */}
        <div className="flex items-center gap-2 text-xs">
          <div className="px-3 py-1 bg-white/10 border border-white/15 rounded-lg flex items-center gap-1.5 font-mono text-[11px]">
            <span className="text-slate-400">Periode:</span>
            <span className="font-bold text-yellow-300">{periodLabel}</span>
          </div>

          {typeof filteredCount === 'number' && (
            <span className="text-[11px] text-slate-300 font-medium hidden sm:inline">
              (Terpilih <strong>{filteredCount}</strong>{typeof totalCount === 'number' ? ` dari ${totalCount}` : ''} {label})
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
