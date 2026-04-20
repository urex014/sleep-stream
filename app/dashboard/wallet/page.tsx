/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import {
  Wallet, ArrowUpRight, History,
  AlertCircle, Landmark, Loader2, ChevronLeft,
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

    if (withdrawSource === 'ads' && amountNum < MIN_ADS_WITHDRAWAL) {
      return toast.error(`Minimum withdrawal for Ads Wallet is ₦${MIN_ADS_WITHDRAWAL.toLocaleString()}`);
    }
    if (withdrawSource === 'referrals' && amountNum < MIN_REF_WITHDRAWAL) {
      return toast.error(`Minimum withdrawal for Referral Wallet is ₦${MIN_REF_WITHDRAWAL.toLocaleString()}`);
    }
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
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
      </div>
    );
  }

  const currentMaxBalance = withdrawSource === 'ads' ? wallet.adsBalance : wallet.referralBalance;
  const currentMinThreshold = withdrawSource === 'ads' ? MIN_ADS_WITHDRAWAL : MIN_REF_WITHDRAWAL;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16 font-sans text-slate-800 selection:bg-indigo-500 selection:text-white animate-in fade-in duration-500">

      {/* --- PREMIUM BALANCE PANEL --- */}
      <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 rounded-3xl shadow-xl p-8 md:p-10 text-white overflow-hidden">
        
        {/* Decorative background blurs */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/10 pb-8">
          <div>
            <div className="inline-flex items-center gap-2 mb-3">
              <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                <Wallet className="w-5 h-5 text-indigo-200" />
              </div>
              <span className="text-sm font-semibold uppercase tracking-wider text-slate-300">Total Network Balance</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              ₦{wallet.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </h2>
          </div>
        </div>

        {/* Dual Wallet Breakdown */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-5 mt-8">
          <div className="bg-white/5 border border-white/10 hover:bg-white/10 transition-colors rounded-2xl p-5 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-indigo-200 text-xs font-semibold uppercase tracking-wider flex items-center gap-2">
                <PlaySquare className="w-4 h-4" /> Ads Wallet
              </p>
            </div>
            <p className="text-3xl font-bold tracking-tight mb-1">₦{(wallet.adsBalance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
            <p className="text-xs text-slate-400 font-medium">Min. Payout: ₦{MIN_ADS_WITHDRAWAL.toLocaleString()}</p>
          </div>
          
          <div className="bg-white/5 border border-white/10 hover:bg-white/10 transition-colors rounded-2xl p-5 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-emerald-200 text-xs font-semibold uppercase tracking-wider flex items-center gap-2">
                <Users className="w-4 h-4" /> Referral Wallet
              </p>
            </div>
            <p className="text-3xl font-bold tracking-tight mb-1">₦{(wallet.referralBalance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
            <p className="text-xs text-slate-400 font-medium">Min. Payout: ₦{MIN_REF_WITHDRAWAL.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* --- ACTION PANEL --- */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 md:p-10 min-h-[400px] transition-all duration-300">

        <div className="relative">
          {!actionType ? (
            <div className="flex flex-col items-center justify-center py-4 animate-in zoom-in-95 fade-in duration-300">
              <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                <ArrowUpRight className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">Manage Funds</h3>
              <p className="text-slate-500 text-center max-w-md mb-10 text-sm leading-relaxed">
                Withdraw your earnings to your bank or crypto wallet, or instantly transfer referral earnings into your Ads Wallet.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 w-full">
                <button
                  onClick={() => setActionType('crypto')}
                  className="group flex flex-col items-center justify-center gap-4 p-6 rounded-2xl bg-white border-2 border-slate-100 hover:border-indigo-500 hover:shadow-md hover:-translate-y-1 transition-all duration-200"
                >
                  <div className="p-3 bg-slate-50 group-hover:bg-indigo-50 rounded-xl transition-colors">
                    <Wallet className="w-7 h-7 text-slate-600 group-hover:text-indigo-600 transition-colors" />
                  </div>
                  <span className="font-semibold text-slate-700 group-hover:text-indigo-700 transition-colors">Crypto Wallet</span>
                </button>
                
                <button
                  type="button"
                  disabled
                  className="group flex flex-col items-center justify-center gap-4 p-6 rounded-2xl bg-slate-50/50 border-2 border-slate-100 text-slate-400 cursor-not-allowed opacity-70"
                >
                  <div className="p-3 bg-slate-100 rounded-xl">
                    <Landmark className="w-7 h-7 text-slate-400" />
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <span className="font-semibold text-sm">Local Bank</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-slate-200 px-2 py-0.5 rounded-full">Soon</span>
                  </div>
                </button>

                <button
                  onClick={() => setActionType('transfer')}
                  className="group flex flex-col items-center justify-center gap-4 p-6 rounded-2xl bg-white border-2 border-slate-100 hover:border-emerald-500 hover:shadow-md hover:-translate-y-1 transition-all duration-200"
                >
                  <div className="p-3 bg-slate-50 group-hover:bg-emerald-50 rounded-xl transition-colors">
                    <ArrowRightLeft className="w-7 h-7 text-slate-600 group-hover:text-emerald-600 transition-colors" />
                  </div>
                  <span className="font-semibold text-slate-700 group-hover:text-emerald-700 transition-colors">Transfer to Ads</span>
                </button>
              </div>
            </div>
          ) : actionType === 'transfer' ? (

            /* --- TRANSFER FLOW --- */
            <div className="max-w-xl mx-auto animate-in slide-in-from-right-8 fade-in duration-300">
              <button onClick={() => { setActionType(null); setAmount(''); }} className="flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors mb-8 group">
                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to options
              </button>

              <div className="mb-8">
                <h3 className="text-3xl font-bold text-slate-900 tracking-tight">Internal Transfer</h3>
                <p className="text-slate-500 mt-2">Move funds from your Referral Wallet to your Ads Wallet.</p>
              </div>

              <div className="space-y-8">
                <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-slate-500 mb-1">Available to transfer:</p>
                    <p className="text-2xl font-bold text-slate-900">₦{(wallet.referralBalance || 0).toLocaleString()}</p>
                  </div>
                  <div className="p-3 bg-white rounded-xl shadow-sm">
                    <Users className="w-6 h-6 text-emerald-500" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Amount to transfer</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <span className="text-slate-400 font-bold text-xl">₦</span>
                    </div>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full pl-10 pr-4 py-4 bg-white border-2 border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-slate-900 rounded-xl outline-none text-xl font-bold transition-all"
                    />
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-indigo-50/50 border border-indigo-100 text-indigo-800 rounded-xl">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-indigo-500" />
                  <p className="text-sm leading-relaxed">
                    Transfers are processed instantly. Please note that once funds are moved to the Ads Wallet, they are subject to the Ads Wallet withdrawal minimum (₦20,000).
                  </p>
                </div>

                <button
                  onClick={handleTransfer}
                  disabled={isProcessing || !amount || parseFloat(amount) <= 0 || parseFloat(amount) > wallet.referralBalance}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold py-4 rounded-xl shadow-sm hover:shadow-md flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                >
                  {isProcessing ? <Loader2 className="animate-spin w-5 h-5" /> : "Confirm Transfer"}
                </button>
              </div>
            </div>

          ) : (

            /* --- WITHDRAW FLOW --- */
            <div className="max-w-xl mx-auto animate-in slide-in-from-right-8 fade-in duration-300">
              <button onClick={() => { setActionType(null); setAmount(''); }} className="flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors mb-8 group">
                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to options
              </button>

              <div className="mb-8">
                <h3 className="text-3xl font-bold text-slate-900 tracking-tight">
                  Withdraw to {actionType === 'crypto' ? 'Crypto' : 'Bank'}
                </h3>
                <p className="text-slate-500 mt-2">Select a source wallet and enter your withdrawal details.</p>
              </div>

              <div className="space-y-8">

                {/* 1. Wallet Source Selection */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">Withdraw From:</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                      onClick={() => setWithdrawSource('ads')}
                      className={`p-4 rounded-2xl border-2 text-left transition-all duration-200 ${
                        withdrawSource === 'ads' 
                          ? 'bg-indigo-50 border-indigo-500 shadow-sm' 
                          : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <span className={`block font-bold mb-1 ${withdrawSource === 'ads' ? 'text-indigo-900' : 'text-slate-700'}`}>Ads Wallet</span>
                      <span className={`block text-sm font-medium ${withdrawSource === 'ads' ? 'text-indigo-600' : 'text-slate-500'}`}>
                        Bal: ₦{(wallet.adsBalance || 0).toLocaleString()}
                      </span>
                    </button>
                    
                    <button
                      onClick={() => setWithdrawSource('referrals')}
                      className={`p-4 rounded-2xl border-2 text-left transition-all duration-200 ${
                        withdrawSource === 'referrals' 
                          ? 'bg-emerald-50 border-emerald-500 shadow-sm' 
                          : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <span className={`block font-bold mb-1 ${withdrawSource === 'referrals' ? 'text-emerald-900' : 'text-slate-700'}`}>Referral Wallet</span>
                      <span className={`block text-sm font-medium ${withdrawSource === 'referrals' ? 'text-emerald-600' : 'text-slate-500'}`}>
                        Bal: ₦{(wallet.referralBalance || 0).toLocaleString()}
                      </span>
                    </button>
                  </div>
                </div>

                {/* 2. Amount Input */}
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <label className="block text-sm font-semibold text-slate-700">Amount to withdraw</label>
                    <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                      Min: ₦{currentMinThreshold.toLocaleString()}
                    </span>
                  </div>

                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <span className="text-slate-400 font-bold text-xl">₦</span>
                    </div>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full pl-10 pr-4 py-4 bg-white border-2 border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-slate-900 rounded-xl outline-none text-xl font-bold transition-all"
                    />
                  </div>
                </div>

                {/* 3. Destination Inputs */}
                {actionType === 'crypto' ? (
                  <div className="space-y-6 pt-6 border-t border-slate-100">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Select Network</label>
                      <select
                        value={withdrawNetwork}
                        onChange={(e) => setWithdrawNetwork(e.target.value)}
                        className="w-full px-4 py-3.5 bg-white border-2 border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-xl text-sm font-semibold text-slate-700 outline-none transition-all cursor-pointer appearance-none"
                        style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: `right 0.5rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.5em 1.5em` }}
                      >
                        <option value="USDT-TRC20">USDT (Tron TRC20)</option>
                        <option value="BTC">Bitcoin (BTC)</option>
                        <option value="ETH">Ethereum (ERC20)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Destination Address</label>
                      <input
                        type="text"
                        value={cryptoAddress}
                        onChange={(e) => setCryptoAddress(e.target.value)}
                        placeholder="Paste your wallet address"
                        className="w-full px-4 py-3.5 bg-white border-2 border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-xl font-mono text-sm outline-none transition-all"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6 pt-6 border-t border-slate-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Bank Name</label>
                        <input
                          type="text"
                          value={bankDetails.bankName}
                          onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })}
                          placeholder="e.g. GTBank"
                          className="w-full px-4 py-3.5 bg-white border-2 border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-xl text-sm outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Account Number</label>
                        <input
                          type="text"
                          value={bankDetails.accountNumber}
                          onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
                          placeholder="0123456789"
                          className="w-full px-4 py-3.5 bg-white border-2 border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-xl font-mono text-sm outline-none transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Account Holder Name</label>
                      <input
                        type="text"
                        value={bankDetails.accountHolder}
                        onChange={(e) => setBankDetails({ ...bankDetails, accountHolder: e.target.value })}
                        placeholder="John Doe"
                        className="w-full px-4 py-3.5 bg-white border-2 border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-xl text-sm outline-none transition-all"
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-amber-600" />
                  <p className="text-sm leading-relaxed font-medium">
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
                  className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold py-4 rounded-xl shadow-sm hover:shadow-md flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                >
                  {isProcessing ? <Loader2 className="animate-spin w-5 h-5" /> : "Confirm Withdrawal"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* --- REFINED HISTORY TABLE --- */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="p-6 border-b border-slate-100 bg-white flex items-center gap-2">
          <div className="p-2 bg-slate-50 rounded-lg">
            <History className="w-5 h-5 text-slate-500" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 tracking-tight">Recent Transactions</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/50 text-slate-500 text-xs uppercase font-bold tracking-wider border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Transaction</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="text-sm text-slate-700">
              {history.map((tx) => (
                <tr key={tx._id || tx.id} className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-900">{tx.type} <span className="text-slate-400 font-medium text-xs ml-1">({tx.wallet})</span></p>
                    <p className="text-xs text-slate-500 mt-1">{tx.method}</p>
                  </td>
                  <td className="px-6 py-4 text-slate-500 font-medium">
                    {new Date(tx.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold
                      ${tx.status === 'Success' ? 'bg-emerald-100 text-emerald-700'
                        : tx.status === 'Pending' ? 'bg-amber-100 text-amber-700'
                          : 'bg-red-100 text-red-700'}`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className={`px-6 py-4 text-right font-bold text-base whitespace-nowrap ${tx.type === 'Withdrawal' || tx.type === 'Transfer' ? 'text-slate-900' : 'text-emerald-600'}`}>
                    {tx.type === 'Withdrawal' || tx.type === 'Transfer' ? '-' : '+'}₦{tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
              {history.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-16 text-center text-slate-400 font-medium">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <History className="w-8 h-8 opacity-20" />
                      No transactions yet.
                    </div>
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