# Lucky Casino Slot Machine

A feature-rich, interactive slot machine game built using modern web technologies. This casino-styled game offers both guest play and user authentication, credit persistence, and realistic slot machine mechanics with a touch of "house advantage" logic.

## 🎰 Features

- **Immersive Casino Experience**
  - Beautifully styled UI with animations and SVG game symbols
  - Realistic slot machine mechanics with spinning and reveal animations
  - Casino-themed components with gold frames and light effects

- **User Account System**
  - Secure user authentication with SHA-256 password hashing
  - Persistent credit system across sessions
  - Guest play option with easy registration flow
  - Seamless session transfer from guest to registered user

- **Advanced Game Mechanics**
  - Different payout rates based on symbol combinations
  - "House advantage" logic that adjusts win probability based on credit balance
  - Playful "mischievous" CashOut button that tries to escape high-balance players
  - Roll count requirement before cashing out is allowed

- **State Persistence**
  - Credit tracking for registered users across sessions
  - Local storage for session persistence during page refreshes
  - Database storage for long-term user data

## 🛠️ Technical Architecture

### Frontend
- **React 18 with Next.js 15**: Using the App Router for efficient server and client rendering
- **TypeScript**: For strong typing and better code quality
- **Tailwind CSS**: For responsive and efficient styling
- **Context API**: For global state management (user session, game state)
- **Custom Hooks**: For reusable game logic and data fetching
- **Client-Side Animations**: For slot machine spinning effect

### Backend
- **Next.js API Routes**: Server-side API implementation
- **Prisma ORM**: For type-safe database access
- **SQLite Database**: For data persistence
- **Server Actions**: For secure server-side operations
- **Password Hashing**: With industry-standard SHA-256 algorithm

### State Management
- **React Context**: For global game state
- **LocalStorage**: For session persistence across page refreshes
- **Reducer Pattern**: For predictable state updates

## 🎮 Game Logic

1. **User Authentication**
   - Users can play as guests or create accounts
   - Registered users play with their account balance
   - Guest users always start with 10 credits

2. **Slot Machine Mechanics**
   - Three-reel slot machine with timed reveals
   - Four symbols with different payout values:
     - 🍒 Cherry: 10 credits
     - 🍋 Lemon: 20 credits
     - 🍊 Orange: 30 credits
     - 🍉 Watermelon: 40 credits
   - Each roll costs 1 credit

3. **House Advantage**
   - Win probability decreases as your balance increases
   - CashOut button has "mischievous" behavior with high balances
   - Minimum roll count requirement before cashing out

4. **Credit System**
   - Credits transfer between account and game session
   - Cashout transfers game credits to user account
   - User must log in again after cashing out (security feature)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

1. Clone the repository
```bash
git clone https://github.com/AlejandroChing11/slot-machine.git
cd slot-machine
```

2. Install dependencies
```bash
npm install
```

3. Set up the database
```bash
npx prisma migrate dev
```

4. Start the development server
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📚 Code Structure

- `/app`: Next.js application routes and API endpoints
  - `/api`: Server-side API routes for game operations
  - `/auth`: Authentication-related API routes
- `/components`: React components
  - `GameContext.tsx`: Global state management
  - `SlotMachine.tsx`: Main slot machine component
  - `UserLogin.tsx`: Authentication UI
- `/lib`: Utility functions and shared code
  - `types.ts`: TypeScript type definitions
  - `auth.ts`: Authentication utilities
  - `localStorage.ts`: Browser storage utilities
- `/prisma`: Database schema and migration files

## 🔍 Key Components

### GameContext
Central state management using React Context API with a reducer pattern for predictable state updates. Handles:
- User session management
- Game state (credits, symbols, roll count)
- API communication
- LocalStorage persistence

### SlotMachine
Core game component that displays the slot reels and handles animations. Features:
- Timed reveal of symbols
- Spinning animation
- Dynamic symbol display

### CashoutButton
Interactive button with special behaviors:
- Validates minimum roll requirements
- "Mischievous" behavior for high-balance players
- Animated movements and state changes

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Database by [Prisma](https://www.prisma.io/)
- Icons from [Lucide](https://lucide.dev/)
