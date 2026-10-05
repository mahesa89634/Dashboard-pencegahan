import { InspeksiItem, SocializationRecap, RedkarVolunteer, AparaturMaterial, NspmDocument } from "../types";

// Helper pembuat SVG ilustrasi dokumentasi berkualitas tinggi untuk cetak PDF & layar
const makeDocSvg = (bg1: string, bg2: string, title: string, badge: string, iconType: string): string => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 380" width="100%" height="100%">
    <defs>
      <linearGradient id="g_${badge.replace(/[^a-zA-Z]/g, "")}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${bg1}" />
        <stop offset="100%" stop-color="${bg2}" />
      </linearGradient>
    </defs>
    <rect width="600" height="380" fill="url(#g_${badge.replace(/[^a-zA-Z]/g, "")})" rx="12" />
    <circle cx="300" cy="160" r="75" fill="#ffffff" fill-opacity="0.12" />
    <rect x="25" y="24" width="170" height="30" rx="15" fill="#000000" fill-opacity="0.35" />
    <text x="110" y="44" fill="#ffffff" font-size="12" font-weight="bold" font-family="system-ui, sans-serif" text-anchor="middle">${badge}</text>
    <rect x="0" y="295" width="600" height="85" fill="#090d16" fill-opacity="0.88" />
    <text x="25" y="332" fill="#ffffff" font-size="16" font-weight="bold" font-family="system-ui, sans-serif">${title}</text>
    <text x="25" y="358" fill="#94a3b8" font-size="12" font-family="system-ui, sans-serif">DAMKARMAT KOTA BIMA • DOKUMENTASI RESMI</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

