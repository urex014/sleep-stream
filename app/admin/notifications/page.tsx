'use client';

import React, { useState } from 'react';
import { Send, Bell, Users, User, Loader2 } from 'lucide-react';

export default function AdminNotifications() {
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'info',
    recipientId: '' // Empty = All Users
  });
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    try {
      const res = await fetch('/api/admin/notifications/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      
      if (res.ok) {
        alert("Notification Sent!");
        setFormData({ title: '', message: '', type: 'info', recipientId: '' });
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Error sending notification");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-500">
      
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 rounded-xl">
          <Bell className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Push Notification</h1>
          <p className="text-slate-500 text-sm">Send alerts to users instantly.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Target Audience */}
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Target Audience</label>
            <div className="flex gap-4">
              <button 
                type="button"
                onClick={() => setFormData({...formData, recipientId: ''})}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border font-medium transition-all ${!formData.recipientId ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'}`}
              >
                <Users className="w-4 h-4" /> All Users
              </button>
              <button 
                type="button"
                onClick={() => setFormData({...formData, recipientId: 'specific'})} // Placeholder to switch view
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border font-medium transition-all ${formData.recipientId ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'}`}
              >
                <User className="w-4 h-4" /> Specific User
              </button>
            </div>
          </div>

          {/* Specific ID Input (Only if selected) */}
          {formData.recipientId && (
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">User ID</label>
              <input 
                type="text" 
                value={formData.recipientId === 'specific' ? '' : formData.recipientId}
                onChange={(e) => setFormData({...formData, recipientId: e.target.value})}
                placeholder="Paste User ID here..."
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-6">
            <div className="col-span-2">
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Title</label>
              <input 
                type="text" 
                required
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="e.g. System Maintenance"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none font-bold"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Type</label>
              <select 
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="info">Info (Blue)</option>
                <option value="success">Success (Green)</option>
                <option value="warning">Warning (Yellow)</option>
                <option value="error">Error (Red)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Message</label>
            <textarea 
              required
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              placeholder="Type your notification content..."
              rows={4}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
            />
          </div>

          <button 
            type="submit" 
            disabled={isSending}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-70"
          >
            {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            {isSending ? "Sending..." : "Push Notification"}
          </button>

        </form>
      </div>
    </div>
  );
}