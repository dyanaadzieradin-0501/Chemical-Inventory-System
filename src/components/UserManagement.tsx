import React, { useState } from 'react';
import { UserProfile, Role } from '../types';
import { StorageService } from '../services/storageService';
import {
  Users,
  UserPlus,
  ShieldCheck,
  UserCheck,
  Lock,
  Mail,
  Building,
  BadgeCheck,
  AlertCircle,
  CheckCircle2,
  Trash2,
  Power,
  ArrowRight
} from 'lucide-react';

interface UserManagementProps {
  users: UserProfile[];
  currentUser: UserProfile;
  onRefreshUsers: () => void;
  onSwitchUser: (user: UserProfile) => void;
}

export const UserManagement: React.FC<UserManagementProps> = ({
  users,
  currentUser,
  onRefreshUsers,
  onSwitchUser
}) => {
  const isAdmin = currentUser.role === 'ADMIN';

  // State borang pendaftaran
  const [name, setName] = useState('');
  const [staffId, setStaffId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password123');
  const [role, setRole] = useState<Role>('STAFF');
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('');

  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!name.trim()) {
      setMessage({ text: 'Sila masukkan nama penuh kakitangan.', type: 'error' });
      return;
    }
    if (!staffId.trim()) {
      setMessage({ text: 'Sila masukkan No. ID Staf / Kad Pekerja.', type: 'error' });
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setMessage({ text: 'Sila masukkan alamat emel institusi yang sah.', type: 'error' });
      return;
    }
    if (!title.trim()) {
      setMessage({ text: 'Sila masukkan jawatan / gelaran rasmi.', type: 'error' });
      return;
    }
    if (!department.trim()) {
      setMessage({ text: 'Sila masukkan nama bahagian atau unit makmal.', type: 'error' });
      return;
    }

    const result = StorageService.registerUser(
      {
        staffId: staffId.trim(),
        name: name.trim(),
        email: email.trim(),
        role,
        title: title.trim(),
        department: department.trim(),
        password: password.trim() || 'password123'
      },
      currentUser
    );

    if (result.success && result.user) {
      setMessage({ text: result.message, type: 'success' });
      setName('');
      setStaffId('');
      setEmail('');
      setTitle('');
      setDepartment('');
      setPassword('password123');
      onRefreshUsers();
    } else {
      setMessage({ text: result.message, type: 'error' });
    }
  };

  const handleToggleStatus = (targetUser: UserProfile) => {
    const result = StorageService.toggleUserStatus(targetUser.id, currentUser);
    if (result.success) {
      setMessage({ text: result.message, type: 'success' });
      onRefreshUsers();
    } else {
      setMessage({ text: result.message, type: 'error' });
    }
  };

  const handleDelete = (targetUser: UserProfile) => {
    if (window.confirm(`Adakah anda pasti ingin memadam rekod kakitangan "${targetUser.name}"?`)) {
      const result = StorageService.deleteUser(targetUser.id, currentUser);
      if (result.success) {
        setMessage({ text: result.message, type: 'success' });
        onRefreshUsers();
      } else {
        setMessage({ text: result.message, type: 'error' });
      }
    }
  };

  return (
    <div className="space-y-5">
      {/* Header Modul */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Pendaftaran & Pengurusan Pengguna Makmal
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Kawalan akses berasaskan peranan (RBAC) bagi Pegawai Sains dan Staf/Pembantu Makmal
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-slate-500 bg-white px-2.5 py-1 rounded border border-slate-200">
            {users.length} Kakitangan Berdaftar
          </span>
        </div>
      </div>

      {/* Maklum Balas */}
      {message && (
        <div
          className={`p-3 rounded text-xs flex items-center justify-between ${
            message.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {message.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
          <button onClick={() => setMessage(null)} className="font-bold text-xs ml-2">
            ✕
          </button>
        </div>
      )}

      {/* Grid 2-Kolum: Borang Pendaftaran & Senarai Pengguna */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Kolum Kiri: Borang Pendaftaran Pengguna Baharu */}
        <div className="lg:col-span-5 bg-white rounded-md border border-slate-200 p-4 space-y-4 shadow-2xs">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <UserPlus className="w-4 h-4 text-blue-600" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Borang Pendaftaran Pengguna Baharu
            </h2>
          </div>

          <form onSubmit={handleRegister} className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Nama Penuh Kakitangan <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Contoh: Siti Sarah bt Razak"
                required
                className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  No. ID Staf / Matrik <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={staffId}
                  onChange={e => setStaffId(e.target.value)}
                  placeholder="Contoh: LGM/PS/0415"
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded font-mono uppercase focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Peranan Akses Sistem <span className="text-red-500">*</span>
                </label>
                <select
                  value={role}
                  onChange={e => setRole(e.target.value as Role)}
                  className="w-full px-2.5 py-2 border border-slate-300 rounded bg-white font-semibold focus:outline-none focus:ring-1 focus:ring-blue-600"
                >
                  <option value="STAFF">Staf / Pembantu Makmal</option>
                  <option value="ADMIN">Pegawai / Pentadbir (Admin)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Alamat Emel Rasmi Institusi <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Contoh: sitisarah@lgm.gov.my"
                  required
                  className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
                <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Kata Laluan Sementara / PIN Akses <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Lalai: password123"
                  required
                  className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded font-mono focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
                <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Jawatan / Gelaran Rasmi <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Contoh: Penolong Pegawai Sains Makmal"
                required
                className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Bahagian / Unit Makmal <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={department}
                  onChange={e => setDepartment(e.target.value)}
                  placeholder="Contoh: Makmal Kimia Analisis & Polimer"
                  required
                  className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
                <Building className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
              </div>
            </div>

            {/* Penerangan Kuasa Akses Ringkas */}
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded text-[11px] text-slate-600 space-y-1">
              <span className="font-semibold text-slate-800 block">
                Kebenaran Peranan ({role === 'ADMIN' ? 'Admin / Pegawai' : 'Staf Makmal'}):
              </span>
              {role === 'ADMIN' ? (
                <p>
                  Akses penuh: Mendaftar stok masuk, menjana kod QR, meluluskan pelupusan muktamad DOE, mengurus lokasi, dan mengeksport audit trail.
                </p>
              ) : (
                <p>
                  Akses harian: Carian/imbas QR, memindahkan lokasi botol dari stor ke makmal, dan menanda botol luput untuk Menunggu Pelupusan.
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded text-xs shadow-2xs transition-colors"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Daftar Akses Pengguna</span>
            </button>
          </form>
        </div>

        {/* Kolum Kanan: Senarai Kakitangan Berdaftar */}
        <div className="lg:col-span-7 bg-white rounded-md border border-slate-200 overflow-hidden shadow-2xs">
          <div className="px-4 py-3 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-slate-700" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Senarai Kakitangan Berdaftar ({users.length})
              </h2>
            </div>
            <span className="text-[11px] text-slate-500">
              Klik butang untuk beralih profil pengguna
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {users.map(user => {
              const isCurrent = user.id === currentUser.id;
              const isInactive = user.status === 'INACTIVE';

              return (
                <div
                  key={user.id}
                  className={`p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                    isCurrent ? 'bg-blue-50/40 border-l-3 border-l-blue-600' : 'hover:bg-slate-50/80'
                  } ${isInactive ? 'opacity-60 bg-slate-100/50' : ''}`}
                >
                  {/* Maklumat Kakitangan */}
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-slate-900 text-sm">{user.name}</span>
                      {user.staffId && (
                        <span className="font-mono text-[10px] bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200 text-slate-700">
                          {user.staffId}
                        </span>
                      )}
                      <span
                        className={`text-[10px] font-mono uppercase font-bold px-1.5 py-0.2 rounded ${
                          user.role === 'ADMIN'
                            ? 'bg-purple-100 text-purple-800 border border-purple-200'
                            : 'bg-blue-100 text-blue-800 border border-blue-200'
                        }`}
                      >
                        {user.role === 'ADMIN' ? 'Pegawai / Admin' : 'Staf Makmal'}
                      </span>
                      {isCurrent && (
                        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                          Pengguna Aktif
                        </span>
                      )}
                      {isInactive && (
                        <span className="text-[10px] font-semibold text-red-700 bg-red-50 px-1.5 py-0.2 rounded border border-red-200">
                          Nyahaktif
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-slate-600">
                      <span>{user.title}</span> · <span className="text-slate-500">{user.department}</span>
                    </div>

                    {user.email && (
                      <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                        <Mail className="w-3 h-3 text-slate-400" />
                        <span>{user.email}</span>
                      </div>
                    )}
                  </div>

                  {/* Tindakan Pantas */}
                  <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                    {!isCurrent && !isInactive && (
                      <button
                        onClick={() => onSwitchUser(user)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded shadow-2xs transition-colors"
                        title="Beralih ke pengguna ini"
                      >
                        <span>Tukar Sesi</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}

                    {isAdmin && !isCurrent && (
                      <>
                        <button
                          onClick={() => handleToggleStatus(user)}
                          className={`p-1.5 rounded transition-colors ${
                            isInactive
                              ? 'text-emerald-700 hover:bg-emerald-50'
                              : 'text-slate-400 hover:text-amber-700 hover:bg-amber-50'
                          }`}
                          title={isInactive ? 'Aktifkan Semula Pengguna' : 'Nyahaktifkan Pengguna'}
                        >
                          <Power className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleDelete(user)}
                          className="p-1.5 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                          title="Padam Pengguna"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
