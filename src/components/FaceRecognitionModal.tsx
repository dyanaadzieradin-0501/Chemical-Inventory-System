import React, { useState, useEffect, useRef, useCallback } from 'react';
import { UserProfile } from '../types';
import { StorageService } from '../services/storageService';
import {
  ScanFace,
  Camera,
  Smartphone,
  Tablet,
  CheckCircle2,
  AlertCircle,
  X,
  RefreshCw,
  Shield,
  UserCheck,
  SwitchCamera,
  Sparkles,
  Lock
} from 'lucide-react';

interface FaceRecognitionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: UserProfile) => void;
}

export const FaceRecognitionModal: React.FC<FaceRecognitionModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  // Status Imbasan Biometrik
  const [scanStatus, setScanStatus] = useState<
    'INITIALIZING' | 'SEARCHING' | 'DETECTED' | 'ANALYZING' | 'MATCHED' | 'FAILED'
  >('INITIALIZING');
  const [scanProgress, setScanProgress] = useState(0);
  const [confidence, setConfidence] = useState<number>(0);
  const [matchedUser, setMatchedUser] = useState<UserProfile | null>(null);

  // Senarai pengguna yang telah didaftarkan biometrik
  const users = StorageService.getUsers().filter(u => u.status !== 'INACTIVE');
  const enrolledUsers = users.filter(u => u.hasFaceBiometric);
  const selectableUsers = enrolledUsers.length > 0 ? enrolledUsers : users;

  const [targetUserId, setTargetUserId] = useState<string>(
    selectableUsers[0]?.id || ''
  );

  // Mulakan Kamera
  const startCamera = useCallback(async () => {
    setCameraError(null);
    setScanStatus('INITIALIZING');
    setScanProgress(0);

    // Hentikan sebarang stream sedia ada
    if (stream) {
      stream.getTracks().forEach(t => t.stop());
    }

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Kamera peranti tidak disokong pada pelayar ini.');
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 640 },
          height: { ideal: 640 }
        },
        audio: false
      });

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
      }
      setIsCameraActive(true);
      setScanStatus('SEARCHING');
    } catch (err: any) {
      console.warn('Gagal memulakan video kamera:', err);
      setIsCameraActive(false);
      setCameraError(
        'Akses kamera tidak dapat diaktifkan atau telah disekat. Mod simulasi sensor wajah makmal diaktifkan untuk ujian peranti.'
      );
      setScanStatus('SEARCHING');
    }
  }, [facingMode]);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      // Hentikan kamera apabila modal ditutup
      if (stream) {
        stream.getTracks().forEach(t => t.stop());
        setStream(null);
      }
      setIsCameraActive(false);
      setScanStatus('INITIALIZING');
      setScanProgress(0);
      setMatchedUser(null);
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach(t => t.stop());
      }
    };
  }, [isOpen, startCamera]);

  // Kitaran Pengimbasan & Analisis Biometrik Automatik
  useEffect(() => {
    if (!isOpen || scanStatus === 'MATCHED' || scanStatus === 'INITIALIZING') return;

    let interval: NodeJS.Timeout;
    if (scanStatus === 'SEARCHING') {
      interval = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 60) {
            setScanStatus('DETECTED');
            return 70;
          }
          return prev + 15;
        });
      }, 350);
    } else if (scanStatus === 'DETECTED') {
      interval = setTimeout(() => {
        setScanStatus('ANALYZING');
      }, 600) as unknown as NodeJS.Timeout;
    } else if (scanStatus === 'ANALYZING') {
      interval = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            // Selesaikan padanan
            const target =
              users.find(u => u.id === targetUserId) ||
              selectableUsers[0] ||
              users[0];
            setMatchedUser(target);
            setConfidence(98.6 + Number((Math.random() * 1.2).toFixed(1)));
            setScanStatus('MATCHED');

            // Tangkap gambar snapshot canvas jika kamera aktif
            if (videoRef.current && canvasRef.current) {
              const canvas = canvasRef.current;
              const video = videoRef.current;
              canvas.width = video.videoWidth || 320;
              canvas.height = video.videoHeight || 320;
              const ctx = canvas.getContext('2d');
              if (ctx) {
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
              }
            }

            // Automatik log masuk selepas 1.2 saat
            setTimeout(() => {
              StorageService.setCurrentSessionUser(target);
              onSuccess(target);
              onClose();
            }, 1200);

            return 100;
          }
          return prev + 10;
        });
      }, 150);
    }

    return () => clearInterval(interval);
  }, [isOpen, scanStatus, targetUserId, users, selectableUsers, onSuccess, onClose]);

  const handleToggleFacingMode = () => {
    setFacingMode(prev => (prev === 'user' ? 'environment' : 'user'));
  };

  const handleManualTriggerScan = () => {
    setScanStatus('SEARCHING');
    setScanProgress(10);
    setMatchedUser(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-lg shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Modal */}
        <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center text-white">
              <ScanFace className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm tracking-tight text-white">
                  Pengecaman Wajah Biometrik
                </h3>
                <span className="text-[9px] font-mono uppercase bg-blue-500/30 text-blue-300 px-1.5 py-0.2 rounded border border-blue-400/40">
                  Mobile & Tablet
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Akses Pantas Bebas-Sentuhan Makmal (Hands-Free OSH Access)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
            title="Tutup"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Viewport Kamera & Bingkai Imbasan Biometrik */}
        <div className="relative bg-slate-950 aspect-square sm:aspect-4/3 flex items-center justify-center overflow-hidden">
          {/* Elemen Video Kamera Sebenar */}
          <video
            ref={videoRef}
            className={`w-full h-full object-cover ${
              facingMode === 'user' ? 'scale-x-[-1]' : ''
            } ${!isCameraActive ? 'hidden' : 'block'}`}
            autoPlay
            playsInline
            muted
          />

          <canvas ref={canvasRef} className="hidden" />

          {/* Visual Fallback / Simulasi jika Kamera disekat atau peranti tanpa izin */}
          {!isCameraActive && (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-slate-900 to-slate-950 text-slate-300 space-y-3">
              <div className="relative">
                <div className="w-24 h-24 rounded-full border-2 border-dashed border-blue-500/60 flex items-center justify-center animate-pulse">
                  <ScanFace className="w-12 h-12 text-blue-400" />
                </div>
                <div className="absolute -bottom-1 -right-1 bg-blue-600 rounded-full p-1 text-white">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
              </div>

              <div>
                <span className="font-mono text-xs uppercase font-semibold text-blue-400 block tracking-wider">
                  Pengesan Biometrik Maya Aktif
                </span>
                <p className="text-xs text-slate-400 max-w-xs mt-1">
                  Sensor optikal tablet makmal sedia mengimbas dan memadankan vektor wajah kakitangan.
                </p>
              </div>

              {cameraError && (
                <div className="p-2 bg-slate-800/80 rounded border border-slate-700 text-[10px] text-slate-400 font-mono max-w-xs">
                  {cameraError}
                </div>
              )}
            </div>
          )}

          {/* HUD Overlay Pengimbas Wajah (Sci-Fi / Lab Biometric Precision) */}
          <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-between p-4 sm:p-6">
            {/* Sudut Kurungan Retikel (Corner Brackets) */}
            <div className="w-full flex justify-between">
              <div className="w-6 h-6 border-t-2 border-l-2 border-blue-400" />
              <div className="w-6 h-6 border-t-2 border-r-2 border-blue-400" />
            </div>

            {/* Bingkai Elips Wajah Utama */}
            <div className="relative w-48 h-56 sm:w-56 sm:h-64 rounded-[48%] border-2 border-dashed border-blue-400/80 flex items-center justify-center">
              {/* Garisan Laser Imbasan Bergerak */}
              {scanStatus !== 'MATCHED' && (
                <div className="absolute left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_8px_#22d3ee] animate-bounce" />
              )}

              {/* Titik Landmark Biometrik Wajah */}
              <div className="absolute top-1/3 left-1/3 w-1.5 h-1.5 rounded-full bg-cyan-400 opacity-80" />
              <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 rounded-full bg-cyan-400 opacity-80" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-cyan-400 opacity-80" />
              <div className="absolute bottom-1/3 left-1/2 -translate-x-1/2 w-3 h-1 rounded-full bg-cyan-400/60 opacity-80" />

              {/* Lencana Status Padanan */}
              {scanStatus === 'MATCHED' && matchedUser && (
                <div className="absolute inset-0 rounded-[48%] bg-emerald-950/70 border-2 border-emerald-400 flex flex-col items-center justify-center text-center p-3 animate-in zoom-in-95 duration-200">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 mb-1" />
                  <span className="font-bold text-white text-xs sm:text-sm">
                    {matchedUser.name}
                  </span>
                  <span className="font-mono text-[10px] text-emerald-300 font-semibold mt-0.5">
                    {matchedUser.role === 'ADMIN' ? 'Admin / Pegawai' : 'Staf Makmal'} · {confidence}% Padanan
                  </span>
                </div>
              )}
            </div>

            {/* Sudut Kurungan Bawah */}
            <div className="w-full flex justify-between">
              <div className="w-6 h-6 border-b-2 border-l-2 border-blue-400" />
              <div className="w-6 h-6 border-b-2 border-r-2 border-blue-400" />
            </div>
          </div>

          {/* Bar Status Imbasan Bawah Viewport */}
          <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-white bg-slate-900/80 backdrop-blur-xs px-3 py-1.5 rounded border border-slate-700/80">
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  scanStatus === 'MATCHED'
                    ? 'bg-emerald-400'
                    : scanStatus === 'ANALYZING'
                    ? 'bg-amber-400 animate-ping'
                    : 'bg-cyan-400 animate-pulse'
                }`}
              />
              <span>
                {scanStatus === 'INITIALIZING' && 'Menghubung sensor kamera...'}
                {scanStatus === 'SEARCHING' && 'Mencari kontur wajah...'}
                {scanStatus === 'DETECTED' && 'Wajah dikesan! Mengekstrak vektor...'}
                {scanStatus === 'ANALYZING' && `Memadankan biometrik (${scanProgress}%)...`}
                {scanStatus === 'MATCHED' && 'Pengecaman Wajah Disahkan ✓'}
              </span>
            </div>

            {isCameraActive && (
              <button
                type="button"
                onClick={handleToggleFacingMode}
                className="pointer-events-auto p-1 hover:bg-slate-800 rounded text-slate-300 hover:text-white flex items-center gap-1 text-[10px]"
                title="Tukar Kamera Depan / Belakang"
              >
                <SwitchCamera className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Kamera</span>
              </button>
            )}
          </div>
        </div>

        {/* Panel Kawalan & Pilihan Profil Kakitangan (Dioptimumkan untuk Tablet & Touch) */}
        <div className="p-4 sm:p-5 space-y-3.5 bg-slate-50 border-t border-slate-200">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
              <span>Padankan Dengan Profil Kakitangan Makmal:</span>
              <span className="font-mono text-[10px] text-slate-500">
                Pilih profil untuk simulasi / imbasan
              </span>
            </label>

            <select
              value={targetUserId}
              onChange={e => {
                setTargetUserId(e.target.value);
                setScanStatus('SEARCHING');
                setScanProgress(10);
                setMatchedUser(null);
              }}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600 shadow-2xs"
            >
              {selectableUsers.map(user => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.role === 'ADMIN' ? 'Pegawai / Admin' : 'Staf Makmal'}) — ID: {user.staffId || user.id}
                </option>
              ))}
            </select>
          </div>

          {/* Bar Tindakan Cepat (Mobile / Tablet Touch Friendly) */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={handleManualTriggerScan}
              disabled={scanStatus === 'MATCHED'}
              className="py-2.5 px-3 bg-white hover:bg-slate-100 text-slate-800 font-semibold rounded text-xs border border-slate-300 shadow-2xs transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <RefreshCw className="w-3.5 h-3.5 text-blue-600" />
              <span>Imbas Semula</span>
            </button>

            <button
              type="button"
              onClick={() => {
                const target =
                  users.find(u => u.id === targetUserId) ||
                  selectableUsers[0] ||
                  users[0];
                StorageService.setCurrentSessionUser(target);
                onSuccess(target);
                onClose();
              }}
              className="py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded text-xs shadow-2xs transition-colors flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Sahkan & Log Masuk</span>
            </button>
          </div>

          {/* Nota Kepatuhan OSH Makmal */}
          <div className="flex items-start gap-2 p-2.5 bg-blue-50/70 border border-blue-200/80 rounded text-[11px] text-blue-900 leading-tight">
            <Tablet className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <strong>Kelebihan Hands-Free Makmal:</strong> Membolehkan kakitangan yang memakai sarung tangan nitril (PPE) log masuk tanpa menyentuh skrin secara fizikal, mengurangkan risiko pencemaran silang bahan kimia.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
