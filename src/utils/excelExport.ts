import XLSX from 'xlsx-js-style';
import { InspeksiItem, SocializationRecap, RedkarVolunteer, PembinaanActivity } from '../types';
import { formatDateDisplay } from './dateUtils';

// Standard 7 Kolom Laporan sesuai Permintaan Pengguna
export const STANDARD_REPORT_HEADERS = [
  'ID Kegiatan',                 // Kolom A
  'Nama Kegiatan / Gedung',      // Kolom B
  'Tanggal Pelaksanaan',         // Kolom C
  'Lokasi / Alamat',             // Kolom D
  'Jumlah Peserta / Status',     // Kolom E
  'Pemateri / Petugas',          // Kolom F
  'Deskripsi / Ringkasan Hasil'  // Kolom G
];

/**
 * Styling Definisi: Header Resmi & Border Sel
 */
const HEADER_STYLE = {
  font: {
    name: 'Calibri',
    sz: 11,
    bold: true,
    color: { rgb: 'FFFFFF' }
  },
  fill: {
    fgColor: { rgb: '1A237E' } // Navy Blue elegan khas Damkar
  },
  alignment: {
    horizontal: 'center',
    vertical: 'center',
    wrapText: true
  },
  border: {
    top: { style: 'thin', color: { rgb: '000000' } },
    bottom: { style: 'medium', color: { rgb: '000000' } },
    left: { style: 'thin', color: { rgb: '3949AB' } },
    right: { style: 'thin', color: { rgb: '3949AB' } }
  }
};

const CELL_BORDER = {
  top: { style: 'thin', color: { rgb: 'CBD5E1' } },
  bottom: { style: 'thin', color: { rgb: 'CBD5E1' } },
  left: { style: 'thin', color: { rgb: 'CBD5E1' } },
  right: { style: 'thin', color: { rgb: 'CBD5E1' } }
};

/**
 * Ekspor Data Array 7-Kolom ke File Excel (.xlsx Asli)
 */
