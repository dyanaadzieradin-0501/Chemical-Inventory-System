import React, { useState } from 'react';
import { ChemicalBottle, Location, UserProfile } from '../types';
import { StatusBadge, ExpiryBadge } from './StatusBadge';
import {
  Trash2,
  CheckCircle2,
  ClockAlert,
  Lock,
  Eye,
  FileCheck2,
  ShieldCheck
} from 'lucide-react';

interface DisposalManagementProps {
  bottles: ChemicalBottle[];
  locations: Location[];
  currentUser: UserProfile;
  onSelectBottle: (bottle: ChemicalBottle) => void;
  onOpenConfirmDisposal: (bottle: ChemicalBottle) => void;
}

export const DisposalManagement: React.FC<DisposalManagementProps> = ({
  bottles,
  locations,
  currentUser,
  onSelectBottle,
  onOpenConfirmDisposal
}) => {
  const [activeTab, setActiveTab] = useState<'PENDING' | 'DISPOSED'>('PENDING');

  const pendingBottles = bottles.filter(b => b.status === 'PENDING_DISPOSAL');
  const disposedBottles = bottles.filter(b => b.status === 'DISPOSED');

  const isAdmin = currentUser.role === 'ADMIN';

  const getLocationName = (locId: string) => {
    return locations.find(l => l.id === locId)?.name || locId;
  };

  return (
    <div className="space-y-4">
      {/* Header Modul */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Pengurusan Pelupusan Bahan Kimia & Sisa Berjadual
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Aliran 2 langkah: Pengasingan oleh staf makmal dan pengesahan muktamad oleh Pegawai Sains mengikut piawaian DOE
          </p>
        </div>

        {/* Tab Penukar Segmen */}
        <div className="flex items-center bg-slate-200/80 p-0.5 rounded-sm text-xs font-semibold shrink-0">
          <button
            onClick={() => setActiveTab('PENDING')}
            className={`px-3 py-1 rounded-xs transition-colors flex items-center gap-1.5 ${
              activeTab === 'PENDING'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ClockAlert className="w-3.5 h-3.5 text-amber-700" />
            <span>Menunggu Pengesahan ({pendingBottles.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('DISPOSED')}
            className={`px-3 py-1 rounded-xs transition-colors flex items-center gap-1.5 ${
              activeTab === 'DISPOSED'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-slate-700" />
            <span>Arkib Telah Dilupuskan ({disposedBottles.length})</span>
          </button>
        </div>
      </div>

      {/* Paparan Tab 1: Menunggu Pengesahan */}
      {activeTab === 'PENDING' && (
        <div className="bg-white rounded-md border border-slate-200 overflow-hidden">
          <div className="px-4 py-2 bg-amber-50/60 border-b border-amber-200 text-xs text-amber-900 flex items-center justify-between">
            <span>
              Semua botol dalam senarai ini telah dikeluarkan daripada kiraan stok aktif dan menanti kelulusan Pegawai Sains.
            </span>
            {!isAdmin && (
              <span className="font-mono text-[11px] text-amber-800 flex items-center gap-1">
                <Lock className="w-3 h-3" /> Mod Baca Sahaja (Peranan Staf)
              </span>
            )}
          </div>

          {pendingBottles.length === 0 ? (
            <div className="py-14 text-center text-slate-500 space-y-1">
              <ShieldCheck className="w-8 h-8 text-emerald-600 mx-auto mb-1" />
              <h3 className="font-semibold text-slate-800 text-sm">Tiada Botol Menunggu Pelupusan</h3>
              <p className="text-xs text-slate-400">Semua sisa telah disahkan atau masih aktif digunakan.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-mono uppercase text-slate-500">
                    <th className="py-2.5 px-4 font-semibold">ID Botol</th>
                    <th className="py-2.5 px-4 font-semibold">Nama Bahan Kimia & Jenama</th>
                    <th className="py-2.5 px-4 font-semibold">Lokasi Simpanan</th>
                    <th className="py-2.5 px-4 font-semibold">Sebab Pelupusan</th>
                    <th className="py-2.5 px-4 font-semibold">Tarikh Luput</th>
                    <th className="py-2.5 px-4 font-semibold text-right">Kelulusan Admin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pendingBottles.map(bottle => (
                    <tr key={bottle.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-amber-800 whitespace-nowrap">
                        {bottle.id}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-900 block leading-tight">{bottle.chemicalName}</span>
                        <span className="text-[11px] text-slate-400">{bottle.brand} · {bottle.containerSize}</span>
                      </td>
                      <td className="py-3 px-4 text-slate-700">
                        {getLocationName(bottle.locationId)}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-medium text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded text-[11px]">
                          {bottle.disposalReason || 'Tamat Tempoh'}
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <ExpiryBadge expiryDate={bottle.expiryDate} size="sm" />
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => onSelectBottle(bottle)}
                            className="px-2 py-1 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded text-xs font-medium"
                          >
                            Lihat
                          </button>

                          {isAdmin ? (
                            <button
                              onClick={() => onOpenConfirmDisposal(bottle)}
                              className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-semibold shadow-2xs transition-colors flex items-center gap-1"
                            >
                              <FileCheck2 className="w-3.5 h-3.5" />
                              <span>Sahkan Pelupusan</span>
                            </button>
                          ) : (
                            <span
                              className="text-slate-400 text-xs flex items-center gap-1 font-mono"
                              title="Hanya Admin boleh mengesahkan"
                            >
                              <Lock className="w-3 h-3" />
                              <span>Admin Sahaja</span>
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Paparan Tab 2: Arkib Telah Dilupuskan */}
      {activeTab === 'DISPOSED' && (
        <div className="bg-white rounded-md border border-slate-200 overflow-hidden">
          <div className="px-4 py-2 bg-slate-100 border-b border-slate-200 text-xs text-slate-600 flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-slate-600" />
            <span>
              Rekod arkib kekal sisa berjadual. Rekod ini dikunci daripada sebarang modifikasi mengikut keperluan audit Jabatan Alam Sekitar (DOE).
            </span>
          </div>

          {disposedBottles.length === 0 ? (
            <div className="py-14 text-center text-slate-500">
              <p className="font-semibold text-slate-800 text-sm">Tiada rekod dalam arkib pelupusan muktamad.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-mono uppercase text-slate-500">
                    <th className="py-2.5 px-4 font-semibold">ID Botol</th>
                    <th className="py-2.5 px-4 font-semibold">Nama Bahan Kimia & Jenama</th>
                    <th className="py-2.5 px-4 font-semibold">Tarikh Lupus</th>
                    <th className="py-2.5 px-4 font-semibold">No. Rujukan Notis DOE</th>
                    <th className="py-2.5 px-4 font-semibold">Sebab Pelupusan</th>
                    <th className="py-2.5 px-4 font-semibold text-right">Sejarah</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {disposedBottles.map(bottle => (
                    <tr key={bottle.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-slate-600 whitespace-nowrap">
                        {bottle.id}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-900 block leading-tight">{bottle.chemicalName}</span>
                        <span className="text-[11px] text-slate-400">{bottle.brand} · {bottle.containerSize}</span>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-700 whitespace-nowrap">
                        {bottle.disposalDate || '-'}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-blue-900 whitespace-nowrap">
                        {bottle.disposalRefNo || '-'}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {bottle.disposalReason || '-'}
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => onSelectBottle(bottle)}
                          className="px-2 py-1 text-blue-600 hover:text-blue-800 font-semibold text-xs"
                        >
                          Buka Sejarah
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
