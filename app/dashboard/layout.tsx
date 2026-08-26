'use client';

import React, { useState } from 'react';
import Sidebar from './_components/Sidebar';
import { Menu, Check, FileText, Stethoscope, ClipboardList, HeartPulse } from 'lucide-react';

interface JourneyStage {
  id: number;
  label: string;
  description: string;
  icon: React.ElementType;
}

const JOURNEY_STAGES: JourneyStage[] = [
  { id: 1, label: 'Inquiry', description: 'Request submitted', icon: FileText },
  { id: 2, label: 'Consultation', description: 'Clinical review', icon: Stethoscope },
  { id: 3, label: 'Treatment Plan', description: 'Schedule & cost', icon: ClipboardList },
  { id: 4, label: 'Post-Care', description: 'Recovery follow-up', icon: HeartPulse },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  // Centralized current stage state (or pass this via React Context / global state)
  const [currentStage, setCurrentStage] = useState<number>(2);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Mobile-Only Header Bar (Hidden on Desktop) */}
      <div className="md:hidden bg-white border-b border-slate-200/80 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
        <button
          onClick={() => setIsMobileOpen(true)}
          className="p-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
          aria-label="Open sidebar"
        >
          <Menu className="w-6 h-6" />
        </button>
        <span className="font-bold text-blue-900 text-sm">HealingWays</span>
      </div>

      {/* Sidebar Component */}
      <Sidebar 
        isMobileOpen={isMobileOpen} 
        onClose={() => setIsMobileOpen(false)} 
      />

      {/* Main Page Area */}
      <main className="flex-1 min-w-0 flex flex-col overflow-x-hidden">
        {/* User Journey Stage Banner */}
        <div className="bg-white border-b border-slate-200/80 px-4 sm:px-8 py-4 sm:py-5 shrink-0">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Current Care Journey
              </span>
              <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60">
                Stage {currentStage} of {JOURNEY_STAGES.length}
              </span>
            </div>
``
            {/* Stepper Progress Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 relative">
              {JOURNEY_STAGES.map((stage) => {
                const Icon = stage.icon;
                const isCompleted = stage.id < currentStage;
                const isCurrent = stage.id === currentStage;

                return (
                  <div
                    key={stage.id}
                    className={`flex items-center gap-3 p-2.5 sm:p-3 rounded-xl border transition-all ${
                      isCurrent
                        ? 'bg-[#ECFDF5] border-[#10B981] text-slate-800 shadow-sm'
                        : isCompleted
                        ? 'bg-slate-50/80 border-slate-200 text-slate-600'
                        : 'bg-white border-slate-100 text-slate-400'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center shrink-0 text-xs sm:text-sm font-bold ${
                        isCurrent
                          ? 'bg-[#10B981] text-white'
                          : isCompleted
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {isCompleted ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                    </div>

                    <div className="min-w-0">
                      <p className={`text-xs font-bold truncate ${isCurrent ? 'text-slate-900' : ''}`}>
                        {stage.label}
                      </p>
                      <p className="text-[10px] sm:text-xs text-slate-400 truncate hidden sm:block">
                        {stage.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}