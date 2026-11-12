import React, { useState, useMemo } from 'react';
import { ChemicalBottle, Location, UserProfile, GHSHazard } from '../types';
import { StatusBadge, ExpiryBadge } from './StatusBadge';
import { GHSBadge } from './GHSBadge';
import { getExpiryStatus } from '../services/storageService';
import {
  Search,
  QrCode,
  ArrowRightLeft,
  Trash2,
  Eye,
  ScanLine,
  RefreshCw,
  CheckSquare,
  Square,
  Printer,
  Layers,
  Filter
} from 'lucide-react';

interface InventoryListProps {
  bottles: ChemicalBottle[];
  locations: Location[];
  currentUser: UserProfile;
  onSelectBottle: (bottle: ChemicalBottle) => void;
  onOpenMoveModal: (bottle: ChemicalBottle) => void;
  onOpenDisposalModal: (bottle: ChemicalBottle, step: 1 | 2) => void;
  onOpenQRPrintModal: (bottle: ChemicalBottle) => void;
  onOpenBulkQRPrint: (bottles: ChemicalBottle[]) => void;
  onOpenScanner: () => void;
}

export const InventoryList: React.FC<InventoryListProps> = ({
  bottles,
  locations,
  currentUser,
  onSelectBottle,
  onOpenMoveModal,
  onOpenDisposalModal,
  onOpenQRPrintModal,
  onOpenBulkQRPrint,
  onOpenScanner
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocationId, setSelectedLocationId] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedExpiryCategory, setSelectedExpiryCategory] = useState<string>('ALL');
  const [selectedHazard, setSelectedHazard] = useState<string>('ALL');

  // Pemilihan pukal
  const [selectedBottleIds, setSelectedBottleIds] = useState<string[]>([]);

  const getLocationName = (locId: string) => {
    return locations.find(l => l.id === locId)?.name || locId;
  };

  // Penapisan & Carian Berprestasi Tinggi
  const filteredBottles = useMemo(() => {
    return bottles.filter(bottle => {
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase().trim();
        const matchName = bottle.chemicalName.toLowerCase().includes(query);
        const matchId = bottle.id.toLowerCase().includes(query);
        const matchCas = bottle.casNumber?.toLowerCase().includes(query);
        const matchBatch = bottle.batchNumber.toLowerCase().includes(query);
        const matchSupplier = bottle.supplierName.toLowerCase().includes(query);
        const matchBrand = bottle.brand.toLowerCase().includes(query);

        if (!matchName && !matchId && !matchCas && !matchBatch && !matchSupplier && !matchBrand) {
          return false;
        }
      }

      if (selectedLocationId !== 'ALL' && bottle.locationId !== selectedLocationId) {
        return false;
      }

      if (selectedStatus !== 'ALL' && bottle.status !== selectedStatus) {
        return false;
      }

      if (selectedExpiryCategory !== 'ALL') {
        const expStatus = getExpiryStatus(bottle.expiryDate);
        if (selectedExpiryCategory === 'EXPIRED' && expStatus !== 'EXPIRED') return false;
        if (selectedExpiryCategory === 'EXPIRING_SOON' && expStatus !== 'EXPIRING_SOON') return false;
        if (selectedExpiryCategory === 'GOOD' && expStatus !== 'GOOD') return false;
      }

      if (selectedHazard !== 'ALL') {
        if (!bottle.hazardClasses.includes(selectedHazard as GHSHazard)) {
          return false;
        }
      }

      return true;
    });
  }, [bottles, searchTerm, selectedLocationId, selectedStatus, selectedExpiryCategory, selectedHazard]);

  const handleSelectAll = () => {
    if (selectedBottleIds.length === filteredBottles.length) {
      setSelectedBottleIds([]);
    } else {
      setSelectedBottleIds(filteredBottles.map(b => b.id));
    }
  };

  const handleToggleSelectOne = (id: string) => {
    if (selectedBottleIds.includes(id)) {
      setSelectedBottleIds(selectedBottleIds.filter(item => item !== id));
    } else {
      setSelectedBottleIds([...selectedBottleIds, id]);
    }
  };

  const handlePrintSelected = () => {
    const selected = bottles.filter(b => selectedBottleIds.includes(b.id));
    if (selected.length > 0) {
      onOpenBulkQRPrint(selected);
    }
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedLocationId('ALL');
    setSelectedStatus('ALL');
    setSelectedExpiryCategory('ALL');
    setSelectedHazard('ALL');
  };

  const isFilteringActive =
    searchTerm ||
    selectedLocationId !== 'ALL' ||
    selectedStatus !== 'ALL' ||
    selectedExpiryCategory !== 'ALL' ||
    selectedHazard !== 'ALL';

  return (
    <div className="space-y-4">
      {/* Header & Bar Tindakan */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Katalog & Inventori Bahan Kimia
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Pangkalan data {bottles.length} unit botol fizikal aktif dan berjadual
          </p>
        </div>

        <div className="flex items-center gap-2">
          {selectedBottleIds.length > 0 && (
            <button
              onClick={handlePrintSelected}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-semibold shadow-2xs transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak {selectedBottleIds.length} Label</span>
            </button>
          )}

          <button
            onClick={onOpenScanner}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-semibold shadow-2xs transition-colors"
          >
            <ScanLine className="w-3.5 h-3.5" />
            <span>Imbas QR</span>
          </button>
        </div>
      </div>

      {/* Integrated Lab Toolbar (Carian & Penapis Bersepadu) */}
      <div className="bg-white rounded-md border border-slate-200 p-3 space-y-2.5">
        {/* Bar Carian */}
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Carian pantas: Taip nama bahan kimia, No. CAS (cth: 67-64-1), ID botol (cth: CIS-2026-0001), no. batch, atau pembekal..."
            className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded text-xs bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 font-mono transition-colors"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-2.5 text-[11px] text-slate-400 hover:text-slate-700 font-mono"
            >
              [Padam]
            </button>
          )}
        </div>

        {/* Dropdown Filters Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
          <div>
            <select
              value={selectedLocationId}
              onChange={e => setSelectedLocationId(e.target.value)}
              className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-600"
            >
              <option value="ALL">Semua Lokasi ({locations.length})</option>
              {locations.map(loc => (
                <option key={loc.id} value={loc.id}>
                  {loc.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-600"
            >
              <option value="ALL">Semua Status Kitaran</option>
              <option value="IN_STORE">Dalam Stor</option>
              <option value="IN_LAB">Di Makmal</option>
              <option value="PENDING_DISPOSAL">Menunggu Pelupusan</option>
              <option value="DISPOSED">Telah Dilupuskan</option>
            </select>
          </div>

          <div>
            <select
              value={selectedExpiryCategory}
              onChange={e => setSelectedExpiryCategory(e.target.value)}
              className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-600"
            >
              <option value="ALL">Semua Tarikh Luput</option>
              <option value="EXPIRED">Telah Luput (Merah)</option>
              <option value="EXPIRING_SOON">Hampir Luput ≤ 90 hari</option>
              <option value="GOOD">Masih Sah &gt; 90 hari</option>
            </select>
          </div>

          <div>
            <select
              value={selectedHazard}
              onChange={e => setSelectedHazard(e.target.value)}
              className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-600"
            >
              <option value="ALL">Semua Hazard GHS</option>
              <option value="Flammable">Mudah Terbakar</option>
              <option value="Corrosive">Mengakis (Corrosive)</option>
              <option value="Toxic">Toksik / Beracun</option>
              <option value="Health Hazard">Bahaya Kesihatan</option>
              <option value="Oxidizer">Pengoksida</option>
              <option value="Environmental Hazard">Bahaya Alam Sekitar</option>
              <option value="Irritant / Harmful">Merengsa / Berbahaya</option>
            </select>
          </div>
        </div>

        {/* Status Penapis */}
        {isFilteringActive && (
          <div className="flex items-center justify-between pt-1 text-[11px] text-slate-600 border-t border-slate-100">
            <span>
              Menunjukkan <strong className="font-mono text-slate-900">{filteredBottles.length}</strong> daripada {bottles.length} botol berpadanan.
            </span>
            <button
              onClick={handleResetFilters}
              className="text-blue-600 hover:text-blue-800 font-semibold inline-flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Set Semula Penapis</span>
            </button>
          </div>
        )}
      </div>

      {/* Jadual Inventori Berketepatan Tinggi */}
      <div className="bg-white rounded-md border border-slate-200 overflow-hidden">
        {filteredBottles.length === 0 ? (
          <div className="py-14 text-center space-y-2">
            <Layers className="w-8 h-8 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-800 text-sm">Tiada Rekod Botol Ditemui</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Sila cuba kata carian lain atau set semula penapis lokasi dan status.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded"
            >
              Set Semula Penapis
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-mono uppercase text-slate-500">
                  <th className="py-2.5 px-3 w-8 text-center">
                    <button
                      onClick={handleSelectAll}
                      className="p-0.5 text-slate-400 hover:text-slate-800 transition-colors"
                      title="Pilih Semua Botol Untuk Cetakan"
                    >
                      {selectedBottleIds.length === filteredBottles.length && filteredBottles.length > 0 ? (
                        <CheckSquare className="w-3.5 h-3.5 text-blue-600" />
                      ) : (
                        <Square className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </th>
                  <th className="py-2.5 px-3 font-semibold">ID Botol</th>
                  <th className="py-2.5 px-3 font-semibold">Nama Bahan & Pengeluar</th>
                  <th className="py-2.5 px-3 font-semibold">Saiz / Batch</th>
                  <th className="py-2.5 px-3 font-semibold">Lokasi Semasa</th>
                  <th className="py-2.5 px-3 font-semibold">Status</th>
                  <th className="py-2.5 px-3 font-semibold">Tarikh Luput</th>
                  <th className="py-2.5 px-3 font-semibold">GHS Hazard</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredBottles.map(bottle => {
                  const isSelected = selectedBottleIds.includes(bottle.id);
                  const isDisposed = bottle.status === 'DISPOSED';
                  const isPendingDisposal = bottle.status === 'PENDING_DISPOSAL';

                  return (
                    <tr
                      key={bottle.id}
                      className={`hover:bg-slate-50/70 transition-colors ${isSelected ? 'bg-blue-50/40' : ''}`}
                    >
                      {/* Checkbox */}
                      <td className="py-2.5 px-3 text-center">
                        <button
                          onClick={() => handleToggleSelectOne(bottle.id)}
                          className="p-0.5 text-slate-400 hover:text-blue-600"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-3.5 h-3.5 text-blue-600" />
                          ) : (
                            <Square className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </td>

                      {/* ID Botol */}
                      <td className="py-2.5 px-3 font-mono font-bold text-blue-700 whitespace-nowrap">
                        <button
                          onClick={() => onSelectBottle(bottle)}
                          className="hover:underline"
                        >
                          {bottle.id}
                        </button>
                      </td>

                      {/* Nama Bahan & Pengeluar */}
                      <td className="py-2.5 px-3">
                        <div
                          onClick={() => onSelectBottle(bottle)}
                          className="cursor-pointer hover:text-blue-700"
                        >
                          <span className="font-semibold text-slate-900 block leading-tight">{bottle.chemicalName}</span>
                          <span className="text-[11px] text-slate-400">
                            {bottle.brand} {bottle.casNumber ? `· CAS: ${bottle.casNumber}` : ''}
                          </span>
                        </div>
                      </td>

                      {/* Saiz & Batch */}
                      <td className="py-2.5 px-3 font-mono text-slate-700 whitespace-nowrap">
                        <div className="font-medium text-slate-900">{bottle.containerSize}</div>
                        <div className="text-[10px] text-slate-400">Lot: {bottle.batchNumber}</div>
                      </td>

                      {/* Lokasi Semasa */}
                      <td className="py-2.5 px-3 text-slate-800">
                        <span className="font-normal text-slate-900 truncate max-w-[160px] block" title={getLocationName(bottle.locationId)}>
                          {getLocationName(bottle.locationId)}
                        </span>
                      </td>

                      {/* Status Botol */}
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <StatusBadge status={bottle.status} size="sm" />
                      </td>

                      {/* Tarikh Luput */}
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <ExpiryBadge expiryDate={bottle.expiryDate} size="sm" />
                      </td>

                      {/* Hazard GHS */}
                      <td className="py-2.5 px-3">
                        <div className="flex flex-wrap gap-1 max-w-[150px]">
                          {bottle.hazardClasses.slice(0, 2).map(h => (
                            <GHSBadge key={h} hazard={h} size="sm" />
                          ))}
                          {bottle.hazardClasses.length > 2 && (
                            <span className="text-[10px] text-slate-400 font-mono">+{bottle.hazardClasses.length - 2}</span>
                          )}
                        </div>
                      </td>

                      {/* Butang Tindakan */}
                      <td className="py-2.5 px-3 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => onOpenQRPrintModal(bottle)}
                            className="p-1 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded"
                            title="Cetak Label QR Botol"
                          >
                            <QrCode className="w-3.5 h-3.5" />
                          </button>

                          {!isDisposed && (
                            <button
                              onClick={() => onOpenMoveModal(bottle)}
                              className="p-1 text-slate-600 hover:text-blue-700 hover:bg-slate-100 rounded"
                              title="Pindah / Ambil ke Makmal"
                            >
                              <ArrowRightLeft className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {!isDisposed && !isPendingDisposal && (
                            <button
                              onClick={() => onOpenDisposalModal(bottle, 1)}
                              className="p-1 text-slate-500 hover:text-amber-700 hover:bg-slate-100 rounded"
                              title="Tanda Menunggu Pelupusan"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}

                          <button
                            onClick={() => onSelectBottle(bottle)}
                            className="p-1 text-slate-600 hover:text-blue-700 hover:bg-slate-100 rounded font-semibold text-xs"
                            title="Buka Lembaran Data Penuh"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
