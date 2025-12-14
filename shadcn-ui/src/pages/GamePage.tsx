import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameBoard } from '@/components/game/GameBoard';
import { useGameStore } from '@/stores/gameStore';
import { GamePlayer, PlayerStatus, GameStatus } from '@/types/game.types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function GamePage() {
    const navigate = useNavigate();
    const { initializeGame, gameStatus, players, endGame } = useGameStore();
    const [isInitialized, setIsInitialized] = useState(false);
    const [winner, setWinner] = useState<GamePlayer | null>(null);

    useEffect(() => {
        if (!isInitialized) {
            // Initialiser une partie de démonstration avec 4 joueurs (1 humain + 3 IA)
            const demoPlayers: GamePlayer[] = [
                {
                    id: 'player-1',
                    username: 'Vous',
                    avatarUrl: '',
                    currentBadgeId: 'badge_1',
                    isAI: false,
                    isReady: true,
                    status: PlayerStatus.ACTIVE,
                    position: 0,
                    score: 0,
                    hand: [],
                    hasFinishedRound: false,
                },
                {
                    id: 'ai-1',
                    username: 'IA Alice',
                    avatarUrl: '',
                    currentBadgeId: 'badge_2',
                    isAI: true,
                    isReady: true,
                    status: PlayerStatus.ACTIVE,
                    position: 1,
                    score: 0,
                    hand: [],
                    hasFinishedRound: false,
                },
                {
                    id: 'ai-2',
                    username: 'IA Bob',
                    avatarUrl: '',
                    currentBadgeId: 'badge_3',
                    isAI: true,
                    isReady: true,
                    status: PlayerStatus.ACTIVE,
                    position: 2,
                    score: 0,
                    hand: [],
                    hasFinishedRound: false,
                },
                {
                    id: 'ai-3',
                    username: 'IA Charlie',
                    avatarUrl: '',
                    currentBadgeId: 'badge_4',
                    isAI: true,
                    isReady: true,
                    status: PlayerStatus.ACTIVE,
                    position: 3,
                    score: 0,
                    hand: [],
                    hasFinishedRound: false,
                },
            ];

            initializeGame(demoPlayers, 'player-1');
            setIsInitialized(true);
        }
    }, [isInitialized, initializeGame]);

    useEffect(() => {
        if (gameStatus === GameStatus.COMPLETED) {
            const winnerId = endGame();
            const winnerPlayer = players.find((p) => p.id === winnerId);
            setWinner(winnerPlayer || null);
        }
    }, [gameStatus, endGame, players]);

    if (!isInitialized) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-800 to-green-900 flex items-center justify-center">
                <div className="text-white text-2xl">Initialisation de la partie...</div>
            </div>
        );
    }

    if (winner) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
                <Card className="p-12 bg-white/10 backdrop-blur-md border-white/20 max-w-2xl w-full text-center">
                    <h1 className="text-6xl font-bold text-white mb-8">
                        🎉 Partie Terminée ! 🎉
                    </h1>

                    <div className="mb-8">
                        <p className="text-3xl text-white mb-4">Gagnant:</p>
                        <div className="text-6xl mb-4">
                            {winner.isAI ? '🤖' : '👤'}
                        </div>
                        <p className="text-4xl font-bold text-yellow-400 mb-2">
                            {winner.username}
                        </p>
                        <p className="text-2xl text-white/80">
                            Score final: {winner.score} points
                        </p>
                    </div>

                    <div className="mb-8">
                        <h3 className="text-2xl text-white font-bold mb-4">Classement Final</h3>
                        <div className="space-y-2">
                            {[...players]
                                .sort((a, b) => a.score - b.score)
                                .map((player, index) => (
                                    <div
                                        key={player.id}
                                        className="flex items-center justify-between p-4 bg-white/5 rounded-lg"
                                    >
                                        <div className="flex items-center gap-4">
                      <span className="text-3xl">
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : ''}
                      </span>
                                            <span className="text-xl">{player.isAI ? '🤖' : '👤'}</span>
                                            <span className="text-xl text-white font-semibold">
                        {player.username}
                      </span>
                                        </div>
                                        <span className="text-2xl text-white font-bold">
                      {player.score} pts
                    </span>
                                    </div>
                                ))}
                        </div>
                    </div>

                    <div className="flex gap-4 justify-center">
                        <Button
                            onClick={() => {
                                setIsInitialized(false);
                                setWinner(null);
                            }}
                            size="lg"
                            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                        >
                            Rejouer
                        </Button>
                        <Button
                            onClick={() => navigate('/')}
                            size="lg"
                            variant="outline"
                            className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                        >
                            Menu Principal
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="relative">
            <GameBoard />

            {/* Bouton retour */}
            <div className="fixed top-4 left-4 z-50">
                <Button
                    onClick={() => navigate('/')}
                    variant="outline"
                    className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20"
                >
                    ← Retour au menu
                </Button>
            </div>
        </div>
    );
}