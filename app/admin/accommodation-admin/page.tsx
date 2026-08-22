'use client';

import React from 'react';
import { Plus, MapPin } from 'lucide-react';

interface AccommodationCardProps {
  image: string;
  title: string;
  location: string;
  tags: string[];
  description: string;
  proximity: string;
  features: string[];
  price: string;
  pricePeriod: string;
}

const accommodations: AccommodationCardProps[] = [
  {
    image: '/images/accommodations/eko-comfort-suites.jpg',
    title: 'Eko Comfort Suites',
    location: 'Lagos, Nigeria',
    tags: ['Hotel', '1BHK', 'Fully Furnished'],
    description: 'Fully Serviced — daily housekeeping, in-room dining',
    proximity: '12 min (6.2 km) from Lagoon Specialist',
    features: ['Free WiFi', 'Airport Pickup'],
    price: '$85',
    pricePeriod: '/night',
  },
  {
    image: '/images/accommodations/harbour-view.jpg',
    title: 'Harbour View Guest House',
    location: 'Accra, Ghana',
    tags: ['Short-let', 'Studio', 'Semi-Furnished'],
    description: 'Self-Catering — kitchenette, weekly cleaning',
    proximity: '18 min (9.1 km) from Accra Heart Institute',
    features: ['Free WiFi', 'Balcony'],
    price: '$65',
    pricePeriod: '/night',
  },
  {
    image: '/images/accommodations/riverside-family.jpg',
    title: 'Riverside Family Apartments',
    location: 'Chennai, India',
    tags: ['Short-let', '2BHK', 'Fully Furnished'],
    description: 'Self-Catering — full kitchen, weekly cleaning',
    proximity: '22 min (11.4 km) from Apex Multispecialty Hospital',
    features: ['Free WiFi', 'Breakfast Included'],
    price: '$1,200',
    pricePeriod: '/month',
  },
  {
    image: '/images/accommodations/douala-riverside.jpg',
    title: 'Douala Riverside Lodge',
    location: 'Douala, Cameroon',
    tags: ['Hotel', '1BHK', 'Fully Furnished'],
    description: 'Fully Serviced — daily housekeeping',
    proximity: '10 min (4.8 km) from Douala General Reference Hospital',
    features: ['Free WiFi', 'Airport Pickup'],
    price: '$70',
    pricePeriod: '/night',
  },
  {
    image: '/images/accommodations/dubai-care.jpg',
    title: 'Dubai Care Residences',
    location: 'Dubai, United Arab Emirates',
    tags: ['Hotel', '1BHK', 'Fully Furnished'],
    description: 'Fully Serviced — daily housekeeping, concierge',
    proximity: '15 min (7.5 km) from Al Noor Specialist Medical Center',
    features: ['Free WiFi', 'Airport Pickup', 'Gym Access'],
    price: '$145',
    pricePeriod: '/night',
  },
  {
    image: '/images/accommodations/bangkok-wellness.jpg',
    title: 'Bangkok Wellness Suites',
    location: 'Bangkok, Thailand',
    tags: ['Short-let', 'Studio', 'Fully Furnished'],
    description: 'Self-Catering — kitchenette, weekly cleaning',
    proximity: '13 min (5.9 km) from Raffles Specialist Medical Center',
    features: ['Free WiFi', 'Breakfast Included', 'Pool Access'],
    price: '$2,100',
    pricePeriod: '/month',
  },
];

export default function AccommodationPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto w-full space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#1E3A8A]">Accommodation & Housing</h2>
          <p className="text-sm text-slate-500 mt-1">
            Browse the housing catalog near partner hospitals. Recommend an option directly to a patient&apos;s case.
          </p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 bg-[#22C55E] hover:bg-emerald-600 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors shrink-0">
          <Plus className="w-4 h-4 stroke-[3]" />
          Add Accommodation Listing
        </button>
      </div>

      {/* Accommodations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accommodations.map((item, idx) => (
          <div
            key={idx}
            className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
          >
            <div>
              {/* Card Image Header */}
              <div className="relative h-48 w-full bg-slate-100">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Card Body Content */}
              <div className="p-5 space-y-3">
                {/* Title and Location */}
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{item.title}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{item.location}</p>
                </div>

                {/* Filter Badges */}
                <div className="flex flex-wrap gap-1.5">
                  {item.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="bg-blue-50 text-blue-700 text-[11px] font-semibold px-2.5 py-1 rounded-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Service Details */}
                <p className="text-xs text-slate-600 font-normal leading-relaxed">
                  {item.description}
                </p>

                {/* Proximity / Distance */}
                <div className="flex items-start gap-1.5 text-xs text-slate-500">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>{item.proximity}</span>
                </div>

                {/* Feature Chips */}
                {item.features.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {item.features.map((feat, fIdx) => (
                      <span
                        key={fIdx}
                        className="bg-slate-100 text-slate-600 text-[11px] font-medium px-2 py-0.5 rounded"
                      >
                        {feat}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Card Footer: Pricing & Actions */}
            <div className="p-5 pt-0 space-y-3">
              {/* Pricing */}
              <div className="text-sm">
                <span className="font-extrabold text-[#16A34A] text-lg">{item.price}</span>
                <span className="text-xs font-semibold text-slate-600">{item.pricePeriod}</span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-4">
                <button className="border border-emerald-600 text-emerald-700 hover:bg-emerald-50 font-semibold px-4 py-1.5 rounded-xl text-xs transition-colors">
                  Recommend
                </button>
                <button className="text-xs font-semibold text-[#1E3A8A] hover:underline">
                  Edit
                </button>
                <button className="text-xs font-semibold text-red-600 hover:underline">
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}