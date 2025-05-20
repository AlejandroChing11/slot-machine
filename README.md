# Slot Machine Game

A fun casino-style slot machine game built with Next.js, React, and Prisma.

## Features

- Casino-styled UI with animations and SVG icons
- User authentication with email/password
- Account registration and login system
- Real-time credit tracking for registered users
- Guest play option for trying the game
- Server-side session tracking
- Rigged win rates at higher credit levels (the house always wins!)
- Database persistence for users and game sessions
- Responsive design that works on mobile and desktop

## How to Play

1. Register an account or play as a guest
2. Each roll costs 1 credit
3. Match 3 symbols to win:
   - 🍒 Cherry: 10 credits
   - 🍋 Lemon: 20 credits
   - 🍊 Orange: 30 credits
   - 🍉 Watermelon: 40 credits
4. Registered users can cash out their winnings to their account
5. Guests need to register before cashing out

## Technical Details

- Built with Next.js 14 and React
- TypeScript for type safety
- Tailwind CSS for styling
- Prisma ORM with SQLite database
- Server-side API routes
- Client-side state management with Context API
- Persistent storage with localStorage
- Password authentication with SHA-256 hashing

## Getting Started

1. Clone the repository
2. Install dependencies with `npm install`
3. Run database migrations with `npx prisma migrate dev`
4. Start the development server with `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Database Schema

- **User**: Stores user accounts with credits
- **GameSession**: Tracks active game sessions and roll history

## Default Accounts

The system automatically creates a guest account with the following credentials:
- Email: guest@example.com
- Password: guest123

You can use this to test the login functionality or create your own account.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
