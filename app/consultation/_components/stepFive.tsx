'use client';

import React, { useState } from 'react';
import { Check } from 'lucide-react';

const STEPS = [
  { id: 1, label: 'About You' },
  { id: 2, label: 'Your Situation' },
  { id: 3, label: 'Medical Details' },
  { id: 4, label: 'Documents' },
  { id: 5, label: 'Preferences' },
  { id: 6, label: 'Consent' },
];

const CARE_OUTSIDE_OPTIONS = ['Yes', 'No', 'Not sure'];

const LOCATION_OPTIONS = [
  'Within my country',
  'West Africa',
  'India',
  'Asia',
  'Arab Region',
  'Open to recommendations',
];

const PRIORITY_OPTIONS = [
  'Treatment cost',
  'Hospital reputation',
  'Distance',
  'Family accommodation',
  'Language support',
  'Speed of access',
];

export default function StepFivePreferences({
  onNext,
  onBack,
}: {
  onNext?: (data: any) => void;
  onBack?: () => void;
}) {
  const [formData, setFormData] = useState({
    careOutsideCountry: 'Yes',
    preferredLocation: 'Within my country',
    priorities: ['Treatment cost'] as string[],
  });

  const togglePriority = (priority: string) => {
    setFormData((prev) => {
      const exists = prev.priorities.includes(priority);
      return {
        ...prev,
        priorities: exists
          ? prev.priorities.filter((item) => item !== priority)
          : [...prev.priorities, priority],
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onNext) onNext(formData);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-10 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
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
            {/* Horizontal Line */}
            <div className="absolute top-4 left-6 right-6 h-0.5 bg-slate-200 -z-0" />

            {STEPS.map((step) => {
              const isCompleted = step.id < 5;
              const isActive = step.id === 5;

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

      {/* Form Content Card */}
      <div className="max-w-2xl mx-auto space-y-6">
        <form onSubmit={handleSubmit} className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          
          {/* Are you open to receiving care outside your country? */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide">
              Are you open to receiving care outside your country?
            </label>
            <div className="flex flex-wrap gap-2.5">
              {CARE_OUTSIDE_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setFormData({ ...formData, careOutsideCountry: option })}
                  className={`px-5 py-2 rounded-full text-xs font-semibold transition-all border ${
                    formData.careOutsideCountry === option
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Preferred location */}
          <div className="space-y-2 pt-2">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide">
              Preferred location
            </label>
            <div className="flex flex-wrap gap-2.5">
              {LOCATION_OPTIONS.map((loc) => (
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

          {/* What matters most to you? */}
          <div className="space-y-2 pt-2">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide">
              What matters most to you? (select all that apply)
            </label>
            <div className="flex flex-wrap gap-2.5">
              {PRIORITY_OPTIONS.map((priority) => {
                const isSelected = formData.priorities.includes(priority);
                return (
                  <button
                    key={priority}
                    type="button"
                    onClick={() => togglePriority(priority)}
                    className={`px-4 py-2 rounded-full text-xs font-semibold transition-all border ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {priority}
                  </button>
                );
              })}
            </div>
          </div>

        </form>

        {/* Navigation Buttons Row */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={onBack}
            className="text-sm font-bold text-blue-900 hover:text-blue-700 transition-colors flex items-center gap-1"
          >
            ← Back
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-lg transition-colors shadow-sm"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}