import { create } from 'zustand';
import {
    Card,
    GamePlayer,
    GameState,
    GameStatus,
    Combination,
} from '@/types/game.types';
import {
    createDeck,
    shuffleDeck,
    dealCards,
    validateAllCombinations,
    calculateRoundScores,
    determineWinner,
    aiMakeDecision,
    generateRandomAction,
} from '@/lib/gameLogic';
import { WILD_CARD_PER_ROUND, GAME_RULES } from '@/constants/gameRules';

interface LobbyPlayerData {
    id: string;
    username: string;
    avatar: string;
    badge: string;
    isAI: boolean;
}

interface GameStore extends GameState {
    // État du jeu
    myPlayerId: string;
    timerRemaining: number;
    isMyTurn: boolean;
    hasDrawnThisTurn: boolean;
    gameStatus: GameStatus;

    // Actions
    startGame: (lobbyPlayers: LobbyPlayerData[]) => void;
    initializeGame: (players: GamePlayer[], myPlayerId: string) => void;
    startRound: (roundNumber: number) => void;
    drawFromDeck: () => void;
    drawFromDiscard: () => void;
    discardCard: (cardId: string) => void;
    passTurn: () => void;
    finishRound: (combinations: Combination[]) => void;
    nextRound: () => void;
    endGame: () => string; // Retourne l'ID du gagnant

    // Timer
    startTimer: () => void;
    stopTimer: () => void;
    decrementTimer: () => void;

    // IA
    executeAITurn: (playerId: string) => void;

    // Utilitaires
    getPlayerById: (playerId: string) => GamePlayer | undefined;
    getCurrentPlayer: () => GamePlayer | undefined;
    getMyHand: () => Card[];
}

