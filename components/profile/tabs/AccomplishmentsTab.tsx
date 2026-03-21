// Accomplishments tab: stats row, certificates, earned/locked badges

import { Award, Download, BookCheck, Clock, Flame, Zap } from 'lucide-react'
import type { Certificate, Badge } from '@/lib/profile-data'

interface Props {
  certificates: Certificate[]
  badges: Badge[]
  stats: {
    coursesCompleted: number
    totalHours: number
    currentStreak: number
    bestStreak: number
  }
}

export default function AccomplishmentsTab({ certificates, badges, stats }: Props) {
  const earned = badges.filter(b => b.earned)
  const locked = badges.filter(b => !b.earned)

  return (
    <div className="space-y-5">

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard icon={<BookCheck className="w-5 h-5 text-indigo-500" />} value={stats.coursesCompleted} label="Courses completed" />
        <StatCard icon={<Clock       className="w-5 h-5 text-blue-500"  />} value={`${stats.totalHours}h`}  label="Total study hours" />
        <StatCard icon={<Flame       className="w-5 h-5 text-orange-500"/>} value={`${stats.currentStreak}d`} label="Current streak" />
        <StatCard icon={<Zap         className="w-5 h-5 text-amber-500" />} value={`${stats.bestStreak}d`}   label="Best streak" />
      </div>

      {/* Certificates */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">
          Certificates
          <span className="ml-2 text-xs font-normal text-gray-400">({certificates.length})</span>
        </h3>

        {certificates.length === 0
          ? <p className="text-sm text-gray-400 italic">No certificates yet. Complete a course to earn one.</p>
          : <ul className="space-y-3">
              {certificates.map(cert => (
                <li key={cert.id} className="flex items-center gap-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-4 border border-indigo-100">
                  <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center shrink-0">
                    <Award className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{cert.courseName}</p>
                    <p className="text-xs text-gray-500">Issued {cert.issueDate}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={cert.downloadUrl}
                      className="text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                    >
                      View
                    </a>
                    <a
                      href={cert.downloadUrl}
                      download
                      aria-label="Download certificate"
                      className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-white transition-colors"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                  </div>
                </li>
              ))}
            </ul>
        }
      </div>

      {/* Badges */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">
          Badges
          <span className="ml-2 text-xs font-normal text-gray-400">({earned.length} earned)</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {/* Earned badges */}
          {earned.map(badge => (
            <div
              key={badge.id}
              title={`${badge.name}: ${badge.description}`}
              className="flex flex-col items-center gap-2 p-4 bg-gradient-to-b from-indigo-50 to-white rounded-2xl border border-indigo-100"
            >
              <span className="text-3xl leading-none" role="img" aria-label={badge.name}>{badge.icon}</span>
              <p className="text-xs font-semibold text-gray-800 text-center">{badge.name}</p>
              {badge.earnedDate && (
                <p className="text-[10px] text-gray-400">{badge.earnedDate}</p>
              )}
            </div>
          ))}

          {/* Locked badges */}
          {locked.map(badge => (
            <div
              key={badge.id}
              title={badge.description}
              className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-2xl border border-gray-100 opacity-50 cursor-not-allowed"
            >
              <span className="text-3xl leading-none grayscale" role="img" aria-label={`Locked: ${badge.name}`}>{badge.icon}</span>
              <p className="text-xs font-semibold text-gray-500 text-center">{badge.name}</p>
              <p className="text-[10px] text-gray-400 text-center leading-tight">{badge.description}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

function StatCard({ icon, value, label }: { icon: React.ReactNode; value: string | number; label: string }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 flex flex-col items-center gap-1.5 text-center">
      {icon}
      <p className="text-2xl font-bold text-gray-900 tabular-nums">{value}</p>
      <p className="text-xs text-gray-400 leading-tight">{label}</p>
    </div>
  )
}
