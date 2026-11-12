import React, { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { X, AlertCircle, ScanLine, Keyboard, ArrowRight } from 'lucide-react';
import { ChemicalBottle } from '../types';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBottleFound: (bottle: ChemicalBottle) => void;
  bottles: ChemicalBottle[];
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({
  isOpen,
  onClose,
  onBottleFound,
  bottles
}) => {
  const [manualInput, setManualInput] = useState('');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setErrorMessage(null);
      setCameraError(null);
      setManualInput('');
      startCamera();
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isOpen]);

  const handleDetectedCode = (decodedText: string) => {
    const cleanId = decodedText.trim().toUpperCase();
    const found = bottles.find(b => b.id.toUpperCase() === cleanId);
    if (found) {
      stopCamera();
      onBottleFound(found);
      onClose();
    } else {
      setErrorMessage(`ID Botol "${decodedText}" tidak dijumpai dalam inventori makmal.`);
    }
  };

  const startCamera = async () => {
    try {
      setCameraError(null);
      setIsScanning(true);

      const element = document.getElementById('qr-reader-container');
      if (!element) return;

      const html5QrCode = new Html5Qrcode('qr-reader-container');
      scannerRef.current = html5QrCode;

      const qrCodeSuccessCallback = (decodedText: string) => {
        handleDetectedCode(decodedText);
      };

      const config = {
        fps: 12,
        qrbox: { width: 220, height: 220 },
        aspectRatio: 1.0
      };

      await html5QrCode.start(
        { facingMode: 'environment' },
        config,
        qrCodeSuccessCallback,
        undefined
      );
    } catch (err: any) {
      setIsScanning(false);
      setCameraError(
        'Kamera peranti tidak dapat diakses atau kebenaran belum dibenarkan. Anda boleh memasukkan ID botol secara manual di bawah atau menggunakan pengimbas USB kod bar.'
      );
    }
  };

  const stopCamera = async () => {
    if (scannerRef.current && isScanning) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      } catch (err) {
        // abaikan
      }
      scannerRef.current = null;
      setIsScanning(false);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualInput.trim()) return;

    const cleanInput = manualInput.trim().toUpperCase();
    let found = bottles.find(b => b.id.toUpperCase() === cleanInput);

    if (!found && /^\d+$/.test(cleanInput)) {
      const paddedId = `CIS-2026-${cleanInput.padStart(4, '0')}`;
      found = bottles.find(b => b.id.toUpperCase() === paddedId);
    }

    if (found) {
      stopCamera();
      onBottleFound(found);
      onClose();
    } else {
      setErrorMessage(`Botol dengan ID "${manualInput}" tidak dijumpai.`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-2xs">
      <div className="relative w-full max-w-md bg-white rounded-md shadow-2xl border border-slate-300 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Modal */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <ScanLine className="w-4 h-4 text-slate-700" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">Pengimbas QR Code Makmal</h3>
              <p className="text-[11px] text-slate-500">Halakan lensa kamera pada kod QR pelekat botol</p>
            </div>
          </div>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="p-1 text-slate-400 hover:text-slate-600 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Kandungan Imbasan */}
        <div className="p-5 overflow-y-auto space-y-3.5">
          {errorMessage && (
            <div className="p-2.5 bg-red-50 border border-red-200 rounded text-xs text-red-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Viewport Kamera */}
          <div className="relative rounded bg-slate-950 border border-slate-800 aspect-square max-h-[250px] mx-auto flex items-center justify-center overflow-hidden">
            <div id="qr-reader-container" className="w-full h-full"></div>

            {cameraError && (
              <div className="absolute inset-0 bg-slate-950/90 text-white p-4 flex flex-col items-center justify-center text-center space-y-2">
                <AlertCircle className="w-8 h-8 text-amber-400" />
                <p className="text-xs text-slate-300 leading-normal px-2">
                  {cameraError}
                </p>
                <button
                  type="button"
                  onClick={startCamera}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-xs font-semibold rounded text-white transition-colors"
                >
                  Cuba Sekali Lagi
                </button>
              </div>
            )}
          </div>

          {/* Input Carian ID Manual / USB Scanner */}
          <div className="pt-2 border-t border-slate-200 text-xs">
            <div className="flex items-center gap-1.5 font-semibold text-slate-700 mb-1.5">
              <Keyboard className="w-3.5 h-3.5 text-slate-400" />
              <span>Input Pantas ID Botol / Barcode Scanner:</span>
            </div>
            <form onSubmit={handleManualSubmit} className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={manualInput}
                onChange={e => {
                  setManualInput(e.target.value);
                  setErrorMessage(null);
                }}
                placeholder="Contoh: CIS-2026-0001 atau taip 1"
                className="flex-1 px-3 py-2 border border-slate-300 rounded font-mono text-xs focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
              <button
                type="submit"
                className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded text-xs inline-flex items-center gap-1 shadow-2xs transition-colors"
              >
                <span>Buka</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
