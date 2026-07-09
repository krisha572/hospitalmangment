import React from 'react';
import { Bell, Search, ChevronRight, Home } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext';

const routeLabels = {
  '/dashboard': 'Dashboard',
  '/hospitals': 'Hospitals',
  '/branches': 'Branches',
  '/departments': 'Departments',
  '/doctors': 'Doctors',
  '/nurses': 'Nurses',
  '/patients': 'Patients',
  '/appointments': 'Appointments',
  '/opd': 'OPD Management',
  '/ipd': 'IPD Management',
  '/wards': 'Wards',
  '/beds': 'Beds',
  '/laboratory': 'Laboratory',
  '/pharmacy': 'Pharmacy',
  '/billing': 'Billing',
  '/reports': 'Reports',
};

export default function Navbar() {
  const { user } = useAuth();
  const location = useLocation();
  const label = routeLabels[location.pathname] || 'Page';

  return (
    <header className="navbar">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <Home size={14} className="text-slate-400" />
        <ChevronRight size={12} className="text-slate-500" />
        <span className="text-white font-medium">{label}</span>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 bg-slate-800/60 rounded-lg px-3 py-1.5 border border-slate-700/50">
          <Search size={14} className="text-slate-400" />
          <input
            type="text"
            placeholder="Quick search..."
            className="bg-transparent text-sm text-slate-300 placeholder:text-slate-500 outline-none w-40"
          />
        </div>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-slate-800 transition-colors text-slate-400 hover:text-white">
          <Bell size={18} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
        </button>

        {/* User badge */}
        <div className="flex items-center gap-2 bg-slate-800/60 rounded-lg px-3 py-1.5 border border-slate-700/50">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
            {user?.fullName?.[0] || 'A'}
          </div>
          <span className="text-sm text-slate-300 hidden md:block">{user?.fullName || 'Admin'}</span>
        </div>
      </div>
    </header>
  );
}
