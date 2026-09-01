import React, { useState } from 'react';
import { 
  GraduationCap, 
  Plus, 
  BookOpen, 
  Award, 
  CheckCircle2, 
  HelpCircle, 
  RotateCcw, 
  AlertCircle, 
  Sparkles, 
  ChevronRight, 
  Edit, 
  Trash2,
  FileText,
  Lightbulb,
  Check
} from 'lucide-react';
import { AparaturMaterial } from '../../types';

interface PembinaanViewProps {
  materials: AparaturMaterial[];
  onOpenAddModal: () => void;
  onEditMaterial: (item: AparaturMaterial) => void;
  onDeleteMaterial: (id: string, name: string) => void;
  isAdmin: boolean;
}

export default function PembinaanView({
  materials,
  onOpenAddModal,
  onEditMaterial,
  onDeleteMaterial,
  isAdmin
}: PembinaanViewProps) {
  const [activeTab, setActiveTab] = useState<'materials' | 'quiz'>('materials');

  // Quiz interactive state
  const quizQuestions = [
    {
      question: "Apakah nilai 'Aman' dalam Core Values BerAKHLAK Damkarmat Kota Bima?",
      options: [
        "Aman bukan core value ASN tersendiri, yang benar adalah Harmonis & Akuntabel dalam BerAKHLAK",
        "Aman berkaitan dengan asuransi perlindungan armada mobil tangki semata",
        "Aman adalah bagian dari nilai Berorientasi Pelayanan di posko darurat saja"
      ],
      correctIdx: 0,
      explanation: "Core Values ASN adalah BerAKHLAK (Berorientasi Pelayanan, Akuntabel, Kompeten, Harmonis, Loyal, Adaptif, Kolaboratif). Rasa aman masyarakat adalah hasil nyata dari implementasi nilai tersebut."
    },
    {
      question: "Berapakah indikator response time standar pelayanan minimal (SPM) Damkarmat?",
      options: [
        "Mencapai lokasi kebakaran dalam waktu maksimal 45 menit",
        "Mencapai kebakaran pemukiman dalam waktu maksimal 15 menit semenjak panggilan diterima",
        "Menunggu koordinasi relawan REDKAR tanpa perlu segera menerjunkan unit armada"
      ],
      correctIdx: 1,
      explanation: "Standar Pelayanan Minimal (SPM) Pemadam Kebakaran nasional mewajibkan response time di bawah 15 menit untuk meminimalisir risiko korban jiwa dan kerugian material."
    },
    {
      question: "Apa fungsi utama dibentuknya Relawan Pemadam Kebakaran (REDKAR)?",
      options: [
        "Sebagai personil cadangan militer wilayah pesisir",
        "Wadah partisipasi masyarakat terlatih dalam deteksi dini & pencegahan kebakaran di tingkat RT/RW",
        "Pengganti seluruh petugas struktural aparatur sipil negara"
      ],
      correctIdx: 1,
      explanation: "REDKAR adalah organisasi relawan berbasis partisipasi warga yang dibina oleh Pemda/Damkar untuk penanganan pertama dan edukasi lingkungan sekitar."
    }
  ];

  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);

  const handleSelectAnswer = (idx: number) => {
    if (isSubmitted) return;
    setSelectedAnswer(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null || isSubmitted) return;
    if (selectedAnswer === quizQuestions[currentQuestionIdx].correctIdx) {
      setScore(prev => prev + 1);
    }
    setIsSubmitted(true);
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setIsSubmitted(false);
    if (currentQuestionIdx < quizQuestions.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const handleRestartQuiz = () => {
    setScore(0);
    setCurrentQuestionIdx(0);
    setSelectedAnswer(null);
    setIsSubmitted(false);
    setQuizFinished(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* 1. TOP TAB SWITCHER & HEADER */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('materials')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'materials'
                ? 'bg-[#1A237E] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" /> Modul & SOP Aparatur ({materials.length})
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'quiz'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
            }`}
          >
            <Award className="w-4 h-4" /> Kuis Uji Kompetensi Pemadam
          </button>
        </div>

        {activeTab === 'materials' && (
          <button
            id="add-pembinaan-btn"
            onClick={onOpenAddModal}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-emerald-900/10 flex items-center gap-1.5 cursor-pointer active:scale-95 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" /> Tambah Modul Materi
          </button>
        )}
      </div>

      {/* 2. TAB 1: MATERIALS & SOPS */}
      {activeTab === 'materials' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {materials.map((mat) => (
            <div
              key={mat.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all p-6 flex flex-col justify-between space-y-4 group hover:border-slate-300"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {mat.category}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 font-bold">{mat.id}</span>
                </div>

                <h3 className="font-black text-base text-slate-900 leading-snug group-hover:text-emerald-700 transition-colors">
                  {mat.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {mat.shortDesc}
                </p>

                {/* SOP Steps */}
                <div className="space-y-1.5 pt-2">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-emerald-600" /> Tahapan & Prosedur:
                  </span>
                  <ul className="space-y-1 text-xs text-slate-600 pl-2">
                    {mat.content.map((c, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-4 h-4 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span className="leading-snug">{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Technical Tips */}
                {mat.tips && mat.tips.length > 0 && (
                  <div className="p-3 bg-amber-50/80 border border-amber-200/80 rounded-xl space-y-1">
                    <span className="text-[11px] font-bold text-amber-900 flex items-center gap-1">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-600" /> Tips & Catatan Teknis:
                    </span>
                    <ul className="space-y-0.5 text-[11px] text-amber-800 pl-4 list-disc">
                      {mat.tips.map((tip, idx) => (
                        <li key={idx}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-1.5">
                <button
                  onClick={() => onEditMaterial(mat)}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                  title="Ubah Materi"
                >
                  <Edit className="w-3 h-3" /> Ubah
                </button>
                <button
                  onClick={() => onDeleteMaterial(mat.id, mat.title)}
                  className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                  title="Hapus Materi"
                >
                  <Trash2 className="w-3 h-3" /> Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 3. TAB 2: INTERACTIVE QUIZ MODULE */}
      {activeTab === 'quiz' && (
        <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-6">
          {!quizFinished ? (
            <>
              {/* Quiz Header & Progress Bar */}
              <div className="space-y-3 pb-4 border-b border-slate-100">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    Pertanyaan {currentQuestionIdx + 1} dari {quizQuestions.length}
                  </span>
                  <span className="font-mono font-bold text-slate-600">
                    Skor Saat Ini: {score} / {quizQuestions.length}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 transition-all duration-300 rounded-full"
                    style={{ width: `${((currentQuestionIdx + 1) / quizQuestions.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Question Text */}
              <div className="space-y-4">
                <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                  {quizQuestions[currentQuestionIdx].question}
                </h3>

                {/* Options List */}
                <div className="space-y-2.5">
                  {quizQuestions[currentQuestionIdx].options.map((option, idx) => {
                    const isSelected = selectedAnswer === idx;
                    const isCorrect = idx === quizQuestions[currentQuestionIdx].correctIdx;

                    let btnStyle = 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800';
                    if (isSelected) {
                      btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold ring-2 ring-emerald-500/20';
                    }
                    if (isSubmitted) {
                      if (isCorrect) {
                        btnStyle = 'border-emerald-500 bg-emerald-500 text-white font-bold';
                      } else if (isSelected && !isCorrect) {
                        btnStyle = 'border-red-500 bg-red-500 text-white font-bold';
                      } else {
                        btnStyle = 'border-slate-200 bg-slate-50 text-slate-400 opacity-60';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectAnswer(idx)}
                        disabled={isSubmitted}
                        className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm transition-all flex items-start gap-3 cursor-pointer ${btnStyle}`}
                      >
                        <span className="w-6 h-6 rounded-full bg-white/20 border border-current text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="flex-1 leading-relaxed">{option}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Explanation Box on Submit */}
              {isSubmitted && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5 animate-fadeIn">
                  <div className="flex items-center gap-1.5 font-bold text-xs">
                    {selectedAnswer === quizQuestions[currentQuestionIdx].correctIdx ? (
                      <span className="text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Jawaban Anda Benar!
                      </span>
                    ) : (
                      <span className="text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" /> Jawaban Anda Belum Tepat.
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {quizQuestions[currentQuestionIdx].explanation}
                  </p>
                </div>
              )}

              {/* Quiz Footer Actions */}
              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                {!isSubmitted ? (
                  <button
                    onClick={handleSubmitAnswer}
                    disabled={selectedAnswer === null}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-emerald-900/10 cursor-pointer"
                  >
                    Kirim Jawaban
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuestion}
                    className="px-6 py-2.5 bg-[#1A237E] hover:bg-[#283593] text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-1.5"
                  >
                    {currentQuestionIdx < quizQuestions.length - 1 ? 'Pertanyaan Berikutnya' : 'Lihat Hasil Akhir'}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </>
          ) : (
            /* Quiz Completed View */
            <div className="text-center py-8 space-y-5 animate-scaleUp">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md">
                <Award className="w-10 h-10" />
              </div>

              <div className="space-y-1">
                <h3 className="text-2xl font-black text-slate-900">Kuis Selesai!</h3>
                <p className="text-xs text-slate-500">Evaluasi Pemahaman Standardisasi & Core Values Damkarmat</p>
              </div>

              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 max-w-xs mx-auto">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Nilai Anda:</span>
                <span className="text-4xl font-black text-emerald-600 font-mono">
                  {Math.round((score / quizQuestions.length) * 100)} / 100
                </span>
                <span className="text-xs text-slate-600 block mt-2 font-medium">
                  {score === quizQuestions.length 
                    ? '🎉 Sempurna! Anda menguasai seluruh materi dengan baik.' 
                    : 'Pertahankan dan pelajari kembali materi SOP yang belum tepat.'}
                </span>
              </div>

              <button
                onClick={handleRestartQuiz}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-2 mx-auto cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" /> Ulangi Kuis
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
