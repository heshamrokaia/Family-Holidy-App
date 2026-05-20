'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
} from 'recharts';
import { DailyLog, WeightPrediction } from '@/types';

interface WeightChartProps {
  dailyLogs: DailyLog[];
  predictions: WeightPrediction[];
  startingWeight: number;
  goalWeight: number;
}

interface ChartDataPoint {
  day: number;
  predicted?: number;
  actual?: number;
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; dataKey: string; color: string }>;
  label?: number;
}) {
  if (!active || !payload || payload.length === 0) return null;

  const predicted = payload.find((p) => p.dataKey === 'predicted');
  const actual = payload.find((p) => p.dataKey === 'actual');

  return (
    <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
      <p className="text-sm font-semibold text-foreground mb-1">Day {label}</p>
      {predicted && (
        <p className="text-xs text-purple-500">
          Predicted: {predicted.value.toFixed(1)} kg
        </p>
      )}
      {actual && (
        <p className="text-xs text-blue-500">
          Actual: {actual.value.toFixed(1)} kg
        </p>
      )}
    </div>
  );
}

export default function WeightChart({
  dailyLogs,
  predictions,
  startingWeight,
  goalWeight,
}: WeightChartProps) {
  // Build chart data by merging predictions and actual logs
  const chartData: ChartDataPoint[] = [];

  for (let day = 0; day <= 30; day++) {
    const prediction = predictions.find((p) => p.day === day);
    const log = dailyLogs.find((l) => l.day === day);

    chartData.push({
      day,
      predicted: prediction?.predictedWeight,
      actual: log?.weight ?? undefined,
    });
  }

  // Calculate Y axis domain with some padding
  const allWeights = [
    startingWeight,
    goalWeight,
    ...predictions.map((p) => p.predictedWeight),
    ...dailyLogs.filter((l) => l.weight).map((l) => l.weight!),
  ];
  const minWeight = Math.floor(Math.min(...allWeights) - 1);
  const maxWeight = Math.ceil(Math.max(...allWeights) + 1);

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 10, left: -10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis
            dataKey="day"
            tick={{ fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            label={{
              value: 'Day',
              position: 'insideBottomRight',
              offset: -5,
              fontSize: 11,
              fill: 'hsl(var(--muted-foreground))',
            }}
          />
          <YAxis
            domain={[minWeight, maxWeight]}
            tick={{ fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `${v}`}
            label={{
              value: 'kg',
              position: 'insideTopLeft',
              offset: 10,
              fontSize: 11,
              fill: 'hsl(var(--muted-foreground))',
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="top"
            height={36}
            iconType="line"
            wrapperStyle={{ fontSize: 12 }}
          />

          {/* Starting weight reference line */}
          <ReferenceLine
            y={startingWeight}
            stroke="hsl(var(--muted-foreground))"
            strokeDasharray="4 4"
            strokeWidth={1}
            label={{
              value: `Start: ${startingWeight}`,
              position: 'right',
              fontSize: 10,
              fill: 'hsl(var(--muted-foreground))',
            }}
          />

          {/* Goal weight reference line */}
          <ReferenceLine
            y={goalWeight}
            stroke="#22c55e"
            strokeDasharray="4 4"
            strokeWidth={1}
            label={{
              value: `Goal: ${goalWeight}`,
              position: 'right',
              fontSize: 10,
              fill: '#22c55e',
            }}
          />

          {/* Predicted weight line (dashed, purple) */}
          <Line
            type="monotone"
            dataKey="predicted"
            name="Predicted"
            stroke="#a855f7"
            strokeWidth={2}
            strokeDasharray="6 3"
            dot={false}
            connectNulls
          />

          {/* Actual weight line (solid, blue) */}
          <Line
            type="monotone"
            dataKey="actual"
            name="Actual"
            stroke="#3b82f6"
            strokeWidth={2.5}
            dot={{ r: 3, fill: '#3b82f6', strokeWidth: 0 }}
            activeDot={{ r: 5, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }}
            connectNulls
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
