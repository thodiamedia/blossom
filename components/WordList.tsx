import React from 'react';
import { FoundWord } from '../types';

interface WordListProps {
  words: FoundWord[];
}

export const WordList: React.FC<WordListProps> = ({ words }) => {
  if (words.length === 0) {
    return (
      <div className="w-full max-w-sm mt-8 text-center text-slate-400 italic">
        Your bouquet is empty. Start planting words!
      </div>
    );
  }

  // Sort by most recent (top)
  const reversedWords = [...words].reverse();

  return (
    <div className="w-full max-w-sm mt-8 px-4">
      <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3 border-b pb-1">
        Found Words ({words.length})
      </h3>
      <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
        {reversedWords.map((item, idx) => (
          <div key={idx} className="flex justify-between items-center bg-white/50 rounded-lg px-3 py-2 animate-slide-up">
            <span className={`font-medium ${item.isPangram ? 'text-amber-700 font-bold' : 'text-slate-700'}`}>
              {item.word}
            </span>
            <div className="flex items-center space-x-2">
                {item.isPangram && (
                    <span className="text-[10px] bg-amber-200 text-amber-800 px-1.5 py-0.5 rounded-full font-bold">
                        PAN
                    </span>
                )}
                {item.isBonus && (
                    <span className="text-[10px] bg-pink-200 text-pink-800 px-1.5 py-0.5 rounded-full font-bold">
                        BONUS
                    </span>
                )}
                <span className="text-slate-400 font-mono text-sm">+{item.score}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};