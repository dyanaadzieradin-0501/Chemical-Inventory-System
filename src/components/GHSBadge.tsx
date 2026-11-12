import React from 'react';
import { GHSHazard } from '../types';
import { Flame, Skull, ShieldAlert, Sparkles, Wind, Biohazard, AlertTriangle } from 'lucide-react';

interface GHSBadgeProps {
  hazard: GHSHazard;
  showIcon?: boolean;
  size?: 'sm' | 'md';
}

export const GHSBadge: React.FC<GHSBadgeProps> = ({ hazard, showIcon = true, size = 'sm' }) => {
  const getBadgeConfig = (h: GHSHazard) => {
    switch (h) {
      case 'Flammable':
        return {
          border: 'border-red-300 text-red-900 bg-red-50/70',
          icon: <Flame className="w-3 h-3 text-red-600 shrink-0" />,
          label: 'Mudah Terbakar'
        };
      case 'Corrosive':
        return {
          border: 'border-amber-400 text-amber-950 bg-amber-50/70',
          icon: <ShieldAlert className="w-3 h-3 text-amber-700 shrink-0" />,
          label: 'Mengakis (Corrosive)'
        };
      case 'Toxic':
        return {
          border: 'border-purple-300 text-purple-950 bg-purple-50/70',
          icon: <Skull className="w-3 h-3 text-purple-700 shrink-0" />,
          label: 'Toksik / Beracun'
        };
      case 'Health Hazard':
        return {
          border: 'border-rose-300 text-rose-950 bg-rose-50/70',
          icon: <Biohazard className="w-3 h-3 text-rose-700 shrink-0" />,
          label: 'Bahaya Kesihatan'
        };
      case 'Oxidizer':
        return {
          border: 'border-yellow-400 text-yellow-950 bg-yellow-50/70',
          icon: <Sparkles className="w-3 h-3 text-yellow-700 shrink-0" />,
          label: 'Pengoksida'
        };
      case 'Environmental Hazard':
        return {
          border: 'border-emerald-300 text-emerald-950 bg-emerald-50/70',
          icon: <AlertTriangle className="w-3 h-3 text-emerald-700 shrink-0" />,
          label: 'Bahaya Alam Sekitar'
        };
      case 'Explosive':
        return {
          border: 'border-orange-400 text-orange-950 bg-orange-50/70',
          icon: <Flame className="w-3 h-3 text-orange-700 shrink-0" />,
          label: 'Mudah Meletup'
        };
      case 'Compressed Gas':
        return {
          border: 'border-sky-300 text-sky-950 bg-sky-50/70',
          icon: <Wind className="w-3 h-3 text-sky-700 shrink-0" />,
          label: 'Gas Bermatpat'
        };
      case 'Irritant / Harmful':
      default:
        return {
          border: 'border-amber-300 text-amber-900 bg-amber-50/60',
          icon: <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0" />,
          label: 'Merengsa / Berbahaya'
        };
    }
  };

  const config = getBadgeConfig(hazard);
  const sizeClasses = size === 'sm' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-1';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-xs border ${config.border} ${sizeClasses} whitespace-nowrap`}
      title={`Hazard GHS: ${hazard}`}
    >
      {showIcon && config.icon}
      <span>{config.label}</span>
    </span>
  );
};
