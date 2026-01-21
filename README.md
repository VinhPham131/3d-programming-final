# 💀 Escape the Nightmare 💀

A 3D horror puzzle game built with React and Three.js. Navigate through multiple rooms, solve deadly puzzles, collect keys, and escape before time runs out!

## 📋 Project Overview

**Escape the Nightmare** is an immersive first-person 3D puzzle game where players must:
- Navigate through procedurally generated rooms
- Solve various puzzle types (color, number, pattern, hidden objects)
- Collect keys to unlock doors between rooms
- Survive NPC encounters in later rooms
- Race against the clock to complete all rooms

The game features a dark, atmospheric environment with FPS-style controls, dynamic lighting, interactive objects, and a save system that allows players to resume their progress.

## 🛠️ Technology Used

### Core Technologies
- **React** `^19.2.3` - UI framework
- **Three.js** `^0.182.0` - 3D graphics and rendering
- **TypeScript** `^4.9.5` - Type-safe JavaScript
- **React Scripts** `5.0.1` - Build tooling (Create React App)

### Additional Libraries
- **@types/three** `^0.182.0` - TypeScript definitions for Three.js
- **web-vitals** `^2.1.4` - Performance metrics
- **yaml** `^2.8.2` - YAML parsing
- **gh-pages** `^6.3.0` - GitHub Pages deployment

### Testing
- **@testing-library/react** `^16.3.1`
- **@testing-library/jest-dom** `^6.9.1`
- **@testing-library/user-event** `^13.5.0`

## 🎮 Features

### Gameplay
- **Multiple Puzzle Types**: Number puzzles, color matching, pattern recognition, hidden object searches
- **FPS Controls**: WASD movement with mouse look
- **Interactive System**: Raycasting for object interaction
- **Progressive Difficulty**: Puzzles increase in complexity through rooms
- **Timer System**: Limited time to complete all rooms
- **NPC Companions**: AI companions join in later rooms

### Technical Features
- **3D Room Generation**: Procedurally generated room layouts
- **Dynamic Lighting**: Realistic lighting system for atmosphere
- **Audio Management**: Background music and sound effects
- **Save System**: LocalStorage-based save/load functionality
- **HUD System**: Real-time game information display
- **Responsive Design**: Adapts to window resizing

## 🚀 How to Set Up the Project

### Prerequisites
- **Node.js** (v14 or higher recommended)
- **npm** (comes with Node.js) or **yarn**

### Installation Steps

1. **Clone the repository** (or navigate to the project directory)
   ```bash
   cd "3D final"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run start
   ```
   The app will open in your browser at `http://localhost:3000`

4. **Build for production**
   ```bash
   npm run build
   ```
   Creates an optimized production build in the `build/` folder

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner in interactive watch mode
- `npm run build` - Builds the app for production
- `npm run typecheck` - Runs TypeScript type checking without emitting files
- `npm run test:ci` - Runs tests in CI mode (non-interactive)

## 🎯 How to Play

### Controls
- **WASD** - Move (forward, left, backward, right)
- **Mouse** - Look around / rotate camera
- **E** - Interact with puzzles and objects
- **R** - Restart game (when game over)
- **Click** - Start game from overlay / lock pointer

### Gameplay Flow
1. Click to start the game from the main menu
2. Navigate through rooms using WASD and mouse
3. Find and interact with puzzles using the **E** key
4. Solve puzzles to spawn keys
5. Collect keys to unlock the door
6. Walk through the door to progress to the next room
7. Complete all rooms before time runs out!

### Tips
- Look for interactable objects highlighted when nearby
- Each room has a different puzzle type
- NPCs join you starting from room 3
- Save points allow you to resume from your last room
- Watch the timer in the HUD!

## 📁 Project Structure

```
3D final/
├── public/                 # Static assets
├── src/
│   ├── audio/             # Audio management
│   │   └── audioManager.ts
│   ├── constants/         # Game constants
│   │   └── constant.ts
│   ├── controls/          # Player controls
│   │   └── fpsControls.ts
│   ├── core/              # Core game systems
│   │   ├── camera.ts
│   │   ├── lights.ts
│   │   ├── renderer.ts
│   │   ├── room.ts
│   │   ├── roomManager.ts
│   │   ├── saveManager.ts
│   │   └── scene.ts
│   ├── hud/               # Heads-up display
│   │   └── hud.ts
│   ├── interaction/       # Interaction system
│   │   └── raycaster.ts
│   ├── interface/         # UI components
│   │   └── interface.ts
│   ├── objects/           # Game objects
│   │   ├── door.ts
│   │   ├── furniture.ts
│   │   ├── keyManager.ts
│   │   └── npc.ts
│   ├── puzzle/            # Puzzle system
│   │   ├── inventory.ts
│   │   ├── puzzleManager.ts
│   │   └── puzzleState.ts
│   ├── App.tsx            # Main React component
│   ├── main.ts            # Game entry point
│   └── index.tsx          # React entry point
├── build/                 # Production build output
├── package.json           # Dependencies and scripts
└── tsconfig.json          # TypeScript configuration
```

## 🔧 Configuration

### Environment Setup
The project uses Create React App's default configuration. Key settings:
- TypeScript strict mode enabled
- React 19 with JSX transform
- ES5 target with modern lib support

### Deployment
The project is configured for GitHub Pages deployment:
```bash
npm run build
# Deploy the build/ folder to GitHub Pages
```

Homepage is configured in `package.json` as: `https://vinhpham131.github.io/3d-programming-final`

## 🐛 Troubleshooting

### Common Issues

**Port 3000 already in use:**
```bash
# Kill the process or use a different port
PORT=3001 npm start
```

**TypeScript errors:**
```bash
# Check for type errors
npm run typecheck
```

**Build fails:**
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear npm cache: `npm cache clean --force`

## 📝 Development Notes

- The game uses Three.js for all 3D rendering
- React is used primarily for the UI overlay and game state management
- Game logic is primarily in TypeScript modules (not React components)
- Save system uses browser LocalStorage
- Audio context requires user interaction before playing

**Enjoy the nightmare! 🎃**
