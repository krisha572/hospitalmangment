import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './store/AuthContext';
import Layout from './components/Layout/Layout';

// Pages
import Login from './pages/Auth/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import HospitalList from './pages/Hospitals/HospitalList';
import DepartmentList from './pages/Departments/DepartmentList';
import DoctorList from './pages/Doctors/DoctorList';
import PatientList from './componens/PatientList';
import AppointmentList from './pages/Appointments/AppointmentList';
import WardList from './pages/Wards/WardList';
import OpdList from './pages/OPD/OpdList';
import IpdList from './pages/IPD/IpdList';
import BillingList from './pages/Billing/BillingList';

// Placeholder for future modules
const Placeholder = ({ name }) => (
  <div className="flex items-center justify-center h-64">
    <div className="text-center">
      <div className="text-4xl mb-4">🚧</div>
      <h2 className="text-xl font-semibold text-white mb-2">{name}</h2>
      <p className="text-slate-400 text-sm">Coming in Phase 2</p>
    </div>
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />

          {/* Protected — Layout wrapper */}
          <Route element={<Layout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/hospitals" element={<HospitalList />} />
            <Route path="/branches" element={<Placeholder name="Branch Management" />} />
            <Route path="/departments" element={<DepartmentList />} />
            <Route path="/doctors" element={<DoctorList />} />
            <Route path="/nurses" element={<Placeholder name="Nurse Management" />} />
            <Route path="/patients" element={<PatientList />} />
            <Route path="/patients/new" element={<Placeholder name="New Patient" />} />
            <Route path="/patients/:id" element={<Placeholder name="Patient Details" />} />
            <Route path="/appointments" element={<AppointmentList />} />
            <Route path="/wards" element={<WardList />} />
            <Route path="/beds" element={<WardList />} />
            <Route path="/opd" element={<OpdList />} />
            <Route path="/ipd" element={<IpdList />} />
            <Route path="/billing" element={<BillingList />} />
            <Route path="/laboratory" element={<Placeholder name="Laboratory Management" />} />
            <Route path="/pharmacy" element={<Placeholder name="Pharmacy Management" />} />
            <Route path="/reports" element={<Placeholder name="Reports & Analytics" />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}