'use client';

import React from 'react';
import Link from 'next/link';
import Header from '../Header';
import { Bed } from 'lucide-react';
import HealthcareStepper from '../_components/HealthcareStepper';

export default function AccommodationPage() {
  return (
    <div className="p-4 sm:p-8 md:p-10 max-w-7xl mx-auto w-full font-sans space-y-6">
      <Header title="Accommodation" />
      
      {/* Reusable Healthcare Stepper */}
      <HealthcareStepper />

      <div className="max-w-xl mx-auto my-12 bg-slate-50/80 border border-slate-100 rounded-3xl p-8 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-emerald-100/60 text-emerald-600 flex items-center justify-center mx-auto">
          <Bed className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-blue-900 max-w-xs mx-auto leading-snug">
          Available once your treatment plan is confirmed
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
          Accommodation options are matched to your treatment timeline, so we finalize your treatment plan first.
        </p>
        <div className="pt-2">
          <Link
            href="/dashboard/treatment-plan"
            className="inline-block px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm rounded-lg shadow-xs transition-colors"
          >
            View Treatment Plan
          </Link>
        </div>
      </div>
    </div>
  );
}