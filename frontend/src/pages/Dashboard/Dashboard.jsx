import React, { useEffect, useState } from 'react';
import { dashboardApi } from '../../services/api';
import {
  Users, Stethoscope, CalendarDays, BedDouble, CreditCard,
  TrendingUp, Activity, AlertCircle, ClipboardList, HeartPulse
} from 'lucide-react';

function StatCard({ label, value, icon: Icon, color, sub }) {
  return (
    <div className="stat-card">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">{label}</p>
          <p className="text-3xl font-bold text-white">{value ?? '—'}</p>
          {sub && <p className="text-xs text-slate-500 mt-1">{sub}</p>}
        </div>
        <div className={`stat-icon ${color}`}>
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}

function BedBar({ ward }) {
  const pct = ward.total > 0 ? Math.round((ward.occupied / ward.total) * 100) : 0;
  const color = pct > 80 ? 'bg-red-500' : pct > 60 ? 'bg-amber-500' : 'bg-emerald-500';
  return (
    <div className="mb-3">
      <div className="flex justify-between text-xs mb-1">
        <span className="text-slate-300">{ward.wardName}</span>
        <span className="text-slate-400">{ward.occupied}/{ward.total}</span>
      </div>
      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardApi.get()
      .then(r => setData(r.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="flex items-center gap-3 text-slate-400">
        <HeartPulse size={24} className="animate-pulse text-cyan-400" />
        <span>Loading dashboard...</span>
      </div>
    </div>
  );

  const stats = [
    { label: 'Total Patients', value: data?.totalPatients, icon: Users, color: 'stat-icon-blue', sub: 'Registered patients' },
    { label: 'Active Doctors', value: data?.totalDoctors, icon: Stethoscope, color: 'stat-icon-green', sub: 'On duty today' },
    { label: "Today's Appointments", value: data?.todayAppointments, icon: CalendarDays, color: 'stat-icon-purple', sub: 'Scheduled' },
    { label: 'OPD Visits Today', value: data?.opdVisitsToday, icon: ClipboardList, color: 'stat-icon-cyan', sub: 'Outpatients' },
    { label: 'IPD Admissions', value: data?.todayAdmissions, icon: Activity, color: 'stat-icon-amber', sub: 'Today' },
    { label: 'Discharges Today', value: data?.todayDischarges, icon: AlertCircle, color: 'stat-icon-red', sub: 'Discharged' },
    { label: 'Available Beds', value: data?.availableBeds, icon: BedDouble, color: 'stat-icon-green', sub: `of ${data?.totalBeds} total` },
    { label: 'Today Revenue', value: data?.todayRevenue != null ? `₹${data.todayRevenue.toLocaleString()}` : null, icon: CreditCard, color: 'stat-icon-blue', sub: 'Collected' },
    { label: 'Monthly Revenue', value: data?.monthlyRevenue != null ? `₹${data.monthlyRevenue.toLocaleString()}` : null, icon: TrendingUp, color: 'stat-icon-purple', sub: 'This month' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Dashboard</h1>
        <p className="text-slate-400 text-sm">Welcome back — here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {stats.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Appointments */}
        <div className="card">
          <h2 className="card-title mb-4">Today's Appointments</h2>
          {data?.recentAppointments?.length ? (
            <div className="space-y-2">
              {data.recentAppointments.map((a, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-slate-700/50 last:border-0">
                  <div>
                    <p className="text-sm text-white font-medium">{a.patientName}</p>
                    <p className="text-xs text-slate-400">{a.doctorName} · {a.timeSlot}</p>
                  </div>
                  <span className={`badge ${a.status === 'Completed' ? 'badge-green' : a.status === 'Cancelled' ? 'badge-red' : 'badge-blue'}`}>
                    {a.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 text-sm text-center py-6">No appointments today</p>
          )}
        </div>

        {/* Bed Occupancy */}
        <div className="card">
          <h2 className="card-title mb-4">Bed Occupancy</h2>
          {data?.bedOccupancy?.length ? (
            data.bedOccupancy.map((w, i) => <BedBar key={i} ward={w} />)
          ) : (
            <p className="text-slate-500 text-sm text-center py-6">No ward data available</p>
          )}
        </div>
      </div>
    </div>
  );
}
