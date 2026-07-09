import React, { useEffect, useState } from 'react';
import { Plus, Search, LogOut } from 'lucide-react';
import { ipdApi, patientsApi, doctorsApi, bedsApi } from '../../services/api';
import { LoadingSpinner, Badge, Modal } from '../../components/UI';

const defaultForm = { admissionType: 'General', diagnosis: '', patientId: '', doctorId: '', bedId: '' };

export default function IpdList() {
  const [admissions, setAdmissions] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [availBeds, setAvailBeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(false);
  const [dischargeModal, setDischargeModal] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [dischargeSummary, setDischargeSummary] = useState('');

  const load = () => {
    setLoading(true);
    Promise.all([ipdApi.getAll({}), patientsApi.getAll(), doctorsApi.getAll(), bedsApi.getAll()])
      .then(([a, p, d, b]) => {
        setAdmissions(a.data); setPatients(p.data); setDoctors(d.data);
        setAvailBeds(b.data.filter(bed => bed.status === 'Available'));
      })
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const filtered = admissions.filter(a => `${a.patientName} ${a.admissionNumber} ${a.doctorName}`.toLowerCase().includes(search.toLowerCase()));

  const handleAdmit = async (e) => {
    e.preventDefault();
    await ipdApi.admit({ ...form, patientId: +form.patientId, doctorId: +form.doctorId, bedId: form.bedId ? +form.bedId : null });
    setModal(false); load();
  };

  const handleDischarge = async () => {
    await ipdApi.discharge(dischargeModal, { summary: dischargeSummary });
    setDischargeModal(null); load();
  };

  const inp = (field) => ({ value: form[field] ?? '', onChange: e => setForm(f => ({ ...f, [field]: e.target.value })) });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div><h1 className="page-title">IPD Management</h1><p className="text-slate-400 text-sm">{admissions.filter(a => a.status === 'Admitted').length} currently admitted</p></div>
        <button onClick={() => { setForm(defaultForm); setModal(true); }} className="btn-primary flex items-center gap-2"><Plus size={16} /> Admit Patient</button>
      </div>
      <div className="card">
        <div className="flex items-center gap-2 bg-slate-800/60 rounded-lg px-3 py-2 border border-slate-700/50 mb-4 max-w-xs">
          <Search size={14} className="text-slate-400" />
          <input className="bg-transparent text-sm text-slate-300 placeholder:text-slate-500 outline-none flex-1" placeholder="Search admissions..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        {loading ? <LoadingSpinner /> : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead><tr><th>Admission No</th><th>Patient</th><th>Doctor</th><th>Bed/Ward</th><th>Date</th><th>Type</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {filtered.map(a => (
                  <tr key={a.id}>
                    <td><span className="font-mono text-cyan-400 text-xs">{a.admissionNumber}</span></td>
                    <td><p className="text-white text-sm font-medium">{a.patientName}</p><p className="text-xs text-slate-500">{a.patientUHID}</p></td>
                    <td><span className="text-slate-300 text-sm">{a.doctorName}</span></td>
                    <td><p className="text-white text-sm">{a.bedNumber || '—'}</p><p className="text-xs text-slate-500">{a.wardName}</p></td>
                    <td><span className="text-slate-300 text-sm">{new Date(a.admissionDate).toLocaleDateString('en-IN')}</span></td>
                    <td><span className="text-slate-300 text-sm">{a.admissionType}</span></td>
                    <td><Badge status={a.status} /></td>
                    <td>{a.status === 'Admitted' && (
                      <button onClick={() => { setDischargeModal(a.id); setDischargeSummary(''); }} className="btn-xs-amber flex items-center gap-1"><LogOut size={11} /> Discharge</button>
                    )}</td>
                  </tr>
                ))}
                {!filtered.length && <tr><td colSpan={8} className="text-center text-slate-500 py-10">No admissions found</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={modal} title="Admit Patient" onClose={() => setModal(false)}>
        <form onSubmit={handleAdmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group"><label className="form-label">Patient</label>
              <select className="form-input" {...inp('patientId')} required>
                <option value="">Select patient</option>
                {patients.map(p => <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>)}
              </select>
            </div>
            <div className="form-group"><label className="form-label">Doctor</label>
              <select className="form-input" {...inp('doctorId')} required>
                <option value="">Select doctor</option>
                {doctors.map(d => <option key={d.id} value={d.id}>Dr. {d.firstName} {d.lastName}</option>)}
              </select>
            </div>
            <div className="form-group"><label className="form-label">Bed</label>
              <select className="form-input" {...inp('bedId')}>
                <option value="">No bed assigned</option>
                {availBeds.map(b => <option key={b.id} value={b.id}>{b.bedNumber} — {b.wardName}</option>)}
              </select>
            </div>
            <div className="form-group"><label className="form-label">Admission Type</label>
              <select className="form-input" {...inp('admissionType')}>
                {['General','Emergency','Surgery','Maternity'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div className="form-group"><label className="form-label">Diagnosis</label><textarea className="form-input h-20 resize-none" {...inp('diagnosis')} /></div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModal(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Admit Patient</button>
          </div>
        </form>
      </Modal>

      <Modal open={!!dischargeModal} title="Discharge Patient" onClose={() => setDischargeModal(null)}>
        <div className="space-y-4">
          <div className="form-group"><label className="form-label">Discharge Summary</label><textarea className="form-input h-32 resize-none" value={dischargeSummary} onChange={e => setDischargeSummary(e.target.value)} /></div>
          <div className="flex justify-end gap-3"><button onClick={() => setDischargeModal(null)} className="btn-secondary">Cancel</button><button onClick={handleDischarge} className="btn-primary">Confirm Discharge</button></div>
        </div>
      </Modal>
    </div>
  );
}
