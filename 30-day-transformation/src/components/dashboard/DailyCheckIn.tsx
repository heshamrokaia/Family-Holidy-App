'use client';

import { useState } from 'react';
import { useTransformationStore } from '@/store/useTransformationStore';
import { todayISO } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { Check, Scale, Smile, Zap } from 'lucide-react';

interface DailyCheckInProps {
  onClose?: () => void;
}

const MOODS = [
  { value: 1 as const, emoji: '😫', label: 'Struggling' },
  { value: 2 as const, emoji: '😐', label: 'Okay' },
  { value: 3 as const, emoji: '🙂', label: 'Good' },
  { value: 4 as const, emoji: '😊', label: 'Great' },
  { value: 5 as const, emoji: '🔥', label: 'Amazing' },
];

const ENERGY = [
  { value: 1 as const, emoji: '🔋', label: 'Low' },
  { value: 2 as const, emoji: '🔋', label: 'Below avg' },
  { value: 3 as const, emoji: '🔋', label: 'Normal' },
  { value: 4 as const, emoji: '⚡', label: 'High' },
  { value: 5 as const, emoji: '⚡', label: 'Peak' },
];

export default function DailyCheckIn({ onClose }: DailyCheckInProps) {
  const updateDailyLog = useTransformationStore((s) => s.updateDailyLog);
  const dailyLogs = useTransformationStore((s) => s.dailyLogs);
  const today = todayISO();
  const log = dailyLogs.find((l) => l.date === today);

  const [weight, setWeight] = useState(log?.weight?.toString() ?? '');
  const [mood, setMood] = useState<1 | 2 | 3 | 4 | 5 | undefined>(log?.moodRating);
  const [energy, setEnergy] = useState<1 | 2 | 3 | 4 | 5 | undefined>(log?.energyRating);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    const updates: Record<string, unknown> = {};
    if (weight) updates.weight = Number(weight);
    if (mood) updates.moodRating = mood;
    if (energy) updates.energyRating = energy;
    updateDailyLog(today, updates);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose?.();
    }, 1500);
  };

  return (
    <div className="bg-card rounded-xl border border-border p-4 space-y-4">
      <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
        <Check className="w-4 h-4 text-accent" />
        Daily Check-in
      </h3>

      {/* Weight */}
      <div>
        <label className="text-xs font-medium text-muted-foreground flex items-center gap-1 mb-1.5">
          <Scale className="w-3 h-3" /> Weight (kg)
        </label>
        <input
          type="number"
          step="0.1"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          placeholder="Enter today's weight"
          className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>

      {/* Mood */}
      <div>
        <label className="text-xs font-medium text-muted-foreground flex items-center gap-1 mb-1.5">
          <Smile className="w-3 h-3" /> Mood
        </label>
        <div className="flex gap-2">
          {MOODS.map((m) => (
            <button
              key={m.value}
              onClick={() => setMood(m.value)}
              className={cn(
                'flex-1 py-2 rounded-lg border text-center transition-all',
                mood === m.value
                  ? 'border-accent bg-accent/10'
                  : 'border-border hover:border-accent/50'
              )}
            >
              <span className="text-lg">{m.emoji}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Energy */}
      <div>
        <label className="text-xs font-medium text-muted-foreground flex items-center gap-1 mb-1.5">
          <Zap className="w-3 h-3" /> Energy
        </label>
        <div className="flex gap-2">
          {ENERGY.map((e) => (
            <button
              key={e.value}
              onClick={() => setEnergy(e.value)}
              className={cn(
                'flex-1 py-2 rounded-lg border text-center transition-all',
                energy === e.value
                  ? 'border-accent bg-accent/10'
                  : 'border-border hover:border-accent/50'
              )}
            >
              <span className="text-lg">{e.emoji}</span>
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={saved}
        className={cn(
          'w-full py-2.5 rounded-xl font-medium text-sm transition-all',
          saved
            ? 'bg-green-500 text-white'
            : 'bg-accent text-accent-foreground hover:opacity-90'
        )}
      >
        {saved ? '✓ Saved!' : 'Save Check-in'}
      </button>
    </div>
  );
}
