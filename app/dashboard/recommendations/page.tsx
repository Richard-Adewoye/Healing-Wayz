'use client';

import React from 'react';
import Header from '../Header';
import { PlusSquare } from 'lucide-react';

export default function RecommendationsPage() {
  return (
    <div className="p-6 sm:p-10 max-w-7xl">
      <Header title="Hospital Recommendations" />
      <h2 className="text-2xl font-bold text-blue-900 mb-8">Hospital Recommendations</h2>

      <div className="max-w-xl mx-auto my-12 bg-slate-50/80 border border-slate-100 rounded-3xl p-8 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-emerald-100/60 text-emerald-600 flex items-center justify-center mx-auto">
          <PlusSquare className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-blue-900">Your recommendations are being prepared</h3>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
          Our clinical advisors are still reviewing your case. We'll notify you as soon as they're ready.
        </p>
      </div>
    </div>
  );
}