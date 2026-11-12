import React, { useState } from 'react';
import { UserProfile, Role } from '../types';
import { StorageService } from '../services/storageService';
import {
  FlaskConical,
  ShieldCheck,
  UserCheck,
  UserPlus,
  LogIn,
  Lock,
  Mail,
  Building,
  KeyRound,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Shield,
  Layers,
  FileCheck2,
  ScanLine,
  ChevronRight
} from 'lucide-react';

interface AuthPortalProps {
  onLoginSuccess: (user: UserProfile) => void;
  initialMode?: 'signin' | 'signup';
}

export const AuthPortal: React.FC<AuthPortalProps> = ({
  onLoginSuccess,
  initialMode = 'signin'
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);

  // State Log Masuk
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // State Daftar Akaun Baharu
  const [signupName, setSignupName] = useState('');
  const [signupStaffId, setSignupStaffId] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [signupRole, setSignupRole] = useState<Role>('STAFF');
  const [signupTitle, setSignupTitle] = useState('');
  const [signupDepartment, setSignupDepartment] = useState('');

  // Status maklum balas
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Dapatkan senarai pengguna semasa untuk paparan demo
  const allUsers = StorageService.getUsers();
  const demoAdmin = allUsers.find(u => u.role === 'ADMIN' && u.status !== 'INACTIVE') || allUsers[0];
  const demoStaff = allUsers.find(u => u.role === 'STAFF' && u.status !== 'INACTIVE') || allUsers[2] || allUsers[1];

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!loginIdentifier.trim()) {
      setError('Sila masukkan No. ID Staf atau Emel Rasmi anda.');
      return;
    }

    const result = StorageService.authenticateUser(loginIdentifier, loginPassword);
    if (result.success && result.user) {
      if (rememberMe) {
        StorageService.setCurrentSessionUser(result.user);
      }
      onLoginSuccess(result.user);
    } else {
      setError(result.message);
    }
  };

  const handleQuickLogin = (targetUser: UserProfile) => {
    setError(null);
    StorageService.setCurrentSessionUser(targetUser);
    onLoginSuccess(targetUser);
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!signupName.trim()) {
      setError('Nama penuh kakitangan wajib diisi.');
      return;
    }
    if (!signupStaffId.trim()) {
      setError('No. ID Staf / No. Matrik Pekerja wajib diisi.');
      return;
    }
    if (!signupEmail.trim() || !signupEmail.includes('@')) {
      setError('Sila masukkan alamat emel institusi yang sah.');
      return;
    }
    if (!signupPassword) {
      setError('Sila tentukan kata laluan keselamatan.');
      return;
    }
    if (signupPassword.length < 6) {
      setError('Kata laluan mestilah sekurang-kurangnya 6 aksara.');
      return;
    }
    if (signupPassword !== signupConfirmPassword) {
      setError('Pengesahan kata laluan tidak sepadan.');
      return;
    }
    if (!signupTitle.trim()) {
      setError('Jawatan / Gelaran rasmi wajib diisi.');
      return;
    }
    if (!signupDepartment.trim()) {
      setError('Bahagian atau Unit Makmal wajib diisi.');
      return;
    }

    const regResult = StorageService.registerUser({
      staffId: signupStaffId.trim(),
      name: signupName.trim(),
      email: signupEmail.trim(),
      role: signupRole,
      title: signupTitle.trim(),
      department: signupDepartment.trim(),
      password: signupPassword
    });

    if (regResult.success && regResult.user) {
      StorageService.setCurrentSessionUser(regResult.user);
      onLoginSuccess(regResult.user);
    } else {
      setError(regResult.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between text-slate-900 selection:bg-blue-600 selection:text-white">
      {/* Bar Navigasi Atas Portal */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-15 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-slate-900 text-white flex items-center justify-center font-bold">
              <FlaskConical className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <span className="font-bold text-slate-900 text-sm tracking-tight block">
                Chemical Inventory System (CIS)
              </span>
              <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">
                Lembaga Getah Malaysia (LGM) · Makmal Penyelidikan & Analisis
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2.5 py-1 rounded border border-slate-200">
              Pematuhan OSH 1994 & DOE
            </span>
          </div>
        </div>
      </header>

      {/* Kandungan Utama */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-4xl bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
          {/* Header Kad & Penukar Mod Tab */}
          <div className="p-6 border-b border-slate-100 bg-gradient-to-b from-slate-50 to-white">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-blue-600 text-xs font-semibold uppercase tracking-wider mb-1">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Portal Akses Keselamatan Makmal Bersepadu</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  {mode === 'signin'
                    ? 'Log Masuk Inventori Bahan Kimia'
                    : 'Pendaftaran Akaun Kakitangan Makmal'}
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  {mode === 'signin'
                    ? 'Sila masukkan kelayakan kakitangan atau pilih peranan untuk akses terus ke konsol makmal.'
                    : 'Daftar akaun kakitangan baharu dan tetapkan tahap kebenaran peranan (Admin atau Staf Makmal).'}
                </p>
              </div>

              {/* Segmented Tab Buttons */}
              <div className="flex items-center bg-slate-100 p-1 rounded-md border border-slate-200 shrink-0 self-start sm:self-center">
                <button
                  type="button"
                  onClick={() => {
                    setMode('signin');
                    setError(null);
                  }}
                  className={`px-4 py-1.5 text-xs font-semibold rounded transition-colors flex items-center gap-1.5 ${
                    mode === 'signin'
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Log Masuk</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setError(null);
                  }}
                  className={`px-4 py-1.5 text-xs font-semibold rounded transition-colors flex items-center gap-1.5 ${
                    mode === 'signup'
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Daftar Akaun</span>
                </button>
              </div>
            </div>
          </div>

          {/* Notifikasi Ralat / Berjaya */}
          {error && (
            <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded text-xs text-red-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mx-6 mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-800 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Badan Tab 1: LOG MASUK (SIGN IN) */}
          {mode === 'signin' && (
            <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Kolum Kiri: Borang Log Masuk Standard */}
              <div className="lg:col-span-7 space-y-4">
                <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 pb-1 border-b border-slate-100">
                  01. Masuk Menggunakan ID / Emel
                </div>

                <form onSubmit={handleSignIn} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      No. ID Staf atau Emel Rasmi <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={loginIdentifier}
                        onChange={e => setLoginIdentifier(e.target.value)}
                        placeholder="Contoh: dyana.adziera@lgm.gov.my atau LGM/RO/0352"
                        required
                        className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-600 font-mono text-slate-800"
                      />
                      <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block font-semibold text-slate-700">
                        Kata Laluan / PIN Makmal <span className="text-red-500">*</span>
                      </label>
                      <span className="text-[10px] text-slate-400 font-mono">
                        Demo PIN: password123
                      </span>
                    </div>
                    <div className="relative">
                      <input
                        type={showLoginPassword ? 'text' : 'password'}
                        value={loginPassword}
                        onChange={e => setLoginPassword(e.target.value)}
                        placeholder="Masukkan kata laluan anda"
                        className="w-full pl-8 pr-9 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-600 font-mono text-slate-800"
                      />
                      <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                      >
                        {showLoginPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={e => setRememberMe(e.target.checked)}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span>Kekalkan sesi log masuk pada pelayar ini</span>
                    </label>

                    <button
                      type="button"
                      onClick={() => {
                        setMode('signup');
                        setError(null);
                      }}
                      className="text-blue-600 hover:text-blue-700 font-semibold"
                    >
                      Daftar kakitangan baru?
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded shadow-2xs transition-colors text-xs"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Log Masuk ke Konsol Makmal</span>
                  </button>
                </form>

                {/* Nota Pengesahan Keselamatan Makmal */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded text-[11px] text-slate-500 space-y-1">
                  <span className="font-semibold text-slate-700 block">
                    Dasar Integriti Log Audit Makmal:
                  </span>
                  Setiap transaksi pemindahan botol, penerimaan stok baharu, dan pelupusan sisa direkodkan bersama nama pegawai yang berdaftar.
                </div>
              </div>

              {/* Kolum Kanan: Akses Pantas 1-Klik Mengikut Peranan (RBAC Demo) */}
              <div className="lg:col-span-5 space-y-3.5">
                <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 pb-1 border-b border-slate-100 flex items-center justify-between">
                  <span>02. Akses Pantas Mengikut Peranan</span>
                  <span className="text-[10px] text-blue-600 lowercase font-normal">1-klik demo</span>
                </div>

                <p className="text-[11px] text-slate-500">
                  Pilih salah satu profil di bawah untuk menguji kebenaran peranan sistem secara langsung:
                </p>

                {/* Kad 1: Pentadbir / Pegawai Makmal (Admin) */}
                {demoAdmin && (
                  <div className="p-3.5 rounded-md border border-purple-200 bg-purple-50/40 hover:bg-purple-50/70 transition-colors space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Shield className="w-4 h-4 text-purple-700" />
                        <span className="font-bold text-slate-900 text-xs">
                          {demoAdmin.name}
                        </span>
                      </div>
                      <span className="font-mono text-[10px] font-bold uppercase bg-purple-100 text-purple-800 border border-purple-300 px-1.5 py-0.2 rounded">
                        Admin / Pegawai
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-600 space-y-0.5">
                      <div>{demoAdmin.title}</div>
                      <div className="text-slate-400 font-mono text-[10px]">{demoAdmin.staffId}</div>
                    </div>

                    <div className="text-[11px] text-purple-900 bg-white/80 p-2 rounded border border-purple-100 leading-relaxed">
                      <strong>Kuasa Penuh:</strong> Stok Masuk (Stock In), Pengesahan Muktamad Pelupusan DOE (Langkah 2), Tetapan Ambang Stok & Lokasi, Urus Kakitangan.
                    </div>

                    <button
                      type="button"
                      onClick={() => handleQuickLogin(demoAdmin)}
                      className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-purple-700 hover:bg-purple-800 text-white font-semibold rounded text-xs transition-colors"
                    >
                      <span>Log Masuk sebagai Pentadbir</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Kad 2: Staf / Pembantu Makmal (Staff) */}
                {demoStaff && (
                  <div className="p-3.5 rounded-md border border-blue-200 bg-blue-50/40 hover:bg-blue-50/70 transition-colors space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <UserCheck className="w-4 h-4 text-blue-700" />
                        <span className="font-bold text-slate-900 text-xs">
                          {demoStaff.name}
                        </span>
                      </div>
                      <span className="font-mono text-[10px] font-bold uppercase bg-blue-100 text-blue-800 border border-blue-300 px-1.5 py-0.2 rounded">
                        Staf Makmal
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-600 space-y-0.5">
                      <div>{demoStaff.title}</div>
                      <div className="text-slate-400 font-mono text-[10px]">{demoStaff.staffId}</div>
                    </div>

                    <div className="text-[11px] text-blue-900 bg-white/80 p-2 rounded border border-blue-100 leading-relaxed">
                      <strong>Kuasa Operasi:</strong> Imbas QR Kod & Semak SDS, Pemindahan Lokasi Botol (Stor ↔ Makmal), Tanda Permohonan Pelupusan (Langkah 1).
                    </div>

                    <button
                      type="button"
                      onClick={() => handleQuickLogin(demoStaff)}
                      className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-semibold rounded text-xs transition-colors"
                    >
                      <span>Log Masuk sebagai Staf Makmal</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Badan Tab 2: DAFTAR AKAUN BAHARU (SIGN UP) */}
          {mode === 'signup' && (
            <div className="p-6 space-y-6">
              <form onSubmit={handleSignUp} className="space-y-5 text-xs">
                {/* Bahagian 1: Maklumat Peribadi & Institusi */}
                <div>
                  <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 pb-1 border-b border-slate-100 mb-3">
                    01. Maklumat Kakitangan & Akaun
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Nama Penuh Kakitangan <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={signupName}
                        onChange={e => setSignupName(e.target.value)}
                        placeholder="Contoh: Siti Sarah bt Razak"
                        required
                        className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-600"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        No. ID Staf / Kad Pekerja <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={signupStaffId}
                        onChange={e => setSignupStaffId(e.target.value)}
                        placeholder="Contoh: LGM/PS/0512"
                        required
                        className="w-full px-3 py-2 border border-slate-300 rounded font-mono uppercase focus:outline-none focus:ring-1 focus:ring-blue-600"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Alamat Emel Rasmi Institusi <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          value={signupEmail}
                          onChange={e => setSignupEmail(e.target.value)}
                          placeholder="sitisarah@lgm.gov.my"
                          required
                          className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-600"
                        />
                        <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Jawatan / Gelaran Rasmi <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={signupTitle}
                        onChange={e => setSignupTitle(e.target.value)}
                        placeholder="Contoh: Penolong Pegawai Sains Makmal"
                        required
                        className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-600"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block font-semibold text-slate-700 mb-1">
                        Bahagian / Unit Makmal <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={signupDepartment}
                          onChange={e => setSignupDepartment(e.target.value)}
                          placeholder="Contoh: Bahagian Kawalan Kualiti & Kimia Polimer LGM"
                          required
                          className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-600"
                        />
                        <Building className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bahagian 2: Keselamatan Kata Laluan */}
                <div>
                  <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 pb-1 border-b border-slate-100 mb-3">
                    02. Keselamatan Kata Laluan
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Kata Laluan Baharu <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showSignupPassword ? 'text' : 'password'}
                          value={signupPassword}
                          onChange={e => setSignupPassword(e.target.value)}
                          placeholder="Minimum 6 aksara"
                          required
                          minLength={6}
                          className="w-full pl-8 pr-9 py-2 border border-slate-300 rounded font-mono focus:outline-none focus:ring-1 focus:ring-blue-600"
                        />
                        <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                        <button
                          type="button"
                          onClick={() => setShowSignupPassword(!showSignupPassword)}
                          className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                        >
                          {showSignupPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Sahkan Kata Laluan <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showSignupPassword ? 'text' : 'password'}
                          value={signupConfirmPassword}
                          onChange={e => setSignupConfirmPassword(e.target.value)}
                          placeholder="Masukkan semula kata laluan"
                          required
                          minLength={6}
                          className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded font-mono focus:outline-none focus:ring-1 focus:ring-blue-600"
                        />
                        <KeyRound className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bahagian 3: Pemilihan & Pautan Peranan Pengguna (Role-Linked RBAC) */}
                <div>
                  <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 pb-1 border-b border-slate-100 mb-3 flex items-center justify-between">
                    <span>03. Pilihan Peranan & Kebenaran Akses (Role-Linked)</span>
                    <span className="text-blue-600 normal-case font-medium">Wajib dipilih</span>
                  </div>

                  <p className="text-slate-600 mb-3">
                    Pilih peranan yang bersesuaian dengan portfolio tugas anda di makmal. Peranan ini akan mengawal kuasa kelulusan pelupusan dan pengurusan stok secara automatik:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mb-4">
                    {/* Pilihan 1: Staf / Pembantu Makmal */}
                    <label
                      className={`p-4 rounded-md border cursor-pointer transition-all flex flex-col justify-between ${
                        signupRole === 'STAFF'
                          ? 'border-blue-600 bg-blue-50/60 shadow-2xs'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="role"
                              value="STAFF"
                              checked={signupRole === 'STAFF'}
                              onChange={() => setSignupRole('STAFF')}
                              className="text-blue-600 focus:ring-blue-500"
                            />
                            <span className="font-bold text-slate-900 text-sm">
                              Staf / Pembantu Makmal
                            </span>
                          </div>
                          <span className="font-mono text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200">
                            Peranan: STAFF
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 leading-relaxed">
                          Sesuai untuk Pembantu Makmal, Penolong Pegawai Sains, dan Penyelidik yang mengendalikan penggunaan harian botol kimia di makmal.
                        </p>
                      </div>

                      <div className="mt-3 pt-2 border-t border-slate-200/60 text-[10px] text-slate-500 space-y-1">
                        <div className="flex items-center gap-1.5 text-emerald-700">
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                          <span>Imbas Kod QR botol & semak fail SDS</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-emerald-700">
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                          <span>Pindah lokasi botol dari stor ke makmal</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-emerald-700">
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                          <span>Tanda botol rosak/luput (Langkah 1 Pelupusan)</span>
                        </div>
                      </div>
                    </label>

                    {/* Pilihan 2: Pegawai Makmal / Pentadbir (Admin) */}
                    <label
                      className={`p-4 rounded-md border cursor-pointer transition-all flex flex-col justify-between ${
                        signupRole === 'ADMIN'
                          ? 'border-purple-600 bg-purple-50/60 shadow-2xs'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="role"
                              value="ADMIN"
                              checked={signupRole === 'ADMIN'}
                              onChange={() => setSignupRole('ADMIN')}
                              className="text-purple-600 focus:ring-purple-500"
                            />
                            <span className="font-bold text-slate-900 text-sm">
                              Pegawai Sains / Pentadbir
                            </span>
                          </div>
                          <span className="font-mono text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 border border-purple-200">
                            Peranan: ADMIN
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 leading-relaxed">
                          Sesuai untuk Pegawai Penyelidik, Pegawai Sains Kanan, dan Pentadbir Keselamatan Makmal yang memegang autoriti kelulusan rasmi.
                        </p>
                      </div>

                      <div className="mt-3 pt-2 border-t border-slate-200/60 text-[10px] text-slate-500 space-y-1">
                        <div className="flex items-center gap-1.5 text-purple-800 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-purple-600" />
                          <span>Daftar stok masuk baharu (Stock In) & label QR</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-purple-800 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-purple-600" />
                          <span>Pengesahan muktamad pelupusan sisa DOE (Langkah 2)</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-purple-800 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-purple-600" />
                          <span>Tetapan had minimum stok & pengurusan kakitangan</span>
                        </div>
                      </div>
                    </label>
                  </div>

                  {/* Jadual Perbandingan Kuasa Peranan Sistem (RBAC Matrix) */}
                  <div className="bg-slate-50 rounded border border-slate-200 p-3 overflow-x-auto">
                    <span className="font-semibold text-slate-800 block mb-2 text-[11px]">
                      Matriks Kebenaran Mengikut Peranan:
                    </span>
                    <table className="w-full text-[11px] border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 text-slate-500 text-left">
                          <th className="py-1 px-2 font-semibold">Fungsi / Modul Sistem</th>
                          <th className="py-1 px-2 font-semibold text-center text-blue-700">Staf Makmal</th>
                          <th className="py-1 px-2 font-semibold text-center text-purple-700">Pegawai / Admin</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        <tr>
                          <td className="py-1 px-2">Carian Inventori & SDS GHS</td>
                          <td className="py-1 px-2 text-center text-emerald-600 font-semibold">✓ Akses</td>
                          <td className="py-1 px-2 text-center text-emerald-600 font-semibold">✓ Akses</td>
                        </tr>
                        <tr>
                          <td className="py-1 px-2">Imbas Kod QR Botol Kamera</td>
                          <td className="py-1 px-2 text-center text-emerald-600 font-semibold">✓ Akses</td>
                          <td className="py-1 px-2 text-center text-emerald-600 font-semibold">✓ Akses</td>
                        </tr>
                        <tr>
                          <td className="py-1 px-2">Pemindahan Lokasi Botol & Audit Trail</td>
                          <td className="py-1 px-2 text-center text-emerald-600 font-semibold">✓ Akses</td>
                          <td className="py-1 px-2 text-center text-emerald-600 font-semibold">✓ Akses</td>
                        </tr>
                        <tr>
                          <td className="py-1 px-2">Pendaftaran Stok Masuk (Stock In)</td>
                          <td className="py-1 px-2 text-center text-slate-400">Penyeliaan</td>
                          <td className="py-1 px-2 text-center text-emerald-600 font-semibold">✓ Kuasa Penuh</td>
                        </tr>
                        <tr>
                          <td className="py-1 px-2">Pelupusan Langkah 1 (Tanda Menunggu)</td>
                          <td className="py-1 px-2 text-center text-emerald-600 font-semibold">✓ Boleh Tanda</td>
                          <td className="py-1 px-2 text-center text-emerald-600 font-semibold">✓ Boleh Tanda</td>
                        </tr>
                        <tr>
                          <td className="py-1 px-2">Pelupusan Langkah 2 (Kelulusan Notis DOE)</td>
                          <td className="py-1 px-2 text-center text-slate-400">✗ Dikunci</td>
                          <td className="py-1 px-2 text-center text-emerald-600 font-semibold">✓ Kuasa Melulus</td>
                        </tr>
                        <tr>
                          <td className="py-1 px-2">Konfigurasi Ambang Stok Rendah & Lokasi</td>
                          <td className="py-1 px-2 text-center text-slate-400">Lihat Sahaja</td>
                          <td className="py-1 px-2 text-center text-emerald-600 font-semibold">✓ Kemas Kini</td>
                        </tr>
                        <tr>
                          <td className="py-1 px-2">Pengurusan Pengguna & Akses RBAC</td>
                          <td className="py-1 px-2 text-center text-slate-400">✗ Tiada</td>
                          <td className="py-1 px-2 text-center text-emerald-600 font-semibold">✓ Kawalan Penuh</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Butang Tindakan Daftar */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signin');
                      setError(null);
                    }}
                    className="text-slate-600 hover:text-slate-900 font-semibold text-xs order-2 sm:order-1"
                  >
                    Sudah mempunyai akaun? Kembali ke Log Masuk
                  </button>

                  <button
                    type="submit"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded text-xs shadow-2xs transition-colors order-1 sm:order-2"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Daftar Akaun & Buka Sistem</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>

      {/* Footer Portal */}
      <footer className="bg-white border-t border-slate-200 py-3 text-center text-slate-400 text-xs font-mono">
        Chemical Inventory System (CIS) · Malaysian Rubber Board (LGM) · Hak Cipta Terpelihara 2026
      </footer>
    </div>
  );
};
