import { CardSuit, CardValue, Badge, BadgeRequirementType } from '@/types/game.types';

// Règles du jeu Five Crowns
export const GAME_RULES = {
  MIN_PLAYERS: 2,
  MAX_PLAYERS: 8,
  TOTAL_ROUNDS: 11,
  MIN_COMBINATION_SIZE: 3,
  TOTAL_CARDS: 116, // 5 couleurs × 11 valeurs × 2 + 6 jokers
  JOKER_POINTS: 50,
  WILD_CARD_POINTS: 20,
  DEFAULT_TIMER_DURATION: 30, // secondes
};

// Valeurs des cartes pour le scoring
export const CARD_POINTS: Record<CardValue, number> = {
  [CardValue.THREE]: 3,
  [CardValue.FOUR]: 4,
  [CardValue.FIVE]: 5,
  [CardValue.SIX]: 6,
  [CardValue.SEVEN]: 7,
  [CardValue.EIGHT]: 8,
  [CardValue.NINE]: 9,
  [CardValue.TEN]: 10,
  [CardValue.JACK]: 11,
  [CardValue.QUEEN]: 12,
  [CardValue.KING]: 13,
  [CardValue.JOKER]: 50,
};

// Nombre de cartes distribuées par manche
export const CARDS_PER_ROUND: Record<number, number> = {
  1: 3,
  2: 4,
  3: 5,
  4: 6,
  5: 7,
  6: 8,
  7: 9,
  8: 10,
  9: 11,
  10: 12,
  11: 13,
};

// Carte joker variable par manche
export const WILD_CARD_PER_ROUND: Record<number, CardValue> = {
  1: CardValue.THREE,
  2: CardValue.FOUR,
  3: CardValue.FIVE,
  4: CardValue.SIX,
  5: CardValue.SEVEN,
  6: CardValue.EIGHT,
  7: CardValue.NINE,
  8: CardValue.TEN,
  9: CardValue.JACK,
  10: CardValue.QUEEN,
  11: CardValue.KING,
};

// Couleurs du jeu
export const SUITS = [
  CardSuit.STARS,
  CardSuit.HEARTS,
  CardSuit.CLUBS,
  CardSuit.SPADES,
  CardSuit.DIAMONDS,
];

// Valeurs des cartes (sans joker)
export const CARD_VALUES = [
  CardValue.THREE,
  CardValue.FOUR,
  CardValue.FIVE,
  CardValue.SIX,
  CardValue.SEVEN,
  CardValue.EIGHT,
  CardValue.NINE,
  CardValue.TEN,
  CardValue.JACK,
  CardValue.QUEEN,
  CardValue.KING,
];

// Symboles des couleurs pour l'affichage
export const SUIT_SYMBOLS: Record<CardSuit, string> = {
  [CardSuit.STARS]: '★',
  [CardSuit.HEARTS]: '♥',
  [CardSuit.CLUBS]: '♣',
  [CardSuit.SPADES]: '♠',
  [CardSuit.DIAMONDS]: '♦',
};

// Couleurs CSS pour les couleurs de cartes
export const SUIT_COLORS: Record<CardSuit, string> = {
  [CardSuit.STARS]: 'text-yellow-500',
  [CardSuit.HEARTS]: 'text-red-500',
  [CardSuit.CLUBS]: 'text-gray-800',
  [CardSuit.SPADES]: 'text-gray-800',
  [CardSuit.DIAMONDS]: 'text-red-500',
};

// Noms des valeurs de cartes pour l'affichage
export const CARD_VALUE_NAMES: Record<CardValue, string> = {
  [CardValue.THREE]: '3',
  [CardValue.FOUR]: '4',
  [CardValue.FIVE]: '5',
  [CardValue.SIX]: '6',
  [CardValue.SEVEN]: '7',
  [CardValue.EIGHT]: '8',
  [CardValue.NINE]: '9',
  [CardValue.TEN]: '10',
  [CardValue.JACK]: 'V',
  [CardValue.QUEEN]: 'D',
  [CardValue.KING]: 'R',
  [CardValue.JOKER]: 'JOKER',
};

