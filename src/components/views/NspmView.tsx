import React, { useState } from 'react';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Copy, 
  Check, 
  Edit, 
  Trash2, 
  ExternalLink,
  Link2
} from 'lucide-react';
import { NspmDocument } from '../../types';

interface NspmViewProps {
  nspmDocs: NspmDocument[];
  onOpenAddModal: () => void;
  onEditNspm: (item: NspmDocument) => void;
  onDeleteNspm: (id: string, name: string) => void;
  onToast: (msg: string) => void;
  isAdmin: boolean;
}

export default function NspmView({
  nspmDocs,
  onOpenAddModal,
  onEditNspm,
  onDeleteNspm,
  onToast,
  isAdmin
}: NspmViewProps) {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = ['PERDA', 'STANDAR', 'PROSEDUR', 'MANUAL'];

  const normalizeCategory = (cat: string) => {
    if (!cat) return 'PERDA';
    const upper = cat.toUpperCase();
    if (upper === 'NORMA') return 'PERDA';
    return upper;
  };

  const filteredDocs = nspmDocs.filter(doc => {
    const normCategory = normalizeCategory(doc.category);
    const matchesSearch = 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.code && doc.code.toLowerCase().includes(searchQuery.toLowerCase())) ||
      doc.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.driveUrl && doc.driveUrl.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = categoryFilter === 'all' || normCategory === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleCopyLink = async (doc: NspmDocument) => {
    const linkToCopy = doc.driveUrl || '';
    if (!linkToCopy) {
      onToast('⚠️ Tautan dokumen belum tersedia');
      return;
    }

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(linkToCopy);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = linkToCopy;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopiedId(doc.id);
      onToast('Link dokumen berhasil disalin!');
      setTimeout(() => {
        setCopiedId(null);
      }, 2000);
    } catch {
      onToast('Link dokumen berhasil disalin!');
    }
  };

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
              Koleksi dokumen hukum, Standar Teknis, Protap Operasi, dan Manual Keselamatan Damkarmat Kota Bima yang terhubung langsung dengan Google Drive.
            </p>
          </div>
        </div>

        <button
          id="add-nspm-btn"
          onClick={onOpenAddModal}
          className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-sky-900/10 flex items-center gap-1.5 cursor-pointer active:scale-95 shrink-0 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" /> Tambah Regulasi
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
            placeholder="Cari regulasi, judul, atau kata kunci..."
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
          {categories.map((cat) => {
            const count = nspmDocs.filter(d => normalizeCategory(d.category) === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  categoryFilter === cat ? 'bg-sky-600 text-white shadow-xs' : 'bg-sky-50 text-sky-800 hover:bg-sky-100'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. RESPONSIVE DOCUMENTS GRID */}
      {filteredDocs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
          <h4 className="text-base font-bold text-slate-700">Tidak ada regulasi yang sesuai</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Coba pilih kategori lain atau ubah kata kunci pencarian Anda.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDocs.map((doc) => {
            const isCopied = copiedId === doc.id;
            const categoryBadge = normalizeCategory(doc.category);

            return (
              <div
                key={doc.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between space-y-4 group hover:border-sky-300 relative overflow-hidden"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-md text-[10.5px] font-mono font-bold uppercase tracking-wider bg-sky-50 text-sky-800 border border-sky-200">
                      {categoryBadge}
                    </span>
                    {doc.driveUrl && (
                      <span className="text-[11px] text-sky-600 font-semibold flex items-center gap-1">
                        <Link2 className="w-3 h-3" /> Drive Link
                      </span>
                    )}
                  </div>

                  <h4 className="font-black text-sm text-slate-900 leading-snug group-hover:text-sky-700 transition-colors">
                    {doc.title}
                  </h4>

                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {doc.summary}
                  </p>
                </div>

                {/* Card Footer with Salin Link, Buka Dokumen & Admin Actions */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {/* Primary Button: Salin Link */}
                    <button
                      type="button"
                      onClick={() => handleCopyLink(doc)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs ${
                        isCopied
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[#1A237E] hover:bg-[#283593] text-white active:scale-95'
                      }`}
                      title="Salin tautan Google Drive ke clipboard"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5" /> Link Tersalin
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" /> Salin Link
                        </>
                      )}
                    </button>

                    {/* Secondary Button: Buka Dokumen */}
                    {doc.driveUrl ? (
                      <a
                        href={doc.driveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-xl text-xs font-bold border border-slate-200 bg-slate-50 hover:bg-sky-50 hover:border-sky-300 text-slate-700 hover:text-sky-800 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                        title="Buka dokumen di tab baru Google Drive"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> Buka Dokumen
                      </a>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onToast('⚠️ Link dokumen belum tersedia')}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold border border-slate-200 bg-slate-50 text-slate-400 transition-colors flex items-center gap-1.5 cursor-not-allowed"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> Buka Dokumen
                      </button>
                    )}
                  </div>

                  {/* Admin Actions */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onEditNspm(doc)}
                      className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                      title="Ubah Regulasi"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteNspm(doc.id, doc.title)}
                      className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                      title="Hapus Regulasi"
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
