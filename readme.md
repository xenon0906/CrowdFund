# FundChain - Decentralized Crowdfunding Platform

A modern, transparent, and secure blockchain-powered crowdfunding platform built on Ethereum. Create campaigns, contribute funds, and vote on spending decisions with complete transparency.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![Ethereum](https://img.shields.io/badge/Ethereum-Sepolia-purple)

## Features

- **Blockchain-Powered**: Built on Ethereum with smart contracts for complete transparency
- **Democratic Voting**: Contributors vote on spending requests (>50% approval required)
- **Mobile-First PWA**: Install as an app on mobile devices with offline support
- **Global Performance**: Deployed across 11 edge regions for fast worldwide access
- **Secure**: Content Security Policy, XSS protection, rate limiting, and input validation
- **Modern UI**: Glass morphism design with smooth animations using Framer Motion
- **MetaMask Integration**: Seamless wallet connection on desktop and mobile
- **Real-time Updates**: Live blockchain data with automatic syncing

## Tech Stack

**Frontend:**
- Next.js 16 with Turbopack
- React 19
- TypeScript 5.9
- Tailwind CSS 3.4
- Framer Motion 12

**Blockchain:**
- Ethereum Sepolia Testnet
- Ethers.js v6
- Smart Contracts (Solidity 0.4.17)
- Factory Contract: `0x3015522014338929E2c7ddc438df092b993eFF38`

**Deployment:**
- Vercel Edge Functions
- Global CDN across 11 regions
- Progressive Web App (PWA)
- Service Worker for offline support

## Quick Start

### Prerequisites

- Node.js 18+ installed
- MetaMask browser extension
- Sepolia ETH for testing (get free test ETH from [Google Cloud Faucet](https://cloud.google.com/application/web3/faucet/ethereum/sepolia))

### Installation

```bash
# Clone the repository
git clone https://github.com/xenon0906/CrowdFund.git
cd CrowdFund

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Add your RPC URL to .env.local
# Get a free API key from https://www.alchemy.com
```

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_FACTORY_ADDRESS=0x3015522014338929E2c7ddc438df092b993eFF38
NEXT_PUBLIC_NETWORK_ID=11155111
NEXT_PUBLIC_NETWORK_NAME=Sepolia
NEXT_PUBLIC_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY_HERE
```

### Development

```bash
# Run development server
npm run dev

# Open http://localhost:3001
```

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

## Deployment to Vercel

1. Push your code to GitHub
2. Import project in [Vercel Dashboard](https://vercel.com)
3. Add environment variables in Vercel:
   - `NEXT_PUBLIC_FACTORY_ADDRESS`
   - `NEXT_PUBLIC_NETWORK_ID`
   - `NEXT_PUBLIC_NETWORK_NAME`
   - `NEXT_PUBLIC_RPC_URL` (your Alchemy/Infura API key)
4. Deploy!

## How It Works

1. **Create Campaign**: Set minimum contribution and describe your project
2. **Contribute**: Support campaigns with Sepolia ETH
3. **Create Spending Request**: Campaign managers request fund withdrawals
4. **Vote**: Contributors approve or reject spending requests
5. **Finalize**: Approved requests (>50% votes) release funds to recipients

## Project Structure

```
modern-crowdfund/
├── pages/              # Next.js pages and API routes
│   ├── index.tsx       # Campaign list homepage
│   ├── create.tsx      # Create new campaign
│   ├── getting-started.tsx
│   ├── how-it-works.tsx
│   ├── campaigns/[address].tsx
│   └── api/            # API endpoints
├── components/         # React components
│   ├── Navbar.tsx
│   ├── CampaignCard.tsx
│   └── LazyImage.tsx
├── hooks/              # Custom React hooks
│   ├── useWeb3.tsx     # Web3 provider
│   └── useMobileWallet.tsx
├── config/             # Configuration
│   └── contracts.ts    # Contract ABIs and addresses
├── utils/              # Utility functions
│   ├── validation.ts
│   └── performance.ts
├── public/             # Static assets
│   ├── manifest.json   # PWA manifest
│   └── service-worker.js
└── styles/             # Global styles
    └── globals.css
```

## Smart Contract

The platform uses two smart contracts deployed on Sepolia testnet:

**Factory Contract** (`0x3015522014338929E2c7ddc438df092b993eFF38`):
- Creates new campaign instances
- Tracks all deployed campaigns
- Provides campaign discovery

**Campaign Contract**:
- Manages contributions
- Handles spending requests
- Processes voting
- Enforces democratic rules

## Security Features

- Content Security Policy (CSP) headers
- XSS protection
- CSRF prevention
- Rate limiting on API endpoints
- Input validation and sanitization
- Secure headers (HSTS, X-Frame-Options, etc.)
- No sensitive data in client-side code

## Performance Optimizations

- Edge Functions across 11 global regions
- Static asset caching (1 year TTL)
- Image optimization (AVIF/WebP)
- Code splitting and lazy loading
- Service Worker caching
- Connection pooling for RPC calls
- Request deduplication

## PWA Features

- Install as mobile/desktop app
- Offline functionality
- Push notifications
- App shortcuts
- Share target integration
- Background sync

## Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Developer

**Siddhanth**
Full Stack Blockchain Developer

GitHub: [@xenon0906](https://github.com/xenon0906)

## Acknowledgments

- Built with Next.js and React
- Smart contracts powered by Ethereum
- UI components styled with Tailwind CSS
- Animations by Framer Motion
- Web3 integration via Ethers.js

## Support

For issues and questions:
- Open an issue on GitHub
- Check the documentation in `/complete details.md`
- Review the `/viva.md` for common Q&A

## Links

- Live Demo: [fundchain.vercel.app](https://fundchain.vercel.app)
- Network: Sepolia Testnet
- Get Test ETH: [Google Cloud Faucet](https://cloud.google.com/application/web3/faucet/ethereum/sepolia)
- Block Explorer: [Sepolia Etherscan](https://sepolia.etherscan.io/)

---

Made with ❤️ using blockchain technology for a transparent future