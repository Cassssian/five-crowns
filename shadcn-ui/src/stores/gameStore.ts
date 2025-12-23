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
    avatar: string; // émoji pour l'avatar (depuis le lobby)
    badge: any; // Badge complet depuis le lobby (contient .id)
    isAI: boolean;
}

type GameMode = 'online' | 'offline';

interface GameStore extends GameState {
    // État du jeu
    myPlayerId: string;
    timerRemaining: number;
    isMyTurn: boolean;
    hasDrawnThisTurn: boolean;
    gameStatus: GameStatus;
    // paramètres issus du lobby
    gameMode: GameMode;
    timerEnabled: boolean;
    // état post-défausse
    awaitingEndOrLayDown: boolean;

    // Fin de manche (overlay + animations)
    firstFinisherId?: string;
    winnerCardsSnapshot?: Card[]; // main du premier joueur qui a posé (avant vidage)
    roundOverlay?: {
        visible: boolean;
        winnerId: string;
        winnerCards: Card[];
        isMeWinner: boolean;
        myPoints: number;
        myScoreBefore: number;
        myScoreAfter: number;
    };

    // Actions
    startGame: (payload: { players: LobbyPlayerData[]; mode: GameMode; timerEnabled: boolean; myPlayerId?: string }) => void;
    initializeGame: (players: GamePlayer[], myPlayerId: string) => void;
    startRound: (roundNumber: number) => void;
    drawFromDeck: () => void;
    drawFromDiscard: () => void;
    discardCard: (cardId: string) => void;
    endTurnAfterDiscard: () => void;
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

    // Overlay / scoring
    prepareRoundEndOverlay: () => void;
    commitRoundScoresAndProceed: () => void;
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
    gameMode: 'online',
    timerEnabled: true,
    awaitingEndOrLayDown: false,
    firstFinisherId: undefined,
    winnerCardsSnapshot: undefined,
    roundOverlay: undefined,

    // Démarrer le jeu depuis le lobby
    startGame: (payload: { players: LobbyPlayerData[]; mode: GameMode; timerEnabled: boolean; myPlayerId?: string }) => {
        const { players: lobbyPlayers, mode, timerEnabled, myPlayerId } = payload;

        const gamePlayers: GamePlayer[] = lobbyPlayers.map((p, index) => ({
            id: p.id,
            username: p.username,
            avatarUrl: p.avatar, // on stocke l'émoji côté url pour simplifier
            currentBadgeId: p.badge?.id ?? 'badge_1',
            isAI: p.isAI,
            isReady: true,
            status: 0 as any, // sera ignoré dans l'UI actuelle
            position: index,
            score: 0,
            hand: [],
            hasFinishedRound: false,
        }));

        const resolvedMyPlayerId = myPlayerId ?? lobbyPlayers[0]?.id ?? '';

        set({ gameMode: mode, timerEnabled });
        get().initializeGame(gamePlayers, resolvedMyPlayerId);
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
            awaitingEndOrLayDown: false,
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

        // Si le premier joueur est une IA, lancer automatiquement son tour
        const firstPlayer = updatedPlayers[0];
        if (firstPlayer?.isAI) {
            setTimeout(() => {
                get().executeAITurn(firstPlayer.id);
            }, 1500);
        }
    },

