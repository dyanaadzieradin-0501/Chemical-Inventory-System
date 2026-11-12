import React, { useState } from 'react';
import { ChemicalBottle, UserProfile } from '../types';
import { Trash2, AlertOctagon, CheckCircle2, X, Lock } from 'lucide-react';
import { StorageService, getTodayDateString } from '../services/storageService';

interface DisposalModalProps {
  bottle: ChemicalBottle | null;
  currentUser: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updatedBottle: ChemicalBottle) => void;
  initialStep?: 1 | 2;
}

export const DisposalModal: React.FC<DisposalModalProps> = ({
  bottle,
  currentUser,
  isOpen,
  onClose,
  onSuccess,
  initialStep
}) => {
  const defaultStep = initialStep || (bottle?.status === 'PENDING_DISPOSAL' ? 2 : 1);

  const [step, setStep] = useState<1 | 2>(defaultStep);
  const [reason, setReason] = useState<'Habis Digunakan' | 'Tamat Tempoh' | 'Rosak' | string>('Tamat Tempoh');
  const [step1Notes, setStep1Notes] = useState('');

  const [disposalDate, setDisposalDate] = useState(getTodayDateString());
  const [disposalRefNo, setDisposalRefNo] = useState(`DOE/SW/2026/${Math.floor(1000 + Math.random() * 9000)}`);
  const [step2Notes, setStep2Notes] = useState('');

  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !bottle) return null;

  const isAdmin = currentUser.role === 'ADMIN';

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const result = StorageService.markPendingDisposal(bottle.id, reason, step1Notes, currentUser);
    if (result.success && result.bottle) {
      onSuccess(result.bottle);
      onClose();
    } else {
      setError(result.message);
    }
  };

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isAdmin) {
      setError('Akses Disekat: Hanya Admin / Pegawai Makmal boleh mengesahkan status Telah Dilupuskan.');
      return;
    }

    const result = StorageService.confirmDisposal(
      bottle.id,
      disposalDate,
      disposalRefNo,
      step2Notes,
      currentUser
    );

    if (result.success && result.bottle) {
      onSuccess(result.bottle);
      onClose();
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-2xs">
      <div className="relative w-full max-w-lg bg-white rounded-md shadow-2xl border border-slate-300 overflow-hidden">
        {/* Header Modal */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <Trash2 className="w-4 h-4 text-slate-700" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                {step === 1 ? 'Langkah 1: Tanda Menunggu Pelupusan' : 'Langkah 2: Pengesahan Pelupusan Muktamad'}
              </h3>
              <p className="text-[11px] text-slate-500">
                {step === 1
                  ? 'Pengasingan botol daripada baki stok aktif oleh kakitangan'
                  : 'Pengesahan kuasa Pegawai Sains mengikut Akta Kualiti Alam Sekeliling'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Penunjuk Aliran 2-Langkah */}
        <div className="grid grid-cols-2 text-xs font-semibold border-b border-slate-200 bg-slate-100/70">
          <button
            type="button"
            onClick={() => setStep(1)}
            disabled={bottle.status === 'PENDING_DISPOSAL'}
            className={`py-2 px-3 text-center transition-colors flex items-center justify-center gap-2 ${
              step === 1
                ? 'bg-white text-slate-900 border-b-2 border-amber-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="font-mono text-[10px] w-4 h-4 rounded bg-slate-200 flex items-center justify-center font-bold">1</span>
            <span>Tanda Menunggu</span>
          </button>
          <button
            type="button"
            onClick={() => setStep(2)}
            className={`py-2 px-3 text-center transition-colors flex items-center justify-center gap-2 ${
              step === 2
                ? 'bg-white text-slate-900 border-b-2 border-red-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="font-mono text-[10px] w-4 h-4 rounded bg-slate-200 flex items-center justify-center font-bold">2</span>
            <span>Sahkan Muktamad</span>
            {!isAdmin && <Lock className="w-3 h-3 text-slate-400 ml-0.5" />}
          </button>
        </div>

        {/* Ringkasan Botol */}
        <div className="px-5 py-2.5 bg-slate-50 border-b border-slate-200 text-xs flex justify-between items-center">
          <div>
            <span className="font-mono font-bold text-blue-700">{bottle.id}</span>
            <span className="text-slate-600 ml-2 font-medium">{bottle.chemicalName}</span>
          </div>
          <span className="font-mono text-slate-500 text-[11px]">Luput: {bottle.expiryDate}</span>
        </div>

        {error && (
          <div className="m-4 p-2.5 bg-red-50 border border-red-200 rounded text-xs text-red-800 flex items-start gap-2">
            <AlertOctagon className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Langkah 1 */}
        {step === 1 && (
          <form onSubmit={handleStep1Submit} className="p-5 space-y-3.5 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Sebab Pelupusan <span className="text-red-500">*</span>
              </label>
              <select
                value={reason}
                onChange={e => setReason(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                <option value="Tamat Tempoh">Tamat Tempoh (Expired Chemical)</option>
                <option value="Habis Digunakan">Habis Digunakan (Empty Container)</option>
                <option value="Rosak">Rosak / Terpencemar / Mengendap</option>
                <option value="Botol Retak / Bocor">Botol Retak / Penutup Bocor</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Catatan Keadaan Bahan
              </label>
              <textarea
                value={step1Notes}
                onChange={e => setStep1Notes(e.target.value)}
                placeholder="Catatan tambahan untuk rekod pelupusan..."
                rows={2}
                className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div className="p-2.5 bg-amber-50 border border-amber-200 rounded text-[11px] text-amber-900 leading-normal">
              <strong>Kesan Inventori:</strong> Tindakan ini akan segera mengeluarkan 1 unit botol daripada baki stok aktif dan meletakkannya dalam senarai kelulusan sisa berjadual.
            </div>

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
                className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded text-xs shadow-2xs transition-colors"
              >
                Tanda Menunggu Pelupusan
              </button>
            </div>
          </form>
        )}

        {/* Form Langkah 2: Admin Sahkan */}
        {step === 2 && (
          <form onSubmit={handleStep2Submit} className="p-5 space-y-3.5 text-xs">
            {!isAdmin ? (
              <div className="py-6 text-center space-y-2">
                <Lock className="w-6 h-6 text-slate-400 mx-auto" />
                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Akses Khusus Admin</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Pengesahan pelupusan muktamad memerlukan kuasa Pegawai Sains. Anda boleh menukar peranan di bar atas untuk menguji.
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Tarikh Pelupusan Rasmi <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={disposalDate}
                      onChange={e => setDisposalDate(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-slate-300 rounded font-mono focus:outline-none focus:ring-1 focus:ring-red-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      No. Notis / Fail DOE <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={disposalRefNo}
                      onChange={e => setDisposalRefNo(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-slate-300 rounded font-mono focus:outline-none focus:ring-1 focus:ring-red-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Catatan Pengesahan Pelupusan
                  </label>
                  <textarea
                    value={step2Notes}
                    onChange={e => setStep2Notes(e.target.value)}
                    placeholder="Contoh: Diserahkan kepada kontraktor sisa berlesen..."
                    rows={2}
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                </div>

                <div className="p-2.5 bg-red-50 border border-red-200 rounded text-[11px] text-red-900 leading-normal">
                  <strong>Peringatan Integriti:</strong> Rekod yang disahkan akan dikunci sebagai arkib kekal dan tidak boleh dipadam atau diubah suai lokasinya lagi.
                </div>

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
                    className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded text-xs shadow-2xs transition-colors flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Sahkan Telah Dilupuskan</span>
                  </button>
                </div>
              </>
            )}
          </form>
        )}
      </div>
    </div>
  );
};
