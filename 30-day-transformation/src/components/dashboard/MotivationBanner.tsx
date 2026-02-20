'use client';

import { TRANSFORMATION_STATS } from '@/lib/constants';
import { Lightbulb } from 'lucide-react';

interface MotivationBannerProps {
  day: number;
  mode: 'health' | 'ramadan';
}

const HEALTH_MESSAGES: Record<number, string> = {
  1: "Day 1! Your body is starting to adapt. Hunger peaks on day 1-3, then gets much easier.",
  2: "Glycogen stores depleting. Your body is learning to switch to fat fuel.",
  3: "The hardest days are behind you! Ghrelin (hunger hormone) is adjusting.",
  4: "Fat mobilization is improving. You may notice clearer thinking.",
  5: "5 days in! Your insulin sensitivity is already improving.",
  7: "One week done! Your body is becoming a fat-burning machine.",
  10: "Double digits! Autophagy is becoming more efficient each day.",
  14: "Two weeks! Your clothes should start fitting differently.",
  21: "Three weeks - this is now a habit. Your metabolism has shifted.",
  25: "Almost there! Your body has transformed at the cellular level.",
  30: "Day 30! You've completed the transformation. Look how far you've come!",
};

const RAMADAN_MESSAGES: Record<number, string> = {
  1: "Bismillah! The first fast. May Allah make it easy and reward you greatly.",
  3: "The Prophet (PBUH) said: 'Whoever fasts Ramadan with faith and seeking reward, his past sins are forgiven.'",
  7: "One week of Ramadan complete. Your body and soul are both being purified.",
  10: "The first 10 days of mercy. May Allah shower His mercy upon you.",
  14: "Halfway through Ramadan. You are in the days of forgiveness.",
  20: "The last 10 nights begin soon. Seek Laylatul Qadr!",
  21: "The last 10 days of freedom from the Fire. Increase your worship.",
  27: "The Night of Power is better than a thousand months.",
  30: "Eid Mubarak! You've completed Ramadan. May your fasts be accepted.",
};

function getMessageForDay(day: number, mode: 'health' | 'ramadan'): string {
  const messages = mode === 'ramadan' ? RAMADAN_MESSAGES : HEALTH_MESSAGES;
  // Find the closest message at or before the current day
  const keys = Object.keys(messages).map(Number).sort((a, b) => b - a);
  const key = keys.find((k) => k <= day) ?? keys[keys.length - 1];
  return messages[key];
}

function getRandomStat(): { value: string; label: string } {
  const stats = Object.values(TRANSFORMATION_STATS);
  return stats[Math.floor(Math.random() * stats.length)];
}

export default function MotivationBanner({ day, mode }: MotivationBannerProps) {
  const message = getMessageForDay(day, mode);
  const stat = getRandomStat();

  return (
    <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl border border-accent/20 p-4">
      <div className="flex items-start gap-3">
        <Lightbulb className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm text-foreground leading-relaxed">{message}</p>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-xs font-bold text-accent">{stat.value}</span>
            <span className="text-xs text-muted-foreground">{stat.label}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
