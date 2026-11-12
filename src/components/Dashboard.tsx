import React, { useState } from 'react';
import { ChemicalBottle, Location, UserProfile } from '../types';
import { StorageService, getExpiryStatus, getDaysToExpiry } from '../services/storageService';
import { StatusBadge, ExpiryBadge } from './StatusBadge';
import { GHSBadge } from './GHSBadge';
import {
  AlertOctagon,
  AlertTriangle,
  PackageCheck,
  TrendingDown,
  ArrowRight,
  ArrowRightLeft,
  Trash2,
  Eye,
  PlusCircle,
  Building,
  ShieldAlert,
  CheckCircle2
} from 'lucide-react';

interface DashboardProps {
  bottles: ChemicalBottle[];
  locations: Location[];
  currentUser: UserProfile;
  onNavigateTab: (tab: string) => void;
  onSelectBottle: (bottle: ChemicalBottle) => void;
  onOpenMoveModal: (bottle: ChemicalBottle) => void;
  onOpenDisposalModal: (bottle: ChemicalBottle, step: 1 | 2) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  bottles,
  locations,
  currentUser,
  onNavigateTab,
  onSelectBottle,
  onOpenMoveModal,
  onOpenDisposalModal
}) => {
  const metrics = StorageService.getDashboardMetrics();
  const [activeAlertTab, setActiveAlertTab] = useState<'EXPIRED' | 'EXPIRING_SOON' | 'LOW_STOCK'>('EXPIRED');

  const getLocationName = (locId: string) => {
    return locations.find(l => l.id === locId)?.name || locId;
  };

  return (
    <div className="space-y-5">
      {/* Header Halaman & Tindakan Utama */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Konsol Pemantauan & Status Makmal
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Ringkasan operasi inventori masa nyata · Petugas aktif: <strong className="text-slate-700">{currentUser.name}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateTab('stock-in')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-semibold shadow-2xs transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Pendaftaran Stok Masuk</span>
          </button>
        </div>
      </div>

      {/* 4 Strip Metrik KPI Utama (FR-002 & FR-008) — Bersih, Berdisiplin Sains */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Metrik 1: Botol Aktif */}
        <div
          onClick={() => onNavigateTab('inventory')}
          className="bg-white p-4 rounded-md border border-slate-200 hover:border-slate-300 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-mono font-semibold uppercase tracking-wider">Botol Aktif</span>
            <PackageCheck className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl lg:text-3xl font-bold font-mono text-slate-900 tabular-nums">
              {metrics.activeBottlesCount}
            </span>
            <span className="text-xs text-slate-400 font-medium">unit</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between pt-2 border-t border-slate-100">
            <span>Stor & Makmal</span>
            <span className="text-blue-600 font-semibold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
              Buka <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Metrik 2: Telah Luput (Merah) */}
        <div
          onClick={() => setActiveAlertTab('EXPIRED')}
          className={`bg-white p-4 rounded-md border transition-colors cursor-pointer group ${
            metrics.expiredCount > 0 ? 'border-red-300 bg-red-50/20' : 'border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-red-700">Telah Luput</span>
            <AlertOctagon className="w-4 h-4 text-red-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl lg:text-3xl font-bold font-mono text-red-700 tabular-nums">
              {metrics.expiredCount}
            </span>
            <span className="text-xs text-red-600 font-medium">unit</span>
          </div>
          <div className="mt-2 text-[11px] text-red-700 flex items-center justify-between pt-2 border-t border-red-100">
            <span>Perlu diasingkan</span>
            <span className="font-semibold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
              Semak <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Metrik 3: Hampir Luput <= 90 hari (Ambar) */}
        <div
          onClick={() => setActiveAlertTab('EXPIRING_SOON')}
          className={`bg-white p-4 rounded-md border transition-colors cursor-pointer group ${
            metrics.expiringSoonCount > 0 ? 'border-amber-300 bg-amber-50/20' : 'border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-amber-800">Hampir Luput (≤90h)</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl lg:text-3xl font-bold font-mono text-amber-800 tabular-nums">
              {metrics.expiringSoonCount}
            </span>
            <span className="text-xs text-amber-700 font-medium">unit</span>
          </div>
          <div className="mt-2 text-[11px] text-amber-800 flex items-center justify-between pt-2 border-t border-amber-100">
            <span>Guna terdahulu</span>
            <span className="font-semibold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
              Perincian <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Metrik 4: Stok Rendah */}
        <div
          onClick={() => setActiveAlertTab('LOW_STOCK')}
          className={`bg-white p-4 rounded-md border transition-colors cursor-pointer group ${
            metrics.lowStockCount > 0 ? 'border-orange-300 bg-orange-50/20' : 'border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-orange-800">Stok Rendah</span>
            <TrendingDown className="w-4 h-4 text-orange-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl lg:text-3xl font-bold font-mono text-orange-800 tabular-nums">
              {metrics.lowStockCount}
            </span>
            <span className="text-xs text-orange-700 font-medium">jenis</span>
          </div>
          <div className="mt-2 text-[11px] text-orange-800 flex items-center justify-between pt-2 border-t border-orange-100">
            <span>≤ Paras minimum</span>
            <span className="font-semibold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
              Susun Pesanan <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>

      {/* Bahagian Amaran Proaktif Makmal (Segmented Action Strip & Table) */}
      <div className="bg-white rounded-md border border-slate-200 overflow-hidden">
        {/* Toolbar Amaran */}
        <div className="px-4 py-3 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/70">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-slate-700" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Senarai Amaran Segera Makmal
            </h2>
          </div>

          {/* Segmented Button Filter */}
          <div className="flex items-center bg-slate-200/80 p-0.5 rounded-sm text-xs font-semibold">
            <button
              onClick={() => setActiveAlertTab('EXPIRED')}
              className={`px-3 py-1 rounded-xs transition-colors ${
                activeAlertTab === 'EXPIRED'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Telah Luput ({metrics.expiredCount})
            </button>
            <button
              onClick={() => setActiveAlertTab('EXPIRING_SOON')}
              className={`px-3 py-1 rounded-xs transition-colors ${
                activeAlertTab === 'EXPIRING_SOON'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Hampir Luput ≤90h ({metrics.expiringSoonCount})
            </button>
            <button
              onClick={() => setActiveAlertTab('LOW_STOCK')}
              className={`px-3 py-1 rounded-xs transition-colors ${
                activeAlertTab === 'LOW_STOCK'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Stok Rendah ({metrics.lowStockCount})
            </button>
          </div>
        </div>

        {/* Kandungan Jadual Amaran */}
        <div>
          {/* Tab 1: Expired */}
          {activeAlertTab === 'EXPIRED' && (
            <div>
              {metrics.expiredBottles.length === 0 ? (
                <div className="py-12 text-center text-slate-500">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                  <p className="font-semibold text-slate-800 text-sm">Tiada botol tamat tempoh dalam simpanan aktif.</p>
                  <p className="text-xs text-slate-400 mt-0.5">Semua botol aktif melepasi piawaian tempoh sah guna.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50/50 text-[11px] font-mono uppercase text-slate-500">
                        <th className="py-2.5 px-4 font-semibold">ID Botol</th>
                        <th className="py-2.5 px-4 font-semibold">Nama Bahan Kimia & Jenama</th>
                        <th className="py-2.5 px-4 font-semibold">Lokasi Semasa</th>
                        <th className="py-2.5 px-4 font-semibold">Tarikh Luput</th>
                        <th className="py-2.5 px-4 font-semibold">Hazard GHS</th>
                        <th className="py-2.5 px-4 font-semibold text-right">Tindakan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {metrics.expiredBottles.map(bottle => (
                        <tr key={bottle.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-4 font-mono font-bold text-red-700 whitespace-nowrap">
                            {bottle.id}
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-semibold text-slate-900 block">{bottle.chemicalName}</span>
                            <span className="text-[11px] text-slate-500">{bottle.brand} · {bottle.containerSize}</span>
                          </td>
                          <td className="py-3 px-4 text-slate-700">
                            {getLocationName(bottle.locationId)}
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <ExpiryBadge expiryDate={bottle.expiryDate} size="sm" />
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex flex-wrap gap-1">
                              {bottle.hazardClasses.slice(0, 2).map(h => (
                                <GHSBadge key={h} hazard={h} size="sm" />
                              ))}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right whitespace-nowrap">
                            <div className="inline-flex items-center gap-1.5">
                              <button
                                onClick={() => onSelectBottle(bottle)}
                                className="px-2 py-1 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded text-xs font-medium"
                              >
                                Lihat
                              </button>
                              <button
                                onClick={() => onOpenDisposalModal(bottle, 1)}
                                className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-semibold shadow-2xs transition-colors flex items-center gap-1"
                              >
                                <Trash2 className="w-3 h-3" />
                                <span>Tanda Pelupusan</span>
                              </button>
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

          {/* Tab 2: Hampir Luput */}
          {activeAlertTab === 'EXPIRING_SOON' && (
            <div>
              {metrics.expiringSoonBottles.length === 0 ? (
                <div className="py-12 text-center text-slate-500">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                  <p className="font-semibold text-slate-800 text-sm">Tiada botol dalam lingkungan luput 90 hari.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50/50 text-[11px] font-mono uppercase text-slate-500">
                        <th className="py-2.5 px-4 font-semibold">ID Botol</th>
                        <th className="py-2.5 px-4 font-semibold">Nama Bahan Kimia & Jenama</th>
                        <th className="py-2.5 px-4 font-semibold">Lokasi Semasa</th>
                        <th className="py-2.5 px-4 font-semibold">Tarikh Luput</th>
                        <th className="py-2.5 px-4 font-semibold">Hazard GHS</th>
                        <th className="py-2.5 px-4 font-semibold text-right">Tindakan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {metrics.expiringSoonBottles.map(bottle => (
                        <tr key={bottle.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-4 font-mono font-bold text-amber-800 whitespace-nowrap">
                            {bottle.id}
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-semibold text-slate-900 block">{bottle.chemicalName}</span>
                            <span className="text-[11px] text-slate-500">{bottle.brand} · {bottle.containerSize}</span>
                          </td>
                          <td className="py-3 px-4 text-slate-700">
                            {getLocationName(bottle.locationId)}
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <ExpiryBadge expiryDate={bottle.expiryDate} size="sm" />
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex flex-wrap gap-1">
                              {bottle.hazardClasses.slice(0, 2).map(h => (
                                <GHSBadge key={h} hazard={h} size="sm" />
                              ))}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right whitespace-nowrap">
                            <div className="inline-flex items-center gap-1.5">
                              <button
                                onClick={() => onSelectBottle(bottle)}
                                className="px-2 py-1 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded text-xs font-medium"
                              >
                                Lihat
                              </button>
                              <button
                                onClick={() => onOpenMoveModal(bottle)}
                                className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-semibold shadow-2xs transition-colors flex items-center gap-1"
                              >
                                <ArrowRightLeft className="w-3 h-3" />
                                <span>Pindah ke Makmal</span>
                              </button>
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

          {/* Tab 3: Stok Rendah */}
          {activeAlertTab === 'LOW_STOCK' && (
            <div>
              {metrics.lowStockChemicals.length === 0 ? (
                <div className="py-12 text-center text-slate-500">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                  <p className="font-semibold text-slate-800 text-sm">Semua stok bahan kimia mencukupi melepasi paras minimum.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50/50 text-[11px] font-mono uppercase text-slate-500">
                        <th className="py-2.5 px-4 font-semibold">Nama Bahan Kimia</th>
                        <th className="py-2.5 px-4 font-semibold">Baki Aktif</th>
                        <th className="py-2.5 px-4 font-semibold">Ambang Minimum</th>
                        <th className="py-2.5 px-4 font-semibold">Status Defisit</th>
                        <th className="py-2.5 px-4 font-semibold text-right">Tindakan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {metrics.lowStockChemicals.map(chem => (
                        <tr key={chem.chemicalName} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-4 font-semibold text-slate-900">
                            {chem.chemicalName}
                          </td>
                          <td className="py-3 px-4 font-mono font-bold text-red-700">
                            {chem.activeCount} botol
                          </td>
                          <td className="py-3 px-4 font-mono text-slate-500">
                            ≤ {chem.minThreshold} botol
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-mono text-xs text-orange-700 font-semibold">
                              {chem.activeCount === 0 ? 'HABIS (0 botol)' : `Kurang ${chem.deficit} botol`}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => onNavigateTab('stock-in')}
                              className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold shadow-2xs transition-colors inline-flex items-center gap-1"
                            >
                              <PlusCircle className="w-3 h-3" />
                              <span>Tambah Stok</span>
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
      </div>

      {/* Matriks Lokasi Makmal & Stor */}
      <div className="bg-white rounded-md border border-slate-200 p-4">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Building className="w-4 h-4 text-slate-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Kapasiti Botol Aktif Mengikut Lokasi
            </h3>
          </div>
          <span className="font-mono text-[11px] text-slate-400">
            {locations.length} lokasi berdaftar
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
          {locations.map(loc => {
            const countInLoc = bottles.filter(
              b => b.locationId === loc.id && (b.status === 'IN_STORE' || b.status === 'IN_LAB')
            ).length;

            return (
              <div
                key={loc.id}
                onClick={() => onNavigateTab('inventory')}
                className="p-2.5 rounded border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-slate-300 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                  <span className="font-medium text-slate-800 truncate" title={loc.name}>
                    {loc.name}
                  </span>
                  <span className="font-mono text-[9px] uppercase px-1 py-0.2 rounded-2xs bg-slate-200 text-slate-700">
                    {loc.type}
                  </span>
                </div>
                <div className="text-lg font-bold font-mono text-slate-900 tabular-nums">
                  {countInLoc} <span className="text-[11px] font-normal text-slate-400">botol</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