// 1. Data Inspeksi Proteksi Gedung (16 Data Asli Firestore)
export const initialInspeksiList: InspeksiItem[] = [
  {
    "id": "INS-0581",
    "name": "Richeese Factory Bima",
    "date": "2026-07-30",
    "status": "Perlu Perbaikan",
    "address": "Nae, Kec. Rasanae Barat",
    "notes": "Tim tanggap darurat belum terbentuk",
    "image": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 600 380\" width=\"100%\" height=\"100%\"><defs><linearGradient id=\"g\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"100%\"><stop offset=\"0%\" stop-color=\"#b91c1c\"/><stop offset=\"100%\" stop-color=\"#450a0a\"/></linearGradient></defs><rect width=\"600\" height=\"380\" fill=\"url(#g)\" rx=\"12\"/><rect x=\"25\" y=\"24\" width=\"170\" height=\"30\" rx=\"15\" fill=\"%23000\" fill-opacity=\"0.35\"/><text x=\"110\" y=\"44\" fill=\"%23fff\" font-size=\"12\" font-weight=\"bold\" font-family=\"sans-serif\" text-anchor=\"middle\">Perlu Perbaikan</text><rect x=\"0\" y=\"295\" width=\"600\" height=\"85\" fill=\"%23090d16\" fill-opacity=\"0.88\"/><text x=\"25\" y=\"332\" fill=\"%23fff\" font-size=\"16\" font-weight=\"bold\" font-family=\"sans-serif\">Richeese%20Factory%20Bima</text><text x=\"25\" y=\"358\" fill=\"%2394a3b8\" font-size=\"12\" font-family=\"sans-serif\">DAMKARMAT KOTA BIMA • DOKUMENTASI RESMI</text></svg>"
  },
  {
    "id": "INS-1242",
    "name": "RS dr. Agung Kota Bima",
    "date": "2026-01-20",
    "status": "Perlu Perbaikan",
    "address": "Raba",
    "notes": "Asistensi sistem proteksi kebakaran pada bangunan yang akan di bangun",
    "image": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 600 380\" width=\"100%\" height=\"100%\"><defs><linearGradient id=\"g\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"100%\"><stop offset=\"0%\" stop-color=\"#b91c1c\"/><stop offset=\"100%\" stop-color=\"#450a0a\"/></linearGradient></defs><rect width=\"600\" height=\"380\" fill=\"url(#g)\" rx=\"12\"/><rect x=\"25\" y=\"24\" width=\"170\" height=\"30\" rx=\"15\" fill=\"%23000\" fill-opacity=\"0.35\"/><text x=\"110\" y=\"44\" fill=\"%23fff\" font-size=\"12\" font-weight=\"bold\" font-family=\"sans-serif\" text-anchor=\"middle\">Perlu Perbaikan</text><rect x=\"0\" y=\"295\" width=\"600\" height=\"85\" fill=\"%23090d16\" fill-opacity=\"0.88\"/><text x=\"25\" y=\"332\" fill=\"%23fff\" font-size=\"16\" font-weight=\"bold\" font-family=\"sans-serif\">RS%20dr.%20Agung%20Kota%20Bima</text><text x=\"25\" y=\"358\" fill=\"%2394a3b8\" font-size=\"12\" font-family=\"sans-serif\">DAMKARMAT KOTA BIMA • DOKUMENTASI RESMI</text></svg>"
  },
  {
    "id": "INS-2717",
    "name": "Toko Jaya Raya",
    "date": "2026-07-28",
    "status": "Perlu Perbaikan",
    "address": "Sarae, Kec. Rasanae Barat",
    "notes": "Tanda arah keluar dan titik kumpul belum terpasang.\nTim tanggap darurat belum terbentuk",
    "image": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 600 380\" width=\"100%\" height=\"100%\"><defs><linearGradient id=\"g\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"100%\"><stop offset=\"0%\" stop-color=\"#b91c1c\"/><stop offset=\"100%\" stop-color=\"#450a0a\"/></linearGradient></defs><rect width=\"600\" height=\"380\" fill=\"url(#g)\" rx=\"12\"/><rect x=\"25\" y=\"24\" width=\"170\" height=\"30\" rx=\"15\" fill=\"%23000\" fill-opacity=\"0.35\"/><text x=\"110\" y=\"44\" fill=\"%23fff\" font-size=\"12\" font-weight=\"bold\" font-family=\"sans-serif\" text-anchor=\"middle\">Perlu Perbaikan</text><rect x=\"0\" y=\"295\" width=\"600\" height=\"85\" fill=\"%23090d16\" fill-opacity=\"0.88\"/><text x=\"25\" y=\"332\" fill=\"%23fff\" font-size=\"16\" font-weight=\"bold\" font-family=\"sans-serif\">Toko%20Jaya%20Raya</text><text x=\"25\" y=\"358\" fill=\"%2394a3b8\" font-size=\"12\" font-family=\"sans-serif\">DAMKARMAT KOTA BIMA • DOKUMENTASI RESMI</text></svg>"
  },
  {
    "id": "INS-3486",
    "name": "RS PKU Muhammadiyah Bima",
    "date": "2026-07-30",
    "status": "Perlu Perbaikan",
    "address": "Monggonao, Kec. Mpunda",
    "notes": "Pompa kebakaran, Detector dan Alarm kebakaran belum terpasang",
    "image": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 600 380\" width=\"100%\" height=\"100%\"><defs><linearGradient id=\"g\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"100%\"><stop offset=\"0%\" stop-color=\"#b91c1c\"/><stop offset=\"100%\" stop-color=\"#450a0a\"/></linearGradient></defs><rect width=\"600\" height=\"380\" fill=\"url(#g)\" rx=\"12\"/><rect x=\"25\" y=\"24\" width=\"170\" height=\"30\" rx=\"15\" fill=\"%23000\" fill-opacity=\"0.35\"/><text x=\"110\" y=\"44\" fill=\"%23fff\" font-size=\"12\" font-weight=\"bold\" font-family=\"sans-serif\" text-anchor=\"middle\">Perlu Perbaikan</text><rect x=\"0\" y=\"295\" width=\"600\" height=\"85\" fill=\"%23090d16\" fill-opacity=\"0.88\"/><text x=\"25\" y=\"332\" fill=\"%23fff\" font-size=\"16\" font-weight=\"bold\" font-family=\"sans-serif\">RS%20PKU%20Muhammadiyah%20Bima</text><text x=\"25\" y=\"358\" fill=\"%2394a3b8\" font-size=\"12\" font-family=\"sans-serif\">DAMKARMAT KOTA BIMA • DOKUMENTASI RESMI</text></svg>"
  },
  {
    "id": "INS-3632",
    "name": "SPPG Kota Bima Mpunda Lewirato",
    "date": "2026-04-13",
    "status": "Perlu Perbaikan",
    "address": "Lewirato, Kec. Mpunda",
    "notes": "APAR hanya ada 1 buah dan unit tidak ada tekanan.\nTanda titik kumpul tidak terpasang.\nTim tanggap darurat belum terbentuk",
    "image": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 600 380\" width=\"100%\" height=\"100%\"><defs><linearGradient id=\"g\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"100%\"><stop offset=\"0%\" stop-color=\"#b91c1c\"/><stop offset=\"100%\" stop-color=\"#450a0a\"/></linearGradient></defs><rect width=\"600\" height=\"380\" fill=\"url(#g)\" rx=\"12\"/><rect x=\"25\" y=\"24\" width=\"170\" height=\"30\" rx=\"15\" fill=\"%23000\" fill-opacity=\"0.35\"/><text x=\"110\" y=\"44\" fill=\"%23fff\" font-size=\"12\" font-weight=\"bold\" font-family=\"sans-serif\" text-anchor=\"middle\">Perlu Perbaikan</text><rect x=\"0\" y=\"295\" width=\"600\" height=\"85\" fill=\"%23090d16\" fill-opacity=\"0.88\"/><text x=\"25\" y=\"332\" fill=\"%23fff\" font-size=\"16\" font-weight=\"bold\" font-family=\"sans-serif\">SPPG%20Kota%20Bima%20Mpunda%20Lewirato</text><text x=\"25\" y=\"358\" fill=\"%2394a3b8\" font-size=\"12\" font-family=\"sans-serif\">DAMKARMAT KOTA BIMA • DOKUMENTASI RESMI</text></svg>"
  },
  {
    "id": "INS-4127",
    "name": "SPPG Kota Bima Mpunda Mande",
    "date": "2026-04-16",
    "status": "Perlu Perbaikan",
    "address": "Mande, Kec. Mpunda",
    "notes": "Tim tanggap darurat belum terbentuk",
    "image": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 600 380\" width=\"100%\" height=\"100%\"><defs><linearGradient id=\"g\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"100%\"><stop offset=\"0%\" stop-color=\"#b91c1c\"/><stop offset=\"100%\" stop-color=\"#450a0a\"/></linearGradient></defs><rect width=\"600\" height=\"380\" fill=\"url(#g)\" rx=\"12\"/><rect x=\"25\" y=\"24\" width=\"170\" height=\"30\" rx=\"15\" fill=\"%23000\" fill-opacity=\"0.35\"/><text x=\"110\" y=\"44\" fill=\"%23fff\" font-size=\"12\" font-weight=\"bold\" font-family=\"sans-serif\" text-anchor=\"middle\">Perlu Perbaikan</text><rect x=\"0\" y=\"295\" width=\"600\" height=\"85\" fill=\"%23090d16\" fill-opacity=\"0.88\"/><text x=\"25\" y=\"332\" fill=\"%23fff\" font-size=\"16\" font-weight=\"bold\" font-family=\"sans-serif\">SPPG%20Kota%20Bima%20Mpunda%20Mande</text><text x=\"25\" y=\"358\" fill=\"%2394a3b8\" font-size=\"12\" font-family=\"sans-serif\">DAMKARMAT KOTA BIMA • DOKUMENTASI RESMI</text></svg>"
  },
  {
    "id": "INS-4754",
    "name": "SPPG Kota Bima Mpunda Sadia 1",
    "date": "2026-04-13",
    "status": "Perlu Perbaikan",
    "address": "Sadia, Kec. Mpunda",
    "notes": "Tanda arah keluar dan titik kumpul belum terpasang.\nTim tangggap darurat belum terbentuk",
    "image": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 600 380\" width=\"100%\" height=\"100%\"><defs><linearGradient id=\"g\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"100%\"><stop offset=\"0%\" stop-color=\"#b91c1c\"/><stop offset=\"100%\" stop-color=\"#450a0a\"/></linearGradient></defs><rect width=\"600\" height=\"380\" fill=\"url(#g)\" rx=\"12\"/><rect x=\"25\" y=\"24\" width=\"170\" height=\"30\" rx=\"15\" fill=\"%23000\" fill-opacity=\"0.35\"/><text x=\"110\" y=\"44\" fill=\"%23fff\" font-size=\"12\" font-weight=\"bold\" font-family=\"sans-serif\" text-anchor=\"middle\">Perlu Perbaikan</text><rect x=\"0\" y=\"295\" width=\"600\" height=\"85\" fill=\"%23090d16\" fill-opacity=\"0.88\"/><text x=\"25\" y=\"332\" fill=\"%23fff\" font-size=\"16\" font-weight=\"bold\" font-family=\"sans-serif\">SPPG%20Kota%20Bima%20Mpunda%20Sadia%201</text><text x=\"25\" y=\"358\" fill=\"%2394a3b8\" font-size=\"12\" font-family=\"sans-serif\">DAMKARMAT KOTA BIMA • DOKUMENTASI RESMI</text></svg>"
  },
  {
    "id": "INS-5290",
    "name": "SPPG Kota Bima Mpunda Sadia 2",
    "date": "2026-04-13",
    "status": "Perlu Perbaikan",
    "address": "Sadia, Kec. Mpunda",
    "notes": "Tanda arah keluar dan titik kumpul belum terpasang.\nTim tanggap darurat belum terbentuk",
    "image": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 600 380\" width=\"100%\" height=\"100%\"><defs><linearGradient id=\"g\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"100%\"><stop offset=\"0%\" stop-color=\"#b91c1c\"/><stop offset=\"100%\" stop-color=\"#450a0a\"/></linearGradient></defs><rect width=\"600\" height=\"380\" fill=\"url(#g)\" rx=\"12\"/><rect x=\"25\" y=\"24\" width=\"170\" height=\"30\" rx=\"15\" fill=\"%23000\" fill-opacity=\"0.35\"/><text x=\"110\" y=\"44\" fill=\"%23fff\" font-size=\"12\" font-weight=\"bold\" font-family=\"sans-serif\" text-anchor=\"middle\">Perlu Perbaikan</text><rect x=\"0\" y=\"295\" width=\"600\" height=\"85\" fill=\"%23090d16\" fill-opacity=\"0.88\"/><text x=\"25\" y=\"332\" fill=\"%23fff\" font-size=\"16\" font-weight=\"bold\" font-family=\"sans-serif\">SPPG%20Kota%20Bima%20Mpunda%20Sadia%202</text><text x=\"25\" y=\"358\" fill=\"%2394a3b8\" font-size=\"12\" font-family=\"sans-serif\">DAMKARMAT KOTA BIMA • DOKUMENTASI RESMI</text></svg>"
  },
  {
    "id": "INS-5706",
    "name": "SPPG Kota Bima Mpunda Monggonao",
    "date": "2026-04-16",
    "status": "Perlu Perbaikan",
    "address": "Monggonao, Kec. Mpunda",
    "notes": "Tanda arah keluar dan titik kumpul belum terpasang.\nTim tanggap darurat belum terbentuk",
    "image": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 600 380\" width=\"100%\" height=\"100%\"><defs><linearGradient id=\"g\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"100%\"><stop offset=\"0%\" stop-color=\"#b91c1c\"/><stop offset=\"100%\" stop-color=\"#450a0a\"/></linearGradient></defs><rect width=\"600\" height=\"380\" fill=\"url(#g)\" rx=\"12\"/><rect x=\"25\" y=\"24\" width=\"170\" height=\"30\" rx=\"15\" fill=\"%23000\" fill-opacity=\"0.35\"/><text x=\"110\" y=\"44\" fill=\"%23fff\" font-size=\"12\" font-weight=\"bold\" font-family=\"sans-serif\" text-anchor=\"middle\">Perlu Perbaikan</text><rect x=\"0\" y=\"295\" width=\"600\" height=\"85\" fill=\"%23090d16\" fill-opacity=\"0.88\"/><text x=\"25\" y=\"332\" fill=\"%23fff\" font-size=\"16\" font-weight=\"bold\" font-family=\"sans-serif\">SPPG%20Kota%20Bima%20Mpunda%20Monggonao</text><text x=\"25\" y=\"358\" fill=\"%2394a3b8\" font-size=\"12\" font-family=\"sans-serif\">DAMKARMAT KOTA BIMA • DOKUMENTASI RESMI</text></svg>"
  },
  {
    "id": "INS-5980",
    "name": "SPPG Kota Bima Raba Penaraga",
    "date": "2026-04-14",
    "status": "Perlu Perbaikan",
    "address": "Penaraga, Raba",
    "notes": "Tanda arah keluar dan titik kumpul belum terpasang.\nTim tanggap darurat belum terbentuk",
    "image": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 600 380\" width=\"100%\" height=\"100%\"><defs><linearGradient id=\"g\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"100%\"><stop offset=\"0%\" stop-color=\"#b91c1c\"/><stop offset=\"100%\" stop-color=\"#450a0a\"/></linearGradient></defs><rect width=\"600\" height=\"380\" fill=\"url(#g)\" rx=\"12\"/><rect x=\"25\" y=\"24\" width=\"170\" height=\"30\" rx=\"15\" fill=\"%23000\" fill-opacity=\"0.35\"/><text x=\"110\" y=\"44\" fill=\"%23fff\" font-size=\"12\" font-weight=\"bold\" font-family=\"sans-serif\" text-anchor=\"middle\">Perlu Perbaikan</text><rect x=\"0\" y=\"295\" width=\"600\" height=\"85\" fill=\"%23090d16\" fill-opacity=\"0.88\"/><text x=\"25\" y=\"332\" fill=\"%23fff\" font-size=\"16\" font-weight=\"bold\" font-family=\"sans-serif\">SPPG%20Kota%20Bima%20Raba%20Penaraga</text><text x=\"25\" y=\"358\" fill=\"%2394a3b8\" font-size=\"12\" font-family=\"sans-serif\">DAMKARMAT KOTA BIMA • DOKUMENTASI RESMI</text></svg>"
  },
  {
    "id": "INS-6671",
    "name": "Toko Holly Mart",
    "date": "2026-07-28",
    "status": "Perlu Perbaikan",
    "address": "Sarae, Kec. Rasanae Barat",
    "notes": "Jumlah APAR tidak sesuai dengan kebutuhan.\nTanda arah keluar dan titik kumpul belum terpasang.\nTim tanggap darurat belum terbentuk",
    "image": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 600 380\" width=\"100%\" height=\"100%\"><defs><linearGradient id=\"g\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"100%\"><stop offset=\"0%\" stop-color=\"#b91c1c\"/><stop offset=\"100%\" stop-color=\"#450a0a\"/></linearGradient></defs><rect width=\"600\" height=\"380\" fill=\"url(#g)\" rx=\"12\"/><rect x=\"25\" y=\"24\" width=\"170\" height=\"30\" rx=\"15\" fill=\"%23000\" fill-opacity=\"0.35\"/><text x=\"110\" y=\"44\" fill=\"%23fff\" font-size=\"12\" font-weight=\"bold\" font-family=\"sans-serif\" text-anchor=\"middle\">Perlu Perbaikan</text><rect x=\"0\" y=\"295\" width=\"600\" height=\"85\" fill=\"%23090d16\" fill-opacity=\"0.88\"/><text x=\"25\" y=\"332\" fill=\"%23fff\" font-size=\"16\" font-weight=\"bold\" font-family=\"sans-serif\">Toko%20Holly%20Mart</text><text x=\"25\" y=\"358\" fill=\"%2394a3b8\" font-size=\"12\" font-family=\"sans-serif\">DAMKARMAT KOTA BIMA • DOKUMENTASI RESMI</text></svg>"
  },
  {
    "id": "INS-6785",
    "name": "RSUD Bima",
    "date": "2026-07-29",
    "status": "Perlu Perbaikan",
    "address": "Raba",
    "notes": "Pompa Kebakaran belum terpasang",
    "image": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 600 380\" width=\"100%\" height=\"100%\"><defs><linearGradient id=\"g\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"100%\"><stop offset=\"0%\" stop-color=\"#b91c1c\"/><stop offset=\"100%\" stop-color=\"#450a0a\"/></linearGradient></defs><rect width=\"600\" height=\"380\" fill=\"url(#g)\" rx=\"12\"/><rect x=\"25\" y=\"24\" width=\"170\" height=\"30\" rx=\"15\" fill=\"%23000\" fill-opacity=\"0.35\"/><text x=\"110\" y=\"44\" fill=\"%23fff\" font-size=\"12\" font-weight=\"bold\" font-family=\"sans-serif\" text-anchor=\"middle\">Perlu Perbaikan</text><rect x=\"0\" y=\"295\" width=\"600\" height=\"85\" fill=\"%23090d16\" fill-opacity=\"0.88\"/><text x=\"25\" y=\"332\" fill=\"%23fff\" font-size=\"16\" font-weight=\"bold\" font-family=\"sans-serif\">RSUD%20Bima</text><text x=\"25\" y=\"358\" fill=\"%2394a3b8\" font-size=\"12\" font-family=\"sans-serif\">DAMKARMAT KOTA BIMA • DOKUMENTASI RESMI</text></svg>"
  },
  {
    "id": "INS-6852",
    "name": "SPPG Kota Bima Raba Rabadompu Barat 1",
    "date": "2026-04-14",
    "status": "Perlu Perbaikan",
    "address": "Rabadompu Barat, Kec. Raba",
    "notes": "Titik kumpul belum terpasang",
    "image": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 600 380\" width=\"100%\" height=\"100%\"><defs><linearGradient id=\"g\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"100%\"><stop offset=\"0%\" stop-color=\"#b91c1c\"/><stop offset=\"100%\" stop-color=\"#450a0a\"/></linearGradient></defs><rect width=\"600\" height=\"380\" fill=\"url(#g)\" rx=\"12\"/><rect x=\"25\" y=\"24\" width=\"170\" height=\"30\" rx=\"15\" fill=\"%23000\" fill-opacity=\"0.35\"/><text x=\"110\" y=\"44\" fill=\"%23fff\" font-size=\"12\" font-weight=\"bold\" font-family=\"sans-serif\" text-anchor=\"middle\">Perlu Perbaikan</text><rect x=\"0\" y=\"295\" width=\"600\" height=\"85\" fill=\"%23090d16\" fill-opacity=\"0.88\"/><text x=\"25\" y=\"332\" fill=\"%23fff\" font-size=\"16\" font-weight=\"bold\" font-family=\"sans-serif\">SPPG%20Kota%20Bima%20Raba%20Rabadompu%20Barat%201</text><text x=\"25\" y=\"358\" fill=\"%2394a3b8\" font-size=\"12\" font-family=\"sans-serif\">DAMKARMAT KOTA BIMA • DOKUMENTASI RESMI</text></svg>"
  },
  {
    "id": "INS-8096",
    "name": "RSUD Kota Bima",
    "date": "2026-01-22",
    "status": "Perlu Perbaikan",
    "address": "Raba",
    "notes": "Pompa belum dapat beroperasi dikarenakan sumber air belum tersedia sehingga pengujian hanya dilakukan untuk detektor dan alarm kebakaran.",
    "image": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 600 380\" width=\"100%\" height=\"100%\"><defs><linearGradient id=\"g\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"100%\"><stop offset=\"0%\" stop-color=\"#b91c1c\"/><stop offset=\"100%\" stop-color=\"#450a0a\"/></linearGradient></defs><rect width=\"600\" height=\"380\" fill=\"url(#g)\" rx=\"12\"/><rect x=\"25\" y=\"24\" width=\"170\" height=\"30\" rx=\"15\" fill=\"%23000\" fill-opacity=\"0.35\"/><text x=\"110\" y=\"44\" fill=\"%23fff\" font-size=\"12\" font-weight=\"bold\" font-family=\"sans-serif\" text-anchor=\"middle\">Perlu Perbaikan</text><rect x=\"0\" y=\"295\" width=\"600\" height=\"85\" fill=\"%23090d16\" fill-opacity=\"0.88\"/><text x=\"25\" y=\"332\" fill=\"%23fff\" font-size=\"16\" font-weight=\"bold\" font-family=\"sans-serif\">RSUD%20Kota%20Bima</text><text x=\"25\" y=\"358\" fill=\"%2394a3b8\" font-size=\"12\" font-family=\"sans-serif\">DAMKARMAT KOTA BIMA • DOKUMENTASI RESMI</text></svg>"
  },
  {
    "id": "INS-8775",
    "name": "Bank Sinarmas",
    "date": "2026-07-29",
    "status": "Perlu Perbaikan",
    "address": "Karara, Kec. Mpunda",
    "notes": "Tanda arah keluar dan titik kumpul belum terpasang.",
    "image": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 600 380\" width=\"100%\" height=\"100%\"><defs><linearGradient id=\"g\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"100%\"><stop offset=\"0%\" stop-color=\"#b91c1c\"/><stop offset=\"100%\" stop-color=\"#450a0a\"/></linearGradient></defs><rect width=\"600\" height=\"380\" fill=\"url(#g)\" rx=\"12\"/><rect x=\"25\" y=\"24\" width=\"170\" height=\"30\" rx=\"15\" fill=\"%23000\" fill-opacity=\"0.35\"/><text x=\"110\" y=\"44\" fill=\"%23fff\" font-size=\"12\" font-weight=\"bold\" font-family=\"sans-serif\" text-anchor=\"middle\">Perlu Perbaikan</text><rect x=\"0\" y=\"295\" width=\"600\" height=\"85\" fill=\"%23090d16\" fill-opacity=\"0.88\"/><text x=\"25\" y=\"332\" fill=\"%23fff\" font-size=\"16\" font-weight=\"bold\" font-family=\"sans-serif\">Bank%20Sinarmas</text><text x=\"25\" y=\"358\" fill=\"%2394a3b8\" font-size=\"12\" font-family=\"sans-serif\">DAMKARMAT KOTA BIMA • DOKUMENTASI RESMI</text></svg>"
  },
  {
    "id": "INS-9834",
    "name": "RSUD Kota Bima Sesi ke 2",
    "date": "2026-02-24",
    "status": "Aman",
    "address": "Raba",
    "notes": "Sistem Proteksi Kebakaran berfungsi dengan baik",
    "image": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 600 380\" width=\"100%\" height=\"100%\"><defs><linearGradient id=\"g\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"100%\"><stop offset=\"0%\" stop-color=\"#b91c1c\"/><stop offset=\"100%\" stop-color=\"#450a0a\"/></linearGradient></defs><rect width=\"600\" height=\"380\" fill=\"url(#g)\" rx=\"12\"/><rect x=\"25\" y=\"24\" width=\"170\" height=\"30\" rx=\"15\" fill=\"%23000\" fill-opacity=\"0.35\"/><text x=\"110\" y=\"44\" fill=\"%23fff\" font-size=\"12\" font-weight=\"bold\" font-family=\"sans-serif\" text-anchor=\"middle\">Aman</text><rect x=\"0\" y=\"295\" width=\"600\" height=\"85\" fill=\"%23090d16\" fill-opacity=\"0.88\"/><text x=\"25\" y=\"332\" fill=\"%23fff\" font-size=\"16\" font-weight=\"bold\" font-family=\"sans-serif\">RSUD%20Kota%20Bima%20Sesi%20ke%202</text><text x=\"25\" y=\"358\" fill=\"%2394a3b8\" font-size=\"12\" font-family=\"sans-serif\">DAMKARMAT KOTA BIMA • DOKUMENTASI RESMI</text></svg>"
  }
];

