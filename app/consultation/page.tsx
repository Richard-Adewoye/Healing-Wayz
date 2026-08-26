'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Plus, File, X } from 'lucide-react';
import StepSevenSuccess from './_components/stepSevenSuccess';

// ==========================================
// CONSTANTS & TYPES
// ==========================================
const STEPS = [
  { id: 1, label: 'About You' },
  { id: 2, label: 'Your Situation' },
  { id: 3, label: 'Medical Details' },
  { id: 4, label: 'Documents' },
  { id: 5, label: 'Preferences' },
  { id: 6, label: 'Consent' },
];

interface FormDataState {
  // Step 1
  consultationFor: string;
  fullName: string;
  email: string;
  phone: string;
  country: string;
  password: string;
  confirmPassword: string;
  // Step 2
  supportType: string;
  healthcareArea: string;
  situationDescription: string;
  // Step 3
  hasDiagnosis: string;
  diagnosis: string;
  treatmentStatus: string;
  // Step 4
  files: File[];
  // Step 5
  careOutsideCountry: string;
  preferredLocation: string;
  priorities: string[];
  // Step 6
  confirmAccurate: boolean;
  consentReview: boolean;
  understandDisclaimer: boolean;
}

const initialFormData: FormDataState = {
  consultationFor: 'Myself',
  fullName: '',
  email: '',
  phone: '',
  country: '',
  password: '',
  confirmPassword: '',
  supportType: 'Finding the right hospital or specialist',
  healthcareArea: '',
  situationDescription: '',
  hasDiagnosis: 'Yes',
  diagnosis: '',
  treatmentStatus: 'Not started treatment',
  files: [],
  careOutsideCountry: 'Yes',
  preferredLocation: 'Within my country',
  priorities: ['Treatment cost'],
  confirmAccurate: false,
  consentReview: false,
  understandDisclaimer: false,
};

