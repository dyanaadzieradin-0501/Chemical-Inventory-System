import React, { useState } from 'react';
import { Location, UserProfile, GHSHazard, ChemicalBottle } from '../types';
import { StorageService, getTodayDateString } from '../services/storageService';
import { QrCode, AlertCircle, FileText } from 'lucide-react';

interface StockInFormProps {
  locations: Location[];
  currentUser: UserProfile;
  onSuccessStockIn: (newBottles: ChemicalBottle[]) => void;
}

const ALL_GHS_HAZARDS: { id: GHSHazard; label: string; desc: string }[] = [
  { id: 'Flammable', label: 'Mudah Terbakar (Flammable)', desc: 'Pelarut cecair/gas mudah meruap terbakar' },
  { id: 'Corrosive', label: 'Mengakis (Corrosive)', desc: 'Asid/bes kuat merosakkan kulit & logam' },
  { id: 'Toxic', label: 'Toksik / Beracun (Toxic)', desc: 'Bahaya maut jika tertelan/terhidu' },
  { id: 'Health Hazard', label: 'Bahaya Kesihatan Kronik', desc: 'Karsinogen, ketoksikan organ khusus' },
  { id: 'Oxidizer', label: 'Pengoksida (Oxidizer)', desc: 'Menyumbang oksigen memarakkan kebakaran' },
  { id: 'Environmental Hazard', label: 'Bahaya Alam Sekitar', desc: 'Toksik kepada hidupan akuatik' },
  { id: 'Irritant / Harmful', label: 'Merengsa / Berbahaya', desc: 'Kerengsaan mata, kulit atau pernafasan' },
  { id: 'Explosive', label: 'Mudah Meletup', desc: 'Ketidakstabilan bahan kimia meletup' },
  { id: 'Compressed Gas', label: 'Gas Bermatpat', desc: 'Silinder bertekanan tinggi' },
];

