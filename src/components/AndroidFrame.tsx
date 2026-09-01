import React, { useState, useEffect } from 'react';
import { 
  Wifi, 
  Battery, 
  Signal, 
  Home, 
  ChevronLeft, 
  Smartphone,
  CheckCircle,
  HelpCircle,
  Volume2
} from 'lucide-react';

interface AndroidFrameProps {
  children: React.ReactNode;
  activeScreen: string;
  onNavigateHome: () => void;
  onBack: () => void;
  canGoBack: boolean;
  onScreenNotification?: string;
  onClearNotification?: () => void;
}

export default function AndroidFrame({ 
  children, 
  activeScreen, 
  onNavigateHome, 
  onBack,
  canGoBack,
  onScreenNotification,
  onClearNotification
}: AndroidFrameProps) {
  const [time, setTime] = useState<string>('08:24');

  useEffect(() => {
    // Live update clock to represent highly polished interactive simulation
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setTime(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative mx-auto w-full max-w-[420px] bg-slate-900 rounded-[48px] p-4 shadow-2xl border-4 border-slate-800 ring-1 ring-slate-700/50 flex flex-col items-center">
      {/* Phone Camera Notch */}
      <div className="absolute top-[20px] left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-950 rounded-full z-40 flex items-center justify-center">
        <div className="w-3.5 h-3.5 bg-sky-950 rounded-full border border-sky-900/50 mr-6"></div>
        <div className="w-16 h-1 bg-slate-800 rounded-full"></div>
      </div>

      {/* Internal Phone Screen Container */}
      <div className="w-full h-[720px] bg-[#F4F5F7] rounded-[36px] overflow-hidden relative flex flex-col text-[#1C1B1F] select-none border border-slate-200 shadow-inner">
        
        {/* Android Status Bar */}
        <div className="h-7 pt-1 px-5 flex justify-between items-center text-[10px] font-bold tracking-tight bg-white text-slate-700 select-none z-30 border-b border-slate-100">
          <span className="font-semibold text-slate-700">{time}</span>
          <div className="flex items-center gap-1 text-slate-600">
            <span className="text-[8px] px-1 bg-slate-100 text-slate-500 rounded-sm scale-90 border border-slate-200/60 font-mono tracking-tighter">LTE</span>
            <Signal className="w-2.5 h-2.5 text-slate-600" fill="currentColor" size={11} />
            <Wifi className="w-2.5 h-2.5 text-slate-600" size={11} />
            <div className="flex items-center gap-0.5">
              <span className="text-[8px] font-medium mr-0.5 text-slate-600">88%</span>
              <Battery className="w-3.5 h-3.5 text-slate-600 rotate-90" size={12} />
            </div>
          </div>
        </div>

        {/* Dynamic Android Notification Banner (Toast simulation) */}
        {onScreenNotification && (
          <div className="absolute top-10 left-3 right-3 bg-white text-slate-900 py-2.5 px-3.5 rounded-lg shadow-lg z-50 border border-slate-200 flex items-center justify-between text-xs animate-slideDown">
            <div className="flex items-center gap-1.5 min-w-0">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></div>
              <p className="font-semibold truncate text-[11px] text-slate-800">{onScreenNotification}</p>
            </div>
            {onClearNotification && (
              <button 
                id="clear-notif-btn"
                onClick={onClearNotification} 
                className="text-[9px] font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 px-1.5 py-0.5 rounded ml-2 shrink-0"
              >
                Clear
              </button>
            )}
          </div>
        )}

        {/* Screen Content Window */}
        <div className="flex-1 flex flex-col overflow-y-auto scroll-smooth bg-[#F4F5F7]">
          {children}
        </div>

        {/* Native Android Bottom Virtual Gestures Navigation Bar */}
        <div className="h-9 bg-white flex justify-around items-center select-none border-t border-slate-150 z-20">
          {/* Back Gesture Button */}
          <button
            id="android-back-btn"
            onClick={onBack}
            disabled={!canGoBack}
            className={`flex items-center justify-center p-1.5 rounded-full transition-all active:scale-90 ${
              canGoBack ? 'text-slate-600 hover:bg-slate-100' : 'text-slate-300 cursor-not-allowed opacity-45'
            }`}
            title="Android Back Gesture"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Android Home Navigation Gesture pill */}
          <button
            id="android-home-btn"
            onClick={onNavigateHome}
            className={`flex items-center justify-center p-1.5 rounded-full text-slate-600 transition-all hover:bg-slate-100 active:scale-95`}
            title="Google Home Gesture"
          >
            <div className="w-3 h-3 rounded bg-transparent border-2 border-slate-400"></div>
          </button>

          {/* Android App Overview Overview gesture pill */}
          <button
            id="android-recents-btn"
            onClick={onNavigateHome}
            className="flex items-center justify-center p-1.5 rounded-full text-slate-400 hover:text-slate-500 transition-colors active:scale-95"
            title="Android Overview Recents"
          >
            <div className="w-3 h-3 bg-transparent border-2 border-slate-405 rounded-full"></div>
          </button>
        </div>

        {/* Home gesture bottom handle line */}
        <div className="h-1 bg-white pb-1 flex justify-center items-center">
          <div className="w-24 h-0.5 bg-slate-400 rounded-full"></div>
        </div>

      </div>
    </div>
  );
}
