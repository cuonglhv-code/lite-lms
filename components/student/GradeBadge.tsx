interface Props {
  grade: number | null
  maxPoints: number
}

export default function GradeBadge({ grade, maxPoints }: Props) {
  if (grade === null) return null

  const pct = maxPoints > 0 ? (grade / maxPoints) * 100 : 0
  const color =
    pct >= 75 ? 'bg-green-100 text-green-700' :
    pct >= 50 ? 'bg-amber-100 text-amber-700' :
    'bg-red-100 text-red-700'

  return (
    <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full ${color}`}>
      {grade} / {maxPoints}
    </span>
  )
}
