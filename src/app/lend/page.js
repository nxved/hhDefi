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
  const [borrowAmount, setBorrowAmount] = useState("");
  const [repayAmount, setRepayAmount] = useState("");
  const [borrowed, setBorrowed] = useState("0");
  const [dynamicInterestRate, setDynamicInterestRate] = useState("0");
  const [maxBorrowAmount, setMaxBorrowAmount] = useState("0");

  useEffect(() => {
    if (isConnected) {
      fetchBorrowInfo();
    }
  }, [isConnected]);

  const fetchBorrowInfo = async () => {
    try {
      const ethersProvider = new BrowserProvider(walletProvider);
      const contract = new Contract(
        defiContract.address,
        defiContract.abi,
        ethersProvider
      );
      const user = await contract.users(address);
      const dynamicRate = await contract.getDynamicInterestRate();
      setBorrowed(formatUnits(BigInt(user.borrowed), 18));
      setDynamicInterestRate(dynamicRate.toString());
      setMaxBorrowAmount(formatUnits((BigInt(user.staked) * 50n) / 100n, 18));
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleApprove = async (amount) => {
    try {
      const ethersProvider = new BrowserProvider(walletProvider);
      const signer = await ethersProvider.getSigner();
      const tokenContractInstance = new Contract(
        tokenContract.address,
        tokenContract.abi,
        signer
      );
      const num = await tokenContractInstance.allowance(
        address,
        defiContract.address
      );

      if (Number(num) >= parseUnits(amount, 18)) {
        return true;
      }

      const tx = await tokenContractInstance.approve(
        defiContract.address,
        parseUnits(amount, 18)
      );
      await tx.wait();
      return true;
    } catch (error) {
      toast.error(error.message);
      return false;
    }
  };

  const handleBorrow = async () => {
    if (!isConnected) {
      toast.error("Connect Your Wallet");
      return;
    }

    if (!borrowAmount) {
      toast.error("Please enter an amount to borrow");
      return;
    }

    try {
      setLoader(true);

      // Approve tokens
      const isApproved = await handleApprove(borrowAmount);
      if (!isApproved) {
        setLoader(false);
        return;
      }

      const ethersProvider = new BrowserProvider(walletProvider);
      const signer = await ethersProvider.getSigner();
      const contract = new Contract(
        defiContract.address,
        defiContract.abi,
        signer
      );

      const tx = await contract.borrow(parseUnits(borrowAmount, 18));
      await tx.wait();

      toast.success("Borrowed successfully");
      setLoader(false);
      fetchBorrowInfo();
    } catch (error) {
      toast.error(error.message);
      setLoader(false);
    }
  };

  const handleRepay = async () => {
    if (!isConnected) {
      toast.error("Connect Your Wallet");
      return;
    }

    if (!repayAmount) {
      toast.error("Please enter an amount to repay");
      return;
    }

    try {
      setLoader(true);

      // Approve tokens
      const isApproved = await handleApprove(repayAmount);
      if (!isApproved) {
        setLoader(false);
        return;
      }

      const ethersProvider = new BrowserProvider(walletProvider);
      const signer = await ethersProvider.getSigner();
      const contract = new Contract(
        defiContract.address,
        defiContract.abi,
        signer
      );

      const tx = await contract.repay(parseUnits(repayAmount, 18));
      await tx.wait();

      toast.success("Repaid successfully");
      setLoader(false);
      fetchBorrowInfo();
    } catch (error) {
      toast.error(error.message);
      setLoader(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-10 text-white bg-gradient-to-br from-black to-gray-900">
      <div className="w-full max-w-4xl space-y-6">
        <div className="mb-8 text-5xl font-semibold text-center">Borrow</div>

        <div className="p-6 space-y-4 rounded-lg shadow-xl bg-gradient-to-br from-gray-800 to-black">
          <div className="mb-4 text-xl font-semibold">User Information</div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="p-4 bg-black rounded-lg shadow-md">
              <div className="text-lg font-medium">Borrowed</div>
              <div className="text-2xl font-semibold">
                {Number(borrowed).toFixed(2)} HHTokens
              </div>
            </div>
            <div className="p-4 bg-black rounded-lg shadow-md">
              <div className="text-lg font-medium">Dynamic Interest Rate</div>
              <div className="text-2xl font-semibold">
                {dynamicInterestRate} %
              </div>
            </div>
            <div className="p-4 bg-black rounded-lg shadow-md">
              <div className="text-lg font-medium">Max Borrow Amount</div>
              <div className="text-2xl font-semibold">
                {maxBorrowAmount} HHTokens
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4 rounded-lg shadow-xl bg-gradient-to-br from-gray-800 to-black">
          <div className="mb-4">
            <input
              type="text"
              className="w-full h-12 p-4 text-white bg-black border border-gray-600 rounded-md"
              placeholder="Enter amount to borrow..."
              value={borrowAmount}
              onChange={(e) => setBorrowAmount(e.target.value)}
            />
          </div>
          <button
            className={`w-full px-8 py-2 text-xl font-semibold text-white bg-blue-500 rounded-md shadow-md hover:bg-blue-600 ${
              loader && "opacity-50 cursor-not-allowed"
            }`}
            onClick={handleBorrow}
            disabled={loader}
          >
            {loader ? "Borrowing..." : "Borrow"}
          </button>
        </div>

        <div className="p-6 space-y-4 rounded-lg shadow-xl bg-gradient-to-br from-gray-800 to-black">
          <div className="mb-4">
            <input
              type="text"
              className="w-full h-12 p-4 text-white bg-black border border-gray-600 rounded-md"
              placeholder="Enter amount to repay..."
              value={repayAmount}
              onChange={(e) => setRepayAmount(e.target.value)}
            />
          </div>
          <button
            className={`w-full px-8 py-2 text-xl font-semibold text-white bg-green-500 rounded-md shadow-md hover:bg-green-600 ${
              loader && "opacity-50 cursor-not-allowed"
            }`}
            onClick={handleRepay}
            disabled={loader}
          >
            {loader ? "Repaying..." : "Repay"}
          </button>
        </div>
      </div>
      {loader && <Loader />}
    </div>
  );
}
