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

export interface AparaturMaterial {
  id: string;
  title: string;
  category: 'Penerapan Core Values BerAKHLAK' | 'Target SKP';
  shortDesc: string;
  content: string[];
  tips: string[];
}

export interface NspmDocument {
  id: string;
  title: string;
  category: 'Norma' | 'Standar' | 'Prosedur' | 'Manual';
  code: string;
  summary: string;
  fileSize: string;
}
