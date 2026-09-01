import React, { useState } from 'react';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Download, 
  Check, 
  FileText, 
  Edit, 
  Trash2, 
  ShieldCheck, 
  Info,
  ExternalLink
} from 'lucide-react';
import { NspmDocument } from '../../types';

interface NspmViewProps {
  nspmDocs: NspmDocument[];
  onOpenAddModal: () => void;
  onEditNspm: (item: NspmDocument) => void;
  onDeleteNspm: (id: string, name: string) => void;
  onDownloadNspm: (id: string, name: string) => void;
  downloadProgress: Record<string, number>;
  isAdmin: boolean;
}

export default function NspmView({
  nspmDocs,
  onOpenAddModal,
  onEditNspm,
  onDeleteNspm,
  onDownloadNspm,
  downloadProgress,
  isAdmin
}: NspmViewProps) {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const categories = ['Norma', 'Standar', 'Prosedur', 'Manual'];

  const filteredDocs = nspmDocs.filter(doc => {
    const matchesSearch = 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.summary.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || doc.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* 1. TOP INFO BANNER */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-3 bg-sky-50 text-sky-700 rounded-xl shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-slate-900 tracking-tight">
              Norma, Standar, Prosedur & Manual (NSPM)
            </h3>
            <p className="text-xs text-slate-500 max-w-2xl leading-relaxed mt-0.5">
              Koleksi dokumen hukum, Standard Nasional Indonesia (SNI), dan Peraturan Daerah Kota Bima mengenai keselamatan proteksi aktif, hidran umum, dan instalasi pemadam kebakaran.
            </p>
          </div>
        </div>

        <button
          id="add-nspm-btn"
          onClick={onOpenAddModal}
          className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-sky-900/10 flex items-center gap-1.5 cursor-pointer active:scale-95 shrink-0 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" /> Tambah Dokumen NSPM
        </button>
      </div>

      {/* 2. FILTER & SEARCH TOOLBAR */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari kode dokumen (SNI/PERDA), judul, atau ringkasan..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all font-medium"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setCategoryFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              categoryFilter === 'all' ? 'bg-[#1A237E] text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Semua ({nspmDocs.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                categoryFilter === cat ? 'bg-sky-600 text-white shadow-xs' : 'bg-sky-50 text-sky-800 hover:bg-sky-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 3. RESPONSIVE DOCUMENTS GRID */}
      {filteredDocs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
          <h4 className="text-base font-bold text-slate-700">Tidak ada dokumen NSPM yang sesuai</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Coba pilih kategori lain atau ubah kata kunci pencarian Anda.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDocs.map((doc) => {
            const progress = downloadProgress[doc.id] || 0;
            return (
              <div
                key={doc.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between space-y-4 group hover:border-sky-300 relative overflow-hidden"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider bg-sky-50 text-sky-800 border border-sky-200">
                      {doc.code} &bull; {doc.category}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 font-semibold">{doc.fileSize}</span>
                  </div>

                  <h4 className="font-black text-sm text-slate-900 leading-snug group-hover:text-sky-700 transition-colors">
                    {doc.title}
                  </h4>

                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {doc.summary}
                  </p>
                </div>

                {/* Progress bar simulation */}
                {progress > 0 && progress < 100 && (
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-sky-600 h-full transition-all duration-300 rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                )}

                {/* Card Footer with Download & Admin Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    disabled={progress > 0}
                    onClick={() => onDownloadNspm(doc.id, doc.title)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs ${
                      progress === 100
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                        : progress > 0
                          ? 'bg-slate-100 text-slate-400 cursor-wait'
                          : 'bg-[#1A237E] hover:bg-[#283593] text-white active:scale-95'
                    }`}
                  >
                    {progress === 100 ? (
                      <>
                        <Check className="w-3.5 h-3.5" /> Terunduh
                      </>
                    ) : progress > 0 ? (
                      <>Mengunduh {progress}%...</>
                    ) : (
                      <>
                        <Download className="w-3.5 h-3.5" /> Unduh Dokumen
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onEditNspm(doc)}
                      className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                      title="Ubah Dokumen"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteNspm(doc.id, doc.title)}
                      className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                      title="Hapus Dokumen"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
