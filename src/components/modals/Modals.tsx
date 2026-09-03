import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Calendar, 
  AlertTriangle, 
  ShieldCheck, 
  UserCheck, 
  Users, 
  Lock, 
  Unlock,
  KeyRound,
  Trash2, 
  Building2,
  FileText,
  Clock,
  Sparkles,
  Link2
} from 'lucide-react';
import { InspeksiItem, SocializationRecap, RedkarVolunteer, AparaturMaterial, PembinaanActivity, PembinaanCategory, NspmDocument, NspmCategory } from '../../types';
import ImageUploader from '../ImageUploader';
import { formatDateDisplay, toInputDateFormat } from '../../utils/dateUtils';
import { KELURAHAN_KOTA_BIMA } from '../../data/kelurahanData';

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

  // Pembinaan Activity Add/Edit
  showPembinaanModal: boolean;
  onClosePembinaanModal: () => void;
  editingMaterial: PembinaanActivity | null;
  newMaterialTitle: string;
  setNewMaterialTitle: (val: string) => void;
  newMaterialCategory: PembinaanCategory;
  setNewMaterialCategory: (val: PembinaanCategory) => void;
  newMaterialDate: string;
  setNewMaterialDate: (val: string) => void;
  newMaterialDescription: string;
  setNewMaterialDescription: (val: string) => void;
  newMaterialImage: string;
  setNewMaterialImage: (val: string) => void;
  onSaveMaterial: () => void;
  selectedPembinaan?: PembinaanActivity | null;
  onCloseSelectedPembinaan?: () => void;

  // NSPM Add/Edit
  showNspmModal: boolean;
  onCloseNspmModal: () => void;
  editingNspm: NspmDocument | null;
  newNspmTitle: string;
  setNewNspmTitle: (val: string) => void;
  newNspmCategory: NspmCategory | string;
  setNewNspmCategory: (val: any) => void;
  newNspmDriveUrl: string;
  setNewNspmDriveUrl: (val: string) => void;
  newNspmSummary: string;
  setNewNspmSummary: (val: string) => void;
  onSaveNspm: () => void;

  // Detail Modals
  selectedInspeksi: InspeksiItem | null;
  onCloseSelectedInspeksi: () => void;
  selectedSocialization: SocializationRecap | null;
  onCloseSelectedSocialization: () => void;

  // Leadership PIN Access
  isAdmin: boolean;
  isLeadershipUnlocked: boolean;
  showLeadershipPinModal: boolean;
  onCloseLeadershipPinModal: () => void;
  onUnlockLeadershipPin: (pin: string) => boolean;
  onOpenLeadershipPinModal: () => void;

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
    newMaterialDate,
    setNewMaterialDate,
    newMaterialDescription,
    setNewMaterialDescription,
    newMaterialImage,
    setNewMaterialImage,
    onSaveMaterial,
    selectedPembinaan,
    onCloseSelectedPembinaan,

    showNspmModal,
    onCloseNspmModal,
    editingNspm,
    newNspmTitle,
    setNewNspmTitle,
    newNspmCategory,
    setNewNspmCategory,
    newNspmDriveUrl,
    setNewNspmDriveUrl,
    newNspmSummary,
    setNewNspmSummary,
    onSaveNspm,

    selectedInspeksi,
    onCloseSelectedInspeksi,
    selectedSocialization,
    onCloseSelectedSocialization,

    isAdmin,
    isLeadershipUnlocked,
    showLeadershipPinModal,
    onCloseLeadershipPinModal,
    onUnlockLeadershipPin,
    onOpenLeadershipPinModal,

    confirmDeleteTarget,
    onCloseConfirmDelete,
    onConfirmDelete,
    onImageUpload
  } = props;

  const [pinInput, setPinInput] = useState<string>('');
  const [pinError, setPinError] = useState<string>('');
  const canViewNotes = isAdmin || isLeadershipUnlocked;

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUnlockLeadershipPin(pinInput.trim())) {
      setPinInput('');
      setPinError('');
    } else {
      setPinError('PIN salah, silakan coba lagi.');
      setPinInput('');
    }
  };

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
                  <div className="flex items-center justify-between">
                    <label htmlFor="inspeksi-date-picker" className="text-xs font-bold text-slate-700 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-red-600" /> Tanggal Pemeriksaan
                    </label>
                    {newInspeksiDate && (
                      <span className="text-[10.5px] font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded-md border border-red-100">
                        {formatDateDisplay(newInspeksiDate)}
                      </span>
                    )}
                  </div>
                  <input
                    id="inspeksi-date-picker"
                    type="date"
                    required
                    value={toInputDateFormat(newInspeksiDate)}
                    onChange={(e) => setNewInspeksiDate(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs outline-none bg-slate-50 focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500 cursor-pointer font-medium text-slate-800"
                  />
                  <span className="text-[10px] text-slate-400 block">Pilih tanggal dari kalender</span>
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
                  <label className="text-xs font-bold text-slate-700">Kelurahan Penugasan</label>
                  <select
                    value={newVolSubdistrict}
                    onChange={(e) => setNewVolSubdistrict(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs outline-none bg-white font-medium"
                  >
                    {KELURAHAN_KOTA_BIMA.map((kel) => (
                      <option key={kel} value={kel}>
                        Kelurahan {kel}
                      </option>
                    ))}
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
                  <div className="flex items-center justify-between">
                    <label htmlFor="social-date-picker" className="text-xs font-bold text-slate-700 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-indigo-600" /> Tanggal Pelaksanaan
                    </label>
                    {newSocialDate && (
                      <span className="text-[10.5px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                        {formatDateDisplay(newSocialDate)}
                      </span>
                    )}
                  </div>
                  <input
                    id="social-date-picker"
                    type="date"
                    required
                    value={toInputDateFormat(newSocialDate)}
                    onChange={(e) => setNewSocialDate(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs outline-none bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer font-medium text-slate-800"
                  />
                  <span className="text-[10px] text-slate-400 block">Pilih tanggal dari kalender</span>
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
            <div className="p-5 bg-gradient-to-r from-emerald-700 to-teal-800 text-white flex justify-between items-start">
              <div>
                <span className="text-[10px] bg-white/20 text-white font-bold px-2 py-0.5 rounded uppercase font-mono tracking-wider">
                  Modul Pembinaan
                </span>
                <h3 className="font-extrabold text-base mt-1">
                  {editingMaterial ? 'Ubah Laporan Pembinaan' : 'Tambah Laporan Pembinaan'}
                </h3>
              </div>
              <button 
                onClick={onClosePembinaanModal} 
                className="p-1 hover:bg-white/10 rounded-full text-white/80 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              {/* Judul Kegiatan */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Judul Kegiatan <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newMaterialTitle}
                  onChange={(e) => setNewMaterialTitle(e.target.value)}
                  placeholder="Contoh: Pelatihan Vertical Rescue Aparatur"
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              {/* Jenis Kategori */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Jenis Kategori <span className="text-red-500">*</span>
                </label>
                <select
                  value={newMaterialCategory}
                  onChange={(e) => setNewMaterialCategory(e.target.value as PembinaanCategory)}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs outline-none bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                >
                  <option value="Pembinaan Aparatur Kebakaran">Pembinaan Aparatur Kebakaran</option>
                  <option value="Pembinaan Aparatur Pencarian dan Pertolongan">Pembinaan Aparatur Pencarian dan Pertolongan</option>
                  <option value="Pembinaan Redkar">Pembinaan Redkar</option>
                </select>
              </div>

              {/* Tanggal Pelaksanaan */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Tanggal Pelaksanaan <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={toInputDateFormat(newMaterialDate)}
                  onChange={(e) => setNewMaterialDate(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 cursor-pointer font-medium"
                />
              </div>

              {/* Deskripsi / Ringkasan Kegiatan */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Deskripsi / Ringkasan Kegiatan <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  value={newMaterialDescription}
                  onChange={(e) => setNewMaterialDescription(e.target.value)}
                  placeholder="Tuliskan materi yang disampaikan, instruktur, skenario praktek di lapangan, atau hasil evaluasi kemampuan peserta..."
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              {/* Upload Foto Kegiatan */}
              <ImageUploader
                label="Upload Foto Dokumentasi Kegiatan"
                subLabel="Otomatis di-resize maks lebar 800px & dikompresi JPEG agar < 100 KB"
                value={newMaterialImage}
                onChange={setNewMaterialImage}
                onToast={props.onToast}
                accentColor="emerald"
                idPrefix="modal-pembinaan"
              />

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClosePembinaanModal}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={onSaveMaterial}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-900/10 transition-all cursor-pointer active:scale-95"
                >
                  {editingMaterial ? 'Perbarui Laporan' : 'Simpan Laporan Pembinaan'}
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
              <div>
                <span className="text-[10px] bg-white/20 text-white font-bold px-2 py-0.5 rounded uppercase font-mono tracking-wider">
                  Regulasi & NSPM
                </span>
                <h3 className="font-extrabold text-base mt-1">
                  {editingNspm ? 'Ubah Regulasi' : 'Tambah Regulasi'}
                </h3>
              </div>
              <button 
                onClick={onCloseNspmModal} 
                className="p-1 hover:bg-white/10 rounded-full text-white/80 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              {/* Judul Regulasi */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Judul Regulasi <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newNspmTitle}
                  onChange={(e) => setNewNspmTitle(e.target.value)}
                  placeholder="Contoh: Peraturan Daerah Kota Bima No. 4 Tentang Damkar"
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 font-medium"
                />
              </div>

              {/* Kategori */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Kategori <span className="text-red-500">*</span>
                </label>
                <select
                  value={newNspmCategory}
                  onChange={(e) => setNewNspmCategory(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs outline-none bg-white focus:border-sky-500 focus:ring-1 focus:ring-sky-500 cursor-pointer font-medium"
                >
                  <option value="PERDA">PERDA</option>
                  <option value="STANDAR">STANDAR</option>
                  <option value="PROSEDUR">PROSEDUR</option>
                  <option value="MANUAL">MANUAL</option>
                </select>
              </div>

              {/* Link Dokumen / Google Drive */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Link Dokumen / Google Drive <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Link2 className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="url"
                    value={newNspmDriveUrl}
                    onChange={(e) => setNewNspmDriveUrl(e.target.value)}
                    placeholder="https://drive.google.com/file/d/..."
                    className="w-full pl-9 pr-3.5 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 font-mono text-slate-800"
                  />
                </div>
                <p className="text-[11px] text-slate-400">
                  Pastikan izin akses dokumen di Google Drive telah disetel publik (Siapa saja yang memiliki link).
                </p>
              </div>

              {/* Deskripsi Singkat */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Deskripsi Singkat <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={newNspmSummary}
                  onChange={(e) => setNewNspmSummary(e.target.value)}
                  placeholder="Rangkuman ketentuan teknis yang dimuat dalam regulasi ini..."
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 font-medium"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onCloseNspmModal}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={onSaveNspm}
                  className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl shadow-md shadow-sky-900/10 transition-all cursor-pointer active:scale-95"
                >
                  {editingNspm ? 'Perbarui Regulasi' : 'Simpan Regulasi'}
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
                    <span>{formatDateDisplay(selectedInspeksi.date)}</span>
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
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-bold">Temuan Penyuluh & Catatan Kelayakan:</span>
                  {!canViewNotes && (
                    <span className="text-[10.5px] font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <Lock className="w-3 h-3 text-red-600" /> Rahasia Jabatan
                    </span>
                  )}
                </div>
                {canViewNotes ? (
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-slate-700 leading-relaxed font-medium">
                    {selectedInspeksi.notes || 'Tidak ada catatan tambahan.'}
                  </div>
                ) : (
                  <div className="p-4 bg-red-50/60 border border-red-200 rounded-xl space-y-2.5">
                    <div className="text-slate-400 select-none filter blur-[3.5px] text-[11px] leading-relaxed line-clamp-2">
                      {selectedInspeksi.notes || 'Catatan temuan inspeksi proteksi kebakaran gedung dan rekomendasi sarana penyelamatan teknis dinas.'}
                    </div>
                    <div className="flex items-start gap-2 text-red-700 font-bold text-xs">
                      <Lock className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      <span className="leading-tight">
                        🔒 Dokumen Terkunci
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Rincian catatan dan temuan teknis proteksi gedung ini disensor dalam Mode Tamu. Masukkan PIN 4-digit Pimpinan untuk membuka akses.
                    </p>
                    <button
                      type="button"
                      onClick={onOpenLeadershipPinModal}
                      className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xs inline-flex items-center gap-1.5 cursor-pointer transition-colors active:scale-95"
                    >
                      <KeyRound className="w-3.5 h-3.5" /> Masukkan PIN Pimpinan
                    </button>
                  </div>
                )}
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
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 font-mono text-slate-800 font-medium flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{formatDateDisplay(selectedSocialization.date)}</span>
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

      {/* 8b. PEMBINAAN DETAIL MODAL */}
      {selectedPembinaan && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-scaleUp">
            <div className="p-5 bg-gradient-to-r from-emerald-700 to-teal-800 text-white flex justify-between items-start">
              <div>
                <span className="text-[9px] bg-white/20 text-white font-black px-2 py-0.5 rounded-md uppercase font-mono tracking-tight">
                  Dokumentasi Pembinaan
                </span>
                <h4 className="font-extrabold text-lg mt-1 leading-snug">{selectedPembinaan.title}</h4>
              </div>
              <button 
                onClick={onCloseSelectedPembinaan} 
                className="p-1 hover:bg-white/10 rounded-full text-slate-200 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              {selectedPembinaan.image && (
                <div className="h-52 w-full rounded-xl overflow-hidden border border-slate-200 shadow-xs">
                  <img 
                    src={selectedPembinaan.image} 
                    alt={selectedPembinaan.title} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover" 
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-500 font-bold block mb-1">Tanggal Pelaksanaan:</span>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 font-mono text-slate-800 font-medium flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{formatDateDisplay(selectedPembinaan.date)}</span>
                  </div>
                </div>
                <div>
                  <span className="text-slate-500 font-bold block mb-1">Kategori:</span>
                  <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 text-emerald-900 font-bold text-center truncate">
                    {selectedPembinaan.category}
                  </div>
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <span className="text-slate-500 font-bold">Ringkasan / Laporan Kegiatan:</span>
                <p className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-slate-800 leading-relaxed font-medium whitespace-pre-line">
                  {selectedPembinaan.description}
                </p>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={onCloseSelectedPembinaan}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Tutup
                </button>
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

      {/* 10. LEADERSHIP PIN MODAL (Akses Cepat Pimpinan) */}
      {showLeadershipPinModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-scaleUp">
            {/* Header */}
            <div className="p-5 bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 text-slate-950 flex justify-between items-start">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-slate-950/10 border border-slate-950/20 flex items-center justify-center shadow-2xs">
                  <KeyRound className="w-5 h-5 text-slate-950" />
                </div>
                <div>
                  <h4 className="font-extrabold text-base leading-snug">Akses Cepat Pimpinan</h4>
                  <p className="text-[11px] text-amber-950 font-semibold">Buka Sensor Temuan Inspeksi</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={onCloseLeadershipPinModal} 
                className="p-1 hover:bg-black/10 rounded-full text-slate-950 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handlePinSubmit} className="p-5 space-y-4">
              <div className="text-center space-y-1.5">
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Masukkan 4-digit PIN Otoritas Pimpinan untuk membuka sensor catatan rahasia temuan inspeksi.
                </p>
              </div>

              {pinError && (
                <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2 font-bold animate-shake">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{pinError}</span>
                </div>
              )}

              {/* Input Display */}
              <div className="space-y-2">
                <input
                  type="password"
                  maxLength={4}
                  autoFocus
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={pinInput}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 4);
                    setPinInput(val);
                    setPinError('');
                  }}
                  placeholder="••••"
                  className="w-full text-center text-2xl font-mono tracking-[0.45em] py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-amber-500 focus:bg-white transition-all font-black text-slate-900 placeholder:text-slate-300"
                />

                {/* Keypad Digits */}
                <div className="grid grid-cols-3 gap-1.5 pt-1">
                  {['1','2','3','4','5','6','7','8','9','C','0','⌫'].map((btn) => (
                    <button
                      key={btn}
                      type="button"
                      onClick={() => {
                        setPinError('');
                        if (btn === 'C') {
                          setPinInput('');
                        } else if (btn === '⌫') {
                          setPinInput(prev => prev.slice(0, -1));
                        } else {
                          setPinInput(prev => prev.length < 4 ? prev + btn : prev);
                        }
                      }}
                      className={`py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        btn === 'C' || btn === '⌫'
                          ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                          : 'bg-slate-50 hover:bg-amber-100 hover:text-amber-950 border border-slate-200/90 text-slate-800'
                      }`}
                    >
                      {btn}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={onCloseLeadershipPinModal}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={pinInput.length !== 4}
                  className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-black text-xs rounded-xl transition-all shadow-md shadow-amber-900/10 flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <KeyRound className="w-4 h-4" /> Buka Sensor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
