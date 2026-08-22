'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  FileCheck, 
  CheckSquare, 
  MessageSquare, 
  Building2, 
  Bed, 
  LogOut 
} from 'lucide-react';

const sidebarNavItems = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
  { label: 'Patient Cases', icon: Users, href: '/admin/cases' },
  { label: 'Document Review', icon: FileCheck, href: '/admin/document-review' },
  { label: 'Tasks', icon: CheckSquare, href: '/admin/tasks' },
  { label: 'Messages', icon: MessageSquare, href: '/admin/messages' },
  { label: 'Partner Network', icon: Building2, href: '/admin/partner-network' },
  { label: 'Accommodation', icon: Bed, href: '/admin/accommodation-admin' },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-[#1D4ED8] text-white flex flex-col justify-between shrink-0 min-h-screen">
      <div>
        {/* Logo Header */}
        <div className="p-6 pb-2">
          <div className="w-12 h-12 rounded-full border-2 border-white/80 flex items-center justify-center font-bold text-lg text-white mb-6">
            HW
          </div>
          <span className="text-[10px] font-bold tracking-wider text-blue-200 uppercase block">
            STAFF PORTAL
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="mt-2 px-3 space-y-1">
          {sidebarNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-600/60 text-white font-semibold'
                    : 'text-blue-100 hover:bg-blue-600/30 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-blue-600/50">
        <button className="flex items-center gap-2 text-sm font-medium text-blue-100 hover:text-white w-full px-2 py-2 transition-colors">
          <LogOut className="w-4 h-4 text-blue-200" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}