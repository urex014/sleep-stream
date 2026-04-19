/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import { Bell, X, Circle } from 'lucide-react';

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.isRead).length;

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

  const markAsRead = async (id: string) => {
    // Optimistic Update
    setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));

    try {
      await fetch('/api/user/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Optional: Poll every 60 seconds
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative font-sans">
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-[#777777] hover:text-[#333333] hover:bg-[#eeeeee] rounded transition-colors focus:outline-none"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#d9534f] rounded-full border border-white animate-pulse shadow-sm"></span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Invisible Overlay to close when clicking outside */}
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>

          {/* The Dropdown Panel (Classic Bootstrap Dropdown Style) */}
          <div className="absolute right-0 mt-1 w-80 bg-white border border-[#cccccc] shadow-[0_6px_12px_rgba(0,0,0,0.175)] rounded z-50 overflow-hidden">

            {/* Header */}
            <div className="p-3 border-b border-[#eeeeee] bg-[#f5f5f5] flex justify-between items-center shadow-[inset_0_1px_0_rgba(255,255,255,1)]">
              <h3 className="font-bold text-[#333333] text-sm">Notifications</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-[#999999] hover:text-[#a94442] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Notification List */}
            <div className="max-h-80 overflow-y-auto bg-white">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-[#999999] text-sm bg-[#f9f9f9]">
                  No new notifications.
                </div>
              ) : (
                notifications.map(n => (
                  <div
                    key={n._id}
                    className={`p-3 border-b border-[#eeeeee] transition-colors cursor-pointer hover:bg-[#f9f9f9]
                      ${!n.isRead ? 'bg-[#f4f8fa] border-l-[3px] border-l-[#337ab7]' : 'bg-white border-l-[3px] border-l-transparent'}
                    `}
                    onClick={() => markAsRead(n._id)}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h4 className={`text-sm font-bold truncate pr-2 ${!n.isRead ? 'text-[#337ab7]' : 'text-[#555555]'}`}>
                        {n.title}
                      </h4>
                      {!n.isRead && <Circle className="w-2 h-2 fill-[#337ab7] text-[#337ab7] shrink-0 mt-1.5" />}
                    </div>

                    <p className="text-xs text-[#666666] leading-relaxed line-clamp-2">
                      {n.message}
                    </p>

                    <p className="text-[10px] font-bold text-[#999999] mt-2 uppercase tracking-wider">
                      {new Date(n.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Optional Footer Link */}
            {notifications.length > 0 && (
              <div className="border-t border-[#eeeeee] bg-[#f9f9f9] p-2 text-center">
                <button
                  className="text-xs font-bold text-[#337ab7] hover:underline"
                  onClick={() => setIsOpen(false)}
                >
                  Close Menu
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}