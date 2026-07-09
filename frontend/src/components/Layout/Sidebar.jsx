import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext';
import {
  LayoutDashboard, Building2, GitBranch, Stethoscope, Users, CalendarDays,
  ClipboardList, BedDouble, Pill, FlaskConical, FileText, CreditCard,
  ChevronDown, ChevronRight, LogOut, Activity, HeartPulse, Shield, Menu, X
} from 'lucide-react';

const menuItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  {
    label: 'Hospital', icon: Building2, children: [
      { label: 'Hospitals', path: '/hospitals' },
      { label: 'Branches', path: '/branches' },
      { label: 'Departments', path: '/departments' },
    ]
  },
  {
    label: 'Clinical', icon: Stethoscope, children: [
      { label: 'Doctors', path: '/doctors' },
      { label: 'Nurses', path: '/nurses' },
      { label: 'Patients', path: '/patients' },
    ]
  },
  { label: 'Appointments', icon: CalendarDays, path: '/appointments' },
  {
    label: 'OPD & IPD', icon: ClipboardList, children: [
      { label: 'OPD', path: '/opd' },
      { label: 'IPD', path: '/ipd' },
    ]
  },
  {
    label: 'Wards & Beds', icon: BedDouble, children: [
      { label: 'Wards', path: '/wards' },
      { label: 'Beds', path: '/beds' },
    ]
  },
  { label: 'Laboratory', icon: FlaskConical, path: '/laboratory' },
  { label: 'Pharmacy', icon: Pill, path: '/pharmacy' },
  { label: 'Billing', icon: CreditCard, path: '/billing' },
  { label: 'Reports', icon: FileText, path: '/reports' },
];

function SidebarItem({ item, collapsed }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  if (item.children) {
    const isActive = item.children.some(c => location.pathname.startsWith(c.path));
    return (
      <div>
        <button
          onClick={() => setOpen(!open)}
          className={`sidebar-item group ${isActive ? 'sidebar-item-active' : ''}`}
        >
          <item.icon size={18} className="flex-shrink-0" />
          {!collapsed && (
            <>
              <span className="flex-1 text-left">{item.label}</span>
              {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </>
          )}
        </button>
        {!collapsed && open && (
          <div className="ml-4 mt-1 space-y-0.5 border-l border-slate-700 pl-3">
            {item.children.map(child => (
              <NavLink
                key={child.path}
                to={child.path}
                className={({ isActive }) =>
                  `block px-3 py-1.5 rounded-lg text-sm transition-colors ${isActive
                    ? 'text-cyan-400 bg-cyan-400/10 font-medium'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                {child.label}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <NavLink
      to={item.path}
      className={({ isActive }) =>
        `sidebar-item ${isActive ? 'sidebar-item-active' : ''}`
      }
    >
      <item.icon size={18} className="flex-shrink-0" />
      {!collapsed && <span>{item.label}</span>}
    </NavLink>
  );
}

export default function Sidebar({ collapsed, onToggle }) {
  const { user, logout } = useAuth();

  return (
    <aside className={`sidebar ${collapsed ? 'sidebar-collapsed' : 'sidebar-expanded'}`}>
      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-slate-700/50">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
              <HeartPulse size={16} className="text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-tight">HMS</p>
              <p className="text-slate-400 text-xs">Hospital System</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center mx-auto">
            <HeartPulse size={16} className="text-white" />
          </div>
        )}
        <button onClick={onToggle} className="text-slate-400 hover:text-white transition-colors ml-auto">
          {collapsed ? <Menu size={16} /> : <X size={16} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-0.5 scrollbar-hide">
        {menuItems.map((item) => (
          <SidebarItem key={item.label} item={item} collapsed={collapsed} />
        ))}
      </nav>

      {/* User */}
      <div className="border-t border-slate-700/50 p-3">
        {!collapsed ? (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {user?.fullName?.[0] || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-medium truncate">{user?.fullName || 'Admin'}</p>
              <p className="text-slate-400 text-xs truncate">{user?.role || 'SuperAdmin'}</p>
            </div>
            <button onClick={logout} className="text-slate-400 hover:text-red-400 transition-colors flex-shrink-0" title="Logout">
              <LogOut size={15} />
            </button>
          </div>
        ) : (
          <button onClick={logout} className="w-full flex justify-center text-slate-400 hover:text-red-400 transition-colors py-1" title="Logout">
            <LogOut size={16} />
          </button>
        )}
      </div>
    </aside>
  );
}
