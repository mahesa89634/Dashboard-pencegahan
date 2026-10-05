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
import { db } from './firebase';
import { collection, onSnapshot, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { compressImageFile, formatBytes } from './utils/imageCompressor';
import { 
  formatDateDisplay, 
  toInputDateFormat, 
  getTodayInputDate, 
  sortByDateDesc 
} from './utils/dateUtils';

export default function App() {
  // Navigation & UI state
  const [currentView, setCurrentView] = useState<string>('home');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');

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

  // Firestore Data Synchronization: Query aktif (getDocs) saat dibuka + Real-time Listeners (onSnapshot)
  useEffect(() => {
    // Shared Maps untuk deduplikasi dokumen antara koleksi utama & alias
    const inspMap = new Map<string, InspeksiItem>();
    const socMap = new Map<string, SocializationRecap>();
    const volMap = new Map<string, RedkarVolunteer>();
    const pemMap = new Map<string, PembinaanActivity>();
    const nspmMap = new Map<string, NspmDocument>();

    // Helper update state dan cache lokal
    const updateInspeksi = () => {
      const list = Array.from(inspMap.values());
      if (list.length > 0) {
        const sorted = sortByDateDesc(list);
        setInspeksiList(sorted);
        localStorage.setItem('damkar_inspeksi', JSON.stringify(sorted));
      }
    };

    const updateSocializations = () => {
      const list = Array.from(socMap.values());
      if (list.length > 0) {
        const sorted = sortByDateDesc(list);
        setSocializations(sorted);
        localStorage.setItem('damkar_socializations', JSON.stringify(sorted));
      }
    };

    const updateVolunteers = () => {
      const list = Array.from(volMap.values());
      if (list.length > 0) {
        list.sort((a, b) => a.id.localeCompare(b.id));
        setVolunteers(list);
        localStorage.setItem('damkar_volunteers', JSON.stringify(list));
      }
    };

    const updatePembinaan = () => {
      const list = Array.from(pemMap.values());
      if (list.length > 0) {
        const sorted = sortByDateDesc(list);
        setPembinaanMaterials(sorted);
        localStorage.setItem('damkar_pembinaan', JSON.stringify(sorted));
      }
    };

    const updateNspm = () => {
      const list = Array.from(nspmMap.values());
      if (list.length > 0) {
        list.sort((a, b) => a.id.localeCompare(b.id));
        setNspmDocs(list);
        localStorage.setItem('damkar_nspm', JSON.stringify(list));
      }
    };

    // A. Query Aktif Langsung (getDocs) ke koleksi Firestore ('inspeksi', 'pemberdayaan', 'redkar', 'pembinaan', 'nspm')
    const fetchAllFirestore = async () => {
      try {
        // 1. Inspeksi
        const snapInsp = await getDocs(collection(db, 'inspeksi'));
        snapInsp.forEach(docSnap => {
          const d = docSnap.data() as InspeksiItem;
          inspMap.set(docSnap.id, { ...d, id: docSnap.id });
        });
        updateInspeksi();

        // 2. Pemberdayaan & Socializations
        const snapSoc1 = await getDocs(collection(db, 'pemberdayaan'));
        snapSoc1.forEach(docSnap => {
          const d = docSnap.data() as SocializationRecap;
          socMap.set(docSnap.id, { ...d, id: docSnap.id });
        });
        const snapSoc2 = await getDocs(collection(db, 'socializations'));
        snapSoc2.forEach(docSnap => {
          const d = docSnap.data() as SocializationRecap;
          socMap.set(docSnap.id, { ...d, id: docSnap.id });
        });
        updateSocializations();

        // 3. Redkar & Volunteers
        const snapVol1 = await getDocs(collection(db, 'redkar'));
        snapVol1.forEach(docSnap => {
          const d = docSnap.data() as RedkarVolunteer;
          volMap.set(docSnap.id, { ...d, id: docSnap.id });
        });
        const snapVol2 = await getDocs(collection(db, 'volunteers'));
        snapVol2.forEach(docSnap => {
          const d = docSnap.data() as RedkarVolunteer;
          volMap.set(docSnap.id, { ...d, id: docSnap.id });
        });
        updateVolunteers();

        // 4. Pembinaan & PembinaanMaterials
        const snapPem1 = await getDocs(collection(db, 'pembinaan'));
        snapPem1.forEach(docSnap => {
          const d = docSnap.data() as PembinaanActivity;
          pemMap.set(docSnap.id, { ...d, id: docSnap.id });
        });
        const snapPem2 = await getDocs(collection(db, 'pembinaanMaterials'));
        snapPem2.forEach(docSnap => {
          const d = docSnap.data() as PembinaanActivity;
          pemMap.set(docSnap.id, { ...d, id: docSnap.id });
        });
        updatePembinaan();

        // 5. NSPM & NSPMDocs
        const snapNspm1 = await getDocs(collection(db, 'nspm'));
        snapNspm1.forEach(docSnap => {
          const d = docSnap.data() as NspmDocument;
          nspmMap.set(docSnap.id, { ...d, id: docSnap.id });
        });
        const snapNspm2 = await getDocs(collection(db, 'nspmDocs'));
        snapNspm2.forEach(docSnap => {
          const d = docSnap.data() as NspmDocument;
          nspmMap.set(docSnap.id, { ...d, id: docSnap.id });
        });
        updateNspm();
      } catch (err) {
        console.warn('Firestore active fetch info:', err);
      }
    };

    fetchAllFirestore();

    // B. Real-time Listeners (onSnapshot) ke seluruh koleksi
    // 1. Inspeksi
    const unsubInspeksi = onSnapshot(
      collection(db, 'inspeksi'),
      (snapshot) => {
        snapshot.forEach((docSnap) => {
          inspMap.set(docSnap.id, { ...(docSnap.data() as InspeksiItem), id: docSnap.id });
        });
        updateInspeksi();
      },
      (err) => console.warn('Firestore onSnapshot inspeksi:', err)
    );

    // 2. Pemberdayaan & Socializations
    const unsubSoc1 = onSnapshot(
      collection(db, 'pemberdayaan'),
      (snapshot) => {
        snapshot.forEach((docSnap) => {
          socMap.set(docSnap.id, { ...(docSnap.data() as SocializationRecap), id: docSnap.id });
        });
        updateSocializations();
      },
      (err) => console.warn('Firestore onSnapshot pemberdayaan:', err)
    );

    const unsubSoc2 = onSnapshot(
      collection(db, 'socializations'),
      (snapshot) => {
        snapshot.forEach((docSnap) => {
          socMap.set(docSnap.id, { ...(docSnap.data() as SocializationRecap), id: docSnap.id });
        });
        updateSocializations();
      },
      (err) => console.warn('Firestore onSnapshot socializations:', err)
    );

    // 3. Redkar & Volunteers
    const unsubVol1 = onSnapshot(
      collection(db, 'redkar'),
      (snapshot) => {
        snapshot.forEach((docSnap) => {
          volMap.set(docSnap.id, { ...(docSnap.data() as RedkarVolunteer), id: docSnap.id });
        });
        updateVolunteers();
      },
      (err) => console.warn('Firestore onSnapshot redkar:', err)
    );

    const unsubVol2 = onSnapshot(
      collection(db, 'volunteers'),
      (snapshot) => {
        snapshot.forEach((docSnap) => {
          volMap.set(docSnap.id, { ...(docSnap.data() as RedkarVolunteer), id: docSnap.id });
        });
        updateVolunteers();
      },
      (err) => console.warn('Firestore onSnapshot volunteers:', err)
    );

    // 4. Pembinaan & PembinaanMaterials
    const unsubPem1 = onSnapshot(
      collection(db, 'pembinaan'),
      (snapshot) => {
        snapshot.forEach((docSnap) => {
          pemMap.set(docSnap.id, { ...(docSnap.data() as PembinaanActivity), id: docSnap.id });
        });
        updatePembinaan();
      },
      (err) => console.warn('Firestore onSnapshot pembinaan:', err)
    );

    const unsubPem2 = onSnapshot(
      collection(db, 'pembinaanMaterials'),
      (snapshot) => {
        snapshot.forEach((docSnap) => {
          pemMap.set(docSnap.id, { ...(docSnap.data() as PembinaanActivity), id: docSnap.id });
        });
        updatePembinaan();
      },
      (err) => console.warn('Firestore onSnapshot pembinaanMaterials:', err)
    );

    // 5. NSPM & NSPMDocs
    const unsubNspm1 = onSnapshot(
      collection(db, 'nspm'),
      (snapshot) => {
        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as NspmDocument;
          nspmMap.set(docSnap.id, {
            ...data,
            id: docSnap.id,
            category: data.category === 'Norma' ? 'PERDA' : (data.category || 'PERDA'),
            driveUrl: data.driveUrl || 'https://drive.google.com'
          });
        });
        updateNspm();
      },
      (err) => console.warn('Firestore onSnapshot nspm:', err)
    );

    const unsubNspm2 = onSnapshot(
      collection(db, 'nspmDocs'),
      (snapshot) => {
        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as NspmDocument;
          nspmMap.set(docSnap.id, {
            ...data,
            id: docSnap.id,
            category: data.category === 'Norma' ? 'PERDA' : (data.category || 'PERDA'),
            driveUrl: data.driveUrl || 'https://drive.google.com'
          });
        });
        updateNspm();
      },
      (err) => console.warn('Firestore onSnapshot nspmDocs:', err)
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

  // Excel/CSV Export Utility
  const exportToExcel = (data: any[], filename: string, headers: string[], keys: string[]) => {
    if (!data || data.length === 0) {
      triggerToast('⚠️ Tidak ada data untuk diekspor.');
      return;
    }
    const bom = '\uFEFF';
    const csvContent = data.map(item => {
      return keys.map(key => {
        let val = item[key];
        if (key === 'date' || key === 'joinDate') {
          val = formatDateDisplay(val);
        }
        if (val === undefined || val === null) return '""';
        const cleanVal = String(val).replace(/"/g, '""');
        return `"${cleanVal}"`;
      }).join(',');
    }).join('\r\n');
    
    const fullCsv = bom + headers.map(h => `"${h}"`).join(',') + '\r\n' + csvContent;
    const blob = new Blob([fullCsv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerToast(`📊 Berhasil mengunduh Excel ${filename}!`);
  };

  // CRUD Save Handlers - Optimistic update ke local state & localStorage + Sinkronisasi Firestore
  const handleSaveInspeksi = () => {
    if (!newInspeksiName.trim() || !newInspeksiAddress.trim()) {
      triggerToast('⚠️ Nama gedung dan alamat wajib diisi!');
      return;
    }

    if (editingInspeksi) {
      const updatedItem: InspeksiItem = {
        ...editingInspeksi,
        name: newInspeksiName,
        date: newInspeksiDate,
        status: newInspeksiStatus,
        address: newInspeksiAddress,
        notes: newInspeksiNotes || 'Tidak ada catatan tambahan.',
        image: newInspeksiImage || editingInspeksi.image
      };
      setInspeksiList(prev => {
        const next = sortByDateDesc(prev.map(i => i.id === editingInspeksi.id ? updatedItem : i));
        localStorage.setItem('damkar_inspeksi', JSON.stringify(next));
        return next;
      });
      setDoc(doc(db, 'inspeksi', editingInspeksi.id), updatedItem)
        .then(() => triggerToast(`✅ Berhasil memperbarui inspeksi ${newInspeksiName}`))
        .catch(() => triggerToast(`✅ Inspeksi ${newInspeksiName} diperbarui (tersimpan di lokal)`));
      setEditingInspeksi(null);
    } else {
      const newId = `INS-${Date.now().toString().slice(-4)}`;
      const newItem: InspeksiItem = {
        id: newId,
        name: newInspeksiName,
        date: newInspeksiDate,
        status: newInspeksiStatus,
        address: newInspeksiAddress,
        notes: newInspeksiNotes || 'Tidak ada catatan tambahan.',
        image: newInspeksiImage || undefined
      };
      setInspeksiList(prev => {
        const next = sortByDateDesc([newItem, ...prev]);
        localStorage.setItem('damkar_inspeksi', JSON.stringify(next));
        return next;
      });
      setDoc(doc(db, 'inspeksi', newId), newItem)
        .then(() => triggerToast(`✅ Berhasil menambahkan inspeksi ${newInspeksiName}`))
        .catch(() => triggerToast(`✅ Inspeksi ${newInspeksiName} ditambahkan (tersimpan di lokal)`));
    }
    
    setNewInspeksiName('');
    setNewInspeksiAddress('');
    setNewInspeksiNotes('');
    setNewInspeksiImage('');
    setShowInspeksiModal(false);
  };

  const handleSaveVolunteer = () => {
    if (!newVolName.trim() || !newVolPhone.trim()) {
      triggerToast('⚠️ Nama relawan dan nomor HP wajib diisi!');
      return;
    }

    if (editingVolunteer) {
      const updatedItem: RedkarVolunteer = {
        ...editingVolunteer,
        name: newVolName,
        subdistrict: newVolSubdistrict,
        phone: newVolPhone,
        role: newVolRole,
        status: newVolStatus,
        joinDate: newVolJoinDate,
        image: newVolImage || editingVolunteer.image
      };
      setVolunteers(prev => {
        const next = prev.map(v => v.id === editingVolunteer.id ? updatedItem : v);
        next.sort((a, b) => a.id.localeCompare(b.id));
        localStorage.setItem('damkar_volunteers', JSON.stringify(next));
        return next;
      });
      setDoc(doc(db, 'volunteers', editingVolunteer.id), updatedItem)
        .then(() => triggerToast(`✅ Berhasil memperbarui relawan ${newVolName}`))
        .catch(() => triggerToast(`✅ Relawan ${newVolName} diperbarui (tersimpan di lokal)`));
      setDoc(doc(db, 'redkar', editingVolunteer.id), updatedItem).catch(() => {});
      setEditingVolunteer(null);
    } else {
      const newId = `RED-${Date.now().toString().slice(-4)}`;
      const newItem: RedkarVolunteer = {
        id: newId,
        name: newVolName,
        subdistrict: newVolSubdistrict,
        phone: newVolPhone,
        role: newVolRole,
        status: newVolStatus,
        joinDate: newVolJoinDate,
        image: newVolImage || undefined
      };
      setVolunteers(prev => {
        const next = [...prev, newItem];
        next.sort((a, b) => a.id.localeCompare(b.id));
        localStorage.setItem('damkar_volunteers', JSON.stringify(next));
        return next;
      });
      setDoc(doc(db, 'volunteers', newId), newItem)
        .then(() => triggerToast(`🎉 Selamat bergabung, ${newVolName} sebagai Relawan REDKAR Bima!`))
        .catch(() => triggerToast(`🎉 Relawan ${newVolName} tersimpan di lokal!`));
      setDoc(doc(db, 'redkar', newId), newItem).catch(() => {});
    }

    setNewVolName('');
    setNewVolPhone('');
    setNewVolImage('');
    setShowRedkarModal(false);
  };

  const handleSaveSocialization = () => {
    if (!newSocialTitle.trim() || !newSocialLocation.trim()) {
      triggerToast('⚠️ Judul dan lokasi kegiatan wajib diisi!');
      return;
    }

    if (editingSocialization) {
      const updatedItem: SocializationRecap = {
        ...editingSocialization,
        title: newSocialTitle,
        date: newSocialDate,
        location: newSocialLocation,
        participants: Number(newSocialParticipants),
        speaker: newSocialSpeaker,
        description: newSocialDescription,
        image: newSocialImage || editingSocialization.image
      };
      setSocializations(prev => {
        const next = sortByDateDesc(prev.map(s => s.id === editingSocialization.id ? updatedItem : s));
        localStorage.setItem('damkar_socializations', JSON.stringify(next));
        return next;
      });
      setDoc(doc(db, 'socializations', editingSocialization.id), updatedItem)
        .then(() => triggerToast(`✅ Berhasil memperbarui kegiatan ${newSocialTitle}`))
        .catch(() => triggerToast(`✅ Kegiatan ${newSocialTitle} diperbarui (tersimpan di lokal)`));
      setDoc(doc(db, 'pemberdayaan', editingSocialization.id), updatedItem).catch(() => {});
      setEditingSocialization(null);
    } else {
      const newId = `SOC-${Date.now().toString().slice(-4)}`;
      const newItem: SocializationRecap = {
        id: newId,
        title: newSocialTitle,
        date: newSocialDate,
        location: newSocialLocation,
        participants: Number(newSocialParticipants),
        speaker: newSocialSpeaker,
        description: newSocialDescription,
        image: newSocialImage || undefined
      };
      setSocializations(prev => {
        const next = sortByDateDesc([newItem, ...prev]);
        localStorage.setItem('damkar_socializations', JSON.stringify(next));
        return next;
      });
      setDoc(doc(db, 'socializations', newId), newItem)
        .then(() => triggerToast(`✅ Kegiatan ${newSocialTitle} berhasil dibuat`))
        .catch(() => triggerToast(`✅ Kegiatan ${newSocialTitle} tersimpan di lokal`));
      setDoc(doc(db, 'pemberdayaan', newId), newItem).catch(() => {});
    }

    setNewSocialTitle('');
    setNewSocialLocation('');
    setNewSocialSpeaker('');
    setNewSocialDescription('');
    setNewSocialImage('');
    setShowSocializationModal(false);
  };

  const handleSaveMaterial = () => {
    if (!newMaterialTitle.trim() || !newMaterialDescription.trim()) {
      triggerToast('⚠️ Judul kegiatan dan ringkasan wajib diisi!');
      return;
    }

    if (editingMaterial) {
      const updatedItem: PembinaanActivity = {
        ...editingMaterial,
        title: newMaterialTitle.trim(),
        category: newMaterialCategory,
        date: newMaterialDate || getTodayInputDate(),
        description: newMaterialDescription.trim(),
        image: newMaterialImage || undefined,
        shortDesc: newMaterialDescription.trim().slice(0, 100)
      };
      setPembinaanMaterials(prev => {
        const next = sortByDateDesc(prev.map(m => m.id === editingMaterial.id ? updatedItem : m));
        localStorage.setItem('damkar_pembinaan', JSON.stringify(next));
        return next;
      });
      setDoc(doc(db, 'pembinaanMaterials', editingMaterial.id), updatedItem)
        .then(() => triggerToast(`✅ Berhasil memperbarui laporan ${newMaterialTitle}`))
        .catch(() => triggerToast(`✅ Laporan ${newMaterialTitle} diperbarui (tersimpan di lokal)`));
      setDoc(doc(db, 'pembinaan', editingMaterial.id), updatedItem).catch(() => {});
      setEditingMaterial(null);
    } else {
      const newId = `AP-${Date.now().toString().slice(-4)}`;
      const newItem: PembinaanActivity = {
        id: newId,
        title: newMaterialTitle.trim(),
        category: newMaterialCategory,
        date: newMaterialDate || getTodayInputDate(),
        description: newMaterialDescription.trim(),
        image: newMaterialImage || undefined,
        shortDesc: newMaterialDescription.trim().slice(0, 100)
      };
      setPembinaanMaterials(prev => {
        const next = sortByDateDesc([newItem, ...prev]);
        localStorage.setItem('damkar_pembinaan', JSON.stringify(next));
        return next;
      });
      setDoc(doc(db, 'pembinaanMaterials', newId), newItem)
        .then(() => triggerToast(`✅ Laporan ${newMaterialTitle} berhasil ditambahkan`))
        .catch(() => triggerToast(`✅ Laporan ${newMaterialTitle} tersimpan di lokal`));
      setDoc(doc(db, 'pembinaan', newId), newItem).catch(() => {});
    }

    setNewMaterialTitle('');
    setNewMaterialCategory('Pembinaan Aparatur Kebakaran');
    setNewMaterialDate(getTodayInputDate());
    setNewMaterialDescription('');
    setNewMaterialImage('');
    setShowPembinaanModal(false);
  };

  const handleSaveNspm = () => {
    if (!newNspmTitle.trim()) {
      triggerToast('⚠️ Judul regulasi wajib diisi!');
      return;
    }
    if (!newNspmDriveUrl.trim()) {
      triggerToast('⚠️ Link dokumen / Google Drive wajib diisi!');
      return;
    }

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
        localStorage.setItem('damkar_nspm', JSON.stringify(next));
        return next;
      });
      setDoc(doc(db, 'nspmDocs', editingNspm.id), updatedItem)
        .then(() => triggerToast(`✅ Berhasil memperbarui regulasi ${newNspmTitle}`))
        .catch(() => triggerToast(`✅ Regulasi ${newNspmTitle} diperbarui (tersimpan di lokal)`));
      setDoc(doc(db, 'nspm', editingNspm.id), updatedItem).catch(() => {});
      setEditingNspm(null);
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
        localStorage.setItem('damkar_nspm', JSON.stringify(next));
        return next;
      });
      setDoc(doc(db, 'nspmDocs', newId), newItem)
        .then(() => triggerToast(`✅ Regulasi ${newNspmTitle} berhasil ditambahkan`))
        .catch(() => triggerToast(`✅ Regulasi ${newNspmTitle} tersimpan di lokal`));
      setDoc(doc(db, 'nspm', newId), newItem).catch(() => {});
    }

    setNewNspmTitle('');
    setNewNspmCategory('PERDA');
    setNewNspmDriveUrl('');
    setNewNspmSummary('');
    setShowNspmModal(false);
  };

  const handleConfirmDelete = () => {
    if (!confirmDeleteTarget) return;
    const { type, id, name } = confirmDeleteTarget;

    // Optimistic removal from React state & localStorage
    if (type === 'inspeksi') {
      setInspeksiList(prev => {
        const next = prev.filter(i => i.id !== id);
        localStorage.setItem('damkar_inspeksi', JSON.stringify(next));
        return next;
      });
      deleteDoc(doc(db, 'inspeksi', id)).catch(() => {});
    } else if (type === 'socialization') {
      setSocializations(prev => {
        const next = prev.filter(s => s.id !== id);
        localStorage.setItem('damkar_socializations', JSON.stringify(next));
        return next;
      });
      deleteDoc(doc(db, 'socializations', id)).catch(() => {});
      deleteDoc(doc(db, 'pemberdayaan', id)).catch(() => {});
    } else if (type === 'redkar') {
      setVolunteers(prev => {
        const next = prev.filter(v => v.id !== id);
        localStorage.setItem('damkar_volunteers', JSON.stringify(next));
        return next;
      });
      deleteDoc(doc(db, 'volunteers', id)).catch(() => {});
      deleteDoc(doc(db, 'redkar', id)).catch(() => {});
    } else if (type === 'pembinaan') {
      setPembinaanMaterials(prev => {
        const next = prev.filter(m => m.id !== id);
        localStorage.setItem('damkar_pembinaan', JSON.stringify(next));
        return next;
      });
      deleteDoc(doc(db, 'pembinaanMaterials', id)).catch(() => {});
      deleteDoc(doc(db, 'pembinaan', id)).catch(() => {});
    } else if (type === 'nspm') {
      setNspmDocs(prev => {
        const next = prev.filter(n => n.id !== id);
        localStorage.setItem('damkar_nspm', JSON.stringify(next));
        return next;
      });
      deleteDoc(doc(db, 'nspmDocs', id)).catch(() => {});
      deleteDoc(doc(db, 'nspm', id)).catch(() => {});
    }

    triggerToast(`🗑️ Data "${name}" berhasil dihapus`);
    setConfirmDeleteTarget(null);
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
                const headers = ['ID Inspeksi', 'Nama Gedung', 'Tanggal Cek', 'Status', 'Alamat', 'Catatan'];
                const keys = ['id', 'name', 'date', 'status', 'address', 'notes'];
                exportToExcel(inspeksiList, 'Data_Inspeksi_Proteksi_Damkar_Bima', headers, keys);
              }}
              onExportSocialization={() => {
                const headers = ['ID Kegiatan', 'Judul', 'Tanggal', 'Lokasi', 'Peserta', 'Pemateri', 'Deskripsi'];
                const keys = ['id', 'title', 'date', 'location', 'participants', 'speaker', 'description'];
                exportToExcel(socializations, 'Data_Sosialisasi_Damkar_Bima', headers, keys);
              }}
              onExportRedkar={() => {
                const headers = ['ID Relawan', 'Nama Lengkap', 'Kecamatan', 'Telepon', 'Peran', 'Status', 'Tanggal'];
                const keys = ['id', 'name', 'subdistrict', 'phone', 'role', 'status', 'joinDate'];
                exportToExcel(volunteers, 'Data_Relawan_REDKAR_Bima', headers, keys);
              }}
              isAdmin={isAdmin}
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
                const headers = ['ID Inspeksi', 'Nama Gedung', 'Tanggal Cek', 'Status', 'Alamat', 'Catatan'];
                const keys = ['id', 'name', 'date', 'status', 'address', 'notes'];
                exportToExcel(inspeksiList, 'Data_Inspeksi_Proteksi_Damkar_Bima', headers, keys);
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
                const headers = ['ID Kegiatan', 'Judul', 'Tanggal', 'Lokasi', 'Peserta', 'Pemateri', 'Deskripsi'];
                const keys = ['id', 'title', 'date', 'location', 'participants', 'speaker', 'description'];
                exportToExcel(socializations, 'Data_Sosialisasi_Damkar_Bima', headers, keys);
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
                const headers = ['ID Relawan', 'Nama Lengkap', 'Kelurahan Penugasan', 'Telepon', 'Peran', 'Status', 'Tanggal'];
                const keys = ['id', 'name', 'subdistrict', 'phone', 'role', 'status', 'joinDate'];
                exportToExcel(volunteers, 'Data_Relawan_REDKAR_Bima', headers, keys);
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
                const headers = ['ID Kegiatan', 'Judul Kegiatan', 'Kategori', 'Tanggal Pelaksanaan', 'Deskripsi Ringkasan'];
                const keys = ['id', 'title', 'category', 'date', 'description'];
                exportToExcel(pembinaanMaterials, 'Laporan_Pembinaan_Aparatur_Kota_Bima', headers, keys);
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
        showAdminLoginModal={showAdminLoginModal}
        onCloseAdminLogin={() => setShowAdminLoginModal(false)}
        adminUsername={adminUsername}
        setAdminUsername={setAdminUsername}
        adminPassword={adminPassword}
        setAdminPassword={setAdminPassword}
        loginError={loginError}
        onAdminLoginSubmit={handleAdminLogin}

        showInspeksiModal={showInspeksiModal}
        onCloseInspeksiModal={() => setShowInspeksiModal(false)}
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
        onCloseRedkarModal={() => setShowRedkarModal(false)}
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
        onCloseSocializationModal={() => setShowSocializationModal(false)}
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
        onClosePembinaanModal={() => setShowPembinaanModal(false)}
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
        onCloseNspmModal={() => setShowNspmModal(false)}
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
