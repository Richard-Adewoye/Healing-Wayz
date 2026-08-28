'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Bell, 
  Plus, 
  Send, 
  ArrowRight
} from 'lucide-react';
import HealthcareStepper from '../_components/HealthcareStepper';

export default function TravelPreparationPage() {
  return (
    <div className="flex-1 bg-slate-50/50 min-h-screen p-4 sm:p-8 md:p-10 space-y-6 sm:space-y-8 max-w-7xl mx-auto w-full font-sans">
      
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200/80 pb-4 sm:pb-5 gap-3 sm:gap-4">
        <h1 className="text-lg sm:text-xl font-bold text-blue-900">
          My Healthcare Journey
        </h1>
        <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 w-full sm:w-auto">
          <Link
            href="/"
            className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
          >
            ← Back to Website
          </Link>
          <div className="flex items-center gap-3">
            <button className="p-2 text-slate-500 hover:text-slate-700 relative rounded-full hover:bg-slate-100 transition-colors cursor-pointer">
              <Bell className="w-5 h-5 text-slate-600" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs sm:text-sm shadow-xs shrink-0">
              A
            </div>
          </div>
        </div>
      </div>

      {/* Greeting & Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-900 leading-tight">
            Good to see you, Amara.
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Case HW-2026-531971 · Last updated Today
          </p>
        </div>
        <Link 
          href="/dashboard/consultation/new"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-xs transition-colors w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          New Consultation
        </Link>
      </div>

      {/* Promotional Banner */}
      <div className="p-4 bg-emerald-50/60 border border-emerald-100 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start sm:items-center gap-3">
          <Send className="w-4 h-4 text-emerald-600 rotate-45 shrink-0 mt-0.5 sm:mt-0" />
          <span className="text-xs sm:text-sm text-slate-800 font-medium leading-normal">
            <strong className="font-semibold text-slate-900">New:</strong> Flight Booking & Scheduling — save up to 5% on all flights.
          </span>
        </div>
        <Link
          href="/dashboard/flights"
          className="text-xs sm:text-sm font-bold text-blue-900 hover:text-blue-700 transition-colors whitespace-nowrap self-end sm:self-auto"
        >
          Learn more →
        </Link>
      </div>

      {/* Reusable Healthcare Stepper */}
      <HealthcareStepper />

      {/* Stage 6 Active Banner */}
      <div className="p-5 sm:p-6 bg-emerald-50/60 border border-emerald-100/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-base font-bold text-blue-900">Travel Preparation Underway</h3>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl leading-relaxed">
            Your coordinator is finalizing travel arrangements. We&apos;ll notify you as soon as there&apos;s an update.
          </p>
        </div>
        <Link 
          href="/dashboard/messages"
          className="inline-flex items-center justify-center px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm rounded-lg shadow-xs transition-colors w-full sm:w-auto whitespace-nowrap"
        >
          Message Coordinator
        </Link>
      </div>

      {/* Coordinator Note */}
      <div className="bg-white border-l-4 border-l-emerald-600 p-5 sm:p-6 rounded-r-2xl border border-slate-200 shadow-xs space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-900">
          CASE REVIEW FROM YOUR COORDINATOR
        </span>
        <p className="text-xs sm:text-sm text-slate-800 break-words leading-relaxed font-medium">
          We are currently organizing your flight options and ground transport. Details will be populated here shortly.
        </p>
        <p className="text-[11px] text-slate-400 font-medium pt-1">
          Sarah James · Just now
        </p>
      </div>

      {/* 2x2 Grid Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        
        {/* Assigned Care Coordinator Card */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 sm:space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-900">
              ASSIGNED CARE COORDINATOR
            </span>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-900 text-white font-bold flex items-center justify-center text-sm shrink-0">
                S
              </div>
              <div>
                <h4 className="text-sm font-bold text-blue-900">Sarah James</h4>
                <p className="text-xs text-slate-500">Patient Care Coordinator</p>
              </div>
            </div>
            <p className="text-xs text-slate-500">Available Monday–Friday, 9:00 AM–5:00 PM</p>
          </div>
          <Link 
            href="/dashboard/messages"
            className="inline-block text-center px-4 py-2 border border-emerald-600 text-emerald-700 font-semibold text-xs rounded-lg hover:bg-emerald-50 transition-colors w-full sm:w-auto self-start"
          >
            Send Message
          </Link>
        </div>

        {/* Case Summary Card */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 sm:space-y-5">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-900">
            CASE SUMMARY
          </span>
          <div className="space-y-2 text-xs text-slate-600">
            <p><strong className="text-slate-900 font-semibold">Case ID:</strong> HW-2026-531971</p>
            <p><strong className="text-slate-900 font-semibold">Healthcare Need:</strong> Not sure, I need guidance</p>
            <p><strong className="text-slate-900 font-semibold">Stage:</strong> Travel Preparation</p>
            <p><strong className="text-slate-900 font-semibold">Started:</strong> Today</p>
          </div>
        </div>

        {/* Recent Messages Card */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-900">
              RECENT MESSAGES
            </span>
            <p className="text-xs text-slate-600 italic leading-relaxed">
              &quot;Good question. Let me confirm the details with our clinical advisor and follow up within t...&quot;
            </p>
            <p className="text-[11px] text-slate-400">Sarah James · Just now</p>
          </div>
          <Link
            href="/dashboard/messages"
            className="text-xs font-bold text-blue-900 hover:text-blue-700 inline-flex items-center gap-1 transition-colors pt-2"
          >
            Open Messages <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Documents Card */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-900">
              DOCUMENTS
            </span>
            <div className="space-y-1 text-xs text-slate-600">
              <p>1 document on file</p>
              <p className="text-slate-400">0 under review</p>
            </div>
          </div>
          <Link
            href="/dashboard/documents"
            className="text-xs font-bold text-blue-900 hover:text-blue-700 inline-flex items-center gap-1 transition-colors pt-2"
          >
            View Documents <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>

      {/* Quick Actions Row */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-900">
          QUICK ACTIONS
        </span>
        <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-3">
          <Link href="/dashboard/documents/upload" className="px-4 py-2 border border-emerald-600 text-emerald-700 font-semibold text-xs rounded-lg hover:bg-emerald-50 transition-colors text-center">
            Upload Document
          </Link>
          <Link href="/dashboard/recommendations" className="px-4 py-2 border border-emerald-600 text-emerald-700 font-semibold text-xs rounded-lg hover:bg-emerald-50 transition-colors text-center">
            View Recommendations
          </Link>
          <Link href="/dashboard/billing" className="px-4 py-2 border border-emerald-600 text-emerald-700 font-semibold text-xs rounded-lg hover:bg-emerald-50 transition-colors text-center">
            Billing & Payments
          </Link>
          <Link href="/dashboard/messages" className="px-4 py-2 border border-emerald-600 text-emerald-700 font-semibold text-xs rounded-lg hover:bg-emerald-50 transition-colors text-center">
            Message Coordinator
          </Link>
          <Link href="/dashboard/consultation/new" className="px-4 py-2 border border-emerald-600 text-emerald-700 font-semibold text-xs rounded-lg hover:bg-emerald-50 transition-colors text-center">
            Start a New Consultation
          </Link>
        </div>
      </div>

    </div>
  );
}