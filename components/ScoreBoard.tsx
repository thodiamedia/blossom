import React from 'react';
import { Trophy, Move } from 'lucide-react';

interface ScoreBoardProps {
  score: number;
  movesMade: number;
  maxMoves: number;
  foundCount: number;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({ score, movesMade, maxMoves, foundCount }) => {
  const movesLeft = maxMoves - movesMade;
  const percentage = Math.min(100, (movesMade / maxMoves) * 100);

  return (
    <div className="w-full max-w-md bg-white/60 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-white flex justify-between items-center mb-6">
      <div className="flex flex-col">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Score</div>
        <div className="flex items-center space-x-2">
            <Trophy className="text-amber-500" size={20} />
            <span className="text-2xl font-bold text-slate-800">{score}</span>
        </div>
      </div>

      <div className="h-10 w-px bg-slate-200 mx-4"></div>

      <div className="flex flex-col items-end">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Moves Left</div>
        <div className="flex items-center space-x-2">
            <span className={`text-2xl font-bold ${movesLeft < 3 ? 'text-red-500' : 'text-slate-800'}`}>
                {movesLeft}
            </span>
             <span className="text-slate-400 text-sm">/ {maxMoves}</span>
        </div>
      </div>
    </div>
  );
};