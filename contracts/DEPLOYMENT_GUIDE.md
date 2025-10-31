# Campaign V2 Deployment Guide

## What's New in V2?

✨ **Campaign Deletion with Automatic Refunds**
- Managers can close campaigns and automatically refund ALL contributors
- Individual contribution tracking for accurate refunds
- Campaign closure status tracking
- Events for all major actions

## New Features

### 1. **Close Campaign & Refund**
```solidity
function closeCampaignAndRefund() public restricted notClosed
```
- Only manager can call
- Automatically refunds ALL contributors their exact contribution amount
- Marks campaign as permanently closed
- Emits CampaignClosed event with total refunded amount

### 2. **Individual Contribution Tracking**
```solidity
mapping(address => uint) public contributions;
address[] public contributorsList;
```
- Tracks exact amount each person contributed
- Enables accurate refunds
- Prevents over-counting if someone contributes multiple times

### 3. **Campaign Status**
```solidity
bool public isClosed;
```
- Prevents new contributions after closure
- Prevents new requests after closure
- Cannot be reopened once closed

### 4. **Emergency Withdrawal**
```solidity
function emergencyWithdraw() public restricted
```
- Manager can withdraw remaining balance after campaign is closed
- Safety net for any remaining funds

## Deployment Instructions

### Step 1: Install Dependencies

```bash
cd C:\Users\siddh\OneDrive\Desktop\EthereumCasts\modern-crowdfund
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
```

### Step 2: Create Hardhat Config

Create `hardhat.config.js`:

```javascript
require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.20",
  networks: {
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY",
      accounts: ["YOUR_PRIVATE_KEY"] // MetaMask private key
    }
  }
};
```

### Step 3: Compile Contract

```bash
npx hardhat compile
```

### Step 4: Create Deployment Script

Create `scripts/deploy.js`:

```javascript
async function main() {
  const CampaignFactoryV2 = await ethers.getContractFactory("CampaignFactoryV2");

  console.log("Deploying CampaignFactoryV2...");
  const factory = await CampaignFactoryV2.deploy();
  await factory.waitForDeployment();

  const address = await factory.getAddress();
  console.log("CampaignFactoryV2 deployed to:", address);
  console.log("Save this address! You'll need it to update your frontend.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

### Step 5: Deploy to Sepolia

```bash
npx hardhat run scripts/deploy.js --network sepolia
```

**SAVE THE ADDRESS!** You'll get something like:
```
CampaignFactoryV2 deployed to: 0x1234567890abcdef1234567890abcdef12345678
```

### Step 6: Update Frontend Configuration

Update `config/contracts.ts`:

```typescript
// OLD (current contract without delete)
export const FACTORY_ADDRESS = '0x3015522014338929E2c7ddc438df092b993eFF38';

// NEW (V2 with delete functionality)
export const FACTORY_ADDRESS = '0xYOUR_NEW_DEPLOYED_ADDRESS';
```

### Step 7: Update ABI

Replace the ABIs in `config/contracts.ts` with the new ones from `artifacts/contracts/CampaignV2.sol/`

## Alternative: Simple Remix Deployment

### Option 1: Use Remix IDE (Easiest)

1. Go to https://remix.ethereum.org
2. Create new file: `CampaignV2.sol`
3. Copy the contract code from `contracts/CampaignV2.sol`
4. Click "Compile CampaignV2.sol"
5. Go to "Deploy & Run Transactions"
6. Select "Injected Provider - MetaMask"
7. Make sure MetaMask is on Sepolia network
8. Deploy "CampaignFactoryV2"
9. Copy the deployed address

### Option 2: Use Existing Kickstart Setup

If you used the kickstart project before:

```bash
cd C:\Users\siddh\OneDrive\Desktop\EthereumCasts\kickstart

# Copy new contract
cp ../modern-crowdfund/contracts/CampaignV2.sol ethereum/contracts/

# Compile
node ethereum/compile.js

# Deploy
node ethereum/deploy.js
```

## What to Do After Deployment

1. **Update Contract Address**
   - File: `modern-crowdfund/config/contracts.ts`
   - Change `FACTORY_ADDRESS` to your new deployed address

2. **Update ABIs**
   - Copy new ABI from compilation artifacts
   - Update both `FACTORY_ABI` and `CAMPAIGN_ABI`

3. **Test on Sepolia**
   - Create a test campaign
   - Add a small contribution
   - Close the campaign as manager
   - Verify refund was received

4. **Announce to Users**
   - Old campaigns at `0x3015...` still work but can't be deleted
   - New campaigns will support deletion/refunds
   - Users can migrate by creating new campaigns

## Contract Differences

### OLD Contract (No Delete)
```solidity
// Cannot close campaigns
// Cannot refund contributors
// Contributions not tracked individually
// No closure status
```

### NEW Contract V2 (With Delete)
```solidity
✅ closeCampaignAndRefund() - Close & refund all
✅ Individual contribution tracking
✅ isClosed status flag
✅ emergencyWithdraw() for remaining funds
✅ Events for transparency
✅ Prevents actions on closed campaigns
```

## Important Notes

⚠️ **Breaking Changes:**
- New contract has different address
- Existing campaigns cannot be deleted (they use old contract)
- Users will need to use the new factory to create deletable campaigns

💡 **Best Practice:**
- Keep both contracts running temporarily
- Let users know new features are available
- Migrate important campaigns gradually

🔒 **Security:**
- Only manager can close campaigns
- Automatic refunds prevent manager from keeping funds
- Events provide full transparency
- Cannot reopen closed campaigns

## Need Help?

If deployment fails:
1. Check MetaMask is connected to Sepolia
2. Verify you have enough Sepolia ETH (get from faucet)
3. Check your API key in hardhat.config.js
4. Make sure Solidity version is 0.8.0 or higher

## Summary

With the new V2 contract, managers can:
1. Click "Close Campaign" button
2. All contributors automatically get refunded
3. Campaign is marked as closed forever
4. No new contributions or requests possible

This solves your issue! 🎉
