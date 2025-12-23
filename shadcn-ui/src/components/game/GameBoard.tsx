import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';
import { Card } from './Card';
import { Button } from '@/components/ui/button';
import { Card as CardType, Combination, CombinationType, CardSuit } from '@/types/game.types';
import { tryFormCombinations, getCardPoints } from '@/lib/gameLogic';
import { cn } from '@/lib/utils';
import { BADGES } from '@/constants/gameRules';
import PlayerBadge from './PlayerBadge';
import React from 'react';

function useSeatPositions(count: number, myIndex: number) {
  return useMemo(() => {
    const positions: Array<{ x: number; y: number; rotation: number; isMe: boolean }> = [];
    
    const layouts: Record<number, Array<{ x: number; y: number; rotation: number }>> = {
      2: [
        { x: 50, y: 85, rotation: 0 },
        { x: 50, y: 12, rotation: 180 },
      ],
      3: [
        { x: 50, y: 85, rotation: 0 },
        { x: 15, y: 30, rotation: 90 },
        { x: 85, y: 30, rotation: -90 },
      ],
      4: [
        { x: 50, y: 85, rotation: 0 },
        { x: 15, y: 50, rotation: 90 },
        // L'adversaire du haut un peu plus haut
        { x: 50, y: 12, rotation: 180 },
        { x: 85, y: 50, rotation: -90 },
      ],
      5: [
        { x: 50, y: 85, rotation: 0 },
        { x: 20, y: 75, rotation: 70 },
        { x: 10, y: 30, rotation: 110 },
        { x: 90, y: 30, rotation: -110 },
        { x: 75, y: 75, rotation: -70 },
      ],
      6: [
        { x: 50, y: 85, rotation: 0 },
        { x: 20, y: 75, rotation: 60 },
        { x: 10, y: 30, rotation: 100 },
        { x: 50, y: 12, rotation: 180 },
        { x: 90, y: 30, rotation: -100 },
        { x: 75, y: 75, rotation: -60 },
      ],
      7: [
        { x: 50, y: 85, rotation: 0 },
        { x: 20, y: 70, rotation: 50 },
        { x: 8, y: 50, rotation: 80 },
        { x: 8, y: 25, rotation: 110 },
        { x: 50, y: 12, rotation: 180 },
        { x: 92, y: 25, rotation: -110 },
        { x: 92, y: 50, rotation: -80 },
      ],
      8: [
        { x: 50, y: 85, rotation: 0 },
        { x: 22, y: 72, rotation: 45 },
        { x: 8, y: 50, rotation: 90 },
        { x: 22, y: 28, rotation: 135 },
        { x: 50, y: 15, rotation: 180 },
        { x: 78, y: 28, rotation: -135 },
        { x: 92, y: 50, rotation: -90 },
        { x: 78, y: 72, rotation: -45 },
      ],
    };

    const layout = layouts[count] || layouts[4];
    
    for (let i = 0; i < count; i++) {
      const actualIndex = (i + myIndex) % count;
      positions[actualIndex] = { ...layout[i], isMe: i === 0 };
    }
    
    return positions;
  }, [count, myIndex]);
}

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
    awaitingEndOrLayDown,
    endTurnAfterDiscard,
    roundOverlay,
    commitRoundScoresAndProceed,
  } = useGameStore();

  const [selectedCards, setSelectedCards] = useState<Set<string>>(new Set());
  const [showCombinationModal, setShowCombinationModal] = useState(false);

  const myHand = getMyHand();
  const currentPlayer = players.find((p) => p.id === currentPlayerId);
  const myIndex = players.findIndex(p => p.id === myPlayerId);
  const seats = useSeatPositions(players.length, myIndex);
  const topDiscardCard = discardPile[discardPile.length - 1];

  useEffect(() => {
    if (!isMyTurn) return;
    const interval = setInterval(() => decrementTimer(), 1000);
    return () => clearInterval(interval);
  }, [isMyTurn, decrementTimer]);

  const handleCardClick = (cardId: string) => {
    if (!isMyTurn) return;
    const newSelected = new Set(selectedCards);
    if (newSelected.has(cardId)) newSelected.delete(cardId);
    else newSelected.add(cardId);
    setSelectedCards(newSelected);
  };

  const handleDiscardSelected = () => {
    if (!hasDrawnThisTurn || selectedCards.size !== 1) return;
    const cardId = Array.from(selectedCards)[0];
    discardCard(cardId);
    setSelectedCards(new Set());
  };

  const handleSubmitCombinations = () => {
    const combinations: Combination[] = tryFormCombinations(myHand, roundNumber);
    if (combinations.length === 0) {
      alert('Aucune combinaison valide trouvée !');
      setShowCombinationModal(false);
      return;
    }

    const cardsUsed = combinations.reduce((n, c) => n + c.cards.length, 0);
    if (cardsUsed !== myHand.length) {
      alert("Vous ne pouvez terminer la manche que si toutes vos cartes sont utilisées dans des combinaisons.");
      setShowCombinationModal(false);
      return;
    }

    finishRound(combinations);
    setShowCombinationModal(false);
    setSelectedCards(new Set());
  };

  // --- Overlay fin de manche ---
  const [overlayPhase, setOverlayPhase] = useState<'winner-show' | 'points-fan' | 'score-show' | null>(null);
  const [rollingPoints, setRollingPoints] = useState(0);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [removedIds, setRemovedIds] = useState<Set<string>>(new Set());
  const [scoreRoll, setScoreRoll] = useState<number | null>(null);

  // Utiliser une ref pour stabiliser l'appel à commitRoundScoresAndProceed dans les timeouts/intervals
  const commitRef = React.useRef(commitRoundScoresAndProceed);
  useEffect(() => {
    commitRef.current = commitRoundScoresAndProceed;
  }, [commitRoundScoresAndProceed]);

  useEffect(() => {
    if (roundOverlay?.visible) {
      setOverlayPhase('winner-show');
      setRollingPoints(0);
      setRemovingId(null);
      setRemovedIds(new Set());
      setScoreRoll(null);

      // Phase 1: afficher gagnant + rayons pendant 5s
      const t1 = setTimeout(() => {
        if (roundOverlay.isMeWinner) {
          // Gagnant = moi: aller directement au texte score +0
          setOverlayPhase('score-show');
          // Attendre un court délai puis continuer
          const t2 = setTimeout(() => {
            commitRef.current();
          }, 2000);
          return () => clearTimeout(t2);
        } else {
          // Perdant = moi: montrer mes cartes et compter les points
          setOverlayPhase('points-fan');
        }
      }, 5000);
      return () => clearTimeout(t1);
    } else {
      setOverlayPhase(null);
      setRollingPoints(0);
      setRemovingId(null);
      setRemovedIds(new Set());
      setScoreRoll(null);
    }
  }, [roundOverlay?.visible]);

  // Incrément type roulette des points quand on est perdant
  useEffect(() => {
    if (!roundOverlay?.visible) return;
    if (!roundOverlay.isMeWinner && overlayPhase === 'points-fan') {
      const target = roundOverlay.myPoints || 0;
      let current = 0;
      const step = Math.max(1, Math.ceil(target / 40));
      const iv = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(iv);
          // Afficher ensuite le score cumulé puis continuer
          setOverlayPhase('score-show');
          setTimeout(() => commitRef.current(), 1800);
        }
        setRollingPoints(current);
      }, 40);
      return () => clearInterval(iv);
    }
  }, [overlayPhase, roundOverlay?.visible, roundOverlay?.isMeWinner, roundOverlay?.myPoints]);

  // Séquence : faire partir les cartes au centre une par une, incrémenter le compteur comme une roulette
  useEffect(() => {
    if (!roundOverlay?.visible) return;
    if (!roundOverlay.isMeWinner && overlayPhase === 'points-fan') {
      // Ordre des cartes: de la plus forte à la plus faible (visuel plus satisfaisant)
      const handSorted = [...myHand].sort((a, b) => getCardPoints(b, roundNumber) - getCardPoints(a, roundNumber));
      const perCardPoints = handSorted.map((c) => ({ id: c.id, pts: getCardPoints(c, roundNumber), card: c }));
      let idx = 0;
      let cumulative = 0;
      let stop = false;

      const launch = () => {
        if (stop) return;
        if (idx >= perCardPoints.length) return;
        const { id, pts } = perCardPoints[idx];
        setRemovingId(id);
        // démarrer l'animation de départ de la carte
        setTimeout(() => {
          setRemovedIds((prev) => new Set(prev).add(id));
          setRemovingId(null);
        }, 350);

        // incrémenter le compteur jusqu'au prochain palier
        const target = cumulative + pts;
        const step = 1;
        const iv = setInterval(() => {
          setRollingPoints((prev) => {
            const next = Math.min(target, prev + step);
            if (next >= target) {
              clearInterval(iv);
              cumulative = target;
              idx += 1;
              setTimeout(launch, 180);
            }
            return next;
          });
        }, 18);
      };

      // Lancer la première carte après un léger délai
      const t = setTimeout(launch, 250);
      return () => { stop = true; clearTimeout(t); };
    }
  }, [overlayPhase, roundOverlay?.visible, roundOverlay?.isMeWinner, myHand, roundNumber]);

  // Roulette sur le score affiché pendant la phase "score-show" (perdant)
  useEffect(() => {
    if (!roundOverlay?.visible) return;
    if (overlayPhase === 'score-show' && !roundOverlay.isMeWinner) {
      const start = roundOverlay.myScoreBefore;
      const end = roundOverlay.myScoreAfter;
      setScoreRoll(start);
      const step = Math.max(1, Math.ceil((end - start) / 40));
      const iv = setInterval(() => {
        setScoreRoll((prev) => {
          const cur = (prev ?? start) + step;
          if (cur >= end) {
            clearInterval(iv);
            return end;
          }
          return cur;
        });
      }, 35);
      return () => clearInterval(iv);
    }
  }, [overlayPhase, roundOverlay?.visible, roundOverlay?.isMeWinner, roundOverlay?.myScoreBefore, roundOverlay?.myScoreAfter]);

  const Rays = ({ color = 'yellow' }: { color?: 'yellow' | 'red' }) => (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {/* Couche 1: beaucoup de rayons fins */}
      <motion.div
        className={cn(
          'w-[160vmin] h-[160vmin] rounded-full opacity-55 blur-sm',
          color === 'yellow'
            ? 'bg-[repeating-conic-gradient(from_0deg,rgba(250,204,21,0.0)_0deg,rgba(250,204,21,0.0)_6deg,rgba(250,204,21,0.9)_9deg,rgba(250,204,21,0.0)_12deg)]'
            : 'bg-[repeating-conic-gradient(from_0deg,rgba(239,68,68,0.0)_0deg,rgba(239,68,68,0.0)_6deg,rgba(239,68,68,0.9)_9deg,rgba(239,68,68,0.0)_12deg)]'
        )}
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, ease: 'linear', duration: 10 }}
        style={{
          maskImage: 'radial-gradient(circle at center, transparent 0 30%, white 36% 72%, transparent 78% 100%)',
          WebkitMaskImage: 'radial-gradient(circle at center, transparent 0 30%, white 36% 72%, transparent 78% 100%)',
        }}
      />
      {/* Couche 2: rayons plus épais et lents pour densifier */}
      <motion.div
        className={cn(
          'absolute w-[170vmin] h-[170vmin] rounded-full opacity-35 blur-md',
          color === 'yellow'
            ? 'bg-[repeating-conic-gradient(from_15deg,rgba(250,204,21,0.0)_0deg,rgba(250,204,21,0.0)_10deg,rgba(250,204,21,0.85)_14deg,rgba(250,204,21,0.0)_20deg)]'
            : 'bg-[repeating-conic-gradient(from_15deg,rgba(239,68,68,0.0)_0deg,rgba(239,68,68,0.0)_10deg,rgba(239,68,68,0.85)_14deg,rgba(239,68,68,0.0)_20deg)]'
        )}
        animate={{ rotate: -360 }}
        transition={{ repeat: Infinity, ease: 'linear', duration: 22 }}
        style={{
          maskImage: 'radial-gradient(circle at center, transparent 0 28%, white 34% 74%, transparent 80% 100%)',
          WebkitMaskImage: 'radial-gradient(circle at center, transparent 0 28%, white 34% 74%, transparent 80% 100%)',
        }}
      />
    </div>
  );

  const WinnerCards = ({ cards }: { cards: CardType[] }) => (
    <div className="flex flex-wrap gap-2 justify-center mt-4">
      {cards.map((c) => (
        <Card key={c.id} card={c} faceUp={true} animate={true} />
      ))}
    </div>
  );

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-green-800 to-green-900 overflow-hidden">
      {/* En-tête compact */}
      <div className="w-full bg-green-900/50 backdrop-blur-sm border-b border-white/10 px-4 py-2 flex-shrink-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/*<Button onClick={() => window.history.back()} variant="ghost" size="sm" className="text-white hover:bg-white/10 h-8">*/}
            {/*  ← Retour*/}
            {/*</Button>*/}
            <div className="text-white">
              <h2 className="text-base font-bold">Manche {roundNumber}/11</h2>
              <p className="text-xs text-white/70">Joker: {wildCard}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {isMyTurn ? (
              <>
                <div className={`px-3 py-1 rounded-lg font-mono text-sm ${
                  timerRemaining > 10 ? 'bg-green-600' : timerRemaining > 5 ? 'bg-orange-600' : 'bg-red-600'
                } text-white`}>
                  ⏱️ {timerRemaining}s
                </div>
                <div className="px-3 py-1 rounded-lg bg-yellow-500 text-black font-bold text-sm">
                  Votre tour
                </div>
              </>
            ) : currentPlayer && (
              <div className="text-white text-sm px-3 py-1 rounded-lg bg-white/10">
                Tour de: <span className="font-bold">{currentPlayer.username}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Zone de jeu centrale - prend tout l'espace disponible */}
      <div className="flex-1 flex items-center justify-center p-2 min-h-0 overflow-hidden">
        <div className="relative w-full h-full max-w-[1200px]">
          {/* Table centrale */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="relative">
              <div className="absolute -inset-16 rounded-full bg-green-700/30 border-4 border-green-600/20"></div>
              
              {/* Pioche et défausse */}
              <div className="relative flex items-center gap-6">
                <div className="flex flex-col items-center gap-2">
                  <motion.div
                    whileHover={isMyTurn && !hasDrawnThisTurn && !awaitingEndOrLayDown ? { scale: 1.05 } : {}}
                    onClick={() => isMyTurn && !hasDrawnThisTurn && !awaitingEndOrLayDown && drawFromDeck()}
                    className={cn('relative cursor-pointer', isMyTurn && !hasDrawnThisTurn && !awaitingEndOrLayDown && 'ring-4 ring-yellow-400 rounded-lg')}
                  >
                    <div className="relative">
                      <div className="absolute -top-1 -right-1 opacity-40">
                        <Card card={{ id: 'deck-3', suit: CardSuit.STARS, value: 0, isJoker: false }} faceUp={false} />
                      </div>
                      <div className="absolute -top-0.5 -right-0.5 opacity-70">
                        <Card card={{ id: 'deck-2', suit: CardSuit.STARS, value: 0, isJoker: false }} faceUp={false} />
                      </div>
                      <Card card={{ id: 'deck', suit: CardSuit.STARS, value: 0, isJoker: false }} faceUp={false} />
                    </div>
                  </motion.div>
                  <p className="text-white text-sm font-bold bg-black/30 px-2 py-1 rounded-full">{deck.length}</p>
                </div>

                <div className="flex flex-col items-center gap-2">
                  {topDiscardCard ? (
                    <motion.div
                      whileHover={isMyTurn && !hasDrawnThisTurn && !awaitingEndOrLayDown ? { scale: 1.05 } : {}}
                      onClick={() => isMyTurn && !hasDrawnThisTurn && !awaitingEndOrLayDown && drawFromDiscard()}
                      className={cn('cursor-pointer', isMyTurn && !hasDrawnThisTurn && !awaitingEndOrLayDown && 'ring-4 ring-yellow-400 rounded-lg')}
                    >
                      <Card card={topDiscardCard} faceUp={true} />
                    </motion.div>
                  ) : (
                    <div className="w-24 h-36 border-2 border-dashed border-white/30 rounded-lg flex items-center justify-center text-white/50 text-xs">
                      Vide
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Joueurs */}
          {players.map((player, idx) => {
            const seat = seats[idx];
            if (!seat) return null;
            const isMe = seat.isMe;
            const isActive = player.id === currentPlayerId;
            const playerBadge = BADGES.find(b => b.id === player.currentBadgeId) || BADGES[0];

            return (
              <div key={player.id} className="absolute" style={{ left: `${seat.x}%`, top: `${seat.y}%`, transform: 'translate(-50%, -50%)' }}>
                {!isMe && (
                  <div className={cn('flex flex-col items-center gap-1', isActive && 'drop-shadow-[0_0_15px_rgba(234,179,8,0.8)]')}>
                    <div className="relative h-24 mb-1">
                      {Array.from({ length: Math.min(player.hand.length, 8) }).map((_, i, arr) => {
                        const spreadAngle = 40;
                        const startAngle = -spreadAngle / 2;
                        const angleStep = arr.length > 1 ? spreadAngle / (arr.length - 1) : 0;
                        const rotation = startAngle + i * angleStep;
                        const offset = i * 8;
                        
                        return (
                          <div key={i} className="absolute left-1/2 top-0" style={{
                            transform: `translateX(calc(-50% + ${offset - (arr.length * 4)}px)) rotate(${rotation}deg)`,
                            transformOrigin: 'center bottom',
                          }}>
                            <Card card={{ id: `back-${player.id}-${i}`, suit: CardSuit.STARS, value: 0, isJoker: false }} faceUp={false} className="scale-75" />
                          </div>
                        );
                      })}
                    </div>

                    <div className={cn('px-3 py-1.5 rounded-lg backdrop-blur-md border-2', isActive ? 'bg-yellow-500/30 border-yellow-400' : 'bg-black/40 border-white/20')}>
                      <div className="flex items-center gap-1.5">
                        <span className="text-base">{player.isAI ? '🤖' : '👤'}</span>
                        <span className="text-white font-bold text-sm">{player.username}</span>
                        <div className="scale-90"><PlayerBadge badge={playerBadge} size="sm" /></div>
                      </div>
                      <div className="text-white/80 text-xs mt-0.5">
                        Score: {player.score} | Cartes: {player.hand.length}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main du joueur - compact + cadre infos joueur */}
      <div className="w-full bg-green-900/50 backdrop-blur-sm border-t border-white/10 px-4 py-3 flex-shrink-0">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            {/* Cadre joueur actuel */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-black/30 border border-white/10">
              <span className="text-base">{players.find(p => p.id === myPlayerId)?.isAI ? '🤖' : '👤'}</span>
              <span className="text-white font-bold text-sm">
                {players.find(p => p.id === myPlayerId)?.username || 'Vous'}
              </span>
              {(() => {
                const me = players.find(p => p.id === myPlayerId);
                const myBadge = BADGES.find(b => b.id === me?.currentBadgeId) || BADGES[0];
                return <div className="scale-90"><PlayerBadge badge={myBadge} size="sm" /></div>;
              })()}
              <div className="text-white/80 text-xs">
                Score: {players.find(p => p.id === myPlayerId)?.score ?? 0} | Cartes: {myHand.length}
              </div>
            </div>
            <div className="flex gap-2">
              {isMyTurn && !awaitingEndOrLayDown && (
                <>
                  <Button onClick={handleDiscardSelected} disabled={!hasDrawnThisTurn || selectedCards.size !== 1} size="sm" className="bg-red-600 hover:bg-red-700 h-8 text-xs">
                    🗑️ Défausser ({selectedCards.size})
                  </Button>
                  <Button onClick={passTurn} disabled={!hasDrawnThisTurn} size="sm" className="bg-orange-600 hover:bg-orange-700 h-8 text-xs">
                    ⏭️ Passer
                  </Button>
                  <Button onClick={() => setShowCombinationModal(true)} disabled={!hasDrawnThisTurn} size="sm" className="bg-green-600 hover:bg-green-700 h-8 text-xs">
                    🃏 Poser
                  </Button>
                </>
              )}
              {isMyTurn && awaitingEndOrLayDown && (
                <>
                  <Button onClick={() => setShowCombinationModal(true)} size="sm" className="bg-green-600 hover:bg-green-700 h-8 text-xs">🃏 Poser</Button>
                  <Button onClick={() => endTurnAfterDiscard()} size="sm" className="bg-blue-600 hover:bg-blue-700 h-8 text-xs">✅ Terminer</Button>
                </>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 justify-center min-h-[120px]">
            <AnimatePresence>
              {myHand.map((card) => (
                <Card key={card.id} card={card} faceUp={true} onClick={() => handleCardClick(card.id)} selected={selectedCards.has(card.id)} animate={true} />
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showCombinationModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-3">Poser les cartes</h2>
            <p className="mb-4 text-sm">Le système va former automatiquement des combinaisons avec vos cartes.</p>
            <div className="flex gap-3 justify-end">
              <Button onClick={() => setShowCombinationModal(false)} variant="outline" size="sm">Annuler</Button>
              <Button onClick={handleSubmitCombinations} size="sm" className="bg-green-600 hover:bg-green-700">Confirmer</Button>
            </div>
          </div>
        </div>
      )}

      {/* Overlay de fin de manche */}
      <AnimatePresence>
        {roundOverlay?.visible && (
          <motion.div
            className="fixed inset-0 z-[70] flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/70" />

            {/* Rayons */}
            <Rays color={roundOverlay.isMeWinner ? 'yellow' : 'red'} />

            <div className="relative z-10 max-w-3xl w-full mx-auto text-center px-4">
              {overlayPhase === 'winner-show' && (
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.4 }}>
                  <div className={cn('text-5xl font-extrabold drop-shadow-lg', roundOverlay.isMeWinner ? 'text-yellow-400' : 'text-red-400')}>
                    {roundOverlay.isMeWinner ? 'Manche gagnée' : 'Manche perdue'}
                  </div>
                  {/* cartes du gagnant */}
                  <WinnerCards cards={roundOverlay.winnerCards} />
                </motion.div>
              )}

              {overlayPhase === 'points-fan' && !roundOverlay.isMeWinner && (
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-white">
                  <div className="text-3xl font-bold mb-2">+ {rollingPoints} points</div>
                  <div className="text-sm opacity-80">Vos cartes restantes</div>
                  <div className="flex flex-wrap gap-2 justify-center mt-3">
                    {[...myHand]
                      .sort((a, b) => getCardPoints(b, roundNumber) - getCardPoints(a, roundNumber))
                      .filter((c) => !removedIds.has(c.id))
                      .map((c) => (
                      <motion.div
                        key={c.id}
                        initial={{ y: 0, scale: 1, opacity: 1 }}
                        animate={removingId === c.id ? { y: -200, scale: 0.85, opacity: 0 } : { y: -8, scale: 1.02 }}
                        transition={removingId === c.id ? { duration: 0.35, ease: 'easeIn' } : { repeat: Infinity, repeatType: 'reverse', duration: 0.9 }}
                      >
                        <Card card={c} faceUp={true} />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {overlayPhase === 'score-show' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-white">
                  <div className="text-3xl font-bold">
                    Score : {roundOverlay.isMeWinner ? roundOverlay.myScoreBefore : (scoreRoll ?? roundOverlay.myScoreBefore)}{' '}
                    {roundOverlay.isMeWinner ? (
                      <span className="text-yellow-400">+ 0 point</span>
                    ) : (
                      <span className="text-red-400">+ {roundOverlay.myPoints} points</span>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
