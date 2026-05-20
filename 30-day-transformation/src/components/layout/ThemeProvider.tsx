'use client';

import { useEffect } from 'react';
import { useTransformationStore } from '@/store/useTransformationStore';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useTransformationStore((s) => s.settings.theme);
  const hydrated = useTransformationStore((s) => s.hydrated);

  useEffect(() => {
    if (!hydrated) return;

    const root = document.documentElement;

    if (theme === 'system') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      root.classList.toggle('dark', mq.matches);

      const handler = (e: MediaQueryListEvent) => {
        root.classList.toggle('dark', e.matches);
      };
      mq.addEventListener('change', handler);
      return () => mq.removeEventListener('change', handler);
    }

    root.classList.toggle('dark', theme === 'dark');
  }, [theme, hydrated]);

  return <>{children}</>;
}
