
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState } from 'react';
import { Trash2, Sparkles } from 'lucide-react';
import { Asset } from '../types';
import { Button } from './Button';
import { FileUploader } from './FileUploader';
import { generateAsset } from '../services/geminiService';

interface AssetSectionProps {
  title: string;
  icon: React.ReactNode;
  type: 'logo' | 'product';
  assets: Asset[];
  onAdd: (a: Asset) => void;
  onRemove: (id: string) => void;
  validateApiKey: () => Promise<boolean>;
  onApiError: (e: any) => void;
}

export const AssetSection: React.FC<AssetSectionProps> = ({ 
  title, 
  icon, 
  type, 
  assets, 
  onAdd, 
  onRemove,
  validateApiKey,
  onApiError
}) => {
  const [mode, setMode] = useState<'upload' | 'generate'>('upload');
  const [genPrompt, setGenPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!genPrompt) return;
    if (!(await validateApiKey())) return;
    setIsGenerating(true);
    try {
      const b64 = await generateAsset(genPrompt, type);
      onAdd({
        id: Math.random().toString(36).substring(7),
        type,
        name: `AI Generated ${type}`,
        data: b64,
        // Fix: Use 'mime_type' from Asset interface instead of 'mimeType'.
        mime_type: 'image/png'
      });
      setGenPrompt('');
    } catch (e: any) {
      onApiError(e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="glass-panel p-6 rounded-2xl h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2">{icon} {title}</h2>
          <span className="text-xs bg-zinc-800 px-2 py-1 rounded text-zinc-400">{assets.length} items</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6 overflow-y-auto max-h-[400px] pr-2">
          {assets.map(asset => (
            <div key={asset.id} className="relative group aspect-square bg-zinc-900 rounded-lg overflow-hidden border border-zinc-700">
                <img src={asset.data} className="w-full h-full object-contain p-2" alt={asset.name} />
                <button onClick={() => onRemove(asset.id)} className="absolute top-1 right-1 p-1 bg-red-500/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 size={12} />
                </button>
            </div>
          ))}
          {assets.length === 0 && (
            <div className="col-span-2 sm:col-span-3 flex flex-col items-center justify-center h-32 text-zinc-500 border border-dashed border-zinc-800 rounded-lg">
              <p className="text-sm">No {type}s yet</p>
            </div>
          )}
      </div>
      <div className="mt-auto pt-4 border-t border-zinc-800">
        <div className="flex gap-4 mb-4">
           <button onClick={() => setMode('upload')} className={`text-sm font-medium pb-1 border-b-2 transition-colors ${mode === 'upload' ? 'border-indigo-500 text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}>Upload</button>
           <button onClick={() => setMode('generate')} className={`text-sm font-medium pb-1 border-b-2 transition-colors ${mode === 'generate' ? 'border-indigo-500 text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}>Generate with AI</button>
        </div>
        {mode === 'upload' ? (
           <FileUploader label={`Upload ${type}`} onFileSelect={(f) => {
              const reader = new FileReader();
              reader.onload = (e) => {
                // Fix: Use 'mime_type' from Asset interface instead of 'mimeType'.
                onAdd({ id: Math.random().toString(36).substring(7), type, name: f.name, data: e.target?.result as string, mime_type: f.type });
              };
              reader.readAsDataURL(f);
           }} />
        ) : (
           <div className="space-y-3">
              <textarea value={genPrompt} onChange={(e) => setGenPrompt(e.target.value)} placeholder={`Describe the ${type}...`} className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-base text-white focus:ring-2 focus:ring-indigo-500 resize-none h-24 placeholder:text-zinc-600" />
              <Button onClick={handleGenerate} isLoading={isGenerating} disabled={!genPrompt} className="w-full" icon={<Sparkles size={16} />}>Generate {type}</Button>
           </div>
        )}
      </div>
    </div>
  );
};
