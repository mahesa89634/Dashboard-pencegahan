import React from 'react';

interface OfficialSkpSignaturesProps {
  selectedMonth: string;
  selectedYear: string;
}

export default function OfficialSkpSignatures({
  selectedMonth,
  selectedYear
}: OfficialSkpSignaturesProps) {
  const today = new Date();
  const formattedToday = today.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="hidden print:block mt-8 pt-6 border-t-2 border-slate-900 font-sans break-inside-avoid">
      <div className="grid grid-cols-2 gap-8 text-xs text-slate-950">
        {/* Kolom Kiri: Atasan Langsung / Kepala Dinas (Penilai SKP) */}
        <div className="text-center space-y-1">
          <p className="font-semibold text-slate-700">Mengetahui / Mengesahkan,</p>
          <p className="font-extrabold uppercase tracking-tight text-slate-950">
            Kepala Dinas Pemadam Kebakaran dan Penyelamatan
          </p>
          <p className="font-extrabold uppercase tracking-tight text-slate-950">
            Kota Bima
          </p>
          <div className="h-24 flex items-center justify-center">
            <span className="text-[10px] text-slate-400 italic">( Tanda Tangan & Cap Stempel Dinas )</span>
          </div>
          <p className="font-black underline uppercase tracking-wide text-slate-950">
            ( ................................................................ )
          </p>
          <p className="text-[11px] text-slate-800 font-medium">
            Pembina Utama Muda (IV/c)
          </p>
          <p className="text-[11px] font-mono text-slate-700">
            NIP. 19750812 199803 1 004
          </p>
        </div>

        {/* Kolom Kanan: Pejabat Pembuat Laporan (Kabid Pencegahan) */}
        <div className="text-center space-y-1">
          <p className="font-semibold text-slate-700">Kota Bima, {formattedToday}</p>
          <p className="font-extrabold uppercase tracking-tight text-slate-950">
            Kepala Bidang Pencegahan,
          </p>
          <p className="font-extrabold uppercase tracking-tight text-slate-950">
            Dinas Damkar dan Penyelamatan Kota Bima
          </p>
          <div className="h-24 flex items-center justify-center">
            <span className="text-[10px] text-slate-400 italic">( Tanda Tangan Pejabat Pengelola )</span>
          </div>
          <p className="font-black underline uppercase tracking-wide text-slate-950">
            ( ................................................................ )
          </p>
          <p className="text-[11px] text-slate-800 font-medium">
            Penata Tingkat I (III/d)
          </p>
          <p className="text-[11px] font-mono text-slate-700">
            NIP. 19820415 200604 1 009
          </p>
        </div>
      </div>

      {/* Catatan Kaki Otentikasi Laporan SKP */}
      <div className="mt-8 pt-2 border-t border-slate-300 text-[9px] text-slate-600 flex justify-between items-center font-mono">
        <span>Kompilasi Digital: Bidang Pencegahan DAMKARMAT Kota Bima</span>
        <span>Dokumen Bukti Fisik Sasaran Kinerja Pegawai (SKP) Aparatur</span>
      </div>
    </div>
  );
}
