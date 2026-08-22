'use client';

import React, { useState } from 'react';
import { Search, Calendar } from 'lucide-react';

interface PatientCase {
  id: string;
  patientName: string;
  hasNotificationDot?: boolean;
  caseId: string;
  need: string;
  stage: string;
  status: 'New' | 'Active' | 'Awaiting Info' | 'Closed';
  priority: 'Normal' | 'Urgent';
  coordinator: string;
  updated: string;
}

const patientCasesData: PatientCase[] = [
  {
    id: '1',
    patientName: 'Amara Chukwu',
    caseId: 'HW-2026-531971',
    need: 'Not sure, I need guidance',
    stage: 'Case Closed',
    status: 'New',
    priority: 'Normal',
    coordinator: 'Sarah James',
    updated: 'Just now',
  },
  {
    id: '2',
    patientName: 'Amara Chukwu',
    caseId: 'HW-2026-150088',
    need: 'Visa support',
    stage: 'Consultation Submitted',
    status: 'New',
    priority: 'Normal',
    coordinator: 'Sarah James',
    updated: 'Just now',
  },
  {
    id: '3',
    patientName: 'Amara Chukwu',
    hasNotificationDot: true,
    caseId: 'HW-2026-000145',
    need: 'Cardiology',
    stage: 'Hospital Recommendation',
    status: 'Active',
    priority: 'Normal',
    coordinator: 'Sarah James',
    updated: '2 hours ago',
  },
  {
    id: '4',
    patientName: 'Kwame Owusu',
    caseId: 'HW-2026-000812',
    need: 'Orthopedics',
    stage: 'Case Closed',
    status: 'Closed',
    priority: 'Normal',
    coordinator: 'Daniel Okoro',
    updated: '6 months ago',
  },
  {
    id: '5',
    patientName: 'Fatima Al-Sayed',
    hasNotificationDot: true,
    caseId: 'HW-2026-000901',
    need: 'Oncology',
    stage: 'Case Review',
    status: 'Active',
    priority: 'Urgent',
    coordinator: 'Sarah James',
    updated: '3 hours ago',
  },
  {
    id: '6',
    patientName: 'Chidinma Adeyemi',
    hasNotificationDot: true,
    caseId: 'HW-2026-000934',
    need: 'Fertility',
    stage: 'Consultation Submitted',
    status: 'New',
    priority: 'Normal',
    coordinator: 'Unassigned',
    updated: '1 hour ago',
  },
  {
    id: '7',
    patientName: 'Ibrahim Diallo',
    caseId: 'HW-2026-000887',
    need: 'Neurology',
    stage: 'Accommodation & Visa',
    status: 'Active',
    priority: 'Normal',
    coordinator: 'Daniel Okoro',
    updated: 'Yesterday',
  },
  {
    id: '8',
    patientName: 'Grace Mensah',
    caseId: 'HW-2026-000956',
    need: 'General Surgery',
    stage: 'Hospital Recommendation',
    status: 'Awaiting Info',
    priority: 'Normal',
    coordinator: 'Sarah James',
    updated: '4 days ago',
  },
  {
    id: '9',
    patientName: 'Yusuf Mohammed',
    caseId: 'HW-2026-000978',
    need: 'Maternal Health',
    stage: 'Medical Itinerary',
    status: 'Active',
    priority: 'Normal',
    coordinator: 'Daniel Okoro',
    updated: '3 days ago',
  },
  {
    id: '10',
    patientName: 'Adaeze Nwosu',
    hasNotificationDot: true,
    caseId: 'HW-2026-001002',
    need: 'Cardiology',
    stage: 'Consultation Submitted',
    status: 'New',
    priority: 'Urgent',
    coordinator: 'Unassigned',
    updated: '20 minutes ago',
  },
];

type StatusFilter = 'All' | 'New' | 'Active' | 'Awaiting Info' | 'Closed';

