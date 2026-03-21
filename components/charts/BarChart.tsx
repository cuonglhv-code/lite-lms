'use client'

import {
  BarChart as ReBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer,
} from 'recharts'

interface DataPoint { name: string; value: number }

function barColor(value: number, thresholdGood: number, thresholdWarn: number) {
  if (value >= thresholdGood) return '#22c55e'
  if (value >= thresholdWarn) return '#eab308'
  return '#ef4444'
}

export default function BarChartWidget({
  data, title, unit = '%',
  thresholdGood = 80, thresholdWarn = 65,
}: {
  data: DataPoint[]
  title: string
  unit?: string
  thresholdGood?: number
  thresholdWarn?: number
}) {
  return (
    <div className="flex-1 min-w-0">
      <h3 className="text-sm font-semibold text-gray-700 mb-2">{title}</h3>
      <ResponsiveContainer width="100%" height={200}>
        <ReBarChart data={data} margin={{ top: 4, right: 8, bottom: 40, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-30} textAnchor="end" />
          <YAxis tickFormatter={v => `${v}${unit}`} tick={{ fontSize: 11 }} />
          <Tooltip formatter={(v) => [`${Number(v).toFixed(1)}${unit}`]} />
          <Bar dataKey="value">
            {data.map((entry, i) => (
              <Cell key={i} fill={barColor(entry.value, thresholdGood, thresholdWarn)} />
            ))}
          </Bar>
        </ReBarChart>
      </ResponsiveContainer>
    </div>
  )
}
