'use client';

import { useState } from 'react';
import { useTransformationStore } from '@/store/useTransformationStore';
import MobileNav from '@/components/layout/MobileNav';
import PageHeader from '@/components/layout/PageHeader';
import { cn } from '@/lib/utils';
import { Moon, Sun, Smartphone, Scale, Ruler, Droplets, Trash2, Download, Info } from 'lucide-react';
import type { AppMode } from '@/types';

export default function SettingsPage() {
  const hydrated = useTransformationStore((s) => s.hydrated);
  const profile = useTransformationStore((s) => s.userProfile);
  const schedule = useTransformationStore((s) => s.fastingSchedule);
  const settings = useTransformationStore((s) => s.settings);
  const setUserProfile = useTransformationStore((s) => s.setUserProfile);
  const setFastingSchedule = useTransformationStore((s) => s.setFastingSchedule);
  const setMode = useTransformationStore((s) => s.setMode);
  const setTheme = useTransformationStore((s) => s.setTheme);
  const updateSettings = useTransformationStore((s) => s.updateSettings);
  const resetJourney = useTransformationStore((s) => s.resetJourney);

  const [showResetConfirm, setShowResetConfirm] = useState(false);

  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse w-10 h-10 rounded-full bg-accent/20" />
      </div>
    );
  }

  const handleExportData = () => {
    const data = {
      profile,
      schedule,
      settings,
      dailyLogs: useTransformationStore.getState().dailyLogs,
      bodyPhotos: useTransformationStore.getState().bodyPhotos,
      weightPredictions: useTransformationStore.getState().weightPredictions,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `30-day-transformation-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="px-4 pt-6 pb-4 max-w-lg mx-auto space-y-6">
        <PageHeader title="Settings" />

        {/* Profile Section */}
        <Section title="Profile">
          <SettingRow label="Name">
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setUserProfile({ name: e.target.value })}
              className="text-right text-sm bg-transparent text-foreground focus:outline-none"
            />
          </SettingRow>
          <SettingRow label="Current Weight (kg)">
            <input
              type="number"
              value={profile.currentWeight}
              onChange={(e) => setUserProfile({ currentWeight: Number(e.target.value) })}
              className="text-right text-sm bg-transparent text-foreground w-20 focus:outline-none"
            />
          </SettingRow>
          <SettingRow label="Goal Weight (kg)">
            <input
              type="number"
              value={profile.goalWeight}
              onChange={(e) => setUserProfile({ goalWeight: Number(e.target.value) })}
              className="text-right text-sm bg-transparent text-foreground w-20 focus:outline-none"
            />
          </SettingRow>
          <SettingRow label="Height (cm)">
            <span className="text-sm text-muted-foreground">{profile.height}</span>
          </SettingRow>
          <SettingRow label="Age">
            <span className="text-sm text-muted-foreground">{profile.age}</span>
          </SettingRow>
        </Section>

        {/* Fasting Schedule */}
        <Section title="Fasting Schedule">
          <SettingRow label="Fast Starts">
            <input
              type="time"
              value={schedule.startTime}
              onChange={(e) => setFastingSchedule({ startTime: e.target.value, isCustom: true })}
              className="text-sm bg-transparent text-foreground focus:outline-none"
            />
          </SettingRow>
          <SettingRow label="Fast Ends">
            <input
              type="time"
              value={schedule.endTime}
              onChange={(e) => setFastingSchedule({ endTime: e.target.value, isCustom: true })}
              className="text-sm bg-transparent text-foreground focus:outline-none"
            />
          </SettingRow>
          <SettingRow label="Timezone">
            <span className="text-sm text-muted-foreground">{schedule.timezone}</span>
          </SettingRow>
        </Section>

        {/* App Mode */}
        <Section title="Mode">
          <div className="grid grid-cols-2 gap-3 p-1">
            {([
              { mode: 'health' as AppMode, icon: Sun, label: 'Health', desc: 'Science focus' },
              { mode: 'ramadan' as AppMode, icon: Moon, label: 'Ramadan', desc: 'Spiritual + health' },
            ]).map((opt) => (
              <button
                key={opt.mode}
                onClick={() => setMode(opt.mode)}
                className={cn(
                  'px-4 py-3 rounded-xl border text-center transition-all',
                  settings.mode === opt.mode
                    ? 'border-accent bg-accent/10'
                    : 'border-border hover:border-accent/50'
                )}
              >
                <opt.icon className={cn('w-5 h-5 mx-auto mb-1', settings.mode === opt.mode ? 'text-accent' : 'text-muted-foreground')} />
                <p className={cn('text-sm font-medium', settings.mode === opt.mode ? 'text-accent' : 'text-foreground')}>{opt.label}</p>
                <p className="text-[10px] text-muted-foreground">{opt.desc}</p>
              </button>
            ))}
          </div>
        </Section>

        {/* Appearance */}
        <Section title="Appearance">
          <div className="grid grid-cols-3 gap-2 p-1">
            {([
              { theme: 'light' as const, icon: Sun, label: 'Light' },
              { theme: 'dark' as const, icon: Moon, label: 'Dark' },
              { theme: 'system' as const, icon: Smartphone, label: 'System' },
            ]).map((opt) => (
              <button
                key={opt.theme}
                onClick={() => setTheme(opt.theme)}
                className={cn(
                  'px-3 py-2.5 rounded-xl border text-center transition-all',
                  settings.theme === opt.theme
                    ? 'border-accent bg-accent/10'
                    : 'border-border hover:border-accent/50'
                )}
              >
                <opt.icon className={cn('w-4 h-4 mx-auto mb-1', settings.theme === opt.theme ? 'text-accent' : 'text-muted-foreground')} />
                <p className="text-xs font-medium">{opt.label}</p>
              </button>
            ))}
          </div>
        </Section>

        {/* Units */}
        <Section title="Units">
          <SettingRow label="Weight" icon={<Scale className="w-4 h-4" />}>
            <div className="flex gap-1">
              {(['kg', 'lbs'] as const).map((u) => (
                <button
                  key={u}
                  onClick={() => updateSettings({ weightUnit: u })}
                  className={cn(
                    'px-3 py-1 rounded-lg text-xs font-medium transition-all',
                    settings.weightUnit === u ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground'
                  )}
                >{u}</button>
              ))}
            </div>
          </SettingRow>
          <SettingRow label="Height" icon={<Ruler className="w-4 h-4" />}>
            <div className="flex gap-1">
              {(['cm', 'ft'] as const).map((u) => (
                <button
                  key={u}
                  onClick={() => updateSettings({ heightUnit: u })}
                  className={cn(
                    'px-3 py-1 rounded-lg text-xs font-medium transition-all',
                    settings.heightUnit === u ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground'
                  )}
                >{u}</button>
              ))}
            </div>
          </SettingRow>
          <SettingRow label="Water" icon={<Droplets className="w-4 h-4" />}>
            <div className="flex gap-1">
              {(['ml', 'oz'] as const).map((u) => (
                <button
                  key={u}
                  onClick={() => updateSettings({ waterUnit: u })}
                  className={cn(
                    'px-3 py-1 rounded-lg text-xs font-medium transition-all',
                    settings.waterUnit === u ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground'
                  )}
                >{u}</button>
              ))}
            </div>
          </SettingRow>
        </Section>

        {/* Data */}
        <Section title="Data">
          <button
            onClick={handleExportData}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted rounded-lg transition-colors"
          >
            <Download className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-foreground">Export Data (JSON)</span>
          </button>
          <button
            onClick={() => setShowResetConfirm(true)}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4 text-red-500" />
            <span className="text-sm text-red-500">Reset Journey</span>
          </button>
        </Section>

        {/* Reset Confirmation */}
        {showResetConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-card rounded-2xl p-6 max-w-sm w-full border border-border animate-slide-up">
              <h3 className="text-lg font-bold text-foreground mb-2">Reset Journey?</h3>
              <p className="text-sm text-muted-foreground mb-6">
                This will delete all your progress, photos, and logs. This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 py-2.5 rounded-xl border border-border font-medium text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    resetJourney();
                    setShowResetConfirm(false);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-medium text-sm"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        )}

        {/* About */}
        <div className="flex items-center justify-center gap-2 py-4">
          <Info className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">30-Day Transformation v1.0</span>
        </div>
      </div>

      <MobileNav />
    </div>
  );
}

// Helper components
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 pt-4 pb-2">
        {title}
      </h3>
      <div className="divide-y divide-border">
        {children}
      </div>
    </div>
  );
}

function SettingRow({ label, icon, children }: { label: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <div className="flex items-center gap-2">
        {icon && <span className="text-muted-foreground">{icon}</span>}
        <span className="text-sm text-foreground">{label}</span>
      </div>
      {children}
    </div>
  );
}
