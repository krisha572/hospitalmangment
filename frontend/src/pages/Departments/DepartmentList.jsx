import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { departmentsApi } from '../../services/api';
import { LoadingSpinner, Badge, Modal, ConfirmDialog } from '../../components/UI';

const defaultForm = { name: '', description: '', headOfDepartment: '', branchId: null };

export default function DepartmentList() {
  const [depts, setDepts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [editing, setEditing] = useState(null);
  const [confirm, setConfirm] = useState(null);

  const load = () => { setLoading(true); departmentsApi.getAll().then(r => setDepts(r.data)).finally(() => setLoading(false)); };
  useEffect(load, []);

  const filtered = depts.filter(d => d.name.toLowerCase().includes(search.toLowerCase()));

  const openCreate = () => { setForm(defaultForm); setEditing(null); setModal(true); };
  const openEdit = (d) => { setForm({ name: d.name, description: d.description, headOfDepartment: d.headOfDepartment, branchId: d.branchId }); setEditing(d.id); setModal(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editing) await departmentsApi.update(editing, form);
    else await departmentsApi.create(form);
    setModal(false); load();
  };

  const inp = (field) => ({ value: form[field] ?? '', onChange: e => setForm(f => ({ ...f, [field]: e.target.value })) });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Departments</h1>
          <p className="text-slate-400 text-sm">{depts.length} departments</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2"><Plus size={16} /> Add Department</button>
      </div>
      <div className="card">
        <div className="flex items-center gap-2 bg-slate-800/60 rounded-lg px-3 py-2 border border-slate-700/50 mb-4 max-w-xs">
          <Search size={14} className="text-slate-400" />
          <input className="bg-transparent text-sm text-slate-300 placeholder:text-slate-500 outline-none flex-1"
            placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        {loading ? <LoadingSpinner /> : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map(d => (
              <div key={d.id} className="dept-card">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                    {d.name[0]}
                  </div>
                  <div className="flex gap-1.5">
                    <button onClick={() => openEdit(d)} className="action-btn-edit"><Pencil size={13} /></button>
                    <button onClick={() => setConfirm(d.id)} className="action-btn-delete"><Trash2 size={13} /></button>
                  </div>
                </div>
                <h3 className="text-white font-semibold text-sm mb-1">{d.name}</h3>
                <p className="text-slate-500 text-xs mb-2 line-clamp-2">{d.description || 'No description'}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">HoD: {d.headOfDepartment || '—'}</span>
                  <span className="text-xs text-cyan-400">{d.doctorCount} doctors</span>
                </div>
              </div>
            ))}
            {!filtered.length && <p className="text-slate-500 text-sm col-span-3 text-center py-10">No departments found</p>}
          </div>
        )}
      </div>

      <Modal open={modal} title={editing ? 'Edit Department' : 'Add Department'} onClose={() => setModal(false)}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {[['name','Department Name'],['headOfDepartment','Head of Department']].map(([field,label]) => (
            <div key={field} className="form-group"><label className="form-label">{label}</label><input className="form-input" {...inp(field)} required={field === 'name'} /></div>
          ))}
          <div className="form-group"><label className="form-label">Description</label><textarea className="form-input h-24 resize-none" {...inp('description')} /></div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModal(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">{editing ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </Modal>
      <ConfirmDialog open={!!confirm} message="Deactivate this department?" onConfirm={() => { departmentsApi.delete(confirm).then(() => { setConfirm(null); load(); }); }} onCancel={() => setConfirm(null)} />
    </div>
  );
}
