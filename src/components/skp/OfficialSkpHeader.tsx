import React from 'react';
import { getPeriodLabel } from '../../utils/dateUtils';

interface OfficialSkpHeaderProps {
  currentView: string;
  selectedMonth: string;
  selectedYear: string;
  subTitle?: string;
}

export default function OfficialSkpHeader({
  currentView,
  selectedMonth,
  selectedYear,
  subTitle
}: OfficialSkpHeaderProps) {
  const periodText = getPeriodLabel(selectedMonth, selectedYear);
  const printDate = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const getModuleTitle = () => {
    if (subTitle) return subTitle;
    if (currentView === 'home') return 'REKAPITULASI INDIKATOR KINERJA UTAMA & PENCEGAHAN KEBAKARAN KOTA BIMA';
    if (currentView === 'inspeksi') return 'REKAPITULASI HASIL AUDIT & PEMERIKSAAN KELAYAKAN SISTEM PROTEKSI BANGUNAN';
    if (currentView === 'edukasi') return 'REKAPITULASI KEGIATAN SOSIALISASI & PEMBERDAYAAN MASYARAKAT CEGAH KEBAKARAN';
    return 'REKAPITULASI CAPAIAN KINERJA BIDANG PENCEGAHAN';
  };

  return (
    <div className="hidden print:block mb-6 text-slate-950 font-serif border-b-2 border-slate-900 pb-3">
      {/* 1. KOP SURAT RESMI PEMERINTAH KOTA BIMA */}
      <div className="flex items-center justify-between gap-4 pb-2">
        {/* Lambang Garuda / Pemkot Bima Emblem */}
        <div className="w-20 h-20 shrink-0 flex flex-col items-center justify-center border-2 border-slate-900 rounded-lg p-1 bg-white">
          <svg className="w-12 h-12 text-slate-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
            <path d="M12 2L3 7v6c0 5.5 3.8 10.7 9 12 5.2-1.3 9-6.5 9-12V7l-9-5z" fill="#f8fafc" />
            <path d="M12 7c-2 0-3.5 1.5-3.5 3.5 0 2.5 3.5 5.5 3.5 5.5s3.5-3 3.5-5.5C15.5 8.5 14 7 12 7z" fill="#b91c1c" />
          </svg>
          <span className="text-[7.5px] font-mono font-black uppercase text-slate-900 tracking-tighter">KOTA BIMA</span>
        </div>

        {/* Teks Identitas Kedinasan */}
        <div className="flex-1 text-center space-y-0.5">
          <h3 className="text-sm font-bold tracking-widest text-slate-900 uppercase">
            PEMERINTAH KOTA BIMA
          </h3>
          <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-950 uppercase leading-tight">
            DINAS PEMADAM KEBAKARAN DAN PENYELAMATAN
          </h1>
          <h2 className="text-xs sm:text-sm font-bold tracking-normal text-slate-900 uppercase">
            BIDANG PENCEGAHAN
          </h2>
          <p className="text-[9.5px] text-slate-700 tracking-tight font-sans leading-tight">
            Jl. Soekarno-Hatta No. 01, Paruga, Rasanae Barat, Kota Bima, Nusa Tenggara Barat 84111
            <br />
            Laman Resmi: damkar.bimakota.go.id | Pos-el: damkarmat@bimakota.go.id | Call Center: 114
          </p>
        </div>

        {/* Lambang Korps Damkarmat */}
        <div className="w-20 h-20 shrink-0 flex flex-col items-center justify-center border-2 border-slate-900 rounded-lg p-1 bg-white">
          <span className="text-red-700 font-black text-xs leading-none font-sans">DAMKAR</span>
          <span className="text-[7.5px] font-black text-slate-800 uppercase font-sans mt-0.5">YUDHA BRAMA</span>
          <span className="text-[7px] font-bold text-slate-600 font-sans">JAYA</span>
          <div className="w-6 h-0.5 bg-red-600 my-0.5" />
          <span className="text-[6.5px] font-mono text-slate-700">KOTA BIMA</span>
        </div>
      </div>

      {/* Garis Ganda Pembatas Kop Surat Resmi */}
      <div className="border-t-[2.5px] border-slate-950 mt-1 pt-[1.5px] border-b border-slate-950" />

      {/* 2. JUDUL DOKUMEN & PERIODE LAPORAN SKP */}
      <div className="text-center mt-4 space-y-1 font-sans">
        <h2 className="text-sm font-black tracking-wider text-slate-950 uppercase underline underline-offset-4">
          LAPORAN CAPAIAN KINERJA BULANAN BIDANG PENCEGAHAN
        </h2>
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-tight">
          {getModuleTitle()}
        </h3>
        <p className="text-[10px] text-slate-600 font-medium">
          Lampiran Bahan Bukti Dukung Sasaran Kinerja Pegawai (SKP) Aparatur Sipil Negara
        </p>
        <div className="inline-flex items-center gap-3 bg-slate-100 text-slate-900 px-4 py-1 rounded-md text-[11px] font-semibold border border-slate-300 mt-1">
          <span>PERIODE LAPORAN: <strong className="font-black uppercase text-slate-950">{periodText}</strong></span>
          <span className="text-slate-400">|</span>
          <span>TANGGAL CETAK: <strong>{printDate}</strong></span>
        </div>
      </div>
    </div>
  );
}
