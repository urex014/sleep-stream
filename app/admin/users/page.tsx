'use client';

import React, { useState } from 'react';
import { Search, Loader2, User as UserIcon, Mail, Wallet, ShieldAlert } from 'lucide-react';

export default function UserSearchAdmin() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // --- HANDLE SEARCH ---
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Make sure they typed at least one thing
    if (!email.trim() && !username.trim()) {
      alert("Please enter an email or username to search.");
      return;
    }

    setIsLoading(true);
    setHasSearched(true);
    
    try {
      // Build the URL with the search parameters
      const params = new URLSearchParams();
      if (email.trim()) params.append('email', email.trim());
      if (username.trim()) params.append('username', username.trim());

      const res = await fetch(`/api/admin/users/search?${params.toString()}`);
      const data = await res.json();

      if (data.success) {
        setUsers(data.users);
      } else {
        alert(data.message);
        setUsers([]);
      }
    } catch (error) {
      alert("Network Error while searching.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- CLEAR SEARCH ---
  const handleClear = () => {
    setEmail('');
    setUsername('');
    setUsers([]);
    setHasSearched(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">User Search</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Find users by email or username to manage their accounts.</p>
      </div>

      {/* Search Form Box */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm p-6">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 items-end">
          
          {/* Email Input */}
          <div className="flex-1 w-full">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Search by Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="w-4 h-4 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="e.g. user@sleepstream.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all dark:text-white"
              />
            </div>
          </div>

          {/* Username Input */}
          <div className="flex-1 w-full">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Search by Username</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UserIcon className="w-4 h-4 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="e.g. cryptoking"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all dark:text-white"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-2 w-full md:w-auto">
            <button
              type="button"
              onClick={handleClear}
              className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-semibold text-sm transition-all"
            >
              Clear
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm transition-all disabled:opacity-70"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              Search
            </button>
          </div>
        </form>
      </div>

      {/* Results Table */}
      {hasSearched && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 font-medium border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4">User Details</th>
                  <th className="px-6 py-4">Balances</th>
                  <th className="px-6 py-4">Tier Status</th>
                  <th className="px-6 py-4">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center">
                      <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
                    </td>
                  </tr>
                ) : users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      
                      {/* Name & Email */}
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900 dark:text-white text-base">{user.username}</div>
                        <div className="text-xs text-slate-500 mt-1">{user.email}</div>
                      </td>

                      {/* Balances */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                            <Wallet className="w-3 h-3" /> Ads: ₦{user.adsBalance?.toFixed(2) || '0.00'}
                          </span>
                          <span className="text-xs text-slate-500">
                            Ref: ₦{user.referralBalance?.toFixed(2) || '0.00'}
                          </span>
                        </div>
                      </td>

                      {/* Tier Info */}
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-md font-bold text-xs border border-blue-100 dark:border-blue-800">
                          Tier {user.tier || 1}
                        </span>
                      </td>

                      {/* Role */}
                      <td className="px-6 py-4">
                        {user.role === 'admin' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-md font-bold text-xs border border-purple-100 dark:border-purple-800">
                            <ShieldAlert className="w-3 h-3" /> Admin
                          </span>
                        ) : (
                          <span className="text-slate-500 capitalize">{user.role || 'user'}</span>
                        )}
                      </td>

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                      No users found matching that criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}