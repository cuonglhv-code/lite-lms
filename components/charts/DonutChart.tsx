'use client'

import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts'

const COLORS = ['#22c55e', '#eab308', '#ef4444', '#6366f1']

interface DataPoint { name: string; value: number }

export default function DonutChart({ data, title }: { data: DataPoint[]; title: string }) {
  return (
    <div className="flex-1 min-w-0">
      <h3 className="text-sm font-semibold text-gray-700 mb-2">{title}</h3>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" paddingAngle={3}>
            {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Pie>
          <Tooltip />
          <Legend iconSize={10} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
