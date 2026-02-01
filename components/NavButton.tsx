
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';

interface NavButtonProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
  number?: number;
  variant?: 'default' | 'danger' | 'success';
}

export const NavButton: React.FC<NavButtonProps> = ({ icon, label, active, onClick, number, variant = 'default' }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group
      ${active ? 'bg-indigo-500/10 text-white border-l-2 border-indigo-500' : 'text-zinc-500 hover:bg-zinc-900 hover:text-zinc-200'}
      ${variant === 'danger' ? 'hover:bg-red-500/10 hover:text-red-400' : ''}
      ${variant === 'success' ? 'hover:bg-emerald-500/10 hover:text-emerald-400' : ''}
    `}
  >
    <span className={`
      ${active ? 'text-indigo-400' : 
        variant === 'danger' ? 'text-zinc-600 group-hover:text-red-400' : 
        variant === 'success' ? 'text-zinc-600 group-hover:text-emerald-400' : 
        'text-zinc-600 group-hover:text-zinc-400'} 
      transition-colors
    `}>
      {icon}
    </span>
    <span className="font-medium text-sm tracking-wide flex-1 text-left">{label}</span>
    {number !== undefined && (
      <span className={`text-xs font-bold font-mono px-1.5 py-0.5 rounded min-w-[1.5rem] text-center transition-colors ${active ? 'bg-indigo-500 text-white' : 'bg-zinc-800 text-zinc-500'}`}>
        {number}
      </span>
    )}
  </button>
);
