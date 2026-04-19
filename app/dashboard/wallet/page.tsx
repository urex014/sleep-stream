/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import {
  Wallet, ArrowUpRight, History, CheckCircle2,
  Lock, AlertCircle, Landmark, Loader2, ChevronLeft,
  Users, PlaySquare, ArrowRightLeft
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function WalletPage() {
  const router = useRouter();

  // Thresholds
  const MIN_ADS_WITHDRAWAL = 20000;
  const MIN_REF_WITHDRAWAL = 12000;

  // Data States
  const [wallet, setWallet] = useState({
    total: 0.00,
    locked: 0.00,
    available: 0.00,
    adsBalance: 0.00,
    referralBalance: 0.00
  });
  const [history, setHistory] = useState<any[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // --- ACTION STATES ---
  const [actionType, setActionType] = useState<'crypto' | 'fiat' | 'transfer' | null>(null);
  const [withdrawSource, setWithdrawSource] = useState<'ads' | 'referrals'>('ads');
  const [amount, setAmount] = useState('');
  const [withdrawNetwork, setWithdrawNetwork] = useState('USDT-TRC20');
  const [isProcessing, setIsProcessing] = useState(false);

  // Distinct destination fields
  const [cryptoAddress, setCryptoAddress] = useState('');
  const [bankDetails, setBankDetails] = useState({ bankName: '', accountNumber: '', accountHolder: '' });

  // --- 1. FETCH DATA ---
  const fetchWalletData = async () => {
    try {
      const res = await fetch('/api/user/dashboard/wallet');
      const data = await res.json();
      if (res.status === 401) return router.push('/login');
      if (data.success) {
        setWallet(data.wallet);
        setHistory(data.history);
      }
    } catch (error) {
      console.error("Failed to load wallet");
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => { fetchWalletData(); }, []);

  // --- 2. HANDLERS ---
  const handleWithdraw = async () => {
    const amountNum = parseFloat(amount);
    if (!amountNum || amountNum <= 0) return toast.error("Please enter a valid amount.");

    // Enforce Thresholds
    if (withdrawSource === 'ads' && amountNum < MIN_ADS_WITHDRAWAL) {
      return toast.error(`Minimum withdrawal for Ads Wallet is ?${MIN_ADS_WITHDRAWAL.toLocaleString()}`);
    }
    if (withdrawSource === 'referrals' && amountNum < MIN_REF_WITHDRAWAL) {
      return toast.error(`Minimum withdrawal for Referral Wallet is ?${MIN_REF_WITHDRAWAL.toLocaleString()}`);
    }

    // Enforce Available Balances
    if (withdrawSource === 'ads' && amountNum > wallet.adsBalance) {
      return toast.error("Insufficient funds in your Ads Wallet.");
    }
    if (withdrawSource === 'referrals' && amountNum > wallet.referralBalance) {
      return toast.error("Insufficient funds in your Referral Wallet.");
    }

    let finalDestination = '';
    if (actionType === 'crypto') {
      if (!cryptoAddress) return toast.error("Please enter your wallet address.");
      finalDestination = cryptoAddress;
    } else {
      if (!bankDetails.bankName || !bankDetails.accountNumber || !bankDetails.accountHolder) {
        return toast.error("Please fill out all bank details.");
      }
      finalDestination = `${bankDetails.bankName} | ${bankDetails.accountNumber} | ${bankDetails.accountHolder}`;
    }

    setIsProcessing(true);
    try {
      const res = await fetch('/api/user/dashboard/wallet/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amountNum,
          method: actionType,
          destination: finalDestination,
          network: withdrawNetwork,
          walletType: withdrawSource
        }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Withdrawal Request Sent! Status: Pending");
        setAmount('');
        setCryptoAddress('');
        setBankDetails({ bankName: '', accountNumber: '', accountHolder: '' });
        setActionType(null);
        fetchWalletData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Network Error");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTransfer = async () => {
    const amountNum = parseFloat(amount);
    if (!amountNum || amountNum <= 0) return toast.error("Please enter a valid amount.");
    if (amountNum > wallet.referralBalance) return toast.error("Insufficient funds in your Referral Wallet.");

    setIsProcessing(true);
    try {
      const res = await fetch('/api/user/dashboard/wallet/transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: amountNum }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Transfer Successful! Funds have been moved to your Ads Wallet.");
        setAmount('');
        setActionType(null);
        fetchWalletData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Network Error");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoadingData) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#337ab7] animate-spin" />
      </div>
    );
  }

  // Dynamic values based on selected source
  const currentMaxBalance = withdrawSource === 'ads' ? wallet.adsBalance : wallet.referralBalance;
  const currentMinThreshold = withdrawSource === 'ads' ? MIN_ADS_WITHDRAWAL : MIN_REF_WITHDRAWAL;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16 font-sans text-[#333333]">

      {/* --- CLASSIC BALANCE PANEL (Bootstrap Primary Style) --- */}
      <div className="bg-[#337ab7] border border-[#2e6da4] rounded shadow-sm p-8 text-white flex flex-col justify-between gap-6">

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#286090] pb-6">
          <div>
            <div className="inline-flex items-center gap-2 mb-2">
              <Wallet className="w-5 h-5 text-[#c4e3f3]" />
              <span className="text-sm font-bold uppercase tracking-wider text-[#c4e3f3]">Total Network Balance</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold">
              ₦{wallet.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </h2>
          </div>

          {/* <div className="flex flex-col gap-2 w-full md:w-auto">
            <div className="flex items-center justify-between gap-4 bg-[#286090] border border-[#1e4b73] px-4 py-2 rounded text-sm w-full">
              <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#5cb85c]" /> Available</span>
              <strong className="text-base">₦{wallet.available.toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong>
            </div>
            <div className="flex items-center justify-between gap-4 bg-[#286090] border border-[#1e4b73] px-4 py-2 rounded text-sm w-full">
              <span className="flex items-center gap-2"><Lock className="w-4 h-4 text-[#f0ad4e]" /> Locked</span>
              <strong className="text-base">₦{wallet.locked.toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong>
            </div>
          </div> */}
        </div>

        {/* Dual Wallet Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#1e4b73]/50 border border-[#2e6da4] rounded p-4">
            <p className="text-[#c4e3f3] text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5"><PlaySquare className="w-3.5 h-3.5" /> Ads Wallet</p>
            <p className="text-2xl font-bold">₦{(wallet.adsBalance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
            <p className="text-xs text-[#c4e3f3] mt-1">Min. Payout: ₦{MIN_ADS_WITHDRAWAL.toLocaleString()}</p>
          </div>
          <div className="bg-[#1e4b73]/50 border border-[#2e6da4] rounded p-4">
            <p className="text-[#c4e3f3] text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> Referral Wallet</p>
            <p className="text-2xl font-bold">₦{(wallet.referralBalance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
            <p className="text-xs text-[#c4e3f3] mt-1">Min. Payout: ₦{MIN_REF_WITHDRAWAL.toLocaleString()}</p>
          </div>
        </div>

      </div>

      {/* --- ACTION PANEL --- */}
      <div className="bg-white rounded shadow-sm border border-[#dddddd] p-6 md:p-8 min-h-[400px]">

        <div>
          {!actionType ? (
            <div className="flex flex-col items-center justify-center py-6">
              <div className="w-16 h-16 bg-[#f5f5f5] text-[#337ab7] border border-[#dddddd] rounded-full flex items-center justify-center mb-6">
                <ArrowUpRight className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-[#222222] mb-2">Manage Funds</h3>
              <p className="text-[#666666] text-center max-w-md mb-8 text-sm">
                Withdraw to your bank/crypto, or instantly transfer referral earnings into your Ads Wallet to purchase campaigns.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
                <button
                  onClick={() => setActionType('crypto')}
                  className="flex flex-col items-center justify-center gap-3 p-6 rounded bg-[#f9f9f9] border border-[#dddddd] hover:border-[#66afe9] hover:bg-[#f4f9fc] transition-colors shadow-sm"
                >
                  <Wallet className="w-8 h-8 text-[#337ab7]" />
                  <span className="font-bold text-[#333333] text-sm">Crypto Wallet</span>
                </button>

                <button
                  onClick={() => setActionType('fiat')}
                  className="flex flex-col items-center justify-center gap-3 p-6 rounded bg-[#f9f9f9] border border-[#dddddd] hover:border-[#66afe9] hover:bg-[#f4f9fc] transition-colors shadow-sm"
                >
                  <Landmark className="w-8 h-8 text-[#337ab7]" />
                  <span className="font-bold text-[#333333] text-sm">Local Bank</span>
                </button>

                <button
                  onClick={() => setActionType('transfer')}
                  className="flex flex-col items-center justify-center gap-3 p-6 rounded bg-[#f9f9f9] border border-[#dddddd] hover:border-[#5cb85c] hover:bg-[#f9fdf7] transition-colors shadow-sm"
                >
                  <ArrowRightLeft className="w-8 h-8 text-[#5cb85c]" />
                  <span className="font-bold text-[#333333] text-sm text-center">Transfer to Ads</span>
                </button>
              </div>
            </div>
          ) : actionType === 'transfer' ? (

            /* --- TRANSFER FLOW --- */
            <div className="max-w-xl mx-auto">
              <button onClick={() => { setActionType(null); setAmount(''); }} className="flex items-center gap-1 text-sm font-bold text-[#337ab7] hover:underline mb-6">
                <ChevronLeft className="w-4 h-4" /> Back to methods
              </button>

              <div className="border-b border-[#eeeeee] pb-4 mb-6">
                <h3 className="text-2xl font-bold text-[#222222]">Internal Transfer</h3>
                <p className="text-[#666666] mt-1">Move funds from your Referral Wallet to your Ads Wallet.</p>
              </div>

              <div className="space-y-6">
                <div className="p-4 bg-[#f9f9f9] border border-[#dddddd] rounded flex justify-between items-center">
                  <div>
                    <p className="text-sm font-bold text-[#333333]">Available to transfer:</p>
                    <p className="text-2xl font-bold text-[#5cb85c]">₦{(wallet.referralBalance || 0).toLocaleString()}</p>
                  </div>
                  <Users className="w-8 h-8 text-[#dddddd]" />
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#333333] mb-2">Amount to transfer</label>
                  <div className="flex shadow-sm">
                    <span className="bg-[#eeeeee] border border-[#cccccc] border-r-0 px-4 py-3 text-[#555555] font-bold rounded-l text-xl">₦</span>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="flex-1 bg-white border border-[#cccccc] focus:border-[#66afe9] focus:shadow-[inset_0_1px_1px_rgba(0,0,0,0.075),0_0_8px_rgba(102,175,233,0.6)] text-[#333333] rounded-r px-4 py-3 outline-none text-2xl font-bold transition-all"
                    />
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-[#d9edf7] border border-[#bce8f1] text-[#31708f] rounded mt-6">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <p className="text-sm">
                    Transfers are processed instantly. Please note that once funds are moved to the Ads Wallet, they are subject to the Ads Wallet withdrawal minimum (₦20,000).
                  </p>
                </div>

                <button
                  onClick={handleTransfer}
                  disabled={isProcessing || !amount || parseFloat(amount) <= 0 || parseFloat(amount) > wallet.referralBalance}
                  className="w-full bg-[#337ab7] hover:bg-[#286090] border border-[#2e6da4] text-white font-bold py-3.5 rounded shadow-sm flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed mt-4 text-lg transition-colors"
                >
                  {isProcessing ? <Loader2 className="animate-spin w-5 h-5" /> : "Confirm Transfer"}
                </button>
              </div>
            </div>

          ) : (

            /* --- WITHDRAW FLOW --- */
            <div className="max-w-2xl mx-auto">
              <button onClick={() => { setActionType(null); setAmount(''); }} className="flex items-center gap-1 text-sm font-bold text-[#337ab7] hover:underline mb-6">
                <ChevronLeft className="w-4 h-4" /> Back to methods
              </button>

              <div className="border-b border-[#eeeeee] pb-4 mb-6">
                <h3 className="text-2xl font-bold text-[#222222]">
                  Withdraw to {actionType === 'crypto' ? 'Crypto Wallet' : 'Bank Account'}
                </h3>
              </div>

              <div className="space-y-6">

                {/* 1. Wallet Source Selection */}
                <div className="p-4 bg-[#f9f9f9] border border-[#dddddd] rounded">
                  <label className="block text-sm font-bold text-[#333333] mb-3">Withdraw From:</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      onClick={() => setWithdrawSource('ads')}
                      className={`p-3 border rounded text-left transition-colors ${withdrawSource === 'ads' ? 'bg-[#d9edf7] border-[#bce8f1] text-[#31708f]' : 'bg-white border-[#cccccc] text-[#666666] hover:bg-[#eeeeee]'}`}
                    >
                      <span className="block font-bold mb-1">Ads Wallet</span>
                      <span className="block text-sm">Bal: ₦{(wallet.adsBalance || 0).toLocaleString()}</span>
                    </button>
                    <button
                      onClick={() => setWithdrawSource('referrals')}
                      className={`p-3 border rounded text-left transition-colors ${withdrawSource === 'referrals' ? 'bg-[#dff0d8] border-[#d6e9c6] text-[#3c763d]' : 'bg-white border-[#cccccc] text-[#666666] hover:bg-[#eeeeee]'}`}
                    >
                      <span className="block font-bold mb-1">Referral Wallet</span>
                      <span className="block text-sm">Bal: ₦{(wallet.referralBalance || 0).toLocaleString()}</span>
                    </button>
                  </div>
                </div>

                {/* 2. Amount Input */}
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <label className="block text-sm font-bold text-[#333333]">Amount to withdraw</label>
                    <span className="text-xs font-bold text-[#777777]">
                      Min: ₦{currentMinThreshold.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex shadow-sm">
                    <span className="bg-[#eeeeee] border border-[#cccccc] border-r-0 px-4 py-3 text-[#555555] font-bold rounded-l text-xl">₦</span>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="flex-1 bg-white border border-[#cccccc] focus:border-[#66afe9] focus:shadow-[inset_0_1px_1px_rgba(0,0,0,0.075),0_0_8px_rgba(102,175,233,0.6)] text-[#333333] rounded-r px-4 py-3 outline-none text-2xl font-bold transition-all"
                    />
                  </div>
                </div>

                {/* 3. Destination Inputs */}
                {actionType === 'crypto' ? (
                  <div className="space-y-5 border-t border-[#eeeeee] pt-5 mt-5">
                    <div>
                      <label className="block text-sm font-bold text-[#333333] mb-2">Select Network</label>
                      <select
                        value={withdrawNetwork}
                        onChange={(e) => setWithdrawNetwork(e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-[#cccccc] focus:border-[#66afe9] rounded text-sm font-bold text-[#333333] outline-none shadow-sm"
                      >
                        <option value="USDT-TRC20">USDT (Tron TRC20)</option>
                        <option value="BTC">Bitcoin (BTC)</option>
                        <option value="ETH">Ethereum (ERC20)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-[#333333] mb-2">Destination Address</label>
                      <input
                        type="text"
                        value={cryptoAddress}
                        onChange={(e) => setCryptoAddress(e.target.value)}
                        placeholder="Paste your wallet address"
                        className="w-full px-4 py-3 bg-white border border-[#cccccc] focus:border-[#66afe9] focus:shadow-[inset_0_1px_1px_rgba(0,0,0,0.075),0_0_8px_rgba(102,175,233,0.6)] rounded font-mono text-sm outline-none shadow-sm transition-all"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-5 border-t border-[#eeeeee] pt-5 mt-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-bold text-[#333333] mb-2">Bank Name</label>
                        <input
                          type="text"
                          value={bankDetails.bankName}
                          onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })}
                          placeholder="e.g. GTBank"
                          className="w-full px-4 py-3 bg-white border border-[#cccccc] focus:border-[#66afe9] rounded text-sm outline-none shadow-[inset_0_1px_1px_rgba(0,0,0,0.075)] transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-[#333333] mb-2">Account Number</label>
                        <input
                          type="text"
                          value={bankDetails.accountNumber}
                          onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
                          placeholder="0123456789"
                          className="w-full px-4 py-3 bg-white border border-[#cccccc] focus:border-[#66afe9] rounded font-mono text-sm outline-none shadow-[inset_0_1px_1px_rgba(0,0,0,0.075)] transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-[#333333] mb-2">Account Holder Name</label>
                      <input
                        type="text"
                        value={bankDetails.accountHolder}
                        onChange={(e) => setBankDetails({ ...bankDetails, accountHolder: e.target.value })}
                        placeholder="John Doe"
                        className="w-full px-4 py-3 bg-white border border-[#cccccc] focus:border-[#66afe9] rounded text-sm outline-none shadow-[inset_0_1px_1px_rgba(0,0,0,0.075)] transition-all"
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3 p-4 bg-[#fcf8e3] border border-[#faebcc] text-[#8a6d3b] rounded mt-6">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <p className="text-sm">
                    Please double-check your details. Incorrect information will result in lost funds.
                  </p>
                </div>

                <button
                  onClick={handleWithdraw}
                  disabled={
                    isProcessing ||
                    !amount ||
                    (parseFloat(amount) < currentMinThreshold) ||
                    (parseFloat(amount) > currentMaxBalance) ||
                    (actionType === 'crypto' ? !cryptoAddress : (!bankDetails.bankName || !bankDetails.accountNumber || !bankDetails.accountHolder))
                  }
                  className="w-full bg-[#5cb85c] hover:bg-[#449d44] border border-[#4cae4c] text-white font-bold py-3.5 rounded shadow-sm flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed mt-4 text-lg transition-colors"
                >
                  {isProcessing ? <Loader2 className="animate-spin w-5 h-5" /> : "Confirm Withdrawal"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* --- CLEAN HISTORY TABLE --- */}
      <div className="bg-white border border-[#dddddd] rounded shadow-sm overflow-hidden">
        <div className="p-4 border-b border-[#dddddd] bg-[#f5f5f5] flex items-center gap-2">
          <History className="w-4 h-4 text-[#777777]" />
          <h3 className="text-base font-bold text-[#333333]">Recent Transactions</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#f9f9f9] text-[#777777] text-xs uppercase font-bold border-b border-[#dddddd]">
              <tr>
                <th className="px-6 py-3">Transaction</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="text-sm text-[#333333]">
              {history.map((tx) => (
                <tr key={tx._id || tx.id} className="border-b border-[#eeeeee] hover:bg-[#f9f9f9] transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold text-[#222222]">{tx.type} <span className="text-[#999999] font-normal text-xs ml-1">({tx.wallet})</span></p>
                    <p className="text-xs text-[#777777] mt-0.5">{tx.method}</p>
                  </td>
                  <td className="px-6 py-4 text-[#666666]">
                    {new Date(tx.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-bold text-white
                      ${tx.status === 'Success' ? 'bg-[#5cb85c]'
                        : tx.status === 'Pending' ? 'bg-[#f0ad4e]'
                          : 'bg-[#d9534f]'}`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className={`px-6 py-4 text-right font-bold text-base whitespace-nowrap ${tx.type === 'Withdrawal' || tx.type === 'Transfer' ? 'text-[#222222]' : 'text-[#3c763d]'}`}>
                    {tx.type === 'Withdrawal' || tx.type === 'Transfer' ? '-' : '+'}₦{tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
              {history.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-[#999999]">
                    No transactions yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

