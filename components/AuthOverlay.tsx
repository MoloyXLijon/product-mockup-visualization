
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState } from 'react';
import { X, Package, User as UserIcon, Mail, Lock, Zap, ArrowRight, Github, Chrome } from 'lucide-react';
import { Button } from './Button';
import { User } from '../types';

interface AuthOverlayProps {
  onLogin: (user: User) => void;
  onClose: () => void;
}

export const AuthOverlay: React.FC<AuthOverlayProps> = ({ onLogin, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);

  const handleAuthSuccess = (userData: User) => {
    localStorage.setItem('sku_foundry_user', JSON.stringify(userData));
    onLogin(userData);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const mockUser: User = {
        id: Math.random().toString(36).substring(7),
        email,
        name: isLogin ? email.split('@')[0] : name,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
      };
      handleAuthSuccess(mockUser);
      setLoading(false);
    }, 1200);
  };

  const handleSocialLogin = (provider: 'github' | 'google') => {
    setSocialLoading(provider);
    setTimeout(() => {
      const mockUser: User = {
        id: `${provider}_${Math.random().toString(36).substring(7)}`,
        email: `social.${provider}@example.com`,
        name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} Designer`,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${provider}_user`
      };
      handleAuthSuccess(mockUser);
      setSocialLoading(null);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 overflow-hidden animate-fade-in">
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.1)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>

      <div className="relative w-full max-w-md animate-slide-up">
        <div className="glass-panel p-8 rounded-3xl border border-zinc-800 shadow-2xl relative overflow-hidden">
          <button onClick={onClose} className="absolute top-4 right-4 p-2 text-zinc-500 hover:text-white transition-colors">
            <X size={20} />
          </button>
          
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
          
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center mb-4 shadow-inner">
              <Package size={32} className="text-indigo-500" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white uppercase">SKU Foundry</h1>
            <p className="text-zinc-500 text-sm mt-1">{isLogin ? 'Welcome back to the forge' : 'Create your designer profile'}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-500 uppercase ml-1">Full Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
                  <input 
                    type="text" 
                    required 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-white focus:border-indigo-500 transition-colors outline-none" 
                    placeholder="John Doe" 
                  />
                </div>
              </div>
            )}
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-500 uppercase ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
                <input 
                  type="email" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-white focus:border-indigo-500 transition-colors outline-none" 
                  placeholder="name@company.com" 
                />
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-zinc-500 uppercase ml-1">Password</label>
                {isLogin && <button type="button" className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold uppercase">Forgot?</button>}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
                <input 
                  type="password" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-white focus:border-indigo-500 transition-colors outline-none" 
                  placeholder="••••••••" 
                />
              </div>
            </div>

            <Button isLoading={loading} className="w-full py-4 rounded-xl mt-4" icon={isLogin ? <Zap size={18}/> : <ArrowRight size={18}/>}>
              {isLogin ? 'Authorize Access' : 'Initialize Account'}
            </Button>
          </form>

          <div className="mt-6 flex flex-col gap-3">
            <div className="relative flex items-center justify-center my-3">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-zinc-800"></div></div>
              <span className="relative bg-zinc-900 px-4 text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Or Login With</span>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => handleSocialLogin('github')}
                disabled={!!socialLoading || loading}
                className="flex items-center justify-center gap-2 bg-zinc-950 border border-zinc-800 hover:border-zinc-700 rounded-xl py-2.5 transition-all text-sm font-medium text-zinc-300 disabled:opacity-50"
              >
                {socialLoading === 'github' ? (
                   <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                ) : <Github size={18} />} 
                GitHub
              </button>
              <button 
                onClick={() => handleSocialLogin('google')}
                disabled={!!socialLoading || loading}
                className="flex items-center justify-center gap-2 bg-zinc-950 border border-zinc-800 hover:border-zinc-700 rounded-xl py-2.5 transition-all text-sm font-medium text-zinc-300 disabled:opacity-50"
              >
                {socialLoading === 'google' ? (
                   <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                ) : <Chrome size={18} />} 
                Google
              </button>
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-zinc-500">
            {isLogin ? "New to the foundry?" : "Already have access?"} 
            <button onClick={() => setIsLogin(!isLogin)} className="ml-1 text-indigo-400 font-bold hover:underline">
              {isLogin ? 'Sign up' : 'Log in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
