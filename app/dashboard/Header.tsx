'use client';

import React from 'react';
import Link from 'next/link';
import { Bell } from 'lucide-react';

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-gray-200/80 pb-4 mb-6">
      <h1 className="text-xl font-bold text-blue-900">{title}</h1>
      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
        >
          ← Back to Website
        </Link>
        <button className="p-2 text-gray-500 hover:text-gray-700 relative rounded-full hover:bg-slate-100">
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>
        <div className="w-9 h-9 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
          A
        </div>
      </div>
    </div>
  );
}