export function exportTableToExcel(
  rows: (string | number)[][],
  filename: string,
  sheetName: string = 'Data Laporan'
) {
  if (!rows || rows.length === 0) {
    throw new Error('Tidak ada data untuk diekspor ke Excel.');
  }

  // 1. Buat Workbook & Sheet baru
  const wb = XLSX.utils.book_new();
  const aoa = [STANDARD_REPORT_HEADERS, ...rows];
  const ws = XLSX.utils.aoa_to_sheet(aoa);

  // 2. Beri Gaya pada Judul Kolom (Header)
  for (let c = 0; c < STANDARD_REPORT_HEADERS.length; c++) {
    const colLetter = String.fromCharCode(65 + c);
    const cellRef = `${colLetter}1`;
    if (ws[cellRef]) {
      ws[cellRef].s = HEADER_STYLE;
    }
  }

  // 3. Beri Gaya pada Setiap Sel Data (Border, Font, Zebra Striping & Alignment)
  rows.forEach((row, rIdx) => {
    const rowNum = rIdx + 2; // Baris 1 adalah Header
    const isEven = rIdx % 2 === 0;
    const rowBg = isEven ? 'FFFFFF' : 'F8FAFC'; // Selang-seling warna baris

    for (let c = 0; c < STANDARD_REPORT_HEADERS.length; c++) {
      const colLetter = String.fromCharCode(65 + c);
      const cellRef = `${colLetter}${rowNum}`;

      if (ws[cellRef]) {
        // Kolom A (ID), C (Tanggal), E (Peserta/Status) rata tengah; sisanya rata kiri
        const isCenterCol = c === 0 || c === 2 || c === 4;
        ws[cellRef].s = {
          font: {
            name: 'Calibri',
            sz: 10,
            color: { rgb: '1E293B' }
          },
          fill: {
            fgColor: { rgb: rowBg }
          },
          alignment: {
            horizontal: isCenterCol ? 'center' : 'left',
            vertical: 'center',
            wrapText: true
          },
          border: CELL_BORDER
        };
      }
    }
  });

  // 4. Hitung Lebar Kolom Otomatis (Auto-Width)
  const colWidths = STANDARD_REPORT_HEADERS.map((headerText, colIndex) => {
    let maxLen = headerText.length;
    rows.forEach(r => {
      const val = r[colIndex] != null ? String(r[colIndex]) : '';
      val.split('\n').forEach(line => {
        if (line.length > maxLen) {
          maxLen = line.length;
        }
      });
    });
    // Menambahkan padding karakter agar teks tidak tertindih di WPS/Excel
    return Math.min(Math.max(maxLen + 4, 15), 55);
  });

  ws['!cols'] = colWidths.map(wch => ({ wch }));

  // 5. Atur Tinggi Baris (Row Heights)
  ws['!rows'] = [
    { hpt: 28 }, // Header lebih tinggi dan lega
    ...rows.map(() => ({ hpt: 24 })) // Data rows
  ];

  // 6. Masukkan Sheet ke Workbook
  XLSX.utils.book_append_sheet(wb, ws, sheetName.slice(0, 31));

  // 7. Simpan dan Unduh Berkas .xlsx ke Peramban
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([wbout], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const cleanFilename = filename.endsWith('.xlsx') ? filename : `${filename}.xlsx`;
  a.download = cleanFilename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Mapper 7-Kolom untuk Data Inspeksi Proteksi Gedung
 */
export function exportInspeksiExcel(items: InspeksiItem[], filename: string = 'Data_Inspeksi_Proteksi_Damkar_Bima') {
  const rows = items.map(item => [
    item.id,                                              // Kolom A: ID Kegiatan
    item.name,                                            // Kolom B: Nama Kegiatan / Gedung
    formatDateDisplay(item.date),                        // Kolom C: Tanggal Pelaksanaan
    item.address || '-',                                  // Kolom D: Lokasi / Alamat
    item.status || 'Perlu Perbaikan',                    // Kolom E: Jumlah Peserta / Status
    'Tim Inspeksi Proteksi DAMKARMAT',                   // Kolom F: Pemateri / Petugas
    item.notes || 'Pemeriksaan sistem proteksi kebakaran gedung' // Kolom G: Deskripsi / Ringkasan Hasil
  ]);
  exportTableToExcel(rows, filename, 'Inspeksi Gedung');
}

/**
 * Mapper 7-Kolom untuk Data Sosialisasi & Edukasi Warga
 */
export function exportSocializationExcel(items: SocializationRecap[], filename: string = 'Data_Sosialisasi_Damkar_Bima') {
  const rows = items.map(item => [
    item.id,                                              // Kolom A: ID Kegiatan
    item.title,                                           // Kolom B: Nama Kegiatan / Gedung
    formatDateDisplay(item.date),                        // Kolom C: Tanggal Pelaksanaan
    item.location || '-',                                 // Kolom D: Lokasi / Alamat
    `${item.participants} Orang Peserta`,                 // Kolom E: Jumlah Peserta / Status
    item.speaker || 'Instruktur Edukasi Damkarmat',       // Kolom F: Pemateri / Petugas
    item.description || 'Edukasi dan pencegahan bahaya kebakaran' // Kolom G: Deskripsi / Ringkasan Hasil
  ]);
  exportTableToExcel(rows, filename, 'Sosialisasi');
}

/**
 * Mapper 7-Kolom untuk Data Relawan REDKAR
 */
export function exportRedkarExcel(items: RedkarVolunteer[], filename: string = 'Data_Relawan_REDKAR_Bima') {
  const rows = items.map(item => [
    item.id,                                              // Kolom A: ID Kegiatan
    item.name,                                            // Kolom B: Nama Kegiatan / Gedung
    formatDateDisplay(item.joinDate),                    // Kolom C: Tanggal Pelaksanaan
    `Kelurahan ${item.subdistrict}, Kota Bima`,          // Kolom D: Lokasi / Alamat
    `Status: ${item.status}`,                             // Kolom E: Jumlah Peserta / Status
    `${item.role} (No. HP: ${item.phone})`,               // Kolom F: Pemateri / Petugas
    `Penugasan Relawan Pemadam Kebakaran Kelurahan ${item.subdistrict}` // Kolom G: Deskripsi / Ringkasan Hasil
  ]);
  exportTableToExcel(rows, filename, 'Relawan REDKAR');
}

/**
 * Mapper 7-Kolom untuk Data Pembinaan Aparatur
 */
export function exportPembinaanExcel(items: PembinaanActivity[], filename: string = 'Laporan_Pembinaan_Aparatur_Kota_Bima') {
  const rows = items.map(item => [
    item.id,                                              // Kolom A: ID Kegiatan
    item.title,                                           // Kolom B: Nama Kegiatan / Gedung
    formatDateDisplay(item.date),                        // Kolom C: Tanggal Pelaksanaan
    'Mako Damkarmat Kota Bima',                           // Kolom D: Lokasi / Alamat
    item.category || 'Pembinaan Aparatur',               // Kolom E: Jumlah Peserta / Status
    'Instruktur Bidang Pencegahan DAMKARMAT',             // Kolom F: Pemateri / Petugas
    item.description || item.shortDesc || 'Laporan peningkatan kapasitas aparatur' // Kolom G: Deskripsi / Ringkasan Hasil
  ]);
  exportTableToExcel(rows, filename, 'Pembinaan Aparatur');
}
