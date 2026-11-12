import React from 'react';
import {
  LayoutDashboard,
  Layers,
  PlusCircle,
  Trash2,
  FileSpreadsheet,
  ScanLine,
  Users
} from 'lucide-react';

import { UserProfile } from '../types';
import { Shield, UserCheck } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
  onOpenScanner: () => void;
  expiredCount: number;
  pendingDisposalCount: number;
  currentUser?: UserProfile;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  onOpenScanner,
  expiredCount,
  pendingDisposalCount,
  currentUser
}) => {
  const isAdmin = currentUser?.role === 'ADMIN';
  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-4 h-4 shrink-0" />,
      badge: expiredCount > 0 ? (
        <span className="font-mono text-[10px] font-bold text-red-700 bg-red-100 px-1.5 py-0.2 rounded-xs border border-red-200">
          {expiredCount}
        </span>
      ) : null
    },
    {
      id: 'inventory',
      label: 'Inventori Bahan Kimia',
      icon: <Layers className="w-4 h-4 shrink-0" />
    },
    {
      id: 'stock-in',
      label: 'Stok Masuk (Stock In)',
      icon: <PlusCircle className="w-4 h-4 shrink-0" />,
      highlight: true
    },
    {
      id: 'disposal',
      label: 'Pelupusan Bahan',
      icon: <Trash2 className="w-4 h-4 shrink-0" />,
      badge: pendingDisposalCount > 0 ? (
        <span className="font-mono text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded-xs border border-amber-300">
          {pendingDisposalCount}
        </span>
      ) : null
    },
    {
      id: 'users',
      label: 'Pengguna & Akses',
      icon: <Users className="w-4 h-4 shrink-0" />
    },
    {
      id: 'reports',
      label: 'Laporan & Tetapan',
      icon: <FileSpreadsheet className="w-4 h-4 shrink-0" />
    }
  ];

  return (
    <>
      {/* Sidebar Desktop (Kiri) */}
      <aside className="hidden lg:flex flex-col w-60 bg-white border-r border-slate-200/90 shrink-0 p-3 space-y-5 no-print min-h-[calc(100vh-3.75rem)]">
        <div>
          <div className="px-3 pb-2 text-[10px] font-mono uppercase font-bold tracking-wider text-slate-400">
            Modul Utama
          </div>
          <nav className="space-y-0.5">
            {navItems.map(item => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-slate-900 text-white'
                      : item.highlight
                      ? 'text-blue-700 hover:bg-blue-50/80 hover:text-blue-900'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {item.badge}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Butang Imbas QR Sidebar */}
        <div className="pt-3 border-t border-slate-200/80">
          <button
            onClick={onOpenScanner}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-md border border-slate-200 transition-colors"
          >
            <ScanLine className="w-3.5 h-3.5 text-blue-600" />
            <span>Imbas Kod QR Botol</span>
          </button>
        </div>

        {/* Kad Peranan Pengguna Aktif */}
        {currentUser && (
          <div className="p-2.5 rounded-md border border-slate-200 bg-slate-50/80 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">
                Sesi Aktif
              </span>
              <span
                className={`font-mono text-[9px] uppercase font-bold px-1.5 py-0.2 rounded ${
                  isAdmin
                    ? 'bg-purple-100 text-purple-800 border border-purple-200'
                    : 'bg-blue-100 text-blue-800 border border-blue-200'
                }`}
              >
                {isAdmin ? 'Admin' : 'Staf'}
              </span>
            </div>
            <div className="text-xs font-bold text-slate-900 truncate">
              {currentUser.name}
            </div>
            <div className="text-[10px] text-slate-500 leading-tight">
              {isAdmin
                ? 'Kuasa: Stok Masuk & Pelupusan Muktamad'
                : 'Kuasa: Imbasan QR, Pindah & Tanda Pelupusan'}
            </div>
          </div>
        )}

        {/* Maklumat Integriti Makmal */}
        <div className="mt-auto p-3 bg-slate-50 border border-slate-200 rounded-md text-[11px] text-slate-500 leading-normal">
          <span className="font-semibold text-slate-700 block mb-0.5">Pematuhan OSH & Sisa DOE</span>
          Pastikan setiap botol luput ditanda Menunggu Pelupusan dan diasingkan di stor sisa.
        </div>
      </aside>

      {/* Navigasi Bawah Mobile (Ergonomik & Kemas) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 shadow-lg px-2 py-1.5 flex items-center justify-around no-print">
        <button
          onClick={() => onTabChange('dashboard')}
          className={`flex flex-col items-center py-1 px-2 text-[10px] font-semibold transition-colors ${
            activeTab === 'dashboard' ? 'text-blue-600' : 'text-slate-500'
          }`}
        >
          <LayoutDashboard className="w-4 h-4 mb-0.5" />
          <span>Dashboard</span>
        </button>

        <button
          onClick={() => onTabChange('inventory')}
          className={`flex flex-col items-center py-1 px-2 text-[10px] font-semibold transition-colors ${
            activeTab === 'inventory' ? 'text-blue-600' : 'text-slate-500'
          }`}
        >
          <Layers className="w-4 h-4 mb-0.5" />
          <span>Inventori</span>
        </button>

        {/* Butang Imbas QR Mobile */}
        <div className="relative -top-3">
          <button
            onClick={onOpenScanner}
            className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-md border-2 border-white active:scale-95 transition-transform"
            title="Imbas Kod QR"
          >
            <ScanLine className="w-5 h-5" />
          </button>
        </div>

        <button
          onClick={() => onTabChange('disposal')}
          className={`flex flex-col items-center py-1 px-2 text-[10px] font-semibold transition-colors relative ${
            activeTab === 'disposal' ? 'text-blue-600' : 'text-slate-500'
          }`}
        >
          {pendingDisposalCount > 0 && (
            <span className="absolute top-0 right-1.5 w-1.5 h-1.5 rounded-full bg-amber-500" />
          )}
          <Trash2 className="w-4 h-4 mb-0.5" />
          <span>Pelupusan</span>
        </button>

        <button
          onClick={() => onTabChange('reports')}
          className={`flex flex-col items-center py-1 px-2 text-[10px] font-semibold transition-colors ${
            activeTab === 'reports' ? 'text-blue-600' : 'text-slate-500'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4 mb-0.5" />
          <span>Laporan</span>
        </button>
      </nav>
    </>
  );
};
