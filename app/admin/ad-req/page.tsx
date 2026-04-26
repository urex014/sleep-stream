/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import { ShieldAlert, ExternalLink, CheckCircle, XCircle, Loader2, List, CheckCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function AdminAdsModerationPage() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [isApprovingAll, setIsApprovingAll] = useState(false);


  

  // Fetch all ads
  const fetchAllCampaigns = async () => {
    try {
      const res = await fetch('/api/admin/manage-ads', { cache: 'no-store' });
      if (res.status === 401) return router.push('/login');

      const data = await res.json();
      if (data.success) {
        setCampaigns(data.campaigns);
      }
    } catch (error) {
      console.error("Failed to fetch campaigns", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllCampaigns();
  }, [router]);

  // Handle Approve/Reject Action
  const handleUpdateStatus = async (taskId: string, newStatus: 'Active' | 'Rejected') => {
    if (!confirm(`Are you sure you want to mark this ad as ${newStatus}?`)) return;

    setProcessingId(taskId);
    try {
      const res = await fetch('/api/admin/manage-ads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId, newStatus })
      });

      const data = await res.json();
      if (data.success) {
        // Refresh the table locally without reloading the whole page
        setCampaigns(prev => prev.map(camp => camp._id === taskId ? { ...camp, status: newStatus } : camp));
      } else {
        toast(data.message || "Update failed.");
      }
    } catch (error) {
      toast.error("Network error.");
    } finally {
      setProcessingId(null);
    }
  };



  const handleApproveAll = async () => {
  // Prevent accidental clicks!
  if (!window.confirm("Are you sure you want to approve ALL pending ads instantly?")) return;

  setIsApprovingAll(true);
  const loadingToast = toast.loading("Approving all pending ads...");

  try {
    // Make sure this matches the exact URL path of the API route you showed me!
    const res = await fetch('/api/admin/manage-ads', {
      method: 'POST',
    });
    const data = await res.json();

    if (res.ok && data.success) {
      toast.success(data.message, { id: loadingToast }); // Will say "X ads approved"
      
      // Call your fetch function here to refresh the table data instantly!
      fetchAllCampaigns(); 
      
    } else {
      toast.error(data.message || "Failed to approve ads", { id: loadingToast });
    }
  } catch (error) {
    toast.error("Network error occurred", { id: loadingToast });
  } finally {
    setIsApprovingAll(false);
  }
};

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa]">
        <Loader2 className="w-10 h-10 text-[#337ab7] animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16 font-sans text-[#333333] p-6">

      {/* HEADER */}
      <div className="border-b border-[#dddddd] pb-4 mb-6 flex items-center gap-3">
        <div className="p-2 bg-[#f2dede] border border-[#ebccd1] rounded text-[#a94442]">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-[#222222]">Ad Moderation Panel</h1>
          <p className="text-[#666666] mt-1 text-sm">Review, approve, or reject user-submitted campaigns.</p>
        </div>
      </div>

      <div className="bg-white border border-[#dddddd] rounded shadow-sm overflow-hidden">
        <div className="p-4 border-b border-[#dddddd] bg-[#f5f5f5] flex justify-between items-center">
          <div className="flex items-center gap-2">
            <List className="w-4 h-4 text-[#777777]" />
            <h3 className="font-bold text-[#333333] text-base">All Campaigns</h3>
            <button
            onClick={handleApproveAll}
            disabled={isApprovingAll}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-sm hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
          >
            {isApprovingAll ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <CheckCheck className="w-5 h-5" />
            )}
            {isApprovingAll ? "Approving..." : "Approve All Pending"}
          </button>
          </div>
          <span className="text-[11px] font-bold bg-[#337ab7] text-white px-2 py-1 rounded shadow-inner">
            {campaigns.filter(c => c.status === 'Pending Review').length} Pending
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead className="bg-[#f9f9f9] text-[#777777] text-xs uppercase font-bold border-b border-[#dddddd]">
              <tr>
                <th className="px-4 py-3">Ad Title & Target</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Creator</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm text-[#333333]">
              {campaigns.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-[#999999] bg-[#f9f9f9]">
                    No campaigns have been submitted yet.
                  </td>
                </tr>
              ) : campaigns.map((camp) => (
                <tr key={camp._id} className="border-b border-[#eeeeee] hover:bg-[#f9f9f9] transition-colors">

                  {/* Title & Link */}
                  <td className="px-4 py-4">
                    <p className="font-bold text-[#333333] line-clamp-1">{camp.title}</p>
                    <a
                      href={camp.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#337ab7] hover:text-[#23527c] text-xs font-bold hover:underline inline-flex items-center gap-1 mt-1"
                    >
                      Test Link <ExternalLink className="w-3 h-3" />
                    </a>
                  </td>

                  {/* Type & Duration */}
                  <td className="px-4 py-4">
                    <span className="bg-[#eeeeee] text-[#555555] px-2 py-1 rounded text-xs font-bold border border-[#cccccc] capitalize">
                      {camp.type}
                    </span>
                    <p className="text-xs text-[#999999] mt-1 font-bold">{camp.duration}s timer</p>
                  </td>

                  {/* Creator Info (Assuming you populated it) */}
                  <td className="px-4 py-4">
                    <p className="font-bold text-[#555555]">{camp.creatorId?.username || 'Unknown User'}</p>
                    <p className="text-xs text-[#999999]">{new Date(camp.createdAt).toLocaleDateString()}</p>
                  </td>

                  {/* Status Label */}
                  <td className="px-4 py-4">
                    <span className={`px-2 py-1 rounded text-[11px] font-bold text-white uppercase tracking-wider shadow-sm
                      ${camp.status === 'Active' ? 'bg-[#5cb85c]'
                        : camp.status === 'Rejected' ? 'bg-[#d9534f]'
                          : 'bg-[#f0ad4e]'}`}
                    >
                      {camp.status || 'Pending'}
                    </span>
                  </td>

                  {/* Action Buttons */}
                  <td className="px-4 py-4 text-right">
                    {processingId === camp._id ? (
                      <div className="inline-flex items-center justify-center p-2 text-[#337ab7]">
                        <Loader2 className="w-5 h-5 animate-spin" />
                      </div>
                    ) : (
                      <div className="flex items-center justify-end gap-2">
                        {/* Only show Approve/Reject if it's not already that status */}
                        {camp.status !== 'Active' && (
                          <button
                            onClick={() => handleUpdateStatus(camp._id, 'Active')}
                            className="bg-white border border-[#4cae4c] text-[#3c763d] hover:bg-[#dff0d8] p-1.5 rounded transition-colors"
                            title="Approve Ad"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}

                        {camp.status !== 'Rejected' && (
                          <button
                            onClick={() => handleUpdateStatus(camp._id, 'Rejected')}
                            className="bg-white border border-[#d43f3a] text-[#a94442] hover:bg-[#f2dede] p-1.5 rounded transition-colors"
                            title="Reject Ad"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    )}
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