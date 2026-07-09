import React, { useEffect, useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { opdApi, patientsApi, doctorsApi } from '../../services/api';
import { LoadingSpinner, Badge, Modal } from '../../components/UI';

const defaultForm = { chiefComplaint: '', diagnosis: '', prescription: '', labRequests: '', radiologyRequests: '', notes: '', consultationFee: 0, followUpDate: '', patientId: '', doctorId: '' };

export default function OpdList() {
  const [visits, setVisits] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(defaultForm);

  const load = () => {
    setLoading(true);
    Promise.all([opdApi.getAll({}), patientsApi.getAll(), doctorsApi.getAll()])
      .then(([v, p, d]) => { setVisits(v.data); setPatients(p.data); setDoctors(d.data); })
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const filtered = visits.filter(v => `${v.patientName} ${v.visitNumber} ${v.doctorName}`.toLowerCase().includes(search.toLowerCase()));

  const handleSubmit = async (e) => {
    e.preventDefault();
    await opdApi.create({ ...form, patientId: +form.patientId, doctorId: +form.doctorId, consultationFee: +form.consultationFee });
    setModal(false); load();
  };

  const inp = (field, type = 'text') => ({ type, value: form[field] ?? '', onChange: e => setForm(f => ({ ...f, [field]: e.target.value })) });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div><h1 className="page-title">OPD Management</h1><p className="text-slate-400 text-sm">{visits.length} outpatient visits</p></div>
        <button onClick={() => { setForm(defaultForm); setModal(true); }} className="btn-primary flex items-center gap-2"><Plus size={16} /> New OPD Visit</button>
      </div>
      <div className="card">
        <div className="flex items-center gap-2 bg-slate-800/60 rounded-lg px-3 py-2 border border-slate-700/50 mb-4 max-w-xs">
          <Search size={14} className="text-slate-400" />
          <input className="bg-transparent text-sm text-slate-300 placeholder:text-slate-500 outline-none flex-1" placeholder="Search visits..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        {loading ? <LoadingSpinner /> : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead><tr><th>Visit No</th><th>Patient</th><th>Doctor</th><th>Date</th><th>Complaint</th><th>Fee</th><th>Status</th></tr></thead>
              <tbody>
                {filtered.map(v => (
                  <tr key={v.id}>
                    <td><span className="font-mono text-cyan-400 text-xs">{v.visitNumber}</span></td>
                    <td><p className="text-white text-sm font-medium">{v.patientName}</p><p className="text-xs text-slate-500">{v.patientUHID}</p></td>
                    <td><span className="text-slate-300 text-sm">{v.doctorName}</span></td>
                    <td><span className="text-slate-300 text-sm">{new Date(v.visitDate).toLocaleDateString('en-IN')}</span></td>
                    <td><span className="text-slate-300 text-sm truncate max-w-32 block">{v.chiefComplaint || '—'}</span></td>
                    <td><span className="text-cyan-400 font-medium text-sm">₹{v.consultationFee}</span></td>
                    <td><Badge status={v.status} /></td>
                  </tr>
                ))}
                {!filtered.length && <tr><td colSpan={7} className="text-center text-slate-500 py-10">No OPD visits found</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={modal} title="New OPD Visit" onClose={() => setModal(false)}>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto pr-1">
          <div className="form-group"><label className="form-label">Patient</label>
            <select className="form-input" {...inp('patientId')} required>
              <option value="">Select patient</option>
              {patients.map(p => <option key={p.id} value={p.id}>{p.firstName} {p.lastName} ({p.uHID})</option>)}
            </select>
          </div>
          <div className="form-group"><label className="form-label">Doctor</label>
            <select className="form-input" {...inp('doctorId')} required>
              <option value="">Select doctor</option>
              {doctors.map(d => <option key={d.id} value={d.id}>Dr. {d.firstName} {d.lastName}</option>)}
            </select>
          </div>
          <div className="form-group"><label className="form-label">Consultation Fee</label><input type="number" className="form-input" {...inp('consultationFee','number')} /></div>
          <div className="form-group"><label className="form-label">Follow-up Date</label><input type="date" className="form-input" {...inp('followUpDate')} /></div>
          {[['chiefComplaint','Chief Complaint'],['diagnosis','Diagnosis'],['prescription','Prescription'],['labRequests','Lab Requests'],['radiologyRequests','Radiology Requests'],['notes','Notes']].map(([f,l]) => (
            <div key={f} className="md:col-span-2 form-group"><label className="form-label">{l}</label><textarea className="form-input h-16 resize-none" {...inp(f)} /></div>
          ))}
          <div className="md:col-span-2 flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModal(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Create Visit</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
