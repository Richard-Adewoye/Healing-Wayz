'use client';

import React from 'react';
import Link from 'next/link';
import { Bell, Plus, Send, Paperclip, ChevronRight } from 'lucide-react';

const steps = [
  { number: 1, label: 'Consultation Submitted', active: true },
  { number: 2, label: 'Case Review', active: false },
  { number: 3, label: 'Hospital Recommendation', active: false },
  { number: 4, label: 'Medical Itinerary', active: false },
  { number: 5, label: 'Accommodation & Visa', active: false },
  { number: 6, label: 'Travel Preparation', active: false },
  { number: 7, label: 'Treatment & Recovery', active: false },
];

export default function JourneyDashboard() {
  return (
    <div className="flex-1 bg-slate-50/50 min-h-screen p-6 sm:p-10 space-y-8 max-w-7xl">
      
      {/* Top Header Bar */}
      <div className="flex items-center justify-between border-b border-gray-200/80 pb-5">
        <h1 className="text-xl font-bold text-blue-900">My Healthcare Journey</h1>
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
          >
            ← Back to Website
          </Link>
          <button className="p-2 text-gray-500 hover:text-gray-700 relative rounded-full hover:bg-slate-100">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>
          <div className="w-9 h-9 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
            A
          </div>
        </div>
      </div>

      {/* Greeting & Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-blue-900">
            Good to see you, Amara.
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Case HW-2026-531971 · Last updated Today
          </p>
        </div>
        <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm transition-colors self-start sm:self-auto">
          <Plus className="w-4 h-4" />
          New Consultation
        </button>
      </div>

      {/* Promotional / Announcement Banner */}
      <div className="p-4 bg-emerald-50/60 border border-emerald-100 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Send className="w-4 h-4 text-emerald-600 rotate-45 flex-shrink-0" />
          <span className="text-xs sm:text-sm text-slate-800 font-medium">
            <strong className="font-semibold text-slate-900">New:</strong> Flight Booking & Scheduling — save up to 5% on all flights.
          </span>
        </div>
        <Link
          href="#"
          className="text-xs sm:text-sm font-bold text-blue-900 hover:text-blue-700 transition-colors whitespace-nowrap"
        >
          Learn more →
        </Link>
      </div>

      {/* Journey Stepper Component */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
          YOUR HEALTHCARE JOURNEY
        </span>

        <div className="overflow-x-auto pb-4">
          <div className="min-w-[700px] flex items-center justify-between relative px-4">
            {/* Horizontal Line behind numbers */}
            <div className="absolute top-4 left-8 right-8 h-0.5 bg-gray-200 -z-0" />

            {steps.map((step) => (
              <div key={step.number} className="relative z-10 flex flex-col items-center max-w-[100px] text-center space-y-2">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs border-2 transition-all ${
                    step.active
                      ? 'border-emerald-600 text-emerald-700 bg-white ring-4 ring-emerald-50'
                      : 'border-gray-200 text-gray-400 bg-white'
                  }`}
                >
                  {step.number}
                </div>
                <span
                  className={`text-[11px] font-semibold leading-tight ${
                    step.active ? 'text-emerald-700 font-bold' : 'text-gray-500'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Case Status Notice Box */}
      <div className="p-6 bg-emerald-50/60 border border-emerald-100/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-base font-bold text-blue-900">Case Under Review</h3>
          <p className="text-xs sm:text-sm text-gray-600">
            Our team is reviewing your case. We'll notify you as soon as there's an update.
          </p>
        </div>
        <button className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm rounded-lg shadow-sm transition-colors self-start sm:self-auto">
          Message Coordinator
        </button>
      </div>

      {/* 2x2 Grid Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Assigned Care Coordinator Card */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-5">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
            ASSIGNED CARE COORDINATOR
          </span>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-900 text-white font-bold flex items-center justify-center text-sm">
              S
            </div>
            <div>
              <h4 className="text-sm font-bold text-blue-900">Sarah James</h4>
              <p className="text-xs text-gray-500">Patient Care Coordinator</p>
            </div>
          </div>
          <p className="text-xs text-gray-500">Available Monday–Friday, 9:00 AM–5:00 PM</p>
          <button className="px-4 py-2 border border-emerald-600 text-emerald-700 font-semibold text-xs rounded-lg hover:bg-emerald-50 transition-colors">
            Send Message
          </button>
        </div>

        {/* Case Summary Card */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-5">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
            CASE SUMMARY
          </span>
          <div className="space-y-2 text-xs text-gray-600">
            <p><strong className="text-slate-800 font-semibold">Case ID:</strong> HW-2026-531971</p>
            <p><strong className="text-slate-800 font-semibold">Healthcare Need:</strong> Not sure, I need guidance</p>
            <p><strong className="text-slate-800 font-semibold">Stage:</strong> Consultation Submitted</p>
            <p><strong className="text-slate-800 font-semibold">Started:</strong> Today</p>
          </div>
        </div>

        {/* Recent Messages Card */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
            RECENT MESSAGES
          </span>
          <p className="text-xs text-gray-600 italic">
            "Good question. Let me confirm the details with our clinical advisor and follow up within t..."
          </p>
          <p className="text-[11px] text-gray-400">Sarah James · Just now</p>
          <Link
            href="/dashboard/messages"
            className="text-xs font-bold text-blue-900 hover:text-blue-700 inline-flex items-center gap-1 transition-colors pt-2"
          >
            Open Messages →
          </Link>
        </div>

        {/* Documents Card */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
            DOCUMENTS
          </span>
          <div className="space-y-1 text-xs text-gray-600">
            <p>1 document on file</p>
            <p className="text-gray-400">0 under review</p>
          </div>
          <Link
            href="/dashboard/documents"
            className="text-xs font-bold text-blue-900 hover:text-blue-700 inline-flex items-center gap-1 transition-colors pt-2"
          >
            View Documents →
          </Link>
        </div>

      </div>

      {/* Quick Actions Row */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
          QUICK ACTIONS
        </span>
        <div className="flex flex-wrap items-center gap-3">
          <button className="px-4 py-2 border border-emerald-600 text-emerald-700 font-semibold text-xs rounded-lg hover:bg-emerald-50 transition-colors">
            Upload Document
          </button>
          <button className="px-4 py-2 border border-emerald-600 text-emerald-700 font-semibold text-xs rounded-lg hover:bg-emerald-50 transition-colors">
            View Recommendations
          </button>
          <button className="px-4 py-2 border border-emerald-600 text-emerald-700 font-semibold text-xs rounded-lg hover:bg-emerald-50 transition-colors">
            Billing & Payments
          </button>
          <button className="px-4 py-2 border border-emerald-600 text-emerald-700 font-semibold text-xs rounded-lg hover:bg-emerald-50 transition-colors">
            Message Coordinator
          </button>
          <button className="px-4 py-2 border border-emerald-600 text-emerald-700 font-semibold text-xs rounded-lg hover:bg-emerald-50 transition-colors">
            Start a New Consultation
          </button>
        </div>
      </div>

    </div>
  );
}