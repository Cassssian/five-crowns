import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameBoard } from '@/components/game/GameBoard';
import { useGameStore } from '@/stores/gameStore';
import { GameStatus, GamePlayer } from '@/types/game.types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function GamePage() {
    const navigate = useNavigate();
    const { gameStatus, players, endGame } = useGameStore();
    const [isInitialized, setIsInitialized] = useState(false);
    const [winner, setWinner] = useState<GamePlayer | null>(null);

    useEffect(() => {
        // Si aucune partie n'est en cours (accès direct à /game), renvoyer vers le lobby
        if (gameStatus === GameStatus.WAITING) {
            navigate('/lobby');
            return;
        }
        setIsInitialized(true);
    }, [gameStatus, navigate]);

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

            {/* Bouton retour (descendu un peu plus bas) */}
            <div className="fixed top-20 left-4 z-50">
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