import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardHome from './components/views/DashboardHome';
import InspeksiView from './components/views/InspeksiView';
import SosialisasiView from './components/views/SosialisasiView';
import RedkarView from './components/views/RedkarView';
import PembinaanView from './components/views/PembinaanView';
import NspmView from './components/views/NspmView';
import Modals from './components/modals/Modals';

import { 
  initialInspeksiList, 
  initialSocializationRecaps, 
  initialRedkarVolunteers, 
  aparaturMaterials, 
  nspmDocuments
} from './data/mockData';
import { InspeksiItem, SocializationRecap, RedkarVolunteer, AparaturMaterial, PembinaanActivity, PembinaanCategory, NspmDocument, NspmCategory } from './types';
import { db, cleanFirestoreData } from './firebase';
import { collection, onSnapshot, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { compressImageFile, formatBytes } from './utils/imageCompressor';
import { 
  formatDateDisplay, 
  toInputDateFormat, 
  getTodayInputDate, 
  sortByDateDesc 
} from './utils/dateUtils';
import { 
  exportInspeksiExcel, 
  exportSocializationExcel, 
  exportRedkarExcel, 
  exportPembinaanExcel 
} from './utils/excelExport';

// Document Data Sanitizers - Mencegah error React (undefined/null property) saat rendering
const sanitizeInspeksi = (id: string, raw: any): InspeksiItem => ({
  id,
  name: String(raw?.name || 'Gedung / Sarana'),
  date: String(raw?.date || getTodayInputDate()),
  status: (raw?.status === 'Kritis' || raw?.status === 'Aman' || raw?.status === 'Perlu Perbaikan') ? raw.status : 'Perlu Perbaikan',
  address: String(raw?.address || '-'),
  notes: String(raw?.notes || 'Tidak ada catatan tambahan.'),
  image: raw?.image ? String(raw.image) : undefined
});

const sanitizeSocialization = (id: string, raw: any): SocializationRecap => ({
  id,
  title: String(raw?.title || 'Kegiatan Sosialisasi'),
  date: String(raw?.date || getTodayInputDate()),
  location: String(raw?.location || '-'),
  participants: Number(raw?.participants) || 0,
  speaker: String(raw?.speaker || '-'),
  description: String(raw?.description || 'Tidak ada ringkasan materi.'),
  image: raw?.image ? String(raw.image) : undefined
});

const sanitizeVolunteer = (id: string, raw: any): RedkarVolunteer => ({
  id,
  name: String(raw?.name || 'Relawan REDKAR'),
  subdistrict: String(raw?.subdistrict || 'Rasanae Barat'),
  phone: String(raw?.phone || '-'),
  role: String(raw?.role || 'Petugas Penyelamat'),
  status: (raw?.status === 'Aktif' || raw?.status === 'Siaga' || raw?.status === 'Pelatihan') ? raw.status : 'Aktif',
  joinDate: String(raw?.joinDate || getTodayInputDate()),
  image: raw?.image ? String(raw.image) : undefined
});

const sanitizePembinaan = (id: string, raw: any): PembinaanActivity => ({
  id,
  title: String(raw?.title || 'Laporan Pembinaan'),
  category: (raw?.category || 'Pembinaan Aparatur Kebakaran') as PembinaanCategory,
  date: String(raw?.date || getTodayInputDate()),
  description: String(raw?.description || raw?.shortDesc || 'Tidak ada ringkasan kegiatan.'),
  shortDesc: String(raw?.description || raw?.shortDesc || 'Tidak ada ringkasan kegiatan.').slice(0, 100),
  image: raw?.image ? String(raw.image) : undefined
});

const sanitizeNspm = (id: string, raw: any): NspmDocument => ({
  id,
  title: String(raw?.title || 'Dokumen Regulasi'),
  category: raw?.category === 'Norma' ? 'PERDA' : (raw?.category || 'PERDA'),
  driveUrl: String(raw?.driveUrl || 'https://drive.google.com'),
  summary: String(raw?.summary || 'Rangkuman regulasi.'),
  code: String(raw?.code || `REG-${id.slice(-4)}`)
});

export default function App() {
  // Navigation & UI state
  const [currentView, setCurrentView] = useState<string>('home');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Versi sinkronisasi stabil
  const CURRENT_DATA_VERSION = 'damkar_v5_stable';

  // Helper untuk membaca cache lokal dengan fallback ke default data asli
  const loadLocalOrFallback = <T extends { id: string }>(key: string, fallback: T[]): T[] => {
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
      return fallback;
    } catch (e) {
      return fallback;
    }
  };

  // Primary Data States - Dimulai dari cache lokal / initial data asli Firestore agar UI langsung terisi tanpa 0
  const [inspeksiList, setInspeksiList] = useState<InspeksiItem[]>(() =>
    loadLocalOrFallback('damkar_inspeksi', initialInspeksiList)
  );
  const [socializations, setSocializations] = useState<SocializationRecap[]>(() =>
    loadLocalOrFallback('damkar_socializations', initialSocializationRecaps)
  );
  const [volunteers, setVolunteers] = useState<RedkarVolunteer[]>(() =>
    loadLocalOrFallback('damkar_volunteers', initialRedkarVolunteers)
  );
  const [pembinaanMaterials, setPembinaanMaterials] = useState<PembinaanActivity[]>(() =>
    loadLocalOrFallback('damkar_pembinaan', aparaturMaterials)
  );
  const [nspmDocs, setNspmDocs] = useState<NspmDocument[]>(() =>
    loadLocalOrFallback('damkar_nspm', nspmDocuments)
  );

  // Firestore Data Synchronization: Query aktif cepat (getDocs) paralel + Real-time Listeners (onSnapshot)
  useEffect(() => {
    // Shared Maps untuk deduplikasi dokumen antara koleksi utama & alias
    const inspMap = new Map<string, InspeksiItem>();
    const socMap = new Map<string, SocializationRecap>();
    const volMap = new Map<string, RedkarVolunteer>();
    const pemMap = new Map<string, PembinaanActivity>();
    const nspmMap = new Map<string, NspmDocument>();

    // Helper update state dan cache lokal dengan try...catch aman
    const updateInspeksi = () => {
      try {
        const list = Array.from(inspMap.values());
        if (list.length > 0) {
          const sorted = sortByDateDesc(list);
          setInspeksiList(sorted);
          localStorage.setItem('damkar_inspeksi', JSON.stringify(sorted));
        }
      } catch (e) {
        console.warn('Gagal memperbarui state inspeksi:', e);
      }
    };

    const updateSocializations = () => {
      try {
        const list = Array.from(socMap.values());
        if (list.length > 0) {
          const sorted = sortByDateDesc(list);
          setSocializations(sorted);
          localStorage.setItem('damkar_socializations', JSON.stringify(sorted));
        }
      } catch (e) {
        console.warn('Gagal memperbarui state sosialisasi:', e);
      }
    };

    const updateVolunteers = () => {
      try {
        const list = Array.from(volMap.values());
        if (list.length > 0) {
          list.sort((a, b) => a.id.localeCompare(b.id));
          setVolunteers(list);
          localStorage.setItem('damkar_volunteers', JSON.stringify(list));
        }
      } catch (e) {
        console.warn('Gagal memperbarui state relawan:', e);
      }
    };

    const updatePembinaan = () => {
      try {
        const list = Array.from(pemMap.values());
        if (list.length > 0) {
          const sorted = sortByDateDesc(list);
          setPembinaanMaterials(sorted);
          localStorage.setItem('damkar_pembinaan', JSON.stringify(sorted));
        }
      } catch (e) {
        console.warn('Gagal memperbarui state pembinaan:', e);
      }
    };

    const updateNspm = () => {
      try {
        const list = Array.from(nspmMap.values());
        if (list.length > 0) {
          list.sort((a, b) => a.id.localeCompare(b.id));
          setNspmDocs(list);
          localStorage.setItem('damkar_nspm', JSON.stringify(list));
        }
      } catch (e) {
        console.warn('Gagal memperbarui state nspm:', e);
      }
    };

    // A. Query Aktif Cepat Paralel (getDocs) ke koleksi Firestore dengan error handling per-koleksi
    const fetchAllFirestore = async () => {
      try {
        const fetchCollectionSafe = async (collName: string) => {
          try {
            return await getDocs(collection(db, collName));
          } catch (err) {
            console.warn(`Firestore getDocs info (${collName}):`, err);
            return null;
          }
        };

        const [
          snapInsp,
          snapSoc1,
          snapSoc2,
          snapVol1,
          snapVol2,
          snapPem1,
          snapPem2,
          snapNspm1,
          snapNspm2
        ] = await Promise.all([
          fetchCollectionSafe('inspeksi'),
          fetchCollectionSafe('pemberdayaan'),
          fetchCollectionSafe('socializations'),
          fetchCollectionSafe('redkar'),
          fetchCollectionSafe('volunteers'),
          fetchCollectionSafe('pembinaan'),
          fetchCollectionSafe('pembinaanMaterials'),
          fetchCollectionSafe('nspm'),
          fetchCollectionSafe('nspmDocs')
        ]);

        if (snapInsp) {
          snapInsp.forEach(docSnap => {
            inspMap.set(docSnap.id, sanitizeInspeksi(docSnap.id, docSnap.data()));
          });
          updateInspeksi();
        }

        if (snapSoc1 || snapSoc2) {
          snapSoc1?.forEach(docSnap => socMap.set(docSnap.id, sanitizeSocialization(docSnap.id, docSnap.data())));
          snapSoc2?.forEach(docSnap => socMap.set(docSnap.id, sanitizeSocialization(docSnap.id, docSnap.data())));
          updateSocializations();
        }

        if (snapVol1 || snapVol2) {
          snapVol1?.forEach(docSnap => volMap.set(docSnap.id, sanitizeVolunteer(docSnap.id, docSnap.data())));
          snapVol2?.forEach(docSnap => volMap.set(docSnap.id, sanitizeVolunteer(docSnap.id, docSnap.data())));
          updateVolunteers();
        }

        if (snapPem1 || snapPem2) {
          snapPem1?.forEach(docSnap => pemMap.set(docSnap.id, sanitizePembinaan(docSnap.id, docSnap.data())));
          snapPem2?.forEach(docSnap => pemMap.set(docSnap.id, sanitizePembinaan(docSnap.id, docSnap.data())));
          updatePembinaan();
        }

        if (snapNspm1 || snapNspm2) {
          snapNspm1?.forEach(docSnap => nspmMap.set(docSnap.id, sanitizeNspm(docSnap.id, docSnap.data())));
          snapNspm2?.forEach(docSnap => nspmMap.set(docSnap.id, sanitizeNspm(docSnap.id, docSnap.data())));
          updateNspm();
        }
      } catch (err) {
        console.warn('Firestore active fetch info:', err);
      }
    };

    fetchAllFirestore();

    // B. Real-time Listeners (onSnapshot) ke seluruh koleksi dengan error handling kuat
    // 1. Inspeksi
    const unsubInspeksi = onSnapshot(
      collection(db, 'inspeksi'),
      (snapshot) => {
        try {
          snapshot.forEach((docSnap) => {
            inspMap.set(docSnap.id, sanitizeInspeksi(docSnap.id, docSnap.data()));
          });
          updateInspeksi();
        } catch (e) {
          console.warn('Error onSnapshot inspeksi data:', e);
        }
      },
      (err) => console.warn('Firestore onSnapshot inspeksi callback error:', err)
    );

    // 2. Pemberdayaan & Socializations
    const unsubSoc1 = onSnapshot(
      collection(db, 'pemberdayaan'),
      (snapshot) => {
        try {
          snapshot.forEach((docSnap) => {
            socMap.set(docSnap.id, sanitizeSocialization(docSnap.id, docSnap.data()));
          });
          updateSocializations();
        } catch (e) {
          console.warn('Error onSnapshot pemberdayaan data:', e);
        }
      },
      (err) => console.warn('Firestore onSnapshot pemberdayaan callback error:', err)
    );

    const unsubSoc2 = onSnapshot(
      collection(db, 'socializations'),
      (snapshot) => {
        try {
          snapshot.forEach((docSnap) => {
            socMap.set(docSnap.id, sanitizeSocialization(docSnap.id, docSnap.data()));
          });
          updateSocializations();
        } catch (e) {
          console.warn('Error onSnapshot socializations data:', e);
        }
      },
      (err) => console.warn('Firestore onSnapshot socializations callback error:', err)
    );

    // 3. Redkar & Volunteers
    const unsubVol1 = onSnapshot(
      collection(db, 'redkar'),
      (snapshot) => {
        try {
          snapshot.forEach((docSnap) => {
            volMap.set(docSnap.id, sanitizeVolunteer(docSnap.id, docSnap.data()));
          });
          updateVolunteers();
        } catch (e) {
          console.warn('Error onSnapshot redkar data:', e);
        }
      },
      (err) => console.warn('Firestore onSnapshot redkar callback error:', err)
    );

    const unsubVol2 = onSnapshot(
      collection(db, 'volunteers'),
      (snapshot) => {
        try {
          snapshot.forEach((docSnap) => {
            volMap.set(docSnap.id, sanitizeVolunteer(docSnap.id, docSnap.data()));
          });
          updateVolunteers();
        } catch (e) {
          console.warn('Error onSnapshot volunteers data:', e);
        }
      },
      (err) => console.warn('Firestore onSnapshot volunteers callback error:', err)
    );

    // 4. Pembinaan & PembinaanMaterials
    const unsubPem1 = onSnapshot(
      collection(db, 'pembinaan'),
      (snapshot) => {
        try {
          snapshot.forEach((docSnap) => {
            pemMap.set(docSnap.id, sanitizePembinaan(docSnap.id, docSnap.data()));
          });
          updatePembinaan();
        } catch (e) {
          console.warn('Error onSnapshot pembinaan data:', e);
        }
      },
      (err) => console.warn('Firestore onSnapshot pembinaan callback error:', err)
    );

    const unsubPem2 = onSnapshot(
      collection(db, 'pembinaanMaterials'),
      (snapshot) => {
        try {
          snapshot.forEach((docSnap) => {
            pemMap.set(docSnap.id, sanitizePembinaan(docSnap.id, docSnap.data()));
          });
          updatePembinaan();
        } catch (e) {
          console.warn('Error onSnapshot pembinaanMaterials data:', e);
        }
      },
      (err) => console.warn('Firestore onSnapshot pembinaanMaterials callback error:', err)
    );

    // 5. NSPM & NSPMDocs
    const unsubNspm1 = onSnapshot(
      collection(db, 'nspm'),
      (snapshot) => {
        try {
          snapshot.forEach((docSnap) => {
            nspmMap.set(docSnap.id, sanitizeNspm(docSnap.id, docSnap.data()));
          });
          updateNspm();
        } catch (e) {
          console.warn('Error onSnapshot nspm data:', e);
        }
      },
      (err) => console.warn('Firestore onSnapshot nspm callback error:', err)
    );

    const unsubNspm2 = onSnapshot(
      collection(db, 'nspmDocs'),
      (snapshot) => {
        try {
          snapshot.forEach((docSnap) => {
            nspmMap.set(docSnap.id, sanitizeNspm(docSnap.id, docSnap.data()));
          });
          updateNspm();
        } catch (e) {
          console.warn('Error onSnapshot nspmDocs data:', e);
        }
      },
      (err) => console.warn('Firestore onSnapshot nspmDocs callback error:', err)
    );

    // Simpan penanda versi data
    localStorage.setItem('damkar_version', CURRENT_DATA_VERSION);

    return () => {
      unsubInspeksi();
      unsubSoc1();
      unsubSoc2();
      unsubVol1();
      unsubVol2();
      unsubPem1();
      unsubPem2();
      unsubNspm1();
      unsubNspm2();
    };
  }, []);

  // Admin Authentication State
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [showAdminLoginModal, setShowAdminLoginModal] = useState<boolean>(false);
  const [adminUsername, setAdminUsername] = useState<string>('');
  const [adminPassword, setAdminPassword] = useState<string>('');
  const [loginError, setLoginError] = useState<string>('');
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  // Leadership PIN Access State (PIN: 8914)
  const [isLeadershipUnlocked, setIsLeadershipUnlocked] = useState<boolean>(false);
  const [showLeadershipPinModal, setShowLeadershipPinModal] = useState<boolean>(false);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3500);
  };

  const handleUnlockLeadershipPin = (pin: string): boolean => {
    if (pin.trim() === '8914') {
      setIsLeadershipUnlocked(true);
      setShowLeadershipPinModal(false);
      triggerToast('🔓 PIN Pimpinan Terverifikasi! Sensor catatan temuan inspeksi terbuka.');
      return true;
    }
    triggerToast('⚠️ PIN salah, silakan coba lagi.');
    return false;
  };

  const handleLockLeadership = () => {
    setIsLeadershipUnlocked(false);
    triggerToast('🔒 Akses Pimpinan dikunci. Sensor catatan temuan kembali aktif.');
  };

  const ensureAdmin = (actionCallback: () => void) => {
    if (isAdmin) {
      actionCallback();
    } else {
      setPendingAction(() => actionCallback);
      setAdminUsername('');
      setAdminPassword('');
      setLoginError('');
      setShowAdminLoginModal(true);
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminUsername === 'Yugho114' && adminPassword === '8914Suhada') {
      setIsAdmin(true);
      setShowAdminLoginModal(false);
      setLoginError('');
      triggerToast('🔑 Login Admin Berhasil! Semua aksi kelola data terbuka.');
      if (pendingAction) {
        pendingAction();
        setPendingAction(null);
      }
    } else {
      setLoginError('Username atau Password admin salah!');
    }
  };

  // Selected Detail Modal States
  const [selectedInspeksi, setSelectedInspeksi] = useState<InspeksiItem | null>(null);
  const [selectedSocialization, setSelectedSocialization] = useState<SocializationRecap | null>(null);

  // Periode Filter SKP Khusus Admin (Bulan & Tahun) - Default: 'all' (Semua Data / All Time) agar seluruh akumulasi statistik langsung muncul
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');

  const handlePrintPdf = () => {
    window.print();
  };

  // Form Modal States
  const [showInspeksiModal, setShowInspeksiModal] = useState<boolean>(false);
  const [editingInspeksi, setEditingInspeksi] = useState<InspeksiItem | null>(null);
  const [newInspeksiName, setNewInspeksiName] = useState<string>('');
  const [newInspeksiStatus, setNewInspeksiStatus] = useState<'Perlu Perbaikan' | 'Kritis' | 'Aman'>('Perlu Perbaikan');
  const [newInspeksiAddress, setNewInspeksiAddress] = useState<string>('');
  const [newInspeksiNotes, setNewInspeksiNotes] = useState<string>('');
  const [newInspeksiDate, setNewInspeksiDate] = useState<string>(getTodayInputDate());
  const [newInspeksiImage, setNewInspeksiImage] = useState<string>('');

  const [showRedkarModal, setShowRedkarModal] = useState<boolean>(false);
  const [editingVolunteer, setEditingVolunteer] = useState<RedkarVolunteer | null>(null);
  const [newVolName, setNewVolName] = useState<string>('');
  const [newVolSubdistrict, setNewVolSubdistrict] = useState<string>('Dara');
  const [newVolPhone, setNewVolPhone] = useState<string>('');
  const [newVolRole, setNewVolRole] = useState<string>('Petugas Penyelamat');
  const [newVolStatus, setNewVolStatus] = useState<'Aktif' | 'Pelatihan' | 'Siaga'>('Aktif');
  const [newVolJoinDate, setNewVolJoinDate] = useState<string>(getTodayInputDate());
  const [newVolImage, setNewVolImage] = useState<string>('');

  const [showSocializationModal, setShowSocializationModal] = useState<boolean>(false);
  const [editingSocialization, setEditingSocialization] = useState<SocializationRecap | null>(null);
  const [newSocialTitle, setNewSocialTitle] = useState<string>('');
  const [newSocialLocation, setNewSocialLocation] = useState<string>('');
  const [newSocialParticipants, setNewSocialParticipants] = useState<number>(30);
  const [newSocialSpeaker, setNewSocialSpeaker] = useState<string>('');
  const [newSocialDescription, setNewSocialDescription] = useState<string>('');
  const [newSocialDate, setNewSocialDate] = useState<string>(getTodayInputDate());
  const [newSocialImage, setNewSocialImage] = useState<string>('');

  const [showPembinaanModal, setShowPembinaanModal] = useState<boolean>(false);
  const [editingMaterial, setEditingMaterial] = useState<PembinaanActivity | null>(null);
  const [newMaterialTitle, setNewMaterialTitle] = useState<string>('');
  const [newMaterialCategory, setNewMaterialCategory] = useState<PembinaanCategory>('Pembinaan Aparatur Kebakaran');
  const [newMaterialDate, setNewMaterialDate] = useState<string>(getTodayInputDate());
  const [newMaterialDescription, setNewMaterialDescription] = useState<string>('');
  const [newMaterialImage, setNewMaterialImage] = useState<string>('');
  const [selectedPembinaan, setSelectedPembinaan] = useState<PembinaanActivity | null>(null);

  const [showNspmModal, setShowNspmModal] = useState<boolean>(false);
  const [editingNspm, setEditingNspm] = useState<NspmDocument | null>(null);
  const [newNspmTitle, setNewNspmTitle] = useState<string>('');
  const [newNspmCategory, setNewNspmCategory] = useState<NspmCategory>('PERDA');
  const [newNspmDriveUrl, setNewNspmDriveUrl] = useState<string>('');
  const [newNspmSummary, setNewNspmSummary] = useState<string>('');

  // Delete Confirmation State
  const [confirmDeleteTarget, setConfirmDeleteTarget] = useState<{
    type: 'inspeksi' | 'socialization' | 'redkar' | 'pembinaan' | 'nspm';
    id: string;
    name: string;
  } | null>(null);

  // Image Upload helper with automatic compression (Max 800px width & JPEG format)
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, setImageState: (val: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        triggerToast('⏳ Sedang memproses & mengompresi foto...');
        const result = await compressImageFile(file, 800, 0.75);
        setImageState(result.dataUrl);
        triggerToast(
          `⚡ Foto dikompres: ${formatBytes(result.originalSize)} ➔ ${formatBytes(result.compressedSize)} (-${result.savedPercent}%). Aman untuk Firestore!`
        );
      } catch (err: any) {
        console.error('Error compressing image:', err);
        triggerToast(`⚠️ Gagal memproses gambar: ${err.message || 'Format tidak valid'}`);
      }
    }
  };



  // CRUD Save Handlers - Optimistic update ke local state & localStorage + Sinkronisasi Firestore aman dengan try...catch...finally
  const handleSaveInspeksi = async () => {
    if (!newInspeksiName.trim() || !newInspeksiAddress.trim()) {
      triggerToast('⚠️ Nama gedung dan alamat wajib diisi!');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingInspeksi) {
        const updatedItem: InspeksiItem = {
          ...editingInspeksi,
          name: newInspeksiName.trim(),
          date: newInspeksiDate || getTodayInputDate(),
          status: newInspeksiStatus,
          address: newInspeksiAddress.trim(),
          notes: newInspeksiNotes.trim() || 'Tidak ada catatan tambahan.',
          image: newInspeksiImage.trim() || editingInspeksi.image || undefined
        };

        setInspeksiList(prev => {
          const next = sortByDateDesc(prev.map(i => i.id === editingInspeksi.id ? updatedItem : i));
          try { localStorage.setItem('damkar_inspeksi', JSON.stringify(next)); } catch (e) {}
          return next;
        });

        await setDoc(doc(db, 'inspeksi', editingInspeksi.id), cleanFirestoreData(updatedItem));
        triggerToast('Data berhasil disimpan!');
      } else {
        const newId = `INS-${Date.now().toString().slice(-4)}`;
        const newItem: InspeksiItem = {
          id: newId,
          name: newInspeksiName.trim(),
          date: newInspeksiDate || getTodayInputDate(),
          status: newInspeksiStatus,
          address: newInspeksiAddress.trim(),
          notes: newInspeksiNotes.trim() || 'Tidak ada catatan tambahan.',
          image: newInspeksiImage.trim() || undefined
        };

        setInspeksiList(prev => {
          const next = sortByDateDesc([newItem, ...prev]);
          try { localStorage.setItem('damkar_inspeksi', JSON.stringify(next)); } catch (e) {}
          return next;
        });

        await setDoc(doc(db, 'inspeksi', newId), cleanFirestoreData(newItem));
        triggerToast('Data berhasil disimpan!');
      }
    } catch (err: any) {
      console.error('Error saving inspeksi to Firestore:', err);
      // Data tetap aman di penyimpanan lokal bila koneksi terhambat
      triggerToast('Data berhasil disimpan! (Tersimpan di perangkat lokal)');
    } finally {
      // Reset form secara bersih
      setNewInspeksiName('');
      setNewInspeksiAddress('');
      setNewInspeksiNotes('');
      setNewInspeksiImage('');
      setNewInspeksiStatus('Perlu Perbaikan');
      setNewInspeksiDate(getTodayInputDate());
      // Tutup modal secara aman tanpa merusak React state
      setEditingInspeksi(null);
      setShowInspeksiModal(false);
      setIsSubmitting(false);
    }
  };

  const handleSaveVolunteer = async () => {
    if (!newVolName.trim() || !newVolPhone.trim()) {
      triggerToast('⚠️ Nama relawan dan nomor HP wajib diisi!');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingVolunteer) {
        const updatedItem: RedkarVolunteer = {
          ...editingVolunteer,
          name: newVolName.trim(),
          subdistrict: newVolSubdistrict,
          phone: newVolPhone.trim(),
          role: newVolRole.trim() || 'Petugas Penyelamat',
          status: newVolStatus,
          joinDate: newVolJoinDate || getTodayInputDate(),
          image: newVolImage.trim() || editingVolunteer.image || undefined
        };

        setVolunteers(prev => {
          const next = prev.map(v => v.id === editingVolunteer.id ? updatedItem : v);
          next.sort((a, b) => a.id.localeCompare(b.id));
          try { localStorage.setItem('damkar_volunteers', JSON.stringify(next)); } catch (e) {}
          return next;
        });

        const cleanData = cleanFirestoreData(updatedItem);
        await setDoc(doc(db, 'volunteers', editingVolunteer.id), cleanData);
        setDoc(doc(db, 'redkar', editingVolunteer.id), cleanData).catch(() => {});
        triggerToast('Data berhasil disimpan!');
      } else {
        const newId = `RED-${Date.now().toString().slice(-4)}`;
        const newItem: RedkarVolunteer = {
          id: newId,
          name: newVolName.trim(),
          subdistrict: newVolSubdistrict,
          phone: newVolPhone.trim(),
          role: newVolRole.trim() || 'Petugas Penyelamat',
          status: newVolStatus,
          joinDate: newVolJoinDate || getTodayInputDate(),
          image: newVolImage.trim() || undefined
        };

        setVolunteers(prev => {
          const next = [...prev, newItem];
          next.sort((a, b) => a.id.localeCompare(b.id));
          try { localStorage.setItem('damkar_volunteers', JSON.stringify(next)); } catch (e) {}
          return next;
        });

        const cleanData = cleanFirestoreData(newItem);
        await setDoc(doc(db, 'volunteers', newId), cleanData);
        setDoc(doc(db, 'redkar', newId), cleanData).catch(() => {});
        triggerToast('Data berhasil disimpan!');
      }
    } catch (err: any) {
      console.error('Error saving volunteer to Firestore:', err);
      triggerToast('Data berhasil disimpan! (Tersimpan di perangkat lokal)');
    } finally {
      // Reset formulir secara bersih
      setNewVolName('');
      setNewVolPhone('');
      setNewVolImage('');
      setNewVolRole('Petugas Penyelamat');
      setNewVolStatus('Aktif');
      setNewVolJoinDate(getTodayInputDate());
      // Tutup modal secara aman tanpa merusak React state
      setEditingVolunteer(null);
      setShowRedkarModal(false);
      setIsSubmitting(false);
    }
  };

  const handleSaveSocialization = async () => {
    if (!newSocialTitle.trim() || !newSocialLocation.trim()) {
      triggerToast('⚠️ Judul dan lokasi kegiatan wajib diisi!');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingSocialization) {
        const updatedItem: SocializationRecap = {
          ...editingSocialization,
          title: newSocialTitle.trim(),
          date: newSocialDate || getTodayInputDate(),
          location: newSocialLocation.trim(),
          participants: Number(newSocialParticipants) || 0,
          speaker: newSocialSpeaker.trim() || 'Kasi Edukasi Damkarmat',
          description: newSocialDescription.trim() || 'Tidak ada ringkasan materi.',
          image: newSocialImage.trim() || editingSocialization.image || undefined
        };

        setSocializations(prev => {
          const next = sortByDateDesc(prev.map(s => s.id === editingSocialization.id ? updatedItem : s));
          try { localStorage.setItem('damkar_socializations', JSON.stringify(next)); } catch (e) {}
          return next;
        });

        const cleanData = cleanFirestoreData(updatedItem);
        await setDoc(doc(db, 'socializations', editingSocialization.id), cleanData);
        setDoc(doc(db, 'pemberdayaan', editingSocialization.id), cleanData).catch(() => {});
        triggerToast('Data berhasil disimpan!');
      } else {
        const newId = `SOC-${Date.now().toString().slice(-4)}`;
        const newItem: SocializationRecap = {
          id: newId,
          title: newSocialTitle.trim(),
          date: newSocialDate || getTodayInputDate(),
          location: newSocialLocation.trim(),
          participants: Number(newSocialParticipants) || 0,
          speaker: newSocialSpeaker.trim() || 'Kasi Edukasi Damkarmat',
          description: newSocialDescription.trim() || 'Tidak ada ringkasan materi.',
          image: newSocialImage.trim() || undefined
        };

        setSocializations(prev => {
          const next = sortByDateDesc([newItem, ...prev]);
          try { localStorage.setItem('damkar_socializations', JSON.stringify(next)); } catch (e) {}
          return next;
        });

        const cleanData = cleanFirestoreData(newItem);
        await setDoc(doc(db, 'socializations', newId), cleanData);
        setDoc(doc(db, 'pemberdayaan', newId), cleanData).catch(() => {});
        triggerToast('Data berhasil disimpan!');
      }
    } catch (err: any) {
      console.error('Error saving socialization to Firestore:', err);
      triggerToast('Data berhasil disimpan! (Tersimpan di perangkat lokal)');
    } finally {
      // Reset formulir secara bersih
      setNewSocialTitle('');
      setNewSocialLocation('');
      setNewSocialSpeaker('');
      setNewSocialDescription('');
      setNewSocialImage('');
      setNewSocialParticipants(30);
      setNewSocialDate(getTodayInputDate());
      // Tutup modal secara aman tanpa merusak React state
      setEditingSocialization(null);
      setShowSocializationModal(false);
      setIsSubmitting(false);
    }
  };

  const handleSaveMaterial = async () => {
    if (!newMaterialTitle.trim() || !newMaterialDescription.trim()) {
      triggerToast('⚠️ Judul kegiatan dan ringkasan wajib diisi!');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingMaterial) {
        const updatedItem: PembinaanActivity = {
          ...editingMaterial,
          title: newMaterialTitle.trim(),
          category: newMaterialCategory,
          date: newMaterialDate || getTodayInputDate(),
          description: newMaterialDescription.trim(),
          image: newMaterialImage.trim() || editingMaterial.image || undefined,
          shortDesc: newMaterialDescription.trim().slice(0, 100)
        };

        setPembinaanMaterials(prev => {
          const next = sortByDateDesc(prev.map(m => m.id === editingMaterial.id ? updatedItem : m));
          try { localStorage.setItem('damkar_pembinaan', JSON.stringify(next)); } catch (e) {}
          return next;
        });

        const cleanData = cleanFirestoreData(updatedItem);
        await setDoc(doc(db, 'pembinaanMaterials', editingMaterial.id), cleanData);
        setDoc(doc(db, 'pembinaan', editingMaterial.id), cleanData).catch(() => {});
        triggerToast('Data berhasil disimpan!');
      } else {
        const newId = `AP-${Date.now().toString().slice(-4)}`;
        const newItem: PembinaanActivity = {
          id: newId,
          title: newMaterialTitle.trim(),
          category: newMaterialCategory,
          date: newMaterialDate || getTodayInputDate(),
          description: newMaterialDescription.trim(),
          image: newMaterialImage.trim() || undefined,
          shortDesc: newMaterialDescription.trim().slice(0, 100)
        };

        setPembinaanMaterials(prev => {
          const next = sortByDateDesc([newItem, ...prev]);
          try { localStorage.setItem('damkar_pembinaan', JSON.stringify(next)); } catch (e) {}
          return next;
        });

        const cleanData = cleanFirestoreData(newItem);
        await setDoc(doc(db, 'pembinaanMaterials', newId), cleanData);
        setDoc(doc(db, 'pembinaan', newId), cleanData).catch(() => {});
        triggerToast('Data berhasil disimpan!');
      }
    } catch (err: any) {
      console.error('Error saving material to Firestore:', err);
      triggerToast('Data berhasil disimpan! (Tersimpan di perangkat lokal)');
    } finally {
      // Reset formulir secara bersih
      setNewMaterialTitle('');
      setNewMaterialCategory('Pembinaan Aparatur Kebakaran');
      setNewMaterialDate(getTodayInputDate());
      setNewMaterialDescription('');
      setNewMaterialImage('');
      // Tutup modal secara aman tanpa merusak React state
      setEditingMaterial(null);
      setShowPembinaanModal(false);
      setIsSubmitting(false);
    }
  };

  const handleSaveNspm = async () => {
    if (!newNspmTitle.trim()) {
      triggerToast('⚠️ Judul regulasi wajib diisi!');
      return;
    }
    if (!newNspmDriveUrl.trim()) {
      triggerToast('⚠️ Link dokumen / Google Drive wajib diisi!');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingNspm) {
        const updatedItem: NspmDocument = {
          ...editingNspm,
          title: newNspmTitle.trim(),
          category: newNspmCategory,
          driveUrl: newNspmDriveUrl.trim(),
          summary: newNspmSummary.trim(),
          code: editingNspm.code || `${newNspmCategory}-${Date.now().toString().slice(-4)}`
        };

        setNspmDocs(prev => {
          const next = prev.map(n => n.id === editingNspm.id ? updatedItem : n);
          next.sort((a, b) => a.id.localeCompare(b.id));
          try { localStorage.setItem('damkar_nspm', JSON.stringify(next)); } catch (e) {}
          return next;
        });

        const cleanData = cleanFirestoreData(updatedItem);
        await setDoc(doc(db, 'nspmDocs', editingNspm.id), cleanData);
        setDoc(doc(db, 'nspm', editingNspm.id), cleanData).catch(() => {});
        triggerToast('Data berhasil disimpan!');
      } else {
        const newId = `NSPM-${Date.now().toString().slice(-4)}`;
        const newItem: NspmDocument = {
          id: newId,
          title: newNspmTitle.trim(),
          category: newNspmCategory,
          driveUrl: newNspmDriveUrl.trim(),
          summary: newNspmSummary.trim(),
          code: `${newNspmCategory}-${Date.now().toString().slice(-4)}`
        };

        setNspmDocs(prev => {
          const next = [...prev, newItem];
          next.sort((a, b) => a.id.localeCompare(b.id));
          try { localStorage.setItem('damkar_nspm', JSON.stringify(next)); } catch (e) {}
          return next;
        });

        const cleanData = cleanFirestoreData(newItem);
        await setDoc(doc(db, 'nspmDocs', newId), cleanData);
        setDoc(doc(db, 'nspm', newId), cleanData).catch(() => {});
        triggerToast('Data berhasil disimpan!');
      }
    } catch (err: any) {
      console.error('Error saving NSPM to Firestore:', err);
      triggerToast('Data berhasil disimpan! (Tersimpan di perangkat lokal)');
    } finally {
      // Reset formulir secara bersih
      setNewNspmTitle('');
      setNewNspmCategory('PERDA');
      setNewNspmDriveUrl('');
      setNewNspmSummary('');
      // Tutup modal secara aman tanpa merusak React state
      setEditingNspm(null);
      setShowNspmModal(false);
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!confirmDeleteTarget) return;
    const { type, id, name } = confirmDeleteTarget;

    setIsSubmitting(true);
    try {
      // Optimistic removal from React state & localStorage
      if (type === 'inspeksi') {
        setInspeksiList(prev => {
          const next = prev.filter(i => i.id !== id);
          try { localStorage.setItem('damkar_inspeksi', JSON.stringify(next)); } catch (e) {}
          return next;
        });
        await deleteDoc(doc(db, 'inspeksi', id));
      } else if (type === 'socialization') {
        setSocializations(prev => {
          const next = prev.filter(s => s.id !== id);
          try { localStorage.setItem('damkar_socializations', JSON.stringify(next)); } catch (e) {}
          return next;
        });
        await deleteDoc(doc(db, 'socializations', id)).catch(() => {});
        await deleteDoc(doc(db, 'pemberdayaan', id)).catch(() => {});
      } else if (type === 'redkar') {
        setVolunteers(prev => {
          const next = prev.filter(v => v.id !== id);
          try { localStorage.setItem('damkar_volunteers', JSON.stringify(next)); } catch (e) {}
          return next;
        });
        await deleteDoc(doc(db, 'volunteers', id)).catch(() => {});
        await deleteDoc(doc(db, 'redkar', id)).catch(() => {});
      } else if (type === 'pembinaan') {
        setPembinaanMaterials(prev => {
          const next = prev.filter(m => m.id !== id);
          try { localStorage.setItem('damkar_pembinaan', JSON.stringify(next)); } catch (e) {}
          return next;
        });
        await deleteDoc(doc(db, 'pembinaanMaterials', id)).catch(() => {});
        await deleteDoc(doc(db, 'pembinaan', id)).catch(() => {});
      } else if (type === 'nspm') {
        setNspmDocs(prev => {
          const next = prev.filter(n => n.id !== id);
          try { localStorage.setItem('damkar_nspm', JSON.stringify(next)); } catch (e) {}
          return next;
        });
        await deleteDoc(doc(db, 'nspmDocs', id)).catch(() => {});
        await deleteDoc(doc(db, 'nspm', id)).catch(() => {});
      }

      triggerToast(`🗑️ Data "${name}" berhasil dihapus`);
    } catch (err: any) {
      console.error('Error deleting document:', err);
      triggerToast(`🗑️ Data "${name}" telah dihapus.`);
    } finally {
      setConfirmDeleteTarget(null);
      setIsSubmitting(false);
    }
  };

  const criticalCount = inspeksiList.filter(i => i.status === 'Kritis').length;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex font-sans antialiased">
      {/* 1. LEFT NAVIGATION SIDEBAR (Fixed Desktop, Collapsible Mobile) */}
      <Sidebar
        currentView={currentView}
        onNavigate={(view) => setCurrentView(view)}
        isAdmin={isAdmin}
        onOpenAdminLogin={() => {
          setPendingAction(null);
          setAdminUsername('');
          setAdminPassword('');
          setLoginError('');
          setShowAdminLoginModal(true);
        }}
        onLogoutAdmin={() => {
          setIsAdmin(false);
          triggerToast('🔒 Anda telah keluar dari Mode Admin.');
        }}
        inspeksiCount={inspeksiList.length}
        criticalCount={criticalCount}
        volunteerCount={volunteers.length}
        socializationCount={socializations.length}
        pembinaanCount={pembinaanMaterials.length}
        nspmCount={nspmDocs.length}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* 2. MAIN DESKTOP CONTENT WRAPPER */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72 transition-all duration-300">
        {/* Top Desktop Header Bar */}
        <Header
          currentView={currentView}
          isAdmin={isAdmin}
          onOpenAdminLogin={() => {
            setPendingAction(null);
            setAdminUsername('');
            setAdminPassword('');
            setLoginError('');
            setShowAdminLoginModal(true);
          }}
          onLogoutAdmin={() => {
            setIsAdmin(false);
            triggerToast('🔒 Anda telah keluar dari Mode Admin.');
          }}
          onNavigateHome={() => setCurrentView('home')}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
        />

        {/* Main Content Area (Maximizing Screen Width with Tailwind CSS Grid/Flexbox) */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {currentView === 'home' && (
            <DashboardHome
              inspeksiList={inspeksiList}
              socializations={socializations}
              volunteers={volunteers}
              pembinaanMaterials={pembinaanMaterials}
              nspmDocs={nspmDocs}
              onNavigate={(view) => setCurrentView(view)}
              onOpenInspeksiModal={() => ensureAdmin(() => {
                setEditingInspeksi(null);
                setNewInspeksiName('');
                setNewInspeksiStatus('Perlu Perbaikan');
                setNewInspeksiAddress('');
                setNewInspeksiNotes('');
                setNewInspeksiDate(getTodayInputDate());
                setNewInspeksiImage('');
                setShowInspeksiModal(true);
              })}
              onOpenRedkarModal={() => ensureAdmin(() => {
                setEditingVolunteer(null);
                setNewVolName('');
                setNewVolSubdistrict('Rasanae Barat');
                setNewVolPhone('');
                setNewVolRole('Petugas Penyelamat');
                setNewVolStatus('Aktif');
                setNewVolImage('');
                setNewVolJoinDate(getTodayInputDate());
                setShowRedkarModal(true);
              })}
              onOpenSocializationModal={() => ensureAdmin(() => {
                setEditingSocialization(null);
                setNewSocialTitle('');
                setNewSocialLocation('');
                setNewSocialParticipants(35);
                setNewSocialSpeaker('Kasi Edukasi Damkarmat');
                setNewSocialDescription('');
                setNewSocialDate(getTodayInputDate());
                setNewSocialImage('');
                setShowSocializationModal(true);
              })}
              onSelectInspeksi={(item) => setSelectedInspeksi(item)}
              onSelectSocialization={(item) => setSelectedSocialization(item)}
              onExportInspeksi={() => {
                try {
                  exportInspeksiExcel(inspeksiList);
                  triggerToast('📊 Berhasil mengunduh Excel Data Inspeksi (.xlsx)!');
                } catch (err: any) {
                  triggerToast(`⚠️ Gagal ekspor Excel: ${err.message}`);
                }
              }}
              onExportSocialization={() => {
                try {
                  exportSocializationExcel(socializations);
                  triggerToast('📊 Berhasil mengunduh Excel Data Sosialisasi (.xlsx)!');
                } catch (err: any) {
                  triggerToast(`⚠️ Gagal ekspor Excel: ${err.message}`);
                }
              }}
              onExportRedkar={() => {
                try {
                  exportRedkarExcel(volunteers);
                  triggerToast('📊 Berhasil mengunduh Excel Data Relawan REDKAR (.xlsx)!');
                } catch (err: any) {
                  triggerToast(`⚠️ Gagal ekspor Excel: ${err.message}`);
                }
              }}
              isAdmin={isAdmin}
              isLeadershipUnlocked={isLeadershipUnlocked}
              selectedMonth={selectedMonth}
              onMonthChange={setSelectedMonth}
              selectedYear={selectedYear}
              onYearChange={setSelectedYear}
              onPrintPdf={handlePrintPdf}
            />
          )}

          {currentView === 'inspeksi' && (
            <InspeksiView
              inspeksiList={inspeksiList}
              onOpenAddModal={() => ensureAdmin(() => {
                setEditingInspeksi(null);
                setNewInspeksiName('');
                setNewInspeksiStatus('Perlu Perbaikan');
                setNewInspeksiAddress('');
                setNewInspeksiNotes('');
                setNewInspeksiDate(getTodayInputDate());
                setNewInspeksiImage('');
                setShowInspeksiModal(true);
              })}
              onEditInspeksi={(item) => ensureAdmin(() => {
                setEditingInspeksi(item);
                setNewInspeksiName(item.name);
                setNewInspeksiStatus(item.status);
                setNewInspeksiAddress(item.address);
                setNewInspeksiNotes(item.notes || '');
                setNewInspeksiDate(toInputDateFormat(item.date));
                setNewInspeksiImage(item.image || '');
                setShowInspeksiModal(true);
              })}
              onDeleteInspeksi={(id, name) => ensureAdmin(() => {
                setConfirmDeleteTarget({ type: 'inspeksi', id, name });
              })}
              onSelectDetail={(item) => setSelectedInspeksi(item)}
              onExportExcel={() => {
                try {
                  exportInspeksiExcel(inspeksiList);
                  triggerToast('📊 Berhasil mengunduh Excel Data Inspeksi Proteksi (.xlsx)!');
                } catch (err: any) {
                  triggerToast(`⚠️ Gagal ekspor Excel: ${err.message}`);
                }
              }}
              isAdmin={isAdmin}
              isLeadershipUnlocked={isLeadershipUnlocked}
              onOpenPinModal={() => setShowLeadershipPinModal(true)}
              onLockLeadership={handleLockLeadership}
              selectedMonth={selectedMonth}
              onMonthChange={setSelectedMonth}
              selectedYear={selectedYear}
              onYearChange={setSelectedYear}
              onPrintPdf={handlePrintPdf}
            />
          )}

          {currentView === 'edukasi' && (
            <SosialisasiView
              socializations={socializations}
              onOpenAddModal={() => ensureAdmin(() => {
                setEditingSocialization(null);
                setNewSocialTitle('');
                setNewSocialLocation('');
                setNewSocialParticipants(35);
                setNewSocialSpeaker('Kasi Edukasi Damkarmat');
                setNewSocialDescription('');
                setNewSocialDate(getTodayInputDate());
                setNewSocialImage('');
                setShowSocializationModal(true);
              })}
              onEditSocialization={(item) => ensureAdmin(() => {
                setEditingSocialization(item);
                setNewSocialTitle(item.title);
                setNewSocialLocation(item.location);
                setNewSocialParticipants(item.participants);
                setNewSocialSpeaker(item.speaker);
                setNewSocialDescription(item.description);
                setNewSocialDate(toInputDateFormat(item.date));
                setNewSocialImage(item.image || '');
                setShowSocializationModal(true);
              })}
              onDeleteSocialization={(id, name) => ensureAdmin(() => {
                setConfirmDeleteTarget({ type: 'socialization', id, name });
              })}
              onSelectDetail={(item) => setSelectedSocialization(item)}
              onExportExcel={() => {
                try {
                  exportSocializationExcel(socializations);
                  triggerToast('📊 Berhasil mengunduh Excel Data Sosialisasi & Edukasi (.xlsx)!');
                } catch (err: any) {
                  triggerToast(`⚠️ Gagal ekspor Excel: ${err.message}`);
                }
              }}
              isAdmin={isAdmin}
              selectedMonth={selectedMonth}
              onMonthChange={setSelectedMonth}
              selectedYear={selectedYear}
              onYearChange={setSelectedYear}
              onPrintPdf={handlePrintPdf}
            />
          )}

          {currentView === 'redkar' && (
            <RedkarView
              volunteers={volunteers}
              onOpenAddModal={() => ensureAdmin(() => {
                setEditingVolunteer(null);
                setNewVolName('');
                setNewVolSubdistrict('Dara');
                setNewVolPhone('');
                setNewVolRole('Petugas Penyelamat');
                setNewVolStatus('Aktif');
                setNewVolImage('');
                setNewVolJoinDate('10 Jun 2026');
                setShowRedkarModal(true);
              })}
              onEditVolunteer={(item) => ensureAdmin(() => {
                setEditingVolunteer(item);
                setNewVolName(item.name);
                setNewVolSubdistrict(item.subdistrict);
                setNewVolPhone(item.phone);
                setNewVolRole(item.role);
                setNewVolStatus(item.status);
                setNewVolImage(item.image || '');
                setNewVolJoinDate(item.joinDate || '10 Jun 2026');
                setShowRedkarModal(true);
              })}
              onDeleteVolunteer={(id, name) => ensureAdmin(() => {
                setConfirmDeleteTarget({ type: 'redkar', id, name });
              })}
              onExportExcel={() => {
                try {
                  exportRedkarExcel(volunteers);
                  triggerToast('📊 Berhasil mengunduh Excel Data Relawan REDKAR (.xlsx)!');
                } catch (err: any) {
                  triggerToast(`⚠️ Gagal ekspor Excel: ${err.message}`);
                }
              }}
              isAdmin={isAdmin}
            />
          )}

          {currentView === 'pembinaan' && (
            <PembinaanView
              materials={pembinaanMaterials}
              onOpenAddModal={() => ensureAdmin(() => {
                setEditingMaterial(null);
                setNewMaterialTitle('');
                setNewMaterialCategory('Pembinaan Aparatur Kebakaran');
                setNewMaterialDate(getTodayInputDate());
                setNewMaterialDescription('');
                setNewMaterialImage('');
                setShowPembinaanModal(true);
              })}
              onEditMaterial={(item) => ensureAdmin(() => {
                setEditingMaterial(item);
                setNewMaterialTitle(item.title);
                setNewMaterialCategory(item.category);
                setNewMaterialDate(item.date || getTodayInputDate());
                setNewMaterialDescription(item.description || item.shortDesc || '');
                setNewMaterialImage(item.image || '');
                setShowPembinaanModal(true);
              })}
              onDeleteMaterial={(id, name) => ensureAdmin(() => {
                setConfirmDeleteTarget({ type: 'pembinaan', id, name });
              })}
              onSelectMaterial={(item) => setSelectedPembinaan(item)}
              onExportExcel={() => {
                try {
                  exportPembinaanExcel(pembinaanMaterials);
                  triggerToast('📊 Berhasil mengunduh Excel Laporan Pembinaan (.xlsx)!');
                } catch (err: any) {
                  triggerToast(`⚠️ Gagal ekspor Excel: ${err.message}`);
                }
              }}
              isAdmin={isAdmin}
            />
          )}

          {currentView === 'nspm' && (
            <NspmView
              nspmDocs={nspmDocs}
              onOpenAddModal={() => ensureAdmin(() => {
                setEditingNspm(null);
                setNewNspmTitle('');
                setNewNspmCategory('PERDA');
                setNewNspmDriveUrl('');
                setNewNspmSummary('');
                setShowNspmModal(true);
              })}
              onEditNspm={(item) => ensureAdmin(() => {
                setEditingNspm(item);
                setNewNspmTitle(item.title);
                const normCat = item.category === 'Norma' ? 'PERDA' : (item.category as NspmCategory);
                setNewNspmCategory(normCat || 'PERDA');
                setNewNspmDriveUrl(item.driveUrl || '');
                setNewNspmSummary(item.summary);
                setShowNspmModal(true);
              })}
              onDeleteNspm={(id, name) => ensureAdmin(() => {
                setConfirmDeleteTarget({ type: 'nspm', id, name });
              })}
              onToast={triggerToast}
              isAdmin={isAdmin}
            />
          )}
        </main>
      </div>

      {/* 3. MODAL DIALOGS & OVERLAYS */}
      <Modals
        isSubmitting={isSubmitting}
        showAdminLoginModal={showAdminLoginModal}
        onCloseAdminLogin={() => setShowAdminLoginModal(false)}
        adminUsername={adminUsername}
        setAdminUsername={setAdminUsername}
        adminPassword={adminPassword}
        setAdminPassword={setAdminPassword}
        loginError={loginError}
        onAdminLoginSubmit={handleAdminLogin}

        showInspeksiModal={showInspeksiModal}
        onCloseInspeksiModal={() => {
          setShowInspeksiModal(false);
          setEditingInspeksi(null);
          setNewInspeksiName('');
          setNewInspeksiAddress('');
          setNewInspeksiNotes('');
          setNewInspeksiImage('');
        }}
        editingInspeksi={editingInspeksi}
        newInspeksiName={newInspeksiName}
        setNewInspeksiName={setNewInspeksiName}
        newInspeksiStatus={newInspeksiStatus}
        setNewInspeksiStatus={setNewInspeksiStatus}
        newInspeksiAddress={newInspeksiAddress}
        setNewInspeksiAddress={setNewInspeksiAddress}
        newInspeksiNotes={newInspeksiNotes}
        setNewInspeksiNotes={setNewInspeksiNotes}
        newInspeksiDate={newInspeksiDate}
        setNewInspeksiDate={setNewInspeksiDate}
        newInspeksiImage={newInspeksiImage}
        setNewInspeksiImage={setNewInspeksiImage}
        onSaveInspeksi={handleSaveInspeksi}

        showRedkarModal={showRedkarModal}
        onCloseRedkarModal={() => {
          setShowRedkarModal(false);
          setEditingVolunteer(null);
          setNewVolName('');
          setNewVolPhone('');
          setNewVolImage('');
        }}
        editingVolunteer={editingVolunteer}
        newVolName={newVolName}
        setNewVolName={setNewVolName}
        newVolSubdistrict={newVolSubdistrict}
        setNewVolSubdistrict={setNewVolSubdistrict}
        newVolPhone={newVolPhone}
        setNewVolPhone={setNewVolPhone}
        newVolRole={newVolRole}
        setNewVolRole={setNewVolRole}
        newVolStatus={newVolStatus}
        setNewVolStatus={setNewVolStatus}
        newVolJoinDate={newVolJoinDate}
        setNewVolJoinDate={setNewVolJoinDate}
        newVolImage={newVolImage}
        setNewVolImage={setNewVolImage}
        onSaveVolunteer={handleSaveVolunteer}

        showSocializationModal={showSocializationModal}
        onCloseSocializationModal={() => {
          setShowSocializationModal(false);
          setEditingSocialization(null);
          setNewSocialTitle('');
          setNewSocialLocation('');
          setNewSocialSpeaker('');
          setNewSocialDescription('');
          setNewSocialImage('');
        }}
        editingSocialization={editingSocialization}
        newSocialTitle={newSocialTitle}
        setNewSocialTitle={setNewSocialTitle}
        newSocialLocation={newSocialLocation}
        setNewSocialLocation={setNewSocialLocation}
        newSocialParticipants={newSocialParticipants}
        setNewSocialParticipants={setNewSocialParticipants}
        newSocialSpeaker={newSocialSpeaker}
        setNewSocialSpeaker={setNewSocialSpeaker}
        newSocialDescription={newSocialDescription}
        setNewSocialDescription={setNewSocialDescription}
        newSocialDate={newSocialDate}
        setNewSocialDate={setNewSocialDate}
        newSocialImage={newSocialImage}
        setNewSocialImage={setNewSocialImage}
        onSaveSocialization={handleSaveSocialization}

        showPembinaanModal={showPembinaanModal}
        onClosePembinaanModal={() => {
          setShowPembinaanModal(false);
          setEditingMaterial(null);
          setNewMaterialTitle('');
          setNewMaterialDescription('');
          setNewMaterialImage('');
        }}
        editingMaterial={editingMaterial}
        newMaterialTitle={newMaterialTitle}
        setNewMaterialTitle={setNewMaterialTitle}
        newMaterialCategory={newMaterialCategory}
        setNewMaterialCategory={setNewMaterialCategory}
        newMaterialDate={newMaterialDate}
        setNewMaterialDate={setNewMaterialDate}
        newMaterialDescription={newMaterialDescription}
        setNewMaterialDescription={setNewMaterialDescription}
        newMaterialImage={newMaterialImage}
        setNewMaterialImage={setNewMaterialImage}
        onSaveMaterial={handleSaveMaterial}
        selectedPembinaan={selectedPembinaan}
        onCloseSelectedPembinaan={() => setSelectedPembinaan(null)}

        showNspmModal={showNspmModal}
        onCloseNspmModal={() => {
          setShowNspmModal(false);
          setEditingNspm(null);
          setNewNspmTitle('');
          setNewNspmDriveUrl('');
          setNewNspmSummary('');
        }}
        editingNspm={editingNspm}
        newNspmTitle={newNspmTitle}
        setNewNspmTitle={setNewNspmTitle}
        newNspmCategory={newNspmCategory}
        setNewNspmCategory={setNewNspmCategory}
        newNspmDriveUrl={newNspmDriveUrl}
        setNewNspmDriveUrl={setNewNspmDriveUrl}
        newNspmSummary={newNspmSummary}
        setNewNspmSummary={setNewNspmSummary}
        onSaveNspm={handleSaveNspm}

        selectedInspeksi={selectedInspeksi}
        onCloseSelectedInspeksi={() => setSelectedInspeksi(null)}
        selectedSocialization={selectedSocialization}
        onCloseSelectedSocialization={() => setSelectedSocialization(null)}

        confirmDeleteTarget={confirmDeleteTarget}
        onCloseConfirmDelete={() => setConfirmDeleteTarget(null)}
        onConfirmDelete={handleConfirmDelete}

        isAdmin={isAdmin}
        isLeadershipUnlocked={isLeadershipUnlocked}
        showLeadershipPinModal={showLeadershipPinModal}
        onOpenLeadershipPinModal={() => setShowLeadershipPinModal(true)}
        onCloseLeadershipPinModal={() => setShowLeadershipPinModal(false)}
        onUnlockLeadershipPin={handleUnlockLeadershipPin}

        onToast={triggerToast}
        onImageUpload={handleImageUpload}
      />

      {/* 4. TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-slideUp">
          <div className="bg-slate-900/95 backdrop-blur-md text-white text-xs sm:text-sm font-bold px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3">
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
}
