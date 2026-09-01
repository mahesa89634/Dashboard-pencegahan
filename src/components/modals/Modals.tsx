import React from 'react';
import { 
  X, 
  MapPin, 
  Calendar, 
  AlertTriangle, 
  ShieldCheck, 
  UserCheck, 
  Users, 
  Lock, 
  Trash2, 
  Building2,
  FileText,
  Clock,
  Sparkles
} from 'lucide-react';
import { InspeksiItem, SocializationRecap, RedkarVolunteer, AparaturMaterial, NspmDocument } from '../../types';
import ImageUploader from '../ImageUploader';

interface ModalsProps {
  // Admin Login
  showAdminLoginModal: boolean;
  onCloseAdminLogin: () => void;
  adminUsername: string;
  setAdminUsername: (val: string) => void;
  adminPassword: string;
  setAdminPassword: (val: string) => void;
  loginError: string;
  onAdminLoginSubmit: (e: React.FormEvent) => void;

  // Inspeksi Add/Edit
  showInspeksiModal: boolean;
  onCloseInspeksiModal: () => void;
  editingInspeksi: InspeksiItem | null;
  newInspeksiName: string;
  setNewInspeksiName: (val: string) => void;
  newInspeksiStatus: 'Perlu Perbaikan' | 'Kritis' | 'Aman';
  setNewInspeksiStatus: (val: 'Perlu Perbaikan' | 'Kritis' | 'Aman') => void;
  newInspeksiAddress: string;
  setNewInspeksiAddress: (val: string) => void;
  newInspeksiNotes: string;
  setNewInspeksiNotes: (val: string) => void;
  newInspeksiDate: string;
  setNewInspeksiDate: (val: string) => void;
  newInspeksiImage: string;
  setNewInspeksiImage: (val: string) => void;
  onSaveInspeksi: () => void;

  // Volunteer Add/Edit
  showRedkarModal: boolean;
  onCloseRedkarModal: () => void;
  editingVolunteer: RedkarVolunteer | null;
  newVolName: string;
  setNewVolName: (val: string) => void;
  newVolSubdistrict: string;
  setNewVolSubdistrict: (val: string) => void;
  newVolPhone: string;
  setNewVolPhone: (val: string) => void;
  newVolRole: string;
  setNewVolRole: (val: string) => void;
  newVolStatus: 'Aktif' | 'Pelatihan' | 'Siaga';
  setNewVolStatus: (val: 'Aktif' | 'Pelatihan' | 'Siaga') => void;
  newVolJoinDate: string;
  setNewVolJoinDate: (val: string) => void;
  newVolImage: string;
  setNewVolImage: (val: string) => void;
  onSaveVolunteer: () => void;

  // Socialization Add/Edit
  showSocializationModal: boolean;
  onCloseSocializationModal: () => void;
  editingSocialization: SocializationRecap | null;
  newSocialTitle: string;
  setNewSocialTitle: (val: string) => void;
  newSocialLocation: string;
  setNewSocialLocation: (val: string) => void;
  newSocialParticipants: number;
  setNewSocialParticipants: (val: number) => void;
  newSocialSpeaker: string;
  setNewSocialSpeaker: (val: string) => void;
  newSocialDescription: string;
  setNewSocialDescription: (val: string) => void;
  newSocialDate: string;
  setNewSocialDate: (val: string) => void;
  newSocialImage: string;
  setNewSocialImage: (val: string) => void;
  onSaveSocialization: () => void;

  // Pembinaan Material Add/Edit
  showPembinaanModal: boolean;
  onClosePembinaanModal: () => void;
  editingMaterial: AparaturMaterial | null;
  newMaterialTitle: string;
  setNewMaterialTitle: (val: string) => void;
  newMaterialCategory: 'Penerapan Core Values BerAKHLAK' | 'Target SKP';
  setNewMaterialCategory: (val: 'Penerapan Core Values BerAKHLAK' | 'Target SKP') => void;
  newMaterialShortDesc: string;
  setNewMaterialShortDesc: (val: string) => void;
  newMaterialContent: string;
  setNewMaterialContent: (val: string) => void;
  newMaterialTips: string;
  setNewMaterialTips: (val: string) => void;
  onSaveMaterial: () => void;

