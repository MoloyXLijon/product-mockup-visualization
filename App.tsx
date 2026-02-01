
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect } from 'react';
import { 
  Layout, Box, Image as ImageIcon, Wand2, Plus, Download, 
  Sparkles, Shirt, Maximize, RotateCcw, ArrowRight, Scan, 
  Aperture, Package, Menu, X, User as UserIcon, LogOut, LogIn, Trash2,
  Palette, Globe, Settings2, AlignCenter
} from 'lucide-react';
import { Button } from './components/Button';
import { apiService } from './services/apiService';
import { Asset, GeneratedMockup, AppView, LoadingState, PlacedLayer, User } from './types';
import { AuthOverlay } from './components/AuthOverlay';
import { IntroSequence } from './components/IntroSequence';
import { NavButton } from './components/NavButton';
import { WorkflowStepper } from './components/WorkflowStepper';
import { AssetSection } from './components/AssetSection';

export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [showAuthOverlay, setShowAuthOverlay] = useState(false);
  const [view, setView] = useState<AppView>('dashboard');
  const [assets, setAssets] = useState<Asset[]>([]);
  const [generatedMockups, setGeneratedMockups] = useState<GeneratedMockup[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedMockup, setSelectedMockup] = useState<GeneratedMockup | null>(null);
  
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [placedLogos, setPlacedLogos] = useState<PlacedLayer[]>([]);
  const [prompt, setPrompt] = useState('');
  const [scenePrompt, setScenePrompt] = useState('');
  const [lightingStyle, setLightingStyle] = useState<'studio' | 'natural' | 'neon' | 'cinematic'>('studio');
  const [loading, setLoading] = useState<LoadingState>({ isGenerating: false, message: '' });
  const [activeLayerUid, setActiveLayerUid] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      try {
        const [a, m] = await Promise.all([apiService.getAssets(), apiService.getMockups()]);
        setAssets(a);
        setGeneratedMockups(m);
      } catch (err) { console.error('Cloud sync failed', err); }
    };
    fetchData();
  }, [user]);

  useEffect(() => {
    const timer = setTimeout(() => setShowIntro(false), 9000);
    const saved = localStorage.getItem('sku_foundry_user');
    if (saved) setUser(JSON.parse(saved));
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem('sku_foundry_user', JSON.stringify(userData));
  };

  const handleLogout = async () => {
    try { await apiService.logout(); } finally {
      setUser(null);
      localStorage.removeItem('sku_foundry_user');
      setView('dashboard');
    }
  };

  const addLayer = (assetId: string) => {
    const layer: PlacedLayer = {
      uid: Math.random().toString(36).substr(2, 9),
      assetId, x: 50, y: 50, scale: 1, rotation: 0, opacity: 1
    };
    setPlacedLogos(p => [...p, layer]);
    setActiveLayerUid(layer.uid);
  };

  const handleRender = async () => {
    if (!selectedProductId || placedLogos.length === 0) return;
    setLoading({ isGenerating: true, message: 'Cloud Staging Engine initializing...' });
    try {
      const result = await apiService.renderMockup({
        productId: selectedProductId,
        layers: placedLogos,
        prompt,
        scenePrompt,
        lightingStyle
      });
      setGeneratedMockups(p => [result, ...p]);
      setView('gallery');
    } catch (e) {
      alert('Backend Render Failed. Ensure Laravel is running and Gemini Key is set.');
    } finally {
      setLoading({ isGenerating: false, message: '' });
    }
  };

  if (showIntro) return <IntroSequence onComplete={() => setShowIntro(false)} />;

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans flex overflow-hidden relative">
      {showAuthOverlay && <AuthOverlay onLogin={handleLogin} onClose={() => setShowAuthOverlay(false)} />}
      
      <aside className="w-64 border-r border-zinc-800 bg-zinc-950 flex flex-col hidden md:flex">
        <div className="h-16 border-b border-zinc-800 flex items-center px-6">
          <Package className="text-indigo-500 mr-2" />
          <span className="font-bold text-lg">SKU LARAVEL PRO</span>
        </div>
        <div className="p-4 space-y-1 flex-1 overflow-y-auto">
          <NavButton icon={<Layout size={18} />} label="Dashboard" active={view === 'dashboard'} onClick={() => setView('dashboard')} />
          <NavButton icon={<Box size={18} />} label="Cloud Vault" active={view === 'assets'} number={assets.length} onClick={() => setView('assets')} />
          <NavButton icon={<Palette size={18} />} label="Brand Hub" active={view === 'brand-lab'} onClick={() => setView('brand-lab')} />
          <div className="pt-4 pb-2 px-4"><span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Logic Engines</span></div>
          <NavButton icon={<Wand2 size={18} />} label="Pro Studio" active={view === 'studio'} onClick={() => setView('studio')} />
          <NavButton icon={<Scan size={18} />} label="AR Preview" active={view === 'try-on'} onClick={() => setView('try-on')} />
          <NavButton icon={<ImageIcon size={18} />} label="Cloud Gallery" active={view === 'gallery'} number={generatedMockups.length} onClick={() => setView('gallery')} />
        </div>
        <div className="p-4 border-t border-zinc-800">
          {user ? <NavButton icon={<LogOut size={18} />} label="Sign Out" variant="danger" onClick={handleLogout} /> : <NavButton icon={<LogIn size={18} />} label="Join Cloud" variant="success" onClick={() => setShowAuthOverlay(true)} />}
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto relative pt-16 md:pt-0">
        <header className="sticky top-0 z-40 h-16 bg-black/80 backdrop-blur-md border-b border-zinc-800 flex items-center justify-between px-8">
           <div className="text-xs uppercase tracking-widest text-zinc-500 font-bold">{view} <span className="text-zinc-700">|</span> Backend: LARAVEL</div>
           <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs font-bold text-white leading-none">{user ? user.name : 'Guest User'}</p>
                <p className="text-[10px] text-indigo-400 font-mono mt-0.5">AUTH: {user ? 'VERIFIED' : 'GUEST'}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 overflow-hidden shadow-xl">
                {user?.avatar ? <img src={user.avatar} className="w-full h-full" alt="" /> : <UserIcon size={20} className="m-2.5 text-zinc-600" />}
              </div>
           </div>
        </header>

        <div className="max-w-7xl mx-auto p-6 lg:p-10">
          {view === 'dashboard' && (
            <div className="animate-fade-in text-center py-20 flex flex-col items-center">
              <h1 className="text-5xl md:text-8xl font-black mb-8 tracking-tighter leading-tight">THE POWER OF <br/><span className="hero-gradient">CLOUD AI DESIGN</span></h1>
              <p className="text-zinc-500 text-lg max-w-xl mb-12">Integrated Laravel backend with Gemini Flash AI image orchestration. Build, sync, and stage your brand globally.</p>
              <div className="flex gap-4">
                <Button size="lg" onClick={() => setView('studio')} icon={<ArrowRight />}>Enter Studio</Button>
                <Button size="lg" variant="outline" onClick={() => setView('assets')}>Asset Library</Button>
              </div>
            </div>
          )}

          {view === 'assets' && (
             <div className="animate-fade-in space-y-10">
                <WorkflowStepper currentView="assets" onViewChange={setView} />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                   <AssetSection title="Products" icon={<Shirt size={20} />} type="product" assets={assets.filter(a => a.type === 'product')} onAdd={a => setAssets(p => [...p, a])} onRemove={id => apiService.deleteAsset(id).then(() => setAssets(p => p.filter(a => a.id !== id)))} validateApiKey={async()=>true} onApiError={console.error} />
                   <AssetSection title="Graphics" icon={<Palette size={20} />} type="logo" assets={assets.filter(a => a.type === 'logo')} onAdd={a => setAssets(p => [...p, a])} onRemove={id => apiService.deleteAsset(id).then(() => setAssets(p => p.filter(a => a.id !== id)))} validateApiKey={async()=>true} onApiError={console.error} />
                </div>
             </div>
          )}

          {view === 'studio' && (
            <div className="animate-fade-in h-[calc(100vh-14rem)] flex flex-col lg:flex-row gap-6">
              <div className="w-full lg:w-80 glass-panel p-6 rounded-2xl flex flex-col gap-6 overflow-y-auto">
                 <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Base Select</h3>
                 <div className="grid grid-cols-3 gap-2">
                    {assets.filter(a => a.type === 'product').map(a => (
                       <div key={a.id} onClick={() => setSelectedProductId(a.id)} className={`aspect-square rounded-xl border-2 transition-all cursor-pointer p-1 bg-zinc-900 ${selectedProductId === a.id ? 'border-indigo-500' : 'border-zinc-800'}`}>
                          <img src={a.data} className="w-full h-full object-contain" alt="" />
                       </div>
                    ))}
                 </div>
                 <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Overlays</h3>
                 <div className="grid grid-cols-3 gap-2">
                    {assets.filter(a => a.type === 'logo').map(a => (
                       <div key={a.id} onClick={() => addLayer(a.id)} className="aspect-square rounded-xl border-2 border-zinc-800 p-1 cursor-pointer hover:border-indigo-500 bg-zinc-900 transition-all">
                          <img src={a.data} className="w-full h-full object-contain" alt="" />
                       </div>
                    ))}
                 </div>
                 <Button onClick={handleRender} isLoading={loading.isGenerating} className="mt-auto py-5 rounded-xl shadow-indigo-500/20" icon={<Wand2 size={18}/>}>Cloud Render</Button>
              </div>

              <div className="flex-1 glass-panel rounded-3xl bg-zinc-950 border border-zinc-800 relative flex items-center justify-center p-12 group overflow-hidden">
                  {loading.isGenerating && (
                    <div className="absolute inset-0 z-50 bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center text-center p-10">
                       <Aperture className="w-20 h-20 text-indigo-500 animate-spin mb-8" />
                       <h2 className="text-2xl font-bold mb-2">Engaging Gemini AI...</h2>
                       <p className="text-zinc-500 max-w-xs">{loading.message}</p>
                    </div>
                  )}
                  {selectedProductId ? (
                    <div className="relative w-full h-full">
                       <img src={assets.find(a => a.id === selectedProductId)?.data} className="w-full h-full object-contain opacity-30 select-none pointer-events-none" alt="" />
                       {placedLogos.map(l => (
                          <div key={l.uid} className="absolute ring-1 ring-indigo-500/30" style={{ left: `${l.x}%`, top: `${l.y}%`, transform: 'translate(-50%, -50%)', width: '20%' }}>
                             <img src={assets.find(a => a.id === l.assetId)?.data} className="w-full h-full object-contain drop-shadow-2xl" alt="" />
                          </div>
                       ))}
                    </div>
                  ) : <div className="text-zinc-700 uppercase text-[10px] font-black tracking-widest">Awaiting configuration</div>}
              </div>
            </div>
          )}

          {view === 'gallery' && (
            <div className="animate-fade-in grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {generatedMockups.map(m => (
                  <div key={m.id} className="glass-panel rounded-2xl overflow-hidden border border-zinc-800 group relative shadow-2xl hover:border-indigo-500/50 transition-all">
                     <img src={m.image_url} className="w-full aspect-square object-cover transition-transform group-hover:scale-105 duration-700" alt="" />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 flex items-end p-6 transition-all">
                        <div className="flex justify-between w-full items-center">
                           <p className="text-xs text-zinc-400 font-mono">ID: {String(m.id).substr(0,8)}</p>
                           <a href={m.image_url} download className="p-2 bg-indigo-600 rounded-lg hover:bg-indigo-500"><Download size={16}/></a>
                        </div>
                     </div>
                  </div>
               ))}
               {generatedMockups.length === 0 && <div className="col-span-full py-40 text-center opacity-20"><ImageIcon size={64} className="mx-auto mb-4" /><p>No cloud history</p></div>}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
