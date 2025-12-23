import { Badge as BadgeType } from '@/types/game.types';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PlayerBadgeProps {
    badge: BadgeType;
    size?: 'sm' | 'md' | 'lg';
    showTooltip?: boolean;
}

export default function PlayerBadge({ badge, size = 'md', showTooltip = true }: PlayerBadgeProps) {
    const [isHovered, setIsHovered] = useState(false);

    const sizeClasses = {
        sm: 'text-xs px-1.5 py-0.5 gap-1',
        md: 'text-sm px-2 py-1 gap-1.5',
        lg: 'text-base px-3 py-1.5 gap-2',
    };

    const emojiSizes = {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
    };

    // @ts-ignore
    // @ts-ignore
    // @ts-ignore
    // @ts-ignore
    return (
        <div className="relative inline-block">
            <motion.div
                className={`
                    inline-flex items-center
                    ${sizeClasses[size]}
                    bg-gradient-to-r from-gray-700 to-gray-800
                    rounded-md
                    border border-gray-600
                    ${showTooltip ? 'cursor-pointer' : ''}
                    transition-all duration-200
                    hover:from-gray-600 hover:to-gray-700
                    hover:border-gray-500
                    hover:shadow-lg
                    select-none
                `}
                onMouseEnter={() => showTooltip && setIsHovered(true)}
                onMouseLeave={() => showTooltip && setIsHovered(false)}
                whileHover={showTooltip ? { scale: 1.05 } : {}}
                whileTap={showTooltip ? { scale: 0.95 } : {}}
            >
                <span className={emojiSizes[size]}>{badge.emoji}</span>
                <span className="font-bold text-white uppercase tracking-wide">
                    {badge.title.substring(0, 4)}
                </span>
            </motion.div>

            {/* Tooltip personnalisé */}
            {showTooltip && (
                <AnimatePresence>
                    {isHovered && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.9 }}
                            transition={{ duration: 0.2 }}
                            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 pointer-events-none"
                        >
                            <div className="bg-gray-900 text-white rounded-lg shadow-2xl border border-gray-700 p-4 min-w-[250px]">
                                {/* Titre avec emoji */}
                                <div className="flex items-center gap-2 mb-2 border-b border-gray-700 pb-2">
                                    <span className="text-2xl">{badge.emoji}</span>
                                    <span className="font-bold text-lg">{badge.title}</span>
                                </div>
                                
                                {/* Description */}
                                <p className="text-sm text-gray-300 mb-3">
                                    {badge.description}
                                </p>
                                
                                {/* Requirement */}
                                <div className="text-xs text-gray-400 bg-gray-800 rounded px-2 py-1">
                                    {badge.requirementType === 'TOTAL_GAMES' && `Jouer ${badge.requirementValue} parties`}
                                    {badge.requirementType === 'TOTAL_WINS' && `Gagner ${badge.requirementValue} parties`}
                                    {badge.requirementType === 'LOW_SCORE' && `Score < ${badge.requirementValue}`}
                                    {badge.requirementType === 'FAST_WIN' && `Gagner en < ${Math.floor(badge.requirementValue / 60)}min`}
                                    {badge.requirementType === 'WIN_STREAK' && `${badge.requirementValue} victoires d'affilée`}
                                    {badge.requirementType === 'PERFECT_ROUND' && 'Manche parfaite (0 pts)'}
                                    {badge.requirementType === 'JOKER_USAGE' && `Utiliser ${badge.requirementValue} jokers`}
                                    {badge.requirementType === 'NO_JOKER_WIN' && 'Gagner sans joker'}
                                    {badge.requirementType === 'AI_WINS' && `Battre ${badge.requirementValue} IA`}
                                    {badge.requirementType === 'MULTIPLAYER_GAMES' && `${badge.requirementValue} parties multi`}
                                    {badge.requirementType === 'TIME_OF_DAY' && 'Jouer à une heure spéciale'}
                                    {badge.requirementType === 'CONSECUTIVE_LOSSES' && `Perdre ${badge.requirementValue} fois puis gagner`}
                                    {badge.requirementType === 'BADGE_COLLECTOR' && `Débloquer ${badge.requirementValue} badges`}
                                    {badge.requirementType === 'SPECIAL_ACTION' && 'Action spéciale'}
                                </div>
                                
                                {/* Flèche du tooltip */}
                                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
                                    <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-gray-700"></div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            )}
        </div>
    );
}
