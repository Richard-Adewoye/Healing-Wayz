'use client';

import React from 'react';
import Link from 'next/link';
import { Bell } from 'lucide-react';

export function AdminHeader() {
  return (
    <header className="flex items-center justify-between px-8 py-4 bg-white border-b border-slate-200 shrink-0">
      <h1 className="text-xl font-bold text-slate-800">Dashboard</h1>
      <div className="flex items-center gap-5">
        <Link
          href="/"
          className="text-sm font-semibold text-[#2563EB] hover:underline flex items-center gap-1"
        >
          &larr; Back to Website
        </Link>

        <button className="relative text-slate-500 hover:text-slate-700">
          <Bell className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#1E3A8A] text-white flex items-center justify-center font-bold text-sm">
            S
          </div>
          <div className="text-left leading-tight">
            <p className="text-sm font-bold text-slate-800">Sarah James</p>
            <p className="text-xs text-slate-500">Care Coordinator</p>
          </div>
        </div>
      </div>
    </header>
  );
}