export const useGameStore = create<GameStore>((set, get) => ({
    // État initial
    gameId: '',
    roundNumber: 1,
    currentPlayerId: '',
    deck: [],
    discardPile: [],
    players: [],
    wildCard: 3,
    roundStartTime: new Date(),
    lastActionTime: new Date(),
    myPlayerId: '',
    timerRemaining: GAME_RULES.DEFAULT_TIMER_DURATION,
    isMyTurn: false,
    hasDrawnThisTurn: false,
    gameStatus: GameStatus.WAITING,

    // Démarrer le jeu depuis le lobby
    startGame: (lobbyPlayers: LobbyPlayerData[]) => {
        const gamePlayers: GamePlayer[] = lobbyPlayers.map(p => ({
            id: p.id,
            username: p.username,
            avatar: p.avatar,
            badge: p.badge,
            hand: [],
            score: 0,
            hasFinishedRound: false,
            isAI: p.isAI,
        }));

        const myPlayerId = lobbyPlayers[0].id; // Le premier joueur est toujours l'hôte
        get().initializeGame(gamePlayers, myPlayerId);
    },

    // Initialiser le jeu
    initializeGame: (players: GamePlayer[], myPlayerId: string) => {
        const deck = shuffleDeck(createDeck());

        set({
            players,
            myPlayerId,
            deck,
            gameStatus: GameStatus.IN_PROGRESS,
            currentPlayerId: players[0].id,
            isMyTurn: players[0].id === myPlayerId,
        });

        // Démarrer la première manche
        get().startRound(1);
    },

    // Démarrer une manche
    startRound: (roundNumber: number) => {
        const { players, deck } = get();
        const shuffled = shuffleDeck(deck);

        const { playerHands, remainingDeck, discardPile } = dealCards(
            shuffled,
            players.length,
            roundNumber
        );

        const updatedPlayers = players.map((player, index) => ({
            ...player,
            hand: playerHands[index],
            hasFinishedRound: false,
        }));

        const wildCard = WILD_CARD_PER_ROUND[roundNumber];

        set({
            roundNumber,
            deck: remainingDeck,
            discardPile,
            players: updatedPlayers,
            wildCard,
            roundStartTime: new Date(),
            currentPlayerId: updatedPlayers[0].id,
            isMyTurn: updatedPlayers[0].id === get().myPlayerId,
            hasDrawnThisTurn: false,
        });

        // Démarrer le timer
        get().startTimer();
    },

    // Piocher du deck
    drawFromDeck: () => {
        const { deck, currentPlayerId, players } = get();

        if (deck.length === 0) return;
        if (get().hasDrawnThisTurn) return;

        const drawnCard = deck[0];
        const remainingDeck = deck.slice(1);

        const updatedPlayers = players.map((player) => {
            if (player.id === currentPlayerId) {
                return {
                    ...player,
                    hand: [...player.hand, drawnCard],
                };
            }
            return player;
        });

        set({
            deck: remainingDeck,
            players: updatedPlayers,
            hasDrawnThisTurn: true,
            lastActionTime: new Date(),
        });
    },

    // Piocher de la défausse
    drawFromDiscard: () => {
        const { discardPile, currentPlayerId, players } = get();

        if (discardPile.length === 0) return;
        if (get().hasDrawnThisTurn) return;

        const drawnCard = discardPile[discardPile.length - 1];
        const remainingDiscard = discardPile.slice(0, -1);

        const updatedPlayers = players.map((player) => {
            if (player.id === currentPlayerId) {
                return {
                    ...player,
                    hand: [...player.hand, drawnCard],
                };
            }
            return player;
        });

        set({
            discardPile: remainingDiscard,
            players: updatedPlayers,
            hasDrawnThisTurn: true,
            lastActionTime: new Date(),
        });
    },

    // Défausser une carte
    discardCard: (cardId: string) => {
        const { currentPlayerId, players, discardPile } = get();

        if (!get().hasDrawnThisTurn) return;

        const currentPlayer = players.find((p) => p.id === currentPlayerId);
        if (!currentPlayer) return;

        const cardToDiscard = currentPlayer.hand.find((c) => c.id === cardId);
        if (!cardToDiscard) return;

        const updatedPlayers = players.map((player) => {
            if (player.id === currentPlayerId) {
                return {
                    ...player,
                    hand: player.hand.filter((c) => c.id !== cardId),
                };
            }
            return player;
        });

        // Passer au joueur suivant
        const currentPlayerIndex = players.findIndex((p) => p.id === currentPlayerId);
        const nextPlayerIndex = (currentPlayerIndex + 1) % players.length;
        const nextPlayerId = players[nextPlayerIndex].id;

        set({
            discardPile: [...discardPile, cardToDiscard],
            players: updatedPlayers,
            currentPlayerId: nextPlayerId,
            isMyTurn: nextPlayerId === get().myPlayerId,
            hasDrawnThisTurn: false,
            lastActionTime: new Date(),
        });

        // Réinitialiser le timer
        get().startTimer();

        // Si le prochain joueur est une IA, exécuter son tour
        const nextPlayer = players[nextPlayerIndex];
        if (nextPlayer.isAI) {
            setTimeout(() => {
                get().executeAITurn(nextPlayerId);
            }, 1500); // Délai de 1.5s pour le réalisme
        }
    },

    // Passer la manche (piocher automatiquement puis défausser une carte aléatoire)
    passTurn: () => {
        const { currentPlayerId, players, hasDrawnThisTurn } = get();

        if (!hasDrawnThisTurn) return;

        const currentPlayer = players.find((p) => p.id === currentPlayerId);
        if (!currentPlayer || currentPlayer.hand.length === 0) return;

        // Défausser une carte aléatoire
        const randomIndex = Math.floor(Math.random() * currentPlayer.hand.length);
        const cardToDiscard = currentPlayer.hand[randomIndex];

        get().discardCard(cardToDiscard.id);
    },

    // Terminer la manche
    finishRound: (combinations: Combination[]) => {
        const { currentPlayerId, players, roundNumber } = get();

        const currentPlayer = players.find((p) => p.id === currentPlayerId);
        if (!currentPlayer) return;

        // Valider les combinaisons
        const validation = validateAllCombinations(
            combinations,
            currentPlayer.hand,
            roundNumber
        );

        if (!validation.valid) {
            console.error('Combinaisons invalides:', validation.error);
            alert(`Erreur: ${validation.error}`);
            return;
        }

        // Marquer le joueur comme ayant terminé
        const updatedPlayers = players.map((player) => {
            if (player.id === currentPlayerId) {
                return {
                    ...player,
                    hasFinishedRound: true,
                    hand: [], // Vider la main
                };
            }
            return player;
        });

        set({
            players: updatedPlayers,
            lastActionTime: new Date(),
        });

        // Vérifier si tous les joueurs ont terminé
        const allFinished = updatedPlayers.every((p) => p.hasFinishedRound);

        if (allFinished) {
            // Calculer les scores et passer à la manche suivante
            setTimeout(() => {
                get().nextRound();
            }, 2000);
        } else {
            // Passer au joueur suivant
            const currentPlayerIndex = players.findIndex((p) => p.id === currentPlayerId);
            const nextPlayerIndex = (currentPlayerIndex + 1) % players.length;
            const nextPlayerId = players[nextPlayerIndex].id;

            set({
                currentPlayerId: nextPlayerId,
                isMyTurn: nextPlayerId === get().myPlayerId,
                hasDrawnThisTurn: false,
            });

            get().startTimer();

            // Si le prochain joueur est une IA, exécuter son tour
            const nextPlayer = players[nextPlayerIndex];
            if (nextPlayer.isAI) {
                setTimeout(() => {
                    get().executeAITurn(nextPlayerId);
                }, 1500);
            }
        }
    },

    // Passer à la manche suivante
    nextRound: () => {
        const { players, roundNumber } = get();

        // Calculer les scores de la manche
        const roundScores = calculateRoundScores(players, roundNumber);

        // Mettre à jour les scores totaux
        const updatedPlayers = players.map((player) => ({
            ...player,
            score: player.score + (roundScores[player.id] || 0),
        }));

        set({ players: updatedPlayers });

        // Si c'était la dernière manche, terminer le jeu
        if (roundNumber === GAME_RULES.TOTAL_ROUNDS) {
            get().endGame();
        } else {
            // Sinon, démarrer la manche suivante
            setTimeout(() => {
                get().startRound(roundNumber + 1);
            }, 3000);
        }
    },

    // Terminer le jeu
    endGame: () => {
        const { players } = get();
        const winnerId = determineWinner(players);

        set({
            gameStatus: GameStatus.COMPLETED,
        });

        get().stopTimer();

        return winnerId;
    },

    // Démarrer le timer
    startTimer: () => {
        set({ timerRemaining: GAME_RULES.DEFAULT_TIMER_DURATION });
    },

    // Arrêter le timer
    stopTimer: () => {
        set({ timerRemaining: 0 });
    },

    // Décrémenter le timer
    decrementTimer: () => {
        const { timerRemaining, hasDrawnThisTurn, currentPlayerId, players, discardPile } = get();

        if (timerRemaining <= 0) {
            // Temps écoulé, exécuter une action aléatoire
            const currentPlayer = players.find((p) => p.id === currentPlayerId);
            if (currentPlayer) {
                const randomAction = generateRandomAction(
                    currentPlayer.hand,
                    discardPile,
                    hasDrawnThisTurn
                );

                if (randomAction.action === 'draw_from_deck') {
                    get().drawFromDeck();
                } else if (randomAction.action === 'draw_from_discard') {
                    get().drawFromDiscard();
                } else if (randomAction.action === 'discard' && randomAction.cardId) {
                    get().discardCard(randomAction.cardId);
                }
            }
        } else {
            set({ timerRemaining: timerRemaining - 1 });
        }
    },

    // Exécuter le tour de l'IA
    executeAITurn: (playerId: string) => {
        const { players, discardPile, roundNumber, hasDrawnThisTurn } = get();

        const aiPlayer = players.find((p) => p.id === playerId);
        if (!aiPlayer || !aiPlayer.isAI) return;

        const decision = aiMakeDecision(
            aiPlayer.hand,
            discardPile,
            roundNumber,
            hasDrawnThisTurn
        );

        if (decision.action === 'draw_from_deck') {
            get().drawFromDeck();
            // Après avoir pioché, l'IA doit défausser
            setTimeout(() => {
                get().executeAITurn(playerId);
            }, 1000);
        } else if (decision.action === 'draw_from_discard') {
            get().drawFromDiscard();
            setTimeout(() => {
                get().executeAITurn(playerId);
            }, 1000);
        } else if (decision.action === 'discard' && decision.cardId) {
            get().discardCard(decision.cardId);
        } else if (decision.action === 'finish_round' && decision.combinations) {
            get().finishRound(decision.combinations);
        }
    },

    // Utilitaires
    getPlayerById: (playerId: string) => {
        return get().players.find((p) => p.id === playerId);
    },

    getCurrentPlayer: () => {
        return get().players.find((p) => p.id === get().currentPlayerId);
    },

    getMyHand: () => {
        const myPlayer = get().players.find((p) => p.id === get().myPlayerId);
        return myPlayer?.hand || [];
    },
}));