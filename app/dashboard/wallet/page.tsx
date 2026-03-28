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
    if (!withdrawAmount) return alert("Please enter an amount.");

    let finalDestination = '';
    if (withdrawMethod === 'crypto') {
      if (!cryptoAddress) return alert("Please enter your wallet address.");
      finalDestination = cryptoAddress;
    } else {
      if (!bankDetails.bankName || !bankDetails.accountNumber || !bankDetails.accountHolder) {
        return alert("Please fill out all bank details.");
      }
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
        <Loader2 className="w-8 h-8 text-[#337ab7] animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16 font-sans text-[#333333]">

      {/* --- CLASSIC BALANCE PANEL (Bootstrap Primary Style) --- */}
      <div className="bg-[#337ab7] border border-[#2e6da4] rounded shadow-sm p-8 text-white flex flex-col md:flex-row justify-between items-center gap-8">

        <div className="text-center md:text-left">
          <div className="inline-flex items-center gap-2 mb-2">
            <Wallet className="w-5 h-5 text-[#c4e3f3]" />
            <span className="text-sm font-bold uppercase tracking-wider text-[#c4e3f3]">Total Balance</span>
          </div>
          <h2 className="text-5xl font-bold mb-4">
            ₦{wallet.total.toFixed(2)}
          </h2>
          <div className="flex flex-wrap justify-center md:justify-start gap-4">
            <div className="flex items-center gap-2 bg-[#286090] border border-[#1e4b73] px-3 py-1.5 rounded text-sm">
              <CheckCircle2 className="w-4 h-4 text-[#5cb85c]" />
              <span>Available: <strong className="ml-1"> ₦{wallet.available.toFixed(2)}</strong></span>
            </div>
            <div className="flex items-center gap-2 bg-[#286090] border border-[#1e4b73] px-3 py-1.5 rounded text-sm">
              <Lock className="w-4 h-4 text-[#f0ad4e]" />
              <span>Locked: <strong className="ml-1"> ₦{wallet.locked.toFixed(2)}</strong></span>
            </div>
          </div>
        </div>
        
      </div>

      {/* --- ACTION PANEL --- */}
      <div className="bg-white rounded shadow-sm border border-[#dddddd] p-6 md:p-8 min-h-[400px]">

          <div>
            {!withdrawMethod ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-16 h-16 bg-[#f5f5f5] text-[#337ab7] border border-[#dddddd] rounded-full flex items-center justify-center mb-6">
                  <ArrowUpRight className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-[#222222] mb-2">Withdraw funds</h3>
                <p className="text-[#666666] text-center max-w-md mb-8">
                  Select where you want us to send your funds. Processed within 24 hours.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-xl">
                  <button
                    onClick={() => setWithdrawMethod('crypto')}
                    className="flex flex-col items-center justify-center gap-3 p-8 rounded bg-[#f9f9f9] border border-[#dddddd] hover:border-[#66afe9] hover:bg-white transition-colors group shadow-sm"
                  >
                    <Wallet className="w-8 h-8 text-[#337ab7]" />
                    <span className="font-bold text-[#333333]">Crypto Wallet</span>
                  </button>

                  <button
                    onClick={() => setWithdrawMethod('fiat')}
                    className="flex flex-col items-center justify-center gap-3 p-8 rounded bg-[#f9f9f9] border border-[#dddddd] hover:border-[#66afe9] hover:bg-white transition-colors group shadow-sm"
                  >
                    <Landmark className="w-8 h-8 text-[#337ab7]" />
                    <span className="font-bold text-[#333333]">Local Bank</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="max-w-2xl mx-auto">
                <button onClick={() => setWithdrawMethod(null)} className="flex items-center gap-1 text-sm font-bold text-[#337ab7] hover:underline mb-6">
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>

                <div className="border-b border-[#eeeeee] pb-4 mb-6">
                  <h3 className="text-2xl font-bold text-[#222222]">
                    Send to {withdrawMethod === 'crypto' ? 'Crypto Wallet' : 'Bank Account'}
                  </h3>
                  <p className="text-[#666666] mt-1">Available to withdraw: <strong className="text-[#333333]"> ₦{wallet.available.toFixed(2)}</strong></p>
                </div>

                <div className="space-y-6">

                  {/* Amount Input */}
                  <div>
                    <label className="block text-sm font-bold text-[#333333] mb-2">Amount to withdraw</label>
                    <div className="flex shadow-sm">
                      <span className="bg-[#eeeeee] border border-[#cccccc] border-r-0 px-4 py-3 text-[#555555] font-bold rounded-l text-xl">$</span>
                      <input
                        type="number"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        placeholder="0.00"
                        className="flex-1 bg-white border border-[#cccccc] focus:border-[#66afe9] focus:shadow-[inset_0_1px_1px_rgba(0,0,0,0.075),0_0_8px_rgba(102,175,233,0.6)] text-[#333333] rounded-r px-4 py-3 outline-none text-2xl font-bold transition-all"
                      />
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs font-bold text-[#777777]">You will receive approx.</span>
                      <span className="text-base font-bold text-[#5cb85c]">
                        {withdrawAmount ? formatNGN(withdrawAmount) : '₦ 0.00'}
                      </span>
                    </div>
                  </div>

                  {withdrawMethod === 'crypto' ? (
                    <div className="space-y-5">
                      <div>
                        <label className="block text-sm font-bold text-[#333333] mb-2">Select Network</label>
                        <select
                          value={withdrawNetwork}
                          onChange={(e) => setWithdrawNetwork(e.target.value)}
                          className="w-full px-3 py-2.5 bg-white border border-[#cccccc] focus:border-[#66afe9] rounded text-sm text-[#333333] outline-none shadow-sm"
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
                          className="w-full px-4 py-2.5 bg-white border border-[#cccccc] focus:border-[#66afe9] focus:shadow-[inset_0_1px_1px_rgba(0,0,0,0.075),0_0_8px_rgba(102,175,233,0.6)] rounded font-mono text-sm outline-none shadow-sm transition-all"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-bold text-[#333333] mb-2">Bank Name</label>
                          <input
                            type="text"
                            value={bankDetails.bankName}
                            onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })}
                            placeholder="e.g. GTBank"
                            className="w-full px-4 py-2.5 bg-white border border-[#cccccc] focus:border-[#66afe9] focus:shadow-[inset_0_1px_1px_rgba(0,0,0,0.075),0_0_8px_rgba(102,175,233,0.6)] rounded text-sm outline-none shadow-sm transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-[#333333] mb-2">Account Number</label>
                          <input
                            type="text"
                            value={bankDetails.accountNumber}
                            onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
                            placeholder="0123456789"
                            className="w-full px-4 py-2.5 bg-white border border-[#cccccc] focus:border-[#66afe9] focus:shadow-[inset_0_1px_1px_rgba(0,0,0,0.075),0_0_8px_rgba(102,175,233,0.6)] rounded font-mono text-sm outline-none shadow-sm transition-all"
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
                          className="w-full px-4 py-2.5 bg-white border border-[#cccccc] focus:border-[#66afe9] focus:shadow-[inset_0_1px_1px_rgba(0,0,0,0.075),0_0_8px_rgba(102,175,233,0.6)] rounded text-sm outline-none shadow-sm transition-all"
                        />
                      </div>
                    </div>
                  )}

                  {/* Classic Bootstrap Alert Info */}
                  <div className="flex items-start gap-3 p-4 bg-[#d9edf7] border border-[#bce8f1] text-[#31708f] rounded mt-6">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <p className="text-sm">
                      Make sure your details are correct. All withdrawals are manually reviewed and sent within 24 hours.
                    </p>
                  </div>

                  <button
                    onClick={handleWithdraw}
                    disabled={isWithdrawing || !withdrawAmount || (withdrawMethod === 'crypto' ? !cryptoAddress : (!bankDetails.bankName || !bankDetails.accountNumber || !bankDetails.accountHolder))}
                    className="w-full bg-[#5cb85c] hover:bg-[#449d44] border border-[#4cae4c] text-white font-bold py-3 rounded shadow-sm flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed mt-4"
                  >
                    {isWithdrawing ? <Loader2 className="animate-spin w-5 h-5" /> : "Confirm Withdrawal"}
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
                    <p className="font-bold text-[#222222]">{tx.type}</p>
                    <p className="text-xs text-[#777777] mt-0.5">{tx.method}</p>
                  </td>
                  <td className="px-6 py-4 text-[#666666]">
                    {new Date(tx.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4">
                    {/* Classic Bootstrap Badges */}
                    <span className={`inline-block px-2 py-1 rounded text-xs font-bold text-white
                      ${tx.status === 'Success' ? 'bg-[#5cb85c]'
                        : tx.status === 'Pending' ? 'bg-[#f0ad4e]'
                          : 'bg-[#d9534f]'}`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className={`px-6 py-4 text-right font-bold text-base ${tx.type === 'Withdrawal' ? 'text-[#222222]' : 'text-[#3c763d]'}`}>
                    {tx.type === 'Withdrawal' ? '-' : '+'}${tx.amount.toFixed(2)}
                  </td>
                </tr>
              ))}
              {history.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-[#999999]">
                    No withdrawals yet
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