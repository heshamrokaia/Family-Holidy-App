'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTransformationStore } from '@/store/useTransformationStore';
import { Timer, Flame, TrendingDown, Sparkles } from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  const hydrated = useTransformationStore((s) => s.hydrated);
  const onboardingComplete = useTransformationStore((s) => s.settings.onboardingComplete);

  useEffect(() => {
    if (hydrated && onboardingComplete) {
      router.replace('/dashboard');
    }
  }, [hydrated, onboardingComplete, router]);

  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-accent/20" />
          <div className="w-32 h-4 rounded bg-muted" />
        </div>
      </div>
    );
  }

  if (onboardingComplete) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        {/* Icon */}
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-8 shadow-lg shadow-indigo-500/25">
          <Flame className="w-10 h-10 text-white" />
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
          30-Day
        </h1>
        <h1 className="text-4xl font-bold text-center text-foreground mb-3">
          Transformation
        </h1>
        <p className="text-center text-muted-foreground max-w-sm mb-12">
          Science-backed intermittent fasting tracker for your body transformation journey
        </p>

        {/* Feature Cards */}
        <div className="grid grid-cols-2 gap-3 max-w-sm w-full mb-12">
          {[
            { icon: Timer, label: 'Live Fasting Timer', desc: 'Hour-by-hour tracking' },
            { icon: TrendingDown, label: 'Body Predictions', desc: 'AI-powered progress' },
            { icon: Sparkles, label: 'Science-Backed', desc: '30-day protocol' },
            { icon: Flame, label: 'Transformation', desc: 'Visual journey' },
          ].map((feature) => (
            <div
              key={feature.label}
              className="bg-card border border-border rounded-xl p-4 text-center"
            >
              <feature.icon className="w-6 h-6 mx-auto mb-2 text-accent" />
              <p className="text-sm font-semibold text-foreground">{feature.label}</p>
              <p className="text-xs text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={() => router.push('/onboarding')}
          className="w-full max-w-sm bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold py-4 rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all active:scale-[0.98]"
        >
          Start Your Journey
        </button>

        <p className="text-xs text-muted-foreground mt-4 text-center">
          No account needed. All data stays on your device.
        </p>
      </div>
    </div>
  );
}
