import Link from 'next/link'
import { Pencil, Target } from 'lucide-react'

interface Props {
  userName: string
  goalText: string
}

function getGreeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

export default function GreetingHero({ userName, goalText }: Props) {
  const nameParts = userName.split(' ')
  const givenName = nameParts[nameParts.length - 1] // Vietnamese names: given name is last token
  return (
    <div className="mb-2">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        {getGreeting()}, {givenName} 👋
      </h1>
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 bg-indigo-50 border border-indigo-100 rounded-full px-3 py-1.5">
          <Target className="w-4 h-4 text-indigo-500 shrink-0" />
          <span className="text-sm font-medium text-indigo-700">Goal: {goalText}</span>
        </div>
        <Link
          href="/student"
          className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors"
        >
          <Pencil className="w-3 h-3" />
          Edit goal
        </Link>
      </div>
    </div>
  )
}
