'use client';

import React, { useState } from 'react';
import { Store, Plus, Trash2, MessageCircle, Phone, CreditCard, Bitcoin } from 'lucide-react';

export default function VendorRegistry() {
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    paymentType: 'Crypto', // Crypto or Bank
    platform: 'WhatsApp', // WhatsApp or Telegram
    contact: ''
  });

  // Mock Vendor List
  const [vendors, setVendors] = useState([
    { id: 1, name: "Crypto Exchange Naija", paymentType: "Crypto", platform: "WhatsApp", contact: "1234567890" },
    { id: 2, name: "FastCodes Agent", paymentType: "Bank Transfer", platform: "Telegram", contact: "fastcodes_ng" },
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newVendor = { ...formData, id: Date.now() };
    setVendors([...vendors, newVendor]);
    setFormData({ name: '', paymentType: 'Crypto', platform: 'WhatsApp', contact: '' }); // Reset
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
      
      {/* Left: Registration Form */}
      <div className="lg:col-span-1">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm sticky top-24">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <Plus className="w-5 h-5 text-blue-500" /> Register New Vendor
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Vendor Name</label>
              <input 
                type="text" 
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Payment Method</label>
              <select 
                value={formData.paymentType}
                onChange={(e) => setFormData({...formData, paymentType: e.target.value})}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm outline-none focus:border-blue-500 text-slate-700 dark:text-slate-300"
              >
                <option value="Crypto">Crypto (USDT/BTC)</option>
                <option value="Bank Transfer">Bank Transfer (Fiat)</option>
                <option value="Both">Both</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Platform</label>
                <select 
                  value={formData.platform}
                  onChange={(e) => setFormData({...formData, platform: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm outline-none focus:border-blue-500 text-slate-700 dark:text-slate-300"
                >
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="Telegram">Telegram</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Number/User</label>
                <input 
                  type="text" 
                  required
                  value={formData.contact}
                  onChange={(e) => setFormData({...formData, contact: e.target.value})}
                  placeholder={formData.platform === 'WhatsApp' ? '+234...' : '@username'}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <button className="w-full bg-slate-900 dark:bg-blue-600 text-white font-bold py-3 rounded-xl hover:opacity-90 transition mt-2">
              Add Vendor
            </button>
          </form>
        </div>
      </div>

      {/* Right: Vendor List */}
      <div className="lg:col-span-2">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800">
            <h2 className="font-bold text-slate-900 dark:text-white">Active Vendors</h2>
          </div>
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 font-medium">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Method</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {vendors.map((vendor) => (
                <tr key={vendor.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-white flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      <Store className="w-4 h-4 text-slate-500" />
                    </div>
                    {vendor.name}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300">
                      {vendor.paymentType.includes('Crypto') ? <Bitcoin className="w-3 h-3" /> : <CreditCard className="w-3 h-3" />}
                      {vendor.paymentType}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                      {vendor.platform === 'WhatsApp' ? <Phone className="w-3.5 h-3.5 text-emerald-500" /> : <MessageCircle className="w-3.5 h-3.5 text-blue-500" />}
                      {vendor.contact}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => setVendors(vendors.filter(v => v.id !== vendor.id))}
                      className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-600 rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}