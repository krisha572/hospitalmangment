import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Search, Stethoscope } from 'lucide-react';
import { doctorsApi, departmentsApi } from '../../services/api';
import { LoadingSpinner, Badge, Modal, ConfirmDialog } from '../../components/UI';

const defaultForm = {
  doctorCode: '', firstName: '', lastName: '', gender: 'Male', dateOfBirth: '',
  contactNumber: '', email: '', address: '', qualification: '', experience: 0,
  specialization: '', medicalRegistrationNumber: '', licenseNumber: '',
  consultationFee: 0, emergencyFee: 0, workingDays: 'Mon-Sat',
  workingHours: '09:00-17:00', languages: 'English', biography: '',
  profilePhoto: '', departmentId: null
};

export default function DoctorList() {
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [editing, setEditing] = useState(null);
  const [confirm, setConfirm] = useState(null);

  const load = () => {
    setLoading(true);
    Promise.all([doctorsApi.getAll(), departmentsApi.getAll()])
      .then(([d, depts]) => { setDoctors(d.data); setDepartments(depts.data); })
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const filtered = doctors.filter(d =>
    `${d.firstName} ${d.lastName} ${d.specialization}`.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => { setForm(defaultForm); setEditing(null); setModal(true); };
  const openEdit = (d) => {
    setForm({
      doctorCode: d.doctorCode, firstName: d.firstName, lastName: d.lastName,
      gender: d.gender, dateOfBirth: d.dateOfBirth ? d.dateOfBirth.split('T')[0] : '',
      contactNumber: d.contactNumber, email: d.email, address: d.address || '',
      qualification: d.qualification, experience: d.experience,
      specialization: d.specialization, medicalRegistrationNumber: d.medicalRegistrationNumber,
      licenseNumber: d.licenseNumber || '', consultationFee: d.consultationFee,
      emergencyFee: d.emergencyFee, workingDays: d.workingDays, workingHours: d.workingHours,
      languages: d.languages, biography: d.biography, profilePhoto: d.profilePhoto,
      departmentId: d.departmentId
    });
    setEditing(d.id); setModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, experience: +form.experience, consultationFee: +form.consultationFee, emergencyFee: +form.emergencyFee };
    if (editing) await doctorsApi.update(editing, payload);
    else await doctorsApi.create(payload);
    setModal(false); load();
  };

  const handleDelete = async (id) => {
    await doctorsApi.delete(id);
    setConfirm(null); load();
  };

  const inp = (field, type = 'text') => ({
    type, value: form[field] ?? '',
    onChange: e => setForm(f => ({ ...f, [field]: e.target.value }))
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Doctors</h1>
          <p className="text-slate-400 text-sm">{doctors.length} registered doctors</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Add Doctor
        </button>
      </div>

      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center gap-2 bg-slate-800/60 rounded-lg px-3 py-2 border border-slate-700/50 flex-1 max-w-xs">
            <Search size={14} className="text-slate-400" />
            <input className="bg-transparent text-sm text-slate-300 placeholder:text-slate-500 outline-none flex-1"
              placeholder="Search doctors..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>

        {loading ? <LoadingSpinner /> : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Doctor</th><th>Specialization</th><th>Department</th>
                  <th>Contact</th><th>Consult Fee</th><th>Status</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(d => (
                  <tr key={d.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">
                          {d.firstName?.[0]}{d.lastName?.[0]}
                        </div>
                        <div>
                          <p className="font-medium text-white text-sm">Dr. {d.firstName} {d.lastName}</p>
                          <p className="text-xs text-slate-500">{d.doctorCode} · {d.qualification}</p>
                        </div>
                      </div>
                    </td>
                    <td><span className="text-slate-300 text-sm">{d.specialization}</span></td>
                    <td><span className="text-slate-300 text-sm">{d.departmentName || '—'}</span></td>
                    <td><span className="text-slate-300 text-sm">{d.contactNumber}</span></td>
                    <td><span className="text-cyan-400 font-medium text-sm">₹{d.consultationFee}</span></td>
                    <td><Badge status={d.isActive ? 'Active' : 'Inactive'} /></td>
                    <td>
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(d)} className="action-btn-edit"><Pencil size={13} /></button>
                        <button onClick={() => setConfirm(d.id)} className="action-btn-delete"><Trash2 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!filtered.length && (
                  <tr><td colSpan={7} className="text-center text-slate-500 py-10">No doctors found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={modal} title={editing ? 'Edit Doctor' : 'Add Doctor'} onClose={() => setModal(false)}>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto pr-1">
          {[['firstName','First Name'],['lastName','Last Name'],['contactNumber','Mobile'],['email','Email'],['address','Address'],
            ['qualification','Qualification'],['specialization','Specialization'],['medicalRegistrationNumber','Medical Reg No'],
            ['licenseNumber','License Number'],['workingDays','Working Days'],['workingHours','Working Hours'],['languages','Languages']
          ].map(([field, label]) => (
            <div key={field} className="form-group">
              <label className="form-label">{label}</label>
              <input className="form-input" {...inp(field)} />
            </div>
          ))}
          {[['experience','Experience (Years)','number'],['consultationFee','Consultation Fee','number'],['emergencyFee','Emergency Fee','number']].map(([field,label,type]) => (
            <div key={field} className="form-group">
              <label className="form-label">{label}</label>
              <input className="form-input" {...inp(field, type)} />
            </div>
          ))}
          <div className="form-group">
            <label className="form-label">Date of Birth</label>
            <input type="date" className="form-input" {...inp('dateOfBirth')} />
          </div>
          <div className="form-group">
            <label className="form-label">Gender</label>
            <select className="form-input" {...inp('gender')}>
              {['Male','Female','Other'].map(g => <option key={g}>{g}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Department</label>
            <select className="form-input" value={form.departmentId ?? ''}
              onChange={e => setForm(f => ({ ...f, departmentId: e.target.value ? +e.target.value : null }))}>
              <option value="">— None —</option>
              {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
          <div className="md:col-span-2 form-group">
            <label className="form-label">Biography</label>
            <textarea className="form-input h-20 resize-none" {...inp('biography')} />
          </div>
          <div className="md:col-span-2 flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModal(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">{editing ? 'Update' : 'Add'} Doctor</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog open={!!confirm} message="Deactivate this doctor?"
        onConfirm={() => handleDelete(confirm)} onCancel={() => setConfirm(null)} />
    </div>
  );
}
