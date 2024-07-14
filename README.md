# Decentralized Prescription Management DApp

## Overview

Decentralized Prescription Management is a dApp built on the CoreDao blockchain as HackerHouse Gao task for CoreDao  track that facilitates secure and decentralized management of prescriptions. This dApp allows hospitals to create prescriptions, pharmacies to mark prescriptions as filled, and patients to view their prescription history. The platform ensures data integrity, privacy, and security by leveraging blockchain technology.

## Features

- **Hospital Registration**: Hospitals can register on the platform to create prescriptions for patients.
- **Pharmacy Registration**: Pharmacies can register to mark prescriptions as filled.
- **Patient Prescription History**: Patients can view their prescription history.
- **Prescription Creation**: Hospitals can create prescriptions for patients.
- **Prescription Fulfillment**: Pharmacies can mark prescriptions as filled.

## Smart Contracts

The DApp interacts with two smart contracts deployed on the Core DAO testnet:

1. **Prescription Management Contract**: Manages the creation and status of prescriptions.
   - Contract Address: [0xdA09d91E0C34E4E17e1F012c4c0d2D5180EFCcBB](https://scan.test.btcs.network/address/0xdA09d91E0C34E4E17e1F012c4c0d2D5180EFCcBB)
2. **Registration Vault Contract**: Handles the registration of hospitals and pharmacies.
   - Contract Address: [0xBB76Af96713C7EF357d4326818d4d1B2C6B8A08D](https://scan.test.btcs.network/address/0xBB76Af96713C7EF357d4326818d4d1B2C6B8A08D)

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
   git clone https://github.com/yourusername/decentralized-prescription-management.git
   cd decentralized-prescription-management
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
