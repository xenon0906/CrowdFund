# Complete Deployment Guide for Modern CrowdFund DApp

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Setting Up MetaMask Wallet](#setting-up-metamask-wallet)
3. [Getting Sepolia Test ETH](#getting-sepolia-test-eth)
4. [Smart Contract Deployment](#smart-contract-deployment)
5. [Frontend Setup](#frontend-setup)
6. [Online Hosting](#online-hosting)
7. [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Software
- Node.js (v18 or higher)
- npm or yarn package manager
- Git
- MetaMask browser extension
- Code editor (VS Code recommended)

### Accounts Needed
- GitHub account (for deployment)
- Alchemy account (for blockchain RPC)
- Vercel account (for hosting)

## Setting Up MetaMask Wallet

### Step 1: Install MetaMask
1. Visit https://metamask.io
2. Click "Download" and select your browser
3. Install the extension
4. Click the MetaMask icon in your browser toolbar

### Step 2: Create New Wallet
1. Click "Get Started"
2. Select "Create a Wallet"
3. Agree to the terms
4. Create a strong password
5. **IMPORTANT**: Write down your 12-word recovery phrase
   - Store it safely offline
   - Never share it with anyone
   - You'll need it to recover your wallet

### Step 3: Connect to Sepolia Network
1. Click the network dropdown (usually shows "Ethereum Mainnet")
2. Click "Show/hide test networks"
3. Turn on "Show test networks"
4. Select "Sepolia test network"

## Getting Sepolia Test ETH

### Method 1: Alchemy Faucet
1. Visit https://sepoliafaucet.com
2. Create an Alchemy account if you don't have one
3. Enter your wallet address
4. Complete the captcha
5. Click "Send Me ETH"
6. Wait 10-30 seconds for ETH to arrive

### Method 2: Alternative Faucets
- https://faucet.quicknode.com/ethereum/sepolia
- https://faucets.chain.link/sepolia
- https://sepolia-faucet.pk910.de

### Verify Balance
1. Open MetaMask
2. Ensure "Sepolia" network is selected
3. You should see your ETH balance (0.05-0.1 ETH is sufficient)

## Smart Contract Deployment

### Step 1: Clone the Repository
```bash
git clone https://github.com/yourusername/EthereumCasts.git
cd EthereumCasts/kickstart
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure Deployment
1. Create `.env` file in kickstart directory:
```env
PRIVATE_KEY=your_wallet_private_key_here
ALCHEMY_API_KEY=your_alchemy_api_key_here
```

2. Get your private key from MetaMask:
   - Click account icon → Settings → Security & Privacy
   - Click "Show private key"
   - Enter password and copy

3. Get Alchemy API key:
   - Visit https://www.alchemy.com
   - Create new app for Sepolia network
   - Copy the API key

### Step 4: Deploy Contract
```bash
cd ethereum
node deploy-sepolia.js
```

Expected output:
```
Attempting to deploy from account: 0x9884ac...
Contract deployed to: 0x3015522014338929E2c7ddc438df092b993eFF38
```

### Step 5: Update Factory Address
Edit `ethereum/factory.js`:
```javascript
const address = '0x3015522014338929E2c7ddc438df092b993eFF38';
```

## Frontend Setup

### Step 1: Navigate to Modern App
```bash
cd ../modern-crowdfund
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure Contract
Edit `config/contracts.ts`:
```typescript
export const FACTORY_ADDRESS = 'YOUR_DEPLOYED_CONTRACT_ADDRESS';
export const RPC_URL = 'YOUR_ALCHEMY_RPC_URL';
```

### Step 4: Run Development Server
```bash
npm run dev
```

Visit http://localhost:3001

## Online Hosting

### Option 1: Vercel (Recommended)
1. Push code to GitHub
2. Visit https://vercel.com
3. Import your GitHub repository
4. Configure:
   - Framework: Next.js
   - Root Directory: modern-crowdfund
   - Build Command: `npm run build`
   - Install Command: `npm install`
5. Add environment variables:
   - `NEXT_PUBLIC_FACTORY_ADDRESS`
   - `NEXT_PUBLIC_RPC_URL`
6. Deploy

### Option 2: Netlify
1. Build locally:
```bash
npm run build
npm run export
```

2. Drag and drop `out` folder to Netlify

### Option 3: Self-Hosting
1. Build the application:
```bash
npm run build
```

2. Start production server:
```bash
npm start
```

3. Use PM2 for process management:
```bash
npm install -g pm2
pm2 start npm --name "crowdfund" -- start
```

## Environment Variables for Production

Create `.env.production`:
```env
NEXT_PUBLIC_FACTORY_ADDRESS=0x3015522014338929E2c7ddc438df092b993eFF38
NEXT_PUBLIC_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY
NEXT_PUBLIC_NETWORK_ID=11155111
```

## Testing the Deployed Application

### 1. Connect Wallet
- Click "Connect Wallet" button
- Approve MetaMask connection
- Ensure Sepolia network is selected

### 2. Create a Campaign
- Click "Create Campaign"
- Enter minimum contribution (e.g., 100 wei)
- Submit and confirm in MetaMask
- Wait for transaction confirmation

### 3. Contribute to Campaign
- View any campaign
- Enter contribution amount in ETH
- Click "Contribute"
- Confirm in MetaMask

### 4. Create Spending Request (Manager Only)
- As campaign creator, click "New Request"
- Enter description, amount, and recipient
- Submit and confirm

### 5. Vote on Requests
- Contributors can approve requests
- Need >50% approval for execution

## Troubleshooting

### Common Issues and Solutions

#### 1. MetaMask Not Connecting
- Ensure MetaMask is unlocked
- Check correct network (Sepolia)
- Clear browser cache
- Try different browser

#### 2. Transaction Failures
- Check sufficient ETH balance
- Increase gas limit
- Wait for network congestion to clear
- Verify contract address

#### 3. Contract Not Loading
- Verify RPC URL is correct
- Check contract address
- Ensure ABI matches deployed contract
- Check network connectivity

#### 4. Build Errors
- Delete `node_modules` and `.next`
- Run `npm install` again
- Check Node.js version (v18+)
- Verify all dependencies

#### 5. Deployment Failures
- Ensure sufficient ETH for gas
- Check private key format
- Verify Alchemy API key
- Try different RPC endpoint

## Security Best Practices

1. **Never Share Private Keys**
   - Use environment variables
   - Add `.env` to `.gitignore`
   - Use secure key management

2. **Audit Smart Contracts**
   - Test thoroughly on testnet
   - Get professional audit for mainnet
   - Use established patterns

3. **Frontend Security**
   - Validate all inputs
   - Use HTTPS in production
   - Implement rate limiting
   - Add CORS protection

4. **Wallet Security**
   - Use hardware wallets for mainnet
   - Enable 2FA where possible
   - Regular security updates

## Maintenance

### Regular Updates
```bash
# Update dependencies
npm update

# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix
```

### Monitoring
- Set up error tracking (Sentry)
- Monitor gas prices
- Track transaction success rates
- Watch for contract events

## Support Resources

- **Documentation**: https://docs.ethers.io
- **MetaMask Support**: https://support.metamask.io
- **Sepolia Faucet**: https://sepoliafaucet.com
- **Alchemy Docs**: https://docs.alchemy.com
- **Next.js Docs**: https://nextjs.org/docs

## Conclusion

You now have a fully deployed decentralized crowdfunding application! The platform is:
- Deployed on Sepolia testnet
- Accessible via web browser
- Fully decentralized
- Transparent and secure

For production deployment on Ethereum mainnet, ensure:
- Professional smart contract audit
- Comprehensive testing
- Legal compliance review
- Proper key management