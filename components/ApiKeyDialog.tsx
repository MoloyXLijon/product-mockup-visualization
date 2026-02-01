
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { KeyRound } from 'lucide-react';

interface ApiKeyDialogProps {
  onContinue: () => void;
}

const ApiKeyDialog: React.FC<ApiKeyDialogProps> = ({ onContinue }) => {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[200] p-4 animate-fade-in">
      <div className="glass-panel bg-zinc-900/95 border border-zinc-700 rounded-2xl shadow-2xl max-w-lg w-full p-8 text-center flex flex-col items-center">
        <div className="bg-indigo-600/20 p-4 rounded-full mb-6">
          <KeyRound className="w-12 h-12 text-indigo-400" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-4">API Key Required</h2>
        <p className="text-zinc-300 mb-6">
          This application uses Gemini AI models.
          <br/>
          Please select your <strong>Google Cloud Project</strong> API key to proceed.
        </p>
        <p className="text-zinc-400 mb-8 text-sm">
          Both Free Tier and Paid keys are supported.
        </p>
        <button
          onClick={onContinue}
          className="w-full px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg transition-colors text-lg shadow-lg shadow-indigo-500/20"
        >
          Select API Key
        </button>
      </div>
    </div>
  );
};

export default ApiKeyDialog;
