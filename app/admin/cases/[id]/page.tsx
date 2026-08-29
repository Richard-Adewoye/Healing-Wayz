'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Loader2,
  FileText,
  Check,
  X,
  Plus,
  Building2,
  Plane,
  ClipboardList,
  MessageSquareText,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { createClient } from '../../../utils/supabase/client';

// NOTE ON workflow_stage VALUES:
// Assumed to match the existing patient-facing page names:
// 'New Consultation' -> 'Case Review' -> 'Hospital Recommendation'
// -> 'Travel Preparation' -> 'Treatment & Recovery' -> 'Completed'
// If your case_stage_enum uses different labels, update WORKFLOW_STAGES below.
const WORKFLOW_STAGES = [
  'New Consultation',
  'Case Review',
  'Hospital Recommendation',
  'Travel Preparation',
  'Treatment & Recovery',
  'Completed',
] as const;

type WorkflowStage = (typeof WORKFLOW_STAGES)[number];

interface ProfileRef {
  full_name: string | null;
  email?: string | null;
  phone?: string | null;
}

interface CaseRecord {
  id: string;
  case_number: string;
  user_id: string | null;
  coordinator_id: string | null;
  need: string;
  stage: string;
  status: string;
  priority: string;
  workflow_stage: WorkflowStage | null;
  review_text: string | null;
  review_accepted: boolean;
  review_accepted_at: string | null;
  selected_hospital_id: string | null;
  support_type: string | null;
  healthcare_area: string | null;
  situation_description: string | null;
  has_diagnosis: string | null;
  diagnosis: string | null;
  treatment_status: string | null;
  care_outside_country: string | null;
  preferred_location: string | null;
  priorities: string[] | null;
  submitted_at: string | null;
  created_at: string;
  updated_at: string;
  patient: ProfileRef | null;
  coordinator: ProfileRef | null;
}

interface Hospital {
  id: string;
  name: string;
  location: string;
  specialties: string[] | null;
  description: string | null;
}

interface Recommendation {
  id: string;
  hospital_id: string;
  hospital: Hospital;
}

interface TravelPlan {
  id: string;
  flight_details: string | null;
  accommodation_details: string | null;
  itinerary_notes: string | null;
  confirmed_by_patient: boolean;
}

interface TreatmentUpdate {
  id: string;
  update_title: string;
  update_content: string;
  created_at: string;
  created_by: string | null;
}

interface DocumentItem {
  id: string;
  name: string;
  created_at: string;
  file_size: number | null;
}

interface CoordinatorOption {
  id: string;
  full_name: string | null;
}

function unwrap<T>(val: T | T[] | null | undefined): T | null {
  if (!val) return null;
  return Array.isArray(val) ? val[0] ?? null : val;
}

