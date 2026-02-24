/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import { 
  Wallet, ArrowDownLeft, ArrowUpRight, History, CheckCircle2, 
  Lock, Copy, AlertCircle, CreditCard, Landmark, Loader2, ChevronLeft,
  Info
} from 'lucide-react';
import QRCode from "react-qr-code";
import { useRouter } from 'next/navigation';

export default function WalletPage() {
  
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw'>('deposit');
  
  // Data States
  const [wallet, setWallet] = useState({ total: 0.00, locked: 0.00, available: 0.00 });
  const [history, setHistory] = useState<any[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // --- DEPOSIT STATES ---
  const [depositMethod, setDepositMethod] = useState<'crypto' | 'fiat'>('crypto');
  const [depositNetwork, setDepositNetwork] = useState('USDT-TRC20');
  const [depositAmount, setDepositAmount] = useState('');
  const [txHash, setTxHash] = useState(''); 
  const [isVerifying, setIsVerifying] = useState(false);

  // --- NGN RATES ---
  const [rates, setRates] = useState<any>(null);
  const EXCHANGE_RATE = rates || { rates: { NGN: 1300 } };

  // --- WITHDRAW STATES ---
  const [withdrawMethod, setWithdrawMethod] = useState<'crypto' | 'fiat' | null>(null);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawNetwork, setWithdrawNetwork] = useState('USDT-TRC20');
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  
  // New distinct bank fields
  const [cryptoAddress, setCryptoAddress] = useState('');
  const [bankDetails, setBankDetails] = useState({ bankName: '', accountNumber: '', accountHolder: '' });

  // Constants
  const adminWallets: Record<string, string> = {
    'USDT-TRC20': 'TAMVc7wE73TPmkVnMzGZmxjeWGkEzjcFVo', 
    'BTC': 'bc1qn3elluy6w0rlfj5zda3zag4wfsefq4knan2p93', 
    'ETH': '0xfCf9437dF2b5A73728b840222F77F2D80D7AD2BE',
    'SOL': "L5f8pZD3iPiVALCwhVEprXCk3zB3iMfz8fgmBXJHhFG",
    'BNB': "0xfCf9437dF2b5A73728b840222F77F2D80D7AD2BE"
  };

  const getQRValue = (network: string, address: string) => {
    switch (network) {
      case 'BTC': return `bitcoin:${address}`;
      case 'ETH': return `ethereum:${address}`;
      case 'USDT-TRC20': return `tron:${address}`;
      case 'SOL': return `solana:${address}`;
      case 'BNB':
      case 'USDT-BEP20': return `ethereum:${address}`; 
      default: return address;
    }
  };
  
  const adminBankDetails = {
    bankName: "Fidelity Bank Plc",
    accountNumber: "6540001694",
    accountName: "SleepStream Enterprise"
  };

  const formatNGN = (usd: string | number) => {
    const amount = parseFloat(usd as string) || 0;
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(amount * EXCHANGE_RATE.rates.NGN);
  };

  useEffect(() => {
    fetch("https://api.exchangerate-api.com/v4/latest/USD")
      .then(res => res.json())
      .then(data => setRates(data))
      .catch(() => console.log("Using fallback rates"));
  }, []);

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
  const handleDeposit = async () => {
    setIsVerifying(true);
    try {
      const res = await fetch('/api/user/dashboard/wallet/deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseFloat(depositAmount),
          method: depositMethod,
          network: depositNetwork,
          txHash: txHash
        }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Deposit submitted! Awaiting Admin Confirmation.");
        setDepositAmount('');
        setTxHash('');
        fetchWalletData();
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Network Error");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleWithdraw = async () => {
    // Validate inputs based on method
    if (!withdrawAmount) return alert("Please enter an amount.");
    
    let finalDestination = '';
    if (withdrawMethod === 'crypto') {
      if (!cryptoAddress) return alert("Please enter your wallet address.");
      finalDestination = cryptoAddress;
    } else {
      if (!bankDetails.bankName || !bankDetails.accountNumber || !bankDetails.accountHolder) {
        return alert("Please fill out all bank details.");
      }
      // Combine for the backend
      finalDestination = `${bankDetails.bankName} | ${bankDetails.accountNumber} | ${bankDetails.accountHolder}`;
    }

    setIsWithdrawing(true);
    try {
      const res = await fetch('/api/user/dashboard/wallet/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseFloat(withdrawAmount),
          method: withdrawMethod,
          destination: finalDestination,
          network: withdrawNetwork
        }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Withdrawal Request Sent! Status: Pending");
        setWithdrawAmount('');
        setCryptoAddress('');
        setBankDetails({ bankName: '', accountNumber: '', accountHolder: '' });
        setWithdrawMethod(null);
        fetchWalletData();
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Network Error");
    } finally {
      setIsWithdrawing(false);
    }
  };

  if (isLoadingData) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="relative flex items-center justify-center">
           <div className="absolute inset-0 w-12 h-12 border-4 border-slate-200 dark:border-blue-900/30 rounded-full animate-ping"></div>
           <Loader2 className="w-8 h-8 text-blue-600 dark:text-blue-500 animate-spin relative z-10" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-700 pb-16">
      
      {/* --- FINTECH STYLE BALANCE CARD --- */}
      <div className="relative bg-gradient-to-br from-blue-600 via-indigo-700 to-slate-900 dark:from-[#0B1120] dark:via-blue-950 dark:to-slate-950 rounded-[2.5rem] p-8 md:p-12 shadow-2xl overflow-hidden border border-blue-500/20 dark:border-blue-500/10">
        
        {/* Abstract Glowing Orbs */}
        <div className="absolute -top-24 -right-24 w-[30rem] h-[30rem] bg-blue-400/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-[20rem] h-[20rem] bg-indigo-400/20 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6 shadow-sm">
              <Wallet className="w-4 h-4 text-blue-200" />
              <span className="text-sm font-bold tracking-wide uppercase text-blue-50">Total Balance</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 drop-shadow-sm">
              ${wallet.total.toFixed(2)}
            </h2>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-black/20 backdrop-blur-md border border-white/5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-medium text-blue-100">Available: <span className="text-white font-bold tracking-wide">${wallet.available.toFixed(2)}</span></span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-black/20 backdrop-blur-md border border-white/5">
                <Lock className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-medium text-blue-100">Locked: <span className="text-white font-bold tracking-wide">${wallet.locked.toFixed(2)}</span></span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-4 w-full md:w-auto">
            <button 
              onClick={() => setActiveTab('deposit')} 
              className={`group flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-bold transition-all duration-300 ${activeTab === 'deposit' ? 'bg-white text-blue-900 shadow-xl scale-105' : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-md border border-white/10'}`}
            >
              <ArrowDownLeft className="w-5 h-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /> Add Money
            </button>
            <button 
              onClick={() => setActiveTab('withdraw')} 
              className={`group flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-bold transition-all duration-300 ${activeTab === 'withdraw' ? 'bg-white text-blue-900 shadow-xl scale-105' : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-md border border-white/10'}`}
            >
              <ArrowUpRight className="w-5 h-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /> Cash Out
            </button>
          </div>
        </div>
      </div>

      {/* --- ACTION PANEL --- */}
      <div className="bg-white dark:bg-[#0B1120] rounded-[2rem] shadow-sm border border-slate-200/80 dark:border-white/[0.08] p-6 md:p-10 min-h-[400px]">
        
        {/* ==========================================
            DEPOSIT VIEW 
            ========================================== */}
        {activeTab === 'deposit' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-10 text-center md:text-left">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">Fund your account</h3>
              <p className="text-slate-500 dark:text-slate-400">Choose how you'd like to add money to your balance.</p>
            </div>

            {/* Segmented Control */}
            <div className="flex p-1.5 bg-slate-100 dark:bg-white/[0.04] rounded-2xl mb-10 max-w-sm mx-auto md:mx-0 border border-slate-200/50 dark:border-transparent">
              <button 
                onClick={() => setDepositMethod('crypto')} 
                className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${depositMethod === 'crypto' ? 'bg-white dark:bg-blue-500/10 text-slate-900 dark:text-blue-400 shadow-sm ring-1 ring-slate-200 dark:ring-blue-500/30' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
              >
                Crypto Deposit
              </button>
              <button 
                onClick={() => setDepositMethod('fiat')} 
                className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${depositMethod === 'fiat' ? 'bg-white dark:bg-blue-500/10 text-slate-900 dark:text-blue-400 shadow-sm ring-1 ring-slate-200 dark:ring-blue-500/30' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
              >
                Bank Transfer (NGN)
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              
              {/* LEFT: Instructions / Details */}
              <div className="order-2 lg:order-1">
                {depositMethod === 'crypto' ? (
                  <div className="space-y-6">
                    <div>
                      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3 block">Select Network</label>
                      <div className="flex flex-wrap gap-2">
                        {Object.keys(adminWallets).map((net) => (
                          <button 
                            key={net} 
                            onClick={() => setDepositNetwork(net)} 
                            className={`py-2 px-4 rounded-xl text-xs font-bold transition-all duration-300 ${depositNetwork === net ? 'bg-slate-900 dark:bg-blue-600 text-white shadow-md' : 'bg-slate-50 dark:bg-white/[0.02] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10 hover:border-blue-500/50'}`}
                          >
                            {net}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="bg-slate-50 dark:bg-[#060913] border border-slate-200 dark:border-white/[0.08] rounded-[2rem] p-8 flex flex-col items-center text-center relative overflow-hidden">
                      <div className="absolute top-0 w-full h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
                      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-8 mt-2">
                        <QRCode size={160} value={getQRValue(depositNetwork, adminWallets[depositNetwork])} />
                      </div>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Your Deposit Address</p>
                      <div className="w-full flex items-center justify-between gap-3 bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-white/[0.08] rounded-2xl px-5 py-4 shadow-sm">
                        <span className="font-mono text-sm text-slate-800 dark:text-slate-200 truncate select-all">{adminWallets[depositNetwork]}</span>
                        <button 
                          onClick={() => {navigator.clipboard.writeText(adminWallets[depositNetwork]); alert("Address Copied!");}}
                          className="p-2.5 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors shrink-0"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gradient-to-br from-slate-900 to-slate-800 dark:from-[#060913] dark:to-[#0B1120] rounded-[2rem] p-10 text-white relative overflow-hidden shadow-xl border border-slate-700 dark:border-white/[0.05]">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>
                    <Landmark className="w-10 h-10 text-emerald-400 mb-8" />
                    
                    <div className="space-y-6 relative z-10">
                      <div>
                        <p className="text-slate-400 text-xs uppercase tracking-widest font-bold mb-1.5">Bank Name</p>
                        <p className="font-bold text-xl">{adminBankDetails.bankName}</p>
                      </div>
                      
                      <div>
                        <p className="text-slate-400 text-xs uppercase tracking-widest font-bold mb-1.5">Account Number</p>
                        <div className="flex items-center gap-4">
                          <p className="font-mono font-bold text-4xl tracking-widest">{adminBankDetails.accountNumber}</p>
                          <button 
                            onClick={() => {navigator.clipboard.writeText(adminBankDetails.accountNumber); alert("Account Copied!");}}
                            className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition backdrop-blur-sm"
                          >
                            <Copy className="w-5 h-5 text-emerald-400" />
                          </button>
                        </div>
                      </div>

                      <div>
                        <p className="text-slate-400 text-xs uppercase tracking-widest font-bold mb-1.5">Account Name</p>
                        <p className="font-medium text-lg text-slate-200">{adminBankDetails.accountName}</p>
                      </div>
                    </div>

                    {/* DYNAMIC NAIRA HINT FOR BANK TRANSFER */}
                    {depositAmount && (
                      <div className="mt-10 p-5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl backdrop-blur-md">
                        <p className="text-sm text-emerald-100/90 leading-relaxed">
                          Please transfer exactly <span className="font-bold text-white text-lg tracking-wide">{formatNGN(depositAmount)}</span> to this account to fund ${depositAmount}.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* RIGHT: Input Form */}
              <div className="order-1 lg:order-2 space-y-8">
                
                {/* Dynamic Amount Input */}
                <div className="bg-slate-50 dark:bg-white/[0.02] p-8 rounded-[2rem] border border-slate-200/80 dark:border-white/[0.05]">
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">How much are you adding?</label>
                  <div className="relative flex items-center justify-center bg-white dark:bg-[#0B1120] rounded-2xl border border-slate-200 dark:border-white/[0.08] p-2 focus-within:ring-2 focus-within:ring-blue-500/50 focus-within:border-blue-500/50 transition-all shadow-sm">
                    <span className="text-3xl font-bold text-slate-400 pl-6">$</span>
                    <input 
                      type="number" 
                      value={depositAmount} 
                      onChange={(e) => setDepositAmount(e.target.value)} 
                      placeholder="0.00" 
                      className="w-full bg-transparent text-5xl font-bold text-slate-900 dark:text-white outline-none py-6 px-4" 
                    />
                  </div>
                  
                  {/* NAIRA CONVERSION DISPLAY */}
                  <div className="mt-6 flex items-center justify-between px-2">
                     <span className="text-sm font-medium text-slate-500 flex items-center gap-1.5">
                        <Info className="w-4 h-4" /> Approx. in Naira
                     </span>
                     <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400 tracking-tight">
                        {depositAmount ? formatNGN(depositAmount) : '₦ 0.00'}
                     </span>
                  </div>
                </div>

                {depositMethod === 'crypto' && (
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3 pl-2">Transaction Hash (Proof)</label>
                    <input 
                      type="text" 
                      value={txHash} 
                      onChange={(e) => setTxHash(e.target.value)} 
                      placeholder="Paste your TXID here after sending..." 
                      className="w-full px-6 py-5 bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-white/[0.08] rounded-2xl font-mono text-sm outline-none focus:ring-2 focus:ring-blue-500/50 transition-all shadow-sm" 
                    />
                  </div>
                )}
                
                <button 
                  onClick={handleDeposit} 
                  disabled={isVerifying || !depositAmount || (depositMethod === 'crypto' && !txHash)} 
                  className="group relative w-full overflow-hidden rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold py-5 flex items-center justify-center gap-2 transition-transform active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(255,255,255,0.1)]"
                >
                  <div className="absolute inset-0 bg-white/20 dark:bg-black/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                  <span className="relative flex items-center gap-2">
                    {isVerifying ? <Loader2 className="animate-spin w-6 h-6" /> : "I've sent the money"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==========================================
            WITHDRAW VIEW 
            ========================================== */}
        {activeTab === 'withdraw' && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            
            {!withdrawMethod ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-3xl flex items-center justify-center mb-8 shadow-xl shadow-blue-500/20 rotate-3">
                  <ArrowUpRight className="w-10 h-10 -rotate-3" />
                </div>
                <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">Cash Out</h3>
                <p className="text-slate-500 text-lg mb-12 text-center max-w-md leading-relaxed">
                  Select where you want us to send your funds. Processed within 24 hours.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl">
                  <button 
                    onClick={() => setWithdrawMethod('crypto')}
                    className="flex flex-col items-center justify-center gap-5 p-10 rounded-[2rem] bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.05] hover:border-blue-500/50 dark:hover:border-blue-500/50 hover:bg-white dark:hover:bg-[#0B1120] transition-all duration-300 group shadow-sm hover:shadow-xl"
                  >
                    <div className="p-5 bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-2xl group-hover:scale-110 transition-transform duration-500">
                      <Wallet className="w-8 h-8" />
                    </div>
                    <span className="font-bold text-xl text-slate-900 dark:text-white">Crypto Wallet</span>
                  </button>

                  <button 
                    onClick={() => setWithdrawMethod('fiat')}
                    className="flex flex-col items-center justify-center gap-5 p-10 rounded-[2rem] bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.05] hover:border-emerald-500/50 dark:hover:border-emerald-500/50 hover:bg-white dark:hover:bg-[#0B1120] transition-all duration-300 group shadow-sm hover:shadow-xl"
                  >
                    <div className="p-5 bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl group-hover:scale-110 transition-transform duration-500">
                      <Landmark className="w-8 h-8" />
                    </div>
                    <span className="font-bold text-xl text-slate-900 dark:text-white">Local Bank</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="max-w-2xl mx-auto space-y-10">
                <button onClick={() => setWithdrawMethod(null)} className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition group">
                  <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Back
                </button>
                
                <div>
                  <h3 className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
                    Send to {withdrawMethod === 'crypto' ? 'Crypto Wallet' : 'Bank Account'}
                  </h3>
                  <p className="text-slate-500 mt-2 text-lg">Available to withdraw: <span className="font-bold text-slate-900 dark:text-white">${wallet.available.toFixed(2)}</span></p>
                </div>

                <div className="space-y-8">
                  
                  {/* Amount Input */}
                  <div className="bg-slate-50 dark:bg-white/[0.02] p-8 rounded-[2rem] border border-slate-200/80 dark:border-white/[0.05]">
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Amount to withdraw</label>
                    <div className="relative flex items-center justify-center bg-white dark:bg-[#0B1120] rounded-2xl border border-slate-200 dark:border-white/[0.08] p-2 focus-within:ring-2 focus-within:ring-blue-500/50 transition-all shadow-sm">
                      <span className="text-3xl font-bold text-slate-400 pl-6">$</span>
                      <input 
                        type="number" 
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        placeholder="0.00"
                        className="w-full bg-transparent text-5xl font-bold text-slate-900 dark:text-white outline-none py-5 px-4"
                      />
                    </div>
                    
                    <div className="mt-6 flex items-center justify-between px-2">
                       <span className="text-sm font-medium text-slate-500">You will receive approx.</span>
                       <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400 tracking-tight">
                          {withdrawAmount ? formatNGN(withdrawAmount) : '₦ 0.00'}
                       </span>
                    </div>
                  </div>

                  {withdrawMethod === 'crypto' ? (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3 pl-2">Select Network</label>
                        <select 
                          value={withdrawNetwork}
                          onChange={(e) => setWithdrawNetwork(e.target.value)}
                          className="w-full px-6 py-5 bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-white/[0.08] rounded-2xl font-bold outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none shadow-sm"
                        >
                          <option value="USDT-TRC20">USDT (Tron TRC20)</option>
                          <option value="BTC">Bitcoin (BTC)</option>
                          <option value="ETH">Ethereum (ERC20)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3 pl-2">Destination Address</label>
                        <input 
                          type="text" 
                          value={cryptoAddress}
                          onChange={(e) => setCryptoAddress(e.target.value)}
                          placeholder="Paste your wallet address"
                          className="w-full px-6 py-5 bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-white/[0.08] rounded-2xl font-mono text-sm outline-none focus:ring-2 focus:ring-blue-500/50 shadow-sm transition-all"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3 pl-2">Bank Name</label>
                          <input 
                            type="text" 
                            value={bankDetails.bankName}
                            onChange={(e) => setBankDetails({...bankDetails, bankName: e.target.value})}
                            placeholder="e.g. GTBank"
                            className="w-full px-6 py-5 bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-white/[0.08] rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/50 shadow-sm transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3 pl-2">Account Number</label>
                          <input 
                            type="text" 
                            value={bankDetails.accountNumber}
                            onChange={(e) => setBankDetails({...bankDetails, accountNumber: e.target.value})}
                            placeholder="0123456789"
                            className="w-full px-6 py-5 bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-white/[0.08] rounded-2xl font-mono text-sm outline-none focus:ring-2 focus:ring-blue-500/50 shadow-sm transition-all"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3 pl-2">Account Holder Name</label>
                        <input 
                          type="text" 
                          value={bankDetails.accountHolder}
                          onChange={(e) => setBankDetails({...bankDetails, accountHolder: e.target.value})}
                          placeholder="John Doe"
                          className="w-full px-6 py-5 bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-white/[0.08] rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/50 shadow-sm transition-all"
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-4 p-5 bg-blue-50/50 dark:bg-blue-500/5 border border-blue-100 dark:border-blue-500/10 text-blue-700 dark:text-blue-300 rounded-2xl">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <p className="text-sm leading-relaxed">
                      Make sure your details are correct. All withdrawals are manually reviewed and sent within 24 hours.
                    </p>
                  </div>

                  <button 
                    onClick={handleWithdraw}
                    disabled={isWithdrawing || !withdrawAmount || (withdrawMethod === 'crypto' ? !cryptoAddress : (!bankDetails.bankName || !bankDetails.accountNumber || !bankDetails.accountHolder))}
                    className="group relative w-full overflow-hidden rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold py-5 flex items-center justify-center gap-2 transition-transform active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(255,255,255,0.1)]"
                  >
                    <div className="absolute inset-0 bg-white/20 dark:bg-black/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                    <span className="relative flex items-center gap-2">
                      {isWithdrawing ? <Loader2 className="animate-spin w-6 h-6" /> : "Confirm Withdrawal"}
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* --- CLEAN HISTORY TABLE --- */}
      <div className="bg-white dark:bg-[#0B1120] rounded-[2rem] shadow-sm border border-slate-200/80 dark:border-white/[0.08] overflow-hidden">
        <div className="p-8 border-b border-slate-100 dark:border-white/[0.05] flex items-center gap-4 bg-slate-50/50 dark:bg-white/[0.01]">
          <div className="p-2.5 bg-slate-200/50 dark:bg-white/5 rounded-xl">
            <History className="w-5 h-5 text-slate-700 dark:text-slate-300" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Recent Transactions</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-white dark:bg-[#0B1120] text-slate-400 text-[11px] uppercase tracking-widest font-bold">
              <tr>
                <th className="px-8 py-6 border-b border-slate-100 dark:border-white/[0.05]">Transaction</th>
                <th className="px-8 py-6 border-b border-slate-100 dark:border-white/[0.05]">Date</th>
                <th className="px-8 py-6 border-b border-slate-100 dark:border-white/[0.05]">Status</th>
                <th className="px-8 py-6 border-b border-slate-100 dark:border-white/[0.05] text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {history.map((tx) => (
                <tr key={tx._id || tx.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors group">
                  <td className="px-8 py-5 border-b border-slate-50 dark:border-white/[0.02]">
                    <p className="font-bold text-slate-900 dark:text-white">{tx.type}</p>
                    <p className="text-xs text-slate-500 mt-1">{tx.method}</p>
                  </td>
                  <td className="px-8 py-5 border-b border-slate-50 dark:border-white/[0.02] text-slate-500 font-medium">
                    {new Date(tx.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-8 py-5 border-b border-slate-50 dark:border-white/[0.02]">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide
                      ${tx.status === 'Success' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' 
                      : tx.status === 'Pending' ? 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400'
                      : 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400'}`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className={`px-8 py-5 border-b border-slate-50 dark:border-white/[0.02] text-right font-bold text-lg tracking-tight ${tx.type === 'Withdrawal' ? 'text-slate-900 dark:text-white' : 'text-emerald-600 dark:text-emerald-400'}`}>
                    {tx.type === 'Withdrawal' ? '-' : '+'}${tx.amount.toFixed(2)}
                  </td>
                </tr>
              ))}
              {history.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center text-slate-400 font-medium bg-slate-50/50 dark:bg-transparent">
                    No transactions yet. Add money to get started.
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