import React from 'react';
import Image from 'next/image';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-sky-50 to-emerald-50 py-16 md:py-24">
      {/* Decorative backdrop shapes */}
      <div className="absolute top-0 left-0 -translate-x-1/3 -translate-y-1/3 w-96 h-96 bg-emerald-200/40 rounded-full blur-2xl pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 text-sm font-medium rounded-md">
              Healthcare Navigation, Simplified
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-blue-900 leading-tight">
              Confident healthcare decision begins with the right guidance.
            </h1>
            <p className="text-gray-600 text-lg max-w-xl">
              Helping patients and families make confident healthcare decisions by connecting them with trusted hospitals and specialists, whether locally or abroad, so they have the best possible chance at recovery.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <a
                href="#consultation"
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg shadow-sm transition"
              >
                Start Consultation
              </a>
              <a
                href="#services"
                className="px-6 py-3 bg-white hover:bg-gray-50 text-emerald-700 font-medium rounded-lg border border-gray-200 shadow-sm transition"
              >
                Explore Services
              </a>
            </div>
          </div>

          {/* Right Image Graphic */}
          <div className="relative flex justify-center items-center">
            <div className="absolute w-80 h-80 sm:w-96 sm:h-96 bg-blue-500 rounded-full z-0" />
            <div className="relative z-10 w-full max-w-md">
              <Image
                src="/images/image one.jfif"
                alt="Healthcare Professional"
                width={500}
                height={600}
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}