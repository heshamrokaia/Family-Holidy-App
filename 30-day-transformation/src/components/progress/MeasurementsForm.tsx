'use client';

import { useState } from 'react';
import { useTransformationStore } from '@/store/useTransformationStore';
import { todayISO } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Save, TrendingDown, TrendingUp, Minus } from 'lucide-react';

interface MeasurementField {
  key: 'waistCm' | 'chestCm' | 'hipsCm' | 'armCm';
  label: string;
  placeholder: string;
}

const FIELDS: MeasurementField[] = [
  { key: 'waistCm', label: 'Waist (cm)', placeholder: 'e.g. 85' },
  { key: 'chestCm', label: 'Chest (cm)', placeholder: 'e.g. 100' },
  { key: 'hipsCm', label: 'Hips (cm)', placeholder: 'e.g. 95' },
  { key: 'armCm', label: 'Arms (cm)', placeholder: 'e.g. 33' },
];

export default function MeasurementsForm() {
  const dailyLogs = useTransformationStore((s) => s.dailyLogs);
  const updateDailyLog = useTransformationStore((s) => s.updateDailyLog);
  const getOrCreateDailyLog = useTransformationStore((s) => s.getOrCreateDailyLog);

  const today = todayISO();
  const todayLog = dailyLogs.find((l) => l.date === today);

  const [waist, setWaist] = useState(todayLog?.waistCm?.toString() ?? '');
  const [chest, setChest] = useState(todayLog?.chestCm?.toString() ?? '');
  const [hips, setHips] = useState(todayLog?.hipsCm?.toString() ?? '');
  const [arms, setArms] = useState(todayLog?.armCm?.toString() ?? '');
  const [saved, setSaved] = useState(false);

  // Find Day 1 values for comparison
  const day1Log = dailyLogs.find((l) => l.day === 1);

  const values: Record<string, string> = {
    waistCm: waist,
    chestCm: chest,
    hipsCm: hips,
    armCm: arms,
  };

  const setters: Record<string, (val: string) => void> = {
    waistCm: setWaist,
    chestCm: setChest,
    hipsCm: setHips,
    armCm: setArms,
  };

  function getDay1Value(key: string): number | undefined {
    if (!day1Log) return undefined;
    return day1Log[key as keyof typeof day1Log] as number | undefined;
  }

  function getDifference(key: string, currentValue: string): { diff: number; icon: React.ElementType } | null {
    const day1Val = getDay1Value(key);
    const current = parseFloat(currentValue);
    if (!day1Val || isNaN(current)) return null;

    const diff = current - day1Val;
    if (Math.abs(diff) < 0.1) return { diff: 0, icon: Minus };
    return {
      diff,
      icon: diff < 0 ? TrendingDown : TrendingUp,
    };
  }

  function handleSave() {
    getOrCreateDailyLog(today);

    const updates: Record<string, number | undefined> = {};
    if (waist) updates.waistCm = parseFloat(waist);
    if (chest) updates.chestCm = parseFloat(chest);
    if (hips) updates.hipsCm = parseFloat(hips);
    if (arms) updates.armCm = parseFloat(arms);

    updateDailyLog(today, updates);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-4">
      {FIELDS.map((field) => {
        const comparison = getDifference(field.key, values[field.key]);

        return (
          <div key={field.key} className="space-y-1.5">
            <Label htmlFor={field.key} className="text-sm">
              {field.label}
            </Label>
            <div className="flex items-center gap-3">
              <Input
                id={field.key}
                type="number"
                step="0.1"
                placeholder={field.placeholder}
                value={values[field.key]}
                onChange={(e) => setters[field.key](e.target.value)}
                className="flex-1"
              />
              {comparison && (
                <div
                  className={cn(
                    'flex items-center gap-1 text-xs font-medium min-w-[70px]',
                    comparison.diff < 0
                      ? 'text-green-500'
                      : comparison.diff > 0
                        ? 'text-red-400'
                        : 'text-muted-foreground'
                  )}
                >
                  <comparison.icon className="w-3.5 h-3.5" />
                  <span>
                    {comparison.diff === 0
                      ? 'No change'
                      : `${comparison.diff > 0 ? '+' : ''}${comparison.diff.toFixed(1)} cm`}
                  </span>
                </div>
              )}
            </div>
            {getDay1Value(field.key) && (
              <p className="text-[11px] text-muted-foreground">
                Day 1: {getDay1Value(field.key)} cm
              </p>
            )}
          </div>
        );
      })}

      <Button onClick={handleSave} className="w-full mt-2">
        <Save className="w-4 h-4 mr-2" />
        {saved ? 'Saved!' : 'Save Measurements'}
      </Button>
    </div>
  );
}
