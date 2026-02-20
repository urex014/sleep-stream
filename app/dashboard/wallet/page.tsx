/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import { 
  Wallet, ArrowDownLeft, ArrowUpRight, History, CheckCircle2, 
  Lock, Copy, AlertCircle, CreditCard, Landmark, Loader2, ChevronLeft 
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

  // --- WITHDRAW STATES ---
  const [withdrawMethod, setWithdrawMethod] = useState<'crypto' | 'fiat' | null>(null);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawDestination, setWithdrawDestination] = useState(''); // Address or Account Number
  const [withdrawNetwork, setWithdrawNetwork] = useState('USDT-TRC20');
  const [isWithdrawing, setIsWithdrawing] = useState(false);

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
    case 'BTC':
      return `bitcoin:${address}`;
    case 'ETH':
      return `ethereum:${address}`;
    case 'USDT-TRC20':
      return `tron:${address}`;
    case 'SOL':
      return `solana:${address}`;
    case 'BNB':
    case 'USDT-BEP20':
      return `ethereum:${address}`; 
    default:
      return address;
  }
};
  
  const adminBankDetails = {
    bankName: "Fidelity Bank Plc",
    accountNumber: "6540001694",
    accountName: "SleepStream Enterprise"
  };

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
    if (!withdrawAmount || !withdrawDestination) return alert("Please fill all fields");
    setIsWithdrawing(true);
    try {
      const res = await fetch('/api/user/dashboard/wallet/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseFloat(withdrawAmount),
          method: withdrawMethod,
          destination: withdrawDestination,
          network: withdrawNetwork
        }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Withdrawal Request Sent! Status: Pending");
        setWithdrawAmount('');
        setWithdrawDestination('');
        setWithdrawMethod(null); // Reset view
        fetchWalletData(); // Update balance immediately
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Network Error");
    } finally {
      setIsWithdrawing(false);
    }
  };

  if (isLoadingData) return <div className="min-h-[60vh] flex items-center justify-center"><Loader2 className="w-10 h-10 text-blue-600 animate-spin" /></div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-10">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">My Wallet</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Manage your deposits and withdrawals securely.</p>
      </div>

      {/* Balance Card */}
      <div className="bg-gradient-to-r from-slate-900 to-blue-900 dark:from-slate-950 dark:to-blue-950 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden border border-slate-800">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-2 text-slate-300 mb-1">
              <Wallet className="w-5 h-5" />
              <span className="text-sm font-medium">Total Balance</span>
            </div>
            <h2 className="text-5xl font-bold tracking-tight">${wallet.total.toFixed(2)}</h2>
            <div className="flex items-center gap-4 mt-3 text-sm">
              <span className="flex items-center gap-1 text-emerald-400"><CheckCircle2 className="w-3 h-3" /> Available: ${wallet.available.toFixed(2)}</span>
              <span className="flex items-center gap-1 text-slate-400"><Lock className="w-3 h-3" /> Locked: ${wallet.locked.toFixed(2)}</span>
            </div>
          </div>
           <div className="flex gap-3 w-full md:w-auto">
             <button onClick={() => setActiveTab('deposit')} className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold transition-all border ${activeTab === 'deposit' ? 'bg-white text-blue-900 border-white shadow-lg' : 'bg-white/10 text-white border-white/10 hover:bg-white/20'}`}>
               <ArrowDownLeft className="w-4 h-4" /> Fund Wallet
             </button>
             <button onClick={() => setActiveTab('withdraw')} className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold transition-all border ${activeTab === 'withdraw' ? 'bg-white text-blue-900 border-white shadow-lg' : 'bg-white/10 text-white border-white/10 hover:bg-white/20'}`}>
               <ArrowUpRight className="w-4 h-4" /> Withdraw
             </button>
          </div>
        </div>
      </div>

      {/* ACTION PANEL */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden min-h-[400px]">
        
        {/* --- DEPOSIT VIEW --- */}
        {activeTab === 'deposit' && (
          <div className="p-6 md:p-8 animate-in fade-in slide-in-from-left-4 duration-300">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2"><CreditCard className="w-6 h-6 text-slate-400" /> Fund Wallet</h3>
              <div className="flex p-1 bg-slate-100 dark:bg-slate-700/50 rounded-xl border border-slate-200 dark:border-slate-700">
                <button onClick={() => setDepositMethod('crypto')} className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${depositMethod === 'crypto' ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm ring-1 ring-black/5' : 'text-slate-500'}`}>Crypto</button>
                <button onClick={() => setDepositMethod('fiat')} className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${depositMethod === 'fiat' ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm ring-1 ring-black/5' : 'text-slate-500'}`}>Bank Transfer</button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                {depositMethod === 'crypto' ? (
                  <>
                    <div className="grid grid-cols-3 gap-2">
                      {Object.keys(adminWallets).map((net) => (
                        <button key={net} onClick={() => setDepositNetwork(net)} className={`py-2 px-2 rounded-xl text-[10px] font-bold border ${depositNetwork === net ? 'bg-slate-900 dark:bg-blue-600 text-white' : 'bg-slate-50 dark:bg-slate-800'}`}>{net}</button>
                      ))}
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 flex flex-col items-center text-center">
                      <div className="bg-white p-4 rounded-xl mb-4"><QRCode size={120} value={getQRValue(depositNetwork, adminWallets[depositNetwork])} /></div>
                      <div className="w-full flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 shadow-sm">
                        <span className="font-mono text-xs truncate flex-1">{adminWallets[depositNetwork]}</span>
                        <button onClick={() => {navigator.clipboard.writeText(adminWallets[depositNetwork]); alert("Copied!");}}><Copy className="w-4 h-4 text-blue-500" /></button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 text-center">
                    <p className="font-bold mb-2">Bank Transfer Details</p>
                    <div className="text-sm space-y-2 text-slate-600 dark:text-slate-400">
                      <p>Bank: {adminBankDetails.bankName}</p>
                      <p>Acct: {adminBankDetails.accountNumber}</p>
                      <p>Name: {adminBankDetails.accountName}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div>
                   <label className="block text-sm font-bold mb-2">Amount (USD)</label>
                   <input type="number" value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)} placeholder="50.00" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-bold" />
                </div>
                {depositMethod === 'crypto' && (
                  <div>
                    <label className="block text-sm font-bold mb-2">Transaction Hash</label>
                    <input type="text" value={txHash} onChange={(e) => setTxHash(e.target.value)} placeholder="e.g. 0x..." className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-sm" />
                  </div>
                )}
                <button onClick={handleDeposit} disabled={isVerifying} className="w-full bg-slate-900 dark:bg-blue-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2">
                  {isVerifying ? <Loader2 className="animate-spin w-5 h-5" /> : "I Have Made Payment"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- WITHDRAW VIEW (UPDATED) --- */}
        {activeTab === 'withdraw' && (
          <div className="p-6 md:p-8 animate-in fade-in slide-in-from-right-4 duration-300">
            
            {!withdrawMethod ? (
              // STEP 1: CHOOSE METHOD
              <div className="h-full flex flex-col items-center justify-center space-y-8 py-10">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Choose Withdrawal Method</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-lg">
                  <button 
                    onClick={() => setWithdrawMethod('crypto')}
                    className="flex flex-col items-center justify-center gap-4 p-8 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-blue-500 hover:shadow-md transition-all group"
                  >
                    <div className="p-4 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-full group-hover:scale-110 transition-transform">
                      <Wallet className="w-8 h-8" />
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white">Crypto Wallet</span>
                  </button>

                  <button 
                    onClick={() => setWithdrawMethod('fiat')}
                    className="flex flex-col items-center justify-center gap-4 p-8 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 hover:shadow-md transition-all group"
                  >
                    <div className="p-4 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-full group-hover:scale-110 transition-transform">
                      <Landmark className="w-8 h-8" />
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white">Bank Transfer</span>
                  </button>
                </div>
              </div>
            ) : (
              // STEP 2: WITHDRAWAL FORM
              <div className="max-w-lg mx-auto space-y-6">
                <button onClick={() => setWithdrawMethod(null)} className="flex items-center gap-1 text-sm text-slate-500 hover:text-blue-600 transition mb-4">
                  <ChevronLeft className="w-4 h-4" /> Back to methods
                </button>
                
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
                  Withdraw via {withdrawMethod === 'crypto' ? 'Crypto' : 'Bank'}
                </h3>

                <div className="space-y-4">
                  {/* Amount */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Amount to Withdraw</label>
                    <div className="relative">
                      <span className="absolute left-4 top-3.5 text-slate-400 font-bold">$</span>
                      <input 
                        type="number" 
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        placeholder="0.00"
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-bold outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <p className="text-xs text-slate-500 mt-1 text-right">Available: ${wallet.available.toFixed(2)}</p>
                  </div>

                  {/* Destination Input */}
                  {withdrawMethod === 'crypto' ? (
                    <>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Network</label>
                        <select 
                          value={withdrawNetwork}
                          onChange={(e) => setWithdrawNetwork(e.target.value)}
                          className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none"
                        >
                          <option value="USDT-TRC20">USDT (TRC20)</option>
                          <option value="BTC">Bitcoin</option>
                          <option value="ETH">Ethereum</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Wallet Address</label>
                        <input 
                          type="text" 
                          value={withdrawDestination}
                          onChange={(e) => setWithdrawDestination(e.target.value)}
                          placeholder="Paste your wallet address"
                          className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-sm outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </>
                  ) : (
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Bank Details</label>
                      <textarea 
                        value={withdrawDestination}
                        onChange={(e) => setWithdrawDestination(e.target.value)}
                        placeholder="Bank Name, Account Number, Account Name"
                        rows={3}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      />
                    </div>
                  )}

                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl flex gap-3 items-start border border-blue-100 dark:border-blue-800">
                    <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                      Withdrawals are processed manually by our team. Please allow up to 24 hours for the status to change from <b>Pending</b> to <b>Success</b>.
                    </p>
                  </div>

                  <button 
                    onClick={handleWithdraw}
                    disabled={isWithdrawing}
                    className="w-full bg-slate-900 dark:bg-blue-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-800 transition-all disabled:opacity-70"
                  >
                    {isWithdrawing ? <Loader2 className="animate-spin w-5 h-5" /> : "Submit Withdrawal Request"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Transaction History Table (Unchanged) */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex items-center gap-2">
          <History className="w-5 h-5 text-slate-400 dark:text-slate-500" />
          <h3 className="font-bold text-slate-900 dark:text-white">Transaction History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 font-medium">
              <tr>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {history.map((tx) => (
                <tr key={tx._id || tx.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                    {tx.type} <span className="text-xs text-slate-400 block font-normal">{tx.method}</span>
                  </td>
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                    {new Date(tx.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border
                      ${tx.status === 'Success' 
                        ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800' 
                        : 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-100 dark:border-amber-800'
                      }`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className={`px-6 py-4 text-right font-bold ${tx.type === 'Withdrawal' ? 'text-red-500' : 'text-emerald-500'}`}>
                    {tx.type === 'Withdrawal' ? '-' : '+'}${tx.amount.toFixed(2)}
                  </td>
                </tr>
              ))}
              {history.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-400">No transactions found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}