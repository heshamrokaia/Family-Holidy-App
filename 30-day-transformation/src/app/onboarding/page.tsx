'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTransformationStore } from '@/store/useTransformationStore';
import OnboardingProgress from '@/components/onboarding/OnboardingProgress';
import PhotoCapture from '@/components/onboarding/PhotoCapture';
import { FASTING_PRESETS } from '@/lib/constants';
import { todayISO, generateId, getTimezone } from '@/lib/utils';
import { ArrowLeft, ArrowRight, Sparkles, Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Gender, DietPreference, ExerciseLevel, PhotoAngle } from '@/types';

const TOTAL_STEPS = 5;

export default function OnboardingPage() {
  const router = useRouter();
  const store = useTransformationStore();
  const [step, setStep] = useState(0);

  // Step 1: Profile
  const [name, setName] = useState('');
  const [weight, setWeight] = useState('80');
  const [height, setHeight] = useState('175');
  const [age, setAge] = useState('30');
  const [gender, setGender] = useState<Gender>('male');

  // Step 2: Goals
  const [goalWeight, setGoalWeight] = useState('75');
  const [goalPhoto, setGoalPhoto] = useState<string | null>(null);

  // Step 3: Schedule
  const [selectedPreset, setSelectedPreset] = useState(0);
  const [customStart, setCustomStart] = useState('05:16');
  const [customEnd, setCustomEnd] = useState('20:16');

  // Step 4: Diet
  const [diet, setDiet] = useState<DietPreference>('minimal-carbs');
  const [exercise, setExercise] = useState<ExerciseLevel>('light');

  // Step 5: Photos
  const [photos, setPhotos] = useState<Record<PhotoAngle, string>>({
    front: '', left: '', right: '', back: '',
  });

  // Step 5: Mode
  const [mode, setMode] = useState<'health' | 'ramadan'>('health');

  const canProceed = () => {
    switch (step) {
      case 0: return name.trim() && Number(weight) > 0 && Number(height) > 0 && Number(age) > 0;
      case 1: return Number(goalWeight) > 0;
      case 2: return true;
      case 3: return true;
      case 4: return true; // Photos are optional
      default: return false;
    }
  };

  const handleComplete = () => {
    const preset = FASTING_PRESETS[selectedPreset];
    const startTime = preset.label === 'Custom' ? customStart : preset.startTime;
    const endTime = preset.label === 'Custom' ? customEnd : preset.endTime;

    store.setUserProfile({
      id: generateId(),
      name: name.trim(),
      startingWeight: Number(weight),
      currentWeight: Number(weight),
      goalWeight: Number(goalWeight),
      height: Number(height),
      age: Number(age),
      gender,
      dietPreference: diet,
      exerciseLevel: exercise,
      startDate: todayISO(),
      createdAt: todayISO(),
      updatedAt: todayISO(),
    });

    store.setFastingSchedule({
      startTime,
      endTime,
      isCustom: preset.label === 'Custom',
      timezone: getTimezone(),
    });

    // Save photos
    const angles: PhotoAngle[] = ['front', 'left', 'right', 'back'];
    angles.forEach((angle) => {
      if (photos[angle]) {
        store.addBodyPhoto({
          angle,
          dataUrl: photos[angle],
          takenAt: todayISO(),
          day: 0,
        });
      }
    });

    if (goalPhoto) {
      store.setGoalPhoto({
        dataUrl: goalPhoto,
        uploadedAt: todayISO(),
      });
    }

    store.setMode(mode);
    store.generatePredictions();
    store.completeOnboarding();
    router.replace('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 px-6 pt-8 pb-24 max-w-lg mx-auto w-full">
        <OnboardingProgress currentStep={step} totalSteps={TOTAL_STEPS} />

        <div className="animate-fade-in">
          {/* Step 1: Profile */}
          {step === 0 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground">About You</h2>
                <p className="text-sm text-muted-foreground mt-1">Let&apos;s set up your profile</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground block mb-1.5">Your Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground block mb-1.5">Gender</label>
                  <div className="grid grid-cols-2 gap-3">
                    {(['male', 'female'] as Gender[]).map((g) => (
                      <button
                        key={g}
                        onClick={() => setGender(g)}
                        className={cn(
                          'px-4 py-3 rounded-xl border text-sm font-medium transition-all',
                          gender === g
                            ? 'border-accent bg-accent/10 text-accent'
                            : 'border-border bg-card text-foreground hover:border-accent/50'
                        )}
                      >
                        {g === 'male' ? '♂ Male' : '♀ Female'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-1.5">Weight (kg)</label>
                    <input
                      type="number"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground text-center focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-1.5">Height (cm)</label>
                    <input
                      type="number"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground text-center focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-1.5">Age</label>
                    <input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground text-center focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Goals */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Your Goals</h2>
                <p className="text-sm text-muted-foreground mt-1">What do you want to achieve?</p>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Target Weight (kg)</label>
                <input
                  type="number"
                  value={goalWeight}
                  onChange={(e) => setGoalWeight(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground text-center text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-accent"
                />
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Based on science, you can expect to lose 2-4 kg in 30 days
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Goal Photo (optional)</label>
                <p className="text-xs text-muted-foreground mb-3">Upload an image of the body shape you&apos;re aiming for</p>
                {goalPhoto ? (
                  <div className="relative w-48 mx-auto">
                    <img src={goalPhoto} alt="Goal" className="w-full rounded-xl border-2 border-accent/50" />
                    <button
                      onClick={() => setGoalPhoto(null)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <label className="block w-48 mx-auto aspect-[3/4] rounded-xl border-2 border-dashed border-border hover:border-accent cursor-pointer flex items-center justify-center">
                    <span className="text-sm text-muted-foreground">Tap to upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const { compressPhoto } = await import('@/lib/morphing');
                          setGoalPhoto(await compressPhoto(file));
                        }
                      }}
                    />
                  </label>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Schedule */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Fasting Schedule</h2>
                <p className="text-sm text-muted-foreground mt-1">Choose your fasting protocol</p>
              </div>

              <div className="space-y-2">
                {FASTING_PRESETS.map((preset, i) => (
                  <button
                    key={preset.label}
                    onClick={() => {
                      setSelectedPreset(i);
                      if (preset.startTime) {
                        setCustomStart(preset.startTime);
                        setCustomEnd(preset.endTime);
                      }
                    }}
                    className={cn(
                      'w-full flex items-center justify-between px-4 py-3.5 rounded-xl border transition-all text-left',
                      selectedPreset === i
                        ? 'border-accent bg-accent/10'
                        : 'border-border bg-card hover:border-accent/50'
                    )}
                  >
                    <div>
                      <p className={cn('font-medium text-sm', selectedPreset === i ? 'text-accent' : 'text-foreground')}>
                        {preset.label}
                      </p>
                      {preset.description && (
                        <p className="text-xs text-muted-foreground">{preset.description}</p>
                      )}
                    </div>
                    {preset.startTime && (
                      <span className="text-xs text-muted-foreground font-mono">
                        {preset.startTime} - {preset.endTime}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {FASTING_PRESETS[selectedPreset].label === 'Custom' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-1.5">Fast Starts</label>
                    <input
                      type="time"
                      value={customStart}
                      onChange={(e) => setCustomStart(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-1.5">Fast Ends</label>
                    <input
                      type="time"
                      value={customEnd}
                      onChange={(e) => setCustomEnd(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Diet & Exercise */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Diet & Exercise</h2>
                <p className="text-sm text-muted-foreground mt-1">Customize your approach</p>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground block mb-2">Diet Preference</label>
                <div className="space-y-2">
                  {([
                    { value: 'minimal-carbs' as DietPreference, label: 'Minimal Carbs', desc: 'Maximum fat burning. Only healthy carbs (dates, sweet potato, rice).' },
                    { value: 'balanced' as DietPreference, label: 'Balanced', desc: 'Moderate carbs with focus on whole foods.' },
                    { value: 'custom' as DietPreference, label: 'Custom', desc: 'No restrictions. I\'ll manage my own diet.' },
                  ]).map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setDiet(opt.value)}
                      className={cn(
                        'w-full text-left px-4 py-3 rounded-xl border transition-all',
                        diet === opt.value
                          ? 'border-accent bg-accent/10'
                          : 'border-border bg-card hover:border-accent/50'
                      )}
                    >
                      <p className={cn('font-medium text-sm', diet === opt.value ? 'text-accent' : 'text-foreground')}>
                        {opt.label}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">{opt.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground block mb-2">Exercise Level</label>
                <div className="grid grid-cols-2 gap-2">
                  {([
                    { value: 'none' as ExerciseLevel, label: 'None', emoji: '🧘' },
                    { value: 'light' as ExerciseLevel, label: 'Light', emoji: '🚶' },
                    { value: 'moderate' as ExerciseLevel, label: 'Moderate', emoji: '🏃' },
                    { value: 'intense' as ExerciseLevel, label: 'Intense', emoji: '💪' },
                  ]).map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setExercise(opt.value)}
                      className={cn(
                        'px-4 py-3 rounded-xl border text-center transition-all',
                        exercise === opt.value
                          ? 'border-accent bg-accent/10'
                          : 'border-border bg-card hover:border-accent/50'
                      )}
                    >
                      <span className="text-2xl">{opt.emoji}</span>
                      <p className={cn('text-sm font-medium mt-1', exercise === opt.value ? 'text-accent' : 'text-foreground')}>
                        {opt.label}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground block mb-2">App Mode</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setMode('health')}
                    className={cn(
                      'px-4 py-4 rounded-xl border text-center transition-all',
                      mode === 'health'
                        ? 'border-accent bg-accent/10'
                        : 'border-border bg-card hover:border-accent/50'
                    )}
                  >
                    <Sun className={cn('w-6 h-6 mx-auto mb-1', mode === 'health' ? 'text-accent' : 'text-muted-foreground')} />
                    <p className={cn('text-sm font-medium', mode === 'health' ? 'text-accent' : 'text-foreground')}>Health Mode</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Science & weight loss focus</p>
                  </button>
                  <button
                    onClick={() => setMode('ramadan')}
                    className={cn(
                      'px-4 py-4 rounded-xl border text-center transition-all',
                      mode === 'ramadan'
                        ? 'border-ramadan-gold bg-ramadan-gold/10'
                        : 'border-border bg-card hover:border-ramadan-gold/50'
                    )}
                  >
                    <Moon className={cn('w-6 h-6 mx-auto mb-1', mode === 'ramadan' ? 'text-ramadan-gold' : 'text-muted-foreground')} />
                    <p className={cn('text-sm font-medium', mode === 'ramadan' ? 'text-ramadan-gold' : 'text-foreground')}>Ramadan Mode</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Spiritual + health benefits</p>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Photos */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Body Photos</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Upload photos from 4 angles. We&apos;ll predict your transformation!
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {(['front', 'left', 'right', 'back'] as PhotoAngle[]).map((angle) => (
                  <PhotoCapture
                    key={angle}
                    angle={angle}
                    currentPhoto={photos[angle] || undefined}
                    onCapture={(dataUrl) => setPhotos((prev) => ({ ...prev, [angle]: dataUrl }))}
                    onRemove={() => setPhotos((prev) => ({ ...prev, [angle]: '' }))}
                  />
                ))}
              </div>

              <p className="text-xs text-muted-foreground text-center">
                Photos are stored only on your device. You can skip and add them later.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 inset-x-0 bg-card border-t border-border p-4 safe-area-bottom">
        <div className="max-w-lg mx-auto flex gap-3">
          {step > 0 && (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="px-6 py-3.5 rounded-xl border border-border text-foreground font-medium flex items-center gap-2 hover:bg-muted transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          )}
          <button
            onClick={() => {
              if (step < TOTAL_STEPS - 1) {
                setStep((s) => s + 1);
              } else {
                handleComplete();
              }
            }}
            disabled={!canProceed()}
            className={cn(
              'flex-1 py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all',
              canProceed()
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25 active:scale-[0.98]'
                : 'bg-muted text-muted-foreground cursor-not-allowed'
            )}
          >
            {step === TOTAL_STEPS - 1 ? (
              <>
                <Sparkles className="w-4 h-4" />
                Start My Journey
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
