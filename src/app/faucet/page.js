"use client";
import { useState, useEffect } from "react";
import { ethers, parseUnits, formatUnits } from "ethers";
import { toast } from "react-toastify";
import {
  useWeb3ModalProvider,
  useWeb3ModalAccount,
} from "@web3modal/ethers/react";
import { BrowserProvider, Contract } from "ethers";
import { defiContract, tokenContract } from "../../utils/config";
import Loader from "../components/loader";

export default function BorrowRepay() {
  const { address, isConnected } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();

  const [loader, setLoader] = useState(false);
  const [balance, setBalance] = useState(0);
  useEffect(() => {
    if (isConnected) {
      fetchBInfo();
    }
  }, [isConnected]);

  const fetchBInfo = async () => {
    try {
      const ethersProvider = new BrowserProvider(walletProvider);
      const contract = new Contract(
        tokenContract.address,
        tokenContract.abi,
        ethersProvider
      );
      const user = await contract.balanceOf(address);
      setBalance(formatUnits(BigInt(user), 18));
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleRequest = async () => {
    if (!isConnected) {
      toast.error("Connect Your Wallet");
      return;
    }

    try {
      setLoader(true);

      const ethersProvider = new BrowserProvider(walletProvider);
      const signer = await ethersProvider.getSigner();
      const contract = new Contract(
        tokenContract.address,
        tokenContract.abi,
        signer
      );

      const tx = await contract.mint();
      await tx.wait();
      toast.success("Deposited successfully");
      fetchBInfo();

      setLoader(false);
    } catch (error) {
      toast.error(error.message);
      setLoader(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-10 text-white bg-gradient-to-br from-black to-gray-900">
      <div className="w-full max-w-4xl space-y-6">
        <div className="mb-8 text-5xl font-semibold text-center">Faucet</div>
        <div className="p-6 space-y-4 rounded-lg shadow-xl bg-gradient-to-br from-gray-800 to-black">
          <div className="mb-4 text-xl font-semibold">User Information</div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="p-4 bg-black rounded-lg shadow-md">
              <div className="text-lg font-sm">HH Token Balance</div>
              <div className="text-lg font-semibold">
                {Number(balance).toFixed(2)} HHTokens
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4 rounded-lg shadow-xl bg-gradient-to-br from-gray-800 to-black">
          <div className="mb-4 text-xl font-semibold">
            Get upto 2000 HHTokens
          </div>

          <div className="mb-4"></div>
          <button
            className={`w-full px-8 py-2 text-xl font-semibold text-white bg-blue-500 rounded-md shadow-md hover:bg-blue-600 ${
              loader && "opacity-50 cursor-not-allowed"
            }`}
            onClick={handleRequest}
            disabled={loader}
          >
            {loader ? "Requesting..." : "Request"}
          </button>
        </div>
      </div>
      {loader && <Loader />}
    </div>
  );
}
