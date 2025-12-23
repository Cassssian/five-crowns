import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function GameModeSelection() {
    const navigate = useNavigate();

    return (
        <div className="relative h-screen w-screen overflow-hidden bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
            {/* Bouton Retour */}
            <button
                onClick={() => navigate('/')}
                className="absolute top-8 phone:top-6 left-8 phone:left-4 z-50 px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-lg hover:bg-white/20 transition-all phone:text-xs"
            >
                ← Retour au menu
            </button>

            <div className="relative h-full w-full flex phone:flex-col">
                {/* Bouton Hors-connexion (Gauche) */}
                <motion.button
                    onClick={() => navigate('/lobby?mode=offline')}
                    whileHover={{ scale: 1.02 }}
                    className="relative w-1/2 h-full phone:w-full phone:h-1/2 bg-gradient-to-br from-emerald-600 to-green-700 hover:from-emerald-500 hover:to-green-600 transition-all duration-300 flex flex-col items-center justify-center gap-8 group"
                >
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all" />

                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="relative z-10 flex flex-col items-center gap-6"
                    >
                        {/* Icône Hors-connexion */}
                        <div className="text-9xl phone:text-4xl">🎮</div>

                        <div className="text-center">
                            <h2 className="text-6xl phone:text-3xl font-bold text-white mb-4">
                                Partie Hors-connexion
                            </h2>
                            <p className="text-2xl phone:text-sm text-white/90 max-w-md mx-auto">
                                Jouez localement contre l'IA
                            </p>
                            <p className="text-lg text-white/70 mt-4">
                                Pas besoin de connexion internet
                            </p>
                        </div>

                        {/* Badge */}
                        <div className="px-8 py-3 bg-white/20 backdrop-blur-sm rounded-full text-white font-semibold text-xl phone:text-xs">
                            Mode Solo
                        </div>
                    </motion.div>

                    {/* Effet de brillance */}
                    <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.button>

                {/* Éclair SVG au centre (caché sur téléphone) */}
                <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-20 pointer-events-none z-20 flex items-center justify-center phone:hidden phone:top-1/2 phone:bottom-auto phone:-translate-y-1/2 phone:w-full phone:h-24">
                    {/* Variante desktop: éclair vertical élancé */}
                    <svg
                        viewBox="0 0 40 600"
                        className="h-full w-full drop-shadow-2xl block phone:hidden"
                        preserveAspectRatio="xMidYMid meet"
                    >
                        <defs>
                            <linearGradient id="lightning-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#FFD700" />
                                <stop offset="50%" stopColor="#FFA500" />
                                <stop offset="100%" stopColor="#FF6B00" />
                            </linearGradient>
                            <filter id="glow">
                                <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                                <feMerge>
                                    <feMergeNode in="coloredBlur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>

                        <path
                            d="M 20 0 L 12 120 L 25 120 L 10 240 L 23 240 L 8 360 L 25 360 L 12 480 L 28 480 L 15 600 L 35 350 L 22 350 L 32 200 L 20 200 L 30 80 L 18 80 Z"
                            fill="url(#lightning-gradient)"
                            stroke="#FFED4E"
                            strokeWidth="1"
                            filter="url(#glow)"
                        />
                    </svg>

                    {/* Variante phone: éclair compact diagonal propre, non étiré */}
                    <svg
                        viewBox="0 0 120 120"
                        className="hidden phone:block h-full w-full drop-shadow-2xl rotate-45"
                        preserveAspectRatio="xMidYMid meet"
                    >
                        <defs>
                            <linearGradient id="lightning-gradient-phone" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#FFD700" />
                                <stop offset="60%" stopColor="#FFA500" />
                                <stop offset="100%" stopColor="#FF6B00" />
                            </linearGradient>
                            <filter id="glow-phone">
                                <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                                <feMerge>
                                    <feMergeNode in="coloredBlur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>

                        {/* Lueur douce derrière */}
                        <rect x="-10" y="40" width="140" height="40" fill="#FFD700" opacity="0.15" rx="20" />

                        {/* Éclair compact en Z */}
                        <path
                            d="M 60 10 L 45 55 L 68 55 L 38 110 L 80 60 L 55 60 Z"
                            fill="url(#lightning-gradient-phone)"
                            stroke="#FFED4E"
                            strokeWidth="1"
                            filter="url(#glow-phone)"
                        />
                    </svg>
                </div>

                {/* Bouton En ligne (Droite) */}
                <motion.button
                    onClick={() => navigate('/lobby?mode=online')}
                    whileHover={{ scale: 1.02 }}
                    className="relative w-1/2 h-full phone:w-full phone:h-1/2 bg-gradient-to-br from-blue-600 to-cyan-700 hover:from-blue-500 hover:to-cyan-600 transition-all duration-300 flex flex-col items-center justify-center gap-8 group"
                >
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all" />

                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="relative z-10 flex flex-col items-center gap-6"
                    >
                        {/* Icône En ligne */}
                        <div className="text-9xl phone:text-4xl">🌐</div>

                        <div className="text-center">
                            <h2 className="text-6xl phone:text-3xl font-bold text-white mb-4">
                                Partie En ligne
                            </h2>
                            <p className="text-2xl phone:text-sm text-white/90 max-w-md">
                                Jouez avec vos amis en ligne
                            </p>
                            <p className="text-lg text-white/70 mt-4">
                                Connexion internet requise
                            </p>
                        </div>

                        {/* Badge */}
                        <div className="px-8 py-3 bg-white/20 backdrop-blur-sm rounded-full text-white font-semibold text-xl phone:text-xs">
                            Mode Multijoueur
                        </div>
                    </motion.div>

                    {/* Effet de brillance */}
                    <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.button>
            </div>

            {/* Titre (centré sur téléphone, en haut sur desktop) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 text-center pointer-events-none md:top-20 md:-translate-y-0">
                <motion.h1
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-7xl phone:text-2xl font-bold text-white drop-shadow-2xl"
                >
                    Choisissez votre mode de jeu
                </motion.h1>
            </div>
        </div>
    );
}