// 30 Badges déblocables
export const BADGES: Badge[] = [
  {
    id: 'badge_1',
    emoji: '🏆',
    title: 'Premier Pas',
    description: 'Terminer sa première partie',
    requirementType: BadgeRequirementType.TOTAL_GAMES,
    requirementValue: 1,
  },
  {
    id: 'badge_2',
    emoji: '🎯',
    title: 'Précision',
    description: 'Gagner une partie avec moins de 50 points',
    requirementType: BadgeRequirementType.LOW_SCORE,
    requirementValue: 50,
  },
  {
    id: 'badge_3',
    emoji: '⚡',
    title: 'Éclair',
    description: 'Gagner une partie en moins de 15 minutes',
    requirementType: BadgeRequirementType.FAST_WIN,
    requirementValue: 900, // 15 minutes en secondes
  },
  {
    id: 'badge_4',
    emoji: '🔥',
    title: 'En Feu',
    description: 'Gagner 3 parties d\'affilée',
    requirementType: BadgeRequirementType.WIN_STREAK,
    requirementValue: 3,
  },
  {
    id: 'badge_5',
    emoji: '💎',
    title: 'Perfection',
    description: 'Terminer une manche avec 0 point',
    requirementType: BadgeRequirementType.PERFECT_ROUND,
    requirementValue: 1,
  },
  {
    id: 'badge_6',
    emoji: '🎲',
    title: 'Chanceux',
    description: 'Utiliser 50 jokers au total',
    requirementType: BadgeRequirementType.JOKER_USAGE,
    requirementValue: 50,
  },
  {
    id: 'badge_7',
    emoji: '🧠',
    title: 'Stratège',
    description: 'Gagner sans utiliser de joker',
    requirementType: BadgeRequirementType.NO_JOKER_WIN,
    requirementValue: 1,
  },
  {
    id: 'badge_8',
    emoji: '👑',
    title: 'Roi',
    description: 'Gagner 10 parties',
    requirementType: BadgeRequirementType.TOTAL_WINS,
    requirementValue: 10,
  },
  {
    id: 'badge_9',
    emoji: '🌟',
    title: 'Légende',
    description: 'Gagner 50 parties',
    requirementType: BadgeRequirementType.TOTAL_WINS,
    requirementValue: 50,
  },
  {
    id: 'badge_10',
    emoji: '💯',
    title: 'Centurion',
    description: 'Gagner 100 parties',
    requirementType: BadgeRequirementType.TOTAL_WINS,
    requirementValue: 100,
  },
  {
    id: 'badge_11',
    emoji: '🎪',
    title: 'Polyvalent',
    description: 'Jouer 100 parties (victoire ou défaite)',
    requirementType: BadgeRequirementType.TOTAL_GAMES,
    requirementValue: 100,
  },
  {
    id: 'badge_12',
    emoji: '⏱️',
    title: 'Contre la Montre',
    description: 'Gagner 5 parties avec timer activé',
    requirementType: BadgeRequirementType.SPECIAL_ACTION,
    requirementValue: 5,
  },
  {
    id: 'badge_13',
    emoji: '🎭',
    title: 'Comédien',
    description: 'Jouer 200 parties',
    requirementType: BadgeRequirementType.TOTAL_GAMES,
    requirementValue: 200,
  },
  {
    id: 'badge_14',
    emoji: '🏅',
    title: 'Vétéran',
    description: 'Jouer 500 parties',
    requirementType: BadgeRequirementType.TOTAL_GAMES,
    requirementValue: 500,
  },
  {
    id: 'badge_15',
    emoji: '🤖',
    title: 'Dompteur d\'IA',
    description: 'Gagner 20 parties contre des IA',
    requirementType: BadgeRequirementType.AI_WINS,
    requirementValue: 20,
  },
  {
    id: 'badge_16',
    emoji: '👥',
    title: 'Social',
    description: 'Jouer 50 parties multijoueurs',
    requirementType: BadgeRequirementType.MULTIPLAYER_GAMES,
    requirementValue: 50,
  },
  {
    id: 'badge_17',
    emoji: '🏃',
    title: 'Marathon',
    description: 'Jouer 10 parties d\'affilée',
    requirementType: BadgeRequirementType.SPECIAL_ACTION,
    requirementValue: 10,
  },
  {
    id: 'badge_18',
    emoji: '🌙',
    title: 'Noctambule',
    description: 'Jouer entre minuit et 6h du matin',
    requirementType: BadgeRequirementType.TIME_OF_DAY,
    requirementValue: 0, // Minuit
  },
  {
    id: 'badge_19',
    emoji: '☀️',
    title: 'Matinal',
    description: 'Jouer entre 6h et 9h du matin',
    requirementType: BadgeRequirementType.TIME_OF_DAY,
    requirementValue: 6,
  },
  {
    id: 'badge_20',
    emoji: '🎯',
    title: 'Sniper',
    description: 'Gagner une manche en posant toutes ses cartes d\'un coup',
    requirementType: BadgeRequirementType.SPECIAL_ACTION,
    requirementValue: 1,
  },
  {
    id: 'badge_21',
    emoji: '🛡️',
    title: 'Défenseur',
    description: 'Finir 2ème dans 20 parties',
    requirementType: BadgeRequirementType.SPECIAL_ACTION,
    requirementValue: 20,
  },
  {
    id: 'badge_22',
    emoji: '💪',
    title: 'Persévérant',
    description: 'Perdre 10 parties d\'affilée puis gagner',
    requirementType: BadgeRequirementType.CONSECUTIVE_LOSSES,
    requirementValue: 10,
  },
  {
    id: 'badge_23',
    emoji: '🎲',
    title: 'Collectionneur',
    description: 'Débloquer 15 autres badges',
    requirementType: BadgeRequirementType.BADGE_COLLECTOR,
    requirementValue: 15,
  },
  {
    id: 'badge_24',
    emoji: '👑',
    title: 'Maître',
    description: 'Débloquer tous les autres badges',
    requirementType: BadgeRequirementType.BADGE_COLLECTOR,
    requirementValue: 29,
  },
  {
    id: 'badge_25',
    emoji: '🚀',
    title: 'Pionnier',
    description: 'Être parmi les 100 premiers joueurs',
    requirementType: BadgeRequirementType.SPECIAL_ACTION,
    requirementValue: 100,
  },
  {
    id: 'badge_26',
    emoji: '🔥',
    title: 'Invincible',
    description: 'Gagner 5 parties d\'affilée',
    requirementType: BadgeRequirementType.WIN_STREAK,
    requirementValue: 5,
  },
  {
    id: 'badge_27',
    emoji: '💎',
    title: 'Diamant',
    description: 'Avoir un ratio de victoire supérieur à 70%',
    requirementType: BadgeRequirementType.SPECIAL_ACTION,
    requirementValue: 70,
  },
  {
    id: 'badge_28',
    emoji: '⚡',
    title: 'Rapide comme l\'éclair',
    description: 'Gagner en moins de 10 minutes',
    requirementType: BadgeRequirementType.FAST_WIN,
    requirementValue: 600, // 10 minutes
  },
  {
    id: 'badge_29',
    emoji: '🎨',
    title: 'Artiste',
    description: 'Gagner avec uniquement des suites',
    requirementType: BadgeRequirementType.SPECIAL_ACTION,
    requirementValue: 1,
  },
  {
    id: 'badge_30',
    emoji: '🏆',
    title: 'Champion Ultime',
    description: 'Gagner 200 parties',
    requirementType: BadgeRequirementType.TOTAL_WINS,
    requirementValue: 200,
  },
];