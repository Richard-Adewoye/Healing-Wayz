'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createClient } from '../../utils/supabase/client';
import { 
  Bell, 
  Plus, 
  Send, 
  Clock, 
  MapPin, 
  Check, 
  ArrowRight,
  Upload,
  FileText,
  Loader2,
  AlertCircle,
  X
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

interface CaseData {
  caseId: string;
  fullName: string;
  supportType: string;
  healthcareArea: string;
  diagnosis: string;
  documentCount: number;
  submittedAt: string;
}

interface UploadedDocument {
  id?: string;
  name: string;
  path?: string;
  created_at?: string;
  size?: number;
}

export default function JourneyDashboard() {
  const pathname = usePathname();
  const supabase = createClient();

  const [userName, setUserName] = useState<string>('');
  const [userId, setUserId] = useState<string | null>(null);
  const [loadingUser, setLoadingUser] = useState<boolean>(true);
  const [caseDetails, setCaseDetails] = useState<CaseData | null>(null);

  // Document management states
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const [loadingDocs, setLoadingDocs] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch user session and user profile
  useEffect(() => {
    const storedCase = localStorage.getItem('activeConsultationCase');
    if (storedCase) {
      try {
        const parsed = JSON.parse(storedCase);
        setCaseDetails(parsed);
        if (parsed.fullName) {
          setUserName(parsed.fullName);
        }
      } catch (err) {
        console.error('Failed to parse activeConsultationCase:', err);
      }
    }

    async function loadUserProfile(uid: string, userMetadata: Record<string, any>, userEmail?: string) {
      try {
        setUserId(uid);
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', uid)
          .maybeSingle();

        if (profileError) {
          console.error('Error fetching profile row:', profileError);
        }

        const resolvedName = 
          profile?.full_name || 
          userMetadata?.full_name || 
          userMetadata?.name || 
          (userMetadata?.first_name ? `${userMetadata.first_name}` : null) ||
          (userEmail ? userEmail.split('@')[0] : null);

        if (resolvedName) {
          setUserName(resolvedName);
        }

        fetchUserDocuments(uid);
      } catch (err) {
        console.error('Unexpected error loading profile:', err);
      } finally {
        setLoadingUser(false);
      }
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        loadUserProfile(session.user.id, session.user.user_metadata || {}, session.user.email);
      } else {
        setLoadingUser(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        loadUserProfile(session.user.id, session.user.user_metadata || {}, session.user.email);
      } else {
        setUserId(null);
        setLoadingUser(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Fetch documents for the authenticated user
  const fetchUserDocuments = async (uid: string) => {
    setLoadingDocs(true);
    try {
      // First try fetching from 'documents' table if present
      const { data: dbDocs, error: dbError } = await supabase
        .from('documents')
        .select('*')
        .eq('user_id', uid)
        .order('created_at', { ascending: false });

      if (!dbError && dbDocs && dbDocs.length > 0) {
        setDocuments(dbDocs.map(doc => ({ id: doc.id, name: doc.name || doc.file_name, created_at: doc.created_at })));
      } else {
        // Fallback: search direct storage bucket items under user's folder
        const { data: storageFiles, error: storageError } = await supabase.storage
          .from('patient-documents')
          .list(uid, { sortBy: { column: 'created_at', order: 'desc' } });

        if (!storageError && storageFiles) {
          setDocuments(storageFiles.map(f => ({ name: f.name, created_at: f.created_at ?? undefined })));
        }
      }
    } catch (err) {
      console.error('Failed to load documents:', err);
    } finally {
      setLoadingDocs(false);
    }
  };

  // Upload handler
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    if (!userId) {
      setUploadError('You must be logged in to upload documents.');
      return;
    }

    const file = files[0];
    setUploading(true);
    setUploadError(null);
    setUploadSuccess(null);

    try {
      const timestamp = Date.now();
      const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const filePath = `${userId}/${timestamp}_${sanitizedFileName}`;

      // 1. Storage bucket upload
      const { data: uploadData, error: uploadErr } = await supabase.storage
        .from('patient-documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadErr) {
        throw new Error(uploadErr.message || 'Failed to upload document file.');
      }

      // 2. Insert metadata into Supabase DB table
      const { error: dbErr } = await supabase
        .from('documents')
        .insert({
          user_id: userId,
          name: file.name,
          file_path: uploadData?.path || filePath,
          file_size: file.size,
          mime_type: file.type,
          case_id: caseDetails?.caseId || null,
        });

      if (dbErr) {
        console.warn('Metadata insertion failed, using file fallback:', dbErr.message);
      }

      setUploadSuccess(`Successfully uploaded "${file.name}"`);
      await fetchUserDocuments(userId);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err: any) {
      console.error('Upload Error:', err);
      setUploadError(err.message || 'An error occurred while uploading. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const cleanName = userName.trim();
  const userInitial = cleanName ? cleanName.charAt(0).toUpperCase() : 'P';
  const firstName = cleanName ? cleanName.split(' ')[0] : 'there';

  const activeStep = steps.find((s) => s.href === pathname);
  const currentStepNumber = activeStep ? activeStep.number : 1;
  const currentStageLabel = activeStep ? activeStep.label : 'Consultation Submitted';
  const isItineraryPage = pathname === '/dashboard/medical-itinerary';

  const docCount = documents.length > 0 ? documents.length : (caseDetails?.documentCount ?? 0);

  return (
    <div className="flex-1 bg-slate-50/50 min-h-screen p-4 sm:p-8 md:p-10 space-y-6 sm:space-y-8 max-w-7xl mx-auto w-full">
      
      {/* Hidden Global File Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        className="hidden" 
        accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
      />

      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-200/80 pb-4 sm:pb-5 gap-3 sm:gap-4">
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
            <button className="p-2 text-gray-500 hover:text-gray-700 relative rounded-full hover:bg-slate-100 transition-colors">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs sm:text-sm shadow-sm shrink-0 uppercase">
              {loadingUser && !userName ? '...' : userInitial}
            </div>
          </div>
        </div>
      </div>

      {/* Greeting & Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-900 leading-tight">
            {isItineraryPage 
              ? 'Your Medical Itinerary' 
              : `Good to see you, ${loadingUser && !userName ? '...' : firstName}.`
            }
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            {isItineraryPage 
              ? 'Scheduled appointments and care steps prepared by Sarah James.'
              : `Case ${caseDetails?.caseId || 'HW-2026-531971'} · Last updated ${caseDetails?.submittedAt || 'Today'}`
            }
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

      {/* Upload Feedback Messages */}
      {uploadError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-800 text-xs sm:text-sm">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}
      {uploadSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-800 text-xs sm:text-sm">
          <Check className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{uploadSuccess}</span>
        </div>
      )}

      {/* Dynamic Journey Stepper */}
      <div className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
          YOUR HEALTHCARE JOURNEY
        </span>

        <div className="overflow-x-auto pb-4 pt-2 -mx-4 sm:mx-0 px-4 sm:px-0 touch-pan-x scrollbar-none">
          <div className="min-w-[680px] sm:min-w-[700px] flex items-center justify-between relative px-4">
            <div className="absolute top-4 left-8 right-8 h-0.5 bg-gray-200 -z-0" />
            <div 
              className="absolute top-4 left-8 h-0.5 bg-emerald-600 -z-0 transition-all duration-300" 
              style={{ width: `${((currentStepNumber - 1) / (steps.length - 1)) * 92}%` }}
            />

            {steps.map((step) => {
              const isCompleted = step.number < currentStepNumber;
              const isActive = step.href === pathname;

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

      {/* 2x2 Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        
        {/* Care Coordinator Card */}
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

        {/* Dynamic Case Summary Card */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4 sm:space-y-5">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
            CASE SUMMARY
          </span>
          <div className="space-y-2 text-xs text-gray-600">
            <p><strong className="text-slate-800 font-semibold">Case ID:</strong> {caseDetails?.caseId || 'HW-2026-531971'}</p>
            <p><strong className="text-slate-800 font-semibold">Healthcare Need:</strong> {caseDetails?.supportType || 'Finding the right hospital or specialist'}</p>
            {caseDetails?.healthcareArea && (
              <p><strong className="text-slate-800 font-semibold">Specialty Area:</strong> {caseDetails.healthcareArea}</p>
            )}
            <p><strong className="text-slate-800 font-semibold">Stage:</strong> {currentStageLabel}</p>
            <p><strong className="text-slate-800 font-semibold">Started:</strong> {caseDetails?.submittedAt || 'Today'}</p>
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

        {/* Dynamic Interactive Documents Card */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                DOCUMENTS ({docCount})
              </span>
              {loadingDocs && <Loader2 className="w-3.5 h-3.5 animate-spin text-gray-400" />}
            </div>
            
            <div className="space-y-2 text-xs text-gray-600">
              <p className="font-medium text-slate-800">{docCount} document(s) uploaded to profile</p>
              
              {/* Document list preview */}
              {documents.length > 0 ? (
                <ul className="space-y-1 mt-2 max-h-24 overflow-y-auto">
                  {documents.slice(0, 3).map((doc, idx) => (
                    <li key={doc.id || idx} className="flex items-center gap-1.5 text-[11px] text-slate-600 truncate">
                      <FileText className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span className="truncate">{doc.name}</span>
                    </li>
                  ))}
                  {documents.length > 3 && (
                    <li className="text-[10px] text-gray-400 italic">+{documents.length - 3} more file(s)</li>
                  )}
                </ul>
              ) : (
                <p className="text-gray-400">No recent documents uploaded yet.</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
            >
              {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
              {uploading ? 'Uploading...' : 'Upload Now'}
            </button>

            <button
              onClick={() => setShowUploadModal(true)}
              className="text-xs font-bold text-blue-900 hover:text-blue-700 inline-flex items-center gap-1 transition-colors px-2 py-1.5"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* Quick Actions Row */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
          QUICK ACTIONS
        </span>
        <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-3">
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="px-4 py-2 border border-emerald-600 text-emerald-700 font-semibold text-xs rounded-lg hover:bg-emerald-50 transition-colors text-center inline-flex items-center justify-center gap-1.5"
          >
            {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
            {uploading ? 'Uploading...' : 'Upload Document'}
          </button>
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

      {/* Documents Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 max-w-lg w-full p-6 space-y-5 relative">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-blue-900">Your Medical Documents</h3>
              <button 
                onClick={() => setShowUploadModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 max-h-60 overflow-y-auto">
              {documents.length === 0 ? (
                <p className="text-xs text-gray-500 text-center py-4">No documents uploaded yet.</p>
              ) : (
                documents.map((doc, idx) => (
                  <div key={doc.id || idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-gray-100 text-xs">
                    <div className="flex items-center gap-2.5 truncate">
                      <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="font-medium text-slate-800 truncate">{doc.name}</span>
                    </div>
                    {doc.created_at && (
                      <span className="text-[10px] text-gray-400 shrink-0">
                        {new Date(doc.created_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>

            <div className="pt-2 border-t border-gray-100 flex items-center justify-end gap-3">
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold text-xs rounded-lg transition-colors inline-flex items-center gap-1.5"
              >
                {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                Upload New Document
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}