// 2. Data Sosialisasi & Edukasi Warga (31 Kegiatan Asli Firestore)
export const initialSocializationRecaps: SocializationRecap[] = [
  {
    "id": "SOC-0029",
    "title": "RA Imam Ahmad Matakando Kota Bima",
    "date": "2026-04-16",
    "location": "Garasi Damkar Kota Bima",
    "participants": 20,
    "speaker": "Rustam Efendi, Yugho Pamungkas",
    "description": "Pengenalan profesi damkar dan peralatannya.\nEdukasi pencegahan kebakaran usia dini.\nKeliling kota Bima menggunakan mobil pemadam",
    "image": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 600 380\" width=\"100%\" height=\"100%\"><defs><linearGradient id=\"g\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"100%\"><stop offset=\"0%\" stop-color=\"#1d4ed8\"/><stop offset=\"100%\" stop-color=\"#1e1b4b\"/></linearGradient></defs><rect width=\"600\" height=\"380\" fill=\"url(#g)\" rx=\"12\"/><rect x=\"25\" y=\"24\" width=\"170\" height=\"30\" rx=\"15\" fill=\"%23000\" fill-opacity=\"0.35\"/><text x=\"110\" y=\"44\" fill=\"%23fff\" font-size=\"12\" font-weight=\"bold\" font-family=\"sans-serif\" text-anchor=\"middle\">PEMBERDAYAAN</text><rect x=\"0\" y=\"295\" width=\"600\" height=\"85\" fill=\"%23090d16\" fill-opacity=\"0.88\"/><text x=\"25\" y=\"332\" fill=\"%23fff\" font-size=\"16\" font-weight=\"bold\" font-family=\"sans-serif\">RA%20Imam%20Ahmad%20Matakando%20Kota%20Bima</text><text x=\"25\" y=\"358\" fill=\"%2394a3b8\" font-size=\"12\" font-family=\"sans-serif\">DAMKARMAT KOTA BIMA • DOKUMENTASI RESMI</text></svg>"
  },
  {
    "id": "SOC-0305",
    "title": "TK NEGERI PEMBINA 03 PARUGA",
    "date": "2026-09-29",
    "location": "Halaman TK Negeri Pembina 03 Paruga",
    "participants": 50,
    "speaker": "Rustam Efendi, Yugho Pamunkas",
    "description": "Pengenalan tugas dan fungsi damkar.\nSosialisasi pencegahan kebakaran usia dini.\nSimulasi pemadaman dan mandi hujan buatan",
    "image": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 600 380\" width=\"100%\" height=\"100%\"><defs><linearGradient id=\"g\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"100%\"><stop offset=\"0%\" stop-color=\"#1d4ed8\"/><stop offset=\"100%\" stop-color=\"#1e1b4b\"/></linearGradient></defs><rect width=\"600\" height=\"380\" fill=\"url(#g)\" rx=\"12\"/><rect x=\"25\" y=\"24\" width=\"170\" height=\"30\" rx=\"15\" fill=\"%23000\" fill-opacity=\"0.35\"/><text x=\"110\" y=\"44\" fill=\"%23fff\" font-size=\"12\" font-weight=\"bold\" font-family=\"sans-serif\" text-anchor=\"middle\">PEMBERDAYAAN</text><rect x=\"0\" y=\"295\" width=\"600\" height=\"85\" fill=\"%23090d16\" fill-opacity=\"0.88\"/><text x=\"25\" y=\"332\" fill=\"%23fff\" font-size=\"16\" font-weight=\"bold\" font-family=\"sans-serif\">TK%20NEGERI%20PEMBINA%2003%20PARUGA</text><text x=\"25\" y=\"358\" fill=\"%2394a3b8\" font-size=\"12\" font-family=\"sans-serif\">DAMKARMAT KOTA BIMA • DOKUMENTASI RESMI</text></svg>"
  },
  {
    "id": "SOC-0451",
    "title": "SD IT Imam Syafi’i Kedo Kota Bima",
    "date": "2026-01-10",
    "location": "Halaman SD IT Imam Syafi’i Kedo Kota Bima",
    "participants": 75,
    "speaker": "Ardi Fiirmansyah",
    "description": "Pengenalan profesi damkar dan edukasi pencegahan kebakaran usia dini. Praktik memadamkan api menggunakan APAR",
    "image": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 600 380\" width=\"100%\" height=\"100%\"><defs><linearGradient id=\"g\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"100%\"><stop offset=\"0%\" stop-color=\"#1d4ed8\"/><stop offset=\"100%\" stop-color=\"#1e1b4b\"/></linearGradient></defs><rect width=\"600\" height=\"380\" fill=\"url(#g)\" rx=\"12\"/><rect x=\"25\" y=\"24\" width=\"170\" height=\"30\" rx=\"15\" fill=\"%23000\" fill-opacity=\"0.35\"/><text x=\"110\" y=\"44\" fill=\"%23fff\" font-size=\"12\" font-weight=\"bold\" font-family=\"sans-serif\" text-anchor=\"middle\">PEMBERDAYAAN</text><rect x=\"0\" y=\"295\" width=\"600\" height=\"85\" fill=\"%23090d16\" fill-opacity=\"0.88\"/><text x=\"25\" y=\"332\" fill=\"%23fff\" font-size=\"16\" font-weight=\"bold\" font-family=\"sans-serif\">SD%20IT%20Imam%20Syafi%E2%80%99i%20Kedo%20Kota%20Bima</text><text x=\"25\" y=\"358\" fill=\"%2394a3b8\" font-size=\"12\" font-family=\"sans-serif\">DAMKARMAT KOTA BIMA • DOKUMENTASI RESMI</text></svg>"
  },
  {
    "id": "SOC-1113",
    "title": "KPPN Bima",
    "date": "2026-07-24",
    "location": "Halaman Kantor KPPN Bima",
    "participants": 30,
    "speaker": "Ardi Firmansyah",
    "description": "Sosialisasi pencegahan dan penanggulangan kebakaran area kantor.\nPraktik  pemadaman menggunakan  APAR",
    "image": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 600 380\" width=\"100%\" height=\"100%\"><defs><linearGradient id=\"g\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"100%\"><stop offset=\"0%\" stop-color=\"#1d4ed8\"/><stop offset=\"100%\" stop-color=\"#1e1b4b\"/></linearGradient></defs><rect width=\"600\" height=\"380\" fill=\"url(#g)\" rx=\"12\"/><rect x=\"25\" y=\"24\" width=\"170\" height=\"30\" rx=\"15\" fill=\"%23000\" fill-opacity=\"0.35\"/><text x=\"110\" y=\"44\" fill=\"%23fff\" font-size=\"12\" font-weight=\"bold\" font-family=\"sans-serif\" text-anchor=\"middle\">PEMBERDAYAAN</text><rect x=\"0\" y=\"295\" width=\"600\" height=\"85\" fill=\"%23090d16\" fill-opacity=\"0.88\"/><text x=\"25\" y=\"332\" fill=\"%23fff\" font-size=\"16\" font-weight=\"bold\" font-family=\"sans-serif\">KPPN%20Bima</text><text x=\"25\" y=\"358\" fill=\"%2394a3b8\" font-size=\"12\" font-family=\"sans-serif\">DAMKARMAT KOTA BIMA • DOKUMENTASI RESMI</text></svg>"
  },
  {
    "id": "SOC-1170",
    "title": "PT. PERTAMINA",
    "date": "2026-02-04",
    "location": "Aula PT. PERTAMINA",
    "participants": 40,
    "speaker": "Ardi Firmansyah",
    "description": "Sosialisasi pencegahan kebakaran pada lingkungan ring 1.\nPenetapan titik kumpul ",
    "image": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 600 380\" width=\"100%\" height=\"100%\"><defs><linearGradient id=\"g\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"100%\"><stop offset=\"0%\" stop-color=\"#1d4ed8\"/><stop offset=\"100%\" stop-color=\"#1e1b4b\"/></linearGradient></defs><rect width=\"600\" height=\"380\" fill=\"url(#g)\" rx=\"12\"/><rect x=\"25\" y=\"24\" width=\"170\" height=\"30\" rx=\"15\" fill=\"%23000\" fill-opacity=\"0.35\"/><text x=\"110\" y=\"44\" fill=\"%23fff\" font-size=\"12\" font-weight=\"bold\" font-family=\"sans-serif\" text-anchor=\"middle\">PEMBERDAYAAN</text><rect x=\"0\" y=\"295\" width=\"600\" height=\"85\" fill=\"%23090d16\" fill-opacity=\"0.88\"/><text x=\"25\" y=\"332\" fill=\"%23fff\" font-size=\"16\" font-weight=\"bold\" font-family=\"sans-serif\">PT.%20PERTAMINA</text><text x=\"25\" y=\"358\" fill=\"%2394a3b8\" font-size=\"12\" font-family=\"sans-serif\">DAMKARMAT KOTA BIMA • DOKUMENTASI RESMI</text></svg>"
  },
  {
    "id": "SOC-1291",
    "title": "TK Asmaul Husna Kota Bima",
    "date": "2026-02-12",
    "location": "Garasi Damkar Kota Bima",
    "participants": 40,
    "speaker": "Rustam Efendi, Yugho Pamungkas",
    "description": "Pengenalan profesi damkar dan peralatannya.\nEdukasi pencegahan kebakaran usia dini.\nKeliling kota Bima menggunakan mobil pemadam",
    "image": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 600 380\" width=\"100%\" height=\"100%\"><defs><linearGradient id=\"g\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"100%\"><stop offset=\"0%\" stop-color=\"#1d4ed8\"/><stop offset=\"100%\" stop-color=\"#1e1b4b\"/></linearGradient></defs><rect width=\"600\" height=\"380\" fill=\"url(#g)\" rx=\"12\"/><rect x=\"25\" y=\"24\" width=\"170\" height=\"30\" rx=\"15\" fill=\"%23000\" fill-opacity=\"0.35\"/><text x=\"110\" y=\"44\" fill=\"%23fff\" font-size=\"12\" font-weight=\"bold\" font-family=\"sans-serif\" text-anchor=\"middle\">PEMBERDAYAAN</text><rect x=\"0\" y=\"295\" width=\"600\" height=\"85\" fill=\"%23090d16\" fill-opacity=\"0.88\"/><text x=\"25\" y=\"332\" fill=\"%23fff\" font-size=\"16\" font-weight=\"bold\" font-family=\"sans-serif\">TK%20Asmaul%20Husna%20Kota%20Bima</text><text x=\"25\" y=\"358\" fill=\"%2394a3b8\" font-size=\"12\" font-family=\"sans-serif\">DAMKARMAT KOTA BIMA • DOKUMENTASI RESMI</text></svg>"
  },
  {
    "id": "SOC-1472",
    "title": "TK Islam Terpadu Al Hikmah Kota Bima",
    "date": "2026-04-23",
    "location": "Garasi Damkar Kota Bima",
    "participants": 40,
    "speaker": "Rustam Efendi, Yugho Pamungkas",
    "description": "Pengenalan profesi damkar dan peralatannya.\nEdukasi pencegahan kebakaran usia dini.\nKeliling kota Bima menggunakan mobil pemadam",
    "image": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 600 380\" width=\"100%\" height=\"100%\"><defs><linearGradient id=\"g\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"100%\"><stop offset=\"0%\" stop-color=\"#1d4ed8\"/><stop offset=\"100%\" stop-color=\"#1e1b4b\"/></linearGradient></defs><rect width=\"600\" height=\"380\" fill=\"url(#g)\" rx=\"12\"/><rect x=\"25\" y=\"24\" width=\"170\" height=\"30\" rx=\"15\" fill=\"%23000\" fill-opacity=\"0.35\"/><text x=\"110\" y=\"44\" fill=\"%23fff\" font-size=\"12\" font-weight=\"bold\" font-family=\"sans-serif\" text-anchor=\"middle\">PEMBERDAYAAN</text><rect x=\"0\" y=\"295\" width=\"600\" height=\"85\" fill=\"%23090d16\" fill-opacity=\"0.88\"/><text x=\"25\" y=\"332\" fill=\"%23fff\" font-size=\"16\" font-weight=\"bold\" font-family=\"sans-serif\">TK%20Islam%20Terpadu%20Al%20Hikmah%20Kota%20Bima</text><text x=\"25\" y=\"358\" fill=\"%2394a3b8\" font-size=\"12\" font-family=\"sans-serif\">DAMKARMAT KOTA BIMA • DOKUMENTASI RESMI</text></svg>"
  },
  {
    "id": "SOC-1958",
    "title": "Kejaksaan Negeri Bima",
    "date": "2026-06-12",
    "location": "Aula dan Halaman Kantor Kejaksaan Negeri Bima",
    "participants": 30,
    "speaker": "Ardi Firmansyah",
    "description": "Sosialisasi pencegahan dan penanggulangan kebakaran area kantor.\nPraktik  pemadaman menggunakan karung goni dan APAR",
    "image": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 600 380\" width=\"100%\" height=\"100%\"><defs><linearGradient id=\"g\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"100%\"><stop offset=\"0%\" stop-color=\"#1d4ed8\"/><stop offset=\"100%\" stop-color=\"#1e1b4b\"/></linearGradient></defs><rect width=\"600\" height=\"380\" fill=\"url(#g)\" rx=\"12\"/><rect x=\"25\" y=\"24\" width=\"170\" height=\"30\" rx=\"15\" fill=\"%23000\" fill-opacity=\"0.35\"/><text x=\"110\" y=\"44\" fill=\"%23fff\" font-size=\"12\" font-weight=\"bold\" font-family=\"sans-serif\" text-anchor=\"middle\">PEMBERDAYAAN</text><rect x=\"0\" y=\"295\" width=\"600\" height=\"85\" fill=\"%23090d16\" fill-opacity=\"0.88\"/><text x=\"25\" y=\"332\" fill=\"%23fff\" font-size=\"16\" font-weight=\"bold\" font-family=\"sans-serif\">Kejaksaan%20Negeri%20Bima</text><text x=\"25\" y=\"358\" fill=\"%2394a3b8\" font-size=\"12\" font-family=\"sans-serif\">DAMKARMAT KOTA BIMA • DOKUMENTASI RESMI</text></svg>"
  },
  {
    "id": "SOC-2002",
    "title": "SD Integral Luqman Al Hakim kota Bima",
    "date": "2026-05-06",
    "location": "Garasi Damkar Kota Bima",
    "participants": 150,
    "speaker": "Ardi Firmansyah",
    "description": "Pengenalan profesi damkar dan peralatannya.\nEdukasi pencegahan kebakaran usia dini.\nKeliling kota Bima menggunakan mobil pemadam",
    "image": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 600 380\" width=\"100%\" height=\"100%\"><defs><linearGradient id=\"g\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"100%\"><stop offset=\"0%\" stop-color=\"#1d4ed8\"/><stop offset=\"100%\" stop-color=\"#1e1b4b\"/></linearGradient></defs><rect width=\"600\" height=\"380\" fill=\"url(#g)\" rx=\"12\"/><rect x=\"25\" y=\"24\" width=\"170\" height=\"30\" rx=\"15\" fill=\"%23000\" fill-opacity=\"0.35\"/><text x=\"110\" y=\"44\" fill=\"%23fff\" font-size=\"12\" font-weight=\"bold\" font-family=\"sans-serif\" text-anchor=\"middle\">PEMBERDAYAAN</text><rect x=\"0\" y=\"295\" width=\"600\" height=\"85\" fill=\"%23090d16\" fill-opacity=\"0.88\"/><text x=\"25\" y=\"332\" fill=\"%23fff\" font-size=\"16\" font-weight=\"bold\" font-family=\"sans-serif\">SD%20Integral%20Luqman%20Al%20Hakim%20kota%20Bima</text><text x=\"25\" y=\"358\" fill=\"%2394a3b8\" font-size=\"12\" font-family=\"sans-serif\">DAMKARMAT KOTA BIMA • DOKUMENTASI RESMI</text></svg>"
  },
  {
    "id": "SOC-2092",
    "title": "TK Integral Yaa Bunayya Kota Bima",
    "date": "2026-05-07",
    "location": "Garasi Damkar Kota Bima",
    "participants": 50,
    "speaker": "Rustam Efendi, Yugho Pamungkas",
    "description": "Pengenalan profesi damkar dan peralatannya.\nEdukasi pencegahan kebakaran usia dini.\nKeliling kota Bima menggunakan mobil pemadam",
    "image": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 600 380\" width=\"100%\" height=\"100%\"><defs><linearGradient id=\"g\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"100%\"><stop offset=\"0%\" stop-color=\"#1d4ed8\"/><stop offset=\"100%\" stop-color=\"#1e1b4b\"/></linearGradient></defs><rect width=\"600\" height=\"380\" fill=\"url(#g)\" rx=\"12\"/><rect x=\"25\" y=\"24\" width=\"170\" height=\"30\" rx=\"15\" fill=\"%23000\" fill-opacity=\"0.35\"/><text x=\"110\" y=\"44\" fill=\"%23fff\" font-size=\"12\" font-weight=\"bold\" font-family=\"sans-serif\" text-anchor=\"middle\">PEMBERDAYAAN</text><rect x=\"0\" y=\"295\" width=\"600\" height=\"85\" fill=\"%23090d16\" fill-opacity=\"0.88\"/><text x=\"25\" y=\"332\" fill=\"%23fff\" font-size=\"16\" font-weight=\"bold\" font-family=\"sans-serif\">TK%20Integral%20Yaa%20Bunayya%20Kota%20Bima</text><text x=\"25\" y=\"358\" fill=\"%2394a3b8\" font-size=\"12\" font-family=\"sans-serif\">DAMKARMAT KOTA BIMA • DOKUMENTASI RESMI</text></svg>"
  },
  {
    "id": "SOC-3087",
    "title": "PENGADILAN NEGERI RABA BIMA",
    "date": "2026-10-02",
    "location": "Halaman Kantor Pengadilan Negeri Raba Bima",
    "participants": 35,
    "speaker": "Ardi Firmansyah",
    "description": "Pelatihan penanggulangan kebakaran dan penggunaan Alat Pemadam Api Ringan (APAR)",
    "image": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 600 380\" width=\"100%\" height=\"100%\"><defs><linearGradient id=\"g\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"100%\"><stop offset=\"0%\" stop-color=\"#1d4ed8\"/><stop offset=\"100%\" stop-color=\"#1e1b4b\"/></linearGradient></defs><rect width=\"600\" height=\"380\" fill=\"url(#g)\" rx=\"12\"/><rect x=\"25\" y=\"24\" width=\"170\" height=\"30\" rx=\"15\" fill=\"%23000\" fill-opacity=\"0.35\"/><text x=\"110\" y=\"44\" fill=\"%23fff\" font-size=\"12\" font-weight=\"bold\" font-family=\"sans-serif\" text-anchor=\"middle\">PEMBERDAYAAN</text><rect x=\"0\" y=\"295\" width=\"600\" height=\"85\" fill=\"%23090d16\" fill-opacity=\"0.88\"/><text x=\"25\" y=\"332\" fill=\"%23fff\" font-size=\"16\" font-weight=\"bold\" font-family=\"sans-serif\">PENGADILAN%20NEGERI%20RABA%20BIMA</text><text x=\"25\" y=\"358\" fill=\"%2394a3b8\" font-size=\"12\" font-family=\"sans-serif\">DAMKARMAT KOTA BIMA • DOKUMENTASI RESMI</text></svg>"
  },
  {
    "id": "SOC-3377",
    "title": "SPBU 54.841.02 PANDA",
    "date": "2026-09-22",
    "location": "Garasi Damkar Kota Bima",
    "participants": 7,
    "speaker": "Yugho Pamungkas",
    "description": "Pelatihan dan penanganan kebakaran untuk operator dan pengawas SPBU.\nPraktik pemadaman menggunakan APAR",
    "image": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 600 380\" width=\"100%\" height=\"100%\"><defs><linearGradient id=\"g\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"100%\"><stop offset=\"0%\" stop-color=\"#1d4ed8\"/><stop offset=\"100%\" stop-color=\"#1e1b4b\"/></linearGradient></defs><rect width=\"600\" height=\"380\" fill=\"url(#g)\" rx=\"12\"/><rect x=\"25\" y=\"24\" width=\"170\" height=\"30\" rx=\"15\" fill=\"%23000\" fill-opacity=\"0.35\"/><text x=\"110\" y=\"44\" fill=\"%23fff\" font-size=\"12\" font-weight=\"bold\" font-family=\"sans-serif\" text-anchor=\"middle\">PEMBERDAYAAN</text><rect x=\"0\" y=\"295\" width=\"600\" height=\"85\" fill=\"%23090d16\" fill-opacity=\"0.88\"/><text x=\"25\" y=\"332\" fill=\"%23fff\" font-size=\"16\" font-weight=\"bold\" font-family=\"sans-serif\">SPBU%2054.841.02%20PANDA</text><text x=\"25\" y=\"358\" fill=\"%2394a3b8\" font-size=\"12\" font-family=\"sans-serif\">DAMKARMAT KOTA BIMA • DOKUMENTASI RESMI</text></svg>"
  },
  {
    "id": "SOC-3449",
    "title": "SPPG Kota Bima Raba Rabadompu Barat 1",
    "date": "2026-04-17",
    "location": "Halaman SPPG Kota Bima Raba Rabadompu Barat 1",
    "participants": 50,
    "speaker": "Ardi Firmansyah",
    "description": "Sosialisasi pencegahan dan penanggulangan kebakaran area dapur.\nPraktik pemadaman mengggunakan karung goni dan APAR",
    "image": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 600 380\" width=\"100%\" height=\"100%\"><defs><linearGradient id=\"g\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"100%\"><stop offset=\"0%\" stop-color=\"#1d4ed8\"/><stop offset=\"100%\" stop-color=\"#1e1b4b\"/></linearGradient></defs><rect width=\"600\" height=\"380\" fill=\"url(#g)\" rx=\"12\"/><rect x=\"25\" y=\"24\" width=\"170\" height=\"30\" rx=\"15\" fill=\"%23000\" fill-opacity=\"0.35\"/><text x=\"110\" y=\"44\" fill=\"%23fff\" font-size=\"12\" font-weight=\"bold\" font-family=\"sans-serif\" text-anchor=\"middle\">PEMBERDAYAAN</text><rect x=\"0\" y=\"295\" width=\"600\" height=\"85\" fill=\"%23090d16\" fill-opacity=\"0.88\"/><text x=\"25\" y=\"332\" fill=\"%23fff\" font-size=\"16\" font-weight=\"bold\" font-family=\"sans-serif\">SPPG%20Kota%20Bima%20Raba%20Rabadompu%20Barat%201</text><text x=\"25\" y=\"358\" fill=\"%2394a3b8\" font-size=\"12\" font-family=\"sans-serif\">DAMKARMAT KOTA BIMA • DOKUMENTASI RESMI</text></svg>"
  },
  {
    "id": "SOC-3462",
    "title": "PAUD Al Muhasin Bima",
    "date": "2026-05-08",
    "location": "Garasi Damkar Kota Bima",
    "participants": 150,
    "speaker": "Ardi Firmansyah, Yugho Pamungkas",
    "description": "Pengenalan profesi damkar dan peralatannya.\nEdukasi pencegahan kebakaran usia dini.\nKeliling kota Bima menggunakan mobil pemadam",
    "image": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 600 380\" width=\"100%\" height=\"100%\"><defs><linearGradient id=\"g\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"100%\"><stop offset=\"0%\" stop-color=\"#1d4ed8\"/><stop offset=\"100%\" stop-color=\"#1e1b4b\"/></linearGradient></defs><rect width=\"600\" height=\"380\" fill=\"url(#g)\" rx=\"12\"/><rect x=\"25\" y=\"24\" width=\"170\" height=\"30\" rx=\"15\" fill=\"%23000\" fill-opacity=\"0.35\"/><text x=\"110\" y=\"44\" fill=\"%23fff\" font-size=\"12\" font-weight=\"bold\" font-family=\"sans-serif\" text-anchor=\"middle\">PEMBERDAYAAN</text><rect x=\"0\" y=\"295\" width=\"600\" height=\"85\" fill=\"%23090d16\" fill-opacity=\"0.88\"/><text x=\"25\" y=\"332\" fill=\"%23fff\" font-size=\"16\" font-weight=\"bold\" font-family=\"sans-serif\">PAUD%20Al%20Muhasin%20Bima</text><text x=\"25\" y=\"358\" fill=\"%2394a3b8\" font-size=\"12\" font-family=\"sans-serif\">DAMKARMAT KOTA BIMA • DOKUMENTASI RESMI</text></svg>"
  },
  {
    "id": "SOC-4367",
    "title": "TK/PAUD Abubakar Ash-Shiddiq Penatoi Kota Bima",
    "date": "2026-09-08",
    "location": "Garasi Damkar Kota Bima",
    "participants": 20,
    "speaker": "Rustam Efendi, Yugho Pamungkas",
    "description": "Pengenalan profesi damkar dan peralatannya.\nEdukasi pencegahan kebakaran usia dini.\nKeliling kota Bima dengan mobil pemadam",
    "image": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 600 380\" width=\"100%\" height=\"100%\"><defs><linearGradient id=\"g\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"100%\"><stop offset=\"0%\" stop-color=\"#1d4ed8\"/><stop offset=\"100%\" stop-color=\"#1e1b4b\"/></linearGradient></defs><rect width=\"600\" height=\"380\" fill=\"url(#g)\" rx=\"12\"/><rect x=\"25\" y=\"24\" width=\"170\" height=\"30\" rx=\"15\" fill=\"%23000\" fill-opacity=\"0.35\"/><text x=\"110\" y=\"44\" fill=\"%23fff\" font-size=\"12\" font-weight=\"bold\" font-family=\"sans-serif\" text-anchor=\"middle\">PEMBERDAYAAN</text><rect x=\"0\" y=\"295\" width=\"600\" height=\"85\" fill=\"%23090d16\" fill-opacity=\"0.88\"/><text x=\"25\" y=\"332\" fill=\"%23fff\" font-size=\"16\" font-weight=\"bold\" font-family=\"sans-serif\">TK%2FPAUD%20Abubakar%20Ash-Shiddiq%20Penatoi%20Kota%20Bima</text><text x=\"25\" y=\"358\" fill=\"%2394a3b8\" font-size=\"12\" font-family=\"sans-serif\">DAMKARMAT KOTA BIMA • DOKUMENTASI RESMI</text></svg>"
  },
  {
    "id": "SOC-4504",
    "title": "PLTMG Bima Semester 2",
    "date": "2026-09-07",
    "location": "Area PLTMG",
    "participants": 30,
    "speaker": "Ardi Firmansyah",
    "description": "Pelatihan dan simulasi tanggap darurat penanganan pemadam kebakaran di lingkungan PLTMG Bima",
    "image": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 600 380\" width=\"100%\" height=\"100%\"><defs><linearGradient id=\"g\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"100%\"><stop offset=\"0%\" stop-color=\"#1d4ed8\"/><stop offset=\"100%\" stop-color=\"#1e1b4b\"/></linearGradient></defs><rect width=\"600\" height=\"380\" fill=\"url(#g)\" rx=\"12\"/><rect x=\"25\" y=\"24\" width=\"170\" height=\"30\" rx=\"15\" fill=\"%23000\" fill-opacity=\"0.35\"/><text x=\"110\" y=\"44\" fill=\"%23fff\" font-size=\"12\" font-weight=\"bold\" font-family=\"sans-serif\" text-anchor=\"middle\">PEMBERDAYAAN</text><rect x=\"0\" y=\"295\" width=\"600\" height=\"85\" fill=\"%23090d16\" fill-opacity=\"0.88\"/><text x=\"25\" y=\"332\" fill=\"%23fff\" font-size=\"16\" font-weight=\"bold\" font-family=\"sans-serif\">PLTMG%20Bima%20Semester%202</text><text x=\"25\" y=\"358\" fill=\"%2394a3b8\" font-size=\"12\" font-family=\"sans-serif\">DAMKARMAT KOTA BIMA • DOKUMENTASI RESMI</text></svg>"
  },
  {
    "id": "SOC-4558",
    "title": "TK Al Iman Melayu Kota Bima",
    "date": "2026-05-05",
    "location": "Garasi Damkar Kota Bima",
    "participants": 65,
    "speaker": "Ardi Firmansyah, Yugho Pamungkas",
    "description": "Pengenalan profesi damkar dan peralatannya.\nEdukasi pencegahan kebakaran usia dini.\nKeliling kota Bima menggunakan mobil pemadam",
    "image": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 600 380\" width=\"100%\" height=\"100%\"><defs><linearGradient id=\"g\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"100%\"><stop offset=\"0%\" stop-color=\"#1d4ed8\"/><stop offset=\"100%\" stop-color=\"#1e1b4b\"/></linearGradient></defs><rect width=\"600\" height=\"380\" fill=\"url(#g)\" rx=\"12\"/><rect x=\"25\" y=\"24\" width=\"170\" height=\"30\" rx=\"15\" fill=\"%23000\" fill-opacity=\"0.35\"/><text x=\"110\" y=\"44\" fill=\"%23fff\" font-size=\"12\" font-weight=\"bold\" font-family=\"sans-serif\" text-anchor=\"middle\">PEMBERDAYAAN</text><rect x=\"0\" y=\"295\" width=\"600\" height=\"85\" fill=\"%23090d16\" fill-opacity=\"0.88\"/><text x=\"25\" y=\"332\" fill=\"%23fff\" font-size=\"16\" font-weight=\"bold\" font-family=\"sans-serif\">TK%20Al%20Iman%20Melayu%20Kota%20Bima</text><text x=\"25\" y=\"358\" fill=\"%2394a3b8\" font-size=\"12\" font-family=\"sans-serif\">DAMKARMAT KOTA BIMA • DOKUMENTASI RESMI</text></svg>"
  },
  {
    "id": "SOC-4982",
    "title": "TK Negeri 18 Manggemaci Kota Bima",
    "date": "2026-04-15",
    "location": "Garasi Damkar Kota Bima",
    "participants": 70,
    "speaker": "Rustam Efendi, Yugho Pamungkas",
    "description": "Pengenalan profesi damkar dan peralatannya.\nEdukasi pencegahan kebakaran usia dini.\nKeliling kota Bima menggunakan mobil pemadam",
    "image": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 600 380\" width=\"100%\" height=\"100%\"><defs><linearGradient id=\"g\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"100%\"><stop offset=\"0%\" stop-color=\"#1d4ed8\"/><stop offset=\"100%\" stop-color=\"#1e1b4b\"/></linearGradient></defs><rect width=\"600\" height=\"380\" fill=\"url(#g)\" rx=\"12\"/><rect x=\"25\" y=\"24\" width=\"170\" height=\"30\" rx=\"15\" fill=\"%23000\" fill-opacity=\"0.35\"/><text x=\"110\" y=\"44\" fill=\"%23fff\" font-size=\"12\" font-weight=\"bold\" font-family=\"sans-serif\" text-anchor=\"middle\">PEMBERDAYAAN</text><rect x=\"0\" y=\"295\" width=\"600\" height=\"85\" fill=\"%23090d16\" fill-opacity=\"0.88\"/><text x=\"25\" y=\"332\" fill=\"%23fff\" font-size=\"16\" font-weight=\"bold\" font-family=\"sans-serif\">TK%20Negeri%2018%20Manggemaci%20Kota%20Bima</text><text x=\"25\" y=\"358\" fill=\"%2394a3b8\" font-size=\"12\" font-family=\"sans-serif\">DAMKARMAT KOTA BIMA • DOKUMENTASI RESMI</text></svg>"
  },
  {
    "id": "SOC-5042",
    "title": "PT BAHAGIA BANGUNNUSA",
    "date": "2026-09-10",
    "location": "Site Proyek Taman Ria",
    "participants": 40,
    "speaker": "Ardi Firmansyah",
    "description": "Pelatihan dan simulasi tanggap darurat kebakaran bagi karyawan dan pekerja proyek pembangunan kolam retensi untuk pengendali banjir kota Bima.",
    "image": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 600 380\" width=\"100%\" height=\"100%\"><defs><linearGradient id=\"g\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"100%\"><stop offset=\"0%\" stop-color=\"#1d4ed8\"/><stop offset=\"100%\" stop-color=\"#1e1b4b\"/></linearGradient></defs><rect width=\"600\" height=\"380\" fill=\"url(#g)\" rx=\"12\"/><rect x=\"25\" y=\"24\" width=\"170\" height=\"30\" rx=\"15\" fill=\"%23000\" fill-opacity=\"0.35\"/><text x=\"110\" y=\"44\" fill=\"%23fff\" font-size=\"12\" font-weight=\"bold\" font-family=\"sans-serif\" text-anchor=\"middle\">PEMBERDAYAAN</text><rect x=\"0\" y=\"295\" width=\"600\" height=\"85\" fill=\"%23090d16\" fill-opacity=\"0.88\"/><text x=\"25\" y=\"332\" fill=\"%23fff\" font-size=\"16\" font-weight=\"bold\" font-family=\"sans-serif\">PT%20BAHAGIA%20BANGUNNUSA</text><text x=\"25\" y=\"358\" fill=\"%2394a3b8\" font-size=\"12\" font-family=\"sans-serif\">DAMKARMAT KOTA BIMA • DOKUMENTASI RESMI</text></svg>"
  },
  {
    "id": "SOC-5421",
    "title": "TK AL WAKEEL KOTA BIMA",
    "date": "2026-09-30",
    "location": "Garasi Damkar Kota Bima",
    "participants": 27,
    "speaker": "Rustam Efendi, Yugho Pamungkas",
    "description": "Pengenalan profesi damkar dan peralatannya.\nEdukasi pencegahan kebakaran usia dini.\nKeliling Kota Bima menggunakan mobil pemadam.",
    "image": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 600 380\" width=\"100%\" height=\"100%\"><defs><linearGradient id=\"g\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"100%\"><stop offset=\"0%\" stop-color=\"#1d4ed8\"/><stop offset=\"100%\" stop-color=\"#1e1b4b\"/></linearGradient></defs><rect width=\"600\" height=\"380\" fill=\"url(#g)\" rx=\"12\"/><rect x=\"25\" y=\"24\" width=\"170\" height=\"30\" rx=\"15\" fill=\"%23000\" fill-opacity=\"0.35\"/><text x=\"110\" y=\"44\" fill=\"%23fff\" font-size=\"12\" font-weight=\"bold\" font-family=\"sans-serif\" text-anchor=\"middle\">PEMBERDAYAAN</text><rect x=\"0\" y=\"295\" width=\"600\" height=\"85\" fill=\"%23090d16\" fill-opacity=\"0.88\"/><text x=\"25\" y=\"332\" fill=\"%23fff\" font-size=\"16\" font-weight=\"bold\" font-family=\"sans-serif\">TK%20AL%20WAKEEL%20KOTA%20BIMA</text><text x=\"25\" y=\"358\" fill=\"%2394a3b8\" font-size=\"12\" font-family=\"sans-serif\">DAMKARMAT KOTA BIMA • DOKUMENTASI RESMI</text></svg>"
  },
  {
    "id": "SOC-6069",
    "title": "BPJS Kesehatan",
    "date": "2026-06-23",
    "location": "Aula dan halaman kantor BPJS Kesehatan",
    "participants": 30,
    "speaker": "Ardi Firmansyah, Yugho Pamungkas",
    "description": "Sosialisasi pencegahan dan penanggulangan kebakaran area kantor.\nPraktik  pemadaman menggunakan  APAR",
    "image": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 600 380\" width=\"100%\" height=\"100%\"><defs><linearGradient id=\"g\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"100%\"><stop offset=\"0%\" stop-color=\"#1d4ed8\"/><stop offset=\"100%\" stop-color=\"#1e1b4b\"/></linearGradient></defs><rect width=\"600\" height=\"380\" fill=\"url(#g)\" rx=\"12\"/><rect x=\"25\" y=\"24\" width=\"170\" height=\"30\" rx=\"15\" fill=\"%23000\" fill-opacity=\"0.35\"/><text x=\"110\" y=\"44\" fill=\"%23fff\" font-size=\"12\" font-weight=\"bold\" font-family=\"sans-serif\" text-anchor=\"middle\">PEMBERDAYAAN</text><rect x=\"0\" y=\"295\" width=\"600\" height=\"85\" fill=\"%23090d16\" fill-opacity=\"0.88\"/><text x=\"25\" y=\"332\" fill=\"%23fff\" font-size=\"16\" font-weight=\"bold\" font-family=\"sans-serif\">BPJS%20Kesehatan</text><text x=\"25\" y=\"358\" fill=\"%2394a3b8\" font-size=\"12\" font-family=\"sans-serif\">DAMKARMAT KOTA BIMA • DOKUMENTASI RESMI</text></svg>"
  },
  {
    "id": "SOC-6576",
    "title": "KSR-PMI unit Universitas Mbojo Bima",
    "date": "2026-01-29",
    "location": "Lapangan Toloweri",
    "participants": 10,
    "speaker": "Rustam Efendi, Yugho Pamungkas, Muhammad Ardyansah",
    "description": "Teori Api, kelas kebakaran dan praktik memadamkan api menggunakan APAR",
    "image": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 600 380\" width=\"100%\" height=\"100%\"><defs><linearGradient id=\"g\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"100%\"><stop offset=\"0%\" stop-color=\"#1d4ed8\"/><stop offset=\"100%\" stop-color=\"#1e1b4b\"/></linearGradient></defs><rect width=\"600\" height=\"380\" fill=\"url(#g)\" rx=\"12\"/><rect x=\"25\" y=\"24\" width=\"170\" height=\"30\" rx=\"15\" fill=\"%23000\" fill-opacity=\"0.35\"/><text x=\"110\" y=\"44\" fill=\"%23fff\" font-size=\"12\" font-weight=\"bold\" font-family=\"sans-serif\" text-anchor=\"middle\">PEMBERDAYAAN</text><rect x=\"0\" y=\"295\" width=\"600\" height=\"85\" fill=\"%23090d16\" fill-opacity=\"0.88\"/><text x=\"25\" y=\"332\" fill=\"%23fff\" font-size=\"16\" font-weight=\"bold\" font-family=\"sans-serif\">KSR-PMI%20unit%20Universitas%20Mbojo%20Bima</text><text x=\"25\" y=\"358\" fill=\"%2394a3b8\" font-size=\"12\" font-family=\"sans-serif\">DAMKARMAT KOTA BIMA • DOKUMENTASI RESMI</text></svg>"
  },
  {
    "id": "SOC-6632",
    "title": "DHARMA WANITA PERSATUAN KOTA BIMA",
    "date": "2026-09-15",
    "location": "Halaman SDN 75 Toloweri, Kel. Nungga",
    "participants": 100,
    "speaker": "Ardi Firmansyah",
    "description": "Sosialisasi edukasi pencegahan dan penanggulangan kebakaran skala rumah tanagga",
    "image": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 600 380\" width=\"100%\" height=\"100%\"><defs><linearGradient id=\"g\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"100%\"><stop offset=\"0%\" stop-color=\"#1d4ed8\"/><stop offset=\"100%\" stop-color=\"#1e1b4b\"/></linearGradient></defs><rect width=\"600\" height=\"380\" fill=\"url(#g)\" rx=\"12\"/><rect x=\"25\" y=\"24\" width=\"170\" height=\"30\" rx=\"15\" fill=\"%23000\" fill-opacity=\"0.35\"/><text x=\"110\" y=\"44\" fill=\"%23fff\" font-size=\"12\" font-weight=\"bold\" font-family=\"sans-serif\" text-anchor=\"middle\">PEMBERDAYAAN</text><rect x=\"0\" y=\"295\" width=\"600\" height=\"85\" fill=\"%23090d16\" fill-opacity=\"0.88\"/><text x=\"25\" y=\"332\" fill=\"%23fff\" font-size=\"16\" font-weight=\"bold\" font-family=\"sans-serif\">DHARMA%20WANITA%20PERSATUAN%20KOTA%20BIMA</text><text x=\"25\" y=\"358\" fill=\"%2394a3b8\" font-size=\"12\" font-family=\"sans-serif\">DAMKARMAT KOTA BIMA • DOKUMENTASI RESMI</text></svg>"
  },
  {
    "id": "SOC-6870",
    "title": "SPPG Kota Bima Raba Rabadompu Barat 2",
    "date": "2026-03-26",
    "location": "Halaman SPPG Kota Bima Raba Rabadompu Barat 2",
    "participants": 40,
    "speaker": "Ardi Firmansyah, Yugho Pamungkas",
    "description": "Sosialisasi pencegahan dan penanggulangan kebakaran area dapur.\nPraktik pemadaman menggunakan karung goni dan APAR",
    "image": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 600 380\" width=\"100%\" height=\"100%\"><defs><linearGradient id=\"g\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"100%\"><stop offset=\"0%\" stop-color=\"#1d4ed8\"/><stop offset=\"100%\" stop-color=\"#1e1b4b\"/></linearGradient></defs><rect width=\"600\" height=\"380\" fill=\"url(#g)\" rx=\"12\"/><rect x=\"25\" y=\"24\" width=\"170\" height=\"30\" rx=\"15\" fill=\"%23000\" fill-opacity=\"0.35\"/><text x=\"110\" y=\"44\" fill=\"%23fff\" font-size=\"12\" font-weight=\"bold\" font-family=\"sans-serif\" text-anchor=\"middle\">PEMBERDAYAAN</text><rect x=\"0\" y=\"295\" width=\"600\" height=\"85\" fill=\"%23090d16\" fill-opacity=\"0.88\"/><text x=\"25\" y=\"332\" fill=\"%23fff\" font-size=\"16\" font-weight=\"bold\" font-family=\"sans-serif\">SPPG%20Kota%20Bima%20Raba%20Rabadompu%20Barat%202</text><text x=\"25\" y=\"358\" fill=\"%2394a3b8\" font-size=\"12\" font-family=\"sans-serif\">DAMKARMAT KOTA BIMA • DOKUMENTASI RESMI</text></svg>"
  },
  {
    "id": "SOC-7078",
    "title": "TK Negeri 08 Penatoi Kota Bima",
    "date": "2026-02-05",
    "location": "Garasi Damkar Kota Bima",
    "participants": 40,
    "speaker": "Rustam Efendi, Yugho Pamungkas",
    "description": "Pengenalan profesi damkar dan peralatannya.\nEdukasi pencegahan kebakaran usia dini.\nKeliling kota Bima menggunakan mobil pemadam",
    "image": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 600 380\" width=\"100%\" height=\"100%\"><defs><linearGradient id=\"g\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"100%\"><stop offset=\"0%\" stop-color=\"#1d4ed8\"/><stop offset=\"100%\" stop-color=\"#1e1b4b\"/></linearGradient></defs><rect width=\"600\" height=\"380\" fill=\"url(#g)\" rx=\"12\"/><rect x=\"25\" y=\"24\" width=\"170\" height=\"30\" rx=\"15\" fill=\"%23000\" fill-opacity=\"0.35\"/><text x=\"110\" y=\"44\" fill=\"%23fff\" font-size=\"12\" font-weight=\"bold\" font-family=\"sans-serif\" text-anchor=\"middle\">PEMBERDAYAAN</text><rect x=\"0\" y=\"295\" width=\"600\" height=\"85\" fill=\"%23090d16\" fill-opacity=\"0.88\"/><text x=\"25\" y=\"332\" fill=\"%23fff\" font-size=\"16\" font-weight=\"bold\" font-family=\"sans-serif\">TK%20Negeri%2008%20Penatoi%20Kota%20Bima</text><text x=\"25\" y=\"358\" fill=\"%2394a3b8\" font-size=\"12\" font-family=\"sans-serif\">DAMKARMAT KOTA BIMA • DOKUMENTASI RESMI</text></svg>"
  },
  {
    "id": "SOC-7439",
    "title": "TK IT Umanaa Wahdah Islamiyah Kota BIma",
    "date": "2026-05-21",
    "location": "Garasi Damkar Kota Bima",
    "participants": 17,
    "speaker": "Rustam Efendi, Yugho Pamungkas",
    "description": "Pengenalan profesi damkar dan peralatannya.\nEdukasi pencegahan kebakaran usia dini.\nKeliling kota Bima menggunakan mobil pemadam",
    "image": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 600 380\" width=\"100%\" height=\"100%\"><defs><linearGradient id=\"g\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"100%\"><stop offset=\"0%\" stop-color=\"#1d4ed8\"/><stop offset=\"100%\" stop-color=\"#1e1b4b\"/></linearGradient></defs><rect width=\"600\" height=\"380\" fill=\"url(#g)\" rx=\"12\"/><rect x=\"25\" y=\"24\" width=\"170\" height=\"30\" rx=\"15\" fill=\"%23000\" fill-opacity=\"0.35\"/><text x=\"110\" y=\"44\" fill=\"%23fff\" font-size=\"12\" font-weight=\"bold\" font-family=\"sans-serif\" text-anchor=\"middle\">PEMBERDAYAAN</text><rect x=\"0\" y=\"295\" width=\"600\" height=\"85\" fill=\"%23090d16\" fill-opacity=\"0.88\"/><text x=\"25\" y=\"332\" fill=\"%23fff\" font-size=\"16\" font-weight=\"bold\" font-family=\"sans-serif\">TK%20IT%20Umanaa%20Wahdah%20Islamiyah%20Kota%20BIma</text><text x=\"25\" y=\"358\" fill=\"%2394a3b8\" font-size=\"12\" font-family=\"sans-serif\">DAMKARMAT KOTA BIMA • DOKUMENTASI RESMI</text></svg>"
  },
  {
    "id": "SOC-8770",
    "title": "PLTMG Bima",
    "date": "2026-04-15",
    "location": "lingkungan PLTMG",
    "participants": 20,
    "speaker": "Ardi Firmansyah",
    "description": "Pelatihan penanganan kebakaran di wilayah PLTMG",
    "image": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 600 380\" width=\"100%\" height=\"100%\"><defs><linearGradient id=\"g\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"100%\"><stop offset=\"0%\" stop-color=\"#1d4ed8\"/><stop offset=\"100%\" stop-color=\"#1e1b4b\"/></linearGradient></defs><rect width=\"600\" height=\"380\" fill=\"url(#g)\" rx=\"12\"/><rect x=\"25\" y=\"24\" width=\"170\" height=\"30\" rx=\"15\" fill=\"%23000\" fill-opacity=\"0.35\"/><text x=\"110\" y=\"44\" fill=\"%23fff\" font-size=\"12\" font-weight=\"bold\" font-family=\"sans-serif\" text-anchor=\"middle\">PEMBERDAYAAN</text><rect x=\"0\" y=\"295\" width=\"600\" height=\"85\" fill=\"%23090d16\" fill-opacity=\"0.88\"/><text x=\"25\" y=\"332\" fill=\"%23fff\" font-size=\"16\" font-weight=\"bold\" font-family=\"sans-serif\">PLTMG%20Bima</text><text x=\"25\" y=\"358\" fill=\"%2394a3b8\" font-size=\"12\" font-family=\"sans-serif\">DAMKARMAT KOTA BIMA • DOKUMENTASI RESMI</text></svg>"
  },
  {
    "id": "SOC-8839",
    "title": "SD Sekolah Alam Al-Qur’an Kota Bima",
    "date": "2026-04-02",
    "location": "Halaman SD Sekolah Alam Al-Quran Kota Bima",
    "participants": 130,
    "speaker": "Ardi Firmansyah, Yugho Pamungkas",
    "description": "Pengenalan profesi damkar.\nEdukasi pencegahan kebakaran usia dini.\nEdukasi penanganan hewan berbahaya.\nPraktik Pemadaman menggunakan APAR",
    "image": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 600 380\" width=\"100%\" height=\"100%\"><defs><linearGradient id=\"g\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"100%\"><stop offset=\"0%\" stop-color=\"#1d4ed8\"/><stop offset=\"100%\" stop-color=\"#1e1b4b\"/></linearGradient></defs><rect width=\"600\" height=\"380\" fill=\"url(#g)\" rx=\"12\"/><rect x=\"25\" y=\"24\" width=\"170\" height=\"30\" rx=\"15\" fill=\"%23000\" fill-opacity=\"0.35\"/><text x=\"110\" y=\"44\" fill=\"%23fff\" font-size=\"12\" font-weight=\"bold\" font-family=\"sans-serif\" text-anchor=\"middle\">PEMBERDAYAAN</text><rect x=\"0\" y=\"295\" width=\"600\" height=\"85\" fill=\"%23090d16\" fill-opacity=\"0.88\"/><text x=\"25\" y=\"332\" fill=\"%23fff\" font-size=\"16\" font-weight=\"bold\" font-family=\"sans-serif\">SD%20Sekolah%20Alam%20Al-Qur%E2%80%99an%20Kota%20Bima</text><text x=\"25\" y=\"358\" fill=\"%2394a3b8\" font-size=\"12\" font-family=\"sans-serif\">DAMKARMAT KOTA BIMA • DOKUMENTASI RESMI</text></svg>"
  },
  {
    "id": "SOC-8915",
    "title": "SDITQ AR-RAHMAN KOTA BIMA",
    "date": "2026-09-30",
    "location": "Garasi Damkar Kota Bima",
    "participants": 35,
    "speaker": "Rustam Efendi, Yugho Pamungkas",
    "description": "Pengenalan profesi damkar dan peralatannya.\nEdukasi pencegahan kebakaran usia dini.\nPraktik pemadaman api dan keliling Kota Bima menggunakan mobil pemadam.",
    "image": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 600 380\" width=\"100%\" height=\"100%\"><defs><linearGradient id=\"g\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"100%\"><stop offset=\"0%\" stop-color=\"#1d4ed8\"/><stop offset=\"100%\" stop-color=\"#1e1b4b\"/></linearGradient></defs><rect width=\"600\" height=\"380\" fill=\"url(#g)\" rx=\"12\"/><rect x=\"25\" y=\"24\" width=\"170\" height=\"30\" rx=\"15\" fill=\"%23000\" fill-opacity=\"0.35\"/><text x=\"110\" y=\"44\" fill=\"%23fff\" font-size=\"12\" font-weight=\"bold\" font-family=\"sans-serif\" text-anchor=\"middle\">PEMBERDAYAAN</text><rect x=\"0\" y=\"295\" width=\"600\" height=\"85\" fill=\"%23090d16\" fill-opacity=\"0.88\"/><text x=\"25\" y=\"332\" fill=\"%23fff\" font-size=\"16\" font-weight=\"bold\" font-family=\"sans-serif\">SDITQ%20AR-RAHMAN%20KOTA%20BIMA</text><text x=\"25\" y=\"358\" fill=\"%2394a3b8\" font-size=\"12\" font-family=\"sans-serif\">DAMKARMAT KOTA BIMA • DOKUMENTASI RESMI</text></svg>"
  },
  {
    "id": "SOC-9581",
    "title": "Dharma Wanita Dinas Damkarmat Kota Bima",
    "date": "2026-05-18",
    "location": "Halaman Damkar Kota Bima",
    "participants": 20,
    "speaker": "Yugho Pamungkas",
    "description": "Edukasi pencegahan dan penanggulangan kebakaran di area rumah.\nPraktik pemadaman menggunakan karung goni",
    "image": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 600 380\" width=\"100%\" height=\"100%\"><defs><linearGradient id=\"g\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"100%\"><stop offset=\"0%\" stop-color=\"#1d4ed8\"/><stop offset=\"100%\" stop-color=\"#1e1b4b\"/></linearGradient></defs><rect width=\"600\" height=\"380\" fill=\"url(#g)\" rx=\"12\"/><rect x=\"25\" y=\"24\" width=\"170\" height=\"30\" rx=\"15\" fill=\"%23000\" fill-opacity=\"0.35\"/><text x=\"110\" y=\"44\" fill=\"%23fff\" font-size=\"12\" font-weight=\"bold\" font-family=\"sans-serif\" text-anchor=\"middle\">PEMBERDAYAAN</text><rect x=\"0\" y=\"295\" width=\"600\" height=\"85\" fill=\"%23090d16\" fill-opacity=\"0.88\"/><text x=\"25\" y=\"332\" fill=\"%23fff\" font-size=\"16\" font-weight=\"bold\" font-family=\"sans-serif\">Dharma%20Wanita%20Dinas%20Damkarmat%20Kota%20Bima</text><text x=\"25\" y=\"358\" fill=\"%2394a3b8\" font-size=\"12\" font-family=\"sans-serif\">DAMKARMAT KOTA BIMA • DOKUMENTASI RESMI</text></svg>"
  },
  {
    "id": "SOC-9631",
    "title": "TK Negeri 13 Monggonao Kota Bima",
    "date": "2026-02-13",
    "location": "Garasi Damkar Kota Bima",
    "participants": 30,
    "speaker": "Rustam Efendi, Yugho Pamungkas",
    "description": "Pengenalan profesi damkar dan peralatannya.\nEdukasi pencegahan kebakaran usia dini.\nKeliling kota Bima menggunakan mobil pemadam",
    "image": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 600 380\" width=\"100%\" height=\"100%\"><defs><linearGradient id=\"g\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"100%\"><stop offset=\"0%\" stop-color=\"#1d4ed8\"/><stop offset=\"100%\" stop-color=\"#1e1b4b\"/></linearGradient></defs><rect width=\"600\" height=\"380\" fill=\"url(#g)\" rx=\"12\"/><rect x=\"25\" y=\"24\" width=\"170\" height=\"30\" rx=\"15\" fill=\"%23000\" fill-opacity=\"0.35\"/><text x=\"110\" y=\"44\" fill=\"%23fff\" font-size=\"12\" font-weight=\"bold\" font-family=\"sans-serif\" text-anchor=\"middle\">PEMBERDAYAAN</text><rect x=\"0\" y=\"295\" width=\"600\" height=\"85\" fill=\"%23090d16\" fill-opacity=\"0.88\"/><text x=\"25\" y=\"332\" fill=\"%23fff\" font-size=\"16\" font-weight=\"bold\" font-family=\"sans-serif\">TK%20Negeri%2013%20Monggonao%20Kota%20Bima</text><text x=\"25\" y=\"358\" fill=\"%2394a3b8\" font-size=\"12\" font-family=\"sans-serif\">DAMKARMAT KOTA BIMA • DOKUMENTASI RESMI</text></svg>"
  }
];