// ==========================================
// SHARED STEPPER & HEADER COMPONENT
// ==========================================
function StepHeader({ currentStep }: { currentStep: number }) {
  if (currentStep === 7) return null;

  return (
    <div className="max-w-3xl mx-auto text-center space-y-3">
      <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-100">
        Start Your Healthcare Journey
      </span>
      <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-950 tracking-tight">
        Let's understand how we can support you.
      </h1>
      <p className="text-slate-500 text-sm sm:text-base max-w-xl mx-auto">
        Every healthcare journey is different. Share some details, and our team will review your needs and guide you toward next steps. Takes about 5 minutes.
      </p>

      {/* Stepper Header Bar */}
      <div className="pt-8 pb-10">
        <div className="flex items-center justify-between relative max-w-2xl mx-auto px-2">
          <div className="absolute top-4 left-6 right-6 h-0.5 bg-slate-200 -z-0" />

          {STEPS.map((step) => {
            const isCompleted = step.id < currentStep;
            const isActive = step.id === currentStep;

            return (
              <div key={step.id} className="relative z-10 flex flex-col items-center group">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isCompleted
                      ? 'bg-emerald-600 text-white'
                      : isActive
                      ? 'border-2 border-emerald-600 bg-white text-emerald-700 ring-4 ring-emerald-50'
                      : 'border border-slate-300 bg-white text-slate-500'
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : step.id}
                </div>
                <span
                  className={`mt-2 text-xs font-medium whitespace-nowrap hidden sm:block ${
                    isActive ? 'text-emerald-700 font-bold' : isCompleted ? 'text-slate-800' : 'text-slate-500'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// MAIN PAGE WIZARD COMPONENT
// ==========================================
export default function ConsultationPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<FormDataState>(initialFormData);
  const [generatedCaseId, setGeneratedCaseId] = useState<string>('');

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 7));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));
  const goToStep = (step: number) => setCurrentStep(step);

  const handleFinalSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const randomCaseNum = Math.floor(100000 + Math.random() * 900000);
    const caseId = `HW-2026-${randomCaseNum}`;
    setGeneratedCaseId(caseId);

    // Save submission payload to localStorage for dashboard retrieval
    const consultationPayload = {
      caseId,
      consultationFor: formData.consultationFor,
      fullName: formData.fullName || 'Patient',
      email: formData.email,
      phone: formData.phone,
      country: formData.country,
      supportType: formData.supportType,
      healthcareArea: formData.healthcareArea,
      situationDescription: formData.situationDescription,
      hasDiagnosis: formData.hasDiagnosis,
      diagnosis: formData.diagnosis,
      treatmentStatus: formData.treatmentStatus,
      documentCount: formData.files.length,
      careOutsideCountry: formData.careOutsideCountry,
      preferredLocation: formData.preferredLocation,
      priorities: formData.priorities,
      submittedAt: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
    };

    localStorage.setItem('activeConsultationCase', JSON.stringify(consultationPayload));
    setCurrentStep(7);
  };

  if (currentStep === 7) {
    return (
      <StepSevenSuccess
        userName={formData.fullName || 'Patient'}
        caseId={generatedCaseId}
        onGoToDashboard={() => router.push('/dashboard')}
        onGoHome={() => router.push('/')}
      />
    );
  }

  return (
    <main className="min-h-screen bg-slate-50/50 py-10 px-4 sm:px-6 lg:px-8">
      <StepHeader currentStep={currentStep} />

      {/* STEP 1: ABOUT YOU */}
      {currentStep === 1 && (
        <div className="max-w-2xl mx-auto bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              nextStep();
            }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide">
                Who is this consultation for? <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-2.5">
                {['Myself', 'My child', 'My spouse', 'Another family member'].map((rel) => (
                  <button
                    key={rel}
                    type="button"
                    onClick={() => setFormData({ ...formData, consultationFor: rel })}
                    className={`px-4 py-2 rounded-full text-xs font-semibold transition-all border ${
                      formData.consultationFor === rel
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {rel}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="e.g. Amara Chukuwu"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-slate-800"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="you@example.com"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-slate-800"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+234 800 000 0000"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-slate-800"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide">
                Country of Residence <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 bg-white text-slate-800"
              >
                <option value="" disabled>Select a country</option>
                <option value="Nigeria">Nigeria</option>
                <option value="Ghana">Ghana</option>
                <option value="Kenya">Kenya</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="United States">United States</option>
                <option value="India">India</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide">
                  Create a Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="At least 8 characters"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-slate-800"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="Re-enter your password"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-slate-800"
                />
              </div>
            </div>

            <p className="text-xs text-slate-400 font-medium pt-1">
              We'll use this to set up your HealingWays account, so you can come back and track this case any time.
            </p>

            <div className="flex justify-center pt-4">
              <button
                type="submit"
                className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-lg transition-colors shadow-sm"
              >
                Continue
              </button>
            </div>
          </form>
        </div>
      )}

      {/* STEP 2: YOUR SITUATION */}
      {currentStep === 2 && (
        <div className="max-w-2xl mx-auto space-y-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              nextStep();
            }}
            className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6"
          >
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide">
                What kind of healthcare support are you looking for? <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-2.5">
                {[
                  'Finding the right hospital or specialist',
                  'Understanding my medical reports',
                  'Seeking medical guidance',
                  'Preparing for treatment abroad',
                  'Accommodation and logistics support',
                  'Visa support',
                  'Not sure, I need guidance',
                ].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFormData({ ...formData, supportType: type })}
                    className={`px-4 py-2 rounded-full text-xs font-semibold transition-all border text-left ${
                      formData.supportType === type
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5 pt-2">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide">
                Area of healthcare need
              </label>
              <select
                value={formData.healthcareArea}
                onChange={(e) => setFormData({ ...formData, healthcareArea: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 bg-white text-slate-800"
              >
                <option value="">Select if known</option>
                {['Oncology', 'Cardiology', 'Orthopedics', 'Neurology', 'Fertility & IVF', 'General Surgery', 'Pediatrics', 'Other / Not Sure'].map((area) => (
                  <option key={area} value={area}>{area}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5 pt-2">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide">
                Tell us about your healthcare situation <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-slate-500">
                Share what you're experiencing, your diagnosis if available, and what support you're looking for.
              </p>
              <textarea
                rows={4}
                required
                value={formData.situationDescription}
                onChange={(e) => setFormData({ ...formData, situationDescription: e.target.value })}
                placeholder="Please describe your situation..."
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-slate-800 resize-y"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <button type="button" onClick={prevStep} className="text-sm font-bold text-blue-900 hover:text-blue-700">
                ← Back
              </button>
              <button type="submit" className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-lg shadow-sm">
                Continue
              </button>
            </div>
          </form>
        </div>
      )}

      {/* STEP 3: MEDICAL DETAILS */}
      {currentStep === 3 && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide">
                Have you received a medical diagnosis?
              </label>
              <div className="flex flex-wrap gap-2.5">
                {['Yes', 'No', 'Unsure'].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setFormData({ ...formData, hasDiagnosis: opt })}
                    className={`px-5 py-2 rounded-full text-xs font-semibold transition-all border ${
                      formData.hasDiagnosis === opt
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5 pt-2">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide">
                Diagnosis (if known)
              </label>
              <input
                type="text"
                value={formData.diagnosis}
                onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                placeholder="e.g. Coronary artery disease"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-slate-800"
              />
            </div>

            <div className="space-y-2 pt-2">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide">
                Current treatment status
              </label>
              <div className="flex flex-wrap gap-2.5">
                {['Not started treatment', 'Currently receiving treatment', 'Completed treatment', 'Seeking another opinion'].map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setFormData({ ...formData, treatmentStatus: status })}
                    className={`px-4 py-2 rounded-full text-xs font-semibold transition-all border ${
                      formData.treatmentStatus === status
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button type="button" onClick={prevStep} className="text-sm font-bold text-blue-900 hover:text-blue-700">
              ← Back
            </button>
            <button type="button" onClick={nextStep} className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-lg shadow-sm">
              Continue
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: DOCUMENTS */}
      {currentStep === 4 && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="space-y-1">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                Upload supporting medical documents
              </h3>
              <p className="text-xs text-slate-500">
                Medical reports, scan results, lab reports, doctor letters, or short videos. Optional — you can continue without uploading now.
              </p>
            </div>

            <div className="border-2 border-dashed border-slate-200 hover:border-slate-300 rounded-xl p-6 sm:p-8 text-center bg-slate-50/50 relative flex flex-col items-center justify-center space-y-3">
              <input
                type="file"
                multiple
                onChange={(e) => {
                  if (e.target.files) {
                    setFormData({ ...formData, files: [...formData.files, ...Array.from(e.target.files)] });
                  }
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center bg-white text-emerald-600 shadow-sm pointer-events-none">
                <Plus className="w-5 h-5" />
              </div>
              <div className="space-y-1 pointer-events-none">
                <p className="text-xs sm:text-sm font-semibold text-slate-700">
                  <span className="text-emerald-600 font-bold hover:underline">Click to upload</span> or drag and drop
                </p>
                <p className="text-[11px] sm:text-xs text-slate-400 max-w-xs sm:max-w-md mx-auto">
                  PDF, JPG, PNG, HEIC, DOCX, MP4 or MOV — max 25MB each.
                </p>
              </div>
            </div>

            {formData.files.length > 0 && (
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-slate-700">Attached files:</span>
                <div className="space-y-2">
                  {formData.files.map((file, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                      <div className="flex items-center gap-2 truncate">
                        <File className="w-4 h-4 text-slate-500 shrink-0" />
                        <span className="font-medium text-slate-700 truncate">{file.name}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, files: formData.files.filter((_, i) => i !== idx) })}
                        className="text-slate-400 hover:text-red-500 p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <p className="text-xs text-slate-400 pt-2">
              Your documents are securely stored and only accessed by authorized HealingWays personnel reviewing your case.
            </p>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button type="button" onClick={prevStep} className="text-sm font-bold text-blue-900 hover:text-blue-700">
              ← Back
            </button>
            <button type="button" onClick={nextStep} className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-lg shadow-sm">
              Continue
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: PREFERENCES */}
      {currentStep === 5 && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide">
                Are you open to receiving care outside your country?
              </label>
              <div className="flex flex-wrap gap-2.5">
                {['Yes', 'No', 'Not sure'].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setFormData({ ...formData, careOutsideCountry: opt })}
                    className={`px-5 py-2 rounded-full text-xs font-semibold transition-all border ${
                      formData.careOutsideCountry === opt
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide">
                Preferred location
              </label>
              <div className="flex flex-wrap gap-2.5">
                {['Within my country', 'West Africa', 'India', 'Asia', 'Arab Region', 'Open to recommendations'].map((loc) => (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => setFormData({ ...formData, preferredLocation: loc })}
                    className={`px-4 py-2 rounded-full text-xs font-semibold transition-all border ${
                      formData.preferredLocation === loc
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide">
                What matters most to you? (select all that apply)
              </label>
              <div className="flex flex-wrap gap-2.5">
                {['Treatment cost', 'Hospital reputation', 'Distance', 'Family accommodation', 'Language support', 'Speed of access'].map((p) => {
                  const isSel = formData.priorities.includes(p);
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => {
                        const nextP = isSel
                          ? formData.priorities.filter((item) => item !== p)
                          : [...formData.priorities, p];
                        setFormData({ ...formData, priorities: nextP });
                      }}
                      className={`px-4 py-2 rounded-full text-xs font-semibold transition-all border ${
                        isSel
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button type="button" onClick={prevStep} className="text-sm font-bold text-blue-900 hover:text-blue-700">
              ← Back
            </button>
            <button type="button" onClick={nextStep} className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-lg shadow-sm">
              Continue
            </button>
          </div>
        </div>
      )}

      {/* STEP 6: CONSENT & SUMMARY */}
      {currentStep === 6 && (
        <div className="max-w-2xl mx-auto space-y-6">
          <form onSubmit={handleFinalSubmit} className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="bg-emerald-50/60 border border-emerald-100 rounded-xl p-5 sm:p-6 space-y-5 text-xs text-slate-600">
              <h3 className="text-sm font-bold text-slate-800">Review your information</h3>

              <div className="space-y-1 relative pr-12">
                <span className="font-bold text-slate-700 uppercase tracking-wide text-[11px]">ABOUT YOU</span>
                <button type="button" onClick={() => goToStep(1)} className="absolute top-0 right-0 font-bold text-blue-900 hover:text-blue-700">Edit</button>
                <p>{formData.consultationFor} · {formData.fullName || '—'}</p>
                <p>{formData.email || '—'} · {formData.phone || '—'}</p>
                <p>{formData.country || '—'}</p>
              </div>

              <hr className="border-emerald-100/80" />

              <div className="space-y-1 relative pr-12">
                <span className="font-bold text-slate-700 uppercase tracking-wide text-[11px]">YOUR SITUATION</span>
                <button type="button" onClick={() => goToStep(2)} className="absolute top-0 right-0 font-bold text-blue-900 hover:text-blue-700">Edit</button>
                <p><strong className="font-semibold text-slate-700">Looking for:</strong> {formData.supportType}</p>
                <p><strong className="font-semibold text-slate-700">Area:</strong> {formData.healthcareArea || '—'}</p>
                {formData.situationDescription && <p className="italic text-slate-500">"{formData.situationDescription}"</p>}
              </div>

              <hr className="border-emerald-100/80" />

              <div className="space-y-1 relative pr-12">
                <span className="font-bold text-slate-700 uppercase tracking-wide text-[11px]">MEDICAL DETAILS</span>
                <button type="button" onClick={() => goToStep(3)} className="absolute top-0 right-0 font-bold text-blue-900 hover:text-blue-700">Edit</button>
                <p><strong className="font-semibold text-slate-700">Diagnosed:</strong> {formData.diagnosis || '—'}</p>
                <p><strong className="font-semibold text-slate-700">Treatment status:</strong> {formData.treatmentStatus}</p>
              </div>

              <hr className="border-emerald-100/80" />

              <div className="space-y-1 relative pr-12">
                <span className="font-bold text-slate-700 uppercase tracking-wide text-[11px]">DOCUMENTS</span>
                <button type="button" onClick={() => goToStep(4)} className="absolute top-0 right-0 font-bold text-blue-900 hover:text-blue-700">Edit</button>
                <p>{formData.files.length > 0 ? `${formData.files.length} file(s) attached` : 'None attached'}</p>
              </div>

              <hr className="border-emerald-100/80" />

              <div className="space-y-1 relative pr-12">
                <span className="font-bold text-slate-700 uppercase tracking-wide text-[11px]">PREFERENCES</span>
                <button type="button" onClick={() => goToStep(5)} className="absolute top-0 right-0 font-bold text-blue-900 hover:text-blue-700">Edit</button>
                <p><strong className="font-semibold text-slate-700">Open to care abroad:</strong> {formData.careOutsideCountry}</p>
                <p><strong className="font-semibold text-slate-700">Preferred location:</strong> {formData.preferredLocation}</p>
                <p><strong className="font-semibold text-slate-700">What matters most:</strong> {formData.priorities.join(', ')}</p>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={formData.confirmAccurate}
                  onChange={(e) => setFormData({ ...formData, confirmAccurate: e.target.checked })}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <span className="text-xs text-slate-700">I confirm the information provided is accurate to the best of my knowledge.</span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={formData.consentReview}
                  onChange={(e) => setFormData({ ...formData, consentReview: e.target.checked })}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <span className="text-xs text-slate-700">I consent to HealingWays reviewing my case and contacting me with guidance.</span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={formData.understandDisclaimer}
                  onChange={(e) => setFormData({ ...formData, understandDisclaimer: e.target.checked })}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <span className="text-xs text-slate-700">I understand that HealingWays provides care navigation and guidance, not direct medical diagnosis.</span>
              </label>
            </div>

            <div className="flex items-center justify-between pt-4">
              <button type="button" onClick={prevStep} className="text-sm font-bold text-blue-900 hover:text-blue-700">
                ← Back
              </button>
              <button
                type="submit"
                disabled={!formData.confirmAccurate || !formData.consentReview || !formData.understandDisclaimer}
                className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-lg transition-colors shadow-sm"
              >
                Submit Consultation
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}