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
      {/* 1. KOP SURAT RESMI PEMERINTAH KOTA BIMA (TEXT ONLY - FULL CENTER) */}
      <div className="w-full text-center space-y-0.5 pb-2">
        <h3 className="text-sm font-bold tracking-widest text-slate-900 uppercase">
          PEMERINTAH KOTA BIMA
        </h3>
        <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-950 uppercase leading-tight">
          DINAS PEMADAM KEBAKARAN DAN PENYELAMATAN
        </h1>
        <h2 className="text-xs sm:text-sm font-bold tracking-normal text-slate-900 uppercase">
          BIDANG PENCEGAHAN
        </h2>
        <div className="text-[10.5px] text-slate-800 tracking-normal font-sans leading-tight pt-1">
          <p>Alamat: Kompleks Perkantoran Walikota Bima Jl. Soekarno-Hatta No. Kota Bima</p>
          <p className="pt-0.5">Website: www.bimakota.go.id, email: damkarkobi1@gmail.com</p>
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
