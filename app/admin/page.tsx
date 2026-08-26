'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { SendHorizontal, ShieldAlert, Loader2 } from 'lucide-react';
import { createClient } from '../utils/supabase/client'; // Adjust path to your Supabase browser client

// Define DB Types
interface PatientDocument {
  id: string;
  patient_id: string;
  file_name: string;
  document_type: string;
  status: string;
  created_at: string;
  profiles?: {
    full_name?: string;
  };
}

interface ActivityItem {
  name: string;
  status: string;
  statusBg: string;
  department: string;
  stage: string;
  time: string;
}

export default function AdminDashboardPage() {
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([
    { label: 'New Consultations', value: 0, color: 'text-blue-600' },
    { label: 'Active Cases', value: 0, color: 'text-emerald-600' },
    { label: 'Awaiting Patient Info', value: 0, color: 'text-amber-500' },
    { label: 'Documents Pending Review', value: 0, color: 'text-blue-500' },
    { label: 'Open Tasks', value: 0, color: 'text-blue-600' },
  ]);

  const [urgentCases, setUrgentCases] = useState<
    { name: string; specialty: string; coordinator: string; isUnassigned?: boolean }[]
  >([]);

  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [workload, setWorkload] = useState<
    { name: string; cases: string; isUnassigned?: boolean }[]
  >([]);

  useEffect(() => {
    async function fetchDashboardData() {
      setLoading(true);

      try {
        // 1. Fetch pending patient documents for review count
        const { count: pendingDocsCount } = await supabase
          .from('patient_documents')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'pending');

        // 2. Fetch Recent Document Activity joined with user profile info
        const { data: recentDocs } = await supabase
          .from('patient_documents')
          .select(`
            id,
            status,
            document_type,
            created_at,
            patient_id,
            profiles (full_name)
          `)
          .order('created_at', { ascending: false })
          .limit(6);

        if (recentDocs) {
          const mappedActivity: ActivityItem[] = recentDocs.map((doc: any) => {
            let statusBg = 'bg-slate-100 text-slate-700';
            if (doc.status === 'approved') statusBg = 'bg-emerald-100 text-emerald-800';
            if (doc.status === 'pending') statusBg = 'bg-amber-100 text-amber-800';
            if (doc.status === 'rejected') statusBg = 'bg-red-100 text-red-800';

            return {
              name: doc.profiles?.full_name || 'Patient',
              status: doc.status || 'Pending',
              statusBg,
              department: doc.document_type || 'General',
              stage: 'Document Submitted',
              time: new Date(doc.created_at).toLocaleDateString(),
            };
          });

          setRecentActivity(mappedActivity);
        }

        // Update Stats with live count
        setStats((prev) =>
          prev.map((stat) =>
            stat.label === 'Documents Pending Review'
              ? { ...stat, value: pendingDocsCount || 0 }
              : stat
          )
        );

        // Optional Mock fallbacks for non-schema tables until case models are added
        setUrgentCases([
          { name: 'Fatima Al-Sayed', specialty: 'Oncology', coordinator: 'Sarah James' },
          { name: 'Adaeze Nwosu', specialty: 'Cardiology', coordinator: 'Unassigned', isUnassigned: true },
        ]);

        setWorkload([
          { name: 'Sarah James', cases: '5 cases' },
          { name: 'Unassigned', cases: '2 cases', isUnassigned: true },
          { name: 'Daniel Okoro', cases: '2 cases' },
        ]);
      } catch (err) {
        console.error('Error fetching admin dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, [supabase]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] w-full">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto w-full space-y-6">
      {/* Welcome Banner */}
      <div>
        <h2 className="text-3xl font-bold text-[#1E3A8A]">Good to see you, Admin.</h2>
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
          <span>{urgentCases.length} urgent cases need attention</span>
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
            {recentActivity.length === 0 ? (
              <p className="text-sm text-slate-500 py-4">No recent activity recorded.</p>
            ) : (
              recentActivity.map((item, idx) => (
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
              ))
            )}
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
            Assign unassigned cases
          </button>
        </div>
      </div>
    </div>
  );
}