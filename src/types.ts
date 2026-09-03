export interface InspeksiItem {
  id: string;
  name: string;
  date: string;
  status: 'Perlu Perbaikan' | 'Kritis' | 'Aman';
  address: string;
  notes?: string;
  image?: string;
}

export interface SocializationRecap {
  id: string;
  title: string;
  date: string;
  location: string;
  participants: number;
  speaker: string;
  description: string;
  image?: string;
}

export interface RedkarVolunteer {
  id: string;
  name: string;
  subdistrict: string;
  phone: string;
  role: string;
  status: 'Aktif' | 'Pelatihan' | 'Siaga';
  joinDate: string;
  image?: string;
}

export type PembinaanCategory = 
  | 'Pembinaan Aparatur Kebakaran' 
  | 'Pembinaan Aparatur Pencarian dan Pertolongan' 
  | 'Pembinaan Redkar';

export interface PembinaanActivity {
  id: string;
  title: string;
  category: PembinaanCategory;
  date: string;
  description: string;
  image?: string;
  // Backward compatibility fields if needed
  shortDesc?: string;
  content?: string[];
  tips?: string[];
}

// Alias for backwards compatibility
export type AparaturMaterial = PembinaanActivity;

export type NspmCategory = 'PERDA' | 'STANDAR' | 'PROSEDUR' | 'MANUAL';

export interface NspmDocument {
  id: string;
  title: string;
  category: NspmCategory | string;
  code?: string;
  summary: string;
  driveUrl?: string;
  fileSize?: string;
}
