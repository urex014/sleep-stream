'use client'
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef } from 'react';
import { Activity, PauseCircle, PlayCircle } from 'lucide-react';

export default function LiveTerminal() {
  const [logs, setLogs] = useState<any[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isRunning, setIsRunning] = useState(true);

  // --- LOGIC: The "Brain" of the terminal ---
  useEffect(() => {
    if (!isRunning) return;

    const possibleLogs = [
      { text: "Pinging ad server (us-east-2)...", color: "text-zinc-500", delay: 800 },
      { text: "Ad available: video_rewarded_v2", color: "text-zinc-300", delay: 1200 },
      { text: "Buffering video content...", color: "text-zinc-500", delay: 2000 },
      { text: "View validated successfully.", color: "text-gray-400", delay: 1000 },
      { text: "Credit: +$0.001 added to wallet", color: "text-gray-400 font-bold", delay: 1500 },
      { text: "Switching IP address (Proxy chain)...", color: "text-yellow-600", delay: 2500 },
      {text: "Ad Viewed: [category]Mobile game", color:"text-green-500", delay:2500},
      {text: "Ad Viewed: [category]commerce", color:"text-green-500", delay:2500},
      {text: "Ad Viewed: [category]finance", color:"text-green-500", delay:2500},
      {text: "Ad Viewed: [category]networking", color:"text-green-500", delay:2500},
      { text: "Clearing cache/cookies...", color: "text-zinc-500", delay: 800 },
      {text:"NET:ERR reconnecting ...", color:"text-red-500", delay:1200},
      { text: "Simulating user interaction...", color: "text-zinc-400", delay: 3000 },
      { text: "Handshake verified. 24ms latency.", color: "text-zinc-500", delay: 1000 },
    ];

    let timeoutId: NodeJS.Timeout;

    const addLog = () => {
      // 1. Pick a random log template
      const randomLog = possibleLogs[Math.floor(Math.random() * possibleLogs.length)];
      
      // 2. Create the new log object with current time
      const now = new Date();
      const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
      
      const newEntry = { 
        id: Date.now(), 
        time: timeString, 
        text: randomLog.text, 
        color: randomLog.color 
      };

      // 3. Update state (Keep only last 8 lines to prevent overflow)
      setLogs(prev => [...prev.slice(-7), newEntry]);

      // 4. Schedule next log based on the current log's "delay" weight
      // (e.g. "Watching video" takes longer than "Pinging")
      const randomVariance = Math.random() * 1000;
      timeoutId = setTimeout(addLog, randomLog.delay + randomVariance);
    };

    // Start the loop
    timeoutId = setTimeout(addLog, 1000);

    return () => clearTimeout(timeoutId);
  }, [isRunning]);

 

  return (
    <div className="lg:col-span-2 bg-black border border-zinc-800 rounded-2xl p-6 flex flex-col relative overflow-hidden min-h-[350px]">
      
      {/* Decorative Top Line */}
      <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gray-500 to-transparent opacity-50 ${isRunning ? 'animate-pulse' : 'opacity-0'}`}></div>
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold flex items-center gap-2 text-white">
          <Activity className={`w-4 h-4 ${isRunning ? 'text-gray-500 animate-pulse' : 'text-zinc-600'}`} /> 
          Live Bot Activity
        </h3>
        <div className="flex gap-2">
          <span className="text-xs font-mono text-green-500 bg-gray-500/10 px-2 py-1 rounded">
            {isRunning ? 'STATUS: ONLINE' : 'STATUS: PAUSED'}
          </span>
        </div>
      </div>

      {/* TERMINAL WINDOW */}
      <div className="flex-1 font-mono text-xs space-y-3 overflow-hidden mb-4 relative">
        
        {logs.length === 0 && (
          <div className="text-zinc-500 italic pt-10 text-center">Initializing bot sequence...</div>
        )}

        {logs.map((log) => (
          <div key={log.id} className="flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <span className="text-zinc-600 shrink-0">[{log.time}]</span>
            <span className={log.color}>{log.text}</span>
          </div>
        ))}
        
        {/* Invisible element to auto-scroll to */}
        {/* <div ref={scrollRef} /> */}

        {/* Blinking Cursor */}
        {isRunning && <div className="animate-pulse text-gray-500 mt-2">_</div>}
      </div>

      
      
    </div>
  );
}