import React, { useState } from 'react';
import { ChemicalBottle, Location, UserProfile } from '../types';
import { ArrowRightLeft, X, AlertCircle, MapPin, CheckCircle } from 'lucide-react';
import { StorageService } from '../services/storageService';

interface MoveLocationModalProps {
  bottle: ChemicalBottle | null;
  locations: Location[];
  currentUser: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updatedBottle: ChemicalBottle) => void;
}

export const MoveLocationModal: React.FC<MoveLocationModalProps> = ({
  bottle,
  locations,
  currentUser,
  isOpen,
  onClose,
  onSuccess
}) => {
  const [targetLocationId, setTargetLocationId] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !bottle) return null;

  const currentLocation = locations.find(l => l.id === bottle.locationId);
  const availableLocations = locations.filter(l => l.id !== bottle.locationId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetLocationId) {
      setError('Sila pilih lokasi destinasi baharu.');
      return;
    }

    if (targetLocationId === bottle.locationId) {
      setError('Lokasi destinasi tidak boleh sama dengan lokasi semasa botol.');
      return;
    }

    const result = StorageService.moveBottle(bottle.id, targetLocationId, notes, currentUser);
    if (result.success && result.bottle) {
      onSuccess(result.bottle);
      onClose();
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-2xs">
      <div className="relative w-full max-w-md bg-white rounded-md shadow-2xl border border-slate-300 overflow-hidden">
        {/* Header Modal */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <ArrowRightLeft className="w-4 h-4 text-slate-700" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">Pemindahan Lokasi Botol</h3>
              <p className="text-[11px] text-slate-500">Kemas kini kedudukan fizikal botol dan rekod ke jejak audit</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Borang Pemindahan */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
          {error && (
            <div className="p-2.5 bg-red-50 border border-red-200 rounded text-xs text-red-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Kad Maklumat Botol */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded space-y-1">
            <div className="flex items-center justify-between font-mono">
              <span className="font-bold text-blue-700">{bottle.id}</span>
              <span className="text-slate-500 text-[11px]">{bottle.brand} · {bottle.containerSize}</span>
            </div>
            <h4 className="font-semibold text-slate-900 leading-tight">{bottle.chemicalName}</h4>
            <div className="text-slate-500 text-[11px] pt-1 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-slate-400" />
              <span>Lokasi Semasa: <strong className="text-slate-800">{currentLocation?.name || 'Stor'}</strong></span>
            </div>
          </div>

          {/* Pilihan Destinasi Baharu */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Lokasi Destinasi Baharu <span className="text-red-500">*</span>
            </label>
            <select
              value={targetLocationId}
              onChange={e => {
                setTargetLocationId(e.target.value);
                setError(null);
              }}
              required
              className="w-full px-3 py-2 border border-slate-300 rounded bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
            >
              <option value="">-- Pilih Bilik Makmal atau Stor Sasaran --</option>
              <optgroup label="Bilik Makmal Pengujian">
                {availableLocations.filter(l => l.type === 'LAB').map(l => (
                  <option key={l.id} value={l.id}>
                    {l.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Stor Simpanan Pusat">
                {availableLocations.filter(l => l.type === 'STORE').map(l => (
                  <option key={l.id} value={l.id}>
                    {l.name}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          {/* Catatan / Tujuan */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Catatan Penggunaan / Tujuan
            </label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Contoh: Digunakan untuk analisis spektroskopi..."
              rows={2}
              className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <div className="text-[11px] text-slate-500">
            Direkodkan oleh: <strong>{currentUser.name}</strong> ({currentUser.role === 'ADMIN' ? 'Admin' : 'Staf'})
          </div>

          {/* Butang Tindakan */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-slate-600 hover:text-slate-800"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded shadow-2xs transition-colors flex items-center gap-1"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Sahkan Pemindahan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
