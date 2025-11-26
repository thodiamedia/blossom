export interface PuzzleData {
  centerLetter: string;
  outerLetters: string[];
  validWords: string[]; // A subset of common words for client-side validation logic
  pangrams: string[];
}

export interface GameState {
  centerLetter: string;
  outerLetters: string[];
  foundWords: FoundWord[];
  currentInput: string;
  score: number;
  maxMoves: number;
  movesMade: number;
  bonusLetter: string | null; // One outer letter can be a bonus multiplier
  loading: boolean;
  error: string | null;
  validWords: Set<string>; // For quick lookup
}

export interface FoundWord {
  word: string;
  score: number;
  isPangram: boolean;
  isBonus: boolean;
}

export enum GameStatus {
  IDLE,
  PLAYING,
  GAME_OVER,
}