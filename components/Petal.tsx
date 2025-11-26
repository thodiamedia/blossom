import React from 'react';

interface PetalProps {
  letter: string;
  isCenter?: boolean;
  isBonus?: boolean;
  onClick: (letter: string) => void;
  className?: string;
  rotation?: number;
}

export const Petal: React.FC<PetalProps> = ({ 
  letter, 
  isCenter = false, 
  isBonus = false,
  onClick,
  className = "",
  rotation = 0
}) => {
  // Shape Paths for 100x100 ViewBox
  
  // Pistil: Simple Circle
  const pistilPath = (
    <circle cx="50" cy="50" r="48" />
  );

  // Petal: Rounded petal shape pointing UP (narrow bottom, wide top)
  // Base at (50, 100)
  const petalPath = (
    <path d="M50 100 C 35 70 10 50 10 25 A 40 40 0 1 1 90 25 C 90 50 65 70 50 100 Z" />
  );

  // Determine CSS class based on user request mapping
  let svgClass = isCenter ? "pistil" : "petal";
  if (!isCenter && isBonus) {
    svgClass += " bonus";
  }

  return (
    <button
      onClick={() => onClick(letter)}
      className={`group relative w-28 h-28 flex items-center justify-center focus:outline-none transition-transform duration-300 hover:scale-105 active:scale-95 z-10 hover:z-30 ${className}`}
      style={{ transform: `rotate(${rotation}deg)` }}
      aria-label={isCenter ? `Center letter ${letter}` : `Letter ${letter}`}
    >
      <svg 
        viewBox="0 0 100 100" 
        className={svgClass}
      >
        {isCenter ? pistilPath : petalPath}
      </svg>
      {/* Letter text - cancel out rotation so it stays upright */}
      {/* For petals, the "center" of the visual shape is higher up (around y=35-40), not center (50) */}
      <span 
        className={`absolute inset-0 flex items-center justify-center text-3xl font-bold uppercase pointer-events-none select-none ${isCenter ? 'font-extrabold text-4xl' : 'pb-4'}`}
        style={{ transform: `rotate(${-rotation}deg)` }}
      >
        {letter}
      </span>
      {isBonus && !isCenter && (
        <span 
            className="absolute bottom-6 left-1/2 text-[10px] font-bold text-pink-900 opacity-60 pointer-events-none"
            style={{ transform: `translate(-50%, 0) rotate(${-rotation}deg)` }}
        >
          x2
        </span>
      )}
    </button>
  );
};