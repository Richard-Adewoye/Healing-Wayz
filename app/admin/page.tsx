'use client';

import React from 'react';
import Link from 'next/link';
import { SendHorizontal, ShieldAlert } from 'lucide-react';

export default function AdminDashboardPage() {
  const stats = [
    { label: 'New Consultations', value: 4, color: 'text-blue-600' },
    { label: 'Active Cases', value: 4, color: 'text-emerald-600' },
    { label: 'Awaiting Patient Info', value: 1, color: 'text-amber-500' },
    { label: 'Documents Pending Review', value: 5, color: 'text-blue-500' },
    { label: 'Open Tasks', value: 8, color: 'text-blue-600' },
  ];

  const urgentCases = [
    { name: 'Fatima Al-Sayed', specialty: 'Oncology', coordinator: 'Sarah James' },
    { name: 'Adaeze Nwosu', specialty: 'Cardiology', coordinator: 'Unassigned', isUnassigned: true },
  ];

  const recentActivity = [
    {
      name: 'Chidinma Adeyemi',
      status: 'New',
      statusBg: 'bg-slate-100 text-slate-700',
      department: 'Fertility',
      stage: 'Consultation Submitted',
      time: '1 hour ago',
    },
    {
      name: 'Amara Chukwu',
      status: 'Active',
      statusBg: 'bg-emerald-100 text-emerald-800',
      department: 'Cardiology',
      stage: 'Hospital Recommendation',
      time: '2 hours ago',
    },
    {
      name: 'Adaeze Nwosu',
      status: 'New',
      statusBg: 'bg-slate-100 text-slate-700',
      department: 'Cardiology',
      stage: 'Consultation Submitted',
      time: '20 minutes ago',
    },
    {
      name: 'Yusuf Mohammed',
      status: 'Active',
      statusBg: 'bg-emerald-100 text-emerald-800',
      department: 'Maternal Health',
      stage: 'Medical Itinerary',
      time: '3 days ago',
    },
    {
      name: 'Fatima Al-Sayed',
      status: 'Active',
      statusBg: 'bg-emerald-100 text-emerald-800',
      department: 'Oncology',
      stage: 'Case Review',
      time: '3 hours ago',
    },
    {
      name: 'Grace Mensah',
      status: 'Awaiting Info',
      statusBg: 'bg-amber-100 text-amber-800',
      department: 'General Surgery',
      stage: 'Hospital Recommendation',
      time: '4 days ago',
    },
  ];

  const workload = [
    { name: 'Sarah James', cases: '5 cases' },
    { name: 'Unassigned', cases: '2 cases', isUnassigned: true },
    { name: 'Daniel Okoro', cases: '2 cases' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto w-full space-y-6">
      {/* Welcome Banner */}
      <div>
        <h2 className="text-3xl font-bold text-[#1E3A8A]">Good to see you, Sarah.</h2>
        <p className="text-sm text-slate-500 mt-1">
          Here&apos;s what&apos;s happening across your caseload today.
        </p>
      </div>

      {/* Service Live Alert */}
      <div className="bg-[#EBF7F0] border border-emerald-200/60 rounded-xl p-4 flex items-center gap-3 text-emerald-900 text-sm">
        <SendHorizontal className="w-5 h-5 text-emerald-600 shrink-0 rotate-[-30deg]" />
        <p>
          <span className="font-semibold">New service live: Flight Booking & Scheduling</span> &mdash; patients get up to 5% off all flights. Let your patients know when discussing travel plans.
        </p>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between min-h-[110px]">
            <span className="text-xs font-medium text-slate-500 leading-tight">
              {stat.label}
            </span>
            <span className={`text-3xl font-extrabold mt-4 ${stat.color}`}>
              {stat.value}
            </span>
          </div>
        ))}
      </div>

      {/* Urgent Cases Alert Box */}
      <div className="bg-[#FEF2F2] border border-red-100 rounded-2xl p-6 space-y-3">
        <div className="flex items-center gap-2 text-red-600 font-bold text-sm">
          <ShieldAlert className="w-5 h-5" />
          <span>2 urgent cases need attention</span>
        </div>

        <div className="space-y-2 pt-1">
          {urgentCases.map((c, idx) => (
            <div key={idx} className="flex items-center justify-between text-sm py-1 border-b border-red-100/60 last:border-0">
              <span className="text-slate-600">
                <strong className="text-slate-800 font-medium">{c.name}</strong> &mdash; {c.specialty} &middot;{' '}
                <span className={c.isUnassigned ? 'text-red-600 font-semibold' : 'text-slate-600'}>
                  {c.coordinator}
                </span>
              </span>
              <Link href="#" className="text-xs font-bold text-[#1E3A8A] hover:underline">
                Open &rarr;
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Main Grid: Recent Activity & Team Workload */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Recent Activity Column */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h3 className="text-xs font-bold tracking-wider text-blue-600 uppercase mb-4">
            RECENT ACTIVITY
          </h3>

          <div className="divide-y divide-slate-100">
            {recentActivity.map((item, idx) => (
              <div key={idx} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{item.name}</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${item.statusBg}`}>
                      {item.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    {item.department} &middot; {item.stage}
                  </p>
                </div>
                <span className="text-xs text-slate-400 font-medium">{item.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Team Workload Column */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-xs font-bold tracking-wider text-blue-600 uppercase mb-2">
            TEAM WORKLOAD
          </h3>

          <div className="space-y-3">
            {workload.map((member, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm py-1 border-b border-slate-100 last:border-0">
                <span className={`font-semibold ${member.isUnassigned ? 'text-red-600' : 'text-slate-700'}`}>
                  {member.name}
                </span>
                <span className="bg-blue-50 text-blue-700 font-semibold px-2.5 py-0.5 rounded-full text-xs">
                  {member.cases}
                </span>
              </div>
            ))}
          </div>

          <button className="w-full mt-4 border border-emerald-600 text-emerald-700 hover:bg-emerald-50 font-semibold py-2.5 px-4 rounded-xl text-sm transition-colors text-center">
            Assign 2 unassigned cases
          </button>
        </div>
      </div>
    </div>
  );
}