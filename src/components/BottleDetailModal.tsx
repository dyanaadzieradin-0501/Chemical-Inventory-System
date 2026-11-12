import React from 'react';
import { ChemicalBottle, Location, UserProfile } from '../types';
import { StatusBadge, ExpiryBadge } from './StatusBadge';
import { GHSBadge } from './GHSBadge';
import {
  X,
  ExternalLink,
  QrCode,
  ArrowRightLeft,
  Trash2,
  Building2,
  Clock,
  CheckCircle2,
  FileText,
  Lock,
  ShieldCheck
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface BottleDetailModalProps {
  bottle: ChemicalBottle | null;
  locations: Location[];
  currentUser: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onOpenMoveModal: (bottle: ChemicalBottle) => void;
  onOpenDisposalModal: (bottle: ChemicalBottle, step: 1 | 2) => void;
  onOpenQRPrintModal: (bottle: ChemicalBottle) => void;
}

export const BottleDetailModal: React.FC<BottleDetailModalProps> = ({
  bottle,
  locations,
  currentUser,
  isOpen,
  onClose,
  onOpenMoveModal,
  onOpenDisposalModal,
  onOpenQRPrintModal
}) => {
  if (!isOpen || !bottle) return null;

  const location = locations.find(l => l.id === bottle.locationId);
  const locationName = location ? location.name : 'Stor';
  const isAdmin = currentUser.role === 'ADMIN';
  const isDisposed = bottle.status === 'DISPOSED';
  const isPendingDisposal = bottle.status === 'PENDING_DISPOSAL';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-2xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-md shadow-xl border border-slate-300 overflow-hidden my-6 max-h-[92vh] flex flex-col">
        {/* Header Lembaran Data Makmal */}
        <div className="flex items-start justify-between px-5 py-3.5 border-b border-slate-200 bg-slate-50/70 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-white border border-slate-300 rounded shrink-0">
              <QRCodeSVG value={bottle.id} size={44} level="M" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-sm text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {bottle.id}
                </span>
                <StatusBadge status={bottle.status} size="sm" />
              </div>
              <h2 className="text-base font-bold text-slate-900 mt-0.5 line-clamp-1">
                {bottle.chemicalName}
              </h2>
              {bottle.casNumber && (
                <span className="text-[11px] text-slate-500 font-mono">CAS: {bottle.casNumber}</span>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar Tindakan Pantas */}
        <div className="px-5 py-2.5 bg-slate-100/70 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 shrink-0 text-xs">
          <span className="font-mono text-[11px] text-slate-500 uppercase tracking-wider">
            Tindakan Botol:
          </span>

          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => onOpenQRPrintModal(bottle)}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded text-xs font-semibold shadow-2xs transition-colors"
            >
              <QrCode className="w-3.5 h-3.5 text-slate-500" />
              <span>Cetak QR</span>
            </button>

            {!isDisposed && (
              <button
                onClick={() => onOpenMoveModal(bottle)}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-semibold shadow-2xs transition-colors"
              >
                <ArrowRightLeft className="w-3.5 h-3.5" />
                <span>Pindah Lokasi</span>
              </button>
            )}

            {!isDisposed && !isPendingDisposal && (
              <button
                onClick={() => onOpenDisposalModal(bottle, 1)}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded text-xs font-semibold shadow-2xs transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Tanda Lupus</span>
              </button>
            )}

            {isPendingDisposal && (
              <button
                onClick={() => onOpenDisposalModal(bottle, 2)}
                disabled={!isAdmin}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold shadow-2xs transition-colors ${
                  isAdmin
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
                title={!isAdmin ? 'Hanya Admin boleh mengesahkan' : undefined}
              >
                {isAdmin ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                <span>Sahkan Pelupusan</span>
              </button>
            )}

            {isDisposed && (
              <span className="text-[11px] text-slate-400 italic flex items-center gap-1">
                <Lock className="w-3 h-3" /> Rekod Arkib Terkunci
              </span>
            )}
          </div>
        </div>

        {/* Kandungan Lembaran Data */}
        <div className="p-5 overflow-y-auto space-y-5 text-xs">
          {/* Matriks Spesifikasi Botol (Hairline Divider Grid) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-3 gap-x-4 pb-4 border-b border-slate-200">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">Jenama & Saiz</span>
              <div className="font-semibold text-slate-900 mt-0.5">{bottle.brand}</div>
              <div className="text-[11px] font-mono text-slate-500">{bottle.containerSize}</div>
            </div>

            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">No. Batch / Lot</span>
              <div className="font-mono font-semibold text-slate-900 mt-0.5">{bottle.batchNumber}</div>
              <div className="text-[11px] text-slate-400">Terima: {bottle.receivedDate}</div>
            </div>

            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">Tarikh Luput</span>
              <div className="mt-0.5">
                <ExpiryBadge expiryDate={bottle.expiryDate} size="sm" />
              </div>
            </div>

            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">Lokasi Semasa</span>
              <div className="font-medium text-slate-800 mt-0.5 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                <span>{locationName}</span>
              </div>
            </div>

            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">Pembekal</span>
              <div className="font-medium text-slate-800 mt-0.5">{bottle.supplierName}</div>
            </div>

            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">Safety Data Sheet</span>
              <div className="mt-0.5">
                <a
                  href={bottle.sdsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-blue-700 hover:text-blue-900 font-semibold"
                >
                  <FileText className="w-3.5 h-3.5 text-blue-600" />
                  <span>Buka SDS Rasmi</span>
                  <ExternalLink className="w-3 h-3 text-blue-500" />
                </a>
              </div>
            </div>
          </div>

          {/* Pengelasan Hazard GHS */}
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-2">
              Pengelasan Bahaya GHS Makmal
            </div>
            <div className="flex flex-wrap gap-1.5">
              {bottle.hazardClasses.map(hazard => (
                <GHSBadge key={hazard} hazard={hazard} size="md" />
              ))}
            </div>
          </div>

          {/* Bahagian Pelupusan Jika Ada */}
          {(bottle.disposalReason || bottle.disposalRefNo || isDisposed || isPendingDisposal) && (
            <div className="p-3 bg-amber-50/50 border border-amber-200 rounded text-xs space-y-1.5 text-amber-950">
              <div className="font-bold text-amber-900 flex items-center gap-1.5">
                <Trash2 className="w-3.5 h-3.5 text-amber-700" />
                <span>Status Pelupusan: {bottle.status === 'DISPOSED' ? 'Telah Dilupuskan' : 'Menunggu Kelulusan'}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] pt-1">
                <div>
                  <span className="text-amber-800">Sebab:</span>{' '}
                  <span className="font-medium">{bottle.disposalReason || '-'}</span>
                </div>
                {bottle.disposalDate && (
                  <div>
                    <span className="text-amber-800">Tarikh Lupus:</span>{' '}
                    <span className="font-mono">{bottle.disposalDate}</span>
                  </div>
                )}
                {bottle.disposalRefNo && (
                  <div>
                    <span className="text-amber-800">No. Notis DOE:</span>{' '}
                    <span className="font-mono font-bold">{bottle.disposalRefNo}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Jejak Audit Kronologi (Garis Masa Precision) */}
          <div>
            <div className="flex items-center justify-between mb-2.5 pb-1 border-b border-slate-100">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                Jejak Audit Kronologi ({bottle.auditLogs.length} transaksi)
              </span>
            </div>

            <div className="space-y-2">
              {bottle.auditLogs.map((log, index) => {
                const dateObj = new Date(log.timestamp);
                const formattedDate = dateObj.toLocaleDateString('ms-MY', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                });

                let actionLabel = 'Pendaftaran Stok';
                if (log.action === 'MOVED') actionLabel = 'Pemindahan Lokasi';
                else if (log.action === 'MARKED_DISPOSAL') actionLabel = 'Menunggu Pelupusan';
                else if (log.action === 'CONFIRMED_DISPOSAL') actionLabel = 'Pelupusan Muktamad';

                return (
                  <div key={log.logId || index} className="p-2.5 bg-slate-50 border border-slate-200/90 rounded text-xs">
                    <div className="flex items-center justify-between font-mono text-[11px] text-slate-500 mb-0.5">
                      <span className="font-bold text-slate-800">{actionLabel}</span>
                      <span>{formattedDate}</span>
                    </div>

                    <div className="text-[11px] text-slate-600">
                      Oleh: <strong className="text-slate-800">{log.performedBy}</strong>
                    </div>

                    {(log.fromLocation || log.toLocation) && (
                      <div className="text-[11px] text-slate-700 mt-1 pt-1 border-t border-slate-200/60">
                        {log.fromLocation && <span>Dari: {log.fromLocation} → </span>}
                        {log.toLocation && <span>Destinasi: <strong>{log.toLocation}</strong></span>}
                      </div>
                    )}

                    {log.notes && (
                      <p className="text-[11px] text-slate-500 italic mt-1 bg-white p-1.5 rounded border border-slate-100">
                        "{log.notes}"
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-2.5 border-t border-slate-200 bg-slate-50 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded transition-colors"
          >
            Tutup Lembaran
          </button>
        </div>
      </div>
    </div>
  );
};
