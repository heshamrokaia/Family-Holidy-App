'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Salad } from 'lucide-react';

const PLATE_SECTIONS = [
  {
    label: 'Vegetables',
    portion: '1/2',
    color: '#22c55e',
    lightBg: 'bg-green-500/10',
    textColor: 'text-green-600 dark:text-green-400',
    dotColor: 'bg-green-500',
    examples: 'Leafy greens, broccoli, peppers, tomatoes',
  },
  {
    label: 'Protein',
    portion: '1/4',
    color: '#ef4444',
    lightBg: 'bg-red-500/10',
    textColor: 'text-red-600 dark:text-red-400',
    dotColor: 'bg-red-500',
    examples: 'Chicken, fish, lamb, eggs, legumes',
  },
  {
    label: 'Complex Carbs',
    portion: '1/4',
    color: '#f59e0b',
    lightBg: 'bg-amber-500/10',
    textColor: 'text-amber-600 dark:text-amber-400',
    dotColor: 'bg-amber-500',
    examples: 'Brown rice, quinoa, sweet potato, oats',
  },
];

export default function PlateComposition() {
  const size = 200;
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 8;

  // Helper to compute SVG arc path for a pie slice
  function describeArc(
    startAngle: number,
    endAngle: number
  ): string {
    const startRad = ((startAngle - 90) * Math.PI) / 180;
    const endRad = ((endAngle - 90) * Math.PI) / 180;

    const x1 = cx + r * Math.cos(startRad);
    const y1 = cy + r * Math.sin(startRad);
    const x2 = cx + r * Math.cos(endRad);
    const y2 = cy + r * Math.sin(endRad);

    const largeArc = endAngle - startAngle > 180 ? 1 : 0;

    return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;
  }

  // Compute label positions at the midpoint of each arc
  function labelPos(startAngle: number, endAngle: number) {
    const midAngle = ((startAngle + endAngle) / 2 - 90) * (Math.PI / 180);
    const labelR = r * 0.6;
    return {
      x: cx + labelR * Math.cos(midAngle),
      y: cy + labelR * Math.sin(midAngle),
    };
  }

  // Vegetables: 0-180 (half), Protein: 180-270 (quarter), Carbs: 270-360 (quarter)
  const slices = [
    { startAngle: 0, endAngle: 180, color: PLATE_SECTIONS[0].color, label: '1/2', sublabel: 'Veggies' },
    { startAngle: 180, endAngle: 270, color: PLATE_SECTIONS[1].color, label: '1/4', sublabel: 'Protein' },
    { startAngle: 270, endAngle: 360, color: PLATE_SECTIONS[2].color, label: '1/4', sublabel: 'Carbs' },
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
            <Salad className="w-4 h-4 text-emerald-500" />
          </div>
          <CardTitle className="text-base">Ideal Plate</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* SVG Plate */}
        <div className="flex justify-center">
          <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            className="drop-shadow-sm"
          >
            {/* Plate rim */}
            <circle
              cx={cx}
              cy={cy}
              r={r + 4}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-border"
            />

            {/* Slices */}
            {slices.map((slice, i) => (
              <path
                key={i}
                d={describeArc(slice.startAngle, slice.endAngle)}
                fill={slice.color}
                opacity={0.85}
                stroke="white"
                strokeWidth="2"
              />
            ))}

            {/* Labels on slices */}
            {slices.map((slice, i) => {
              const pos = labelPos(slice.startAngle, slice.endAngle);
              return (
                <g key={`label-${i}`}>
                  <text
                    x={pos.x}
                    y={pos.y - 6}
                    textAnchor="middle"
                    fill="white"
                    fontSize="14"
                    fontWeight="700"
                    className="drop-shadow-md"
                  >
                    {slice.label}
                  </text>
                  <text
                    x={pos.x}
                    y={pos.y + 10}
                    textAnchor="middle"
                    fill="white"
                    fontSize="10"
                    fontWeight="500"
                    className="drop-shadow-md"
                  >
                    {slice.sublabel}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Legend */}
        <div className="space-y-2">
          {PLATE_SECTIONS.map((section) => (
            <div key={section.label} className="flex items-start gap-3">
              <div
                className={cn('w-3 h-3 rounded-full mt-0.5 shrink-0', section.dotColor)}
              />
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className={cn('text-sm font-medium', section.textColor)}>
                    {section.portion} {section.label}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{section.examples}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