  // NSPM Add/Edit
  showNspmModal: boolean;
  onCloseNspmModal: () => void;
  editingNspm: NspmDocument | null;
  newNspmTitle: string;
  setNewNspmTitle: (val: string) => void;
  newNspmCategory: 'Norma' | 'Standar' | 'Prosedur' | 'Manual';
  setNewNspmCategory: (val: 'Norma' | 'Standar' | 'Prosedur' | 'Manual') => void;
  newNspmCode: string;
  setNewNspmCode: (val: string) => void;
  newNspmSummary: string;
  setNewNspmSummary: (val: string) => void;
  newNspmFileSize: string;
  setNewNspmFileSize: (val: string) => void;
  onSaveNspm: () => void;

  // Detail Modals
  selectedInspeksi: InspeksiItem | null;
  onCloseSelectedInspeksi: () => void;
  selectedSocialization: SocializationRecap | null;
  onCloseSelectedSocialization: () => void;

  // Delete Confirmation
  confirmDeleteTarget: {
    type: 'inspeksi' | 'socialization' | 'redkar' | 'pembinaan' | 'nspm';
    id: string;
    name: string;
  } | null;
  onCloseConfirmDelete: () => void;
  onConfirmDelete: () => void;

  // Toast / Image Upload helpers
  onToast: (msg: string) => void;
  onImageUpload?: (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string) => void) => void;
}

