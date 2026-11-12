import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { ChemicalBottle, Location } from '../types';
import { Printer, X, Tag } from 'lucide-react';
import { getExpiryStatus } from '../services/storageService';

interface QRModalProps {
  bottles: ChemicalBottle[];
  locations: Location[];
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export const QRModal: React.FC<QRModalProps> = ({
  bottles,
  locations,
  isOpen,
  onClose,
  title = 'Cetak Label QR Code Fizikal'
}) => {
  const printAreaRef = useRef<HTMLDivElement>(null);

  if (!isOpen || bottles.length === 0) return null;

  const getLocationName = (locId: string) => {
    return locations.find(l => l.id === locId)?.name || locId;
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-2xs overflow-y-auto no-print">
      <div className="relative w-full max-w-3xl bg-white rounded-md shadow-2xl border border-slate-300 overflow-hidden my-6">
        {/* Header Modal */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <Tag className="w-4 h-4 text-blue-600" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">{title}</h3>
              <p className="text-[11px] text-slate-500">
                Format pelekat standard botol makmal (70mm × 35mm) · {bottles.length} unit label
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Toolbar & Butang Cetak */}
        <div className="px-5 py-2.5 bg-blue-50/50 border-b border-blue-100 flex items-center justify-between gap-3 text-xs">
          <span className="text-slate-600">
            Sedia untuk dicetak pada kertas pelekat atau pencetak label.
          </span>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded text-xs shadow-2xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak Sekarang (Ctrl + P)</span>
          </button>
        </div>

        {/* Pratonton Label Pelekat Makmal */}
        <div className="p-5 max-h-[68vh] overflow-y-auto bg-slate-100">
          <div
            ref={printAreaRef}
            className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 print:grid print:grid-cols-2 print:gap-3 print:p-0 print:m-0"
          >
            {bottles.map(bottle => {
              const expStatus = getExpiryStatus(bottle.expiryDate);
              const isExpired = expStatus === 'EXPIRED';

              return (
                <div
                  key={bottle.id}
                  className="bg-white border border-slate-900 p-3 rounded-none shadow-2xs print:shadow-none print:border-black print-break-inside-avoid flex flex-col justify-between"
                  style={{ minHeight: '150px' }}
                >
                  {/* Bahagian Atas Label */}
                  <div className="border-b border-slate-300 pb-1.5 mb-1.5 flex items-start justify-between">
                    <div>
                      <span className="text-[8px] font-mono uppercase tracking-widest text-slate-500 block">
                        CHEMICAL INVENTORY SYSTEM (CIS)
                      </span>
                      <h4 className="font-bold text-slate-900 text-xs sm:text-sm leading-tight line-clamp-1">
                        {bottle.chemicalName}
                      </h4>
                      {bottle.casNumber && (
                        <span className="text-[10px] font-mono text-slate-600">
                          CAS: {bottle.casNumber}
                        </span>
                      )}
                    </div>
                    <span className="font-mono font-bold text-xs px-1.5 py-0.2 bg-slate-900 text-white rounded-none print:bg-black">
                      {bottle.id}
                    </span>
                  </div>

                  {/* Bahagian Tengah: Kod QR & Butiran */}
                  <div className="flex items-center gap-2.5">
                    <div className="p-1 bg-white border border-slate-300 shrink-0 flex items-center justify-center">
                      <QRCodeSVG
                        value={bottle.id}
                        size={72}
                        level="M"
                        includeMargin={false}
                      />
                    </div>

                    <div className="flex-1 text-[11px] space-y-0.5 text-slate-700">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Jenama / Saiz:</span>
                        <span className="font-semibold text-slate-900">{bottle.brand} · {bottle.containerSize}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Lot No:</span>
                        <span className="font-mono text-slate-900">{bottle.batchNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Lokasi:</span>
                        <span className="font-medium text-slate-900 truncate max-w-[110px]" title={getLocationName(bottle.locationId)}>
                          {getLocationName(bottle.locationId)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pt-0.5 border-t border-slate-200">
                        <span className="text-slate-500 font-semibold">Tarikh Luput:</span>
                        <span className={`font-mono font-bold ${isExpired ? 'text-red-700 underline' : 'text-slate-900'}`}>
                          {bottle.expiryDate}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bahagian Bawah: GHS Simbol Teks */}
                  <div className="mt-1.5 pt-1 border-t border-slate-200 flex items-center justify-between text-[9px] text-slate-500 font-mono">
                    <span className="truncate max-w-[160px]">{bottle.hazardClasses.slice(0, 2).join(', ')}</span>
                    <span>IMBAS QR UTK SDS</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-5 py-2.5 border-t border-slate-200 bg-slate-50 text-xs">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-slate-600 hover:text-slate-800 transition-colors"
          >
            Tutup
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded text-xs transition-colors"
          >
            Cetak {bottles.length} Label
          </button>
        </div>
      </div>
    </div>
  );
};
