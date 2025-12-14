# Five Crowns - Plan d'Implémentation MVP

## Phase 1 : Configuration de Base (Priorité Maximale)
- [x] Template Shadcn-ui initialisé
- [ ] Configuration Supabase (schéma de base de données)
- [ ] Types TypeScript pour le jeu
- [ ] Constantes du jeu (règles, badges)

## Phase 2 : Menu Principal et Navigation
- [ ] Page Menu Principal avec 4 boutons
- [ ] Routing React Router
- [ ] Page Profil (basique)
- [ ] Store Zustand pour le profil

## Phase 3 : Système de Profil
- [ ] Formulaire de profil (pseudo, avatar)
- [ ] Upload d'avatar vers Supabase Storage
- [ ] Système de badges (30 badges définis)
- [ ] Sélecteur de badge

## Phase 4 : Lobby Multijoueur
- [ ] Page Lobby avec configuration
- [ ] Liste des joueurs avec animations
- [ ] Système "prêt" avec animation de couleur
- [ ] Slots d'attente avec animations (animate.css)
- [ ] Popup de notification (joueur rejoint)
- [ ] Code de partie et partage

## Phase 5 : Logique du Jeu Five Crowns
- [ ] Création du deck (116 cartes : 5 couleurs × 11 valeurs × 2 + 6 jokers)
- [ ] Mélange et distribution des cartes
- [ ] Gestion des 11 manches (3 à 13 cartes)
- [ ] Système de jokers variables par manche
- [ ] Validation des combinaisons (suites et brelans)
- [ ] Calcul des scores

## Phase 6 : Interface de Jeu
- [ ] Composant Card avec animations
- [ ] Composant Deck (pioche)
- [ ] Composant DiscardPile (défausse)
- [ ] Composant PlayerHand (main du joueur)
- [ ] Composant GameBoard (plateau principal)
- [ ] Composant ScoreBoard (tableau des scores)
- [ ] Composant Timer

## Phase 7 : Animations des Cartes (Framer Motion)
- [ ] Animation pioche → main (joueur actif, avec flip)
- [ ] Animation pioche → zone (autres joueurs, sans flip)
- [ ] Animation main → défausse (joueur actif, visible)
- [ ] Animation main → défausse (autres joueurs, se retourne)

## Phase 8 : Multijoueur Temps Réel (Supabase)
- [ ] Edge Function: create-game
- [ ] Edge Function: join-game
- [ ] Edge Function: start-game
- [ ] Edge Function: validate-action
- [ ] Supabase Realtime pour synchronisation
- [ ] Gestion des tours de jeu

## Phase 9 : IA et Timer
- [ ] Logique d'IA basique (Edge Function)
- [ ] Timer avec compte à rebours
- [ ] Action automatique si timeout

## Phase 10 : Historique et Rejeu
- [ ] Page Historique avec liste des parties
- [ ] Statistiques globales
- [ ] Système de rejeu avec contrôles
- [ ] Timeline interactive

## Phase 11 : Sécurité
- [ ] Chiffrement des mains des joueurs
- [ ] Validation côté serveur de toutes les actions
- [ ] Row Level Security (RLS) policies
- [ ] Protection contre l'inspection

## Phase 12 : Polish et Tests
- [ ] Tests de lint
- [ ] Vérification des animations
- [ ] Tests multijoueurs
- [ ] Optimisation des performances

## Fichiers à Créer (8 fichiers maximum pour MVP)

### Fichiers Principaux (Core)
1. **src/types/game.types.ts** - Types TypeScript complets
2. **src/constants/gameRules.ts** - Règles et constantes du jeu
3. **src/lib/gameLogic.ts** - Logique métier du jeu (deck, validation, scoring)
4. **src/stores/gameStore.ts** - Store Zustand pour l'état du jeu

### Pages
5. **src/pages/MainMenu.tsx** - Menu principal avec 4 boutons
6. **src/pages/GamePage.tsx** - Page de jeu complète (simplifié pour MVP)

### Composants Essentiels
7. **src/components/game/Card.tsx** - Composant carte avec animations
8. **src/components/game/GameBoard.tsx** - Plateau de jeu complet

## Notes d'Implémentation MVP
- Prioriser la fonctionnalité sur la perfection
- Créer une version jouable en local d'abord
- Ajouter Supabase après validation de la logique
- Simplifier les animations pour le MVP
- Utiliser localStorage pour le profil temporairement

**to update**