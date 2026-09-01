import { InspeksiItem, SocializationRecap, RedkarVolunteer, AparaturMaterial, NspmDocument } from '../types';

export const initialInspeksiList: InspeksiItem[] = [
  {
    id: 'INS-01',
    name: 'SPPG Rabadompu Barat',
    date: '10 Jun 2026',
    status: 'Perlu Perbaikan',
    address: 'Jl. Rendi No. 24, Rabadompu Barat, Kec. Raba, Kota Bima',
    notes: 'Beberapa APAR kedaluwarsa sejak April 2026. Jalur evakuasi terhalang tumpukan logistik.',
    image: 'https://images.unsplash.com/photo-1618042164219-62c820f10723?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'INS-02',
    name: 'Pasar Raya Bima',
    date: '05 Jun 2026',
    status: 'Kritis',
    address: 'Kawasan Niaga Kelurahan Sarae, Kec. Rasanae Barat, Kota Bima',
    notes: 'Sistem sprinkler otomatis tidak berfungsi. Pompa pemadam utama dalam kondisi mati. Hidran kota terdekat tertutup oleh lapak pedagang kaki lima.',
    image: 'https://images.unsplash.com/photo-1516216628859-9bccecad13ec?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'INS-03',
    name: 'RSUD Kota Bima',
    date: '01 Jun 2026',
    status: 'Aman',
    address: 'Jl. Mujair No. 8, Kelurahan Nae, Kec. Rasanae Barat, Kota Bima',
    notes: 'Seluruh APAR berfungsi baik. Sistem fire alarm aktif dan diuji secara berkala. Fire escape bertanda jelas.',
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'INS-04',
    name: 'Kantor Walikota Bima',
    date: '28 Mei 2026',
    status: 'Aman',
    address: 'Jl. Soekarno-Hatta, Kec. Mpunda, Kota Bima',
    notes: 'Hidran halaman berfungsi dengan tekanan stabil 5 bar. Jalur evakuasi bebas hambatan.',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80'
  }
];

export const initialSocializationRecaps: SocializationRecap[] = [
  {
    id: 'SOC-01',
    title: 'Edukasi Dapur Aman MBG',
    date: '08 Jun 2026',
    location: 'Areal Kantor Kelurahan Rasingae, Kec. Asakota',
    participants: 45,
    speaker: 'Komandan Regu I, Damkar Kota Bima',
    description: 'Pelatihan mitigasi kebocoran tabung LPG 3kg dan 12kg untuk ibu-ibu rumah tangga dan pelaku UMKM kuliner. Memberikan praktek penggunaan handuk basah dan APAR jenis CO2 secara langsung.',
    image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'SOC-02',
    title: "Sosialisasi TK Imam Syafi'i",
    date: '02 Jun 2026',
    location: 'Aula PAUD/TK Imam Syafi\'i, Kelurahan Pane, Kec. Rasanae Barat',
    participants: 60,
    speaker: 'Kasi Edukasi & Penyuluhan Damkarmat',
    description: 'Pengenalan profesi pemadam kebakaran untuk anak usia dini (Damkar Goes to School). Edukasi interaktif melalui lagu pemadam, simulasi evakuasi ramah anak, dan kesempatan menumpangi mobil pemadam kebakaran.',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'SOC-03',
    title: 'Kolaborasi PT. FIF Group',
    date: '28 Mei 2026',
    location: 'Gedung Pertemuan FIF Group Bima, Jl. Gajah Mada',
    participants: 25,
    speaker: 'Kabid Pencegahan Proteksi Kebakaran',
    description: 'Sosialisasi tanggap darurat kantor bersama karyawan PT. FIF Group Bima. Audit internal sarana proteksi gedung kantor, pembentukan Tim K-3 Internal Kantor, serta uji coba hydrant gedung.',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80'
  }
];

export const initialRedkarVolunteers: RedkarVolunteer[] = [
  {
    id: 'RED-001',
    name: 'Ahmad Rifai',
    subdistrict: 'Asakota',
    phone: '0823-4567-8901',
    role: 'Koordinator Lapangan',
    status: 'Aktif',
    joinDate: '12 Jan 2025',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'RED-002',
    name: 'Siti Rahmah',
    subdistrict: 'Raba',
    phone: '0852-9876-5432',
    role: 'Petugas Penyuluhan',
    status: 'Siaga',
    joinDate: '01 Mar 2025',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'RED-003',
    name: 'Budi Santoso',
    subdistrict: 'Rasanae Barat',
    phone: '0819-1122-3344',
    role: 'Teknisi APAR & Hidran',
    status: 'Pelatihan',
    joinDate: '15 Mei 2026',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'RED-004',
    name: 'Irwan Wahyudi',
    subdistrict: 'Mpunda',
    phone: '0878-4455-6677',
    role: 'Petugas Penyelamat',
    status: 'Aktif',
    joinDate: '10 Feb 2025',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80'
  }
];

