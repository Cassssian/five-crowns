# Project Summary
The project is a digital card game called "Five Crowns," designed to provide an engaging multiplayer experience. Players navigate through various game rounds, utilizing a unique deck of cards with variable jokers and scoring systems. The platform features smooth animations and a user-friendly interface, making it accessible for both casual and avid gamers. Recent updates have enhanced the lobby system, allowing players to customize their profiles, manage game settings, and join ongoing games.

# Project Module Description
The project consists of several functional modules:
- **Game Logic**: Manages deck creation, shuffling, dealing, and scoring.
- **User Interface**: Interactive components for the game board, player scores, and card management.
- **State Management**: Utilizes Zustand for efficient state handling across the application.
- **Animations**: Incorporates Framer Motion for smooth transitions and effects.
- **Routing**: Facilitates navigation between the main menu, lobby, game pages, and available games.

# Directory Tree
```
shadcn-ui/
├── README.md               # Project overview and setup instructions
├── package.json            # Project dependencies and scripts
├── src/                    # Source code directory
│   ├── components/         # UI components for the game
│   ├── constants/          # Game rules and constants
│   ├── hooks/              # Custom hooks for functionality
│   ├── lib/                # Game logic and utility functions
│   ├── pages/              # Application pages (MainMenu, GamePage, Lobby, Join)
│   ├── stores/             # Zustand state management
│   └── types/              # TypeScript types for the game
├── tailwind.config.ts      # Tailwind CSS configuration
└── vite.config.ts          # Vite configuration for building the project
```
**to update*

# File Description Inventory
- **README.md**: Contains setup instructions and project overview.
- **package.json**: Lists dependencies and scripts for running the project.
- **src/components/**: Contains all UI components, such as buttons, cards, and dialogs.
- **src/pages/**: Defines the main application pages, including the game interface and lobby.
- **src/lib/**: Includes core game logic and utility functions.
- **src/stores/**: Manages application state using Zustand.
- **src/hooks/**: Custom hooks for managing component logic and state.

# Technology Stack
- **React**: Frontend library for building user interfaces.
- **TypeScript**: For type safety and better development experience.
- **Zustand**: State management solution.
- **Framer Motion**: For animations and transitions.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **Vite**: Build tool for fast development and bundling.
- 
**to update too*

# Usage
To set up the project, follow these steps:
1. Install dependencies:
   ```bash
   npm install
   ```
2. Build the project:
   ```bash
   npm run build
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
