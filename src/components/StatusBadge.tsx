import React from 'react';
import { BottleStatus } from '../types';
import { getExpiryStatus, getDaysToExpiry } from '../services/storageService';

interface StatusBadgeProps {
  status: BottleStatus;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'sm' }) => {
  const isSm = size === 'sm';

  switch (status) {
    case 'IN_STORE':
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium ${isSm ? 'text-xs' : 'text-sm'} text-emerald-800`}>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" aria-hidden="true" />
          <span>Dalam Stor</span>
        </span>
      );
    case 'IN_LAB':
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium ${isSm ? 'text-xs' : 'text-sm'} text-blue-800`}>
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" aria-hidden="true" />
          <span>Di Makmal</span>
        </span>
      );
    case 'PENDING_DISPOSAL':
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium ${isSm ? 'text-xs' : 'text-sm'} text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200`}>
          <span className="text-amber-700 font-bold" aria-hidden="true">▲</span>
          <span>Menunggu Pelupusan</span>
        </span>
      );
    case 'DISPOSED':
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium ${isSm ? 'text-xs' : 'text-sm'} text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200`}>
          <span className="text-slate-500 font-mono text-[10px]" aria-hidden="true">■</span>
          <span>Telah Dilupuskan</span>
        </span>
      );
    default:
      return null;
  }
};

interface ExpiryBadgeProps {
  expiryDate: string;
  size?: 'sm' | 'md';
  showDays?: boolean;
}

export const ExpiryBadge: React.FC<ExpiryBadgeProps> = ({ expiryDate, size = 'sm', showDays = true }) => {
  const status = getExpiryStatus(expiryDate);
  const days = getDaysToExpiry(expiryDate);
  const isSm = size === 'sm';

  if (status === 'EXPIRED') {
    return (
      <span className={`inline-flex items-center gap-1.5 font-bold ${isSm ? 'text-xs' : 'text-sm'} text-red-700 bg-red-50/90 px-2 py-0.5 rounded border border-red-200`}>
        <span className="font-mono text-[10px] bg-red-700 text-white px-1 rounded-2xs font-extrabold uppercase">LUPUT</span>
        <span className="font-mono tabular-nums">{expiryDate}</span>
        {showDays && <span className="font-mono text-red-600 text-[11px]">({Math.abs(days)}h lepas)</span>}
      </span>
    );
  }

  if (status === 'EXPIRING_SOON') {
    return (
      <span className={`inline-flex items-center gap-1.5 font-semibold ${isSm ? 'text-xs' : 'text-sm'} text-amber-800 bg-amber-50/90 px-2 py-0.5 rounded border border-amber-300`}>
        <span className="font-mono text-[10px] bg-amber-600 text-white px-1 rounded-2xs font-bold uppercase">≤90H</span>
        <span className="font-mono tabular-nums">{expiryDate}</span>
        {showDays && <span className="font-mono text-amber-700 text-[11px]">({days}h lagi)</span>}
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1.5 font-normal ${isSm ? 'text-xs' : 'text-sm'} text-slate-700`}>
      <span className="font-mono tabular-nums text-slate-900">{expiryDate}</span>
      {showDays && <span className="text-slate-400 font-mono text-[11px]">({days}h)</span>}
    </span>
  );
};
