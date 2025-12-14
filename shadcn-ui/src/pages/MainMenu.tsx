import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function MainMenu() {
    const navigate = useNavigate();

    // Palette de couleurs étendue
    const colors = [
        'bg-purple-500/20',
        'bg-blue-500/20',
        'bg-indigo-500/15',
        'bg-cyan-500/20',
        'bg-pink-500/15',
        'bg-violet-500/20',
        'bg-rose-500/20',
        'bg-fuchsia-500/20',
        'bg-sky-500/20',
        'bg-teal-500/20',
        'bg-emerald-500/15',
        'bg-green-500/15',
        'bg-lime-500/15',
        'bg-amber-500/15',
        'bg-orange-500/15',
        'bg-red-500/15',
        'bg-yellow-500/15',
        'bg-slate-500/20',
        'bg-gray-500/15',
        'bg-zinc-500/15',
        'bg-purple-600/20',
        'bg-blue-600/20',
        'bg-indigo-600/15',
        'bg-cyan-600/20',
        'bg-pink-600/15',
        'bg-violet-600/20',
        'bg-rose-600/20',
        'bg-fuchsia-600/20',
        'bg-sky-600/20',
        'bg-teal-600/20',
        'bg-emerald-600/15',
        'bg-green-600/15',
        'bg-purple-400/20',
        'bg-blue-400/20',
        'bg-indigo-400/15',
        'bg-cyan-400/20',
        'bg-pink-400/15',
        'bg-violet-400/20',
        'bg-rose-400/20',
        'bg-fuchsia-400/20',
        'bg-sky-400/20',
        'bg-teal-400/20',
    ];

    // État pour les couleurs de chaque cercle
    const [circleColors, setCircleColors] = useState([
        'bg-purple-500/20',
        'bg-blue-500/20',
        'bg-indigo-500/15',
        'bg-cyan-500/20',
        'bg-pink-500/15',
        'bg-violet-500/20',
    ]);

    // Changer les couleurs de manière indépendante et aléatoire
    useEffect(() => {
        const intervals: NodeJS.Timeout[] = [];

        // Créer un interval pour chaque cercle
        circleColors.forEach((_, index) => {
            const changeColor = () => {
                setCircleColors(prev => {
                    const newColors = [...prev];
                    // S'assurer de choisir une couleur différente
                    let newColor: string;
                    do {
                        newColor = colors[Math.floor(Math.random() * colors.length)];
                    } while (newColor === prev[index]);
                    newColors[index] = newColor;
                    return newColors;
                });

                // Programmer le prochain changement avec un délai aléatoire
                const nextDelay = 6000 + Math.random() * 10000; // Entre 6 et 16 secondes
                const timeout = setTimeout(changeColor, nextDelay);
                intervals.push(timeout);
            };

            // Démarrer avec un délai initial aléatoire pour chaque cercle
            const initialDelay = Math.random() * 5000;
            const timeout = setTimeout(changeColor, initialDelay);
            intervals.push(timeout);
        });

        return () => {
            intervals.forEach(interval => clearTimeout(interval));
        };
    }, []);

    return (
        <div className="relative min-h-screen overflow-hidden flex items-center justify-center p-4">
            {/* Background animé avec dégradé */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
                {/* Cercles animés de couleur qui bougent */}
                <motion.div
                    className={`absolute w-96 h-96 rounded-full blur-3xl transition-all duration-[5000ms] ease-in-out ${circleColors[0]}`}
                    animate={{
                        x: [0, 100, -50, 0],
                        y: [0, -100, 50, 0],
                        scale: [1, 1.2, 0.8, 1],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    style={{ top: '10%', left: '10%' }}
                />
                
                <motion.div
                    className={`absolute w-80 h-80 rounded-full blur-3xl transition-all duration-[5000ms] ease-in-out ${circleColors[1]}`}
                    animate={{
                        x: [0, -80, 100, 0],
                        y: [0, 100, -80, 0],
                        scale: [1, 0.9, 1.3, 1],
                    }}
                    transition={{
                        duration: 25,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    style={{ top: '50%', right: '15%' }}
                />
                
                <motion.div
                    className={`absolute w-[500px] h-[500px] rounded-full blur-3xl transition-all duration-[5000ms] ease-in-out ${circleColors[2]}`}
                    animate={{
                        x: [0, 120, -100, 0],
                        y: [0, -80, 120, 0],
                        scale: [1, 1.1, 0.9, 1],
                    }}
                    transition={{
                        duration: 30,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    style={{ bottom: '10%', left: '20%' }}
                />
                
                <motion.div
                    className={`absolute w-72 h-72 rounded-full blur-3xl transition-all duration-[5000ms] ease-in-out ${circleColors[3]}`}
                    animate={{
                        x: [0, -120, 80, 0],
                        y: [0, 80, -100, 0],
                        scale: [1, 1.3, 0.8, 1],
                    }}
                    transition={{
                        duration: 22,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    style={{ top: '60%', left: '5%' }}
                />
                
                <motion.div
                    className={`absolute w-96 h-96 rounded-full blur-3xl transition-all duration-[5000ms] ease-in-out ${circleColors[4]}`}
                    animate={{
                        x: [0, 90, -120, 0],
                        y: [0, -120, 90, 0],
                        scale: [1, 0.85, 1.2, 1],
                    }}
                    transition={{
                        duration: 28,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    style={{ top: '20%', right: '10%' }}
                />
                
                <motion.div
                    className={`absolute w-64 h-64 rounded-full blur-3xl transition-all duration-[5000ms] ease-in-out ${circleColors[5]}`}
                    animate={{
                        x: [0, -90, 110, 0],
                        y: [0, 110, -90, 0],
                        scale: [1, 1.15, 0.9, 1],
                    }}
                    transition={{
                        duration: 24,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    style={{ bottom: '30%', right: '25%' }}
                />
            </div>

            {/* Contenu principal */}
            <div className="relative z-10 max-w-2xl w-full">
                {/* Logo et titre */}
                <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <h1 className="text-6xl font-bold text-white mb-4 drop-shadow-2xl">
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
            </div>
        </div>
    );
}
