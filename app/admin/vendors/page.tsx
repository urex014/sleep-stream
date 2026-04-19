'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Loader2, Store, Link as LinkIcon, Trash2, CheckCircle2, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminVendorsManager() {
  const [vendors, setVendors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    methods: '',
    platform: 'WhatsApp',
    link: '',
    status: 'Online',
    rating: '5.0/5',
    verified: true
  });

  const fetchVendors = async () => {
    try {
      const res = await fetch('/api/admin/vendors');
      const data = await res.json();
      if (data.success) setVendors(data.vendors);
    } catch (error) {
      console.error("Failed to load vendors");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/admin/vendors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (res.ok) {
        toast(data.message);
        setFormData({ name: '', methods: '', platform: 'WhatsApp', link: '', status: 'Online', rating: '5.0/5', verified: true });
        fetchVendors(); // Refresh the table
      } else {
        toast(data.message);
      }
    } catch (error) {
      toast("Network Error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this vendor?")) return;

    setIsDeleting(id);
    try {
      const res = await fetch('/api/admin/vendors', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      const data = await res.json();

      if (res.ok) {
        fetchVendors(); // Refresh the table
      } else {
        toast(data.message);
      }
    } catch (error) {
      toast("Network Error");
    } finally {
      setIsDeleting(null);
    }
  };

  if (isLoading) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin w-8 h-8 text-blue-600" /></div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-6xl mx-auto">

      <div className="flex justify-between items-end border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Vendor Directory</h1>
          <p className="text-slate-500 mt-1">Manage the official code distributors for your platform.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* --- CREATE VENDOR FORM --- */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm p-6 sticky top-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-emerald-500" /> Add New Vendor
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Vendor Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Crypto Exchange Naija"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Payment Methods</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bank Transfer, USDT, OPay"
                  value={formData.methods}
                  onChange={(e) => setFormData({ ...formData, methods: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg outline-none focus:border-emerald-500 text-sm"
                />
                <p className="text-xs text-slate-500 mt-1">Separate methods with commas.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Platform</label>
                  <select
                    value={formData.platform}
                    onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg outline-none focus:border-emerald-500"
                  >
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Telegram">Telegram</option>
                    <option value="Website">Website</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg outline-none focus:border-emerald-500"
                  >
                    <option value="Online">Online</option>
                    <option value="Away">Away</option>
                    <option value="Offline">Offline</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Contact Link (URL)</label>
                <input
                  type="url"
                  required
                  placeholder="https://wa.me/..."
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="verified"
                  checked={formData.verified}
                  onChange={(e) => setFormData({ ...formData, verified: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded border-slate-300"
                />
                <label htmlFor="verified" className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  Verified Vendor Badge
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg shadow-sm mt-4 transition-colors flex justify-center items-center gap-2 disabled:opacity-70"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'List Vendor'}
              </button>
            </form>
          </div>
        </div>

        {/* --- VENDORS TABLE --- */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex justify-between items-center">
              <h3 className="font-bold text-slate-900 dark:text-white">Registered Vendors</h3>
              <span className="text-xs font-bold text-slate-500 bg-slate-200 dark:bg-slate-800 px-2 py-1 rounded-full">
                {vendors.length} Total
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 font-medium border-b border-slate-100 dark:border-slate-800">
                  <tr>
                    <th className="px-6 py-4">Vendor Info</th>
                    <th className="px-6 py-4">Platform & Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {vendors.map((vendor) => (
                    <tr key={vendor._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg flex items-center justify-center font-bold border border-emerald-200 dark:border-emerald-800">
                            <Store className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                              {vendor.name}
                              {vendor.verified && <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />}
                            </p>
                            <p className="text-xs text-slate-500 truncate max-w-[200px] mt-0.5">
                              {vendor.methods.join(', ')}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <a href={vendor.link} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline flex items-center gap-1 text-xs font-bold">
                            <LinkIcon className="w-3 h-3" /> {vendor.platform}
                          </a>
                          <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider ${vendor.status === 'Online' ? 'text-emerald-500' : vendor.status === 'Away' ? 'text-amber-500' : 'text-slate-500'
                            }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${vendor.status === 'Online' ? 'bg-emerald-500' : vendor.status === 'Away' ? 'bg-amber-500' : 'bg-slate-500'
                              }`}></span>
                            {vendor.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDelete(vendor._id)}
                          disabled={isDeleting === vendor._id}
                          className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                          title="Remove Vendor"
                        >
                          {isDeleting === vendor._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        </button>
                      </td>
                    </tr>
                  ))}
                  {vendors.length === 0 && (
                    <tr>
                      <td colSpan={3} className="text-center py-12 text-slate-400">
                        No vendors registered yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}