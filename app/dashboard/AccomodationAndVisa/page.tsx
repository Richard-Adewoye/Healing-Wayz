'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  SendHorizontal,
  Check,
} from 'lucide-react';

export default function AccommodationAndVisaPage() {
  const pathname = usePathname();

  const sidebarNavItems = [
    { label: 'My Healthcare Journey', icon: Home, href: '/dashboard' },
    { label: 'Recommendations', icon: ThumbsUp, href: '/recommendations' },
    { label: 'Treatment Plan', icon: ClipboardList, href: '/treatment-plan' },
    { label: 'Accommodation', icon: Hotel, href: '/accommodation', active: true },
    { label: 'Messages', icon: MessageSquare, href: '/messages' },
    { label: 'My Cases', icon: Folder, href: '/cases' },
    { label: 'Visa Support', icon: FileText, href: '/visa-support' },
    { label: 'Billing & Payments', icon: CreditCard, href: '/billing' },
    { label: 'Documents', icon: File, href: '/documents' },
    { label: 'Profile', icon: User, href: '/profile' },
  ];

  const journeySteps = [
    { number: 1, label: 'Consultation Submitted', completed: true, href: '/consultation' },
    { number: 2, label: 'Case Review', completed: true, href: '/case-review' },
    { number: 3, label: 'Hospital Recommendation', completed: true, href: '/recommendations' },
    { number: 4, label: 'Medical Itinerary', completed: true, href: '/treatment-plan' },
    { number: 5, label: 'Accommodation & Visa', current: true, href: '/accommodation' },
    { number: 6, label: 'Travel Preparation', completed: false, href: '/travel-prep' },
    { number: 7, label: 'Treatment & Recovery', completed: false, href: '/treatment-recovery' },
  ];

  const quickActions = [
    { label: 'Upload Document', href: '/documents/upload' },
    { label: 'View Recommendations', href: '/recommendations' },
    { label: 'Billing & Payments', href: '/billing' },
    { label: 'Message Coordinator', href: '/messages' },
    { label: 'Start a New Consultation', href: '/consultation/new' },
  ];

  return (
    <div className="flex min-h-screen bg-[#F7FAFC]">
      {/* Sidebar (Left Navigation) */}
      <aside className="w-64 border-r border-slate-200 bg-[#F2F6FA] flex flex-col justify-between p-4 shrink-0">
        <div>
          {/* Brand Logo */}
          <div className="flex items-center gap-2 mb-8 px-2">
            <div className="w-8 h-8 rounded-full border-2 border-[#1E6B52] flex items-center justify-center font-bold text-[#1E6B52]">
              HW
            </div>
            <span className="font-semibold text-slate-800 text-lg">HealingWays</span>
          </div>

          {/* Nav Links */}
          <nav className="space-y-1">
            {sidebarNavItems.map((item, idx) => {
              const Icon = item.icon;
              const isActive = item.active || pathname === item.href;
              return (
                <Link
                  key={idx}
                  href={item.href}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#E2EDF8] text-[#2563EB] font-semibold'
                      : 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#2563EB]' : 'text-slate-500'}`} />
                  {item.label}
                </Link>
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
        {/* 1. Top Header Bar */}
        <header className="flex items-center justify-between px-8 py-4 bg-white border-b border-slate-100">
          <h1 className="text-lg font-bold text-slate-800">My Healthcare Journey</h1>
          <div className="flex items-center gap-4">
            <Link
              href="/"
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
          {/* 2. Greeting Header & Action Button */}
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900">Good to see you, Amara.</h2>
              <p className="text-sm text-slate-500 mt-1">
                Case HW-2026-531971 · Last updated Today
              </p>
            </div>
            <Link
              href="/consultation/new"
              className="bg-[#2D8A65] hover:bg-[#236C4F] text-white font-medium px-4 py-2.5 rounded-lg text-sm flex items-center gap-2 shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Consultation
            </Link>
          </div>

          {/* 3. Promotional Banner */}
          <div className="bg-[#EBF7F0] border border-emerald-100 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <SendHorizontal className="w-5 h-5 text-emerald-600 rotate-[-30deg]" />
              <span className="text-sm text-slate-800">
                <strong className="font-semibold">New: Flight Booking & Scheduling</strong> — save up to 5% on all flights.
              </span>
            </div>
            <Link href="/flights" className="text-sm font-semibold text-[#1E6B52] hover:underline flex items-center gap-1">
              Learn more →
            </Link>
          </div>

          {/* 4. Journey Stepper Progress Bar */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
            <span className="text-xs font-bold text-blue-600 tracking-wider uppercase">
              YOUR HEALTHCARE JOURNEY
            </span>

            <div className="overflow-x-auto pb-4">
              <div className="min-w-[700px] flex items-center justify-between relative px-4">
                {/* Connecting Bar Background */}
                <div className="absolute top-4 left-8 right-8 h-0.5 bg-slate-200 -z-0" />
                {/* Completed Green Progress Line */}
                <div className="absolute top-4 left-8 w-[62%] h-0.5 bg-emerald-600 -z-0" />

                {journeySteps.map((step) => (
                  <Link
                    key={step.number}
                    href={step.href}
                    className="relative z-10 flex flex-col items-center max-w-[100px] text-center group cursor-pointer"
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
                        step.completed
                          ? 'bg-emerald-600 text-white'
                          : step.current
                          ? 'bg-white border-2 border-emerald-600 text-emerald-700 ring-4 ring-emerald-50'
                          : 'bg-white border-2 border-slate-300 text-slate-400 group-hover:border-slate-400'
                      }`}
                    >
                      {step.completed ? <Check className="w-4 h-4 stroke-[3]" /> : step.number}
                    </div>
                    <span
                      className={`text-xs font-medium mt-2 leading-tight ${
                        step.current
                          ? 'text-emerald-700 font-bold'
                          : step.completed
                          ? 'text-slate-800'
                          : 'text-slate-500'
                      }`}
                    >
                      {step.label}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* 5. Stage 5 Active Card: Confirm Your Accommodation */}
          <div className="bg-[#EBF7F0] border border-emerald-100 rounded-2xl p-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Confirm Your Accommodation</h3>
              <p className="text-sm text-slate-600 mt-1 max-w-xl">
                Review accommodation options near your recommended hospital, based on your treatment timeline.
              </p>
            </div>
            <Link
              href="/accommodation/options"
              className="bg-[#2D8A65] hover:bg-[#236C4F] text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors shadow-sm"
            >
              View Accommodation
            </Link>
          </div>

          {/* 6. Case Review Notice Box */}
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

          {/* 7. Two-Column Dashboard Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Care Coordinator */}
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
              <Link
                href="/messages"
                className="inline-block px-4 py-2 border border-emerald-600 text-emerald-700 hover:bg-emerald-50 rounded-lg text-sm font-semibold transition-colors"
              >
                Send Message
              </Link>
            </div>

            {/* Case Summary */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-3">
              <span className="text-xs font-bold text-blue-600 tracking-wider uppercase">
                CASE SUMMARY
              </span>
              <div className="text-sm space-y-2 text-slate-700">
                <p><strong className="font-semibold text-slate-900">Case ID:</strong> HW-2026-531971</p>
                <p><strong className="font-semibold text-slate-900">Healthcare Need:</strong> Not sure, I need guidance</p>
                <p><strong className="font-semibold text-slate-900">Stage:</strong> Accommodation & Visa</p>
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
                href="/messages"
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
                href="/documents"
                className="inline-flex items-center gap-1 text-sm font-bold text-[#1E40AF] hover:underline pt-2"
              >
                View Documents →
              </Link>
            </div>
          </div>

          {/* 8. Quick Actions Section */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <span className="text-xs font-bold text-blue-600 tracking-wider uppercase">
              QUICK ACTIONS
            </span>
            <div className="flex flex-wrap gap-3">
              {quickActions.map((action, idx) => (
                <Link
                  key={idx}
                  href={action.href}
                  className="px-4 py-2 border border-emerald-600 text-emerald-700 hover:bg-emerald-50 rounded-lg text-sm font-semibold transition-colors"
                >
                  {action.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}