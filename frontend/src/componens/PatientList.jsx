import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Plus, Edit, Trash2, Eye } from 'lucide-react';
import axios from 'axios';

const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fallback data for demonstration if backend isn't ready
  const fallbackPatients = [
    { id: 1, firstName: 'John', lastName: 'Doe', uhid: 'UHID-1001', gender: 'Male', contactNumber: '1234567890' },
    { id: 2, firstName: 'Jane', lastName: 'Smith', uhid: 'UHID-1002', gender: 'Female', contactNumber: '0987654321' }
  ];

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      // Trying to fetch from the actual API endpoint
      const response = await axios.get('http://localhost:5000/api/patients'); // Replace with actual API URL
      if (response.data && response.data.length > 0) {
          setPatients(response.data);
      } else {
          setPatients(fallbackPatients);
      }
    } catch (error) {
      console.error('Error fetching patients:', error);
      // Fallback
      setPatients(fallbackPatients);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      try {
        await axios.delete(`http://localhost:5000/api/patients/${id}`);
        setPatients(patients.filter(p => p.id !== id));
      } catch (error) {
        console.error('Error deleting patient:', error);
        alert('Failed to delete patient. Ensure API is running.');
      }
    }
  };

  if (loading) return <div className="text-center p-8">Loading...</div>;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2 text-gray-800">
          <Users className="text-blue-500" /> Patient Management
        </h1>
        <Link 
          to="/patients/new" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
        >
          <Plus size={20} /> Register Patient
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="p-4 font-semibold text-gray-600">UHID</th>
              <th className="p-4 font-semibold text-gray-600">Patient Name</th>
              <th className="p-4 font-semibold text-gray-600">Gender</th>
              <th className="p-4 font-semibold text-gray-600">Contact</th>
              <th className="p-4 font-semibold text-gray-600 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.length > 0 ? patients.map((patient) => (
              <tr key={patient.id} className="border-b hover:bg-gray-50 transition">
                <td className="p-4 text-gray-800 font-medium">{patient.uhid || `UHID-${patient.id}`}</td>
                <td className="p-4 text-gray-800">{patient.firstName} {patient.lastName}</td>
                <td className="p-4 text-gray-600">{patient.gender || 'N/A'}</td>
                <td className="p-4 text-gray-600">{patient.contactNumber}</td>
                <td className="p-4 flex justify-center gap-3">
                  <Link 
                    to={`/patients/${patient.id}`}
                    className="text-indigo-500 hover:text-indigo-700 transition"
                    title="View Details"
                  >
                    <Eye size={20} />
                  </Link>
                  <Link 
                    to={`/patients/edit/${patient.id}`}
                    className="text-blue-500 hover:text-blue-700 transition"
                    title="Edit Patient"
                  >
                    <Edit size={20} />
                  </Link>
                  <button 
                    onClick={() => handleDelete(patient.id)}
                    className="text-red-500 hover:text-red-700 transition"
                    title="Delete Patient"
                  >
                    <Trash2 size={20} />
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="5" className="p-8 text-center text-gray-500">
                  No patients found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PatientList;
