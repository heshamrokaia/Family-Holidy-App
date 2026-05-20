'use client';

import { cn } from '@/lib/utils';
import { getMetabolicPhase, getPhaseLabel, getMetabolicDescription } from '@/lib/fasting-science';
import type { MetabolicPhase } from '@/types';
import { Zap, Flame, Battery, Sparkles } from 'lucide-react';

interface MetabolicStateCardProps {
  currentHour: number;
  isFasting: boolean;
}

const PHASE_ICONS: Record<MetabolicPhase, React.ComponentType<{ className?: string }>> = {
  fed: Battery,
  'early-fasting': Zap,
  'fat-burning': Flame,
  'deep-fasting': Sparkles,
};

const PHASE_STATS: Record<MetabolicPhase, { stat: string; label: string }> = {
  fed: { stat: 'Active', label: 'Insulin Level' },
  'early-fasting': { stat: '-50%', label: 'Insulin Drop' },
  'fat-burning': { stat: '+200%', label: 'Fat Oxidation' },
  'deep-fasting': { stat: '+500%', label: 'HGH Increase' },
};

export default function MetabolicStateCard({ currentHour, isFasting }: MetabolicStateCardProps) {
  const phase = isFasting ? getMetabolicPhase(currentHour) : 'fed';
  const Icon = PHASE_ICONS[phase];
  const stat = PHASE_STATS[phase];

  const bgClass = `bg-phase-${phase === 'fed' ? 'fed' : phase === 'early-fasting' ? 'early' : phase === 'fat-burning' ? 'burning' : 'deep'}`;

  return (
    <div className={cn('rounded-xl p-4 border border-border', bgClass)}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon className="w-5 h-5 text-foreground" />
          <h3 className="text-sm font-bold text-foreground">{getPhaseLabel(phase)}</h3>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-foreground">{stat.stat}</p>
          <p className="text-[10px] text-foreground/70">{stat.label}</p>
        </div>
      </div>
      <p className="text-xs text-foreground/80 leading-relaxed">
        {getMetabolicDescription(phase)}
      </p>
    </div>
  );
}
