
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { Check } from 'lucide-react';
import { AppView } from '../types';

interface WorkflowStepperProps {
  currentView: AppView;
  onViewChange: (view: AppView) => void;
}

export const WorkflowStepper: React.FC<WorkflowStepperProps> = ({ currentView, onViewChange }) => {
  const steps = [
    { id: 'assets', label: 'Upload Assets', number: 1 },
    { id: 'studio', label: 'Design Mockup', number: 2 },
    { id: 'try-on', label: 'Virtual Try-On', number: 3 },
    { id: 'gallery', label: 'Gallery', number: 4 },
  ];

  const viewOrder = ['assets', 'studio', 'try-on', 'gallery'];
  const currentIndex = viewOrder.indexOf(currentView);
  const progress = Math.max(0, (currentIndex / (steps.length - 1)) * 100);

  return (
    <div className="w-full max-w-2xl mx-auto mb-12 hidden md:block animate-fade-in px-4">
      <div className="relative">
         <div className="absolute top-1/2 left-0 right-0 h-1 bg-zinc-800 -translate-y-1/2 rounded-full"></div>
         <div 
            className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 -translate-y-1/2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
         ></div>
         <div className="relative flex justify-between w-full">
            {steps.map((step, index) => {
               const isCompleted = currentIndex > index;
               const isCurrent = currentIndex === index;
               return (
                  <button 
                    key={step.id}
                    onClick={() => onViewChange(step.id as AppView)}
                    className={`group flex flex-col items-center focus:outline-none relative z-10 cursor-pointer`}
                  >
                     <div className={`
                        w-10 h-10 rounded-full flex items-center justify-center border-[3px] transition-all duration-300 bg-zinc-950
                        ${isCurrent 
                           ? 'border-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.5)] scale-110' 
                           : isCompleted 
                              ? 'border-indigo-600 bg-indigo-600 text-white' 
                              : 'border-zinc-800 text-zinc-600 group-hover:border-zinc-600 group-hover:text-zinc-400'}
                     `}>
                        {isCompleted ? <Check size={18} strokeWidth={3} /> : <span className="text-sm font-bold font-mono">{step.number}</span>}
                     </div>
                     <span className={`
                        absolute top-14 text-xs font-medium tracking-wider transition-all duration-300 whitespace-nowrap
                        ${isCurrent ? 'text-indigo-400 opacity-100 transform translate-y-0' : isCompleted ? 'text-zinc-400 opacity-80' : 'text-zinc-600 opacity-60 group-hover:opacity-100'}
                     `}>
                        {step.label}
                     </span>
                  </button>
               )
            })}
         </div>
      </div>
    </div>
  )
};
