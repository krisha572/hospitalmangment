import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const PatientForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    uhid: '', profilePhoto: '', firstName: '', lastName: '', gender: '',
    dateOfBirth: '', bloodGroup: '', contactNumber: '', email: '',
    address: '', aadhaar: '', passport: '', insurance: '',
    occupation: '', emergencyContact: '', allergies: '',
    medicalHistory: '', familyHistory: '', previousSurgery: '',
    currentMedicine: '', height: '', weight: '', bmi: '',
    smoking: false, alcohol: false, walletBalance: 0
  });

  useEffect(() => {
    if (isEdit) {
      fetchPatient();
    }
  }, [id]);

  const fetchPatient = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/patients/${id}`);
      if (response.data) {
        // format date for input field
        const patient = response.data;
        if (patient.dateOfBirth) {
            patient.dateOfBirth = patient.dateOfBirth.split('T')[0];
        }
        setFormData(patient);
      }
    } catch (error) {
      console.error('Error fetching patient:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await axios.put(`http://localhost:5000/api/patients/${id}`, formData);
      } else {
        await axios.post('http://localhost:5000/api/patients', formData);
      }
      navigate('/patients');
    } catch (error) {
      console.error('Error saving patient:', error);
      alert('Failed to save patient. Check if backend is running.');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-8 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">
        {isEdit ? 'Edit Patient' : 'Register New Patient'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Personal Details */}
        <div>
          <h3 className="text-lg font-semibold text-blue-600 mb-3">Personal Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">UHID</label>
              <input type="text" name="uhid" value={formData.uhid} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" placeholder="e.g. UHID-1001" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">First Name</label>
              <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Last Name</label>
              <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Gender</label>
              <select name="gender" value={formData.gender} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border">
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
              <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Blood Group</label>
              <input type="text" name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" placeholder="e.g. O+" />
            </div>
          </div>
        </div>

        {/* Contact Details */}
        <div>
          <h3 className="text-lg font-semibold text-blue-600 mb-3">Contact Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Contact Number</label>
              <input type="tel" name="contactNumber" value={formData.contactNumber} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <textarea name="address" value={formData.address} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" rows="2"></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Emergency Contact</label>
              <input type="text" name="emergencyContact" value={formData.emergencyContact} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" />
            </div>
          </div>
        </div>

        {/* Identification */}
        <div>
          <h3 className="text-lg font-semibold text-blue-600 mb-3">Identification</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Aadhaar</label>
              <input type="text" name="aadhaar" value={formData.aadhaar} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Passport</label>
              <input type="text" name="passport" value={formData.passport} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Insurance</label>
              <input type="text" name="insurance" value={formData.insurance} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" />
            </div>
          </div>
        </div>

        {/* Medical Information */}
        <div>
          <h3 className="text-lg font-semibold text-blue-600 mb-3">Medical Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Medical History</label>
              <textarea name="medicalHistory" value={formData.medicalHistory} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" rows="2"></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Allergies</label>
              <input type="text" name="allergies" value={formData.allergies} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Current Medicine</label>
              <input type="text" name="currentMedicine" value={formData.currentMedicine} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" />
            </div>
            <div className="md:col-span-2">
               <label className="block text-sm font-medium text-gray-700">Previous Surgery</label>
               <input type="text" name="previousSurgery" value={formData.previousSurgery} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" />
            </div>
            <div className="flex gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Height (cm)</label>
                <input type="number" name="height" value={formData.height} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Weight (kg)</label>
                <input type="number" name="weight" value={formData.weight} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" />
              </div>
            </div>
            <div className="flex gap-4 items-end">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <input type="checkbox" name="smoking" checked={formData.smoking} onChange={handleChange} className="rounded border-gray-300 text-blue-600 shadow-sm" />
                Smoker
              </label>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <input type="checkbox" name="alcohol" checked={formData.alcohol} onChange={handleChange} className="rounded border-gray-300 text-blue-600 shadow-sm" />
                Alcohol Consumer
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 border-t pt-6 mt-6">
          <button type="button" onClick={() => navigate('/patients')} className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition">
            Cancel
          </button>
          <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
            {isEdit ? 'Update Patient' : 'Register Patient'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PatientForm;
