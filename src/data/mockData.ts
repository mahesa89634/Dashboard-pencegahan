import { InspeksiItem, SocializationRecap, RedkarVolunteer, AparaturMaterial, NspmDocument } from '../types';

// Seluruh initial data disetel ke array kosong [] sesuai permintaan
// Sistem beroperasi murni membaca dan menyimpan data riil ke Firebase Firestore
export const initialInspeksiList: InspeksiItem[] = [];
export const initialSocializationRecaps: SocializationRecap[] = [];
export const initialRedkarVolunteers: RedkarVolunteer[] = [];
export const aparaturMaterials: AparaturMaterial[] = [];
export const nspmDocuments: NspmDocument[] = [];

// Daftar ID data mock bawaan untuk pembersihan otomatis data lama dari Firestore
export const LEGACY_MOCK_IDS = {
  inspeksi: ['INS-01', 'INS-02', 'INS-03', 'INS-04'],
  socializations: ['SOC-01', 'SOC-02', 'SOC-03'],
  volunteers: ['RED-001', 'RED-002', 'RED-003', 'RED-004'],
  pembinaanMaterials: ['AP-01', 'AP-02', 'AP-03', 'AP-04', 'AP-05'],
  nspmDocs: ['NSPM-01', 'NSPM-02', 'NSPM-03', 'NSPM-04']
};
