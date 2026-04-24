'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect, useState } from 'react';
import { Send, Bell, Users, User, Loader2 } from 'lucide-react';

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'info',
    recipientId: '' // Empty = All Users
  });

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/user/notifications');
      const data = await res.json();
      if (data.success) {
        setNotifications(data.notifications);
      }
    } catch (error) {
      console.error("Failed to fetch notifications");
    }
  };
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

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
        fetchNotifications();
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

        <div className="mt-8 border-t border-slate-200 dark:border-slate-800 pt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recent Notifications</h2>
            <span className="text-sm text-slate-500">{notifications.length}</span>
          </div>

          {notifications.length > 0 ? (
            <div className="space-y-3">
              {notifications.map((notification, index) => (
                <div
                  key={notification.id || index}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white">
                        {notification.title || 'Untitled notification'}
                      </h3>
                      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                        {notification.message}
                      </p>
                    </div>
                    <span className="rounded-full bg-indigo-100 dark:bg-indigo-900/30 px-2.5 py-1 text-xs font-medium capitalize text-indigo-700 dark:text-indigo-300">
                      {notification.type || 'info'}
                    </span>
                  </div>
                  {notification.createdAt && (
                    <p className="mt-3 text-xs text-slate-400">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-200 dark:border-slate-800 px-4 py-8 text-center text-sm text-slate-500">
              No notifications found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
