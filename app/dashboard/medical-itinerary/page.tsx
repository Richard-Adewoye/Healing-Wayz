'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Bell, 
  Plus, 
  Send, 
  Check, 
  ArrowRight,
  Clock,
  MapPin
} from 'lucide-react';

const steps = [
  { number: 1, label: 'Consultation Submitted', href: '/dashboard' },
  { number: 2, label: 'Case Review', href: '/dashboard/case-review' },
  { number: 3, label: 'Hospital Recommendation', href: '/dashboard/recommendations' },
  { number: 4, label: 'Medical Itinerary', href: '/dashboard/medical-itinerary' },
  { number: 5, label: 'Accommodation & Visa', href: '/dashboard/accommodation' },
  { number: 6, label: 'Travel Preparation', href: '/dashboard/travel-preparation' },
  { number: 7, label: 'Treatment & Recovery', href: '/dashboard/treatment-recovery' },
];

const itineraryEvents = [
  {
    date: 'Day 1 — Arrival & Check-in',
    time: '09:00 AM',
    title: 'Initial Consultation & Diagnostic Tests',
    location: 'Al Noor Specialist Medical Center, Dubai',
    details: 'Meet with Dr. Sarah James for preliminary examination and blood tests.'
  },
  {
    date: 'Day 2 — Treatment Procedure',
    time: '11:30 AM',
    title: 'Dermatological Procedure',
    location: 'Main Operating Suite, 3rd Floor',
    details: 'Please fast for 6 hours prior to your scheduled appointment time.'
  },
  {
    date: 'Day 3 — Follow-up & Discharge',
    time: '02:00 PM',
    title: 'Post-Treatment Review',
    location: 'Outpatient Clinic',
    details: 'Final review of treatment progress and prescription clearance.'
  }
];

export default function MedicalItineraryPage() {
  const [activeTab, setActiveTab] = useState<'journey' | 'itinerary'>('journey');
  const pathname = usePathname();

  const activeStep = steps.find((s) => s.href === pathname);
  const currentStepNumber = activeStep ? activeStep.number : 4;

  return (
    <div className="flex-1 bg-slate-50/50 min-h-screen p-4 sm:p-8 md:p-10 space-y-6 sm:space-y-8 max-w-7xl mx-auto w-full">
      
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-200/80 pb-4 sm:pb-5 gap-3 sm:gap-4">
        <h1 className="text-lg sm:text-xl font-bold text-blue-900">
          {activeTab === 'journey' ? 'My Healthcare Journey' : 'Medical Itinerary'}
        </h1>
        <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 w-full sm:w-auto">
          <Link
            href="/"
            className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
          >
            ← Back to Website
          </Link>
          <div className="flex items-center gap-3">
            <button className="p-2 text-gray-500 hover:text-gray-700 relative rounded-full hover:bg-slate-100 transition-colors">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs sm:text-sm shadow-sm shrink-0">
              A
            </div>
          </div>
        </div>
      </div>

      {/* Greeting & Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-900 leading-tight">
            {activeTab === 'journey' ? 'Good to see you, Amara.' : 'Your Medical Itinerary'}
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            {activeTab === 'journey' 
              ? 'Case HW-2026-531971 · Last updated Today' 
              : 'Scheduled appointments and care steps prepared by Sarah James.'
            }
          </p>
        </div>
        {activeTab === 'journey' && (
          <Link 
            href="/dashboard/consultation/new"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm transition-colors w-full sm:w-auto"
          >
            <Plus className="w-4 h-4" />
            New Consultation
          </Link>
        )}
      </div>

      {/* Promotional Banner */}
      {activeTab === 'journey' && (
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
      )}

      {/* Stepper Grid Component */}
      {activeTab === 'journey' && (
        <div className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
            YOUR HEALTHCARE JOURNEY
          </span>

          <div className="overflow-x-auto pb-4 pt-2 -mx-4 sm:mx-0 px-4 sm:px-0 touch-pan-x scrollbar-none">
            <div className="min-w-[680px] sm:min-w-[700px] flex items-center justify-between relative px-4">
              
              {/* Background Line */}
              <div className="absolute top-4 left-8 right-8 h-0.5 bg-gray-200 -z-0" />
              
              {/* Active Progress Line */}
              <div 
                className="absolute top-4 left-8 h-0.5 bg-emerald-600 -z-0 transition-all duration-300" 
                style={{ width: `${((currentStepNumber - 1) / (steps.length - 1)) * 92}%` }}
              />

              {steps.map((step) => {
                const isCompleted = step.number < currentStepNumber;
                const isActive = step.number === currentStepNumber || step.href === pathname;

                return (
                  <Link 
                    key={step.number} 
                    href={step.href}
                    className="relative z-10 flex flex-col items-center max-w-[90px] sm:max-w-[100px] text-center space-y-2 group cursor-pointer"
                  >
                    <div
                      className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-bold text-xs border-2 transition-all ${
                        isActive
                          ? 'border-emerald-600 text-emerald-700 bg-white ring-4 ring-emerald-50'
                          : isCompleted
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-gray-200 text-gray-400 bg-white group-hover:border-emerald-400 group-hover:text-emerald-600'
                      }`}
                    >
                      {isCompleted && !isActive ? <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" /> : step.number}
                    </div>
                    <span
                      className={`text-[10px] sm:text-[11px] font-semibold leading-tight transition-colors ${
                        isActive
                          ? 'text-emerald-700 font-bold' 
                          : isCompleted
                          ? 'text-slate-800 font-medium'
                          : 'text-gray-500 group-hover:text-slate-900'
                      }`}
                    >
                      {step.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Action Banner / Medical Itinerary Details */}
      {activeTab === 'journey' ? (
        <div className="p-5 sm:p-6 bg-emerald-50/60 border border-emerald-100/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-blue-900">Review Your Medical Itinerary</h3>
            <p className="text-xs sm:text-sm text-gray-600">
              Your care schedule and clinical appointments have been prepared by your coordinator.
            </p>
          </div>
          <button 
            onClick={() => setActiveTab('itinerary')}
            className="inline-flex items-center justify-center px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm rounded-lg shadow-sm transition-colors w-full sm:w-auto whitespace-nowrap"
          >
            View Itinerary
          </button>
        </div>
      ) : (
        <div className="bg-white p-5 sm:p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <h3 className="text-base font-bold text-blue-900">Upcoming Medical Schedule</h3>
            <span className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-200">
              Confirmed
            </span>
          </div>

          <div className="space-y-6">
            {itineraryEvents.map((event, index) => (
              <div key={index} className="flex flex-col md:flex-row md:items-start justify-between border-l-2 border-emerald-600 pl-4 py-1 space-y-2 md:space-y-0">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wide">
                    {event.date}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900">{event.title}</h4>
                  <p className="text-xs text-gray-600">{event.details}</p>
                </div>

                <div className="flex flex-col text-xs text-gray-500 space-y-1 md:text-right pt-1 md:pt-0">
                  <span className="flex items-center md:justify-end gap-1 font-medium">
                    <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    {event.time}
                  </span>
                  <span className="flex items-center md:justify-end gap-1">
                    <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    {event.location}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Coordinator Note */}
      <div className="bg-white border-l-4 border-l-emerald-600 p-5 sm:p-6 rounded-r-2xl border border-gray-100 shadow-sm space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
          CASE REVIEW FROM YOUR COORDINATOR
        </span>
        <p className="text-xs sm:text-sm text-slate-800 break-words leading-relaxed font-medium">
          edfgjkl;kjgfdrewqertyujk
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
            <p><strong className="text-slate-800 font-semibold">Stage:</strong> Medical Itinerary</p>
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