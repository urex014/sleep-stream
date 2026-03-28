'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Copy, 
  CheckCircle2, 
  XCircle, 
  RefreshCw,
  Loader2
} from 'lucide-react';

export default function AccessCodes() {
  
  // --- STATE ---
  const [filter, setFilter] = useState('All');
  const [batchSize, setBatchSize] = useState(10);
  const [isGenerating, setIsGenerating] = useState(false);
  const [codes, setCodes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- FETCH CODES ON LOAD ---
  useEffect(() => {
    fetchCodes();
  }, []);

  const fetchCodes = async () => {
    try {
      // Create a GET route for this later at /api/admin/codes
      // For now, if you only have the generate route, this part needs a corresponding GET API.
      // Assuming you will add: app/api/admin/codes/route.ts (GET)
      const res = await fetch('/api/admin/codes'); 
      const data = await res.json();
      if (data.success) {
        setCodes(data.codes);
      }
    } catch (error) {
      console.error("Failed to fetch codes");
    } finally {
      setIsLoading(false);
    }
  };

  // --- ACTIONS ---

  const generateCodes = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/admin/codes/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: batchSize }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        alert(`${data.count} Codes Generated Successfully!`);
        // Refresh list (In a real app, maybe just append new ones to avoid refetch)
        fetchCodes(); 
      } else {
        alert('Failed: ' + data.message);
      }
    } catch (error) {
      alert('Error connecting to server');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert(`Copied: ${text}`);
  };

  const filteredCodes = codes.filter(c => {
    if (filter === 'All') return true;
    return c.status === filter;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Access Codes</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Generate and manage activation keys.</p>
        </div>
        
        {/* Quick Stats */}
        <div className="flex gap-4">
          <div className="bg-white dark:bg-slate-900 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold">Active</p>
            <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
              {codes.filter(c => c.status === 'Active').length}
            </p>
          </div>
          <div className="bg-white dark:bg-slate-900 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold">Used</p>
            <p className="text-xl font-bold text-slate-900 dark:text-white">
              {codes.filter(c => c.status === 'Used').length}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT: GENERATOR PANEL */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm sticky top-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
                <RefreshCw className={`w-5 h-5 ${isGenerating ? 'animate-spin' : ''}`} />
              </div>
              <h2 className="font-bold text-slate-900 dark:text-white">Generate Batch</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">
                  Quantity
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[10, 50, 100].map((num) => (
                    <button
                      key={num}
                      onClick={() => setBatchSize(num)}
                      className={`py-2 rounded-lg text-sm font-bold border transition-all
                        ${batchSize === num 
                          ? 'bg-blue-600 text-white border-blue-600' 
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-400'
                        }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-500 dark:text-slate-400">Value per Code</span>
                  <span className="font-bold text-slate-900 dark:text-white">N4500</span>
                </div>
                <div className="flex justify-between text-sm pt-2 border-t border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500 dark:text-slate-400">Total Value</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">N{batchSize * 4500}</span>
                </div>
              </div>

              <button 
                onClick={generateCodes}
                disabled={isGenerating}
                className="w-full bg-slate-900 dark:bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-slate-200 dark:shadow-blue-900/20 flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isGenerating ? 'Generating...' : 'Generate Codes'} <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT: CODE LIST */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Controls */}
          <div className="flex gap-2 mb-4">
            {['All', 'Active', 'Used'].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors ${
                  filter === tab 
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden min-h-[300px]">
            {isLoading ? (
              <div className="flex justify-center items-center h-48">
                <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
              </div>
            ) : (
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 font-medium border-b border-slate-100 dark:border-slate-800">
                  <tr>
                    <th className="px-6 py-4">Code</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Date Created</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredCodes.map((item) => (
                    <tr key={item._id || item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-slate-700 dark:text-slate-200 tracking-wide">
                        {item.code}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold
                          ${item.status === 'Active' 
                            ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400' 
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          {item.status === 'Active' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-500 dark:text-slate-500 text-xs">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => copyToClipboard(item.code)}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition"
                          title="Copy Code"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            
            {!isLoading && filteredCodes.length === 0 && (
              <div className="p-12 text-center text-slate-400">
                No codes found. Generate a new batch to get started.
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}