export default function Modals(props: ModalsProps) {
  const {
    showAdminLoginModal,
    onCloseAdminLogin,
    adminUsername,
    setAdminUsername,
    adminPassword,
    setAdminPassword,
    loginError,
    onAdminLoginSubmit,

    showInspeksiModal,
    onCloseInspeksiModal,
    editingInspeksi,
    newInspeksiName,
    setNewInspeksiName,
    newInspeksiStatus,
    setNewInspeksiStatus,
    newInspeksiAddress,
    setNewInspeksiAddress,
    newInspeksiNotes,
    setNewInspeksiNotes,
    newInspeksiDate,
    setNewInspeksiDate,
    newInspeksiImage,
    setNewInspeksiImage,
    onSaveInspeksi,

    showRedkarModal,
    onCloseRedkarModal,
    editingVolunteer,
    newVolName,
    setNewVolName,
    newVolSubdistrict,
    setNewVolSubdistrict,
    newVolPhone,
    setNewVolPhone,
    newVolRole,
    setNewVolRole,
    newVolStatus,
    setNewVolStatus,
    newVolJoinDate,
    setNewVolJoinDate,
    newVolImage,
    setNewVolImage,
    onSaveVolunteer,

    showSocializationModal,
    onCloseSocializationModal,
    editingSocialization,
    newSocialTitle,
    setNewSocialTitle,
    newSocialLocation,
    setNewSocialLocation,
    newSocialParticipants,
    setNewSocialParticipants,
    newSocialSpeaker,
    setNewSocialSpeaker,
    newSocialDescription,
    setNewSocialDescription,
    newSocialDate,
    setNewSocialDate,
    newSocialImage,
    setNewSocialImage,
    onSaveSocialization,

    showPembinaanModal,
    onClosePembinaanModal,
    editingMaterial,
    newMaterialTitle,
    setNewMaterialTitle,
    newMaterialCategory,
    setNewMaterialCategory,
    newMaterialShortDesc,
    setNewMaterialShortDesc,
    newMaterialContent,
    setNewMaterialContent,
    newMaterialTips,
    setNewMaterialTips,
    onSaveMaterial,

    showNspmModal,
    onCloseNspmModal,
    editingNspm,
    newNspmTitle,
    setNewNspmTitle,
    newNspmCategory,
    setNewNspmCategory,
    newNspmCode,
    setNewNspmCode,
    newNspmSummary,
    setNewNspmSummary,
    newNspmFileSize,
    setNewNspmFileSize,
    onSaveNspm,

    selectedInspeksi,
    onCloseSelectedInspeksi,
    selectedSocialization,
    onCloseSelectedSocialization,

    confirmDeleteTarget,
    onCloseConfirmDelete,
    onConfirmDelete,
    onImageUpload
  } = props;

  return (
    <>
      {/* 1. ADMIN LOGIN MODAL */}
      {showAdminLoginModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-scaleUp">
            <div className="p-5 bg-gradient-to-r from-slate-900 to-[#1A237E] text-white flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-400/30">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base">Otentikasi Admin</h3>
                  <p className="text-[11px] text-slate-300">Masuk untuk mengelola data Damkarmat</p>
                </div>
              </div>
              <button 
                onClick={onCloseAdminLogin} 
                className="p-1 hover:bg-white/10 rounded-full text-slate-300 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={onAdminLoginSubmit} className="p-6 space-y-4">
              {loginError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-bold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{loginError}</span>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Username Admin</label>
                <input
                  type="text"
                  required
                  value={adminUsername}
                  onChange={(e) => setAdminUsername(e.target.value)}
                  placeholder="Masukkan username..."
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#1A237E]/20 focus:border-[#1A237E] outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Password</label>
                <input
                  type="password"
                  required
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="Masukkan password..."
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#1A237E]/20 focus:border-[#1A237E] outline-none"
                />
              </div>

              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-[11px] text-slate-500">
                <span>Akun Administrator Resmi: </span>
                <span className="font-mono font-bold text-slate-700">Yugho114</span>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onCloseAdminLogin}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#1A237E] hover:bg-[#283593] text-white text-xs font-bold rounded-xl transition-all shadow-md active:scale-95"
                >
                  Masuk Sekarang
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. INSPEKSI ADD/EDIT MODAL */}
      {showInspeksiModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl my-8">
            <div className="p-5 bg-gradient-to-r from-red-700 to-[#1A237E] text-white flex justify-between items-center">
              <h3 className="font-extrabold text-base">
                {editingInspeksi ? `Ubah Laporan: ${editingInspeksi.name}` : 'Tambah Laporan Inspeksi Gedung'}
              </h3>
              <button onClick={onCloseInspeksiModal} className="p-1 hover:bg-white/10 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Nama Gedung / Objek Vital</label>
                <input
                  type="text"
                  value={newInspeksiName}
                  onChange={(e) => setNewInspeksiName(e.target.value)}
                  placeholder="Contoh: RSUD Kota Bima, Pasar Raya Bima"
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Status Kelayakan</label>
                  <select
                    value={newInspeksiStatus}
                    onChange={(e) => setNewInspeksiStatus(e.target.value as any)}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs outline-none bg-white"
                  >
                    <option value="Perlu Perbaikan">Perlu Perbaikan</option>
                    <option value="Kritis">Kritis</option>
                    <option value="Aman">Aman</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Tanggal Pemeriksaan</label>
                  <input
                    type="text"
                    value={newInspeksiDate}
                    onChange={(e) => setNewInspeksiDate(e.target.value)}
                    placeholder="Contoh: 10 Jun 2026"
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Alamat Lengkap & Kecamatan</label>
                <input
                  type="text"
                  value={newInspeksiAddress}
                  onChange={(e) => setNewInspeksiAddress(e.target.value)}
                  placeholder="Contoh: Jl. Soekarno-Hatta, Kec. Mpunda, Kota Bima"
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Catatan Temuan / Evaluasi</label>
                <textarea
                  rows={3}
                  value={newInspeksiNotes}
                  onChange={(e) => setNewInspeksiNotes(e.target.value)}
                  placeholder="Catatan kondisi APAR, hydrant, pompa tekanan, jalur evakuasi..."
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs outline-none"
                />
              </div>

              {/* Image Upload with Automatic Compression */}
              <ImageUploader
                label="Dokumentasi Foto Lapangan / Proteksi Gedung"
                subLabel="Otomatis di-resize maks lebar 800px & dikompresi JPEG agar &lt; 100 KB"
                value={newInspeksiImage}
                onChange={setNewInspeksiImage}
                onToast={props.onToast}
                accentColor="red"
                idPrefix="modal-inspeksi"
              />

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  onClick={onCloseInspeksiModal}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
                >
                  Batal
                </button>
                <button
                  onClick={onSaveInspeksi}
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-md"
                >
                  Simpan Laporan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. VOLUNTEER ADD/EDIT MODAL */}
      {showRedkarModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl my-8">
            <div className="p-5 bg-gradient-to-r from-amber-600 to-red-700 text-white flex justify-between items-center">
              <h3 className="font-extrabold text-base">
                {editingVolunteer ? `Ubah Data: ${editingVolunteer.name}` : 'Pendaftaran Relawan REDKAR Baru'}
              </h3>
              <button onClick={onCloseRedkarModal} className="p-1 hover:bg-white/10 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Nama Lengkap Relawan</label>
                <input
                  type="text"
                  value={newVolName}
                  onChange={(e) => setNewVolName(e.target.value)}
                  placeholder="Contoh: Ahmad Rifai"
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Kecamatan Penugasan</label>
                  <select
                    value={newVolSubdistrict}
                    onChange={(e) => setNewVolSubdistrict(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs outline-none bg-white"
                  >
                    <option value="Rasanae Barat">Rasanae Barat</option>
                    <option value="Rasanae Timur">Rasanae Timur</option>
                    <option value="Mpunda">Mpunda</option>
                    <option value="Raba">Raba</option>
                    <option value="Asakota">Asakota</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Status Keaktifan</label>
                  <select
                    value={newVolStatus}
                    onChange={(e) => setNewVolStatus(e.target.value as any)}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs outline-none bg-white"
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Siaga">Siaga</option>
                    <option value="Pelatihan">Pelatihan</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Nomor Telepon / WhatsApp</label>
                  <input
                    type="text"
                    value={newVolPhone}
                    onChange={(e) => setNewVolPhone(e.target.value)}
                    placeholder="Contoh: 0823-4567-8901"
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Peran / Spesialisasi</label>
                  <input
                    type="text"
                    value={newVolRole}
                    onChange={(e) => setNewVolRole(e.target.value)}
                    placeholder="Contoh: Koordinator Lapangan, Penyuluhan"
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs outline-none"
                  />
                </div>
              </div>

              {/* Volunteer Photo Upload */}
              <ImageUploader
                label="Foto Profil / Kartu Tanda Relawan REDKAR"
                subLabel="Otomatis di-resize maks lebar 800px & dikompres JPEG"
                value={newVolImage}
                onChange={setNewVolImage}
                onToast={props.onToast}
                accentColor="amber"
                idPrefix="modal-redkar"
              />

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  onClick={onCloseRedkarModal}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
                >
                  Batal
                </button>
                <button
                  onClick={onSaveVolunteer}
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-md"
                >
                  Simpan Relawan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. SOCIALIZATION ADD/EDIT MODAL */}
      {showSocializationModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl my-8">
            <div className="p-5 bg-gradient-to-r from-indigo-700 to-[#1A237E] text-white flex justify-between items-center">
              <h3 className="font-extrabold text-base">
                {editingSocialization ? `Ubah Kegiatan: ${editingSocialization.title}` : 'Buat Agenda Sosialisasi Baru'}
              </h3>
              <button onClick={onCloseSocializationModal} className="p-1 hover:bg-white/10 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Judul Kegiatan</label>
                <input
                  type="text"
                  value={newSocialTitle}
                  onChange={(e) => setNewSocialTitle(e.target.value)}
                  placeholder="Contoh: Edukasi Dapur Aman MBG"
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Tanggal Pelaksanaan</label>
                  <input
                    type="text"
                    value={newSocialDate}
                    onChange={(e) => setNewSocialDate(e.target.value)}
                    placeholder="Contoh: 10 Jun 2026"
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Jumlah Peserta</label>
                  <input
                    type="number"
                    value={newSocialParticipants}
                    onChange={(e) => setNewSocialParticipants(Number(e.target.value))}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Lokasi / Tempat Acara</label>
                <input
                  type="text"
                  value={newSocialLocation}
                  onChange={(e) => setNewSocialLocation(e.target.value)}
                  placeholder="Contoh: Aula Kelurahan Rasingae, Kec. Asakota"
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Pemateri / Narasumber</label>
                <input
                  type="text"
                  value={newSocialSpeaker}
                  onChange={(e) => setNewSocialSpeaker(e.target.value)}
                  placeholder="Contoh: Kasi Edukasi & Penyuluhan Damkarmat"
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Deskripsi & Rincian Materi</label>
                <textarea
                  rows={3}
                  value={newSocialDescription}
                  onChange={(e) => setNewSocialDescription(e.target.value)}
                  placeholder="Pelatihan cara penanganan kebocoran LPG, praktek APAR..."
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs outline-none"
                />
              </div>

              {/* Socialization Photo Documentation with Automatic Compression */}
              <ImageUploader
                label="Dokumentasi Foto Sosialisasi / Edukasi Warga"
                subLabel="Otomatis di-resize maks lebar 800px & dikompres JPEG agar ringan di Firestore"
                value={newSocialImage}
                onChange={setNewSocialImage}
                onToast={props.onToast}
                accentColor="indigo"
                idPrefix="modal-social"
              />

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  onClick={onCloseSocializationModal}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
                >
                  Batal
                </button>
                <button
                  onClick={onSaveSocialization}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md"
                >
                  Simpan Kegiatan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. PEMBINAAN ADD/EDIT MODAL */}
      {showPembinaanModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl my-8">
            <div className="p-5 bg-gradient-to-r from-emerald-700 to-[#1A237E] text-white flex justify-between items-center">
              <h3 className="font-extrabold text-base">
                {editingMaterial ? `Ubah Materi: ${editingMaterial.title}` : 'Tambah Materi SOP & Bimtek'}
              </h3>
              <button onClick={onClosePembinaanModal} className="p-1 hover:bg-white/10 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Judul Materi</label>
                <input
                  type="text"
                  value={newMaterialTitle}
                  onChange={(e) => setNewMaterialTitle(e.target.value)}
                  placeholder="Contoh: SOP Taktis Gelar Selang & Penetrasi"
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Kategori</label>
                <select
                  value={newMaterialCategory}
                  onChange={(e) => setNewMaterialCategory(e.target.value as any)}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs outline-none bg-white"
                >
                  <option value="Penerapan Core Values BerAKHLAK">Penerapan Core Values BerAKHLAK</option>
                  <option value="Target SKP">Target SKP</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Deskripsi Singkat</label>
                <input
                  type="text"
                  value={newMaterialShortDesc}
                  onChange={(e) => setNewMaterialShortDesc(e.target.value)}
                  placeholder="Ringkasan tujuan modul..."
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Tahapan Prosedur (Satu baris per langkah)</label>
                <textarea
                  rows={3}
                  value={newMaterialContent}
                  onChange={(e) => setNewMaterialContent(e.target.value)}
                  placeholder="1. Periksa tekanan pompa&#10;2. Bentangkan selang utama&#10;3. Pasang nozzle"
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs outline-none font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Tips Praktis (Satu baris per tips)</label>
                <textarea
                  rows={2}
                  value={newMaterialTips}
                  onChange={(e) => setNewMaterialTips(e.target.value)}
                  placeholder="Gunakan APD lengkap sebelum penetrasi..."
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs outline-none font-mono"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  onClick={onClosePembinaanModal}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
                >
                  Batal
                </button>
                <button
                  onClick={onSaveMaterial}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md"
                >
                  Simpan Modul
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. NSPM ADD/EDIT MODAL */}
      {showNspmModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl my-8">
            <div className="p-5 bg-gradient-to-r from-sky-700 to-[#1A237E] text-white flex justify-between items-center">
              <h3 className="font-extrabold text-base">
                {editingNspm ? `Ubah Dokumen: ${editingNspm.title}` : 'Tambah Dokumen NSPM & Regulasi'}
              </h3>
              <button onClick={onCloseNspmModal} className="p-1 hover:bg-white/10 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Judul Dokumen Regulasi / Protap</label>
                <input
                  type="text"
                  value={newNspmTitle}
                  onChange={(e) => setNewNspmTitle(e.target.value)}
                  placeholder="Contoh: SNI 03-3989 Instalasi Sprinkler Otomatis"
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Kategori NSPM</label>
                  <select
                    value={newNspmCategory}
                    onChange={(e) => setNewNspmCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs outline-none bg-white"
                  >
                    <option value="Norma">Norma</option>
                    <option value="Standar">Standar</option>
                    <option value="Prosedur">Prosedur</option>
                    <option value="Manual">Manual</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Kode Dokumen</label>
                  <input
                    type="text"
                    value={newNspmCode}
                    onChange={(e) => setNewNspmCode(e.target.value)}
                    placeholder="Contoh: SNI 03-3989-2000"
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs outline-none font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Ukuran File Dokumen</label>
                <input
                  type="text"
                  value={newNspmFileSize}
                  onChange={(e) => setNewNspmFileSize(e.target.value)}
                  placeholder="Contoh: 1.8 MB"
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs outline-none font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Ringkasan Isi Regulasi</label>
                <textarea
                  rows={3}
                  value={newNspmSummary}
                  onChange={(e) => setNewNspmSummary(e.target.value)}
                  placeholder="Rangkuman ketentuan teknis yang dimuat dalam regulasi ini..."
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  onClick={onCloseNspmModal}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
                >
                  Batal
                </button>
                <button
                  onClick={onSaveNspm}
                  className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl shadow-md"
                >
                  Simpan Dokumen
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. INSPEKSI DETAIL MODAL */}
      {selectedInspeksi && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-scaleUp">
            <div className="p-5 bg-[#1A237E] text-white flex justify-between items-start">
              <div>
                <span className="text-[9px] bg-red-600 text-white font-black px-2 py-0.5 rounded-md uppercase font-mono tracking-tight">
                  Detail Laporan Audit Proteksi
                </span>
                <h4 className="font-extrabold text-lg mt-1">{selectedInspeksi.name}</h4>
              </div>
              <button 
                onClick={onCloseSelectedInspeksi} 
                className="p-1 hover:bg-white/10 rounded-full text-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {selectedInspeksi.image && (
                <div className="h-44 w-full rounded-xl overflow-hidden border border-slate-200">
                  <img 
                    src={selectedInspeksi.image} 
                    alt={selectedInspeksi.name} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover" 
                  />
                </div>
              )}

              <div className="space-y-1 text-xs">
                <span className="text-slate-500 font-bold">Lokasi / Alamat:</span>
                <p className="text-slate-900 bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-start gap-2 font-medium">
                  <MapPin className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span>{selectedInspeksi.address}</span>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-500 font-bold block mb-1">Tanggal Pemeriksaan:</span>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 font-mono text-slate-800 font-medium flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{selectedInspeksi.date}</span>
                  </div>
                </div>

                <div>
                  <span className="text-slate-500 font-bold block mb-1">Status Proteksi:</span>
                  <div className={`p-2.5 rounded-xl border text-center font-black uppercase text-xs ${
                    selectedInspeksi.status === 'Kritis' 
                      ? 'bg-red-50 border-red-200 text-red-700' 
                      : selectedInspeksi.status === 'Perlu Perbaikan' 
                        ? 'bg-amber-50 border-amber-200 text-amber-800' 
                        : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                  }`}>
                    {selectedInspeksi.status}
                  </div>
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <span className="text-slate-500 font-bold">Temuan Penyuluh & Catatan Kelayakan:</span>
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-slate-700 leading-relaxed font-medium">
                  {selectedInspeksi.notes || 'Tidak ada catatan tambahan.'}
                </div>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2 text-xs text-amber-800">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="leading-snug">
                  Berdasarkan PERDA Kota Bima No. 4/2021, pengelola gedung wajib menindaklanjuti temuan dalam kurun waktu 14 hari kerja.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 8. SOCIALIZATION DETAIL MODAL */}
      {selectedSocialization && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-scaleUp">
            <div className="p-5 bg-gradient-to-r from-indigo-700 to-[#1A237E] text-white flex justify-between items-start">
              <div>
                <span className="text-[9px] bg-yellow-400 text-slate-950 font-black px-2 py-0.5 rounded-md uppercase font-mono tracking-tight">
                  Rekap Sosialisasi Edukasi
                </span>
                <h4 className="font-extrabold text-lg mt-1">{selectedSocialization.title}</h4>
              </div>
              <button 
                onClick={onCloseSelectedSocialization} 
                className="p-1 hover:bg-white/10 rounded-full text-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {selectedSocialization.image && (
                <div className="h-44 w-full rounded-xl overflow-hidden border border-slate-200">
                  <img 
                    src={selectedSocialization.image} 
                    alt={selectedSocialization.title} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover" 
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-500 font-bold block mb-1">Tanggal:</span>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 font-mono text-slate-800 font-medium">
                    {selectedSocialization.date}
                  </div>
                </div>
                <div>
                  <span className="text-slate-500 font-bold block mb-1">Jumlah Peserta:</span>
                  <div className="bg-indigo-50 p-2.5 rounded-xl border border-indigo-200 text-indigo-900 font-bold text-center">
                    {selectedSocialization.participants} Orang
                  </div>
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <span className="text-slate-500 font-bold">Lokasi Acara:</span>
                <p className="text-slate-900 bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-start gap-2 font-medium">
                  <MapPin className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span>{selectedSocialization.location}</span>
                </p>
              </div>

              <div className="space-y-1 text-xs">
                <span className="text-slate-500 font-bold">Pemateri:</span>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-slate-800 font-semibold">
                  {selectedSocialization.speaker}
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <span className="text-slate-500 font-bold">Rangkuman Kegiatan:</span>
                <p className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-slate-700 leading-relaxed font-medium">
                  {selectedSocialization.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 9. DELETE CONFIRMATION MODAL */}
      {confirmDeleteTarget && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl p-6 space-y-4 animate-scaleUp text-center">
            <div className="w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
              <Trash2 className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h3 className="font-extrabold text-base text-slate-900">Konfirmasi Hapus Data</h3>
              <p className="text-xs text-slate-500">
                Apakah Anda yakin ingin menghapus data <strong className="text-slate-800">"{confirmDeleteTarget.name}"</strong>?
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={onCloseConfirmDelete}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={onConfirmDelete}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
              >
                Ya, Hapus Data
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
