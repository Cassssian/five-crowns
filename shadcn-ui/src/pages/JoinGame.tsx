import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface GameRoom {
    id: string;
    hostName: string;
    hostAvatar: string;
    currentPlayers: number;
    maxPlayers: number;
    timerEnabled: boolean;
    status: 'waiting' | 'in-progress';
}

export default function JoinGame() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

    // Simulation de parties disponibles
    const [availableGames] = useState<GameRoom[]>([
        {
            id: 'game-1',
            hostName: 'Alice',
            hostAvatar: '👩',
            currentPlayers: 2,
            maxPlayers: 4,
            timerEnabled: true,
            status: 'waiting',
        },
        {
            id: 'game-2',
            hostName: 'Bob',
            hostAvatar: '🧔',
            currentPlayers: 3,
            maxPlayers: 6,
            timerEnabled: false,
            status: 'waiting',
        },
        {
            id: 'game-3',
            hostName: 'Charlie',
            hostAvatar: '👨',
            currentPlayers: 1,
            maxPlayers: 8,
            timerEnabled: true,
            status: 'waiting',
        },
        {
            id: 'game-4',
            hostName: 'Diana',
            hostAvatar: '👱',
            currentPlayers: 4,
            maxPlayers: 4,
            timerEnabled: true,
            status: 'in-progress',
        },
    ]);

    const filteredGames = availableGames.filter(game =>
        game.status === 'waiting' &&
        (searchQuery === '' || game.hostName.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const handleJoinGame = (gameId: string) => {
        // Dans une vraie application, on rejoindrait la partie via WebSocket
        // Pour le MVP, on redirige vers le lobby
        navigate('/lobby');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-8">
            <div className="max-w-4xl mx-auto">
                {/* En-tête */}
                <div className="flex items-center justify-between mb-8">
                    <Button
                        onClick={() => navigate('/')}
                        variant="outline"
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                    >
                        ← Retour au menu
                    </Button>
                    <h1 className="text-4xl font-bold text-white">Rejoindre une partie</h1>
                    <div className="w-32" /> {/* Spacer */}
                </div>

                {/* Barre de recherche */}
                <Card className="p-6 bg-white/10 backdrop-blur-md border-white/20 mb-6">
                    <Input
                        placeholder="Rechercher par nom d'hôte..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50 text-lg h-12"
                    />
                </Card>

                {/* Liste des parties */}
                <div className="space-y-4">
                    {filteredGames.length === 0 ? (
                        <Card className="p-12 bg-white/10 backdrop-blur-md border-white/20 text-center">
                            <div className="text-6xl mb-4">🔍</div>
                            <h2 className="text-2xl font-bold text-white mb-2">
                                Aucune partie disponible
                            </h2>
                            <p className="text-white/70">
                                {searchQuery
                                    ? 'Essayez de modifier votre recherche'
                                    : 'Créez une nouvelle partie pour commencer à jouer !'}
                            </p>
                            <Button
                                onClick={() => navigate('/lobby')}
                                className="mt-6 bg-green-600 hover:bg-green-700"
                            >
                                Créer une partie
                            </Button>
                        </Card>
                    ) : (
                        filteredGames.map((game, index) => (
                            <motion.div
                                key={game.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card className="p-6 bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-6">
                                            {/* Avatar de l'hôte */}
                                            <div className="text-5xl">{game.hostAvatar}</div>

                                            {/* Informations */}
                                            <div>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-2xl font-bold text-white">
                                                        Partie de {game.hostName}
                                                    </h3>
                                                    <Badge className="bg-yellow-500 text-black">HÔTE</Badge>
                                                </div>

                                                <div className="flex items-center gap-4 text-white/80">
                          <span className="flex items-center gap-2">
                            👥 {game.currentPlayers}/{game.maxPlayers} joueurs
                          </span>
                                                    <span className="flex items-center gap-2">
                            {game.timerEnabled ? '⏱️ Timer activé' : '⏱️ Sans timer'}
                          </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Bouton rejoindre */}
                                        <Button
                                            onClick={() => handleJoinGame(game.id)}
                                            disabled={game.currentPlayers >= game.maxPlayers}
                                            className="bg-blue-600 hover:bg-blue-700 h-12 px-8 text-lg"
                                        >
                                            {game.currentPlayers >= game.maxPlayers ? '🔒 Complète' : '🔗 Rejoindre'}
                                        </Button>
                                    </div>
                                </Card>
                            </motion.div>
                        ))
                    )}
                </div>

                {/* Parties en cours (non rejoignables) */}
                {availableGames.filter(g => g.status === 'in-progress').length > 0 && (
                    <div className="mt-8">
                        <h2 className="text-2xl font-bold text-white mb-4">Parties en cours</h2>
                        <div className="space-y-4">
                            {availableGames
                                .filter(g => g.status === 'in-progress')
                                .map((game, index) => (
                                    <motion.div
                                        key={game.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <Card className="p-6 bg-white/5 backdrop-blur-md border-white/10 opacity-60">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-6">
                                                    <div className="text-5xl">{game.hostAvatar}</div>
                                                    <div>
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <h3 className="text-2xl font-bold text-white">
                                                                Partie de {game.hostName}
                                                            </h3>
                                                            <Badge className="bg-red-500 text-white">EN COURS</Badge>
                                                        </div>
                                                        <div className="flex items-center gap-4 text-white/80">
                              <span className="flex items-center gap-2">
                                👥 {game.currentPlayers}/{game.maxPlayers} joueurs
                              </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <Button disabled className="h-12 px-8 text-lg">
                                                    🎮 En jeu
                                                </Button>
                                            </div>
                                        </Card>
                                    </motion.div>
                                ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}