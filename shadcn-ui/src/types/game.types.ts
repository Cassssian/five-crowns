// Types pour le jeu Five Crowns

export enum CardSuit {
    STARS = 'stars',
    HEARTS = 'hearts',
    CLUBS = 'clubs',
    SPADES = 'spades',
    DIAMONDS = 'diamonds'
}

export enum CardValue {
    THREE = 3,
    FOUR = 4,
    FIVE = 5,
    SIX = 6,
    SEVEN = 7,
    EIGHT = 8,
    NINE = 9,
    TEN = 10,
    JACK = 11,
    QUEEN = 12,
    KING = 13,
    JOKER = 0
}

export interface Card {
    id: string;
    suit: CardSuit;
    value: CardValue;
    isJoker: boolean; // Joker permanent (6 dans le jeu)
}

export enum CombinationType {
    RUN = 'run',      // Suite (3+ cartes consécutives de la même couleur)
    SET = 'set'       // Brelan (3+ cartes de même valeur)
}

export interface Combination {
    type: CombinationType;
    cards: Card[];
}

export enum GameStatus {
    WAITING = 'waiting',
    IN_PROGRESS = 'in_progress',
    COMPLETED = 'completed',
    ABANDONED = 'abandoned'
}

export enum PlayerStatus {
    ACTIVE = 'active',
    DISCONNECTED = 'disconnected',
    ABANDONED = 'abandoned'
}

export interface Player {
    id: string;
    username: string;
    avatarUrl: string;
    currentBadgeId: string;
    isAI: boolean;
    isReady: boolean;
    status: PlayerStatus;
}

export interface GamePlayer extends Player {
    position: number;
    score: number;
    hand: Card[];
    hasFinishedRound: boolean;
}

export interface Game {
    id: string;
    code: string;
    hostId: string;
    status: GameStatus;
    maxPlayers: number;
    timerEnabled: boolean;
    timerDuration: number;
    currentRound: number;
    wildCard: CardValue;
    createdAt: Date;
    startedAt: Date | null;
    completedAt: Date | null;
}

export interface GameState {
    gameId: string;
    roundNumber: number;
    currentPlayerId: string;
    deck: Card[];
    discardPile: Card[];
    players: GamePlayer[];
    wildCard: CardValue;
    roundStartTime: Date;
    lastActionTime: Date;
}

export enum ActionType {
    DRAW_FROM_DECK = 'draw_from_deck',
    DRAW_FROM_DISCARD = 'draw_from_discard',
    DISCARD = 'discard',
    FINISH_ROUND = 'finish_round'
}

export interface GameAction {
    id: string;
    gameId: string;
    playerId: string;
    actionType: ActionType;
    actionData: {
        cardId?: string;
        card?: Card;
        combinations?: Combination[];
    };
    timestamp: Date;
}

export interface Badge {
    id: string;
    emoji: string;
    title: string;
    description: string;
    requirementType: BadgeRequirementType;
    requirementValue: number;
}

export enum BadgeRequirementType {
    TOTAL_WINS = 'total_wins',
    TOTAL_GAMES = 'total_games',
    WIN_STREAK = 'win_streak',
    LOW_SCORE = 'low_score',
    PERFECT_ROUND = 'perfect_round',
    SPECIAL_ACTION = 'special_action',
    FAST_WIN = 'fast_win',
    JOKER_USAGE = 'joker_usage',
    NO_JOKER_WIN = 'no_joker_win',
    MULTIPLAYER_GAMES = 'multiplayer_games',
    AI_WINS = 'ai_wins',
    TIME_OF_DAY = 'time_of_day',
    CONSECUTIVE_LOSSES = 'consecutive_losses',
    BADGE_COLLECTOR = 'badge_collector'
}

export interface Statistics {
    userId: string;
    totalGames: number;
    totalWins: number;
    winRate: number;
    totalPlaytime: number; // en secondes
    currentWinStreak: number;
    longestWinStreak: number;
    fastestWin: number; // en secondes
    lowestScore: number;
    perfectRounds: number;
    jokersUsed: number;
    multiplayerGames: number;
    aiWins: number;
}

export interface Profile {
    id: string;
    username: string;
    avatarUrl: string;
    currentBadgeId: string;
    unlockedBadges: string[];
    statistics: Statistics;
    createdAt: Date;
    updatedAt: Date;
}

export interface GameHistory {
    id: string;
    gameId: string;
    winnerId: string;
    players: {
        id: string;
        username: string;
        score: number;
        position: number;
    }[];
    finalScores: Record<string, number>;
    duration: number; // en secondes
    completedAt: Date;
    actions: GameAction[];
}