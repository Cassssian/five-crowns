import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGameStore } from '@/stores/gameStore';
import { BADGES } from '@/constants/gameRules';
import PlayerBadge from '@/components/game/PlayerBadge';
import { Badge } from '@/types/game.types';

const AVATARS = ['👤', '🧑', '👨', '👩', '🧔', '👱', '🧑‍🦰', '👨‍🦱'];

interface LobbyPlayer {
    id: string;
    username: string;
    avatar: string;
    badge: Badge;
    isReady: boolean;
    isHost: boolean;
}

export default function Lobby() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { startGame } = useGameStore();

    // Mode du lobby: en ligne (par défaut) ou hors ligne
    const mode = searchParams.get('mode') ?? 'online';
    const isOffline = useMemo(() => mode === 'offline', [mode]);

    const [username, setUsername] = useState('Joueur 1');
    const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0]);
    const [selectedBadge, setSelectedBadge] = useState(BADGES[0]);
    const [maxPlayers, setMaxPlayers] = useState('4');
    const [timerEnabled, setTimerEnabled] = useState(true);
    const [isReady, setIsReady] = useState(false);

    // Simulation de joueurs dans le lobby
    const [players, setPlayers] = useState<LobbyPlayer[]>([
        {
            id: '1',
            username: 'Joueur 1',
            avatar: AVATARS[0],
            badge: BADGES[0],
            isReady: false,
            isHost: true,
        },
    ]);

    const handleAddAIPlayer = () => {
        // En ligne : respecter le cap max joueurs. Hors ligne : pas de limite
        if (!isOffline && players.length >= parseInt(maxPlayers)) return;

        const newPlayer: LobbyPlayer = {
            id: `ai-${Date.now()}`,
            username: `IA ${players.length}`,
            avatar: '🤖',
            badge: BADGES[Math.floor(Math.random() * BADGES.length)],
            isReady: true,
            isHost: false,
        };

        setPlayers([...players, newPlayer]);
    };

    const handleRemovePlayer = (playerId: string) => {
        if (playerId === '1') return; // Ne pas supprimer l'hôte
        // Hors ligne : conserver au moins une IA en permanence
        const target = players.find(p => p.id === playerId);
        if (isOffline && target && target.id.startsWith('ai-')) {
            const aiCount = players.filter(p => p.id.startsWith('ai-')).length;
            if (aiCount <= 1) return; // Empêcher de retirer la dernière IA
        }
        setPlayers(players.filter(p => p.id !== playerId));
    };

    const handleToggleReady = () => {
        // En hors ligne, pas de système de prêt
        if (isOffline) return;
        setIsReady(!isReady);
        setPlayers(players.map(p =>
            p.id === '1' ? { ...p, isReady: !isReady } : p
        ));
    };

    const handleUpdateProfile = () => {
        setPlayers(players.map(p =>
            p.id === '1' ? { ...p, username, avatar: selectedAvatar, badge: selectedBadge } : p
        ));
    };

    const handleStartGame = () => {
        if (players.length < 2) {
            alert('Il faut au moins 2 joueurs pour commencer !');
            return;
        }

        if (!isOffline) {
            const allReady = players.every(p => p.isReady);
            if (!allReady) {
                alert('Tous les joueurs doivent être prêts !');
                return;
            }
        }

        // Initialiser le jeu avec les joueurs du lobby
        startGame(players.map(p => ({
            id: p.id,
            username: p.username,
            avatar: p.avatar,
            badge: p.badge,
            isAI: p.id.startsWith('ai-'),
        })));

        navigate('/game');
    };

    // Hors ligne: s'assurer qu'il y a toujours au moins une IA
    useEffect(() => {
        if (!isOffline) return;
        const hasAI = players.some(p => p.id.startsWith('ai-'));
        if (!hasAI) {
            setPlayers(prev => {
                const stillNoAI = !prev.some(p => p.id.startsWith('ai-'));
                if (!stillNoAI) return prev;
                const ai: LobbyPlayer = {
                    id: `ai-${Date.now()}`,
                    username: `IA ${prev.length}`,
                    avatar: '🤖',
                    badge: BADGES[Math.floor(Math.random() * BADGES.length)],
                    isReady: true,
                    isHost: false,
                };
                return [...prev, ai];
            });
        }
    }, [isOffline, players]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-8">
            <div className="max-w-6xl mx-auto">
                {/* En-tête */}
                <div className="flex items-center justify-between mb-8">
                    <Button
                        onClick={() => navigate('/')}
                        variant="outline"
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                    >
                        ← Retour au menu
                    </Button>
                    <h1 className="text-4xl font-bold text-white">{isOffline ? 'Salon hors ligne' : 'Salon en ligne'}</h1>
                    <div className="w-32" /> {/* Spacer */}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Configuration de la partie */}
                    <Card className="p-6 bg-white/10 backdrop-blur-md border-white/20">
                        <h2 className="text-2xl font-bold text-white mb-6">Configuration</h2>

                        <div className="space-y-6">
                            {/* Nombre de joueurs - uniquement en ligne */}
                            {!isOffline && (
                                <div>
                                    <Label className="text-white mb-2 block">Nombre de joueurs max</Label>
                                    <Select value={maxPlayers} onValueChange={setMaxPlayers}>
                                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {[2, 3, 4, 5, 6, 7, 8].map(num => (
                                                <SelectItem key={num} value={num.toString()}>
                                                    {num} joueurs
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}

                            {/* Timer */}
                            <div className="flex items-center justify-between">
                                <Label className="text-white">Timer activé</Label>
                                <Switch
                                    checked={timerEnabled}
                                    onCheckedChange={setTimerEnabled}
                                />
                            </div>

                            {/* Profil */}
                            <div className="pt-4 border-t border-white/20">
                                <h3 className="text-lg font-semibold text-white mb-4">Votre profil</h3>

                                <div className="space-y-4">
                                    <div>
                                        <Label className="text-white mb-2 block">Pseudo</Label>
                                        <Input
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            className="bg-white/10 border-white/20 text-white"
                                            maxLength={20}
                                        />
                                    </div>

                                    <div>
                                        <Label className="text-white mb-2 block">Avatar</Label>
                                        <div className="grid grid-cols-4 gap-2">
                                            {AVATARS.map(avatar => (
                                                <button
                                                    key={avatar}
                                                    onClick={() => setSelectedAvatar(avatar)}
                                                    className={`text-3xl p-2 rounded-lg transition-all ${
                                                        selectedAvatar === avatar
                                                            ? 'bg-blue-500 ring-2 ring-white'
                                                            : 'bg-white/10 hover:bg-white/20'
                                                    }`}
                                                >
                                                    {avatar}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <Label className="text-white mb-3 block text-lg font-semibold">Badge</Label>
                                        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                                            <div className="grid grid-cols-3 gap-3">
                                                {BADGES.slice(0, 9).map(badge => (
                                                    <motion.button
                                                        key={badge.id}
                                                        onClick={() => setSelectedBadge(badge)}
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        className={`
                                                            relative group
                                                            transition-all duration-200
                                                            ${
                                                                selectedBadge.id === badge.id
                                                                    ? 'ring-2 ring-yellow-400 shadow-lg shadow-yellow-500/50'
                                                                    : 'hover:ring-2 hover:ring-white/30'
                                                            }
                                                            rounded-lg overflow-hidden
                                                            flex items-center justify-center
                                                            aspect-square
                                                        `}
                                                    >
                                                        {/* Badge avec effet de survol */}
                                                        <div className="relative z-10">
                                                            <PlayerBadge badge={badge} size="md" showTooltip={false} />
                                                            
                                                            {/* Indicateur de sélection */}
                                                            {selectedBadge.id === badge.id && (
                                                                <motion.div
                                                                    initial={{ scale: 0 }}
                                                                    animate={{ scale: 1 }}
                                                                    className="absolute -top-1 -right-1 bg-yellow-400 text-black rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold"
                                                                >
                                                                    ✓
                                                                </motion.div>
                                                            )}
                                                        </div>
                                                        
                                                        {/* Nom du badge au survol */}
                                                        <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-0">
                                                            <span className="text-white text-xs font-semibold px-2 text-center leading-tight">
                                                                {badge.title}
                                                            </span>
                                                        </div>
                                                    </motion.button>
                                                ))}
                                            </div>
                                            
                                            {/* Badge sélectionné - Aperçu */}
                                            <div className="mt-4 pt-4 border-t border-white/10">
                                                <div className="flex items-start gap-3 bg-white/5 rounded-lg p-3">
                                                    <div className="text-3xl flex-shrink-0">{selectedBadge.emoji}</div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="text-white font-bold mb-1">{selectedBadge.title}</h4>
                                                        <p className="text-white/70 text-sm line-clamp-2">{selectedBadge.description}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-xs text-white/50 mt-2 text-center">9 premiers badges disponibles</p>
                                    </div>

                                    <Button
                                        onClick={handleUpdateProfile}
                                        className="w-full bg-blue-600 hover:bg-blue-700"
                                    >
                                        Mettre à jour le profil
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Liste des joueurs */}
                    <Card className="lg:col-span-2 p-6 bg-white/10 backdrop-blur-md border-white/20">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-white">
                                {isOffline ? `Joueurs (${players.length})` : `Joueurs (${players.length}/${maxPlayers})`}
                            </h2>
                            <Button
                                onClick={handleAddAIPlayer}
                                disabled={!isOffline && players.length >= parseInt(maxPlayers)}
                                className="bg-purple-600 hover:bg-purple-700"
                            >
                                + Ajouter une IA
                            </Button>
                        </div>

                        <div className="space-y-4 mb-6">
                            {players.map((player, index) => (
                                <motion.div
                                    key={player.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className={`p-4 rounded-lg flex items-center justify-between ${
                                        player.isReady
                                            ? 'bg-green-500/20 border-2 border-green-500'
                                            : 'bg-white/5 border-2 border-white/20'
                                    }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="text-4xl">{player.avatar}</div>
                                        <div>
                                            <div className="flex items-center gap-2">
                        <span className="text-white font-semibold text-lg">
                          {player.username}
                        </span>
                                                <PlayerBadge badge={player.badge} size="sm" />
                                                {player.isHost && (
                                                    <span className="text-xs bg-yellow-500 text-black px-2 py-1 rounded-full font-bold">
                            HÔTE
                          </span>
                                                )}
                                            </div>
                                            {!isOffline && (
                                                <div className="text-white/70 text-sm">
                                                    {player.isReady ? '✓ Prêt' : '⏳ En attente...'}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {!player.isHost && (
                                        <Button
                                            onClick={() => handleRemovePlayer(player.id)}
                                            variant="destructive"
                                            size="sm"
                                        >
                                            Retirer
                                        </Button>
                                    )}
                                </motion.div>
                            ))}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4">
                            {!isOffline && (
                                <Button
                                    onClick={handleToggleReady}
                                    className={`flex-1 h-14 text-lg ${
                                        isReady
                                            ? 'bg-orange-600 hover:bg-orange-700'
                                            : 'bg-green-600 hover:bg-green-700'
                                    }`}
                                >
                                    {isReady ? '❌ Annuler' : '✓ Prêt'}
                                </Button>
                            )}

                            <Button
                                onClick={handleStartGame}
                                disabled={players.length < 2 || (!isOffline && !players.every(p => p.isReady))}
                                className="flex-1 h-14 text-lg bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700"
                            >
                                🎮 Lancer la partie
                            </Button>
                        </div>

                        {players.length < 2 && (
                            <p className="text-yellow-300 text-center mt-4">
                                ⚠️ Il faut au moins 2 joueurs pour commencer
                            </p>
                        )}
                        {!isOffline && players.length >= 2 && !players.every(p => p.isReady) && (
                            <p className="text-yellow-300 text-center mt-4">
                                ⚠️ Tous les joueurs doivent être prêts
                            </p>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
}