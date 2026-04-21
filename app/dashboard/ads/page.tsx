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
  Loader2,
  Plus
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function AdsManagerPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'videos' | 'links'>('links');

  // Dynamic Data States
  const [tasks, setTasks] = useState<any[]>([]);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [dailyLimit, setDailyLimit] = useState({ current: 0, max: 20 });
  const [userTier, setUserTier] = useState<number>(1); 

  // Task Execution States
  const [activeTask, setActiveTask] = useState<any | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isVerifying, setIsVerifying] = useState(false);

  // --- HARDCODED TIER MATH ---
  const getRewardForTier = (tier: number) => {
    switch (tier) {
      case 1: return 37.5; 
      case 2: return 93.75; 
      case 3: return 187.5;
      case 4: return 300.0;
      case 5: return 375.0;
      default: return 37.5;
    }
  };

  const adReward = getRewardForTier(userTier);

  // --- 1. FETCH DASHBOARD & TASKS ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("1. Starting data fetch...");
        
        // Fetch User Auth
        const dashRes = await fetch('/api/user/dashboard', { cache: 'no-store' });
        if (dashRes.status === 401) return router.push('/login');
        const dashData = await dashRes.json();
        if (dashData.success) setUserTier(dashData.user.tier || 1);

        // Fetch History
        const historyRes = await fetch('/api/user/ads/complete', { cache: 'no-store' });
        const historyData = await historyRes.json();
        if (historyData.success) {
          setCompletedTasks(historyData.completedAds || []);
          setDailyLimit({ current: historyData.totalTasksToday || 0, max: 20 });
        }

        // Fetch Ads
        console.log("2. Fetching Ads from API...");
        const tasksRes = await fetch('/api/user/ads', { cache: 'no-store' });
        const tasksData = await tasksRes.json();
        
        console.log("3. RAW API RESPONSE:", tasksData); 

        if (tasksData.success) {
          const adArray = tasksData.tasks || tasksData.ads || tasksData.data || tasksData.activeAds || [];
          console.log("4. EXTRACTED AD ARRAY:", adArray);
          setTasks(adArray);
        } else {
          console.error("API returned false success:", tasksData);
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
        })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setCompletedTasks(prev => [...prev, activeTask._id]);
        setDailyLimit(prev => ({ ...prev, current: prev.current + 1 }));
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

    if (task.type === 'url' || task.type === 'link' || task.type === 'video') {
      window.open(task.url, '_blank');
    }
  };
  
  const cancelTask = () => {
    if (isVerifying) return; 
    if (confirm("Are you sure you want to cancel? You will not receive the reward.")) {
      setActiveTask(null);
      setTimeLeft(0);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
      </div>
    );
  }

  const videoTasks = tasks.filter(t => t.type?.toLowerCase() === 'video');
  const linkTasks = tasks.filter(t => t.type?.toLowerCase()  === 'url');

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16 font-sans text-slate-800 selection:bg-indigo-500 selection:text-white animate-in fade-in duration-500">

      {/* --- HEADER --- */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">Ads Manager</h1>
          <p className="text-slate-500 mt-2 text-sm sm:text-base">Watch videos and visit sponsored links to earn daily.</p>
        </div>
        <button
          onClick={() => router.push('/dashboard/post-ads')}
          className="rounded-xl font-semibold shadow-sm shadow-indigo-600/20 bg-indigo-600 text-white px-5 py-3 hover:bg-indigo-700 active:bg-indigo-800 transition-all flex items-center gap-2 whitespace-nowrap"
        >
          <Plus className="w-5 h-5" /> Post Ads
        </button>
        <p className="text-red-500 mt-2 text-sm font-bold sm:text-base">Click on PTC links to view ads</p>
      </div>

      {/* --- STATUS PANEL --- */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-start md:items-center gap-4 w-full md:w-auto">
          <div className="p-3 bg-indigo-50 rounded-2xl shrink-0">
            <AlertCircle className="w-7 h-7 text-indigo-600" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-lg tracking-tight">Daily Limits Apply (Tier {userTier})</h4>
            <p className="text-sm text-slate-500 mt-1">You can complete a maximum of {dailyLimit.max} tasks per day based on your current standing.</p>
          </div>
        </div>
        
        <div className="bg-slate-50 border border-slate-100 px-6 py-4 rounded-2xl text-center shrink-0 w-full md:w-auto flex flex-col justify-center">
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1">Tasks Today</p>
          <p className="text-2xl font-bold text-slate-900 flex items-baseline justify-center gap-1">
            {dailyLimit.current} <span className="text-sm font-medium text-slate-400">/ {dailyLimit.max}</span>
          </p>
        </div>
      </div>

      {/* --- MODERN SEGMENTED TABS --- */}
      <div className="flex p-1.5 bg-slate-100/80 border border-slate-200 rounded-2xl w-full sm:w-fit mb-8">
        <button
          onClick={() => setActiveTab('videos')}
          className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2.5 ${
            activeTab === 'videos'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
          }`}
        >
          <PlaySquare className="w-4 h-4" /> Video Ads 
          <span className={`px-2 py-0.5 rounded-md text-xs ${activeTab === 'videos' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-200 text-slate-500'}`}>
            {videoTasks.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('links')}
          className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2.5 ${
            activeTab === 'links'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
          }`}
        >
          <MousePointerClick className="w-4 h-4" /> PTC Links
          <span className={`px-2 py-0.5 rounded-md text-xs ${activeTab === 'links' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-200 text-slate-500'}`}>
            {linkTasks.length}
          </span>
        </button>
      </div>

      {/* --- TAB CONTENT: VIDEOS --- */}
      {activeTab === 'videos' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {videoTasks.length === 0 ? (
            <div className="col-span-full py-20 flex flex-col items-center justify-center bg-white border border-slate-200 rounded-3xl shadow-sm">
              <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-2xl flex items-center justify-center mb-4">
                <PlaySquare className="w-8 h-8" />
              </div>
              <p className="text-slate-500 font-medium">No video ads available right now. Check back later!</p>
            </div>
          ) : videoTasks.map((ad) => {
            const isCompleted = completedTasks.includes(ad._id);
            return (
              <div key={ad._id} className={`bg-white rounded-3xl shadow-sm flex flex-col overflow-hidden transition-all duration-300 border-2 group ${
                isCompleted ? 'border-emerald-100 bg-emerald-50/30' : 'border-slate-100 hover:border-slate-200 hover:shadow-md hover:-translate-y-1'
              }`}>
                <div className="h-40 bg-gradient-to-br from-slate-100 to-slate-200 relative flex items-center justify-center">
                  <PlaySquare className={`w-12 h-12 transition-colors ${isCompleted ? 'text-emerald-300' : 'text-slate-300 group-hover:text-indigo-300'}`} />
                  <div className="absolute bottom-3 right-3 bg-slate-900/70 backdrop-blur-md text-white text-xs font-semibold px-2 py-1 rounded-lg">
                    {ad.duration}s
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <h3 className={`font-bold text-base mb-4 line-clamp-2 leading-snug ${isCompleted ? 'text-slate-500' : 'text-slate-900'}`}>{ad.title}</h3>
                  
                  <div className="flex items-center justify-between mb-6 mt-auto">
                    <span className={`font-bold text-2xl tracking-tight ${isCompleted ? 'text-emerald-500' : 'text-emerald-600'}`}>₦{adReward}</span>
                    <span className="text-xs text-slate-500 font-semibold flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-lg">
                      <Clock className="w-3.5 h-3.5" /> {ad.duration} sec
                    </span>
                  </div>

                  <button
                    onClick={() => handleStartTask(ad)}
                    disabled={isCompleted || dailyLimit.current >= dailyLimit.max}
                    className={`w-full py-3.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-sm ${
                      isCompleted
                        ? 'bg-emerald-100 text-emerald-700 cursor-not-allowed'
                        : 'bg-slate-900 hover:bg-indigo-600 text-white hover:shadow-md'
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

      {/* --- TAB CONTENT: LINKS --- */}
      {activeTab === 'links' && (
        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="w-full overflow-x-auto [-webkit-overflow-scrolling:touch]">
            <table className="min-w-[640px] w-full text-left border-collapse">
              <thead className="bg-slate-50/50 text-slate-500 text-xs uppercase font-bold tracking-wider border-b border-slate-100">
                <tr>
                  <th className="px-6 py-5">Task Description</th>
                  <th className="px-6 py-5 text-center">Timer</th>
                  <th className="px-6 py-5 text-center">Reward</th>
                  <th className="px-6 py-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm text-slate-700">
                {linkTasks.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-20 text-center text-slate-500 font-medium">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-2xl flex items-center justify-center mb-2">
                          <MousePointerClick className="w-8 h-8" />
                        </div>
                        No PTC links available right now. Check back later!
                      </div>
                    </td>
                  </tr>
                ) : linkTasks.map((link) => {
                  const isCompleted = completedTasks.includes(link._id);
                  return (
                    <tr key={link._id} className={`border-b border-slate-50 transition-colors group ${isCompleted ? 'bg-emerald-50/20' : 'hover:bg-slate-50/80'}`}>
                      <td className="px-6 py-5">
                        <p className={`font-semibold ${isCompleted ? 'text-slate-400 line-through' : 'text-slate-900 group-hover:text-indigo-600 transition-colors'}`}>
                          {link.title}
                        </p>
                      </td>
                      <td className="px-6 py-5 text-center text-slate-500 font-medium">
                        <div className="inline-flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-lg text-xs font-semibold">
                          <Clock className="w-3.5 h-3.5 text-slate-400" /> {link.duration}s
                        </div>
                      </td>
                      <td className="px-6 py-5 text-center font-bold text-emerald-600 text-base">
                        ₦{adReward}
                      </td>
                      <td className="px-6 py-5 text-right">
                        <button
                          onClick={() => handleStartTask(link)}
                          disabled={isCompleted || dailyLimit.current >= dailyLimit.max}
                          className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all inline-flex items-center gap-2 ${
                            isCompleted
                              ? 'bg-transparent text-emerald-600 cursor-not-allowed'
                              : 'bg-white border border-slate-200 text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 shadow-sm'
                          }`}
                        >
                          {isCompleted ? (
                            <><CheckCircle2 className="w-4 h-4" /> Done</>
                          ) : (
                            <>Visit Link <ExternalLink className="w-4 h-4" /></>
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

      {/* --- MODERN TASK EXECUTION MODAL --- */}
      {activeTask && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">

            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-white">
              <h4 className="font-bold text-slate-900 text-lg truncate pr-4 flex items-center gap-2">
                {activeTask.type === 'video' ? <PlaySquare className="w-5 h-5 text-indigo-600" /> : <ExternalLink className="w-5 h-5 text-indigo-600" />}
                {activeTask.type === 'video' ? 'Watching Video Ad' : 'Visiting Sponsor Link'}
              </h4>
              <button
                onClick={cancelTask}
                disabled={isVerifying}
                className={`p-2 rounded-xl transition-all ${isVerifying ? 'text-slate-300 cursor-not-allowed' : 'text-slate-400 hover:bg-red-50 hover:text-red-600'}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-8 bg-slate-900 min-h-[280px] flex items-center justify-center text-center relative overflow-hidden">
              
              {/* Subtle background glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>

              <div className="relative z-10">
                {isVerifying ? (
                  <Loader2 className="w-16 h-16 text-emerald-500 mx-auto mb-6 animate-spin" />
                ) : activeTask.type === 'video' ? (
                  <PlaySquare className="w-16 h-16 text-indigo-400 mx-auto mb-6 animate-pulse" />
                ) : (
                  <ExternalLink className="w-16 h-16 text-indigo-400 mx-auto mb-6 animate-pulse" />
                )}

                <p className="text-slate-400 text-sm font-medium tracking-wide uppercase">
                  {isVerifying
                    ? 'Verifying task completion...'
                    : activeTask.type === 'video' ? 'Awaiting video completion...' : 'Awaiting page view...'}
                </p>
                <p className="text-white font-bold mt-3 text-xl leading-snug">{activeTask.title}</p>
                
                {!isVerifying && (
                  <p className="text-slate-500 text-sm mt-6">
                    Page didn't open? <a href={activeTask.url} target="_blank" rel="noreferrer" className="text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-2">Click here</a>.
                  </p>
                )}
              </div>
            </div>

            {/* Modal Footer & Progress */}
            <div className="p-6 bg-white">
              <div className="flex justify-between text-sm font-bold mb-3">
                <span className="text-slate-700">{isVerifying ? 'Processing Reward...' : 'Please stay on this page...'}</span>
                <span className={timeLeft <= 5 ? 'text-red-500' : 'text-indigo-600'}>
                  {isVerifying ? 'Done' : `${timeLeft}s left`}
                </span>
              </div>

              {/* Modern Smooth Progress Bar */}
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ease-linear ${isVerifying ? 'bg-emerald-500' : 'bg-indigo-600'}`}
                  style={{ width: isVerifying ? '100%' : `${100 - ((timeLeft / activeTask.duration) * 100)}%` }}
                ></div>
              </div>

              <div className="mt-5 text-center">
                <p className="text-xs font-medium text-slate-500 bg-slate-50 py-2 px-4 rounded-lg inline-block">
                  <span className="text-amber-600 font-bold">Warning:</span> Do not close this window, or you will forfeit your ₦{adReward} reward.
                </p>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}