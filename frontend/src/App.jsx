import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import UserPanel from './componens/Userpenal';
import PatientList from './componens/PatientList';
import PatientForm from './componens/PatientForm';
import PatientDetails from './componens/PatientDetails';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100 flex">
        {/* Simple Sidebar Navigation */}
        <nav className="w-64 bg-white shadow-md min-h-screen p-4">
          <h2 className="text-xl font-bold mb-6 text-blue-600">Hospital Admin</h2>
          <ul className="space-y-4">
            <li>
              <Link to="/" className="text-gray-700 hover:text-blue-500 font-medium">Dashboard</Link>
            </li>
            <li>
              <Link to="/patients" className="text-gray-700 hover:text-blue-500 font-medium">Patient Management</Link>
            </li>
          </ul>
        </nav>

        {/* Main Content Area */}
        <div className="flex-1 p-8 overflow-auto">
          <Routes>
            <Route path="/" element={<UserPanel />} />
            <Route path="/patients" element={<PatientList />} />
            <Route path="/patients/new" element={<PatientForm />} />
            <Route path="/patients/edit/:id" element={<PatientForm />} />
            <Route path="/patients/:id" element={<PatientDetails />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;