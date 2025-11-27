import React, { useState, useEffect } from 'react';
import { Hive } from './components/Hive';
import { Controls } from './components/Controls';
import { ScoreBoard } from './components/ScoreBoard';
import { WordList } from './components/WordList';
import { generatePuzzle } from './services/puzzleService';
import { GameState, FoundWord, GameStatus } from './types';
import { Flower } from 'lucide-react';

const MAX_MOVES = 12;

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    centerLetter: '',
    outerLetters: [],
    foundWords: [],
    currentInput: '',
    score: 0,
    maxMoves: MAX_MOVES,
    movesMade: 0,
    bonusLetter: null,
    loading: true,
    error: null,
    validWords: new Set(),
  });

  const [status, setStatus] = useState<GameStatus>(GameStatus.IDLE);
  const [inputError, setInputError] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Initialize game
  useEffect(() => {
    startNewGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startNewGame = async () => {
    setGameState(prev => ({ ...prev, loading: true, error: null, foundWords: [], score: 0, movesMade: 0, currentInput: '' }));
    setFeedbackMessage(null);
    setStatus(GameStatus.IDLE);
    
    try {
      const puzzle = await generatePuzzle();
      const bonusIndex = Math.floor(Math.random() * 6);
      
      setGameState({
        centerLetter: puzzle.centerLetter,
        outerLetters: puzzle.outerLetters,
        validWords: new Set(puzzle.validWords),
        foundWords: [],
        currentInput: '',
        score: 0,
        maxMoves: MAX_MOVES,
        movesMade: 0,
        bonusLetter: puzzle.outerLetters[bonusIndex],
        loading: false,
        error: null,
      });
      setStatus(GameStatus.PLAYING);
    } catch (err) {
      setGameState(prev => ({ ...prev, loading: false, error: "Failed to load puzzle." }));
    }
  };

  const handleLetterClick = (letter: string) => {
    if (status !== GameStatus.PLAYING) return;
    setGameState(prev => ({ ...prev, currentInput: prev.currentInput + letter }));
    setInputError(false);
  };

  const handleDelete = () => {
    setGameState(prev => ({ ...prev, currentInput: prev.currentInput.slice(0, -1) }));
    setInputError(false);
  };

  const handleShuffle = () => {
    setGameState(prev => {
        const shuffled = [...prev.outerLetters].sort(() => Math.random() - 0.5);
        return { ...prev, outerLetters: shuffled };
    });
  };

  const calculateScore = (word: string, isBonus: boolean, isPangram: boolean): number => {
    let pts = 0;
    if (word.length === 4) pts = 2;
    else if (word.length === 5) pts = 4;
    else if (word.length === 6) pts = 6;
    else pts = 12; // 7+ letters

    if (isPangram) pts += 7;
    if (isBonus) pts *= 2;

    return pts;
  };

  const showFeedback = (msg: string, type: 'error' | 'success' = 'error') => {
    setFeedbackMessage(msg);
    if (type === 'error') setInputError(true);
    setTimeout(() => {
        setFeedbackMessage(null);
        setInputError(false);
    }, 2000);
  };

  const handleSubmit = () => {
    if (status !== GameStatus.PLAYING || !gameState.currentInput) return;
    
    const word = gameState.currentInput;
    const { centerLetter, outerLetters, validWords, foundWords, movesMade, maxMoves, bonusLetter } = gameState;

    // Basic Validation Rules
    if (word.length < 4) {
        showFeedback("Too short");
        return;
    }
    if (!word.includes(centerLetter)) {
        showFeedback("Missing center letter");
        return;
    }
    if (foundWords.some(fw => fw.word === word)) {
        showFeedback("Already found");
        return;
    }

    // Check against pre-fetched list
    const isValid = validWords.has(word);

    if (isValid) {
        // Success Logic
        const isBonus = bonusLetter ? word.includes(bonusLetter) : false;
        // Check Pangram: Unique letters in word must equal 7
        const uniqueLetters = new Set(word.split(''));
        const isPangram = uniqueLetters.size === 7; 

        const wordScore = calculateScore(word, isBonus, isPangram);
        
        const newFoundWord: FoundWord = {
            word,
            score: wordScore,
            isPangram,
            isBonus
        };

        const newScore = gameState.score + wordScore;
        const newMovesMade = movesMade + 1;

        setGameState(prev => ({
            ...prev,
            foundWords: [...prev.foundWords, newFoundWord],
            score: newScore,
            movesMade: newMovesMade,
            currentInput: '',
        }));

        if (newMovesMade >= maxMoves) {
            setStatus(GameStatus.GAME_OVER);
        } else {
            // Visual success indicator
            setFeedbackMessage(`+${wordScore}`);
            setTimeout(() => setFeedbackMessage(null), 1500);
        }

    } else {
        showFeedback("Not in word list");
    }
  };

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (status !== GameStatus.PLAYING) return;
        
        const char = e.key.toUpperCase();
        if (char === "ENTER") {
            handleSubmit();
        } else if (char === "BACKSPACE") {
            handleDelete();
        } else if (char === " ") {
            handleShuffle();
        } else if (/^[A-Z]$/.test(char)) {
            const all = [gameState.centerLetter, ...gameState.outerLetters];
            if (all.includes(char)) {
                handleLetterClick(char);
            }
        }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, gameState.currentInput, gameState.outerLetters, gameState.centerLetter]);

  if (gameState.loading) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
             <Flower className="animate-spin-slow text-pink-400 mb-4" size={64} />
             <p className="text-slate-600 font-medium">Pollinating puzzle...</p>
        </div>
    );
  }

  if (gameState.error) {
     return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
            <h2 className="text-2xl font-bold text-red-500 mb-2">Oh no!</h2>
            <p className="text-slate-600 mb-4">{gameState.error}</p>
            <button onClick={startNewGame} className="px-4 py-2 bg-stem text-white rounded-lg">Try Again</button>
        </div>
     );
  }

  return (
    <div className="min-h-screen flex flex-col items-center py-8 px-4 max-w-lg mx-auto">
      {/* Header */}
      <header className="w-full flex justify-between items-center mb-6">
        <h1 className="text-3xl font-serif font-bold text-pink-900 flex items-center">
             <Flower className="mr-2 text-pink-500" />
             Blossom
        </h1>
        <button 
            onClick={startNewGame}
            className="text-sm font-semibold text-stem-dark hover:text-stem underline"
        >
            New Game
        </button>
      </header>

      {/* Scoreboard */}
      <ScoreBoard 
        score={gameState.score} 
        movesMade={gameState.movesMade} 
        maxMoves={gameState.maxMoves}
        foundCount={gameState.foundWords.length}
      />

      {/* Message Area */}
      <div className="h-8 mb-2 flex items-center justify-center">
          {feedbackMessage && (
              <span className={`px-3 py-1 rounded-full text-sm font-bold animate-fade-in ${feedbackMessage.startsWith('+') ? 'bg-amber-100 text-amber-700' : 'bg-slate-800 text-white'}`}>
                  {feedbackMessage}
              </span>
          )}
          {status === GameStatus.GAME_OVER && !feedbackMessage && (
               <span className="px-3 py-1 rounded-full text-sm font-bold bg-purple-100 text-purple-700">
                  Game Over! Final Score: {gameState.score}
              </span>
          )}
      </div>

      {/* Game Board */}
      <div className="mb-8">
        <Hive 
            centerLetter={gameState.centerLetter} 
            outerLetters={gameState.outerLetters} 
            bonusLetter={gameState.bonusLetter}
            onLetterClick={handleLetterClick}
        />
      </div>

      {/* Controls */}
      <Controls 
        currentInput={gameState.currentInput}
        centerLetter={gameState.centerLetter}
        isValidating={false}
        onDelete={handleDelete}
        onShuffle={handleShuffle}
        onSubmit={handleSubmit}
        inputError={inputError}
      />

      {/* Word List */}
      <WordList words={gameState.foundWords} />
      
      {/* Footer Info */}
      <div className="mt-12 text-center text-xs text-slate-400">
          <p>Create words using 7 letters.</p>
          <p>Words must have 4+ letters and use the center letter.</p>
          <p className="mt-1">
             <span className="inline-block w-2 h-2 rounded-full bg-petal-bonus mr-1"></span> 
             Pink petals give 2x score bonus!
          </p>
      </div>
    </div>
  );
};

export default App;
