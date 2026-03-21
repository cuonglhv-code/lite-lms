'use client'

import {
  LineChart as ReLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'

interface DataPoint { date: string; score: number }

export default function LineChartWidget({ data, title }: { data: DataPoint[]; title: string }) {
  return (
    <div className="flex-1 min-w-0">
      <h3 className="text-sm font-semibold text-gray-700 mb-2">{title}</h3>
      <ResponsiveContainer width="100%" height={220}>
        <ReLineChart data={data} margin={{ top: 4, right: 8, bottom: 20, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ fontSize: 11 }} />
          <YAxis domain={[0, 100]} tickFormatter={v => `${v}%`} tick={{ fontSize: 11 }} />
          <Tooltip formatter={(v) => [`${Number(v).toFixed(1)}%`]} />
          <Line type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={2} dot={{ r: 4 }} />
        </ReLineChart>
      </ResponsiveContainer>
    </div>
  )
}
