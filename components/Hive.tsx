import React from 'react';
import { Petal } from './Petal';

interface HiveProps {
  centerLetter: string;
  outerLetters: string[];
  bonusLetter: string | null;
  onLetterClick: (letter: string) => void;
}

export const Hive: React.FC<HiveProps> = ({ 
  centerLetter, 
  outerLetters, 
  bonusLetter,
  onLetterClick 
}) => {
  // Configuration for radial positioning
  // 0 degrees is UP. 
  const radius = 88; // Reduced to bring letters closer to pistil
  
  // 6 Positions around the circle (60 degree increments)
  const positions = [
    { deg: 0 },   // Top
    { deg: 60 },  // Top Right
    { deg: 120 }, // Bottom Right
    { deg: 180 }, // Bottom
    { deg: 240 }, // Bottom Left
    { deg: 300 }, // Top Left
  ];

  const getPositionStyle = (deg: number) => {
    // Convert deg to radians. 0 deg is UP (negative Y)
    // x = r * sin(a)
    // y = r * -cos(a)
    const rad = deg * (Math.PI / 180);
    const x = radius * Math.sin(rad);
    const y = radius * -Math.cos(rad);
    
    return { 
      transform: `translate(${x}px, ${y}px)`,
    };
  };

  return (
    <div className="relative w-[360px] h-[360px] flex items-center justify-center select-none">
      {/* Center (Pistil) */}
      <div className="absolute z-20">
        <Petal 
          letter={centerLetter} 
          isCenter={true} 
          onClick={onLetterClick} 
        />
      </div>

      {/* Outer Petals */}
      {outerLetters.map((letter, index) => (
        <div 
          key={letter}
          className="absolute z-10 transition-all duration-500 ease-in-out"
          style={getPositionStyle(positions[index].deg)}
        >
          <Petal 
            letter={letter} 
            isBonus={letter === bonusLetter}
            onClick={onLetterClick}
            rotation={positions[index].deg + 180}
          />
        </div>
      ))}
    </div>
  );
};