import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';
import { Card } from './Card';
import { Button } from '@/components/ui/button';
import { Card as CardType, Combination, CombinationType, CardSuit } from '@/types/game.types';
import { cn } from '@/lib/utils';

export function GameBoard() {
  const {
    roundNumber,
    currentPlayerId,
    deck,
    discardPile,
    players,
    wildCard,
    myPlayerId,
    isMyTurn,
    hasDrawnThisTurn,
    timerRemaining,
    drawFromDeck,
    drawFromDiscard,
    discardCard,
    finishRound,
    passTurn,
    decrementTimer,
    getMyHand,
  } = useGameStore();

  const [selectedCards, setSelectedCards] = useState<Set<string>>(new Set());
  const [showCombinationModal, setShowCombinationModal] = useState(false);

  const myHand = getMyHand();
  const currentPlayer = players.find((p) => p.id === currentPlayerId);
  const topDiscardCard = discardPile[discardPile.length - 1];

  // Timer countdown
  useEffect(() => {
    if (!isMyTurn) return;

    const interval = setInterval(() => {
      decrementTimer();
    }, 1000);

    return () => clearInterval(interval);
  }, [isMyTurn, decrementTimer]);

  const handleCardClick = (cardId: string) => {
    if (!isMyTurn) return;

    const newSelected = new Set(selectedCards);
    if (newSelected.has(cardId)) {
      newSelected.delete(cardId);
    } else {
      newSelected.add(cardId);
    }
    setSelectedCards(newSelected);
  };

  const handleDiscardSelected = () => {
    if (!hasDrawnThisTurn || selectedCards.size !== 1) return;
    const cardId = Array.from(selectedCards)[0];
    discardCard(cardId);
    setSelectedCards(new Set());
  };

  const handlePassTurn = () => {
    if (!isMyTurn) return;
    passTurn();
    setSelectedCards(new Set());
  };

  const handleLayDownCards = () => {
    setShowCombinationModal(true);
  };

  const handleSubmitCombinations = () => {
    // Exemple simplifié : on essaie de former des combinaisons automatiquement
    const combinations: Combination[] = [];
    
    // Grouper par valeur (brelans)
    const cardsByValue = new Map<number, CardType[]>();
    for (const card of myHand) {
      if (!cardsByValue.has(card.value)) {
        cardsByValue.set(card.value, []);
      }
      cardsByValue.get(card.value)!.push(card);
    }

    for (const [_, cards] of cardsByValue) {
      if (cards.length >= 3) {
        combinations.push({
          type: CombinationType.SET,
          cards: cards,
        });
      }
    }

    if (combinations.length === 0) {
      alert('Aucune combinaison valide trouvée ! Vous devez avoir au moins un brelan ou une suite de 3 cartes.');
      setShowCombinationModal(false);
      return;
    }

    finishRound(combinations);
    setShowCombinationModal(false);
    setSelectedCards(new Set());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-800 to-green-900 p-8">
      {/* En-tête */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 flex items-center justify-between">
          <div className="text-white">
            <h2 className="text-2xl font-bold">Manche {roundNumber}/11</h2>
            <p className="text-sm">Joker variable: {wildCard}</p>
          </div>
          
          {isMyTurn && (
            <div className="flex items-center gap-4">
              <div className="text-white text-xl font-mono">
                ⏱️ {timerRemaining}s
              </div>
              <div className={`px-4 py-2 rounded-lg ${
                timerRemaining > 10 ? 'bg-green-500' : 
                timerRemaining > 5 ? 'bg-orange-500' : 'bg-red-500'
              } text-white font-bold`}>
                Votre tour
              </div>
            </div>
          )}
          
          {!isMyTurn && currentPlayer && (
            <div className="text-white text-lg">
              Tour de: {currentPlayer.username}
            </div>
          )}
        </div>
      </div>

      {/* Zone de jeu centrale */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-center gap-16">
          {/* Pioche */}
          <div className="flex flex-col items-center gap-4">
            <p className="text-white font-semibold">Pioche ({deck.length})</p>
            <motion.div
              whileHover={isMyTurn && !hasDrawnThisTurn ? { scale: 1.05 } : {}}
              onClick={() => isMyTurn && !hasDrawnThisTurn && drawFromDeck()}
              className={cn(
                'cursor-pointer',
                isMyTurn && !hasDrawnThisTurn && 'ring-4 ring-yellow-400'
              )}
            >
              <Card
                card={{
                  id: 'deck',
                  suit: CardSuit.STARS,
                  value: 0,
                  isJoker: false,
                }}
                faceUp={false}
              />
            </motion.div>
          </div>

          {/* Défausse */}
          <div className="flex flex-col items-center gap-4">
            <p className="text-white font-semibold">Défausse</p>
            {topDiscardCard ? (
              <motion.div
                whileHover={isMyTurn && !hasDrawnThisTurn ? { scale: 1.05 } : {}}
                onClick={() => isMyTurn && !hasDrawnThisTurn && drawFromDiscard()}
                className={cn(
                  'cursor-pointer',
                  isMyTurn && !hasDrawnThisTurn && 'ring-4 ring-yellow-400'
                )}
              >
                <Card card={topDiscardCard} faceUp={true} />
              </motion.div>
            ) : (
              <div className="w-24 h-36 border-2 border-dashed border-white/30 rounded-lg flex items-center justify-center text-white/50">
                Vide
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tableau des scores */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-4">
          <h3 className="text-white font-bold mb-4">Scores</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {players.map((player) => (
              <div
                key={player.id}
                className={cn(
                  'p-3 rounded-lg',
                  player.id === currentPlayerId
                    ? 'bg-yellow-500/30 ring-2 ring-yellow-400'
                    : 'bg-white/5'
                )}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{player.isAI ? '🤖' : '👤'}</span>
                  <span className="text-white font-semibold">{player.username}</span>
                </div>
                <div className="text-white text-xl font-bold">
                  Score: {player.score}
                </div>
                <div className="text-white/70 text-sm">
                  Cartes: {player.hand.length}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main du joueur */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-bold text-xl">Votre main</h3>
            <div className="flex gap-2">
              {isMyTurn && (
                <>
                  {/* Bouton Défausser */}
                  <Button
                    onClick={handleDiscardSelected}
                    disabled={!hasDrawnThisTurn || selectedCards.size !== 1}
                    variant="destructive"
                    className="bg-red-600 hover:bg-red-700"
                  >
                    🗑️ Défausser ({selectedCards.size})
                  </Button>

                  {/* Bouton Passer la manche */}
                  <Button
                    onClick={handlePassTurn}
                    disabled={!hasDrawnThisTurn}
                    variant="secondary"
                    className="bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    ⏭️ Passer la manche
                  </Button>

                  {/* Bouton Poser les cartes */}
                  <Button
                    onClick={handleLayDownCards}
                    disabled={!hasDrawnThisTurn}
                    variant="default"
                    className="bg-green-600 hover:bg-green-700"
                  >
                    🃏 Poser les cartes
                  </Button>
                </>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-4 justify-center">
            <AnimatePresence>
              {myHand.map((card) => (
                <Card
                  key={card.id}
                  card={card}
                  faceUp={true}
                  onClick={() => handleCardClick(card.id)}
                  selected={selectedCards.has(card.id)}
                  animate={true}
                />
              ))}
            </AnimatePresence>
          </div>

          {myHand.length === 0 && (
            <div className="text-center text-white/50 py-8">
              Aucune carte dans votre main
            </div>
          )}
        </div>
      </div>

      {/* Modal de combinaisons */}
      {showCombinationModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full">
            <h2 className="text-2xl font-bold mb-4">Poser les cartes</h2>
            <p className="mb-4">
              Voulez-vous vraiment poser vos cartes et terminer la manche ? Le système va essayer de former
              automatiquement des combinaisons (brelans et suites) avec vos cartes.
            </p>
            <p className="mb-6 text-sm text-gray-600">
              Note : Vous devez avoir au moins une combinaison valide (3 cartes ou plus de même valeur, ou une suite de 3 cartes ou plus).
            </p>
            <div className="flex gap-4 justify-end">
              <Button
                onClick={() => setShowCombinationModal(false)}
                variant="outline"
              >
                Annuler
              </Button>
              <Button onClick={handleSubmitCombinations} className="bg-green-600 hover:bg-green-700">
                Confirmer
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}