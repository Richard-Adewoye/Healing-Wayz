'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function PatientLoginForm() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login submission logic
    console.log('Login attempt with:', { identifier, password });
  };

  const handleDemoLogin = () => {
    // Handle demo patient access logic
    console.log('Continuing as demo patient');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-sm border border-gray-100 p-8 sm:p-10 space-y-6">
        
        {/* Header & Logo */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="relative w-40 h-20 mb-1">
            <Image
              src="/images/logo.png"
              alt="HealingWays Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <p className="text-xs sm:text-sm text-gray-500 font-medium">
            Welcome back to your healthcare journey.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email or Phone Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-blue-900">
              Email or Phone
            </label>
            <input
              type="text"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-blue-900">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Main Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-lg shadow-sm transition-colors"
          >
            Login
          </button>
        </form>

        {/* Forgot Password Link */}
        <div className="text-center">
          <Link
            href="/forgot-password"
            className="text-xs sm:text-sm font-bold text-blue-900 hover:underline transition-all"
          >
            Forgot password?
          </Link>
        </div>

        <div className="border-t border-gray-100 pt-2" />

        {/* Demo Patient Button */}
        <div>
          <button
            type="button"
            onClick={handleDemoLogin}
            className="w-full py-3 bg-white hover:bg-emerald-50 border border-emerald-600 text-emerald-700 font-semibold text-sm rounded-lg transition-colors"
          >
            Continue as Demo Patient
          </button>
        </div>

        {/* Sign Up Link */}
        <div className="text-center text-xs text-gray-500 pt-2">
          New to HealingWays?{' '}
          <Link
            href="/register"
            className="font-bold text-blue-900 hover:underline transition-all"
          >
            Create an account
          </Link>
        </div>

      </div>
    </div>
  );
}