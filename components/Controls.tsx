import React from 'react';
import { Shuffle, Delete } from 'lucide-react';

interface ControlsProps {
  currentInput: string;
  centerLetter: string;
  isValidating: boolean;
  onDelete: () => void;
  onShuffle: () => void;
  onSubmit: () => void;
  inputError?: boolean;
}

export const Controls: React.FC<ControlsProps> = ({
  currentInput,
  centerLetter,
  isValidating, // kept in props interface for compatibility but unused visually
  onDelete,
  onShuffle,
  onSubmit,
  inputError
}) => {
  return (
    <div className="flex flex-col items-center space-y-6 w-full max-w-sm">
      {/* Input Display */}
      <div className="relative h-12 w-full flex items-center justify-center">
        <span className={`text-3xl font-bold tracking-widest uppercase transition-colors duration-200 ${inputError ? 'text-red-500 animate-bounce-short' : 'text-slate-800'}`}>
           {/* Highlight center letter in the input */}
           {currentInput.split('').map((char, idx) => (
             <span key={idx} className={char === centerLetter ? 'text-amber-600' : ''}>
               {char}
             </span>
           ))}
           <span className="animate-pulse text-slate-400">|</span>
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onDelete}
          className="p-3 rounded-full border-2 border-slate-200 text-slate-600 hover:bg-slate-50 active:bg-slate-100 transition-colors"
          aria-label="Delete last letter"
        >
          <Delete size={20} />
        </button>

        <button
          onClick={onShuffle}
          className="p-3 rounded-full border-2 border-slate-200 text-slate-600 hover:bg-slate-50 active:bg-slate-100 transition-colors"
          aria-label="Shuffle letters"
        >
          <Shuffle size={20} />
        </button>

        <button
          onClick={onSubmit}
          disabled={!currentInput}
          className="px-6 py-3 rounded-full bg-stem text-white font-semibold shadow-md hover:bg-stem-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
        >
          <span>Enter</span>
        </button>
      </div>
    </div>
  );
};
