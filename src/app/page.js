"use client";
import { useState, useEffect } from "react";
import { useWeb3Modal, useSwitchNetwork } from "@web3modal/ethers/react";
import { ethers, parseUnits, formatUnits } from "ethers";
import { toast } from "react-toastify";
import {
  useWeb3ModalProvider,
  useWeb3ModalAccount,
} from "@web3modal/ethers/react";
import { BrowserProvider, Contract } from "ethers";
import { chainConfig, defiContract, tokenContract } from "../utils/config";
import Loader from "./components/loader";

export default function Dashboard() {
  const { open } = useWeb3Modal();
  const [loader, setLoader] = useState(false);
  const { address, isConnected, chainId } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();

  const [stakeAmount, setStakeAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [staked, setStaked] = useState("0");
  const [rewards, setRewards] = useState("0");
  const [rewardRate, setRewardRate] = useState("0");
  const { switchNetwork } = useSwitchNetwork();

  useEffect(() => {
    if (isConnected) {
      fetchUserInfo();
    }
  }, [isConnected]);

  useEffect(() => {
    if (isConnected) {
      switchNetwork(chainConfig.id);
      fetchUserInfo();
    }
  }, [chainId]);

  const handleWallet = () => {
    open();
  };

  const fetchUserInfo = async () => {
    try {
      const ethersProvider = new BrowserProvider(walletProvider);
      const contract = new Contract(
        defiContract.address,
        defiContract.abi,
        ethersProvider
      );
      const user = await contract.users(address);
      const rewardRate = await contract.rewardRate();
      const rewards = await contract.calculateRewards(address);

      setStaked(formatUnits(user.staked, 18));
      setRewardRate(rewardRate.toString());
      setRewards(formatUnits(rewards, 18));
    } catch (error) {
      console.log(error.message);
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
      const allowance = await tokenContractInstance.allowance(
        address,
        defiContract.address
      );
      if (Number(allowance) >= parseUnits(amount, 18)) {
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

  const handleStake = async () => {
    if (!isConnected) {
      toast.error("Connect Your Wallet");
      return;
    }

    if (!stakeAmount) {
      toast.error("Please enter an amount to stake");
      return;
    }

    try {
      setLoader(true);

      // Approve tokens
      const isApproved = await handleApprove(stakeAmount);
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

      const tx = await contract.stake(parseUnits(stakeAmount, 18));
      await tx.wait();

      toast.success("Staked successfully");
      setLoader(false);
      fetchUserInfo();
    } catch (error) {
      toast.error(error.message);
      setLoader(false);
    }
  };

  const handleWithdraw = async () => {
    if (!isConnected) {
      toast.error("Connect Your Wallet");
      return;
    }

    if (!withdrawAmount) {
      toast.error("Please enter an amount to withdraw");
      return;
    }

    try {
      setLoader(true);
      const ethersProvider = new BrowserProvider(walletProvider);
      const signer = await ethersProvider.getSigner();
      const contract = new Contract(
        defiContract.address,
        defiContract.abi,
        signer
      );

      const tx = await contract.withdraw(parseUnits(withdrawAmount, 18));
      await tx.wait();

      toast.success("Withdrawn successfully");
      setLoader(false);
      fetchUserInfo();
    } catch (error) {
      toast.error(error.message);
      setLoader(false);
    }
  };

  const handleClaimRewards = async () => {
    if (!isConnected) {
      toast.error("Connect Your Wallet");
      return;
    }

    try {
      setLoader(true);
      const ethersProvider = new BrowserProvider(walletProvider);
      const signer = await ethersProvider.getSigner();
      const contract = new Contract(
        defiContract.address,
        defiContract.abi,
        signer
      );

      const tx = await contract.claimRewards();
      await tx.wait();

      toast.success("Rewards claimed successfully");
      setLoader(false);
      fetchUserInfo();
    } catch (error) {
      toast.error(error.message);
      setLoader(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-10 text-white bg-gradient-to-br from-black to-gray-900">
      <div className="w-full max-w-4xl space-y-6">
        <div className="mb-8 text-5xl font-semibold text-center">
          Stake and Earn Rewards
        </div>

        <div className="p-6 space-y-4 rounded-lg shadow-xl bg-gradient-to-br from-gray-800 to-black">
          <div className="mb-4 text-xl font-semibold">User Information</div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="p-4 bg-black rounded-lg shadow-md">
              <div className="text-lg font-medium">Staked</div>
              <div className="text-2xl font-semibold">{staked} HHTokens</div>
            </div>
            <div className="p-4 bg-black rounded-lg shadow-md">
              <div className="text-lg font-medium">Rewards</div>
              <div className="text-2xl font-semibold">
                {Number(rewards).toFixed(2)} HHTokens
              </div>
            </div>
            <div className="p-4 bg-black rounded-lg shadow-md">
              <div className="text-lg font-medium">Reward Rate</div>
              <div className="text-2xl font-semibold">{rewardRate}%</div>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4 rounded-lg shadow-xl bg-gradient-to-br from-gray-800 to-black">
          <div className="mb-4">
            <input
              type="text"
              className="w-full h-12 p-4 text-white bg-black border border-gray-600 rounded-md"
              placeholder="Enter amount to stake..."
              value={stakeAmount}
              onChange={(e) => setStakeAmount(e.target.value)}
            />
          </div>
          <button
            className={`w-full px-8 py-2 text-xl font-semibold text-white bg-indigo-600 rounded-md shadow-md hover:bg-indigo-700 ${
              loader && "opacity-50 cursor-not-allowed"
            }`}
            onClick={handleStake}
            disabled={loader}
          >
            {loader ? "Staking..." : "Stake"}
          </button>
        </div>

        <div className="p-6 space-y-4 rounded-lg shadow-xl bg-gradient-to-br from-gray-800 to-black">
          <div className="mb-4">
            <input
              type="text"
              className="w-full h-12 p-4 text-white bg-black border border-gray-600 rounded-md"
              placeholder="Enter amount to withdraw..."
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
            />
          </div>
          <button
            className={`w-full px-8 py-2 text-xl font-semibold text-white bg-indigo-600 rounded-md shadow-md hover:bg-indigo-700 ${
              loader && "opacity-50 cursor-not-allowed"
            }`}
            onClick={handleWithdraw}
            disabled={loader}
          >
            {loader ? "Withdrawing..." : "Withdraw"}
          </button>
        </div>

        <div className="p-6 space-y-4 rounded-lg shadow-xl bg-gradient-to-br from-gray-800 to-black">
          <button
            className={`w-full px-8 py-2 text-xl font-semibold text-white bg-green-500 rounded-md shadow-md hover:bg-green-600 ${
              loader && "opacity-50 cursor-not-allowed"
            }`}
            onClick={handleClaimRewards}
            disabled={loader}
          >
            {loader ? "Claiming..." : "Claim Rewards"}
          </button>
        </div>
      </div>
      {loader && <Loader />}
    </div>
  );
}