export default function PatientCasesPage() {
  const [selectedFilter, setSelectedFilter] = useState<StatusFilter>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const filteredCases = patientCasesData.filter((item) => {
    const matchesFilter =
      selectedFilter === 'All' || item.status === selectedFilter;
    const matchesSearch =
      item.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.caseId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.need.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const getStatusBadge = (status: PatientCase['status']) => {
    switch (status) {
      case 'New':
        return (
          <span className="bg-slate-100 text-slate-700 font-semibold text-xs px-3 py-1 rounded-full inline-block text-center">
            New
          </span>
        );
      case 'Active':
        return (
          <span className="bg-[#DCFCE7] text-[#15803D] font-semibold text-xs px-3 py-1 rounded-full inline-block text-center">
            Active
          </span>
        );
      case 'Awaiting Info':
        return (
          <span className="bg-[#FEF3C7] text-[#B45309] font-semibold text-xs px-3 py-1 rounded-full inline-block text-center">
            Awaiting Info
          </span>
        );
      case 'Closed':
        return (
          <span className="bg-slate-100 text-slate-500 font-semibold text-xs px-3 py-1 rounded-full inline-block text-center">
            Closed
          </span>
        );
    }
  };

  const getPriorityBadge = (priority: PatientCase['priority']) => {
    if (priority === 'Urgent') {
      return (
        <span className="bg-[#FEE2E2] text-[#DC2626] font-semibold text-xs px-3 py-1 rounded-full inline-block text-center">
          Urgent
        </span>
      );
    }
    return <span className="text-xs text-slate-500">{priority}</span>;
  };

  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-6 font-sans">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1E3A8A] mb-1">Patient Cases</h1>
        <p className="text-slate-500 text-sm">
          {patientCasesData.length} total cases across your team.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        {/* Status Pill Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          {(['All', 'New', 'Active', 'Awaiting Info', 'Closed'] as StatusFilter[]).map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-5 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedFilter === filter
                  ? 'bg-[#1D4ED8] text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {filter}
            </button>
          ))}

          {/* Date Pickers */}
          <div className="flex items-center gap-2 ml-0 lg:ml-2">
            <div className="relative flex items-center bg-white border border-slate-200 rounded-full px-3 py-1.5 text-xs text-slate-500">
              <input
                type="text"
                placeholder="dd/mm/yyyy"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-24 outline-none text-slate-700 bg-transparent"
              />
              <Calendar className="w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            </div>
            <span className="text-xs text-slate-400 font-medium">to</span>
            <div className="relative flex items-center bg-white border border-slate-200 rounded-full px-3 py-1.5 text-xs text-slate-500">
              <input
                type="text"
                placeholder="dd/mm/yyyy"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-24 outline-none text-slate-700 bg-transparent"
              />
              <Calendar className="w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative w-full lg:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search patient, case ID, or need."
            className="w-full bg-white border border-slate-200 rounded-full pl-9 pr-4 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Cases Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-6">Patient</th>
                <th className="py-3.5 px-4">Case ID</th>
                <th className="py-3.5 px-4">Need</th>
                <th className="py-3.5 px-4">Stage</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-center">Priority</th>
                <th className="py-3.5 px-4">Coordinator</th>
                <th className="py-3.5 px-6">Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredCases.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-4 px-6 font-bold text-slate-800 whitespace-nowrap">
                    <div className="inline-flex items-center gap-1.5">
                      <span>{c.patientName}</span>
                      {c.hasNotificationDot && (
                        <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-xs font-medium text-slate-500 whitespace-nowrap">
                    {c.caseId}
                  </td>
                  <td className="py-4 px-4 text-slate-700 font-medium whitespace-nowrap">
                    {c.need}
                  </td>
                  <td className="py-4 px-4 text-slate-700 font-medium whitespace-nowrap">
                    {c.stage}
                  </td>
                  <td className="py-4 px-4 text-center whitespace-nowrap">
                    {getStatusBadge(c.status)}
                  </td>
                  <td className="py-4 px-4 text-center whitespace-nowrap">
                    {getPriorityBadge(c.priority)}
                  </td>
                  <td className="py-4 px-4 font-semibold whitespace-nowrap">
                    {c.coordinator === 'Unassigned' ? (
                      <span className="text-red-500">{c.coordinator}</span>
                    ) : (
                      <span className="text-slate-700">{c.coordinator}</span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-xs text-slate-400 font-medium whitespace-nowrap">
                    {c.updated}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}