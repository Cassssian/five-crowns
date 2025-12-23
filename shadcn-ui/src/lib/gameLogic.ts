import {
  Card,
  CardSuit,
  CardValue,
  Combination,
  CombinationType,
  GamePlayer,
} from '@/types/game.types';
import {
  SUITS,
  CARD_VALUES,
  GAME_RULES,
  CARD_POINTS,
  CARDS_PER_ROUND,
  WILD_CARD_PER_ROUND,
} from '@/constants/gameRules';

// Génère un ID unique pour une carte
function generateCardId(suit: CardSuit, value: CardValue, deckIndex: number): string {
  return `${suit}_${value}_${deckIndex}`;
}

// Crée un deck complet de 116 cartes
export function createDeck(): Card[] {
  const deck: Card[] = [];
  let cardIndex = 0;

  // Créer 2 jeux de 55 cartes chacun (5 couleurs × 11 valeurs)
  for (let deckNum = 0; deckNum < 2; deckNum++) {
    for (const suit of SUITS) {
      for (const value of CARD_VALUES) {
        deck.push({
          id: generateCardId(suit, value, cardIndex++),
          suit,
          value,
          isJoker: false,
        });
      }
    }
  }

  // Ajouter 6 jokers permanents
  for (let i = 0; i < 6; i++) {
    deck.push({
      id: `joker_${i}`,
      suit: CardSuit.STARS, // Couleur arbitraire pour les jokers
      value: CardValue.JOKER,
      isJoker: true,
    });
  }

  return deck;
}

