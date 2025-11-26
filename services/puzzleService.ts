import { WORDS } from './dictionary';
import { PuzzleData } from '../types';

export const generatePuzzle = async (): Promise<PuzzleData> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const minLength = 4;
      const wordList = WORDS.filter(w => w.length >= minLength).map(w => w.toUpperCase());
      
      // Find pangrams (words with exactly 7 unique letters)
      const pangrams = wordList.filter(w => new Set(w).size === 7);
      
      if (pangrams.length === 0) {
         // Fallback if no pangrams found (unlikely with full dictionary)
         resolve({
             centerLetter: 'L',
             outerLetters: ['B', 'O', 'S', 'M', 'E', 'A'],
             validWords: ['FLOWERS', 'LOWER', 'FLOWER', 'ROWER', 'SOWER', 'SLOW', 'FLOW', 'WOLF', 'ROLE', 'ROSE', 'SORE', 'LOSE', 'LESS', 'SEER', 'FEEL', 'FLEE', 'FREE', 'REEL'],
             pangrams: ['FLOWERS']
         });
         return;
      }

      // Select a random pangram
      const seedWord = pangrams[Math.floor(Math.random() * pangrams.length)];
      const uniqueLetters = Array.from(new Set(seedWord));
      
      // Select center letter
      const centerIndex = Math.floor(Math.random() * uniqueLetters.length);
      const centerLetter = uniqueLetters[centerIndex];
      
      // Get outer letters
      const outerLetters = uniqueLetters.filter((_, i) => i !== centerIndex);
      
      // Shuffle outer letters
      for (let i = outerLetters.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [outerLetters[i], outerLetters[j]] = [outerLetters[j], outerLetters[i]];
      }

      const allLettersSet = new Set(uniqueLetters);

      // Find all valid words
      const validWords = wordList.filter(word => {
        // Must contain center letter
        if (!word.includes(centerLetter)) return false;
        
        // Must only use available letters
        for (const char of word) {
          if (!allLettersSet.has(char)) return false;
        }
        
        return true;
      });
      
      // Find pangrams within valid words (includes the seed word and potential others)
      const puzzlePangrams = validWords.filter(w => new Set(w).size === 7);

      resolve({
        centerLetter,
        outerLetters,
        validWords,
        pangrams: puzzlePangrams
      });
    }, 100); // Small delay to simulate async if needed, but mostly for UI feel
  });
};
