import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function MainMenu() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full">
                {/* Logo et titre */}
                <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <h1 className="text-7xl font-bold text-white mb-4">
                        👑 Les Cinq Rois 👑
                    </h1>
                    <p className="text-xl text-white/80">Five Crowns - Jeu en Ligne</p>
                </div>

                {/* Menu principal */}
                <Card className="p-8 bg-white/10 backdrop-blur-md border-white/20">
                    <div className="space-y-4">
                        <Button
                            onClick={() => navigate('/game-mode')}
                            className="w-full h-16 text-xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                            size="lg"
                        >
                            <span className="mr-3">🎮</span>
                            Lancer une partie
                        </Button>

                        <Button
                            onClick={() => navigate('/join')}
                            className="w-full h-16 text-xl bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700"
                            size="lg"
                        >
                            <span className="mr-3">🔗</span>
                            Rejoindre une partie
                        </Button>

                        <Button
                            onClick={() => alert('Fonctionnalité en développement')}
                            className="w-full h-16 text-xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700"
                            size="lg"
                            disabled
                        >
                            <span className="mr-3">⏸️</span>
                            Reprendre une partie
                        </Button>

                        <Button
                            onClick={() => alert('Fonctionnalité en développement')}
                            className="w-full h-16 text-xl bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
                            size="lg"
                            disabled
                        >
                            <span className="mr-3">📊</span>
                            Historique
                        </Button>
                    </div>

                    <div className="mt-8 pt-8 border-t border-white/20">
                        <Button
                            onClick={() => alert('Fonctionnalité en développement')}
                            variant="outline"
                            className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10"
                        >
                            <span className="mr-2">⚙️</span>
                            Profil et Paramètres
                        </Button>
                    </div>
                </Card>

                {/* Footer */}
                <div className="text-center mt-8 text-white/60 text-sm">
                    <p>Version MVP - Développé avec React, TypeScript et Shadcn-ui</p>
                    <p className="mt-2">🎲 Bon jeu ! 🎲</p>
                </div>
            </div>
        </div>
    );
}