    // Piocher du deck
    drawFromDeck: () => {
        const { deck, currentPlayerId, players, awaitingEndOrLayDown } = get();

        if (deck.length === 0) return;
        if (get().hasDrawnThisTurn) return;
        if (awaitingEndOrLayDown) return; // on ne peut plus piocher après défausse

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
        const { discardPile, currentPlayerId, players, awaitingEndOrLayDown } = get();

        if (discardPile.length === 0) return;
        if (get().hasDrawnThisTurn) return;
        if (awaitingEndOrLayDown) return;

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

    // Défausser une carte (puis laisser le choix: terminer le tour ou poser)
    discardCard: (cardId: string) => {
        const { currentPlayerId, players, discardPile, awaitingEndOrLayDown } = get();

        if (!get().hasDrawnThisTurn) return;
        if (awaitingEndOrLayDown) return; // déjà défaussé

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

        set({
            discardPile: [...discardPile, cardToDiscard],
            players: updatedPlayers,
            awaitingEndOrLayDown: true,
            hasDrawnThisTurn: false,
            lastActionTime: new Date(),
        });
    },

    // Confirmer la fin du tour après avoir défaussé (option 1)
    endTurnAfterDiscard: () => {
        const { players, currentPlayerId } = get();
        const currentPlayerIndex = players.findIndex((p) => p.id === currentPlayerId);
        if (currentPlayerIndex === -1) return;
        const nextPlayerIndex = (currentPlayerIndex + 1) % players.length;
        const nextPlayerId = players[nextPlayerIndex].id;

        set({
            currentPlayerId: nextPlayerId,
            isMyTurn: nextPlayerId === get().myPlayerId,
            awaitingEndOrLayDown: false,
        });

        // Réinitialiser le timer
        get().startTimer();

        // Si le prochain joueur est une IA, exécuter son tour
        const nextPlayer = players[nextPlayerIndex];
        if (nextPlayer.isAI) {
            setTimeout(() => {
                get().executeAITurn(nextPlayerId);
            }, 1500);
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

    // Terminer la manche (poser les cartes)
    finishRound: (combinations: Combination[]) => {
        const { currentPlayerId, players, roundNumber, firstFinisherId } = get();

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

        // Déterminer si c'est le premier joueur à poser
        const isFirstFinisher = !firstFinisherId;
        // Si c'est le premier joueur à poser toutes ses cartes, mémoriser
        if (isFirstFinisher) {
            set({
                firstFinisherId: currentPlayerId,
                // snapshot de la main avant vidage
                winnerCardsSnapshot: [...currentPlayer.hand],
            });
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
            awaitingEndOrLayDown: false,
        });

        // Nouveau comportement : la manche se termine dès que quelqu'un pose (premier finisher)
        if (isFirstFinisher) {
            // Déclenche immédiatement l'overlay de fin de manche
            get().prepareRoundEndOverlay();
            return;
        }

        // Si on arrivait ici (second finisher), c'est que l'overlay n'était pas déclenché; par sécurité on le déclenche aussi
        get().prepareRoundEndOverlay();
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
        const {
            timerRemaining,
            hasDrawnThisTurn,
            currentPlayerId,
            players,
            discardPile,
            awaitingEndOrLayDown,
            deck,
        } = get();

        if (timerRemaining <= 0) {
            // Temps écoulé → jouer automatiquement et passer le tour
            const currentPlayer = players.find((p) => p.id === currentPlayerId);
            if (!currentPlayer) return;

            // Si déjà en attente de « Terminer ou Poser », terminer directement
            if (awaitingEndOrLayDown) {
                get().endTurnAfterDiscard();
                return;
            }

            const performAutoDiscardAndEnd = () => {
                const freshPlayer = get().players.find((p) => p.id === get().currentPlayerId);
                if (!freshPlayer || freshPlayer.hand.length === 0) {
                    // Rien à défausser, terminer quand même pour éviter le blocage
                    get().endTurnAfterDiscard();
                    return;
                }
                const randIndex = Math.floor(Math.random() * freshPlayer.hand.length);
                const cardId = freshPlayer.hand[randIndex].id;
                get().discardCard(cardId);
                // Laisser un léger délai pour l'animation puis terminer
                setTimeout(() => get().endTurnAfterDiscard(), 400);
            };

            // Si le joueur n'a pas encore pioché, piocher d'abord
            if (!hasDrawnThisTurn) {
                // Choix aléatoire entre deck et défausse, en tenant compte de la disponibilité
                const canDrawDiscard = discardPile.length > 0;
                const canDrawDeck = deck.length > 0;

                if (canDrawDeck && (!canDrawDiscard || Math.random() < 0.5)) {
                    get().drawFromDeck();
                } else if (canDrawDiscard) {
                    get().drawFromDiscard();
                } else if (canDrawDeck) {
                    get().drawFromDeck();
                }

                // Après la pioche, défausser puis terminer
                setTimeout(performAutoDiscardAndEnd, 300);
                return;
            }

            // Sinon, déjà pioché → défausser et terminer
            performAutoDiscardAndEnd();
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
            // Terminer automatiquement le tour de l'IA après la défausse
            setTimeout(() => {
                get().endTurnAfterDiscard();
            }, 800);
        } else if (decision.action === 'finish_round' && decision.combinations) {
            get().finishRound(decision.combinations);
        }
    },

    // Préparer l'overlay de fin de manche (calcul scores sans appliquer, stop timer)
    prepareRoundEndOverlay: () => {
        const { players, roundNumber, myPlayerId, firstFinisherId, winnerCardsSnapshot, roundOverlay } = get();

        // Garde: si l'overlay est déjà visible, ne pas le relancer
        if (roundOverlay && (roundOverlay as any).visible) {
            get().stopTimer();
            return;
        }
        const roundScores = calculateRoundScores(players, roundNumber);

        // Déterminer le gagnant comme le premier poseur, ou fallback au plus bas score de la manche (0 si plusieurs)
        const winnerId = firstFinisherId || (() => {
            let lowId = players[0].id;
            let low = roundScores[lowId] || 0;
            for (const p of players) {
                const sc = roundScores[p.id] || 0;
                if (sc < low) { low = sc; lowId = p.id; }
            }
            return lowId;
        })();

        const me = players.find(p => p.id === myPlayerId);
        const myPoints = roundScores[myPlayerId] || 0;
        const myScoreBefore = me?.score || 0;
        const myScoreAfter = myScoreBefore + myPoints;

        set({
            roundOverlay: {
                visible: true,
                winnerId,
                winnerCards: winnerCardsSnapshot || [],
                isMeWinner: winnerId === myPlayerId,
                myPoints,
                myScoreBefore,
                myScoreAfter,
            },
        });

        // Stopper le timer pendant l'overlay
        get().stopTimer();
    },

    // Appliquer les scores puis enchaîner
    commitRoundScoresAndProceed: () => {
        const { players, roundNumber } = get();
        const roundScores = calculateRoundScores(players, roundNumber);

        const updatedPlayers = players.map((player) => ({
            ...player,
            score: player.score + (roundScores[player.id] || 0),
        }));

        // Nettoyage overlay + marqueurs
        set({
            players: updatedPlayers,
            roundOverlay: undefined,
            firstFinisherId: undefined,
            winnerCardsSnapshot: undefined,
        });

        // Enchaîner
        if (roundNumber === GAME_RULES.TOTAL_ROUNDS) {
            get().endGame();
        } else {
            setTimeout(() => {
                get().startRound(roundNumber + 1);
            }, 800);
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