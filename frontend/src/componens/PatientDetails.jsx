import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { ArrowLeft, Wallet, FileText, Activity, Shield, Upload } from 'lucide-react';
import axios from 'axios';

const PatientDetails = () => {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [activeTab, setActiveTab] = useState('timeline');
  const [loading, setLoading] = useState(true);

  // Fallback data
  const fallbackPatient = {
    id: 1, uhid: 'UHID-1001', firstName: 'John', lastName: 'Doe', gender: 'Male',
    dateOfBirth: '1990-01-01', bloodGroup: 'O+', contactNumber: '1234567890', email: 'john@example.com',
    address: '123 Main St, City', aadhaar: '1234-5678-9012', insurance: 'HealthCare Inc - #998877',
    allergies: 'Peanuts', medicalHistory: 'Hypertension', walletBalance: 1500.00
  };

  useEffect(() => {
    fetchPatient();
  }, [id]);

  const fetchPatient = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/patients/${id}`);
      if (response.data) {
        setPatient(response.data);
      } else {
        setPatient(fallbackPatient);
      }
    } catch (error) {
      console.error('Error fetching patient:', error);
      setPatient(fallbackPatient);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!patient) return <div className="p-8 text-center text-red-500">Patient not found</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header Profile Section */}
      <div className="bg-white rounded-lg shadow-md p-6 flex items-start justify-between">
        <div className="flex gap-6 items-center">
          <div className="w-24 h-24 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center text-3xl font-bold border-4 border-blue-50">
            {patient.firstName.charAt(0)}{patient.lastName.charAt(0)}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{patient.firstName} {patient.lastName}</h1>
            <p className="text-gray-500 text-lg font-medium">{patient.uhid || `UHID-${patient.id}`}</p>
            <div className="flex gap-4 mt-2 text-sm text-gray-600">
              <span className="bg-gray-100 px-3 py-1 rounded-full">{patient.gender}</span>
              <span className="bg-gray-100 px-3 py-1 rounded-full">Blood: {patient.bloodGroup || 'N/A'}</span>
              <span className="bg-gray-100 px-3 py-1 rounded-full">{patient.contactNumber}</span>
            </div>
          </div>
        </div>
        <div>
          <Link to="/patients" className="text-gray-500 hover:text-gray-700 flex items-center gap-2">
            <ArrowLeft size={20} /> Back to List
          </Link>
        </div>
      </div>

      {/* Main Content with Sidebar Tabs */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 bg-white rounded-lg shadow-md p-4 flex flex-col gap-2">
          <TabButton active={activeTab === 'timeline'} onClick={() => setActiveTab('timeline')} icon={<Activity size={18} />} text="Medical Timeline" />
          <TabButton active={activeTab === 'wallet'} onClick={() => setActiveTab('wallet')} icon={<Wallet size={18} />} text="Patient Wallet" />
          <TabButton active={activeTab === 'qr'} onClick={() => setActiveTab('qr')} icon={<Shield size={18} />} text="QR Code" />
          <TabButton active={activeTab === 'documents'} onClick={() => setActiveTab('documents')} icon={<Upload size={18} />} text="Documents" />
          <TabButton active={activeTab === 'consent'} onClick={() => setActiveTab('consent')} icon={<FileText size={18} />} text="Consent Form" />
        </div>

        {/* Tab Content */}
        <div className="flex-1 bg-white rounded-lg shadow-md p-6 min-h-[400px]">
          {activeTab === 'timeline' && <TimelineTab patient={patient} />}
          {activeTab === 'wallet' && <WalletTab patient={patient} />}
          {activeTab === 'qr' && <QRTab patient={patient} />}
          {activeTab === 'documents' && <DocumentsTab />}
          {activeTab === 'consent' && <ConsentTab patient={patient} />}
        </div>
      </div>
    </div>
  );
};

// --- Subcomponents for Tabs ---

const TabButton = ({ active, onClick, icon, text }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors w-full ${active ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}
  >
    {icon} {text}
  </button>
);

const TimelineTab = ({ patient }) => (
  <div>
    <h2 className="text-xl font-bold mb-4 border-b pb-2">Medical Timeline</h2>
    <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
      
      {/* Sample Timeline Item 1 */}
      <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
        <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-300 text-slate-500 group-[.is-active]:bg-blue-500 group-[.is-active]:text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
          <Activity size={18} />
        </div>
        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded border border-slate-200 shadow-sm bg-white">
          <div className="flex items-center justify-between space-x-2 mb-1">
            <div className="font-bold text-slate-900">Registration</div>
            <time className="text-xs text-blue-500 font-medium">Joined Today</time>
          </div>
          <div className="text-slate-500 text-sm">Patient registered in the system.</div>
        </div>
      </div>

      {/* Sample Timeline Item 2 */}
      {patient.medicalHistory && (
        <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
          <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-300 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
            <FileText size={18} />
          </div>
          <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded border border-slate-200 shadow-sm bg-white">
            <div className="flex items-center justify-between space-x-2 mb-1">
              <div className="font-bold text-slate-900">Medical History Noted</div>
            </div>
            <div className="text-slate-500 text-sm">{patient.medicalHistory}</div>
          </div>
        </div>
      )}
    </div>
  </div>
);

const WalletTab = ({ patient }) => (
  <div>
    <h2 className="text-xl font-bold mb-6 border-b pb-2">Patient Wallet</h2>
    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-8 text-white max-w-sm mx-auto shadow-lg relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-20">
        <Wallet size={80} />
      </div>
      <p className="text-blue-100 mb-1 font-medium">Current Balance</p>
      <h3 className="text-5xl font-bold mb-6">₹{patient.walletBalance?.toFixed(2) || '0.00'}</h3>
      
      <div className="flex gap-4">
        <button className="bg-white text-blue-700 px-4 py-2 rounded-lg font-semibold shadow hover:bg-gray-50 transition w-full">Add Funds</button>
      </div>
    </div>
  </div>
);

const QRTab = ({ patient }) => {
  const qrData = JSON.stringify({
    uhid: patient.uhid || `UHID-${patient.id}`,
    name: `${patient.firstName} ${patient.lastName}`,
    bloodGroup: patient.bloodGroup
  });

  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <h2 className="text-xl font-bold mb-2">Patient Digital Identity</h2>
      <p className="text-gray-500 mb-8 max-w-md">Scan this QR code to quickly access the patient's basic profile and check-in at hospital kiosks.</p>
      
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
        <QRCodeSVG value={qrData} size={200} level="H" includeMargin={true} />
      </div>
      
      <p className="mt-6 text-lg font-medium text-gray-800">{patient.uhid || `UHID-${patient.id}`}</p>
    </div>
  );
};

const DocumentsTab = () => (
  <div>
    <h2 className="text-xl font-bold mb-4 border-b pb-2">Upload Documents</h2>
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:bg-gray-50 transition cursor-pointer">
      <Upload size={48} className="mx-auto text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-1">Click or drag files to upload</h3>
      <p className="text-gray-500 mb-4">Supported formats: PDF, JPG, PNG (Max 5MB)</p>
      <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition">Browse Files</button>
    </div>
    
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-4">Uploaded Files</h3>
      <p className="text-gray-500 italic text-sm">No documents uploaded yet.</p>
    </div>
  </div>
);

const ConsentTab = ({ patient }) => (
  <div>
    <h2 className="text-xl font-bold mb-4 border-b pb-2">Standard Consent Form</h2>
    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-sm text-gray-700 space-y-4">
      <p>I, <strong>{patient.firstName} {patient.lastName}</strong> (UHID: {patient.uhid || `UHID-${patient.id}`}), hereby give my consent for medical evaluation, diagnosis, and treatment by the medical staff of this hospital.</p>
      <p>I understand that I have the right to be informed about my condition and the recommended medical or surgical procedures to be used, so that I may make an informed decision whether or not to undergo the procedure after knowing the risks and hazards involved.</p>
      <p>This consent will remain in effect until I choose to revoke it in writing.</p>
      
      <div className="mt-8 pt-8 border-t border-gray-300 flex justify-between items-end">
        <div>
          <div className="w-48 border-b-2 border-gray-400 mb-2"></div>
          <p className="font-medium">Patient Signature</p>
        </div>
        <div>
          <p>Date: <strong>{new Date().toLocaleDateString()}</strong></p>
        </div>
      </div>
      
      <div className="flex justify-end mt-6">
        <button className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 flex items-center gap-2">
          <FileText size={16} /> Print Consent Form
        </button>
      </div>
    </div>
  </div>
);

export default PatientDetails;