// 3. Data Relawan REDKAR (5 Personil Asli Firestore)
export const initialRedkarVolunteers: RedkarVolunteer[] = [
  {
    "id": "RED-2314",
    "name": "ARYS MUNANDAR",
    "subdistrict": "Pane",
    "phone": "082340773223",
    "role": "Petugas Penyelamat",
    "status": "Siaga",
    "joinDate": "10 Jun 2026",
    "image": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 600 380\" width=\"100%\" height=\"100%\"><defs><linearGradient id=\"g\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"100%\"><stop offset=\"0%\" stop-color=\"#d97706\"/><stop offset=\"100%\" stop-color=\"#78350f\"/></linearGradient></defs><rect width=\"600\" height=\"380\" fill=\"url(#g)\" rx=\"12\"/><rect x=\"25\" y=\"24\" width=\"170\" height=\"30\" rx=\"15\" fill=\"%23000\" fill-opacity=\"0.35\"/><text x=\"110\" y=\"44\" fill=\"%23fff\" font-size=\"12\" font-weight=\"bold\" font-family=\"sans-serif\" text-anchor=\"middle\">Siaga</text><rect x=\"0\" y=\"295\" width=\"600\" height=\"85\" fill=\"%23090d16\" fill-opacity=\"0.88\"/><text x=\"25\" y=\"332\" fill=\"%23fff\" font-size=\"16\" font-weight=\"bold\" font-family=\"sans-serif\">ARYS%20MUNANDAR</text><text x=\"25\" y=\"358\" fill=\"%2394a3b8\" font-size=\"12\" font-family=\"sans-serif\">DAMKARMAT KOTA BIMA • DOKUMENTASI RESMI</text></svg>"
  },
  {
    "id": "RED-3860",
    "name": "MUAMAR KADAFI",
    "subdistrict": "Pane",
    "phone": "085338847784",
    "role": "Petugas Penyelamat",
    "status": "Siaga",
    "joinDate": "10 Jun 2026",
    "image": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 600 380\" width=\"100%\" height=\"100%\"><defs><linearGradient id=\"g\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"100%\"><stop offset=\"0%\" stop-color=\"#d97706\"/><stop offset=\"100%\" stop-color=\"#78350f\"/></linearGradient></defs><rect width=\"600\" height=\"380\" fill=\"url(#g)\" rx=\"12\"/><rect x=\"25\" y=\"24\" width=\"170\" height=\"30\" rx=\"15\" fill=\"%23000\" fill-opacity=\"0.35\"/><text x=\"110\" y=\"44\" fill=\"%23fff\" font-size=\"12\" font-weight=\"bold\" font-family=\"sans-serif\" text-anchor=\"middle\">Siaga</text><rect x=\"0\" y=\"295\" width=\"600\" height=\"85\" fill=\"%23090d16\" fill-opacity=\"0.88\"/><text x=\"25\" y=\"332\" fill=\"%23fff\" font-size=\"16\" font-weight=\"bold\" font-family=\"sans-serif\">MUAMAR%20KADAFI</text><text x=\"25\" y=\"358\" fill=\"%2394a3b8\" font-size=\"12\" font-family=\"sans-serif\">DAMKARMAT KOTA BIMA • DOKUMENTASI RESMI</text></svg>"
  },
  {
    "id": "RED-6037",
    "name": "M. TAUFIKURRAHMAN",
    "subdistrict": "Pane",
    "phone": "085338291935",
    "role": "Petugas Penyelamat",
    "status": "Siaga",
    "joinDate": "10 Jun 2026",
    "image": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 600 380\" width=\"100%\" height=\"100%\"><defs><linearGradient id=\"g\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"100%\"><stop offset=\"0%\" stop-color=\"#d97706\"/><stop offset=\"100%\" stop-color=\"#78350f\"/></linearGradient></defs><rect width=\"600\" height=\"380\" fill=\"url(#g)\" rx=\"12\"/><rect x=\"25\" y=\"24\" width=\"170\" height=\"30\" rx=\"15\" fill=\"%23000\" fill-opacity=\"0.35\"/><text x=\"110\" y=\"44\" fill=\"%23fff\" font-size=\"12\" font-weight=\"bold\" font-family=\"sans-serif\" text-anchor=\"middle\">Siaga</text><rect x=\"0\" y=\"295\" width=\"600\" height=\"85\" fill=\"%23090d16\" fill-opacity=\"0.88\"/><text x=\"25\" y=\"332\" fill=\"%23fff\" font-size=\"16\" font-weight=\"bold\" font-family=\"sans-serif\">M.%20TAUFIKURRAHMAN</text><text x=\"25\" y=\"358\" fill=\"%2394a3b8\" font-size=\"12\" font-family=\"sans-serif\">DAMKARMAT KOTA BIMA • DOKUMENTASI RESMI</text></svg>"
  },
  {
    "id": "RED-8379",
    "name": "DAMAR WULAN PUTRI",
    "subdistrict": "Pane",
    "phone": "085337833060",
    "role": "Petugas Penyelamat",
    "status": "Siaga",
    "joinDate": "10 Jun 2026",
    "image": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 600 380\" width=\"100%\" height=\"100%\"><defs><linearGradient id=\"g\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"100%\"><stop offset=\"0%\" stop-color=\"#d97706\"/><stop offset=\"100%\" stop-color=\"#78350f\"/></linearGradient></defs><rect width=\"600\" height=\"380\" fill=\"url(#g)\" rx=\"12\"/><rect x=\"25\" y=\"24\" width=\"170\" height=\"30\" rx=\"15\" fill=\"%23000\" fill-opacity=\"0.35\"/><text x=\"110\" y=\"44\" fill=\"%23fff\" font-size=\"12\" font-weight=\"bold\" font-family=\"sans-serif\" text-anchor=\"middle\">Siaga</text><rect x=\"0\" y=\"295\" width=\"600\" height=\"85\" fill=\"%23090d16\" fill-opacity=\"0.88\"/><text x=\"25\" y=\"332\" fill=\"%23fff\" font-size=\"16\" font-weight=\"bold\" font-family=\"sans-serif\">DAMAR%20WULAN%20PUTRI</text><text x=\"25\" y=\"358\" fill=\"%2394a3b8\" font-size=\"12\" font-family=\"sans-serif\">DAMKARMAT KOTA BIMA • DOKUMENTASI RESMI</text></svg>"
  },
  {
    "id": "RED-8970",
    "name": "IMAM ISKANDAR",
    "subdistrict": "Pane",
    "phone": "085237356280",
    "role": "Petugas Penyelamat",
    "status": "Siaga",
    "joinDate": "10 Jun 2026",
    "image": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 600 380\" width=\"100%\" height=\"100%\"><defs><linearGradient id=\"g\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"100%\"><stop offset=\"0%\" stop-color=\"#d97706\"/><stop offset=\"100%\" stop-color=\"#78350f\"/></linearGradient></defs><rect width=\"600\" height=\"380\" fill=\"url(#g)\" rx=\"12\"/><rect x=\"25\" y=\"24\" width=\"170\" height=\"30\" rx=\"15\" fill=\"%23000\" fill-opacity=\"0.35\"/><text x=\"110\" y=\"44\" fill=\"%23fff\" font-size=\"12\" font-weight=\"bold\" font-family=\"sans-serif\" text-anchor=\"middle\">Siaga</text><rect x=\"0\" y=\"295\" width=\"600\" height=\"85\" fill=\"%23090d16\" fill-opacity=\"0.88\"/><text x=\"25\" y=\"332\" fill=\"%23fff\" font-size=\"16\" font-weight=\"bold\" font-family=\"sans-serif\">IMAM%20ISKANDAR</text><text x=\"25\" y=\"358\" fill=\"%2394a3b8\" font-size=\"12\" font-family=\"sans-serif\">DAMKARMAT KOTA BIMA • DOKUMENTASI RESMI</text></svg>"
  }
];