export const aparaturMaterials: AparaturMaterial[] = [
  {
    id: 'AP-01',
    title: 'Penerapan Core Values BerAKHLAK',
    category: 'Penerapan Core Values BerAKHLAK',
    shortDesc: 'Pedoman integritas dan akhlak aparatur sipil negara di lingkungan Damkarmat Kota Bima.',
    content: [
      'Berorientasi Pelayanan: Memberikan respon tanggap darurat yang ramah, santun, cepat, dan akurat demi menyelamatkan jiwa warga Kota Bima.',
      'Akuntabel: Menjaga integritas dalam melakukan inspeksi keselamatan gedung. Dilarang keras menerima gratifikasi atau pungutan liar dalam pelunasan retribusi proteksi.',
      'Kompeten: Terus belajar meningkatkan keahlian taktis pemadaman, penyelamatan vertikal (vertical rescue), dan penanganan bahan berbahaya (hazmat).',
      'Harmonis: Tidak membeda-bedakan suku, agama, ras, maupun status sosial dalam melaksanakan operasi darurat pemadam kebakaran.',
      'Loyal: Setia pada Pancasila, UUD 1945, dan menjaga kehormatan korps Damkarmat dalam tugas shift malam ataupun hari raya.',
      'Adaptif: Membuka diri terhadap kemajuan teknologi pemantauan sensor kebakaran cerdas dan mahir menggunakan sistem input data digital.',
      'Kolaboratif: Membangun sinergi aktif dengan Satpol PP, kepolisian, tim medis puskesmas, serta relawan pemadam kebakaran binaan (REDKAR).'
    ],
    tips: [
      'Lakukan apel pagi rutin untuk menyelaraskan komitmen nilai BerAKHLAK.',
      'Catat setiap tindak tanduk penugasan dengan jujur pada laporan harian.'
    ]
  },
  {
    id: 'AP-02',
    title: 'Target SKP (Sasaran Kinerja Pegawai)',
    category: 'Target SKP',
    shortDesc: 'Indikator kinerja strategis aparatur Damkarmat Kota Bima tahun 2026.',
    content: [
      'Respon Time (Waktu Tanggap): Memastikan waktu respon sejak panggilan darurat diterima hingga armada pemadam tiba di titik lokasi kebakaran adalah di bawah 15 menit.',
      'Rasio Inspeksi Proteksi: Melakukan inspeksi proteksi kebakaran berkala di minimal 35 bangunan publik/pasar kategorial di Kota Bima setiap tahunnya.',
      'Pemberdayaan Masyarakat: Memfasilitasi edukasi mitigasi dwi-mingguan di tingkat rukun tetangga, sekolah, maupun entitas swasta Kota Bima.',
      'Pengembangan Kompetensi: Mengikuti minimal 20 jam pelajaran pelatihan teknis profesional pemadaman dwi-semester.'
    ],
    tips: [
      'Isi form isian SKP di aplikasi e-Kinerja BPN secara mingguan.',
      'Koordinasikan pemetaan hidran terdekat dengan tim sebelum inspeksi untuk melengkapi laporan SKP.'
    ]
  }
];

export const nspmDocuments: NspmDocument[] = [
  {
    id: 'NSPM-01',
    title: 'Peraturan Daerah Kota Bima No. 4 Tentang Penyelenggaraan Damkar',
    category: 'Norma',
    code: 'PERDA-04',
    summary: 'Landasan hukum utama pembentukan Dinas Damkarmat, sanksi bagi pengelola gedung yang lalai, serta pembagian zona perlindungan kebakaran di Kota Bima.',
    fileSize: '3.4 MB'
  },
  {
    id: 'NSPM-02',
    title: 'Standar Teknis Instalasi Hidran Kebakaran Kota & Gedung',
    category: 'Standar',
    code: 'ST-HIDRAN-02',
    summary: 'Spesifikasi diameter selang hidran, tata letak pilar hidran kota, debit minimum suplai tangki air, dan standar koneksi penutup adaptor hidran Indonesia.',
    fileSize: '1.8 MB'
  },
  {
    id: 'NSPM-03',
    title: 'Prosedur Tetap Operasi Pemadaman Kebakaran Pemukiman Padat',
    category: 'Prosedur',
    code: 'PROTAP-PADAT',
    summary: 'Metode penggelaran selang estafet pada gang-gang sempit Kota Bima, manajemen koordinasi suplai air tangki cadangan, dan protokol penyelamatan korban.',
    fileSize: '2.1 MB'
  },
  {
    id: 'NSPM-04',
    title: 'Manual Pengujian dan Pemeliharaan APAR Gedung Komersial',
    category: 'Manual',
    code: 'MANUAL-APAR',
    summary: 'Panduan inspeksi visual bulanan, indikator tekanan manometer, masa kadaluwarsa bubuk kimia kering, serta teknik penempatan tanda gantung inspeksi.',
    fileSize: '1.2 MB'
  }
];