export const StockInForm: React.FC<StockInFormProps> = ({
  locations,
  currentUser,
  onSuccessStockIn
}) => {
  const todayStr = getTodayDateString();

  const [chemicalName, setChemicalName] = useState('');
  const [casNumber, setCasNumber] = useState('');
  const [brand, setBrand] = useState('Merck Millipore');
  const [containerSize, setContainerSize] = useState('2.5 L');
  const [batchNumber, setBatchNumber] = useState(`MK-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`);
  const [expiryDate, setExpiryDate] = useState('2028-12-31');
  const [receivedDate, setReceivedDate] = useState(todayStr);
  const [supplierName, setSupplierName] = useState('Labchem Malaysia Sdn Bhd');
  const [locationId, setLocationId] = useState(locations[0]?.id || 'loc-01');
  const [selectedHazards, setSelectedHazards] = useState<GHSHazard[]>(['Flammable']);
  const [sdsLink, setSdsLink] = useState('https://www.sigmaaldrich.com/MY/en/sds/sial/179124');
  const [quantity, setQuantity] = useState<number>(3);

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const applyQuickTemplate = (templateType: 'ACETONE' | 'HCL' | 'METHANOL' | 'NAOH') => {
    if (templateType === 'ACETONE') {
      setChemicalName('Acetone (AR Grade)');
      setCasNumber('67-64-1');
      setBrand('Merck Millipore');
      setContainerSize('2.5 L');
      setBatchNumber(`ACT-${Math.floor(1000 + Math.random() * 9000)}`);
      setExpiryDate('2028-06-30');
      setSupplierName('Labchem Malaysia Sdn Bhd');
      setSelectedHazards(['Flammable', 'Irritant / Harmful']);
      setSdsLink('https://www.sigmaaldrich.com/MY/en/sds/sial/179124');
      const loc = locations.find(l => l.name.toLowerCase().includes('pelarut'));
      if (loc) setLocationId(loc.id);
    } else if (templateType === 'HCL') {
      setChemicalName('Hydrochloric Acid 37% (Fuming)');
      setCasNumber('7647-01-0');
      setBrand('Sigma-Aldrich');
      setContainerSize('2.5 L');
      setBatchNumber(`HCL-${Math.floor(1000 + Math.random() * 9000)}`);
      setExpiryDate('2028-10-15');
      setSupplierName('Mega Scientific Supplies');
      setSelectedHazards(['Corrosive', 'Toxic']);
      setSdsLink('https://www.sigmaaldrich.com/MY/en/sds/sigald/320331');
      const loc = locations.find(l => l.name.toLowerCase().includes('asid'));
      if (loc) setLocationId(loc.id);
    } else if (templateType === 'METHANOL') {
      setChemicalName('Methanol (HPLC Grade)');
      setCasNumber('67-56-1');
      setBrand('Fisher Chemical');
      setContainerSize('4.0 L');
      setBatchNumber(`MET-${Math.floor(1000 + Math.random() * 9000)}`);
      setExpiryDate('2028-04-20');
      setSupplierName('Prima Saintifik Sdn Bhd');
      setSelectedHazards(['Flammable', 'Toxic', 'Health Hazard']);
      setSdsLink('https://www.fishersci.com/store/msds?partNumber=A4524');
      const loc = locations.find(l => l.name.toLowerCase().includes('pelarut'));
      if (loc) setLocationId(loc.id);
    } else if (templateType === 'NAOH') {
      setChemicalName('Sodium Hydroxide Pellets (AR)');
      setCasNumber('1310-73-2');
      setBrand('R&M Chemicals');
      setContainerSize('1.0 kg');
      setBatchNumber(`NAOH-${Math.floor(1000 + Math.random() * 9000)}`);
      setExpiryDate('2029-01-15');
      setSupplierName('Bumi Sains Maju');
      setSelectedHazards(['Corrosive']);
      setSdsLink('https://www.sigmaaldrich.com/MY/en/sds/sial/s8045');
      const loc = locations.find(l => l.name.toLowerCase().includes('am'));
      if (loc) setLocationId(loc.id);
    }
  };

  const handleHazardToggle = (hazard: GHSHazard) => {
    if (selectedHazards.includes(hazard)) {
      if (selectedHazards.length === 1) {
        setError('Pilih sekurang-kurangnya satu Hazard Class GHS demi keselamatan makmal.');
        return;
      }
      setSelectedHazards(selectedHazards.filter(h => h !== hazard));
    } else {
      setSelectedHazards([...selectedHazards, hazard]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!chemicalName.trim()) {
      setError('Nama bahan kimia wajib diisi.');
      return;
    }
    if (!brand.trim()) {
      setError('Jenama pengeluar bahan kimia wajib diisi.');
      return;
    }
    if (!containerSize.trim()) {
      setError('Saiz bekas & unit wajib diisi.');
      return;
    }
    if (!batchNumber.trim()) {
      setError('No. Batch / Lot botol wajib diisi.');
      return;
    }
    if (!expiryDate) {
      setError('Tarikh luput bahan kimia wajib diisi.');
      return;
    }
    if (!receivedDate) {
      setError('Tarikh terima stok wajib diisi.');
      return;
    }
    if (!supplierName.trim()) {
      setError('Nama pembekal sah wajib diisi.');
      return;
    }
    if (!locationId) {
      setError('Sila pilih lokasi simpanan awal.');
      return;
    }
    if (selectedHazards.length === 0) {
      setError('Sila pilih sekurang-kurangnya satu Hazard Class GHS.');
      return;
    }

    try {
      const url = new URL(sdsLink);
      if (!url.protocol.startsWith('http')) {
        throw new Error('URL mesti bermula dengan http:// atau https://');
      }
    } catch {
      setError('Format SDS Link tidak sah. Sila masukkan URL lengkap (contoh: https://...)');
      return;
    }

    if (!quantity || quantity < 1 || !Number.isInteger(Number(quantity))) {
      setError('Kuantiti botol mestilah nombor bulat sekurang-kurangnya 1 unit.');
      return;
    }

    setIsSubmitting(true);

    try {
      const createdBottles = StorageService.registerStockIn(
        {
          chemicalName,
          casNumber,
          brand,
          containerSize,
          batchNumber,
          expiryDate,
          receivedDate,
          supplierName,
          locationId,
          hazardClasses: selectedHazards,
          sdsLink,
          quantity: Number(quantity)
        },
        currentUser
      );

      onSuccessStockIn(createdBottles);
    } catch (err: any) {
      setError('Ralat semasa mendaftar stok: ' + err.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Header Borang */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Pendaftaran Penerimaan Stok Masuk (Stock In)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Pendaftaran unit botol fizikal mengikut batch dan penjanaan label QR Code unik
          </p>
        </div>

        {/* Preset Makmal Lazim */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-mono text-slate-400">Preset:</span>
          <button
            type="button"
            onClick={() => applyQuickTemplate('ACETONE')}
            className="text-xs px-2 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded text-slate-700 transition-colors"
          >
            Acetone
          </button>
          <button
            type="button"
            onClick={() => applyQuickTemplate('HCL')}
            className="text-xs px-2 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded text-slate-700 transition-colors"
          >
            HCl 37%
          </button>
          <button
            type="button"
            onClick={() => applyQuickTemplate('METHANOL')}
            className="text-xs px-2 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded text-slate-700 transition-colors"
          >
            Methanol
          </button>
          <button
            type="button"
            onClick={() => applyQuickTemplate('NAOH')}
            className="text-xs px-2 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded text-slate-700 transition-colors"
          >
            NaOH
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded text-xs text-red-800 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Borang Utama */}
      <form onSubmit={handleSubmit} className="bg-white rounded-md border border-slate-200 p-5 space-y-6">
        {/* Seksyen 1: Maklumat Asas */}
        <div>
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 pb-1.5 border-b border-slate-100 mb-3">
            01. Pengenalan Bahan Kimia
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Nama Bahan Kimia <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={chemicalName}
                onChange={e => setChemicalName(e.target.value)}
                placeholder="Contoh: Acetone (AR Grade) atau Nitric Acid 65%"
                required
                className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                No. CAS Registry / Formula (Pilihan)
              </label>
              <input
                type="text"
                value={casNumber}
                onChange={e => setCasNumber(e.target.value)}
                placeholder="Contoh: 67-64-1"
                className="w-full px-3 py-2 border border-slate-300 rounded font-mono focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Jenama Pengeluar (Brand) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={brand}
                onChange={e => setBrand(e.target.value)}
                placeholder="Merck, Sigma-Aldrich, Fisher Chemical"
                required
                className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Saiz Bekas & Unit <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={containerSize}
                onChange={e => setContainerSize(e.target.value)}
                placeholder="2.5 L, 500 g, 1.0 L"
                required
                className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>
          </div>
        </div>

        {/* Seksyen 2: Batch, Lokasi & Kuantiti */}
        <div>
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 pb-1.5 border-b border-slate-100 mb-3">
            02. Kawalan Batch, Lokasi & Kuantiti
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                No. Batch / Lot <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={batchNumber}
                onChange={e => setBatchNumber(e.target.value)}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded font-mono focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Tarikh Terima <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={receivedDate}
                onChange={e => setReceivedDate(e.target.value)}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded font-mono focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Tarikh Luput <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={expiryDate}
                onChange={e => setExpiryDate(e.target.value)}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded font-mono font-semibold focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Kuantiti Botol <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                step="1"
                value={quantity}
                onChange={e => setQuantity(parseInt(e.target.value) || 1)}
                required
                className="w-full px-3 py-2 border border-blue-500 bg-blue-50/30 rounded font-mono font-bold text-blue-900 focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mt-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Nama Pembekal Sah <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={supplierName}
                onChange={e => setSupplierName(e.target.value)}
                placeholder="Labchem Malaysia Sdn Bhd"
                required
                className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Lokasi Simpanan Awal <span className="text-red-500">*</span>
              </label>
              <select
                value={locationId}
                onChange={e => setLocationId(e.target.value)}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
              >
                {locations.map(loc => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name} ({loc.type === 'STORE' ? 'Stor' : 'Makmal'})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Seksyen 3: Pematuhan GHS & SDS */}
        <div>
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 pb-1.5 border-b border-slate-100 mb-3">
            03. Keselamatan Makmal & Pautan SDS
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-2">
                Pilih Hazard Class GHS (Pilihan Berbilang) <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {ALL_GHS_HAZARDS.map(item => {
                  const isChecked = selectedHazards.includes(item.id);
                  return (
                    <label
                      key={item.id}
                      className={`flex items-start gap-2 p-2.5 rounded border cursor-pointer transition-colors ${
                        isChecked
                          ? 'border-blue-600 bg-blue-50/60 text-slate-900'
                          : 'border-slate-200 hover:border-slate-300 bg-white text-slate-600'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleHazardToggle(item.id)}
                        className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
                      />
                      <div>
                        <span className="font-semibold block">{item.label}</span>
                        <span className="text-[10px] text-slate-500">{item.desc}</span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Pautan Safety Data Sheet (SDS URL) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="url"
                  value={sdsLink}
                  onChange={e => setSdsLink(e.target.value)}
                  placeholder="https://www.sigmaaldrich.com/MY/en/sds/..."
                  required
                  className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded font-mono focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
                <FileText className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
              </div>
            </div>
          </div>
        </div>

        {/* Bar Tindakan Hantar */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-[11px] text-slate-600 font-mono flex items-center gap-2">
            <span>Pegawai Pendaftar:</span>
            <strong className="text-slate-900">{currentUser.name}</strong>
            <span
              className={`text-[9px] uppercase font-bold px-1.5 py-0.2 rounded ${
                currentUser.role === 'ADMIN'
                  ? 'bg-purple-100 text-purple-800 border border-purple-200'
                  : 'bg-blue-100 text-blue-800 border border-blue-200'
              }`}
            >
              {currentUser.role === 'ADMIN' ? 'Admin / Pegawai' : 'Staf Makmal'}
            </span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-md shadow-2xs transition-colors"
          >
            <QrCode className="w-4 h-4" />
            <span>Daftar {quantity} Unit Botol & Cetak Label QR</span>
          </button>
        </div>
      </form>
    </div>
  );
};
