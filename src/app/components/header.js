"use client";
import Link from "next/link";
import React from "react";
import { useWeb3Modal } from "@web3modal/ethers/react";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";

export default function Header() {
  const { open } = useWeb3Modal();
  const { address, isConnected } = useWeb3ModalAccount();

  const handleWallet = () => {
    open();
  };

  return (
    <header className="flex items-center justify-between p-5 text-white bg-black">
      <div className="flex items-center space-x-4 md:space-x-8">
        <Link
          href="/#"
          className="px-4 py-2 text-xs font-semibold uppercase border border-transparent hover:border-white md:px-8"
        >
          Home
        </Link>
        <Link
          href="/lend"
          className="px-4 py-2 text-xs font-semibold uppercase border border-transparent hover:border-white md:px-8"
        >
          Borrow
        </Link>
        <Link
          href="/faucet"
          className="px-4 py-2 text-xs font-semibold uppercase border border-transparent hover:border-white md:px-8"
        >
          Faucet
        </Link>
      </div>
      <div className="flex items-center space-x-4">
        <button
          onClick={handleWallet}
          className="px-4 py-2 text-xs font-semibold uppercase border border-transparent hover:border-white md:px-8"
        >
          {isConnected ? "Disconnect" : "Connect"}
        </button>{" "}
      </div>
    </header>
  );
}
