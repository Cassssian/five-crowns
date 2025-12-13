# Structure des Fichiers du Projet
# Les Cinq Rois - Jeu en Ligne

**Version** : 1.0  
**Date** : 07/11/2025  
**to update*
---

## Arborescence Complète du Projet

```
five_crowns_online/
├── public/
│   ├── favicon.ico
│   ├── logo.png
│   ├── manifest.json
│   └── robots.txt
│
├── src/
│   ├── components/
│   │   ├── ui/                          # Shadcn-ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── select.tsx
│   │   │   ├── toast.tsx
│   │   │   ├── toaster.tsx
│   │   │   ├── avatar.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── progress.tsx
│   │   │   ├── slider.tsx
│   │   │   ├── switch.tsx
│   │   │   └── tabs.tsx
│   │   │
│   │   ├── game/                        # Composants de jeu
│   │   │   ├── Card.tsx                 # Carte individuelle avec animations
│   │   │   ├── Deck.tsx                 # Pioche
│   │   │   ├── DiscardPile.tsx          # Défausse
│   │   │   ├── PlayerHand.tsx           # Main d'un joueur
│   │   │   ├── GameBoard.tsx            # Plateau principal
│   │   │   ├── ScoreBoard.tsx           # Tableau des scores
│   │   │   ├── Timer.tsx                # Compte à rebours
│   │   │   ├── CombinationValidator.tsx # Validation des combinaisons
│   │   │   ├── RoundTransition.tsx      # Écran de transition entre manches
│   │   │   └── GameEndScreen.tsx        # Écran de fin de partie
│   │   │
│   │   ├── lobby/                       # Composants du lobby
│   │   │   ├── PlayerSlot.tsx           # Slot joueur dans le lobby
│   │   │   ├── WaitingSlot.tsx          # Slot d'attente animé
│   │   │   ├── LobbySettings.tsx        # Configuration de partie
│   │   │   ├── ReadyButton.tsx          # Bouton prêt avec animation
│   │   │   ├── GameCodeDisplay.tsx      # Affichage du code de partie
│   │   │   └── PlayerList.tsx           # Liste des joueurs
│   │   │
│   │   ├── profile/                     # Composants de profil
│   │   │   ├── AvatarUpload.tsx         # Upload d'avatar avec crop
│   │   │   ├── BadgeSelector.tsx        # Sélection de badge
│   │   │   ├── BadgeGrid.tsx            # Grille de badges
│   │   │   ├── BadgeCard.tsx            # Carte de badge individuelle
│   │   │   ├── ProfileForm.tsx          # Formulaire de profil
│   │   │   └── ProgressBar.tsx          # Barre de progression de badge
│   │   │
│   │   ├── history/                     # Composants d'historique
│   │   │   ├── GameList.tsx             # Liste des parties
│   │   │   ├── GameCard.tsx             # Carte de partie
│   │   │   ├── Statistics.tsx           # Statistiques globales
│   │   │   ├── StatCard.tsx             # Carte de statistique
│   │   │   └── FilterBar.tsx            # Barre de filtres
│   │   │
│   │   ├── replay/                      # Composants de rejeu
│   │   │   ├── ReplayControls.tsx       # Contrôles de lecture
│   │   │   ├── Timeline.tsx             # Timeline interactive
│   │   │   ├── SpeedSelector.tsx        # Sélection de vitesse
│   │   │   └── ActionLog.tsx            # Journal des actions
│   │   │
│   │   └── common/                      # Composants communs
│   │       ├── Notification.tsx         # Toast notifications
│   │       ├── LoadingSpinner.tsx       # Spinner de chargement
│   │       ├── ErrorBoundary.tsx        # Gestion d'erreurs
│   │       ├── ConfirmDialog.tsx        # Dialog de confirmation
│   │       ├── Header.tsx               # En-tête de page
│   │       └── Footer.tsx               # Pied de page
│   │
│   ├── pages/                           # Pages de l'application
│   │   ├── MainMenu.tsx                 # Menu principal
│   │   ├── ProfilePage.tsx              # Page de profil
│   │   ├── LobbyPage.tsx                # Page de lobby
│   │   ├── GamePage.tsx                 # Page de jeu
│   │   ├── HistoryPage.tsx              # Page d'historique
│   │   ├── ReplayPage.tsx               # Page de rejeu
│   │   └── NotFoundPage.tsx             # Page 404
│   │
│   ├── stores/                          # Zustand stores
│   │   ├── gameStore.ts                 # État du jeu
│   │   ├── profileStore.ts              # Profil utilisateur
│   │   ├── lobbyStore.ts                # État du lobby
│   │   ├── historyStore.ts              # Historique
│   │   ├── notificationStore.ts         # Notifications
│   │   └── index.ts                     # Export centralisé
│   │
│   ├── lib/                             # Bibliothèques et utilitaires
│   │   ├── supabase.ts                  # Client Supabase
│   │   ├── gameLogic.ts                 # Logique de jeu
│   │   ├── cardUtils.ts                 # Utilitaires cartes
│   │   ├── animationUtils.ts            # Utilitaires animations
│   │   ├── validationUtils.ts           # Validations
│   │   ├── encryptionUtils.ts           # Chiffrement (si nécessaire côté client)
│   │   ├── dateUtils.ts                 # Utilitaires de dates
│   │   └── utils.ts                     # Utilitaires généraux (cn, etc.)
│   │
│   ├── hooks/                           # Custom React hooks
│   │   ├── useGame.ts                   # Hook pour le jeu
│   │   ├── useRealtime.ts               # Hook pour Realtime
│   │   ├── useAuth.ts                   # Hook pour Auth
│   │   ├── useAnimations.ts             # Hook pour animations
│   │   ├── useTimer.ts                  # Hook pour timer
│   │   ├── useLocalStorage.ts           # Hook pour localStorage
│   │   └── useMediaQuery.ts             # Hook pour responsive
│   │
│   ├── types/                           # Types TypeScript
│   │   ├── game.types.ts                # Types de jeu
│   │   ├── player.types.ts              # Types de joueur
│   │   ├── card.types.ts                # Types de carte
│   │   ├── badge.types.ts               # Types de badge
│   │   ├── statistics.types.ts          # Types de statistiques
│   │   ├── database.types.ts            # Types générés par Supabase
│   │   └── index.ts                     # Export centralisé
│   │
│   ├── constants/                       # Constantes
│   │   ├── gameRules.ts                 # Règles du jeu
│   │   ├── badges.ts                    # Définition des 30 badges
│   │   ├── animations.ts                # Configurations animations
│   │   ├── routes.ts                    # Routes de l'application
│   │   └── config.ts                    # Configuration générale
│   │
│   ├── styles/                          # Styles globaux
│   │   ├── globals.css                  # Styles globaux + Tailwind
│   │   └── animations.css               # Animations personnalisées
│   │
│   ├── App.tsx                          # Composant racine
│   ├── main.tsx                         # Point d'entrée
│   └── vite-env.d.ts                    # Types Vite
│
├── supabase/                            # Configuration Supabase
│   ├── functions/                       # Edge Functions
│   │   ├── create-game/
│   │   │   └── index.ts                 # Créer une partie
│   │   ├── join-game/
│   │   │   └── index.ts                 # Rejoindre une partie
│   │   ├── start-game/
│   │   │   └── index.ts                 # Lancer une partie
│   │   ├── validate-action/
│   │   │   └── index.ts                 # Valider une action
│   │   ├── ai-player/
│   │   │   └── index.ts                 # IA joueur
│   │   ├── calculate-score/
│   │   │   └── index.ts                 # Calculer les scores
│   │   ├── check-combinations/
│   │   │   └── index.ts                 # Vérifier les combinaisons
│   │   ├── check-badges/
│   │   │   └── index.ts                 # Vérifier déblocage de badges
│   │   └── _shared/
│   │       ├── encryption.ts            # Utilitaires de chiffrement
│   │       ├── gameLogic.ts             # Logique de jeu partagée
│   │       └── types.ts                 # Types partagés
│   │
│   ├── migrations/                      # Migrations SQL
│   │   ├── 20250107000001_initial_schema.sql
│   │   ├── 20250107000002_add_badges.sql
│   │   └── 20250107000003_add_rls_policies.sql
│   │
│   └── config.toml                      # Configuration Supabase
│
├── docs/                                # Documentation
│   ├── prd/
│   │   └── five_crowns_prd.md           # PRD créé par Emma
│   ├── design/
│   │   ├── system_design.md             # Design système (ce document)
│   │   └── file_tree.md                 # Structure des fichiers (ce document)
│   └── api/
│       └── edge-functions.md            # Documentation des Edge Functions
│
├── tests/                               # Tests
│   ├── unit/
│   │   ├── gameLogic.test.ts
│   │   ├── cardUtils.test.ts
│   │   └── validationUtils.test.ts
│   ├── integration/
│   │   ├── game-flow.test.ts
│   │   └── multiplayer.test.ts
│   └── e2e/
│       └── full-game.spec.ts
│
├── .env.example                         # Variables d'environnement exemple
├── .env.local                           # Variables d'environnement locales (git-ignored)
├── .gitignore
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── components.json                      # Config Shadcn-ui
├── README.md
└── LICENSE
```

