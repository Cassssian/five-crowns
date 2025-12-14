import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function GameModeSelection() {
    const navigate = useNavigate();

    return (
        <div className="relative h-screen w-screen overflow-hidden bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
            {/* Bouton Retour */}
            <button
                onClick={() => navigate('/')}
                className="absolute top-8 left-8 z-50 px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-lg hover:bg-white/20 transition-all"
            >
                ← Retour au menu
            </button>

            <div className="relative h-full w-full flex">
                {/* Bouton Hors-connexion (Gauche) */}
                <motion.button
                    onClick={() => navigate('/lobby?mode=offline')}
                    whileHover={{ scale: 1.02 }}
                    className="relative w-1/2 h-full bg-gradient-to-br from-emerald-600 to-green-700 hover:from-emerald-500 hover:to-green-600 transition-all duration-300 flex flex-col items-center justify-center gap-8 group"
                >
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all" />

                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="relative z-10 flex flex-col items-center gap-6"
                    >
                        {/* Icône Hors-connexion */}
                        <div className="text-9xl">🎮</div>

                        <div className="text-center">
                            <h2 className="text-6xl font-bold text-white mb-4">
                                Partie Hors-connexion
                            </h2>
                            <p className="text-2xl text-white/90 max-w-md">
                                Jouez localement contre l'IA
                            </p>
                            <p className="text-lg text-white/70 mt-4">
                                Pas besoin de connexion internet
                            </p>
                        </div>

                        {/* Badge */}
                        <div className="px-8 py-3 bg-white/20 backdrop-blur-sm rounded-full text-white font-semibold text-xl">
                            Mode Solo
                        </div>
                    </motion.div>

                    {/* Effet de brillance */}
                    <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.button>

                {/* Éclair SVG au centre */}
                <div className="absolute left-1/2 top-0 -translate-x-1/2 h-full w-32 pointer-events-none z-20">
                    <svg
                        viewBox="0 0 100 1000"
                        className="h-full w-full drop-shadow-2xl"
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

                        {/* Éclair principal */}
                        <path
                            d="M 50 0 L 35 350 L 55 350 L 30 600 L 50 600 L 35 850 L 70 500 L 50 500 L 65 250 L 45 250 Z"
                            fill="url(#lightning-gradient)"
                            stroke="#FFED4E"
                            strokeWidth="3"
                            filter="url(#glow)"
                        />

                        {/* Éclairs secondaires pour l'effet */}
                        <path
                            d="M 45 200 L 40 280 L 48 280 Z"
                            fill="#FFED4E"
                            opacity="0.6"
                        />
                        <path
                            d="M 55 450 L 60 530 L 52 530 Z"
                            fill="#FFED4E"
                            opacity="0.6"
                        />
                        <path
                            d="M 48 700 L 43 780 L 51 780 Z"
                            fill="#FFED4E"
                            opacity="0.6"
                        />
                    </svg>
                </div>

                {/* Bouton En ligne (Droite) */}
                <motion.button
                    onClick={() => navigate('/lobby?mode=online')}
                    whileHover={{ scale: 1.02 }}
                    className="relative w-1/2 h-full bg-gradient-to-br from-blue-600 to-cyan-700 hover:from-blue-500 hover:to-cyan-600 transition-all duration-300 flex flex-col items-center justify-center gap-8 group"
                >
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all" />

                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="relative z-10 flex flex-col items-center gap-6"
                    >
                        {/* Icône En ligne */}
                        <div className="text-9xl">🌐</div>

                        <div className="text-center">
                            <h2 className="text-6xl font-bold text-white mb-4">
                                Partie En ligne
                            </h2>
                            <p className="text-2xl text-white/90 max-w-md">
                                Jouez avec vos amis en ligne
                            </p>
                            <p className="text-lg text-white/70 mt-4">
                                Connexion internet requise
                            </p>
                        </div>

                        {/* Badge */}
                        <div className="px-8 py-3 bg-white/20 backdrop-blur-sm rounded-full text-white font-semibold text-xl">
                            Mode Multijoueur
                        </div>
                    </motion.div>

                    {/* Effet de brillance */}
                    <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.button>
            </div>

            {/* Titre en haut */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 text-center pointer-events-none">
                <motion.h1
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-7xl font-bold text-white drop-shadow-2xl"
                >
                    Choisissez votre mode de jeu
                </motion.h1>
            </div>
        </div>
    );
}