// Mélange un deck de cartes (algorithme Fisher-Yates)
export function shuffleDeck(deck: Card[]): Card[] {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Distribue les cartes pour une manche donnée
export function dealCards(
  deck: Card[],
  numPlayers: number,
  round: number
): {
  playerHands: Card[][];
  remainingDeck: Card[];
  discardPile: Card[];
} {
  const cardsPerPlayer = CARDS_PER_ROUND[round];
  const totalCardsNeeded = cardsPerPlayer * numPlayers + 1; // +1 pour la défausse

  if (deck.length < totalCardsNeeded) {
    throw new Error('Pas assez de cartes dans le deck');
  }

  const playerHands: Card[][] = [];
  let currentIndex = 0;

  // Distribuer les cartes à chaque joueur
  for (let i = 0; i < numPlayers; i++) {
    const hand = deck.slice(currentIndex, currentIndex + cardsPerPlayer);
    playerHands.push(hand);
    currentIndex += cardsPerPlayer;
  }

  // Carte du dessus pour la défausse
  const discardPile = [deck[currentIndex]];
  currentIndex++;

  // Cartes restantes dans le deck
  const remainingDeck = deck.slice(currentIndex);

  return { playerHands, remainingDeck, discardPile };
}

// Vérifie si une carte est un joker (permanent ou variable selon la manche)
export function isWildCard(card: Card, round: number): boolean {
  if (card.isJoker) return true;
  const wildCardValue = WILD_CARD_PER_ROUND[round];
  return card.value === wildCardValue;
}

// Valide une suite (run) : 3+ cartes consécutives de la même couleur
export function validateRun(cards: Card[], round: number): boolean {
  if (cards.length < GAME_RULES.MIN_COMBINATION_SIZE) return false;

  // Séparer les jokers et les cartes normales
  const wildcards = cards.filter((c) => isWildCard(c, round));
  const normalCards = cards.filter((c) => !isWildCard(c, round));

  // Vérifier que toutes les cartes normales sont de la même couleur
  if (normalCards.length > 0) {
    const suit = normalCards[0].suit;
    if (!normalCards.every((c) => c.suit === suit)) return false;
  }

  // Trier les cartes normales par valeur
  const sortedValues = normalCards.map((c) => c.value).sort((a, b) => a - b);

  // Vérifier la séquence avec les jokers
  let expectedValue = sortedValues[0];
  let wildcardsUsed = 0;

  for (let i = 0; i < sortedValues.length; i++) {
    const currentValue = sortedValues[i];

    // Calculer le nombre de jokers nécessaires pour combler le gap
    const gap = currentValue - expectedValue;
    if (gap > wildcards.length - wildcardsUsed) return false;

    wildcardsUsed += gap;
    expectedValue = currentValue + 1;
  }

  // Vérifier qu'on a utilisé tous les jokers
  if (wildcardsUsed > wildcards.length) return false;

  return true;
}

// Valide un brelan (set) : 3+ cartes de même valeur
export function validateSet(cards: Card[], round: number): boolean {
  if (cards.length < GAME_RULES.MIN_COMBINATION_SIZE) return false;

  // Séparer les jokers et les cartes normales
  const wildcards = cards.filter((c) => isWildCard(c, round));
  const normalCards = cards.filter((c) => !isWildCard(c, round));

  if (normalCards.length === 0) return false; // Au moins une carte normale

  // Vérifier que toutes les cartes normales ont la même valeur
  const value = normalCards[0].value;
  return normalCards.every((c) => c.value === value);
}

// Valide une combinaison (suite ou brelan)
export function validateCombination(combination: Combination, round: number): boolean {
  if (combination.type === CombinationType.RUN) {
    return validateRun(combination.cards, round);
  } else if (combination.type === CombinationType.SET) {
    return validateSet(combination.cards, round);
  }
  return false;
}

// Valide toutes les combinaisons d'un joueur
export function validateAllCombinations(
  combinations: Combination[],
  hand: Card[],
  round: number
): { valid: boolean; error?: string } {
  // Vérifier que toutes les cartes de la main sont utilisées
  const usedCards = new Set<string>();
  for (const combination of combinations) {
    for (const card of combination.cards) {
      if (usedCards.has(card.id)) {
        return { valid: false, error: 'Carte utilisée plusieurs fois' };
      }
      usedCards.add(card.id);
    }
  }

  // Vérifier que toutes les cartes de la main sont dans les combinaisons
  for (const card of hand) {
    if (!usedCards.has(card.id)) {
      return { valid: false, error: 'Toutes les cartes doivent être utilisées' };
    }
  }

  // Valider chaque combinaison
  for (const combination of combinations) {
    if (!validateCombination(combination, round)) {
      return {
        valid: false,
        error: `Combinaison invalide: ${combination.type}`,
      };
    }
  }

  return { valid: true };
}

// Calcule les points d'une carte
export function getCardPoints(card: Card, round: number): number {
  if (card.isJoker) return GAME_RULES.JOKER_POINTS;
  if (card.value === WILD_CARD_PER_ROUND[round]) return GAME_RULES.WILD_CARD_POINTS;
  return CARD_POINTS[card.value];
}

// Calcule le score d'une main (cartes non posées)
export function calculateHandScore(hand: Card[], round: number): number {
  return hand.reduce((total, card) => total + getCardPoints(card, round), 0);
}

// Calcule les scores de tous les joueurs à la fin d'une manche
export function calculateRoundScores(
  players: GamePlayer[],
  round: number
): Record<string, number> {
  const scores: Record<string, number> = {};

  for (const player of players) {
    // Si le joueur a terminé la manche, son score est 0
    if (player.hasFinishedRound) {
      scores[player.id] = 0;
    } else {
      // Sinon, calculer les points des cartes restantes
      scores[player.id] = calculateHandScore(player.hand, round);
    }
  }

  return scores;
}

// Détermine le gagnant d'une partie (score le plus bas)
export function determineWinner(players: GamePlayer[]): string {
  let winnerId = players[0].id;
  let lowestScore = players[0].score;

  for (const player of players) {
    if (player.score < lowestScore) {
      lowestScore = player.score;
      winnerId = player.id;
    }
  }

  return winnerId;
}

// Génère une action aléatoire pour l'IA ou le timeout
export function generateRandomAction(
  hand: Card[],
  discardPile: Card[],
  hasDrawn: boolean
): {
  action: 'draw_from_deck' | 'draw_from_discard' | 'discard';
  cardId?: string;
} {
  if (!hasDrawn) {
    // Décider aléatoirement de piocher du deck ou de la défausse
    const drawFromDiscard = Math.random() < 0.3 && discardPile.length > 0;
    return {
      action: drawFromDiscard ? 'draw_from_discard' : 'draw_from_deck',
    };
  } else {
    // Défausser une carte aléatoire (priorité aux cartes hautes)
    const sortedHand = [...hand].sort(
      (a, b) => CARD_POINTS[b.value] - CARD_POINTS[a.value]
    );
    const cardToDiscard = sortedHand[0];
    return {
      action: 'discard',
      cardId: cardToDiscard.id,
    };
  }
}

// Logique d'IA simple : former des combinaisons et défausser les cartes hautes
export function aiMakeDecision(
  hand: Card[],
  discardPile: Card[],
  round: number,
  hasDrawn: boolean
): {
  action: 'draw_from_deck' | 'draw_from_discard' | 'discard' | 'finish_round';
  cardId?: string;
  combinations?: Combination[];
} {
  if (!hasDrawn) {
    // Décider de piocher
    const topDiscard = discardPile[discardPile.length - 1];
    
    // Piocher de la défausse si la carte est utile
    if (topDiscard && !isWildCard(topDiscard, round)) {
      const sameValueCards = hand.filter((c) => c.value === topDiscard.value);
      const sameSuitCards = hand.filter((c) => c.suit === topDiscard.suit);
      
      if (sameValueCards.length >= 2 || sameSuitCards.length >= 2) {
        return { action: 'draw_from_discard' };
      }
    }
    
    return { action: 'draw_from_deck' };
  }

  // Vérifier si l'IA peut terminer la manche
  const combinations = tryFormCombinations(hand, round);
  if (combinations.length > 0) {
    const allCardsUsed = combinations.reduce(
      (total, c) => total + c.cards.length,
      0
    );
    if (allCardsUsed === hand.length) {
      return { action: 'finish_round', combinations };
    }
  }

  // Défausser la carte la plus haute qui n'est pas un joker
  const nonWildcards = hand.filter((c) => !isWildCard(c, round));
  const sortedNonWildcards = nonWildcards.sort(
    (a, b) => getCardPoints(b, round) - getCardPoints(a, round)
  );

  const cardToDiscard = sortedNonWildcards[0] || hand[0];

  return {
    action: 'discard',
    cardId: cardToDiscard.id,
  };
}

// Essaie de former des combinaisons automatiquement (utilisé par l'IA et l'UI)
export function tryFormCombinations(hand: Card[], round: number): Combination[] {
  const combinations: Combination[] = [];
  const usedCards = new Set<string>();

  // Extraire la liste des jokers disponibles (permanents et variables selon la manche)
  const wildcardsPool: Card[] = hand.filter((c) => isWildCard(c, round));
  const takeWildcards = (count: number): Card[] => {
    const taken = wildcardsPool.filter((c) => !usedCards.has(c.id)).slice(0, Math.max(0, count));
    taken.forEach((c) => usedCards.add(c.id));
    return taken;
  };

  // 1) Essayer de former des brelans (SET) en complétant avec des jokers si besoin
  const cardsByValue = new Map<CardValue, Card[]>();
  for (const card of hand) {
    if (!usedCards.has(card.id)) {
      const value = card.value;
      if (!cardsByValue.has(value)) {
        cardsByValue.set(value, []);
      }
      cardsByValue.get(value)!.push(card);
    }
  }

  for (const [_, cards] of cardsByValue) {
    const normals = cards.filter((c) => !isWildCard(c, round));
    const alreadyUsedNormals = normals.filter((c) => usedCards.has(c.id));
    if (alreadyUsedNormals.length > 0) continue;

    const need = Math.max(0, GAME_RULES.MIN_COMBINATION_SIZE - normals.length);
    const availableWilds = wildcardsPool.filter((w) => !usedCards.has(w.id)).length;
    if (normals.length >= 1 && normals.length + availableWilds >= GAME_RULES.MIN_COMBINATION_SIZE) {
      const used = [...normals];
      used.forEach((c) => usedCards.add(c.id));
      const jokers = takeWildcards(need);
      const comboCards = [...used, ...jokers];
      combinations.push({ type: CombinationType.SET, cards: comboCards });
    }
  }

  // 2) Essayer de former des suites (RUN) en complétant avec des jokers aux extrémités
  //    ET en comblant les trous internes avec des jokers (ex.: 8,10,V + Joker ⇒ Joker=9)
  const cardsBySuit = new Map<CardSuit, Card[]>();
  for (const card of hand) {
    if (!usedCards.has(card.id) && !isWildCard(card, round)) {
      const suit = card.suit;
      if (!cardsBySuit.has(suit)) {
        cardsBySuit.set(suit, []);
      }
      cardsBySuit.get(suit)!.push(card);
    }
  }

  for (const [_, cards] of cardsBySuit) {
    const sorted = cards.sort((a, b) => a.value - b.value);
    let current: Card[] = [];

    const finalizeCurrent = () => {
      if (current.length === 0) return;
      const availWilds = wildcardsPool.filter((w) => !usedCards.has(w.id)).length;
      if (current.length < GAME_RULES.MIN_COMBINATION_SIZE && current.length + availWilds >= GAME_RULES.MIN_COMBINATION_SIZE) {
        const need = GAME_RULES.MIN_COMBINATION_SIZE - current.length;
        const jokers = takeWildcards(need);
        const combo = [...current, ...jokers];
        combinations.push({ type: CombinationType.RUN, cards: combo });
        current.forEach((c) => usedCards.add(c.id));
      } else if (current.length >= GAME_RULES.MIN_COMBINATION_SIZE) {
        combinations.push({ type: CombinationType.RUN, cards: [...current] });
        current.forEach((c) => usedCards.add(c.id));
      }
      current = [];
    };

    for (let i = 0; i < sorted.length; i++) {
      if (current.length === 0) {
        current.push(sorted[i]);
        continue;
      }
      const last = current[current.length - 1];
      const gap = sorted[i].value - last.value - 1; // 0 si consécutif, 1 si un trou, etc.
      if (gap === 0) {
        current.push(sorted[i]);
        continue;
      }

      const availWilds = wildcardsPool.filter((w) => !usedCards.has(w.id)).length;
      if (gap > 0 && gap <= availWilds) {
        // Insérer autant de jokers que nécessaire pour combler le gap interne
        const jokers = takeWildcards(gap);
        current.push(...jokers);
        current.push(sorted[i]);
        continue;
      }

      // Gap non comblable → finaliser la séquence en cours puis repartir
      finalizeCurrent();
      current.push(sorted[i]);
    }

    // Fin de boucle: finaliser la dernière séquence (avec padding si possible)
    finalizeCurrent();
  }

  return combinations;
}