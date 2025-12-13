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

  const cardContent = faceUp ? (
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

      {/* Coin inférieur droit (inversé) */}
      <div className="flex flex-col items-center rotate-180">
        <span className={cn('text-2xl font-bold', suitColor)}>{valueName}</span>
        <span className={cn('text-3xl', suitColor)}>{suitSymbol}</span>
      </div>
    </div>
  ) : (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg border-2 border-blue-900 shadow-md">
      <div className="text-white text-4xl">🂠</div>
    </div>
  );

  const cardElement = (
    <div
      onClick={onClick}
      className={cn(
        'relative w-24 h-36 cursor-pointer transition-all duration-200',
        selected && 'transform -translate-y-4 ring-4 ring-blue-500',
        onClick && 'hover:scale-105',
        className
      )}
    >
      {cardContent}
    </div>
  );

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
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