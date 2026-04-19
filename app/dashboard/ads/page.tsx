/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import {
  PlaySquare,
  MousePointerClick,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  X,
  Loader2
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function AdsManagerPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'videos' | 'links'>('videos');

  // Dynamic Data States
  const [tasks, setTasks] = useState<any[]>([]);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [dailyLimit, setDailyLimit] = useState({ current: 0, max: 20 });
  const [userTier, setUserTier] = useState<number>(1); // Added Tier State

  // Task Execution States
  const [activeTask, setActiveTask] = useState<any | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isVerifying, setIsVerifying] = useState(false);

  // --- HARDCODED TIER MATH ---
  // Calculates exactly how much they earn per ad based on (Daily Earnings / 20)
  const getRewardForTier = (tier: number) => {
    switch (tier) {
      case 1: return 37.5; // 750 / 20
      case 2: return 87.5; // 1750 / 20
      case 3: return 150.0; // 3000 / 20
      case 4: return 225.0; // 4500 / 20
      case 5: return 300.0; // 6000 / 20
      default: return 37.5;
    }
  };

  const adReward = getRewardForTier(userTier);

  // --- 1. FETCH DASHBOARD & TASKS ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch User Auth & Tier
        const dashRes = await fetch('/api/user/dashboard', { cache: 'no-store' });
        if (dashRes.status === 401) return router.push('/login');

        const dashData = await dashRes.json();
        if (dashData.success) {
          setUserTier(dashData.user.tier || 1); // Save the tier to state
        }

        // 2. Fetch User's Completed Ads History
        const historyRes = await fetch('/api/user/ads/complete');
        const historyData = await historyRes.json();

        if (historyData.success) {
          setCompletedTasks(historyData.completedAds);
          setDailyLimit({ current: historyData.totalTasksToday, max: 20 });
        }

        // 3. Fetch the Ads created in the Admin Panel
        const tasksRes = await fetch('/api/admin/tasks');
        const tasksData = await tasksRes.json();

        if (tasksData.success) {
          const activeAds = tasksData.tasks.filter((t: any) => t.status === 'Active' || !t.status);
          setTasks(activeAds);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [router]);

  // --- 2. TASK TIMER LOGIC ---
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (activeTask && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (activeTask && timeLeft === 0 && !isVerifying) {
      // Timer finished! Call the API to credit the user
      handleTaskCompletion();
    }

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTask, timeLeft, isVerifying]);

  // --- 3. API COMPLETION HANDLER ---
  const handleTaskCompletion = async () => {
    setIsVerifying(true);
    try {
      const res = await fetch('/api/user/ads/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskId: activeTask._id,
          type: activeTask.type,
          title: activeTask.title
          // NOTE: 'reward' has been removed! The backend calculates it securely now.
        })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setCompletedTasks(prev => [...prev, activeTask._id]);
        setDailyLimit(prev => ({ ...prev, current: prev.current + 1 }));

        // We use data.message because the backend now returns exactly how much they earned
        toast.success(data.message || `Success! ₦${adReward} has been added to your Ads Balance.`);
      } else {
        toast.error(data.message || "Failed to verify task.");
      }
    } catch (error) {
      toast.error("Network error while verifying task. Please try again.");
    } finally {
      setIsVerifying(false);
      setActiveTask(null);
    }
  };

  // --- HANDLERS ---
  const handleStartTask = (task: any) => {
    if (dailyLimit.current >= dailyLimit.max) {
      toast.error("You have reached your daily ad limit. Come back tomorrow!");
      return;
    }
    setActiveTask(task);
    setTimeLeft(task.duration);

    if (task.type === 'link' || task.type === 'video') {
      window.open(task.url, '_blank');
    }
  };

  const cancelTask = () => {
    if (isVerifying) return; // Prevent canceling while API is calling
    if (confirm("Are you sure you want to cancel? You will not receive the reward.")) {
      setActiveTask(null);
      setTimeLeft(0);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#337ab7] animate-spin" />
      </div>
    );
  }

  const videoTasks = tasks.filter(t => t.type === 'video');
  const linkTasks = tasks.filter(t => t.type === 'link');

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16 font-sans text-[#333333]">

      {/* HEADER */}
      <div className="border-b items-center justify-between flex flex-col sm:flex-row border-[#dddddd] pb-4 mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#222222]">Ads Manager</h1>
          <p className="text-[#666666] mt-1 text-sm">Watch videos and visit sponsored links to earn Naira daily.</p>
        </div>
        <div>
          <button
            onClick={() => router.push('/dashboard/post-ads')}
            className="rounded font-bold shadow-sm bg-[#337ab7] text-white border border-[#2e6da4] px-4 py-2.5 hover:bg-[#286090] transition-colors whitespace-nowrap"
          >
            Post Ads
          </button>
        </div>
      </div>

      {/* STATUS PANEL */}
      <div className="bg-[#d9edf7] border border-[#bce8f1] rounded p-4 text-[#31708f] flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm mb-6">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-6 h-6 shrink-0" />
          <div>
            <h4 className="font-bold text-[15px]">Daily Limits Apply (Tier {userTier})</h4>
            <p className="text-sm">You can complete a maximum of {dailyLimit.max} tasks per day based on your current account standing.</p>
          </div>
        </div>
        <div className="bg-white border border-[#bce8f1] px-4 py-2 rounded text-center shrink-0 min-w-[120px]">
          <p className="text-xs font-bold uppercase tracking-wider text-[#777777]">Tasks Today</p>
          <p className="text-xl font-bold text-[#31708f]">
            {dailyLimit.current} <span className="text-sm text-[#999999]">/ {dailyLimit.max}</span>
          </p>
        </div>
      </div>

      {/* CLASSIC NAV TABS */}
      <ul className="flex border-b border-[#dddddd] mb-6">
        <li className="-mb-[1px]">
          <button
            onClick={() => setActiveTab('videos')}
            className={`px-5 py-3 font-bold text-sm border-t border-l border-r rounded-t flex items-center gap-2 transition-colors ${activeTab === 'videos'
              ? 'bg-white border-[#dddddd] border-b-transparent text-[#333333]'
              : 'bg-transparent border-transparent text-[#337ab7] hover:bg-[#eeeeee]'
              }`}
          >
            <PlaySquare className="w-4 h-4" /> Video Ads ({videoTasks.length})
          </button>
        </li>
        <li className="-mb-[1px]">
          <button
            onClick={() => setActiveTab('links')}
            className={`px-5 py-3 font-bold text-sm border-t border-l border-r rounded-t flex items-center gap-2 transition-colors ${activeTab === 'links'
              ? 'bg-white border-[#dddddd] border-b-transparent text-[#333333]'
              : 'bg-transparent border-transparent text-[#337ab7] hover:bg-[#eeeeee]'
              }`}
          >
            <MousePointerClick className="w-4 h-4" /> PTC Links ({linkTasks.length})
          </button>
        </li>
      </ul>

      {/* TAB CONTENT: VIDEOS */}
      {activeTab === 'videos' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videoTasks.length === 0 ? (
            <div className="col-span-full py-12 text-center text-[#999999] bg-white border border-[#dddddd] rounded">
              No video ads available right now. Check back later!
            </div>
          ) : videoTasks.map((ad) => {
            const isCompleted = completedTasks.includes(ad._id);
            return (
              <div key={ad._id} className={`bg-white border rounded shadow-sm flex flex-col ${isCompleted ? 'border-[#d6e9c6] bg-[#f9fdf7]' : 'border-[#dddddd]'}`}>
                <div className="h-36 bg-[#eeeeee] border-b border-[#dddddd] relative flex items-center justify-center">
                  <PlaySquare className={`w-12 h-12 ${isCompleted ? 'text-[#d6e9c6]' : 'text-[#cccccc]'}`} />
                  <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                    {ad.duration}s
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="font-bold text-[#333333] text-sm mb-2 line-clamp-2">{ad.title}</h3>
                  <div className="flex items-center justify-between mb-4 mt-auto">
                    <span className="text-[#5cb85c] font-bold text-lg">₦{adReward}</span>
                    <span className="text-xs text-[#777777] font-bold flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {ad.duration} sec
                    </span>
                  </div>

                  <button
                    onClick={() => handleStartTask(ad)}
                    disabled={isCompleted || dailyLimit.current >= dailyLimit.max}
                    className={`w-full py-2 rounded text-sm font-bold transition-colors flex items-center justify-center gap-2 border ${isCompleted
                      ? 'bg-[#dff0d8] border-[#d6e9c6] text-[#3c763d] cursor-not-allowed'
                      : 'bg-[#337ab7] hover:bg-[#286090] border-[#2e6da4] text-white shadow-sm'
                      }`}
                  >
                    {isCompleted ? (
                      <><CheckCircle2 className="w-4 h-4" /> Completed</>
                    ) : (
                      <><PlaySquare className="w-4 h-4" /> Watch Video</>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB CONTENT: LINKS */}
      {activeTab === 'links' && (
        <div className="bg-white border border-[#dddddd] rounded shadow-sm overflow-hidden">
          <div className="w-full overflow-x-auto [-webkit-overflow-scrolling:touch]">
            <table className="min-w-[640px] w-full text-left border-collapse">
              <thead className="bg-[#f9f9f9] text-[#777777] text-xs uppercase font-bold border-b border-[#dddddd]">
                <tr>
                  <th className="px-6 py-3">Task Description</th>
                  <th className="px-6 py-3 text-center">Timer</th>
                  <th className="px-6 py-3 text-center">Reward</th>
                  <th className="px-6 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm text-[#333333]">
                {linkTasks.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-[#999999]">
                      No PTC links available right now. Check back later!
                    </td>
                  </tr>
                ) : linkTasks.map((link) => {
                  const isCompleted = completedTasks.includes(link._id);
                  return (
                    <tr key={link._id} className={`border-b border-[#eeeeee] transition-colors ${isCompleted ? 'bg-[#f9fdf7]' : 'hover:bg-[#f9f9f9]'}`}>
                      <td className="px-6 py-4">
                        <p className={`font-bold ${isCompleted ? 'text-[#999999] line-through' : 'text-[#337ab7]'}`}>
                          {link.title}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-center text-[#666666]">
                        {link.duration}s
                      </td>
                      <td className="px-6 py-4 text-center font-bold text-[#5cb85c]">
                        ₦{adReward}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleStartTask(link)}
                          disabled={isCompleted || dailyLimit.current >= dailyLimit.max}
                          className={`px-4 py-1.5 rounded text-xs font-bold border transition-colors inline-flex items-center gap-1 ${isCompleted
                            ? 'bg-transparent border-transparent text-[#3c763d] cursor-not-allowed'
                            : 'bg-white border-[#cccccc] text-[#333333] hover:bg-[#e6e6e6]'
                            }`}
                        >
                          {isCompleted ? (
                            <><CheckCircle2 className="w-4 h-4" /> Done</>
                          ) : (
                            <>Visit Link <ExternalLink className="w-3.5 h-3.5" /></>
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- TASK EXECUTION MODAL (Classic Bootstrap Modal Style) --- */}
      {activeTask && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded border border-[#dddddd] shadow-[0_5px_15px_rgba(0,0,0,0.5)] w-full max-w-lg overflow-hidden flex flex-col">

            {/* Modal Header */}
            <div className="p-4 border-b border-[#eeeeee] flex justify-between items-center bg-[#f5f5f5]">
              <h4 className="font-bold text-[#333333] text-base truncate pr-4">
                {activeTask.type === 'video' ? 'Watching Video Ad' : 'Visiting Sponsor Link'}
              </h4>
              <button
                onClick={cancelTask}
                disabled={isVerifying}
                className={`transition-colors ${isVerifying ? 'text-[#cccccc] cursor-not-allowed' : 'text-[#999999] hover:text-[#a94442]'}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 bg-[#222222] min-h-[250px] flex items-center justify-center text-center">
              <div>
                {isVerifying ? (
                  <Loader2 className="w-16 h-16 text-[#5cb85c] mx-auto mb-4 animate-spin" />
                ) : activeTask.type === 'video' ? (
                  <PlaySquare className="w-16 h-16 text-[#555555] mx-auto mb-4 animate-pulse" />
                ) : (
                  <ExternalLink className="w-16 h-16 text-[#555555] mx-auto mb-4 animate-pulse" />
                )}

                <p className="text-[#999999] text-sm">
                  {isVerifying
                    ? 'Verifying task completion...'
                    : activeTask.type === 'video' ? 'Awaiting video completion...' : 'Awaiting page view...'}
                </p>
                <p className="text-white font-bold mt-2 text-xl">{activeTask.title}</p>
                {!isVerifying && (
                  <p className="text-[#777777] text-xs mt-4">
                    If the page didn't open automatically, <a href={activeTask.url} target="_blank" rel="noreferrer" className="text-[#337ab7] underline">click here</a>.
                  </p>
                )}
              </div>
            </div>

            {/* Modal Footer & Progress */}
            <div className="p-5 border-t border-[#eeeeee] bg-white">
              <div className="flex justify-between text-sm font-bold text-[#333333] mb-2">
                <span>{isVerifying ? 'Processing Reward...' : 'Please stay on this page...'}</span>
                <span className={timeLeft <= 5 ? 'text-[#d9534f]' : 'text-[#337ab7]'}>
                  {isVerifying ? '0 seconds left' : `${timeLeft} seconds left`}
                </span>
              </div>

              {/* Classic Bootstrap Progress Bar */}
              <div className="w-full h-5 bg-[#f5f5f5] rounded border border-[#cccccc] overflow-hidden shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)]">
                <div
                  className={`h-full shadow-[inset_0_-1px_0_rgba(0,0,0,0.15)] transition-all duration-1000 ease-linear ${isVerifying ? 'bg-[#5cb85c]' : 'bg-[#337ab7]'}`}
                  style={{ width: isVerifying ? '100%' : `${100 - ((timeLeft / activeTask.duration) * 100)}%` }}
                ></div>
              </div>

              <div className="mt-4 text-center">
                <p className="text-xs text-[#777777]">
                  Do not close this window, or you will forfeit your ₦{adReward} reward.
                </p>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
