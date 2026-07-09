import React from 'react';
import { Loader2 } from 'lucide-react';

export function LoadingSpinner({ text = 'Loading...' }) {
  return (
    <div className="flex items-center justify-center h-48">
      <div className="flex items-center gap-3 text-slate-400">
        <Loader2 size={20} className="animate-spin text-cyan-400" />
        <span>{text}</span>
      </div>
    </div>
  );
}

export function EmptyState({ message = 'No records found', action }) {
  return (
    <div className="flex flex-col items-center justify-center h-48 gap-3">
      <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center">
        <span className="text-2xl">📋</span>
      </div>
      <p className="text-slate-400 text-sm">{message}</p>
      {action}
    </div>
  );
}

export function Badge({ status }) {
  const map = {
    Active: 'badge-green', Inactive: 'badge-red', Scheduled: 'badge-blue',
    Completed: 'badge-green', Cancelled: 'badge-red', Admitted: 'badge-blue',
    Discharged: 'badge-green', Pending: 'badge-amber', Paid: 'badge-green',
    Partial: 'badge-amber', Available: 'badge-green', Occupied: 'badge-red',
    Cleaning: 'badge-amber', 'No-Show': 'badge-red', Confirmed: 'badge-blue',
  };
  return <span className={`badge ${map[status] || 'badge-blue'}`}>{status}</span>;
}

export function Modal({ open, title, onClose, children }) {
  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-xl leading-none">×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function ConfirmDialog({ open, message, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-box max-w-sm">
        <p className="text-slate-300 mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} className="btn-secondary">Cancel</button>
          <button onClick={onConfirm} className="btn-danger">Confirm</button>
        </div>
      </div>
    </div>
  );
}