// 4. Data Pembinaan Aparatur DAMKARMAT (3 Materi Asli Firestore)
export const aparaturMaterials: AparaturMaterial[] = [
  {
    "id": "AP-3833",
    "title": "Pelatihan Formasi Regu",
    "category": "Pembinaan Aparatur Kebakaran",
    "date": "2026-04-30",
    "description": "Standardisasi Ketangkasan: Menyamakan teknik pengoperasian alat pemadam, penggunaan APD, dan prosedur keselamatan diri bagi seluruh personel regu.\n\nPenguatan Fungsi Regu: Memastikan setiap individu mampu menjalankan peran teknis pemadaman secara profesional saat berada di lokasi kebakaran.\n\nJaminan Keselamatan Kerja: Memberikan perlindungan maksimal bagi petugas melalui pemahaman prosedur K3 yang tepat saat menghadapi situasi darurat.",
    "shortDesc": "Standardisasi Ketangkasan: Menyamakan teknik pengoperasian alat pemadam, penggunaan APD, dan prosedu",
    "image": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 600 380\" width=\"100%\" height=\"100%\"><defs><linearGradient id=\"g\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"100%\"><stop offset=\"0%\" stop-color=\"#059669\"/><stop offset=\"100%\" stop-color=\"#064e3b\"/></linearGradient></defs><rect width=\"600\" height=\"380\" fill=\"url(#g)\" rx=\"12\"/><rect x=\"25\" y=\"24\" width=\"170\" height=\"30\" rx=\"15\" fill=\"%23000\" fill-opacity=\"0.35\"/><text x=\"110\" y=\"44\" fill=\"%23fff\" font-size=\"12\" font-weight=\"bold\" font-family=\"sans-serif\" text-anchor=\"middle\">APARATUR</text><rect x=\"0\" y=\"295\" width=\"600\" height=\"85\" fill=\"%23090d16\" fill-opacity=\"0.88\"/><text x=\"25\" y=\"332\" fill=\"%23fff\" font-size=\"16\" font-weight=\"bold\" font-family=\"sans-serif\">Pelatihan%20Formasi%20Regu</text><text x=\"25\" y=\"358\" fill=\"%2394a3b8\" font-size=\"12\" font-family=\"sans-serif\">DAMKARMAT KOTA BIMA • DOKUMENTASI RESMI</text></svg>"
  },
  {
    "id": "AP-5167",
    "title": "Pelatihan Vertical Rescue",
    "category": "Pembinaan Aparatur Pencarian dan Pertolongan",
    "date": "2026-08-27",
    "description": "Pengenalan dan Penguasaan Alat: Memahami karakteristik, fungsi, serta cara inspeksi yang benar terhadap berbagai peralatan pendukung vertical rescue (seperti harness, carabiner, tali kernmantle, dan alat geser tali).\n\nPraktik Evakuasi Ketinggian: Melatih keterampilan teknis seluruh pasukan dalam melakukan prosedur anchoring, sistem pengamanan, hingga teknik menurunkan korban dari atas gedung dengan membawa tandu secara aman.\n\nPeningkatan Kesiapan Operasional: Memastikan seluruh anggota regu memiliki kompetensi dan kesiapan mental yang matang saat diterjunkan dalam penanganan kondisi membahayakan manusia di medan vertikal.",
    "shortDesc": "Pengenalan dan Penguasaan Alat: Memahami karakteristik, fungsi, serta cara inspeksi yang benar terha",
    "image": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 600 380\" width=\"100%\" height=\"100%\"><defs><linearGradient id=\"g\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"100%\"><stop offset=\"0%\" stop-color=\"#059669\"/><stop offset=\"100%\" stop-color=\"#064e3b\"/></linearGradient></defs><rect width=\"600\" height=\"380\" fill=\"url(#g)\" rx=\"12\"/><rect x=\"25\" y=\"24\" width=\"170\" height=\"30\" rx=\"15\" fill=\"%23000\" fill-opacity=\"0.35\"/><text x=\"110\" y=\"44\" fill=\"%23fff\" font-size=\"12\" font-weight=\"bold\" font-family=\"sans-serif\" text-anchor=\"middle\">APARATUR</text><rect x=\"0\" y=\"295\" width=\"600\" height=\"85\" fill=\"%23090d16\" fill-opacity=\"0.88\"/><text x=\"25\" y=\"332\" fill=\"%23fff\" font-size=\"16\" font-weight=\"bold\" font-family=\"sans-serif\">Pelatihan%20Vertical%20Rescue</text><text x=\"25\" y=\"358\" fill=\"%2394a3b8\" font-size=\"12\" font-family=\"sans-serif\">DAMKARMAT KOTA BIMA • DOKUMENTASI RESMI</text></svg>"
  },
  {
    "id": "AP-8802",
    "title": "Dasar-dasar Pemadam Kebakaran",
    "category": "Pembinaan Aparatur Kebakaran",
    "date": "2026-01-21",
    "description": "Memberikan pemahaman mendalam mengenai tugas pokok dan fungsi pemadam kebakaran (bukan sekadar memadamkan api).\nMenjelaskan prinsip-prinsip terjadinya api (Segitiga Api) agar personil mampu menentukan metode pemadaman yang tepat.\nMengenalkan klasifikasi kebakaran untuk menghindari kesalahan penggunaan media pemadam (salah media = fatal).\nMeningkatkan kedisiplinan dan mentalitas aparatur.",
    "shortDesc": "Memberikan pemahaman mendalam mengenai tugas pokok dan fungsi pemadam kebakaran (bukan sekadar memad",
    "image": "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 600 380\" width=\"100%\" height=\"100%\"><defs><linearGradient id=\"g\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"100%\"><stop offset=\"0%\" stop-color=\"#059669\"/><stop offset=\"100%\" stop-color=\"#064e3b\"/></linearGradient></defs><rect width=\"600\" height=\"380\" fill=\"url(#g)\" rx=\"12\"/><rect x=\"25\" y=\"24\" width=\"170\" height=\"30\" rx=\"15\" fill=\"%23000\" fill-opacity=\"0.35\"/><text x=\"110\" y=\"44\" fill=\"%23fff\" font-size=\"12\" font-weight=\"bold\" font-family=\"sans-serif\" text-anchor=\"middle\">APARATUR</text><rect x=\"0\" y=\"295\" width=\"600\" height=\"85\" fill=\"%23090d16\" fill-opacity=\"0.88\"/><text x=\"25\" y=\"332\" fill=\"%23fff\" font-size=\"16\" font-weight=\"bold\" font-family=\"sans-serif\">Dasar-dasar%20Pemadam%20Kebakaran</text><text x=\"25\" y=\"358\" fill=\"%2394a3b8\" font-size=\"12\" font-family=\"sans-serif\">DAMKARMAT KOTA BIMA • DOKUMENTASI RESMI</text></svg>"
  }
];

