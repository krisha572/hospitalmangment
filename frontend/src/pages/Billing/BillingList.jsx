import React, { useEffect, useState } from 'react';
import { Plus, Search, Receipt } from 'lucide-react';
import { billingApi, patientsApi } from '../../services/api';
import { LoadingSpinner, Badge, Modal } from '../../components/UI';

const emptyItem = { itemName: '', itemType: 'Service', quantity: 1, unitPrice: 0, gstPercent: 18 };
const defaultForm = { invoiceType: 'OPD', discountAmount: 0, paymentMethod: 'Cash', paidAmount: 0, notes: '', patientId: '', items: [{ ...emptyItem }] };

export default function BillingList() {
  const [invoices, setInvoices] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(defaultForm);

  const load = () => {
    setLoading(true);
    Promise.all([billingApi.getAll({}), patientsApi.getAll()])
      .then(([i, p]) => { setInvoices(i.data); setPatients(p.data); })
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const filtered = invoices.filter(i => `${i.patientName} ${i.invoiceNumber}`.toLowerCase().includes(search.toLowerCase()));

  const subtotal = form.items.reduce((s, i) => s + (+i.quantity * +i.unitPrice), 0);
  const gst = form.items.reduce((s, i) => s + (+i.quantity * +i.unitPrice * (+i.gstPercent / 100)), 0);
  const total = subtotal + gst - +form.discountAmount;

  const addItem = () => setForm(f => ({ ...f, items: [...f.items, { ...emptyItem }] }));
  const removeItem = (idx) => setForm(f => ({ ...f, items: f.items.filter((_, i) => i !== idx) }));
  const updateItem = (idx, field, val) => setForm(f => ({ ...f, items: f.items.map((it, i) => i === idx ? { ...it, [field]: val } : it) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    await billingApi.create({ ...form, patientId: +form.patientId, discountAmount: +form.discountAmount, paidAmount: +form.paidAmount });
    setModal(false); load();
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div><h1 className="page-title">Billing</h1><p className="text-slate-400 text-sm">{invoices.length} invoices</p></div>
        <button onClick={() => { setForm(defaultForm); setModal(true); }} className="btn-primary flex items-center gap-2"><Plus size={16} /> Create Invoice</button>
      </div>
      <div className="card">
        <div className="flex items-center gap-2 bg-slate-800/60 rounded-lg px-3 py-2 border border-slate-700/50 mb-4 max-w-xs">
          <Search size={14} className="text-slate-400" />
          <input className="bg-transparent text-sm text-slate-300 placeholder:text-slate-500 outline-none flex-1" placeholder="Search invoices..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        {loading ? <LoadingSpinner /> : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead><tr><th>Invoice No</th><th>Patient</th><th>Type</th><th>Total</th><th>Paid</th><th>Due</th><th>Method</th><th>Status</th></tr></thead>
              <tbody>
                {filtered.map(inv => (
                  <tr key={inv.id}>
                    <td><span className="font-mono text-cyan-400 text-xs">{inv.invoiceNumber}</span></td>
                    <td><p className="text-white text-sm font-medium">{inv.patientName}</p><p className="text-xs text-slate-500">{inv.patientUHID}</p></td>
                    <td><span className="text-slate-300 text-sm">{inv.invoiceType}</span></td>
                    <td><span className="text-white font-semibold text-sm">₹{inv.totalAmount?.toLocaleString()}</span></td>
                    <td><span className="text-emerald-400 text-sm">₹{inv.paidAmount?.toLocaleString()}</span></td>
                    <td><span className={`text-sm font-medium ${inv.dueAmount > 0 ? 'text-red-400' : 'text-emerald-400'}`}>₹{inv.dueAmount?.toLocaleString()}</span></td>
                    <td><span className="text-slate-300 text-sm">{inv.paymentMethod}</span></td>
                    <td><Badge status={inv.paymentStatus} /></td>
                  </tr>
                ))}
                {!filtered.length && <tr><td colSpan={8} className="text-center text-slate-500 py-10">No invoices found</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={modal} title="Create Invoice" onClose={() => setModal(false)}>
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group"><label className="form-label">Patient</label>
              <select className="form-input" value={form.patientId} onChange={e => setForm(f => ({ ...f, patientId: e.target.value }))} required>
                <option value="">Select patient</option>
                {patients.map(p => <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>)}
              </select>
            </div>
            <div className="form-group"><label className="form-label">Invoice Type</label>
              <select className="form-input" value={form.invoiceType} onChange={e => setForm(f => ({ ...f, invoiceType: e.target.value }))}>
                {['OPD','IPD','Pharmacy','Lab','Radiology','OT'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>

          {/* Line Items */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="form-label">Items</label>
              <button type="button" onClick={addItem} className="btn-xs-green flex items-center gap-1"><Plus size={11} /> Add Item</button>
            </div>
            <div className="space-y-2">
              {form.items.map((item, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                  <input className="form-input col-span-4 text-xs" placeholder="Item name" value={item.itemName} onChange={e => updateItem(idx, 'itemName', e.target.value)} required />
                  <select className="form-input col-span-2 text-xs" value={item.itemType} onChange={e => updateItem(idx, 'itemType', e.target.value)}>
                    {['Service','Medicine','Lab','Radiology','Bed','Doctor'].map(t => <option key={t}>{t}</option>)}
                  </select>
                  <input type="number" className="form-input col-span-1 text-xs" placeholder="Qty" value={item.quantity} onChange={e => updateItem(idx, 'quantity', e.target.value)} min="1" />
                  <input type="number" className="form-input col-span-2 text-xs" placeholder="Price" value={item.unitPrice} onChange={e => updateItem(idx, 'unitPrice', e.target.value)} />
                  <input type="number" className="form-input col-span-1 text-xs" placeholder="GST%" value={item.gstPercent} onChange={e => updateItem(idx, 'gstPercent', e.target.value)} />
                  <span className="col-span-1 text-xs text-cyan-400 text-right">₹{(+item.quantity * +item.unitPrice).toFixed(0)}</span>
                  <button type="button" onClick={() => removeItem(idx)} className="col-span-1 text-red-400 hover:text-red-300 text-center">×</button>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="bg-slate-800/50 rounded-lg p-3 space-y-1 text-sm">
            <div className="flex justify-between"><span className="text-slate-400">Subtotal</span><span className="text-white">₹{subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between"><span className="text-slate-400">GST</span><span className="text-white">₹{gst.toFixed(2)}</span></div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Discount</span>
              <input type="number" className="form-input w-24 text-xs py-1" value={form.discountAmount} onChange={e => setForm(f => ({ ...f, discountAmount: e.target.value }))} />
            </div>
            <div className="flex justify-between border-t border-slate-700 pt-1 font-semibold">
              <span className="text-white">Total</span><span className="text-cyan-400">₹{total.toFixed(2)}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-group"><label className="form-label">Payment Method</label>
              <select className="form-input" value={form.paymentMethod} onChange={e => setForm(f => ({ ...f, paymentMethod: e.target.value }))}>
                {['Cash','UPI','Card','Insurance','Net Banking'].map(m => <option key={m}>{m}</option>)}
              </select>
            </div>
            <div className="form-group"><label className="form-label">Paid Amount</label>
              <input type="number" className="form-input" value={form.paidAmount} onChange={e => setForm(f => ({ ...f, paidAmount: e.target.value }))} />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModal(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary flex items-center gap-2"><Receipt size={14} /> Generate Invoice</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
