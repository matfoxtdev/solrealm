# ⚔️ SolRealm — Solana-Powered Multiplayer RPG

A multiplayer 3D top-down RPG built with **Babylon.js**, **Colyseus**, and **Solana** wallet integration.

![SolRealm](https://img.shields.io/badge/Solana-Devnet-9945FF?style=for-the-badge&logo=solana)
![Babylon.js](https://img.shields.io/badge/Babylon.js-8.x-orange?style=for-the-badge)
![Colyseus](https://img.shields.io/badge/Colyseus-0.15-blue?style=for-the-badge)

## 🎮 Features

- **Multiplayer 3D RPG** — Real-time combat, movement, chat, inventory, quests
- **Phantom Wallet Login** — Authenticate with your Solana wallet
- **Guest Mode** — Quick play without a wallet
- **SOL Balance Display** — See your balance in-game
- **On-Chain Marketplace** *(Coming Soon)* — Trade items, wager SOL in PvP
- **Dark Neon Theme** — Purple/green cyberpunk aesthetic

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- [Phantom Wallet](https://phantom.app) browser extension (optional, for wallet features)

### 1. Clone & Install

```bash
git clone https://github.com/matfoxtdev/solrealm.git
cd solrealm
cp .env.example .env
npm install
```

### 2. Start the Game Server

The Colyseus multiplayer server runs on port 3000:

```bash
npm run server-dev
```

### 3. Start the Client (Dev)

In a separate terminal:

```bash
npm run client-dev
```

Opens at `http://localhost:8080`

### 4. Play!

- **With Wallet:** Click "Connect Phantom Wallet" → sign the auth message → play
- **Without Wallet:** Click "Quick Play (Guest)" or use username/password

## 🏗️ Project Structure

```
solrealm/
├── src/
│   ├── client/              # Babylon.js frontend
│   │   ├── Screens/         # Login, Character Select, Game scenes
│   │   ├── Controllers/     # Game logic, UI, Network, Assets
│   │   ├── Entities/        # Player, Enemy, Item entities
│   │   ├── Solana/          # WalletManager (Phantom integration)
│   │   └── index.ts         # Client entry point
│   ├── server/              # Colyseus multiplayer server
│   │   ├── rooms/           # Game rooms, schemas, controllers
│   │   ├── data/            # Items, quests, abilities databases
│   │   └── index.ts         # Server entry point
│   └── shared/              # Shared types, config, utilities
│       └── Config.ts        # Game configuration
├── public/                  # Static assets (3D models, textures, sounds)
├── webpack.common.js        # Webpack shared config
├── webpack.dev.js           # Webpack dev config
├── webpack.prod.js          # Webpack production config
├── vercel.json              # Vercel deployment config (client only)
└── .env.example             # Environment variables template
```

## 🌐 Deployment

### Client (Vercel)

```bash
npm run client-build
# Deploy dist/client/ to Vercel
vercel --prod
```

> **Note:** Update the WebSocket URL in `src/client/Utils/index.ts` to point to your production server.

### Server (VPS / Railway / Fly.io)

The Colyseus server needs a persistent WebSocket connection and cannot run on Vercel.

```bash
npm run server-build
npm run server-start
```

Recommended: Deploy to Railway, Fly.io, Render, or any VPS with Node.js support.

## ⛓️ Solana Integration

| Feature | Status |
|---------|--------|
| Phantom Wallet Connect | ✅ Ready |
| Wallet-based Auth | ✅ Ready |
| SOL Balance Display | ✅ Ready |
| Guest Mode (no wallet) | ✅ Ready |
| On-chain Marketplace | 🔜 Coming Soon |
| NFT Item Minting | 🔜 Coming Soon |
| SOL PvP Wagers | 🔜 Coming Soon |

## 🛠️ Tech Stack

- **Engine:** Babylon.js 8.x (WebGL 3D rendering)
- **Multiplayer:** Colyseus 0.15 (real-time rooms & state sync)
- **Blockchain:** Solana (devnet) + Phantom wallet adapter
- **Build:** Webpack 5 + TypeScript
- **Database:** SQLite (dev) / MySQL (prod)

## 📝 License

MIT — Based on [t5c](https://github.com/orion3dgames/t5c) by Orion3d.