// 5. Data Regulasi & Standarisasi NSPM (2 Dokumen Asli Firestore)
export const nspmDocuments: NspmDocument[] = [
  {
    "id": "NSPM-2786",
    "title": "Modul Edukasi Pencegahan Kebakaran",
    "category": "MANUAL",
    "code": "MANUAL-2786",
    "summary": "Modul ini merupakan panduan komprehensif yang disusun untuk membekali masyarakat dengan pengetahuan dasar pencegahan dan penanggulangan dini bahaya kebakaran. Fokus utamanya mencakup identifikasi potensi bahaya sehari-hari, cara penggunaan alat pemadam dasar, dan prosedur penyelamatan jiwa (life safety)",
    "driveUrl": "https://drive.google.com/file/d/1PNcFVX8L2NIMoq-U-v10fABOxmc74Zli/view?usp=drivesdk"
  },
  {
    "id": "NSPM-8285",
    "title": "Standar Nasional Indonesia",
    "category": "STANDAR",
    "code": "STANDAR-8285",
    "summary": "03-1745-2000   (PIPA TEGAK),     \n03-3989-2000   (SPRINKLER),  \n03-6570-2001   (POMPA),  \n03-3987-1995    (APAR),  \n03-3985-2000  (SISTEM DETEKSI DAN ALARAM),  \n03-6571-2001    (PENGENDALI ASAP),  \n03-1746-2000   (SARANA JLN KELUAR),   \n03-1735-2000   (AKSES BANGUNAN DAN LINGKUNGAN),  \n03-1736-2000    (PROTEKSI PASIF),   \n03-6574-2001      (PENCAHAYAAN DARURAT).",
    "driveUrl": "https://drive.google.com/drive/folders/1-Vg_eP7eSOK-ZN8-4ZfDOoksI4meNb0_"
  }
];
