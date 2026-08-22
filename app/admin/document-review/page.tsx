'use client';

import React from 'react';
import Link from 'next/link';
import { FileText, Image as ImageIcon, Lightbulb } from 'lucide-react';

interface DocumentItem {
  id: string;
  filename: string;
  type: 'pdf' | 'image';
  patientName: string;
  caseId: string;
  category: string;
  date: string;
  status: 'Uploaded' | 'Under Review' | 'Accepted' | 'Update Requested';
  statusBg: string;
  statusText: string;
  note?: string;
  feedback?: string;
}

const pendingDocuments: DocumentItem[] = [
  {
    id: '1',
    filename: '2025_Day_1_Rewrite_v1_IntroductionToAgents.pdf',
    type: 'pdf',
    patientName: 'Amara Chukwu',
    caseId: 'HW-2026-150088',
    category: 'Medical Reports',
    date: 'Today',
    status: 'Uploaded',
    statusBg: 'bg-slate-100',
    statusText: 'text-slate-700',
    note: 'das',
  },
  {
    id: '2',
    filename: 'Cardiac_MRI_Report.pdf',
    type: 'pdf',
    patientName: 'Amara Chukwu',
    caseId: 'HW-2026-000145',
    category: 'Medical Reports',
    date: '13 Jul 2026',
    status: 'Under Review',
    statusBg: 'bg-emerald-100/70',
    statusText: 'text-emerald-800',
  },
  {
    id: '3',
    filename: 'Biopsy_Results.pdf',
    type: 'pdf',
    patientName: 'Fatima Al-Sayed',
    caseId: 'HW-2026-000901',
    category: 'Medical Reports',
    date: '23 Jul 2026',
    status: 'Uploaded',
    statusBg: 'bg-slate-100',
    statusText: 'text-slate-700',
  },
  {
    id: '4',
    filename: 'ER_Discharge_Summary.pdf',
    type: 'pdf',
    patientName: 'Adaeze Nwosu',
    caseId: 'HW-2026-001002',
    category: 'Medical Reports',
    date: '25 Jul 2026',
    status: 'Uploaded',
    statusBg: 'bg-slate-100',
    statusText: 'text-slate-700',
  },
];

const resolvedDocuments: DocumentItem[] = [
  {
    id: '5',
    filename: 'HealthCare Journey 2.PNG',
    type: 'image',
    patientName: 'Amara Chukwu',
    caseId: 'HW-2026-531971',
    category: 'Medical Reports',
    date: 'Today',
    status: 'Accepted',
    statusBg: 'bg-emerald-100/70',
    statusText: 'text-emerald-800',
  },
  {
    id: '6',
    filename: 'Passport_Copy.pdf',
    type: 'pdf',
    patientName: 'Amara Chukwu',
    caseId: 'HW-2026-000145',
    category: 'Identification',
    date: '12 Jul 2026',
    status: 'Accepted',
    statusBg: 'bg-emerald-100/70',
    statusText: 'text-emerald-800',
  },
  {
    id: '7',
    filename: 'Blood_Work_Panel.pdf',
    type: 'pdf',
    patientName: 'Fatima Al-Sayed',
    caseId: 'HW-2026-000901',
    category: 'Medical Reports',
    date: '10 Jul 2026',
    status: 'Update Requested',
    statusBg: 'bg-amber-100/70',
    statusText: 'text-amber-800',
    feedback: 'These results are over 6 months old — please upload a more recent panel.',
  },
  {
    id: '8',
    filename: 'Prenatal_Records.pdf',
    type: 'pdf',
    patientName: 'Yusuf Mohammed',
    caseId: 'HW-2026-000978',
    category: 'Medical Reports',
    date: '16 Jul 2026',
    status: 'Accepted',
    statusBg: 'bg-emerald-100/70',
    statusText: 'text-emerald-800',
  },
  {
    id: '9',
    filename: 'Passport_Copy.pdf',
    type: 'pdf',
    patientName: 'Yusuf Mohammed',
    caseId: 'HW-2026-000978',
    category: 'Identification',
    date: '15 Jul 2026',
    status: 'Accepted',
    statusBg: 'bg-emerald-100/70',
    statusText: 'text-emerald-800',
  },
  {
    id: '10',
    filename: 'Referral_Letter.pdf',
    type: 'pdf',
    patientName: 'Yusuf Mohammed',
    caseId: 'HW-2026-000978',
    category: 'Medical Reports',
    date: '17 Jul 2026',
    status: 'Accepted',
    statusBg: 'bg-emerald-100/70',
    statusText: 'text-emerald-800',
  },
];

