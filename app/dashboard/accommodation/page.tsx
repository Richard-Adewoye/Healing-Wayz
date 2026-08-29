'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '../Header';
import { Bed, Loader2 } from 'lucide-react';
import { createClient } from '../../utils/supabase/client';
import HealthcareStepper from '../_components/HealthcareStepper';

export default function AccommodationPage() {
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [accommodationDetails, setAccommodationDetails] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data: caseData } = await supabase
        .from('cases')
        .select('id')
        .eq('user_id', user.id)
        .limit(1)
        .maybeSingle();

      if (!caseData) {
        setLoading(false);
        return;
      }

      const { data: travelData } = await supabase
        .from('travel_plans')
        .select('accommodation_details')
        .eq('case_id', caseData.id)
        .maybeSingle();

      setAccommodationDetails(travelData?.accommodation_details || null);
    } catch (err) {
      console.error('Error loading accommodation details:', err);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="p-4 sm:p-8 md:p-10 max-w-7xl mx-auto w-full font-sans space-y-6">
      <Header title="Accommodation" />
      
      {/* Reusable Healthcare Stepper */}
      <HealthcareStepper />

      {loading ? (
        <div className="flex items-center justify-center p-12 min-h-[200px]">
          <Loader2 className="w-6 h-6 text-blue-900 animate-spin mr-2" />
          <span className="text-sm font-medium text-slate-600">Loading your accommodation details...</span>
        </div>
      ) : accommodationDetails ? (
        <div className="max-w-xl mx-auto my-12 bg-white border border-slate-200 rounded-3xl p-8 space-y-4 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-emerald-100/60 text-emerald-600 flex items-center justify-center mx-auto">
            <Bed className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-blue-900 text-center">
            Your Accommodation Details
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line text-center">
            {accommodationDetails}
          </p>
        </div>
      ) : (
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
      )}
    </div>
  );
}