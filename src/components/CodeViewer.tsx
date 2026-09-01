import React, { useState } from 'react';
import { composeCodeSnippets } from '../data/kotlinCode';
import { 
  Copy, 
  Check, 
  Terminal, 
  Cpu, 
  LayoutList, 
  FileCode, 
  CornerDownRight, 
  ShieldCheck, 
  Network
} from 'lucide-react';

interface CodeViewerProps {
  currentView: string;
}

export default function CodeViewer({ currentView }: CodeViewerProps) {
  const [copied, setCopied] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'code' | 'structure'>('code');

  const snippetKey = composeCodeSnippets[currentView] ? currentView : 'home';
  const data = composeCodeSnippets[snippetKey];

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(data.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  // Get UI layout tree structure for teaching Jetpack Compose component nesting
  const getStructureForScreen = (screen: string) => {
    switch (screen) {
      case 'inspeksi':
        return [
          { depth: 0, tag: '@Composable InspeksiScreen', desc: 'Main Scaffold container holding dynamic states' },
          { depth: 1, tag: 'Scaffold', desc: 'Provides slot structure for app bars, bottom bars and Floating Action Buttons' },
          { depth: 2, tag: 'topBar = { TopAppBar }', desc: 'Primary Red/Dark Blue toolbar with backnavigation action button' },
          { depth: 2, tag: 'floatingActionButton = { FloatingActionButton }', desc: 'FAB using Material 3 guidelines pointing to action trigger (+)' },
          { depth: 2, tag: 'Column', desc: 'Standard linear vertical layout containing search fields and list headers' },
          { depth: 3, tag: 'Spacer', desc: 'Material layout spacing helper' },
          { depth: 3, tag: 'LazyColumn', desc: 'Lists large volume of items with pre-rendering & recycled memory buffers (Android alternative to recyclerview)' },
          { depth: 4, tag: 'items(inspeksiList)', desc: 'Iterative renderer function reacting dynamically to state changes' },
          { depth: 5, tag: 'InspeksiCard', desc: 'Card wrapper displaying inspect status pill colored by status risk factor' }
        ];
      case 'pemberdayaan':
        return [
          { depth: 0, tag: '@Composable PemberdayaanScreen', desc: 'State-neutral social learning interface' },
          { depth: 1, tag: 'Scaffold', desc: 'Slot layout setup' },
          { depth: 2, tag: 'topBar = { TopAppBar }', desc: 'Header for back activity' },
          { depth: 1, tag: 'Column { padding }', desc: 'Outer padding host boundary' },
          { depth: 2, tag: 'Text("Edukasi Keselamatan")', desc: 'Headline styled with Material typography titleMedium' },
          { depth: 2, tag: 'LazyColumn', desc: 'Asymmetric list of community socialization recaps' },
          { depth: 3, tag: 'SocializationCard', desc: 'Custom Card leveraging row horizontal arrangement for citizens counts badge' }
        ];
      case 'pembinaan':
        return [
          { depth: 0, tag: '@Composable PembinaanAparaturScreen', desc: 'Learning reference hub screen' },
          { depth: 1, tag: 'Scaffold { topBar = { TopAppBar } }', desc: 'Standard M3 app scaffolding' },
          { depth: 2, tag: 'LazyColumn', desc: 'Smoothly scrolling list of text modules, avoiding nesting issues' },
          { depth: 3, tag: 'item { MaterialCard }', desc: 'ASN BerAKHLAK guidelines block card' },
          { depth: 3, tag: 'item { MaterialCard }', desc: 'Target SKP critical KPIs guideline card' },
          { depth: 4, tag: 'Column { bulletPoints.forEach }', desc: 'Renders sub-principles iteratively with native colored bullet points' }
        ];
      case 'redkar':
        return [
          { depth: 0, tag: '@Composable RedkarScreen', desc: 'Fire Volunteer coordination & lookup screen' },
          { depth: 1, tag: 'Scaffold', desc: 'Layout container' },
          { depth: 2, tag: 'LazyColumn', desc: 'List helper' },
          { depth: 3, tag: 'Card', desc: 'Individual volunteer card displaying name, subdistrict, and status badge' }
        ];
      case 'nspm':
        return [
          { depth: 0, tag: '@Composable NspmScreen', desc: 'Standard specifications reference desk' },
          { depth: 1, tag: 'Scaffold', desc: 'Material layout container' },
          { depth: 2, tag: 'LazyColumn', desc: 'List of compliance guidelines' },
          { depth: 3, tag: 'Card { Row }', desc: 'File description card containing doc status indicator, code, and download buttons' }
        ];
      case 'home':
      default:
        return [
          { depth: 0, tag: '@Composable HomeScreen', desc: 'The Entry Dashboard with state hooks' },
          { depth: 1, tag: 'Scaffold', desc: 'M3 Scaffold with responsive sizing' },
          { depth: 2, tag: 'topBar = { MediumTopAppBar }', desc: 'Collapsable Medium Top App Bar in Dark Blue' },
          { depth: 2, tag: 'Column', desc: 'Arranges hero and menus block' },
          { depth: 3, tag: 'Card (colors = CardDefaults.cardColors(FireRed))', desc: 'Headline Fire Hazard Warning notice status board' },
          { depth: 3, tag: 'LazyVerticalGrid(columns = GridCells.Fixed(2))', desc: 'Modern responsive Material bentogrid of 2 cells per horizontal bounds' },
          { depth: 4, tag: 'items(menuItems) { menu -> MenuCard }', desc: 'Grid element mapping with clickable navigation callback blocks' }
        ];
    }
  };

  const structureTree = getStructureForScreen(snippetKey);

  return (
    <div className="flex flex-col h-full bg-slate-900 rounded-3xl border border-slate-800 shadow-xl overflow-hidden">
      {/* Code Header bar */}
      <div className="bg-slate-950 p-4 border-b border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-rose-500/10 text-rose-500 rounded-lg">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-mono text-sm font-bold text-slate-100 flex items-center gap-2">
              {data.title}
              <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700/60 font-sans font-normal uppercase">
                Kotlin Jetpack Compose
              </span>
            </h3>
            <p className="text-slate-400 text-xs mt-0.5 font-sans leading-tight">
              {data.desc}
            </p>
          </div>
        </div>

        {/* Tab switcher & Copier */}
        <div className="flex items-center gap-2 w-full md:w-auto self-stretch md:self-auto">
          <div className="flex bg-slate-900 p-0.5 rounded-lg border border-slate-800/80 mr-1 text-xs">
            <button
              id="tab-code-btn"
              onClick={() => setActiveTab('code')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-md font-medium transition-colors ${
                activeTab === 'code' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-450 hover:text-slate-300'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              Source Code
            </button>
            <button
              id="tab-structure-btn"
              onClick={() => setActiveTab('structure')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-md font-medium transition-colors ${
                activeTab === 'structure' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-450 hover:text-slate-300'
              }`}
            >
              <LayoutList className="w-3.5 h-3.5" />
              Compose Tree
            </button>
          </div>

          <button
            id="copy-code-btn"
            onClick={handleCopyCode}
            className="flex items-center gap-1.5 bg-slate-850 hover:bg-slate-800 text-slate-250 hover:text-slate-100 transition-colors px-3 py-1.5 rounded-lg text-xs font-mono border border-slate-750/70 ml-auto md:ml-0"
            title="Copy Kotlin Code To Clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-450 animate-bounce" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Copy
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Panel Content */}
      <div className="flex-1 overflow-auto bg-slate-950 p-4 font-mono text-xs">
        {activeTab === 'code' ? (
          <div className="relative">
            <pre className="text-slate-300 leading-relaxed font-mono whitespace-pre select-text overflow-x-auto select-all">
              <code>{data.code}</code>
            </pre>
          </div>
        ) : (
          <div className="space-y-3 font-sans py-2">
            <div className="bg-slate-900 border border-slate-800/80 rounded-xl p-3 mb-4">
              <div className="flex items-center gap-2 mb-1">
                <Network className="w-4 h-4 text-emerald-400" />
                <h4 className="font-bold text-xs text-slate-200">Jetpack Compose UI Nesting Hierarchy</h4>
              </div>
              <p className="text-slate-450 text-[11px] leading-normal leading-tight">
                Inspect screen structural declarations, components hierarchy, parameters and layout blocks. In Compose, nested function calls define layout positioning directly instead of utilizing XML files.
              </p>
            </div>

            <div className="space-y-1.5 overflow-hidden">
              {structureTree.map((item, idx) => (
                <div 
                  key={idx} 
                  className={`flex items-start gap-2.5 p-2 rounded-lg transition-colors border border-transparent hover:bg-slate-900/60 hover:border-slate-850`}
                  style={{ paddingLeft: `${Math.max(12, item.depth * 20 + 8)}px` }}
                >
                  <div className="flex items-center gap-1">
                    {item.depth > 0 && (
                      <CornerDownRight className="w-3.5 h-3.5 text-slate-600 scale-90" />
                    )}
                    <span className="font-mono text-rose-400 font-semibold bg-rose-950/20 px-1.5 py-0.5 rounded border border-rose-900/10 text-[11px]">
                      {item.tag}
                    </span>
                  </div>
                  <span className="text-slate-450 text-xs translate-y-0.5 leading-snug font-sans truncate">
                    — {item.desc}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800/80 text-xs text-slate-450 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-rose-500" />
              <span>Declarative Material 3 design elements verified dynamically against Kota Bima target coordinates.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
