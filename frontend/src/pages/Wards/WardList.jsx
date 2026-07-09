import React, { useEffect, useState } from 'react';
import { Plus, Search, BedDouble } from 'lucide-react';
import { wardsApi, bedsApi } from '../../services/api';
import { LoadingSpinner, Badge, Modal } from '../../components/UI';

export default function WardList() {
  const [wards, setWards] = useState([]);
  const [beds, setBeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [selectedWard, setSelectedWard] = useState(null);
  const [form, setForm] = useState({ name: '', wardType: 'General', totalBeds: 10, chargePerDay: 500, description: '' });

  const load = () => {
    setLoading(true);
    Promise.all([wardsApi.getAll(), bedsApi.getAll()])
      .then(([w, b]) => { setWards(w.data); setBeds(b.data); })
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await wardsApi.create({ ...form, totalBeds: +form.totalBeds, chargePerDay: +form.chargePerDay });
    setModal(false); load();
  };

  const toggleBedStatus = async (bed) => {
    const next = bed.status === 'Available' ? 'Cleaning' : 'Available';
    await bedsApi.updateStatus(bed.id, { status: next });
    load();
  };

  const wardBeds = beds.filter(b => !selectedWard || b.wardId === selectedWard);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="page-title">Wards & Beds</h1>
        <button onClick={() => setModal(true)} className="btn-primary flex items-center gap-2"><Plus size={16} /> Add Ward</button>
      </div>

      {/* Ward Cards */}
      {loading ? <LoadingSpinner /> : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {wards.map(w => {
            const pct = w.totalBeds > 0 ? Math.round((w.occupiedBeds / w.totalBeds) * 100) : 0;
            const color = pct > 80 ? 'from-red-500 to-rose-600' : pct > 60 ? 'from-amber-500 to-orange-600' : 'from-emerald-500 to-teal-600';
            return (
              <div key={w.id} className={`ward-card cursor-pointer ${selectedWard === w.id ? 'ring-2 ring-cyan-500' : ''}`}
                onClick={() => setSelectedWard(v => v === w.id ? null : w.id)}>
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center`}>
                    <BedDouble size={18} className="text-white" />
                  </div>
                  <Badge status={w.isActive ? 'Active' : 'Inactive'} />
                </div>
                <h3 className="text-white font-semibold mb-0.5">{w.name}</h3>
                <p className="text-slate-400 text-xs mb-3">{w.wardType} · ₹{w.chargePerDay}/day</p>
                <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                  <span>{w.occupiedBeds} occupied</span>
                  <span>{w.availableBeds} free</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div className={`h-full bg-gradient-to-r ${color} rounded-full`} style={{ width: `${pct}%` }} />
                </div>
                <p className="text-right text-xs text-slate-500 mt-1">{pct}% occupancy</p>
              </div>
            );
          })}
        </div>
      )}

      {/* Bed Grid */}
      {(selectedWard || true) && wardBeds.length > 0 && (
        <div className="card">
          <h2 className="card-title mb-4">
            Bed Status {selectedWard ? `— ${wards.find(w => w.id === selectedWard)?.name}` : '(All Wards)'}
          </h2>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-2">
            {wardBeds.map(bed => {
              const colors = { Available: 'bed-available', Occupied: 'bed-occupied', Cleaning: 'bed-cleaning', Reserved: 'bed-reserved' };
              return (
                <button key={bed.id} onClick={() => bed.status !== 'Occupied' && toggleBedStatus(bed)}
                  title={`${bed.bedNumber} — ${bed.wardName} — ${bed.status}`}
                  className={`bed-slot ${colors[bed.status] || 'bed-available'}`}>
                  <BedDouble size={12} />
                  <span className="text-xs mt-0.5 truncate w-full text-center">{bed.bedNumber}</span>
                </button>
              );
            })}
          </div>
          <div className="flex gap-4 mt-4 flex-wrap">
            {[['bed-available','Available'],['bed-occupied','Occupied'],['bed-cleaning','Cleaning'],['bed-reserved','Reserved']].map(([cls, label]) => (
              <div key={label} className="flex items-center gap-2"><div className={`w-4 h-4 rounded ${cls}`}></div><span className="text-xs text-slate-400">{label}</span></div>
            ))}
          </div>
        </div>
      )}

      <Modal open={modal} title="Add Ward" onClose={() => setModal(false)}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {[['name','Ward Name'],['description','Description']].map(([f,l]) => (
            <div key={f} className="form-group"><label className="form-label">{l}</label>
              <input className="form-input" value={form[f]} onChange={e => setForm(p => ({ ...p, [f]: e.target.value }))} required={f === 'name'} />
            </div>
          ))}
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group"><label className="form-label">Ward Type</label>
              <select className="form-input" value={form.wardType} onChange={e => setForm(p => ({ ...p, wardType: e.target.value }))}>
                {['General','Semi-Private','Private','Deluxe','ICU','NICU'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="form-group"><label className="form-label">Total Beds</label>
              <input type="number" min="1" className="form-input" value={form.totalBeds} onChange={e => setForm(p => ({ ...p, totalBeds: e.target.value }))} />
            </div>
            <div className="form-group"><label className="form-label">Charge Per Day (₹)</label>
              <input type="number" className="form-input" value={form.chargePerDay} onChange={e => setForm(p => ({ ...p, chargePerDay: e.target.value }))} />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModal(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Create Ward</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
