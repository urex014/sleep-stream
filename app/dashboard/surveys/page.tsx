'use client';

import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

export default function SurveysPage() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // 1. Fetch the logged-in user's ID
    const fetchUser = async () => {
      const res = await fetch('/api/user/settings');
      const data = await res.json();
      
      // Using your custom profile logic perfectly!
      if (data.success) setUserId(data.profile.id);
    };
    fetchUser();
  }, []);

  if (!userId) {
    return <div className="flex justify-center p-20"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>;
  }

  // --- THE CPX SWITCH ---
  // We swapped the BitLabs URL for the CPX URL.
  // Notice it now uses NEXT_PUBLIC_CPX_APP_ID and ext_user_id!
  const OFFERWALL_URL = `https://offers.cpx-research.com/index.php?app_id=${process.env.NEXT_PUBLIC_CPX_APP_ID}&ext_user_id=${userId}`;

  return (
    <div className="space-y-4 h-[calc(100vh-100px)] flex flex-col">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Surveys</h1>
        <p className="text-slate-500 text-sm">Complete paying market research to earn rewards.</p>
      </div>

      {/* Embed the CPX Survey Wall */}
      <div className="flex-1 w-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative">
        <iframe 
          src={OFFERWALL_URL}
          className="w-full h-full border-0 absolute inset-0"
          title="CPX Survey Offerwall"
          allow="camera; microphone" 
        />
      </div>
    </div>
  );
}

// export default function surveysPage() {
//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-2xl font-bold text-slate-900">Surveys</h1>
//         <p className="mt-1 text-sm text-slate-500">
//           A dedicated survey wall is on the way. We&apos;re focusing on polishing the core experience first.
//         </p>
//       </div>

//       <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-slate-100 p-8 shadow-sm">
//         <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-blue-100/60 blur-3xl" />
//         <div className="absolute bottom-0 left-0 h-28 w-28 rounded-full bg-sky-100/70 blur-3xl" />

//         <div className="relative mx-auto flex min-h-[360px] max-w-2xl flex-col items-center justify-center text-center">
//           <div className="mb-4 inline-flex rounded-full border border-blue-200 bg-blue-50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">
//             Coming Soon
//           </div>

//           <h2 className="text-3xl font-semibold tracking-tight text-slate-900">
//             Survey rewards are in development
//           </h2>

          

          
//         </div>
//       </div>
//     </div>
//   )
// }