export default function DocumentReviewPage() {
  const renderDocumentCard = (doc: DocumentItem) => {
    const FileIcon = doc.type === 'image' ? ImageIcon : FileText;

    return (
      <div
        key={doc.id}
        className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4"
      >
        {/* Header Row */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 border border-slate-200 rounded-lg text-slate-500 bg-slate-50 shrink-0 mt-0.5">
              <FileIcon className="w-5 h-5" />
            </div>

            <div className="space-y-1">
              <h3 className="font-bold text-[#1E3A8A] text-base hover:underline cursor-pointer">
                {doc.filename}
              </h3>
              <p className="text-xs text-slate-500">
                {doc.patientName} &middot; {doc.caseId} &middot; {doc.category} &middot; {doc.date}
              </p>

              {/* Note callout */}
              {doc.note && (
                <div className="flex items-center gap-1.5 text-xs text-amber-700 pt-1">
                  <Lightbulb className="w-3.5 h-3.5 fill-amber-400 text-amber-500 shrink-0" />
                  <span>{doc.note}</span>
                </div>
              )}
            </div>
          </div>

          <span
            className={`text-xs font-semibold px-3 py-1 rounded-full shrink-0 ${doc.statusBg} ${doc.statusText}`}
          >
            {doc.status}
          </span>
        </div>

        {/* Feedback block (for update requested items) */}
        {doc.feedback && (
          <p className="text-xs italic text-slate-500 pl-2 border-l-2 border-slate-200">
            Feedback sent: &quot;{doc.feedback}&quot;
          </p>
        )}

        {/* Action Controls Row */}
        <div className="flex items-center gap-3 pt-2">
          <button className="border border-emerald-600 text-emerald-700 hover:bg-emerald-50 font-semibold px-4 py-1.5 rounded-xl text-xs transition-colors">
            Open &amp; Review
          </button>
          <button className="bg-[#22C55E] hover:bg-emerald-600 text-white font-semibold px-4 py-1.5 rounded-xl text-xs transition-colors">
            Accept
          </button>
          <button className="border border-emerald-600 text-emerald-700 hover:bg-emerald-50 font-semibold px-4 py-1.5 rounded-xl text-xs transition-colors">
            Request Update
          </button>

          <Link
            href={`/admin/cases/${doc.caseId}`}
            className="text-xs font-bold text-[#1E3A8A] hover:underline ml-2"
          >
            Open Case &rarr;
          </Link>
        </div>
      </div>
    );
  };

  return (
    <div className="p-8 max-w-7xl mx-auto w-full space-y-8">
      {/* Page Title & Subtitle */}
      <div>
        <h2 className="text-2xl font-bold text-[#1E3A8A]">Document Review</h2>
        <p className="text-sm text-slate-500 mt-1">
          Review documents uploaded by patients across every case, and let them know if anything needs fixing.
        </p>
      </div>

      {/* Pending Reviews Section */}
      <div className="space-y-4">
        {pendingDocuments.map((doc) => renderDocumentCard(doc))}
      </div>

      {/* Recently Resolved Section */}
      <div className="space-y-4 pt-4">
        <h3 className="text-xs font-bold tracking-wider text-blue-600 uppercase">
          RECENTLY RESOLVED
        </h3>
        <div className="space-y-4">
          {resolvedDocuments.map((doc) => renderDocumentCard(doc))}
        </div>
      </div>
    </div>
  );
}