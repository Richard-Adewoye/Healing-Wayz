'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Plus, 
  Send, 
  ArrowRight 
} from 'lucide-react';

export default function CaseReviewPage() {
  return (
    <div className="p-4 sm:p-8 md:p-10 space-y-6 sm:space-y-8 max-w-7xl mx-auto w-full">
      
      {/* Greeting & Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-900 leading-tight">
            Good to see you, Amara.
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Case HW-2026-531971 · Last updated Today
          </p>
        </div>
        <Link 
          href="/dashboard/consultation/new"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm transition-colors w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          New Consultation
        </Link>
      </div>

      {/* Promotional Banner */}
      <div className="p-4 bg-emerald-50/60 border border-emerald-100 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start sm:items-center gap-3">
          <Send className="w-4 h-4 text-emerald-600 rotate-45 flex-shrink-0 mt-0.5 sm:mt-0" />
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

      {/* Case Status Notice Box */}
      <div className="p-5 sm:p-6 bg-emerald-50/60 border border-emerald-100/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-base font-bold text-blue-900">Case Under Review</h3>
          <p className="text-xs sm:text-sm text-gray-600">
            Our team is reviewing your case. We'll notify you as soon as there's an update.
          </p>
        </div>
        <Link 
          href="/dashboard/messages"
          className="inline-flex items-center justify-center px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm rounded-lg shadow-sm transition-colors w-full sm:w-auto"
        >
          Message Coordinator
        </Link>
      </div>

      {/* Coordinator Feedback Box */}
      <div className="bg-white border-l-4 border-l-emerald-600 p-5 sm:p-6 rounded-r-2xl border border-gray-100 shadow-sm space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
          CASE REVIEW FROM YOUR COORDINATOR
        </span>
        <p className="text-xs sm:text-sm text-slate-800 break-words leading-relaxed font-medium">
          Your medical records have been received and are currently under secondary review with the orthopedic department.
        </p>
        <p className="text-[11px] text-gray-400 font-medium pt-1">
          Sarah James · Just now
        </p>
      </div>

      {/* 2x2 Grid Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        
        {/* Assigned Care Coordinator Card */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4 sm:space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              ASSIGNED CARE COORDINATOR
            </span>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-900 text-white font-bold flex items-center justify-center text-sm shrink-0">
                S
              </div>
              <div>
                <h4 className="text-sm font-bold text-blue-900">Sarah James</h4>
                <p className="text-xs text-gray-500">Patient Care Coordinator</p>
              </div>
            </div>
            <p className="text-xs text-gray-500">Available Monday–Friday, 9:00 AM–5:00 PM</p>
          </div>
          <Link 
            href="/dashboard/messages"
            className="inline-block text-center px-4 py-2 border border-emerald-600 text-emerald-700 font-semibold text-xs rounded-lg hover:bg-emerald-50 transition-colors w-full sm:w-auto self-start"
          >
            Send Message
          </Link>
        </div>

        {/* Case Summary Card */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4 sm:space-y-5">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
            CASE SUMMARY
          </span>
          <div className="space-y-2 text-xs text-gray-600">
            <p><strong className="text-slate-800 font-semibold">Case ID:</strong> HW-2026-531971</p>
            <p><strong className="text-slate-800 font-semibold">Healthcare Need:</strong> Not sure, I need guidance</p>
            <p><strong className="text-slate-800 font-semibold">Stage:</strong> Case Review</p>
            <p><strong className="text-slate-800 font-semibold">Started:</strong> Today</p>
          </div>
        </div>

        {/* Recent Messages Card */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              RECENT MESSAGES
            </span>
            <p className="text-xs text-gray-600 italic leading-relaxed">
              &quot;Good question. Let me confirm the details with our clinical advisor and follow up within t...&quot;
            </p>
            <p className="text-[11px] text-gray-400">Sarah James · Just now</p>
          </div>
          <Link
            href="/dashboard/messages"
            className="text-xs font-bold text-blue-900 hover:text-blue-700 inline-flex items-center gap-1 transition-colors pt-2"
          >
            Open Messages <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Documents Card */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              DOCUMENTS
            </span>
            <div className="space-y-1 text-xs text-gray-600">
              <p>1 document on file</p>
              <p className="text-gray-400">0 under review</p>
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
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
          QUICK ACTIONS
        </span>
        <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-3">
          <Link href="/dashboard/documents" className="px-4 py-2 border border-emerald-600 text-emerald-700 font-semibold text-xs rounded-lg hover:bg-emerald-50 transition-colors text-center">
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