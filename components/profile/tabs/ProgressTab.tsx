// Progress tab: overall band estimate, skill breakdown, enrolled courses

import Link from 'next/link'
import { TrendingUp, BookOpen, PenLine, Headphones, Mic, ArrowRight } from 'lucide-react'
import type { SkillScore, EnrolledCourse } from '@/lib/profile-data'

interface Props {
  skillScores: SkillScore[]
  enrolledCourses: EnrolledCourse[]
  targetBand: string
}

const SKILL_ICONS = {
  Reading:   BookOpen,
  Writing:   PenLine,
  Listening: Headphones,
  Speaking:  Mic,
}

// IELTS band colour helper
function bandColor(score: number): string {
  if (score >= 7.0) return 'text-green-600'
  if (score >= 6.0) return 'text-amber-600'
  return 'text-red-500'
}

function bandBarColor(score: number): string {
  if (score >= 7.0) return 'bg-green-500'
  if (score >= 6.0) return 'bg-amber-400'
  return 'bg-red-400'
}

export default function ProgressTab({ skillScores, enrolledCourses, targetBand }: Props) {
  const avgBand = skillScores.reduce((s, r) => s + r.current, 0) / skillScores.length
  const displayBand = (Math.round(avgBand * 2) / 2).toFixed(1)
  const targetNum = parseFloat(targetBand.replace(/[^0-9.]/g, '')) || 7.0

  // Progress toward target (from 4.0 baseline)
  const BASELINE = 4.0
  const progressToTarget = Math.min(100, Math.max(0,
    ((avgBand - BASELINE) / (targetNum - BASELINE)) * 100
  ))

  return (
    <div className="space-y-5">

      {/* Overall band estimate */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-1">Current Band Estimate</h3>
            <p className="text-xs text-gray-400">Based on practice scores across all 4 skills</p>
          </div>
          <TrendingUp className="w-5 h-5 text-indigo-400" />
        </div>

        <div className="flex items-end gap-4 mb-4">
          <span className={`text-5xl font-bold tabular-nums ${bandColor(avgBand)}`}>
            {displayBand}
          </span>
          <div className="pb-1">
            <p className="text-xs text-gray-400">out of 9.0</p>
            <p className="text-xs text-gray-500 font-medium">Target: {targetBand}</p>
          </div>
        </div>

        <div className="mb-1 flex justify-between text-xs text-gray-400">
          <span>Progress toward {targetBand}</span>
          <span>{Math.round(progressToTarget)}%</span>
        </div>
        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-500 rounded-full transition-all duration-700"
            style={{ width: `${progressToTarget}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>{BASELINE.toFixed(1)}</span>
          <span>{targetNum.toFixed(1)}</span>
        </div>
      </div>

      {/* Skills breakdown */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Skills Breakdown</h3>
        <div className="space-y-4">
          {skillScores.map(({ skill, current, target }) => {
            const Icon = SKILL_ICONS[skill]
            const pct = Math.round((current / 9) * 100)
            const targetPct = Math.round((target / 9) * 100)

            return (
              <div key={skill}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">{skill}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className={`font-bold tabular-nums ${bandColor(current)}`}>{current.toFixed(1)}</span>
                    <span className="text-gray-300">/</span>
                    <span className="text-gray-400">target {target.toFixed(1)}</span>
                  </div>
                </div>
                {/* Bar with target marker */}
                <div className="relative h-2 bg-gray-100 rounded-full overflow-visible">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${bandBarColor(current)}`}
                    style={{ width: `${pct}%` }}
                  />
                  {/* Target marker */}
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-0.5 h-4 bg-gray-400 rounded-full"
                    style={{ left: `${targetPct}%` }}
                    title={`Target: ${target}`}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Enrolled courses */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Enrolled Courses</h3>
        <ul className="space-y-4">
          {enrolledCourses.map(course => (
            <li key={course.id}>
              <div className="flex items-start justify-between gap-3 mb-1.5">
                <p className="text-sm font-medium text-gray-800 leading-snug flex-1">{course.name}</p>
                <Link
                  href={`/student/class/${course.id}`}
                  className="shrink-0 flex items-center gap-0.5 text-xs font-semibold text-indigo-600
                             hover:text-indigo-800 transition-colors whitespace-nowrap"
                >
                  Continue <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full"
                    style={{ width: `${course.percentComplete}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500 shrink-0 w-12 text-right tabular-nums">
                  {course.percentComplete}%
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">Est. completion: {course.eta}</p>
            </li>
          ))}
        </ul>
      </div>

    </div>
  )
}
