'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Check } from 'lucide-react';

interface StepSevenSuccessProps {
  userName?: string;
  caseId?: string;
  onGoToDashboard?: () => void;
  onGoHome?: () => void;
}

export default function StepSevenSuccess({
  userName = 'Patient',
  caseId = 'HW-2026-655662',
  onGoToDashboard,
  onGoHome,
}: StepSevenSuccessProps) {
  const router = useRouter();

  const handleDashboardClick = () => {
    if (onGoToDashboard) {
      onGoToDashboard();
    } else {
      router.push('/dashboard');
    }
  };

  const handleHomeClick = () => {
    if (onGoHome) {
      onGoHome();
    } else {
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full text-center space-y-6">
        
        {/* Success Icon Circle */}
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center shadow-sm">
            <div className="w-12 h-12 rounded-full bg-emerald-600 flex items-center justify-center text-white">
              <Check className="w-7 h-7 stroke-[3]" />
            </div>
          </div>
        </div>

        {/* Main Heading */}
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-950 tracking-tight leading-tight">
            Your account has been created, <br className="hidden sm:inline" />
            {userName}.
          </h1>
          <p className="text-slate-500 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
            Your consultation has been submitted and Case <span className="font-semibold text-slate-700">{caseId}</span> is now active. You can pick up your healthcare journey whenever you're ready.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <button
            type="button"
            onClick={handleDashboardClick}
            className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-lg transition-colors shadow-sm"
          >
            Continue to Dashboard
          </button>
          <button
            type="button"
            onClick={handleHomeClick}
            className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-slate-50 border border-emerald-600 text-emerald-700 font-semibold text-sm rounded-lg transition-colors"
          >
            Back to Home
          </button>
        </div>

      </div>
    </div>
  );
}