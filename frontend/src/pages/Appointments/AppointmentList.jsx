import React, { useEffect, useState } from 'react';
import { Plus, Search, CalendarCheck, Clock } from 'lucide-react';
import { appointmentsApi, patientsApi, doctorsApi } from '../../services/api';
import { LoadingSpinner, Badge, Modal } from '../../components/UI';

const defaultForm = { appointmentDate: '', timeSlot: '', appointmentType: 'Walk-in', reason: '', patientId: '', doctorId: '' };

export default function AppointmentList() {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(defaultForm);

  const load = () => {
    setLoading(true);
    const params = {};
    if (dateFilter) params.date = dateFilter;
    Promise.all([appointmentsApi.getAll(params), patientsApi.getAll(), doctorsApi.getAll()])
      .then(([a, p, d]) => { setAppointments(a.data); setPatients(p.data); setDoctors(d.data); })
      .finally(() => setLoading(false));
  };
  useEffect(load, [dateFilter]);

  const filtered = appointments.filter(a =>
    `${a.patientName} ${a.doctorName} ${a.tokenNumber}`.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    await appointmentsApi.create({ ...form, patientId: +form.patientId, doctorId: +form.doctorId });
    setModal(false); load();
  };

  const updateStatus = async (id, status) => {
    await appointmentsApi.updateStatus(id, { status });
    load();
  };

  const inp = (field) => ({ value: form[field], onChange: e => setForm(f => ({ ...f, [field]: e.target.value })) });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Appointments</h1>
          <p className="text-slate-400 text-sm">{appointments.length} appointments</p>
        </div>
        <button onClick={() => { setForm(defaultForm); setModal(true); }} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Book Appointment
        </button>
      </div>

      <div className="card">
        <div className="flex flex-wrap gap-3 mb-4">
          <div className="flex items-center gap-2 bg-slate-800/60 rounded-lg px-3 py-2 border border-slate-700/50 flex-1 max-w-xs">
            <Search size={14} className="text-slate-400" />
            <input className="bg-transparent text-sm text-slate-300 placeholder:text-slate-500 outline-none flex-1"
              placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="flex items-center gap-2 bg-slate-800/60 rounded-lg px-3 py-2 border border-slate-700/50">
            <CalendarCheck size={14} className="text-slate-400" />
            <input type="date" className="bg-transparent text-sm text-slate-300 outline-none"
              value={dateFilter} onChange={e => setDateFilter(e.target.value)} />
          </div>
        </div>

        {loading ? <LoadingSpinner /> : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr><th>Token</th><th>Patient</th><th>Doctor</th><th>Date & Time</th><th>Type</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {filtered.map(a => (
                  <tr key={a.id}>
                    <td><span className="font-mono text-cyan-400 text-xs">{a.tokenNumber}</span></td>
                    <td>
                      <p className="text-white text-sm font-medium">{a.patientName}</p>
                      <p className="text-xs text-slate-500">{a.patientUHID}</p>
                    </td>
                    <td>
                      <p className="text-white text-sm">{a.doctorName}</p>
                      <p className="text-xs text-slate-500">{a.doctorSpecialization}</p>
                    </td>
                    <td>
                      <p className="text-white text-sm">{new Date(a.appointmentDate).toLocaleDateString('en-IN')}</p>
                      <p className="text-xs text-slate-500 flex items-center gap-1"><Clock size={10} />{a.timeSlot}</p>
                    </td>
                    <td><span className="text-slate-300 text-sm">{a.appointmentType}</span></td>
                    <td><Badge status={a.status} /></td>
                    <td>
                      <div className="flex items-center gap-1.5">
                        {a.status === 'Scheduled' && (
                          <>
                            <button onClick={() => updateStatus(a.id, 'Completed')} className="btn-xs-green">Done</button>
                            <button onClick={() => updateStatus(a.id, 'Cancelled')} className="btn-xs-red">Cancel</button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {!filtered.length && <tr><td colSpan={7} className="text-center text-slate-500 py-10">No appointments found</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={modal} title="Book Appointment" onClose={() => setModal(false)}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Patient</label>
              <select className="form-input" {...inp('patientId')} required>
                <option value="">Select patient</option>
                {patients.map(p => <option key={p.id} value={p.id}>{p.firstName} {p.lastName} ({p.uHID})</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Doctor</label>
              <select className="form-input" {...inp('doctorId')} required>
                <option value="">Select doctor</option>
                {doctors.map(d => <option key={d.id} value={d.id}>Dr. {d.firstName} {d.lastName} - {d.specialization}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Date</label>
              <input type="date" className="form-input" {...inp('appointmentDate')} required />
            </div>
            <div className="form-group">
              <label className="form-label">Time Slot</label>
              <input type="time" className="form-input" {...inp('timeSlot')} required />
            </div>
            <div className="form-group">
              <label className="form-label">Type</label>
              <select className="form-input" {...inp('appointmentType')}>
                {['Walk-in','Online','Video'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Reason</label>
              <input className="form-input" {...inp('reason')} />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModal(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Book Appointment</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
