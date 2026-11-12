import React from 'react';
import { UserProfile } from '../types';
import {
  FlaskConical,
  ScanLine,
  UserCheck,
  Shield,
  LogOut,
  ChevronDown
} from 'lucide-react';

interface NavbarProps {
  currentUser: UserProfile;
  users: UserProfile[];
  onChangeUser: (user: UserProfile) => void;
  onOpenScanner: () => void;
  onOpenUserRegister?: () => void;
  onSignOut: () => void;
  expiredCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  users,
  onChangeUser,
  onOpenScanner,
  onOpenUserRegister,
  onSignOut,
  expiredCount
}) => {
  const isAdmin = currentUser.role === 'ADMIN';

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200/90 shadow-2xs no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-15 flex items-center justify-between gap-4">
        {/* Zon 1: Brand & Pengenalan Sistem */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-md bg-slate-900 text-white flex items-center justify-center border border-slate-800">
            <FlaskConical className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 text-base tracking-tight whitespace-nowrap">
                Chemical Inventory System
              </span>
              <span className="font-mono text-[10px] uppercase font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-xs border border-slate-200 hidden sm:inline-block">
                CIS v1.0
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden md:block">
              Lembaga Getah Malaysia (LGM) · Pengurusan & Penjejakan Botol
            </p>
          </div>
        </div>

        {/* Zon 2: Role Switcher, Pengguna Aktif & Log Keluar */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Role & User Selector */}
          <div className="flex items-center bg-slate-100/90 border border-slate-200/90 rounded-md p-1">
            <div className="flex items-center gap-1 px-1.5 hidden sm:flex">
              {isAdmin ? (
                <Shield className="w-3.5 h-3.5 text-purple-700" />
              ) : (
                <UserCheck className="w-3.5 h-3.5 text-blue-700" />
              )}
              <span
                className={`text-[10px] font-mono uppercase font-bold px-1.5 py-0.5 rounded ${
                  isAdmin
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-blue-100 text-blue-800'
                }`}
              >
                {isAdmin ? 'ADMIN' : 'STAFF'}
              </span>
            </div>

            <select
              value={currentUser.id}
              onChange={e => {
                const found = users.find(u => u.id === e.target.value);
                if (found) onChangeUser(found);
              }}
              className="bg-white border border-slate-300 text-slate-800 text-xs font-semibold py-1 px-2.5 rounded-xs shadow-2xs focus:outline-none focus:ring-1 focus:ring-blue-600 cursor-pointer max-w-[170px] sm:max-w-[230px] truncate"
              title="Tukar Pengguna Aktif"
            >
              {users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.role === 'ADMIN' ? 'Admin' : 'Staf'})
                </option>
              ))}
            </select>
          </div>

          {/* Zon 3: Butang Tindakan Imbas QR */}
          <button
            onClick={onOpenScanner}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-md shadow-2xs transition-colors shrink-0"
            title="Buka Pengimbas QR Kamera / ID Manual"
          >
            <ScanLine className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Imbas QR</span>
          </button>

          {/* Butang Log Keluar */}
          <button
            onClick={onSignOut}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 hover:bg-red-50 hover:text-red-700 text-slate-600 text-xs font-semibold rounded-md border border-slate-200 transition-colors shrink-0"
            title="Log Keluar ke Paparan Pemula"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Log Keluar</span>
          </button>
        </div>
      </div>
    </header>
  );
};

