'use client';

import React from 'react';
import Link from 'next/link';
import Header from '../Header';
import { Bed } from 'lucide-react';

export default function AccommodationPage() {
  return (
    <div className="p-6 sm:p-10 max-w-7xl">
      <Header title="Accommodation" />
      <h2 className="text-2xl font-bold text-blue-900 mb-8">Accommodation</h2>

      <div className="max-w-xl mx-auto my-12 bg-slate-50/80 border border-slate-100 rounded-3xl p-8 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-emerald-100/60 text-emerald-600 flex items-center justify-center mx-auto">
          <Bed className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-blue-900 max-w-xs mx-auto">
          Available once your treatment plan is confirmed
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
          Accommodation options are matched to your treatment timeline, so we finalize your treatment plan first.
        </p>
        <div className="pt-2">
          <Link
            href="/dashboard/treatment-plan"
            className="inline-block px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm rounded-lg transition-colors"
          >
            View Treatment Plan
          </Link>
        </div>
      </div>
    </div>
  );
}