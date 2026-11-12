import React, { useState } from 'react';
import { ChemicalBottle, Location, ChemicalThreshold, UserProfile } from '../types';
import { StorageService } from '../services/storageService';
import {
  FileSpreadsheet,
  Printer,
  Download,
  Upload,
  RotateCcw,
  Plus,
  Building,
  Sliders,
  CheckCircle2,
  AlertCircle,
  Database,
  Lock
} from 'lucide-react';

interface ReportsAndSettingsProps {
  bottles: ChemicalBottle[];
  locations: Location[];
  thresholds: ChemicalThreshold[];
  currentUser: UserProfile;
  onRefreshData: () => void;
}

export const ReportsAndSettings: React.FC<ReportsAndSettingsProps> = ({
  bottles,
  locations,
  thresholds,
  currentUser,
  onRefreshData
}) => {
  const isAdmin = currentUser.role === 'ADMIN';

  // State Pengurusan Lokasi
  const [newLocName, setNewLocName] = useState('');
  const [newLocType, setNewLocType] = useState<'STORE' | 'LAB'>('LAB');
  const [newLocDesc, setNewLocDesc] = useState('');

  // State Ambang Stok
  const [selectedChemForThreshold, setSelectedChemForThreshold] = useState('');
  const [newThresholdCount, setNewThresholdCount] = useState<number>(2);

  // Status maklum balas
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const uniqueChemicalNames = Array.from(new Set(bottles.map(b => b.chemicalName))).sort();

  const handleAddLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      setErrorMsg('Akses Disekat: Hanya Admin / Pegawai Makmal boleh menambah lokasi.');
      return;
    }
    if (!newLocName.trim()) {
      setErrorMsg('Nama bilik makmal / stor wajib diisi.');
      return;
    }

    StorageService.addLocation(newLocName, newLocType, newLocDesc);
    setSuccessMsg(`Lokasi baharu "${newLocName}" berjaya ditambah.`);
    setNewLocName('');
    setNewLocDesc('');
    onRefreshData();
  };

  const handleUpdateThreshold = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      setErrorMsg('Akses Disekat: Hanya Admin boleh mengubah ambang paras minimum.');
      return;
    }
    if (!selectedChemForThreshold) {
      setErrorMsg('Pilih bahan kimia terlebih dahulu.');
      return;
    }

    StorageService.setThreshold(selectedChemForThreshold, Number(newThresholdCount));
    setSuccessMsg(`Ambang stok minimum bagi "${selectedChemForThreshold}" dikemas kini ke ${newThresholdCount} botol.`);
    onRefreshData();
  };

  const handleExportCSV = (type: 'ALL' | 'EXPIRED' | 'DISPOSED') => {
    const csvContent = StorageService.exportToCSV(type);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const dateStr = new Date().toISOString().split('T')[0];
    link.setAttribute('href', url);
    link.setAttribute('download', `CIS_Laporan_${type}_${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setSuccessMsg(`Laporan fail CSV (${type}) berjaya dimuat turun.`);
  };

  const handlePrintReport = () => {
    window.print();
  };

  const handleDownloadBackup = () => {
    const jsonStr = StorageService.exportBackupJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `CIS_Backup_Data_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setSuccessMsg('Fail sandaran JSON berjaya dimuat turun.');
  };

  const handleRestoreBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      const content = event.target?.result as string;
      const res = StorageService.importBackupJSON(content);
      if (res.success) {
        setSuccessMsg(res.message);
        onRefreshData();
      } else {
        setErrorMsg(res.message);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleResetSeed = () => {
    if (window.confirm('Adakah anda pasti ingin menetapkan semula semua data kepada data permulaan 14 botol makmal Malaysia?')) {
      StorageService.resetToSeedData();
      setSuccessMsg('Data berjaya diset semula kepada data contoh permulaan.');
      onRefreshData();
    }
  };

  return (
    <div className="space-y-4">
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Pusat Laporan Audit & Pengurusan Sistem
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Eksport data inventori, konfigurasi bilik makmal, penetapan paras minimum, dan sandaran fail
          </p>
        </div>

        <button
          onClick={handlePrintReport}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-semibold shadow-2xs transition-colors shrink-0"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Cetak Dokumen Laporan (Ctrl + P)</span>
        </button>
      </div>

      {/* Maklum Balas */}
      {successMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg(null)} className="font-bold text-xs">✕</button>
        </div>
      )}

      {errorMsg && (
        <div className="p-3 bg-red-50 border border-red-200 rounded text-xs text-red-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
          <button onClick={() => setErrorMsg(null)} className="font-bold text-xs">✕</button>
        </div>
      )}

      {/* Bahagian 1: Laporan Audit CSV */}
      <div className="bg-white rounded-md border border-slate-200 p-4 space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <FileSpreadsheet className="w-4 h-4 text-slate-700" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Penjanaan Laporan Audit Rasmi (Format CSV / Spreadsheet)
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded flex flex-col justify-between space-y-2">
            <div>
              <div className="font-semibold text-slate-900">Laporan Inventori Lengkap</div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Semua rekod botol, lokasi, batch, pembekal dan hazard GHS.
              </p>
            </div>
            <button
              onClick={() => handleExportCSV('ALL')}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-blue-700 border border-slate-300 rounded font-semibold text-xs transition-colors"
            >
              <Download className="w-3 h-3" />
              <span>Muat Turun ({bottles.length} Botol)</span>
            </button>
          </div>

          <div className="p-3 bg-red-50/40 border border-red-200 rounded flex flex-col justify-between space-y-2">
            <div>
              <div className="font-semibold text-red-900">Laporan Tamat Tempoh & Risiko</div>
              <p className="text-[11px] text-red-700 mt-0.5">
                Botol telah luput dan hampir luput $\le$ 90 hari untuk semakan OSH.
              </p>
            </div>
            <button
              onClick={() => handleExportCSV('EXPIRED')}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded font-semibold text-xs shadow-2xs transition-colors"
            >
              <Download className="w-3 h-3" />
              <span>Muat Turun Laporan Luput</span>
            </button>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded flex flex-col justify-between space-y-2">
            <div>
              <div className="font-semibold text-slate-900">Laporan Pelupusan Sisa DOE</div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Arkib rekod botol yang telah disahkan pelupusan bersama No. Rujukan fail.
              </p>
            </div>
            <button
              onClick={() => handleExportCSV('DISPOSED')}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded font-semibold text-xs transition-colors"
            >
              <Download className="w-3 h-3" />
              <span>Muat Turun Arkib DOE</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bahagian 2: Pengurusan Bilik Makmal & Stor (Admin) */}
      <div className="bg-white rounded-md border border-slate-200 p-4 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Building className="w-4 h-4 text-slate-700" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Pengurusan Lokasi Makmal & Stor ({locations.length} Lokasi)
            </h2>
          </div>
          {!isAdmin && (
            <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
              <Lock className="w-3 h-3" /> Admin Sahaja
            </span>
          )}
        </div>

        {/* Senarai Lokasi */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-xs">
          {locations.map(loc => (
            <div key={loc.id} className="p-2 border border-slate-200 rounded bg-slate-50/50">
              <div className="font-semibold text-slate-800 truncate" title={loc.name}>
                {loc.name}
              </div>
              <span className="font-mono text-[9px] uppercase text-slate-400">
                {loc.type === 'STORE' ? 'Stor Simpanan' : 'Bilik Makmal'}
              </span>
            </div>
          ))}
        </div>

        {/* Borang Tambah Lokasi */}
        {isAdmin && (
          <form onSubmit={handleAddLocation} className="pt-2 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            <input
              type="text"
              value={newLocName}
              onChange={e => setNewLocName(e.target.value)}
              placeholder="Nama lokasi baharu..."
              className="px-2.5 py-1.5 border border-slate-300 rounded bg-white"
              required
            />
            <select
              value={newLocType}
              onChange={e => setNewLocType(e.target.value as 'STORE' | 'LAB')}
              className="px-2.5 py-1.5 border border-slate-300 rounded bg-white"
            >
              <option value="LAB">Bilik Makmal Pengujian</option>
              <option value="STORE">Stor Simpanan Pusat</option>
            </select>
            <button
              type="submit"
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded shadow-2xs transition-colors inline-flex items-center justify-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Daftar Lokasi</span>
            </button>
          </form>
        )}
      </div>

      {/* Bahagian 3: Konfigurasi Ambang Stok */}
      <div className="bg-white rounded-md border border-slate-200 p-4 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-slate-700" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Konfigurasi Paras Minimum Stok Rendah
            </h2>
          </div>
          <span className="text-[11px] font-mono text-slate-400">Nilai lalai: ≤ 2 botol</span>
        </div>

        {isAdmin ? (
          <form onSubmit={handleUpdateThreshold} className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            <select
              value={selectedChemForThreshold}
              onChange={e => {
                const chem = e.target.value;
                setSelectedChemForThreshold(chem);
                const curr = thresholds.find(t => t.chemicalName.toLowerCase() === chem.toLowerCase());
                if (curr) setNewThresholdCount(curr.minStockCount);
              }}
              required
              className="px-2.5 py-1.5 border border-slate-300 rounded bg-white"
            >
              <option value="">-- Pilih Bahan Kimia --</option>
              {uniqueChemicalNames.map(chem => (
                <option key={chem} value={chem}>
                  {chem}
                </option>
              ))}
            </select>

            <input
              type="number"
              min="1"
              max="50"
              value={newThresholdCount}
              onChange={e => setNewThresholdCount(parseInt(e.target.value) || 1)}
              placeholder="Ambang minimum..."
              className="px-2.5 py-1.5 border border-slate-300 rounded bg-white font-mono"
              required
            />

            <button
              type="submit"
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded shadow-2xs transition-colors"
            >
              Simpan Paras Minimum
            </button>
          </form>
        ) : (
          <p className="text-xs text-slate-400 italic">
            Hanya Admin / Pegawai Sains dibenarkan mengubah suai paras minimum stok.
          </p>
        )}
      </div>

      {/* Bahagian 4: Sandaran Data Pelayar */}
      <div className="bg-white rounded-md border border-slate-200 p-4 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-slate-700" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Sandaran Data & Pemulihan (JSON Backup)
            </h2>
          </div>
          <span className="text-[11px] font-mono text-slate-400">localStorage: cis_malaysia_v1_data</span>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <button
            onClick={handleDownloadBackup}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded shadow-2xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Muat Turun Sandaran (Backup JSON)</span>
          </button>

          {isAdmin && (
            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded font-semibold cursor-pointer transition-colors">
              <Upload className="w-3.5 h-3.5 text-slate-500" />
              <span>Pulihkan Dari JSON</span>
              <input type="file" accept=".json" onChange={handleRestoreBackup} className="hidden" />
            </label>
          )}

          {isAdmin && (
            <button
              onClick={handleResetSeed}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-slate-500 hover:text-slate-800 ml-auto transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Set Semula Demo (14 Botol)</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
