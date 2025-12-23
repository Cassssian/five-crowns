import { motion } from 'framer-motion';
import { Card as CardType, CardSuit, CardValue } from '@/types/game.types';
import { SUIT_SYMBOLS, SUIT_COLORS, CARD_VALUE_NAMES } from '@/constants/gameRules';
import { cn } from '@/lib/utils';

interface CardProps {
  card: CardType;
  faceUp?: boolean;
  onClick?: () => void;
  selected?: boolean;
  className?: string;
  animate?: boolean;
}

export function Card({
  card,
  faceUp = true,
  onClick,
  selected = false,
  className,
  animate = false,
}: CardProps) {
  const isJoker = card.isJoker;
  const suitSymbol = SUIT_SYMBOLS[card.suit];
  const suitColor = SUIT_COLORS[card.suit];
  const valueName = CARD_VALUE_NAMES[card.value];

  const front = (
    <div className="absolute inset-0 w-full h-full [backface-visibility:hidden]">
      <div className="w-full h-full flex flex-col items-center justify-between p-2 bg-white rounded-lg border-2 border-gray-300 shadow-md">
        {/* Coin supérieur gauche */}
        <div className="flex flex-col items-center">
          <span className={cn('text-2xl font-bold', suitColor)}>{valueName}</span>
          <span className={cn('text-3xl', suitColor)}>{suitSymbol}</span>
        </div>

        {/* Centre */}
        <div className="flex items-center justify-center flex-1">
          {isJoker ? (
            <span className="text-4xl font-bold text-purple-600">🃏</span>
          ) : (
            <span className={cn('text-6xl', suitColor)}>{suitSymbol}</span>
          )}
        </div>

        {/* Coin inférieur droit supprimé (pas d'index en bas) */}
      </div>
    </div>
  );

  const back = (
    <div
      className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)]"
    >
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-700 via-red-800 to-red-900 rounded-lg border-2 border-red-950 shadow-md relative overflow-hidden">
        {/* Pattern de fond */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.03) 10px, rgba(255,255,255,0.03) 20px)',
          }}></div>
        </div>
        {/* Logo/Symbole */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="text-yellow-300 text-4xl font-bold drop-shadow-lg">👑</div>
          <div className="text-yellow-200 text-xs font-bold mt-1 tracking-wider">5 CROWNS</div>
        </div>
      </div>
    </div>
  );

  const cardElement = (
    <div
      onClick={onClick}
      className={cn(
        'relative w-[clamp(4.5rem,7vw,6rem)] h-[clamp(6.5rem,10vw,9rem)] cursor-pointer transition-all duration-200 [transform-style:preserve-3d]',
        selected && 'transform -translate-y-2 md:-translate-y-4 ring-4 ring-blue-500',
        onClick && 'hover:scale-105',
        className
      )}
    >
      <motion.div
        initial={{ rotateY: faceUp ? 0 : 180 }}
        animate={{ rotateY: faceUp ? 0 : 180 }}
        transition={{ duration: 0.35 }}
        className="absolute inset-0 w-full h-full"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {front}
        {back}
      </motion.div>
    </div>
  );

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.3 }}
      >
        {cardElement}
      </motion.div>
    );
  }

  return cardElement;
}
