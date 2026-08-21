'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Home, 
  ThumbsUp, 
  ClipboardList, 
  Hotel, 
  MessageSquare, 
  Folder, 
  FileText, 
  CreditCard, 
  File, 
  User, 
  LogOut, 
  Bell, 
  Plus, 
  Send, 
  Check, 
  ArrowRight, 
  SendHorizontal 
} from 'lucide-react';

export default function DashboardPage() {
  const sidebarNavItems = [
    { label: 'My Healthcare Journey', icon: Home, active: true },
    { label: 'Recommendations', icon: ThumbsUp },
    { label: 'Treatment Plan', icon: ClipboardList },
    { label: 'Accommodation', icon: Hotel },
    { label: 'Messages', icon: MessageSquare },
    { label: 'My Cases', icon: Folder },
    { label: 'Visa Support', icon: FileText },
    { label: 'Billing & Payments', icon: CreditCard },
    { label: 'Documents', icon: File },
    { label: 'Profile', icon: User },
  ];

  const journeySteps = [
    { label: 'Consultation Submitted', completed: true },
    { label: 'Case Review', completed: true },
    { label: 'Hospital Recommendation', completed: true },
    { label: 'Medical Itinerary', completed: true },
    { label: 'Accommodation & Visa', completed: true },
    { label: 'Travel Preparation', completed: true },
    { label: 'Treatment & Recovery', completed: false, stepNumber: 7 },
  ];

  const quickActions = [
    'Upload Document',
    'View Recommendations',
    'Billing & Payments',
    'Message Coordinator',
    'Start a New Consultation',
  ];

  return (
    <div className="flex min-h-screen bg-[#F7FAFC]">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-200 bg-[#F2F6FA] flex flex-col justify-between p-4 shrink-0">
        <div>
          {/* Logo Placeholder */}
          <div className="flex items-center gap-2 mb-8 px-2">
            <div className="w-8 h-8 rounded-full border-2 border-[#1E6B52] flex items-center justify-center font-bold text-[#1E6B52]">
              HW
            </div>
            <span className="font-semibold text-slate-800 text-lg">HealingWays</span>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {sidebarNavItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    item.active
                      ? 'bg-[#E2EDF8] text-[#2563EB] font-semibold'
                      : 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${item.active ? 'text-[#2563EB]' : 'text-slate-500'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="pt-4 border-t border-slate-200">
          <button className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 px-2 py-1.5 w-full">
            <LogOut className="w-4 h-4 text-emerald-600" />
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0">
        {/* Top Bar */}
        <header className="flex items-center justify-between px-8 py-4 bg-white border-b border-slate-100">
          <h1 className="text-lg font-bold text-slate-800">My Healthcare Journey</h1>
          <div className="flex items-center gap-4">
            <Link
              href="#"
              className="text-sm font-semibold text-[#2563EB] hover:underline flex items-center gap-1"
            >
              ← Back to Website
            </Link>
            <button className="relative p-2 text-slate-500 hover:text-slate-700">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
              A
            </div>
          </div>
        </header>

        <div className="p-8 max-w-6xl mx-auto space-y-6">
          {/* Welcome Header & Action */}
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900">Good to see you, Amara.</h2>
              <p className="text-sm text-slate-500 mt-1">
                Case HW-2026-531971 · Last updated Today
              </p>
            </div>
            <button className="bg-[#2D8A65] hover:bg-[#236C4F] text-white font-medium px-4 py-2.5 rounded-lg text-sm flex items-center gap-2 shadow-sm transition-colors">
              <Plus className="w-4 h-4" />
              New Consultation
            </button>
          </div>

          {/* Banner */}
          <div className="bg-[#EBF7F0] border border-emerald-100 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <SendHorizontal className="w-5 h-5 text-emerald-600 rotate-[-30deg]" />
              <span className="text-sm text-slate-800">
                <strong className="font-semibold">New: Flight Booking & Scheduling</strong> — save up to 5% on all flights.
              </span>
            </div>
            <Link href="#" className="text-sm font-semibold text-[#1E6B52] hover:underline flex items-center gap-1">
              Learn more →
            </Link>
          </div>

          {/* Healthcare Journey Progress Tracker */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
            <span className="text-xs font-bold text-blue-600 tracking-wider uppercase">
              YOUR HEALTHCARE JOURNEY
            </span>

            <div className="overflow-x-auto pb-4">
              <div className="min-w-[700px] flex items-center justify-between relative px-4">
                {/* Connecting Line */}
                <div className="absolute top-4 left-8 right-8 h-0.5 bg-emerald-600 -z-0" />

                {journeySteps.map((step, idx) => (
                  <div key={idx} className="relative z-10 flex flex-col items-center max-w-[100px] text-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
                        step.completed
                          ? 'bg-emerald-600 text-white'
                          : 'bg-white border-2 border-emerald-600 text-emerald-700'
                      }`}
                    >
                      {step.completed ? <Check className="w-4 h-4 stroke-[3]" /> : step.stepNumber}
                    </div>
                    <span className="text-xs font-medium text-slate-700 mt-2 leading-tight">
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Current Stage Highlight */}
          <div className="bg-[#EBF7F0] border border-emerald-100 rounded-2xl p-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Travel Preparation Underway</h3>
              <p className="text-sm text-slate-600 mt-1 max-w-xl">
                Your coordinator is finalizing travel arrangements. We'll notify you as soon as there's an update.
              </p>
            </div>
            <button className="bg-[#2D8A65] hover:bg-[#236C4F] text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors shadow-sm">
              Message Coordinator
            </button>
          </div>

          {/* Quick Actions Bar */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <span className="text-xs font-bold text-blue-600 tracking-wider uppercase">
              QUICK ACTIONS
            </span>
            <div className="flex flex-wrap gap-3">
              {quickActions.map((action, idx) => (
                <button
                  key={idx}
                  className="px-4 py-2 border border-emerald-600 text-emerald-700 hover:bg-emerald-50 rounded-lg text-sm font-semibold transition-colors"
                >
                  {action}
                </button>
              ))}
            </div>
          </div>

          {/* Coordinator Notice (Featured) */}
          <div className="bg-white border-l-4 border-l-emerald-600 border border-slate-200 rounded-xl p-5 shadow-sm space-y-2">
            <span className="text-xs font-bold text-blue-600 tracking-wider uppercase">
              CASE REVIEW FROM YOUR COORDINATOR
            </span>
            <p className="text-sm text-slate-800">
              edfgjkl;kjgfdrewqertyujk
            </p>
            <p className="text-xs text-slate-400 pt-1">
              Sarah James · Just now
            </p>
          </div>

          {/* Two-Column Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Assigned Care Coordinator */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
              <span className="text-xs font-bold text-blue-600 tracking-wider uppercase">
                ASSIGNED CARE COORDINATOR
              </span>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#1E40AF] text-white flex items-center justify-center font-bold">
                  S
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-sm">Sarah James</p>
                  <p className="text-xs text-slate-500">Patient Care Coordinator</p>
                </div>
              </div>
              <p className="text-xs text-slate-500">
                Available Monday–Friday, 9:00 AM–5:00 PM
              </p>
              <button className="px-4 py-2 border border-emerald-600 text-emerald-700 hover:bg-emerald-50 rounded-lg text-sm font-semibold transition-colors">
                Send Message
              </button>
            </div>

            {/* Case Summary */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-3">
              <span className="text-xs font-bold text-blue-600 tracking-wider uppercase">
                CASE SUMMARY
              </span>
              <div className="text-sm space-y-2 text-slate-700">
                <p><strong className="font-semibold text-slate-900">Case ID:</strong> HW-2026-531971</p>
                <p><strong className="font-semibold text-slate-900">Healthcare Need:</strong> Not sure, I need guidance</p>
                <p><strong className="font-semibold text-slate-900">Stage:</strong> Treatment & Recovery</p>
                <p><strong className="font-semibold text-slate-900">Started:</strong> Today</p>
              </div>
            </div>

            {/* Recent Messages */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
              <span className="text-xs font-bold text-blue-600 tracking-wider uppercase">
                RECENT MESSAGES
              </span>
              <p className="text-sm text-slate-600 italic">
                "Good question. Let me confirm the details with our clinical advisor and follow up within t..."
              </p>
              <p className="text-xs text-slate-400">
                Sarah James · Just now
              </p>
              <Link
                href="#"
                className="inline-flex items-center gap-1 text-sm font-bold text-[#1E40AF] hover:underline"
              >
                Open Messages →
              </Link>
            </div>

            {/* Documents */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
              <span className="text-xs font-bold text-blue-600 tracking-wider uppercase">
                DOCUMENTS
              </span>
              <div className="text-sm text-slate-600 space-y-1">
                <p>1 document on file</p>
                <p className="text-xs text-slate-400">0 under review</p>
              </div>
              <Link
                href="#"
                className="inline-flex items-center gap-1 text-sm font-bold text-[#1E40AF] hover:underline pt-2"
              >
                View Documents →
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}