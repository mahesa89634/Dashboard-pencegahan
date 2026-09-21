import React from 'react';

interface OfficialSkpSignaturesProps {
  selectedMonth: string;
  selectedYear: string;
}

export default function OfficialSkpSignatures({
  selectedMonth,
  selectedYear
}: OfficialSkpSignaturesProps) {
  // Menentukan titimangsa: jika bulan & tahun dipilih, gunakan tanggal akhir bulan tersebut; jika 'all' atau tidak ada, gunakan tanggal hari ini
  const getTitimangsa = () => {
    if (selectedMonth && selectedMonth !== 'all' && selectedYear) {
      const monthNum = parseInt(selectedMonth, 10);
      const yearNum = parseInt(selectedYear, 10);
      const lastDayOfMonth = new Date(yearNum, monthNum, 0);
      return lastDayOfMonth.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    }
    const today = new Date();
    return today.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const titimangsaDate = getTitimangsa();

  return (
    <div className="hidden print:block mt-8 pt-6 border-t-2 border-slate-900 font-sans break-inside-avoid">
      <div className="grid grid-cols-2 gap-8 text-xs text-slate-950">
        {/* Kolom Kiri: Mengetahui / Mengesahkan */}
        <div className="text-center flex flex-col justify-between">
          <div className="space-y-1">
            <p className="font-semibold text-slate-700">Mengetahui / Mengesahkan,</p>
            <p className="font-extrabold uppercase tracking-tight text-slate-950">
              KEPALA BIDANG PENCEGAHAN
            </p>
            <p className="text-[11px] text-slate-700">
              Dinas Pemadam Kebakaran dan Penyelamatan Kota Bima
            </p>
          </div>

          <div className="h-24 flex items-center justify-center">
            <span className="text-[10px] text-slate-400 italic">( Tanda Tangan & Cap Dinas )</span>
          </div>

          <div className="space-y-0.5">
            <p className="font-black underline uppercase tracking-wide text-slate-950 text-xs">
              Ardi Firmansyah, S.Sos
            </p>
            <p className="text-[11px] font-mono text-slate-800 font-semibold">
              NIP. 198410082010011010
            </p>
          </div>
        </div>

        {/* Kolom Kanan: Pembuat Laporan */}
        <div className="text-center flex flex-col justify-between">
          <div className="space-y-1">
            <p className="font-semibold text-slate-700">Kota Bima, {titimangsaDate}</p>
            <p className="font-extrabold uppercase tracking-tight text-slate-950">
              Pembuat Laporan,
            </p>
            <p className="text-[11px] text-slate-700 font-medium">
              Analis Kebakaran Ahli Pertama
            </p>
          </div>

          <div className="h-24 flex items-center justify-center">
            <span className="text-[10px] text-slate-400 italic">( Tanda Tangan )</span>
          </div>

          <div className="space-y-0.5">
            <p className="font-black underline uppercase tracking-wide text-slate-950 text-xs">
              Yugho Pamungkas, S.T
            </p>
            <p className="text-[11px] font-mono text-slate-800 font-semibold">
              NIP. 198911142025061002
            </p>
          </div>
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
