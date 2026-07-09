import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Building2, Search } from 'lucide-react';
import { hospitalsApi } from '../../services/api';
import { LoadingSpinner, Badge, Modal, ConfirmDialog } from '../../components/UI';

const defaultForm = {
  name: '', registrationNumber: '', licenseNumber: '', gstNumber: '', panNumber: '',
  email: '', phone: '', website: '', address: '', country: 'India', state: '', city: '',
  postalCode: '', timeZone: 'Asia/Kolkata', currency: 'INR', hospitalType: 'Multi-Specialty',
  workingHours: '24x7', emergencyContact: '', bankDetails: '', logoUrl: ''
};

export default function HospitalList() {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [editing, setEditing] = useState(null);
  const [confirm, setConfirm] = useState(null);

  const load = () => { setLoading(true); hospitalsApi.getAll().then(r => setHospitals(r.data)).finally(() => setLoading(false)); };
  useEffect(load, []);

  const filtered = hospitals.filter(h =>
    h.name.toLowerCase().includes(search.toLowerCase()) ||
    h.city?.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => { setForm(defaultForm); setEditing(null); setModal(true); };
  const openEdit = (h) => {
    setForm({ name: h.name, registrationNumber: h.registrationNumber, licenseNumber: h.licenseNumber,
      gstNumber: h.gstNumber, panNumber: h.panNumber, email: h.email, phone: h.phone,
      website: h.website, address: h.address, country: h.country, state: h.state, city: h.city,
      postalCode: h.postalCode, timeZone: h.timeZone, currency: h.currency,
      hospitalType: h.hospitalType, workingHours: h.workingHours, emergencyContact: h.emergencyContact,
      bankDetails: h.bankDetails || '', logoUrl: h.logoUrl || '' });
    setEditing(h.id); setModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editing) await hospitalsApi.update(editing, form);
    else await hospitalsApi.create(form);
    setModal(false); load();
  };

  const handleDelete = async (id) => {
    await hospitalsApi.delete(id);
    setConfirm(null); load();
  };

  const inp = (field) => ({
    value: form[field],
    onChange: e => setForm(f => ({ ...f, [field]: e.target.value }))
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Hospitals</h1>
          <p className="text-slate-400 text-sm">{hospitals.length} registered hospitals</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Add Hospital
        </button>
      </div>

      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center gap-2 bg-slate-800/60 rounded-lg px-3 py-2 border border-slate-700/50 flex-1 max-w-xs">
            <Search size={14} className="text-slate-400" />
            <input className="bg-transparent text-sm text-slate-300 placeholder:text-slate-500 outline-none flex-1"
              placeholder="Search hospitals..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>

        {loading ? <LoadingSpinner /> : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Hospital Name</th><th>Type</th><th>City</th><th>Phone</th>
                  <th>Branches</th><th>Status</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(h => (
                  <tr key={h.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                          <Building2 size={14} className="text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-white text-sm">{h.name}</p>
                          <p className="text-xs text-slate-500">{h.registrationNumber}</p>
                        </div>
                      </div>
                    </td>
                    <td><span className="text-slate-300 text-sm">{h.hospitalType}</span></td>
                    <td><span className="text-slate-300 text-sm">{h.city}, {h.state}</span></td>
                    <td><span className="text-slate-300 text-sm">{h.phone}</span></td>
                    <td><span className="text-cyan-400 font-medium text-sm">{h.branchCount}</span></td>
                    <td><Badge status={h.isActive ? 'Active' : 'Inactive'} /></td>
                    <td>
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(h)} className="action-btn-edit"><Pencil size={13} /></button>
                        <button onClick={() => setConfirm(h.id)} className="action-btn-delete"><Trash2 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!filtered.length && (
                  <tr><td colSpan={7} className="text-center text-slate-500 py-10">No hospitals found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Form Modal */}
      <Modal open={modal} title={editing ? 'Edit Hospital' : 'Add Hospital'} onClose={() => setModal(false)}>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[['name','Hospital Name'],['registrationNumber','Registration Number'],['licenseNumber','License Number'],
            ['gstNumber','GST Number'],['panNumber','PAN Number'],['email','Email'],
            ['phone','Phone'],['website','Website'],['address','Address'],['country','Country'],
            ['state','State'],['city','City'],['postalCode','Postal Code'],['workingHours','Working Hours'],
            ['emergencyContact','Emergency Contact']
          ].map(([field, label]) => (
            <div key={field} className="form-group">
              <label className="form-label">{label}</label>
              <input className="form-input" {...inp(field)} />
            </div>
          ))}
          <div className="form-group">
            <label className="form-label">Hospital Type</label>
            <select className="form-input" {...inp('hospitalType')}>
              {['Multi-Specialty','Single-Specialty','General','Clinic','Nursing Home','Diagnostic Center'].map(t => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2 flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModal(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">{editing ? 'Update' : 'Create'} Hospital</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog open={!!confirm} message="Are you sure you want to deactivate this hospital?"
        onConfirm={() => handleDelete(confirm)} onCancel={() => setConfirm(null)} />
    </div>
  );
}
