import { WORDS } from './dictionary';
import { PuzzleData } from '../types';

export const generatePuzzle = async (): Promise<PuzzleData> => {
  // Simulating async for UI consistency
  return new Promise((resolve) => {
    setTimeout(() => {
      const minLength = 4;
      // Filter strictly for length to be safe
      const wordList = WORDS.filter(w => w.length >= minLength).map(w => w.toUpperCase());
      
      // Identify pangrams (7 unique letters) from the word list
      const pangrams = wordList.filter(w => new Set(w).size === 7);
      
      // Fallback if something goes wrong with the list
      let seedWord = "FLOWERS";
      if (pangrams.length > 0) {
        seedWord = pangrams[Math.floor(Math.random() * pangrams.length)];
      }

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

      // Find all valid words from our dictionary that can be formed with these letters
      // and must contain the center letter.
      const validWords = wordList.filter(word => {
        // Must contain center letter
        if (!word.includes(centerLetter)) return false;
        
        // Must only use available letters
        for (const char of word) {
          if (!allLettersSet.has(char)) return false;
        }
        
        return true;
      });
      
      // Identify pangrams within the valid words for scoring/display
      const puzzlePangrams = validWords.filter(w => new Set(w).size === 7);

      resolve({
        centerLetter,
        outerLetters,
        validWords,
        pangrams: puzzlePangrams
      });
    }, 100);
  });
};
