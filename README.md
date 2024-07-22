# Staking and Borrowing DApp on CoreDao Testnet

## Overview
This Staking and Borrowing DApp is built on the CoreDao blockchain to facilitate decentralized finance operations such as staking tokens to earn rewards and borrowing tokens against staked assets. The platform ensures transparency, security, and efficiency by leveraging blockchain technology.

## Features

Token Staking: Users can stake their tokens to earn rewards.

Token Borrowing: Users can borrow tokens by staking their existing tokens as collateral.

Dynamic Interest Rates: The borrowing interest rate adjusts dynamically based on the platform’s utilization rate.

Reward Calculation: Users earn rewards based on the amount of tokens staked and the duration of staking.

Role-Based Access Control: Administrators can set interest rates and reward rates.

## Smart Contracts

The DApp interacts with two smart contracts deployed on the Core DAO testnet:

1. **DefiPlatform Contract**: Manages the creation and status of prescriptions.
   - Contract Address: [0x1748A13Af65400808146615A6FBAda941C5eadDF](https://scan.test.btcs.network/address/0x1748A13Af65400808146615A6FBAda941C5eadDF)
2. **Token Contract**: Handles the registration of hospitals and pharmacies.
   - Contract Address: [0xabCE63e2d95486862B88d1BA04A8AA75e6f023ae](https://scan.test.btcs.network/address/0xabCE63e2d95486862B88d1BA04A8AA75e6f023ae)

## Technology Stack

- **Frontend**: Next.js
- **Blockchain**: Core DAO
- **Wallet Connection**: Appkit (WalletConnect)
- **Smart Contract Interaction**: ethers.js

## Getting Started

### Prerequisites

- Node.js (v14.x or later)
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/nxved/hhDefi.git
   cd hhDefi
   ```
2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```
3. Set up environment variables:
   Create a `.env` file in the root directory and add the following:

   ```env
   NEXT_PUBLIC_PROJECT_ID= YOUR_WALLETCONNECT_PROJECT_ID
   ```
4. Run the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.