export default function AdminCaseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const caseId = params?.id as string;
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [caseRecord, setCaseRecord] = useState<CaseRecord | null>(null);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [travelPlan, setTravelPlan] = useState<TravelPlan | null>(null);
  const [treatmentUpdates, setTreatmentUpdates] = useState<TreatmentUpdate[]>([]);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [coordinators, setCoordinators] = useState<CoordinatorOption[]>([]);
  const [adminId, setAdminId] = useState<string | null>(null);

  // Local editable form state
  const [reviewDraft, setReviewDraft] = useState('');
  const [flightDraft, setFlightDraft] = useState('');
  const [accommodationDraft, setAccommodationDraft] = useState('');
  const [itineraryDraft, setItineraryDraft] = useState('');
  const [updateTitleDraft, setUpdateTitleDraft] = useState('');
  const [updateContentDraft, setUpdateContentDraft] = useState('');
  const [selectedHospitalToAdd, setSelectedHospitalToAdd] = useState('');

  const fetchAll = useCallback(async () => {
    if (!caseId) return;
    setLoading(true);
    setErrorMsg(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      setAdminId(user?.id ?? null);

      const { data: caseData, error: caseError } = await supabase
        .from('cases')
        .select(`
          id, case_number, user_id, coordinator_id, need, stage, status, priority,
          workflow_stage, review_text, review_accepted, review_accepted_at,
          selected_hospital_id, support_type, healthcare_area, situation_description,
          has_diagnosis, diagnosis, treatment_status, care_outside_country,
          preferred_location, priorities, submitted_at, created_at, updated_at,
          patient:profiles!user_id ( full_name, email, phone ),
          coordinator:profiles!coordinator_id ( full_name, email )
        `)
        .eq('id', caseId)
        .maybeSingle();

      if (caseError) throw new Error(caseError.message);
      if (!caseData) {
        setErrorMsg('Case not found.');
        setLoading(false);
        return;
      }

      const mapped: CaseRecord = {
        ...(caseData as any),
        patient: unwrap((caseData as any).patient),
        coordinator: unwrap((caseData as any).coordinator),
      };
      setCaseRecord(mapped);
      setReviewDraft(mapped.review_text || '');

      const [
        { data: hospitalsData },
        { data: recsData },
        { data: travelData },
        { data: updatesData },
        { data: docsData },
        { data: coordData },
      ] = await Promise.all([
        supabase.from('hospitals').select('id, name, location, specialties, description').order('name'),
        supabase
          .from('case_hospital_recommendations')
          .select('id, hospital_id, hospital:hospitals ( id, name, location, specialties, description )')
          .eq('case_id', caseId),
        supabase.from('travel_plans').select('*').eq('case_id', caseId).maybeSingle(),
        supabase.from('treatment_updates').select('*').eq('case_id', caseId).order('created_at', { ascending: false }),
        supabase.from('documents').select('id, name, created_at, file_size').eq('case_id', caseId).order('created_at', { ascending: false }),
        supabase.from('profiles').select('id, full_name').eq('is_admin', true).order('full_name'),
      ]);

      setHospitals(hospitalsData || []);

      const mappedRecs: Recommendation[] = (recsData || []).map((r: any) => ({
        id: r.id,
        hospital_id: r.hospital_id,
        hospital: unwrap(r.hospital) as Hospital,
      }));
      setRecommendations(mappedRecs);

      if (travelData) {
        setTravelPlan(travelData as TravelPlan);
        setFlightDraft(travelData.flight_details || '');
        setAccommodationDraft(travelData.accommodation_details || '');
        setItineraryDraft(travelData.itinerary_notes || '');
      }

      setTreatmentUpdates(updatesData || []);

      // documents table doesn't reliably have case_id populated on every row
      // in older records, so fall back to matching by patient user_id.
      if ((!docsData || docsData.length === 0) && mapped.user_id) {
        const { data: fallbackDocs } = await supabase
          .from('documents')
          .select('id, name, created_at, file_size')
          .eq('user_id', mapped.user_id)
          .order('created_at', { ascending: false });
        setDocuments(fallbackDocs || []);
      } else {
        setDocuments(docsData || []);
      }

      setCoordinators(coordData || []);
    } catch (err: any) {
      console.error('Error loading case detail:', err);
      setErrorMsg(err.message || 'Failed to load case.');
    } finally {
      setLoading(false);
    }
  }, [caseId, supabase]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const setStage = async (stage: WorkflowStage) => {
    if (!caseRecord) return;
    const { error } = await supabase
      .from('cases')
      .update({ workflow_stage: stage, updated_at: new Date().toISOString() })
      .eq('id', caseRecord.id);
    if (error) {
      setErrorMsg(error.message);
      return;
    }
    setCaseRecord({ ...caseRecord, workflow_stage: stage });
  };

  const handleAssignCoordinator = async (coordinatorId: string) => {
    if (!caseRecord) return;
    setSaving('coordinator');
    const { error } = await supabase
      .from('cases')
      .update({ coordinator_id: coordinatorId || null })
      .eq('id', caseRecord.id);
    setSaving(null);
    if (error) {
      setErrorMsg(error.message);
      return;
    }
    await fetchAll();
  };

  const handleSaveReview = async () => {
    if (!caseRecord) return;
    setSaving('review');
    const { error } = await supabase
      .from('cases')
      .update({
        review_text: reviewDraft,
        review_accepted: false,
        review_accepted_at: null,
        workflow_stage: 'Case Review',
        updated_at: new Date().toISOString(),
      })
      .eq('id', caseRecord.id);
    setSaving(null);
    if (error) {
      setErrorMsg(error.message);
      return;
    }
    await fetchAll();
  };

  const handleAddRecommendation = async () => {
    if (!caseRecord || !selectedHospitalToAdd) return;
    if (recommendations.some((r) => r.hospital_id === selectedHospitalToAdd)) return;
    setSaving('add-hospital');
    const { error } = await supabase
      .from('case_hospital_recommendations')
      .insert({ case_id: caseRecord.id, hospital_id: selectedHospitalToAdd });
    setSaving(null);
    if (error) {
      setErrorMsg(error.message);
      return;
    }
    setSelectedHospitalToAdd('');
    await fetchAll();
  };

  const handleRemoveRecommendation = async (recId: string) => {
    setSaving(`remove-${recId}`);
    const { error } = await supabase.from('case_hospital_recommendations').delete().eq('id', recId);
    setSaving(null);
    if (error) {
      setErrorMsg(error.message);
      return;
    }
    await fetchAll();
  };

  const handlePublishRecommendations = async () => {
    await setStage('Hospital Recommendation');
  };

  const handleSaveTravelPlan = async () => {
    if (!caseRecord) return;
    setSaving('travel');
    const payload = {
      case_id: caseRecord.id,
      flight_details: flightDraft,
      accommodation_details: accommodationDraft,
      itinerary_notes: itineraryDraft,
      updated_at: new Date().toISOString(),
    };

    const { error } = travelPlan
      ? await supabase.from('travel_plans').update(payload).eq('id', travelPlan.id)
      : await supabase.from('travel_plans').insert(payload);

    if (!error) {
      await supabase
        .from('cases')
        .update({ workflow_stage: 'Travel Preparation', updated_at: new Date().toISOString() })
        .eq('id', caseRecord.id);
    }

    setSaving(null);
    if (error) {
      setErrorMsg(error.message);
      return;
    }
    await fetchAll();
  };

  const handlePostUpdate = async () => {
    if (!caseRecord || !updateTitleDraft.trim() || !updateContentDraft.trim()) return;
    setSaving('treatment-update');
    const { error } = await supabase.from('treatment_updates').insert({
      case_id: caseRecord.id,
      update_title: updateTitleDraft,
      update_content: updateContentDraft,
      created_by: adminId,
    });

    if (!error) {
      await supabase
        .from('cases')
        .update({ workflow_stage: 'Treatment & Recovery', updated_at: new Date().toISOString() })
        .eq('id', caseRecord.id);
    }

    setSaving(null);
    if (error) {
      setErrorMsg(error.message);
      return;
    }
    setUpdateTitleDraft('');
    setUpdateContentDraft('');
    await fetchAll();
  };

  const handleMarkCompleted = async () => {
    await setStage('Completed');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] w-full">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (errorMsg && !caseRecord) {
    return (
      <div className="p-8 max-w-3xl mx-auto text-center space-y-3">
        <p className="text-sm text-red-600 font-medium">{errorMsg}</p>
        <Link href="/admin" className="text-sm text-blue-700 font-semibold hover:underline">
          ← Back to dashboard
        </Link>
      </div>
    );
  }

  if (!caseRecord) return null;

  const selectedHospital = hospitals.find((h) => h.id === caseRecord.selected_hospital_id);
  const availableHospitalsToAdd = hospitals.filter(
    (h) => !recommendations.some((r) => r.hospital_id === h.id)
  );
  const currentStageIndex = WORKFLOW_STAGES.indexOf((caseRecord.workflow_stage || 'New Consultation') as WorkflowStage);

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto w-full space-y-6">

      {/* Back link + header */}
      <div className="space-y-4">
        <button
          onClick={() => router.push('/admin')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to dashboard
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-900 px-2.5 py-0.5 rounded-md">
                {caseRecord.workflow_stage || 'New Consultation'}
              </span>
              <span className="text-xs text-slate-500">Status: {caseRecord.status}</span>
              <span className="text-xs text-slate-500">Priority: {caseRecord.priority}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-blue-900 mt-2">
              {caseRecord.patient?.full_name || 'Unknown Patient'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              {caseRecord.case_number} · {caseRecord.patient?.email}
              {caseRecord.patient?.phone ? ` · ${caseRecord.patient.phone}` : ''}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-slate-600">Coordinator</label>
            <select
              value={caseRecord.coordinator_id || ''}
              onChange={(e) => handleAssignCoordinator(e.target.value)}
              disabled={saving === 'coordinator'}
              className="text-xs border border-slate-300 rounded-lg px-3 py-2 bg-white text-slate-700 disabled:opacity-50"
            >
              <option value="">Unassigned</option>
              {coordinators.map((c) => (
                <option key={c.id} value={c.id}>{c.full_name || c.id}</option>
              ))}
            </select>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">{errorMsg}</div>
        )}

        {/* Stage progress */}
        <div className="flex items-center gap-1 flex-wrap">
          {WORKFLOW_STAGES.map((stage, idx) => (
            <span
              key={stage}
              className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border ${
                idx <= currentStageIndex
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-white text-slate-400 border-slate-200'
              }`}
            >
              {idx + 1}. {stage}
            </span>
          ))}
        </div>
      </div>

      {/* Patient submission summary */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-900 flex items-center gap-2">
          <ClipboardList className="w-4 h-4" /> Patient Submission
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs text-slate-600">
          <p><strong className="text-slate-900 font-semibold">Need:</strong> {caseRecord.need}</p>
          <p><strong className="text-slate-900 font-semibold">Support Type:</strong> {caseRecord.support_type || '—'}</p>
          <p><strong className="text-slate-900 font-semibold">Healthcare Area:</strong> {caseRecord.healthcare_area || '—'}</p>
          <p><strong className="text-slate-900 font-semibold">Has Diagnosis:</strong> {caseRecord.has_diagnosis || '—'}</p>
          <p><strong className="text-slate-900 font-semibold">Diagnosis:</strong> {caseRecord.diagnosis || '—'}</p>
          <p><strong className="text-slate-900 font-semibold">Treatment Status:</strong> {caseRecord.treatment_status || '—'}</p>
          <p><strong className="text-slate-900 font-semibold">Care Outside Country:</strong> {caseRecord.care_outside_country || '—'}</p>
          <p><strong className="text-slate-900 font-semibold">Preferred Location:</strong> {caseRecord.preferred_location || '—'}</p>
          {caseRecord.priorities && caseRecord.priorities.length > 0 && (
            <p className="sm:col-span-2"><strong className="text-slate-900 font-semibold">Priorities:</strong> {caseRecord.priorities.join(', ')}</p>
          )}
          {caseRecord.situation_description && (
            <p className="sm:col-span-2"><strong className="text-slate-900 font-semibold">Situation:</strong> {caseRecord.situation_description}</p>
          )}
        </div>

        {/* Documents */}
        <div className="pt-3 border-t border-slate-100 space-y-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Documents ({documents.length})
          </span>
          {documents.length === 0 ? (
            <p className="text-xs text-slate-400">No documents uploaded.</p>
          ) : (
            <ul className="space-y-1">
              {documents.map((doc) => (
                <li key={doc.id} className="flex items-center gap-2 text-xs text-slate-600">
                  <FileText className="w-3.5 h-3.5 text-blue-900 shrink-0" />
                  <span className="truncate">{doc.name}</span>
                  <span className="text-slate-400 shrink-0">
                    {new Date(doc.created_at).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Stage 2: Case Review */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-900 flex items-center gap-2">
            <MessageSquareText className="w-4 h-4" /> Case Review
          </span>
          {caseRecord.review_accepted ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5" /> Accepted by patient
              {caseRecord.review_accepted_at ? ` · ${new Date(caseRecord.review_accepted_at).toLocaleDateString()}` : ''}
            </span>
          ) : caseRecord.review_text ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full">
              <Clock className="w-3.5 h-3.5" /> Awaiting patient response
            </span>
          ) : null}
        </div>
        <textarea
          value={reviewDraft}
          onChange={(e) => setReviewDraft(e.target.value)}
          rows={4}
          placeholder="Write your clinical review / summary for the patient..."
          className="w-full text-xs sm:text-sm text-slate-700 border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-900/20"
        />
        <button
          onClick={handleSaveReview}
          disabled={saving === 'review' || !reviewDraft.trim()}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-900 hover:bg-blue-800 disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition-colors"
        >
          {saving === 'review' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
          Save & Send to Patient
        </button>
      </div>

      {/* Stage 3: Hospital Recommendations */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-900 flex items-center gap-2">
            <Building2 className="w-4 h-4" /> Hospital Recommendations
          </span>
          {selectedHospital && (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5" /> Patient selected: {selectedHospital.name}
            </span>
          )}
        </div>

        <div className="space-y-2">
          {recommendations.length === 0 ? (
            <p className="text-xs text-slate-400">No hospitals recommended yet.</p>
          ) : (
            recommendations.map((rec) => (
              <div
                key={rec.id}
                className={`flex items-center justify-between gap-3 p-3 rounded-xl border text-xs ${
                  rec.hospital_id === caseRecord.selected_hospital_id
                    ? 'border-emerald-300 bg-emerald-50/60'
                    : 'border-slate-200'
                }`}
              >
                <div>
                  <p className="font-semibold text-slate-900">{rec.hospital.name}</p>
                  <p className="text-slate-500">{rec.hospital.location}</p>
                  {rec.hospital.specialties && rec.hospital.specialties.length > 0 && (
                    <p className="text-slate-400 mt-0.5">{rec.hospital.specialties.join(', ')}</p>
                  )}
                </div>
                <button
                  onClick={() => handleRemoveRecommendation(rec.id)}
                  disabled={saving === `remove-${rec.id}`}
                  className="p-1.5 text-slate-400 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors shrink-0"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-2 pt-1">
          <select
            value={selectedHospitalToAdd}
            onChange={(e) => setSelectedHospitalToAdd(e.target.value)}
            className="flex-1 text-xs border border-slate-300 rounded-lg px-3 py-2 bg-white text-slate-700"
          >
            <option value="">Select a hospital to add…</option>
            {availableHospitalsToAdd.map((h) => (
              <option key={h.id} value={h.id}>{h.name} — {h.location}</option>
            ))}
          </select>
          <button
            onClick={handleAddRecommendation}
            disabled={!selectedHospitalToAdd || saving === 'add-hospital'}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 border border-blue-900 text-blue-900 hover:bg-blue-50 disabled:opacity-50 text-xs font-semibold rounded-lg transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Add
          </button>
        </div>

        <button
          onClick={handlePublishRecommendations}
          disabled={recommendations.length === 0}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-900 hover:bg-blue-800 disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition-colors"
        >
          <Check className="w-3.5 h-3.5" /> Publish to Patient
        </button>
      </div>

      {/* Stage 4: Travel Preparation */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-900 flex items-center gap-2">
            <Plane className="w-4 h-4" /> Travel Preparation
          </span>
          {travelPlan?.confirmed_by_patient && (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5" /> Confirmed by patient
            </span>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-semibold text-slate-500">Flight Details</label>
          <textarea
            value={flightDraft}
            onChange={(e) => setFlightDraft(e.target.value)}
            rows={2}
            placeholder="Flight numbers, dates, times..."
            className="w-full text-xs sm:text-sm text-slate-700 border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-900/20"
          />
          <label className="text-[11px] font-semibold text-slate-500">Accommodation Details</label>
          <textarea
            value={accommodationDraft}
            onChange={(e) => setAccommodationDraft(e.target.value)}
            rows={2}
            placeholder="Hotel, address, check-in/out dates..."
            className="w-full text-xs sm:text-sm text-slate-700 border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-900/20"
          />
          <label className="text-[11px] font-semibold text-slate-500">Itinerary Notes</label>
          <textarea
            value={itineraryDraft}
            onChange={(e) => setItineraryDraft(e.target.value)}
            rows={3}
            placeholder="Day-by-day notes for the patient..."
            className="w-full text-xs sm:text-sm text-slate-700 border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-900/20"
          />
        </div>

        <button
          onClick={handleSaveTravelPlan}
          disabled={saving === 'travel'}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-900 hover:bg-blue-800 disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition-colors"
        >
          {saving === 'travel' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
          Save & Send to Patient
        </button>
      </div>

      {/* Stage 5: Treatment & Recovery */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-900 flex items-center gap-2">
          <ClipboardList className="w-4 h-4" /> Treatment & Recovery Updates
        </span>

        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
          {treatmentUpdates.length === 0 ? (
            <p className="text-xs text-slate-400">No updates posted yet.</p>
          ) : (
            treatmentUpdates.map((u) => (
              <div key={u.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-slate-900">{u.update_title}</p>
                  <p className="text-[10px] text-slate-400">{new Date(u.created_at).toLocaleString()}</p>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{u.update_content}</p>
              </div>
            ))
          )}
        </div>

        <div className="space-y-2 pt-2 border-t border-slate-100">
          <input
            value={updateTitleDraft}
            onChange={(e) => setUpdateTitleDraft(e.target.value)}
            placeholder="Update title (e.g. Post-op check-in)"
            className="w-full text-xs sm:text-sm text-slate-700 border border-slate-300 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-900/20"
          />
          <textarea
            value={updateContentDraft}
            onChange={(e) => setUpdateContentDraft(e.target.value)}
            rows={2}
            placeholder="Update details for the patient..."
            className="w-full text-xs sm:text-sm text-slate-700 border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-900/20"
          />
          <button
            onClick={handlePostUpdate}
            disabled={saving === 'treatment-update' || !updateTitleDraft.trim() || !updateContentDraft.trim()}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-900 hover:bg-blue-800 disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            {saving === 'treatment-update' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
            Post Update
          </button>
        </div>
      </div>

      {/* Stage 6: Complete */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between flex-wrap gap-3">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-900">Close Out Case</span>
          <p className="text-xs text-slate-500 mt-1">
            Marks this case as Completed. The patient will see this reflected in their journey status.
          </p>
        </div>
        <button
          onClick={handleMarkCompleted}
          disabled={caseRecord.workflow_stage === 'Completed'}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition-colors"
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          {caseRecord.workflow_stage === 'Completed' ? 'Completed' : 'Mark Completed'}
        </button>
      </div>

    </div>
  );
}