---

## Description des Répertoires Principaux

### `/src/components/`
Tous les composants React réutilisables, organisés par fonctionnalité :
- **ui/** : Composants Shadcn-ui de base
- **game/** : Composants spécifiques au plateau de jeu
- **lobby/** : Composants du lobby multijoueur
- **profile/** : Composants de gestion de profil
- **history/** : Composants d'historique et statistiques
- **replay/** : Composants de rejeu de parties
- **common/** : Composants partagés (notifications, spinners, etc.)

### `/src/pages/`
Composants de page pour le routing React Router :
- Chaque page correspond à une route principale
- Gère la logique de page et compose les composants

### `/src/stores/`
Stores Zustand pour la gestion d'état :
- **gameStore** : État du jeu en cours (cartes, scores, tours)
- **profileStore** : Profil utilisateur (pseudo, avatar, badges)
- **lobbyStore** : État du lobby (joueurs, configuration)
- **historyStore** : Historique des parties
- **notificationStore** : Gestion des notifications toast

### `/src/lib/`
Bibliothèques et utilitaires :
- **supabase.ts** : Configuration du client Supabase
- **gameLogic.ts** : Logique métier du jeu (règles, validations)
- **cardUtils.ts** : Fonctions pour manipuler les cartes
- **animationUtils.ts** : Helpers pour les animations Framer Motion

### `/src/hooks/`
Custom React hooks :
- **useGame** : Gestion de l'état du jeu et actions
- **useRealtime** : Abonnement aux événements Realtime
- **useAuth** : Authentification Supabase
- **useAnimations** : Contrôle des animations

### `/src/types/`
Définitions TypeScript :
- Types pour les entités du jeu (Card, Player, Game, etc.)
- Types générés automatiquement par Supabase CLI
- Interfaces pour les stores et hooks

### `/src/constants/`
Constantes de l'application :
- **gameRules.ts** : Règles du jeu (nombre de cartes, valeurs, etc.)
- **badges.ts** : Définition des 30 badges déblocables
- **animations.ts** : Durées et configurations d'animations

### `/supabase/functions/`
Edge Functions Deno pour la logique serveur :
- **create-game** : Créer une nouvelle partie
- **join-game** : Rejoindre une partie existante
- **start-game** : Lancer une partie
- **validate-action** : Valider toutes les actions de jeu
- **ai-player** : Logique de l'IA
- **calculate-score** : Calcul des scores
- **check-combinations** : Validation des combinaisons
- **check-badges** : Vérification du déblocage de badges

### `/supabase/migrations/`
Migrations SQL pour la base de données :
- Création des tables
- Ajout des badges
- Configuration des politiques RLS

### `/docs/`
Documentation du projet :
- **prd/** : Product Requirements Document
- **design/** : Documents de conception (architecture, diagrammes)
- **api/** : Documentation des API et Edge Functions

### `/tests/`
Tests automatisés :
- **unit/** : Tests unitaires (logique de jeu, utilitaires)
- **integration/** : Tests d'intégration (flux de jeu)
- **e2e/** : Tests end-to-end (parcours utilisateur complet)

---

## Fichiers de Configuration Importants

### `package.json`
Dépendances principales :
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "@supabase/supabase-js": "^2.38.0",
    "zustand": "^4.4.7",
    "framer-motion": "^10.16.16",
    "lucide-react": "^0.294.0",
    "date-fns": "^2.30.0",
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@vitejs/plugin-react": "^4.2.1",
    "typescript": "^5.3.3",
    "vite": "^5.0.8",
    "tailwindcss": "^3.3.6",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32",
    "vitest": "^1.0.4",
    "@testing-library/react": "^14.1.2"
  }
}
```

### `vite.config.ts`
Configuration Vite avec obfuscation pour production :
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
});
```

### `tailwind.config.js`
Configuration Tailwind avec thème personnalisé :
```javascript
module.exports = {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        // ... couleurs Shadcn-ui
      },
      animation: {
        'card-flip': 'flip 0.5s ease-in-out',
        'card-slide': 'slide 0.3s ease-out',
      },
      keyframes: {
        flip: {
          '0%': { transform: 'rotateY(0deg)' },
          '100%': { transform: 'rotateY(180deg)' },
        },
        slide: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
```

### `tsconfig.json`
Configuration TypeScript stricte :
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

---

## Conventions de Nommage

### Fichiers
- **Composants React** : PascalCase (ex: `GameBoard.tsx`)
- **Hooks** : camelCase avec préfixe `use` (ex: `useGame.ts`)
- **Utilitaires** : camelCase (ex: `cardUtils.ts`)
- **Types** : camelCase avec suffixe `.types` (ex: `game.types.ts`)
- **Constants** : camelCase (ex: `gameRules.ts`)

### Code
- **Composants** : PascalCase (ex: `GameBoard`)
- **Fonctions** : camelCase (ex: `calculateScore`)
- **Variables** : camelCase (ex: `currentPlayer`)
- **Constantes** : UPPER_SNAKE_CASE (ex: `MAX_PLAYERS`)
- **Types/Interfaces** : PascalCase (ex: `GameState`)
- **Enums** : PascalCase (ex: `CardSuit`)

---

## Scripts NPM Principaux

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "format": "prettier --write \"src/**/*.{ts,tsx,css}\"",
    "supabase:start": "supabase start",
    "supabase:stop": "supabase stop",
    "supabase:reset": "supabase db reset",
    "supabase:gen-types": "supabase gen types typescript --local > src/types/database.types.ts"
  }
}
```

---

**Document créé le** : 07/11/2025  
**Version** : 1.0  
**Architecte** : Bob