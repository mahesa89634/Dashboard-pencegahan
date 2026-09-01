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
import { InspeksiItem, SocializationRecap, RedkarVolunteer, AparaturMaterial, NspmDocument } from './types';
import { db } from './firebase';
import { collection, onSnapshot, doc, setDoc, deleteDoc, writeBatch } from 'firebase/firestore';
import { compressImageFile, formatBytes } from './utils/imageCompressor';

export default function App() {
  // Navigation & UI state
  const [currentView, setCurrentView] = useState<string>('home');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');

  // Primary Data States
  const [inspeksiList, setInspeksiList] = useState<InspeksiItem[]>(initialInspeksiList);
  const [socializations, setSocializations] = useState<SocializationRecap[]>(initialSocializationRecaps);
  const [volunteers, setVolunteers] = useState<RedkarVolunteer[]>(initialRedkarVolunteers);
  const [pembinaanMaterials, setPembinaanMaterials] = useState<AparaturMaterial[]>(aparaturMaterials);
  const [nspmDocs, setNspmDocs] = useState<NspmDocument[]>(nspmDocuments);

  // Firestore Real-time Listeners
  useEffect(() => {
    // 1. Inspeksi List
    const unsubInspeksi = onSnapshot(collection(db, 'inspeksi'), async (snapshot) => {
      if (snapshot.empty) {
        const batch = writeBatch(db);
        initialInspeksiList.forEach((item) => {
          const docRef = doc(db, 'inspeksi', item.id);
          batch.set(docRef, item);
        });
        await batch.commit();
      } else {
        const list: InspeksiItem[] = [];
        snapshot.forEach((doc) => {
          list.push(doc.data() as InspeksiItem);
        });
        list.sort((a, b) => a.id.localeCompare(b.id));
        setInspeksiList(list);
      }
    });

    // 2. Socializations
    const unsubSocializations = onSnapshot(collection(db, 'socializations'), async (snapshot) => {
      if (snapshot.empty) {
        const batch = writeBatch(db);
        initialSocializationRecaps.forEach((item) => {
          const docRef = doc(db, 'socializations', item.id);
          batch.set(docRef, item);
        });
        await batch.commit();
      } else {
        const list: SocializationRecap[] = [];
        snapshot.forEach((doc) => {
          list.push(doc.data() as SocializationRecap);
        });
        list.sort((a, b) => a.id.localeCompare(b.id));
        setSocializations(list);
      }
    });

    // 3. Volunteers
    const unsubVolunteers = onSnapshot(collection(db, 'volunteers'), async (snapshot) => {
      if (snapshot.empty) {
        const batch = writeBatch(db);
        initialRedkarVolunteers.forEach((item) => {
          const docRef = doc(db, 'volunteers', item.id);
          batch.set(docRef, item);
        });
        await batch.commit();
      } else {
        const list: RedkarVolunteer[] = [];
        snapshot.forEach((doc) => {
          list.push(doc.data() as RedkarVolunteer);
        });
        list.sort((a, b) => a.id.localeCompare(b.id));
        setVolunteers(list);
      }
    });

    // 4. Pembinaan Materials
    const unsubPembinaan = onSnapshot(collection(db, 'pembinaanMaterials'), async (snapshot) => {
      if (snapshot.empty) {
        const batch = writeBatch(db);
        aparaturMaterials.forEach((item) => {
          const docRef = doc(db, 'pembinaanMaterials', item.id);
          batch.set(docRef, item);
        });
        await batch.commit();
      } else {
        const list: AparaturMaterial[] = [];
        snapshot.forEach((doc) => {
          list.push(doc.data() as AparaturMaterial);
        });
        list.sort((a, b) => a.id.localeCompare(b.id));
        setPembinaanMaterials(list);
      }
    });

    // 5. NSPM Docs
    const unsubNspm = onSnapshot(collection(db, 'nspmDocs'), async (snapshot) => {
      if (snapshot.empty) {
        const batch = writeBatch(db);
        nspmDocuments.forEach((item) => {
          const docRef = doc(db, 'nspmDocs', item.id);
          batch.set(docRef, item);
        });
        await batch.commit();
      } else {
        const list: NspmDocument[] = [];
        snapshot.forEach((doc) => {
          list.push(doc.data() as NspmDocument);
        });
        list.sort((a, b) => a.id.localeCompare(b.id));
        setNspmDocs(list);
      }
    });

    return () => {
      unsubInspeksi();
      unsubSocializations();
      unsubVolunteers();
      unsubPembinaan();
      unsubNspm();
    };
  }, []);

  // Admin Authentication State
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [showAdminLoginModal, setShowAdminLoginModal] = useState<boolean>(false);
  const [adminUsername, setAdminUsername] = useState<string>('');
  const [adminPassword, setAdminPassword] = useState<string>('');
  const [loginError, setLoginError] = useState<string>('');
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3500);
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

  // Form Modal States
  const [showInspeksiModal, setShowInspeksiModal] = useState<boolean>(false);
  const [editingInspeksi, setEditingInspeksi] = useState<InspeksiItem | null>(null);
  const [newInspeksiName, setNewInspeksiName] = useState<string>('');
  const [newInspeksiStatus, setNewInspeksiStatus] = useState<'Perlu Perbaikan' | 'Kritis' | 'Aman'>('Perlu Perbaikan');
  const [newInspeksiAddress, setNewInspeksiAddress] = useState<string>('');
  const [newInspeksiNotes, setNewInspeksiNotes] = useState<string>('');
  const [newInspeksiDate, setNewInspeksiDate] = useState<string>('10 Jun 2026');
  const [newInspeksiImage, setNewInspeksiImage] = useState<string>('');

  const [showRedkarModal, setShowRedkarModal] = useState<boolean>(false);
  const [editingVolunteer, setEditingVolunteer] = useState<RedkarVolunteer | null>(null);
  const [newVolName, setNewVolName] = useState<string>('');
  const [newVolSubdistrict, setNewVolSubdistrict] = useState<string>('Rasanae Barat');
  const [newVolPhone, setNewVolPhone] = useState<string>('');
  const [newVolRole, setNewVolRole] = useState<string>('Petugas Penyelamat');
  const [newVolStatus, setNewVolStatus] = useState<'Aktif' | 'Pelatihan' | 'Siaga'>('Aktif');
  const [newVolJoinDate, setNewVolJoinDate] = useState<string>('10 Jun 2026');
  const [newVolImage, setNewVolImage] = useState<string>('');

  const [showSocializationModal, setShowSocializationModal] = useState<boolean>(false);
  const [editingSocialization, setEditingSocialization] = useState<SocializationRecap | null>(null);
  const [newSocialTitle, setNewSocialTitle] = useState<string>('');
  const [newSocialLocation, setNewSocialLocation] = useState<string>('');
  const [newSocialParticipants, setNewSocialParticipants] = useState<number>(30);
  const [newSocialSpeaker, setNewSocialSpeaker] = useState<string>('');
  const [newSocialDescription, setNewSocialDescription] = useState<string>('');
  const [newSocialDate, setNewSocialDate] = useState<string>('10 Jun 2026');
  const [newSocialImage, setNewSocialImage] = useState<string>('');

  const [showPembinaanModal, setShowPembinaanModal] = useState<boolean>(false);
  const [editingMaterial, setEditingMaterial] = useState<AparaturMaterial | null>(null);
  const [newMaterialTitle, setNewMaterialTitle] = useState<string>('');
  const [newMaterialCategory, setNewMaterialCategory] = useState<'Penerapan Core Values BerAKHLAK' | 'Target SKP'>('Penerapan Core Values BerAKHLAK');
  const [newMaterialShortDesc, setNewMaterialShortDesc] = useState<string>('');
  const [newMaterialContent, setNewMaterialContent] = useState<string>('');
  const [newMaterialTips, setNewMaterialTips] = useState<string>('');

  const [showNspmModal, setShowNspmModal] = useState<boolean>(false);
  const [editingNspm, setEditingNspm] = useState<NspmDocument | null>(null);
  const [newNspmTitle, setNewNspmTitle] = useState<string>('');
  const [newNspmCategory, setNewNspmCategory] = useState<'Norma' | 'Standar' | 'Prosedur' | 'Manual'>('Norma');
  const [newNspmCode, setNewNspmCode] = useState<string>('');
  const [newNspmSummary, setNewNspmSummary] = useState<string>('');
  const [newNspmFileSize, setNewNspmFileSize] = useState<string>('1.2 MB');

  // Delete Confirmation State
  const [confirmDeleteTarget, setConfirmDeleteTarget] = useState<{
    type: 'inspeksi' | 'socialization' | 'redkar' | 'pembinaan' | 'nspm';
    id: string;
    name: string;
  } | null>(null);

  // NSPM Download Progress Simulation
  const [downloadProgress, setDownloadProgress] = useState<Record<string, number>>({});

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
    const bom = '\uFEFF';
    const csvContent = data.map(item => {
      return keys.map(key => {
        let val = item[key];
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

  // CRUD Save Handlers
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
      setDoc(doc(db, 'inspeksi', editingInspeksi.id), updatedItem)
        .then(() => triggerToast(`✅ Berhasil memperbarui inspeksi ${newInspeksiName}`))
        .catch(err => triggerToast(`⚠️ Gagal menyimpan: ${err.message}`));
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
      setDoc(doc(db, 'inspeksi', newId), newItem)
        .then(() => triggerToast(`✅ Berhasil menambahkan inspeksi ${newInspeksiName}`))
        .catch(err => triggerToast(`⚠️ Gagal menyimpan: ${err.message}`));
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
      setDoc(doc(db, 'volunteers', editingVolunteer.id), updatedItem)
        .then(() => triggerToast(`✅ Berhasil memperbarui relawan ${newVolName}`))
        .catch(err => triggerToast(`⚠️ Gagal menyimpan: ${err.message}`));
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
      setDoc(doc(db, 'volunteers', newId), newItem)
        .then(() => triggerToast(`🎉 Selamat bergabung, ${newVolName} sebagai Relawan REDKAR Bima!`))
        .catch(err => triggerToast(`⚠️ Gagal menyimpan: ${err.message}`));
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
      setDoc(doc(db, 'socializations', editingSocialization.id), updatedItem)
        .then(() => triggerToast(`✅ Berhasil memperbarui kegiatan ${newSocialTitle}`))
        .catch(err => triggerToast(`⚠️ Gagal menyimpan: ${err.message}`));
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
      setDoc(doc(db, 'socializations', newId), newItem)
        .then(() => triggerToast(`✅ Kegiatan ${newSocialTitle} berhasil dibuat`))
        .catch(err => triggerToast(`⚠️ Gagal menyimpan: ${err.message}`));
    }

    setNewSocialTitle('');
    setNewSocialLocation('');
    setNewSocialSpeaker('');
    setNewSocialDescription('');
    setNewSocialImage('');
    setShowSocializationModal(false);
  };

  const handleSaveMaterial = () => {
    if (!newMaterialTitle.trim() || !newMaterialShortDesc.trim()) {
      triggerToast('⚠️ Judul materi dan ringkasan wajib diisi!');
      return;
    }

    const contentArray = newMaterialContent.split('\n').filter(line => line.trim() !== '');
    const tipsArray = newMaterialTips.split('\n').filter(line => line.trim() !== '');

    if (editingMaterial) {
      const updatedItem: AparaturMaterial = {
        ...editingMaterial,
        title: newMaterialTitle,
        category: newMaterialCategory,
        shortDesc: newMaterialShortDesc,
        content: contentArray,
        tips: tipsArray
      };
      setDoc(doc(db, 'pembinaanMaterials', editingMaterial.id), updatedItem)
        .then(() => triggerToast(`✅ Berhasil memperbarui materi ${newMaterialTitle}`))
        .catch(err => triggerToast(`⚠️ Gagal menyimpan: ${err.message}`));
      setEditingMaterial(null);
    } else {
      const newId = `AP-${Date.now().toString().slice(-4)}`;
      const newItem: AparaturMaterial = {
        id: newId,
        title: newMaterialTitle,
        category: newMaterialCategory,
        shortDesc: newMaterialShortDesc,
        content: contentArray,
        tips: tipsArray
      };
      setDoc(doc(db, 'pembinaanMaterials', newId), newItem)
        .then(() => triggerToast(`✅ Materi ${newMaterialTitle} berhasil dibuat`))
        .catch(err => triggerToast(`⚠️ Gagal menyimpan: ${err.message}`));
    }

    setNewMaterialTitle('');
    setNewMaterialShortDesc('');
    setNewMaterialContent('');
    setNewMaterialTips('');
    setShowPembinaanModal(false);
  };

  const handleSaveNspm = () => {
    if (!newNspmTitle.trim() || !newNspmCode.trim()) {
      triggerToast('⚠️ Judul dokumen dan kode NSPM wajib diisi!');
      return;
    }

    if (editingNspm) {
      const updatedItem: NspmDocument = {
        ...editingNspm,
        title: newNspmTitle,
        category: newNspmCategory,
        code: newNspmCode,
        summary: newNspmSummary,
        fileSize: newNspmFileSize
      };
      setDoc(doc(db, 'nspmDocs', editingNspm.id), updatedItem)
        .then(() => triggerToast(`✅ Berhasil memperbarui NSPM ${newNspmTitle}`))
        .catch(err => triggerToast(`⚠️ Gagal menyimpan: ${err.message}`));
      setEditingNspm(null);
    } else {
      const newId = `NSPM-${Date.now().toString().slice(-4)}`;
      const newItem: NspmDocument = {
        id: newId,
        title: newNspmTitle,
        category: newNspmCategory,
        code: newNspmCode,
        summary: newNspmSummary,
        fileSize: newNspmFileSize
      };
      setDoc(doc(db, 'nspmDocs', newId), newItem)
        .then(() => triggerToast(`✅ Dokumen NSPM ${newNspmTitle} berhasil ditambahkan`))
        .catch(err => triggerToast(`⚠️ Gagal menyimpan: ${err.message}`));
    }

    setNewNspmTitle('');
    setNewNspmCode('');
    setNewNspmSummary('');
    setShowNspmModal(false);
  };

  const handleConfirmDelete = () => {
    if (!confirmDeleteTarget) return;
    const { type, id, name } = confirmDeleteTarget;

    const collectionMap: Record<string, string> = {
      inspeksi: 'inspeksi',
      socialization: 'socializations',
      redkar: 'volunteers',
      pembinaan: 'pembinaanMaterials',
      nspm: 'nspmDocs'
    };

    const colName = collectionMap[type];
    if (colName) {
      deleteDoc(doc(db, colName, id))
        .then(() => {
          triggerToast(`🗑️ Data "${name}" berhasil dihapus`);
        })
        .catch((err) => {
          console.error("Error deleting from Firestore:", err);
          triggerToast(`⚠️ Gagal menghapus data: ${err.message}`);
        });
    }

    setConfirmDeleteTarget(null);
  };

  const handleDownloadNspm = (id: string, name: string) => {
    if (downloadProgress[id]) return;
    setDownloadProgress(prev => ({ ...prev, [id]: 15 }));
    
    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        const current = prev[id] || 0;
        if (current >= 100) {
          clearInterval(interval);
          triggerToast(`💾 Dokumen "${name}" telah berhasil diunduh.`);
          return { ...prev, [id]: 100 };
        }
        return { ...prev, [id]: current + 25 };
      });
    }, 250);
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
                setNewInspeksiDate('10 Jun 2026');
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
                setNewVolJoinDate('10 Jun 2026');
                setShowRedkarModal(true);
              })}
              onOpenSocializationModal={() => ensureAdmin(() => {
                setEditingSocialization(null);
                setNewSocialTitle('');
                setNewSocialLocation('');
                setNewSocialParticipants(35);
                setNewSocialSpeaker('Kasi Edukasi Damkarmat');
                setNewSocialDescription('');
                setNewSocialDate('10 Jun 2026');
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
                setNewInspeksiDate('10 Jun 2026');
                setNewInspeksiImage('');
                setShowInspeksiModal(true);
              })}
              onEditInspeksi={(item) => ensureAdmin(() => {
                setEditingInspeksi(item);
                setNewInspeksiName(item.name);
                setNewInspeksiStatus(item.status);
                setNewInspeksiAddress(item.address);
                setNewInspeksiNotes(item.notes || '');
                setNewInspeksiDate(item.date);
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
                setNewSocialDate('10 Jun 2026');
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
                setNewSocialDate(item.date);
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
            />
          )}

          {currentView === 'redkar' && (
            <RedkarView
              volunteers={volunteers}
              onOpenAddModal={() => ensureAdmin(() => {
                setEditingVolunteer(null);
                setNewVolName('');
                setNewVolSubdistrict('Rasanae Barat');
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
                const headers = ['ID Relawan', 'Nama Lengkap', 'Kecamatan', 'Telepon', 'Peran', 'Status', 'Tanggal'];
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
                setNewMaterialCategory('Penerapan Core Values BerAKHLAK');
                setNewMaterialShortDesc('');
                setNewMaterialContent('');
                setNewMaterialTips('');
                setShowPembinaanModal(true);
              })}
              onEditMaterial={(item) => ensureAdmin(() => {
                setEditingMaterial(item);
                setNewMaterialTitle(item.title);
                setNewMaterialCategory(item.category);
                setNewMaterialShortDesc(item.shortDesc);
                setNewMaterialContent(item.content.join('\n'));
                setNewMaterialTips(item.tips.join('\n'));
                setShowPembinaanModal(true);
              })}
              onDeleteMaterial={(id, name) => ensureAdmin(() => {
                setConfirmDeleteTarget({ type: 'pembinaan', id, name });
              })}
              isAdmin={isAdmin}
            />
          )}

          {currentView === 'nspm' && (
            <NspmView
              nspmDocs={nspmDocs}
              onOpenAddModal={() => ensureAdmin(() => {
                setEditingNspm(null);
                setNewNspmTitle('');
                setNewNspmCategory('Norma');
                setNewNspmCode('');
                setNewNspmSummary('');
                setNewNspmFileSize('1.2 MB');
                setShowNspmModal(true);
              })}
              onEditNspm={(item) => ensureAdmin(() => {
                setEditingNspm(item);
                setNewNspmTitle(item.title);
                setNewNspmCategory(item.category);
                setNewNspmCode(item.code);
                setNewNspmSummary(item.summary);
                setNewNspmFileSize(item.fileSize);
                setShowNspmModal(true);
              })}
              onDeleteNspm={(id, name) => ensureAdmin(() => {
                setConfirmDeleteTarget({ type: 'nspm', id, name });
              })}
              onDownloadNspm={handleDownloadNspm}
              downloadProgress={downloadProgress}
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
        newMaterialShortDesc={newMaterialShortDesc}
        setNewMaterialShortDesc={setNewMaterialShortDesc}
        newMaterialContent={newMaterialContent}
        setNewMaterialContent={setNewMaterialContent}
        newMaterialTips={newMaterialTips}
        setNewMaterialTips={setNewMaterialTips}
        onSaveMaterial={handleSaveMaterial}

        showNspmModal={showNspmModal}
        onCloseNspmModal={() => setShowNspmModal(false)}
        editingNspm={editingNspm}
        newNspmTitle={newNspmTitle}
        setNewNspmTitle={setNewNspmTitle}
        newNspmCategory={newNspmCategory}
        setNewNspmCategory={setNewNspmCategory}
        newNspmCode={newNspmCode}
        setNewNspmCode={setNewNspmCode}
        newNspmSummary={newNspmSummary}
        setNewNspmSummary={setNewNspmSummary}
        newNspmFileSize={newNspmFileSize}
        setNewNspmFileSize={setNewNspmFileSize}
        onSaveNspm={handleSaveNspm}

        selectedInspeksi={selectedInspeksi}
        onCloseSelectedInspeksi={() => setSelectedInspeksi(null)}
        selectedSocialization={selectedSocialization}
        onCloseSelectedSocialization={() => setSelectedSocialization(null)}

        confirmDeleteTarget={confirmDeleteTarget}
        onCloseConfirmDelete={() => setConfirmDeleteTarget(null)}
        onConfirmDelete={handleConfirmDelete}

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
