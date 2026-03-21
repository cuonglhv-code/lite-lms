// Overview tab: study purposes, desired outcome, bio, external links, education

import { Pencil, Plus, ExternalLink, GraduationCap } from 'lucide-react'
import type { ProfileUser } from '@/lib/profile-data'

interface Props {
  user: ProfileUser
}

export default function OverviewTab({ user }: Props) {
  return (
    <div className="space-y-5">

      {/* Work Preferences */}
      <Card
        title="Work Preferences"
        action={<EditButton label="Edit preferences" />}
      >
        <div className="space-y-4">
          <div>
            <p className="text-xs text-gray-400 font-medium mb-2">Study purpose</p>
            <div className="flex flex-wrap gap-2">
              {user.studyPurposes.map(p => (
                <span key={p} className="text-xs font-medium text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-full px-3 py-1">
                  {p}
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium mb-1">Desired outcome</p>
            <p className="text-sm text-gray-700 leading-relaxed">{user.desiredOutcome}</p>
          </div>
        </div>
      </Card>

      {/* Additional Info */}
      <Card
        title="Additional Info"
        action={<EditButton label="Edit info" />}
      >
        <div className="space-y-4">
          <div>
            <p className="text-xs text-gray-400 font-medium mb-1">Bio</p>
            <p className="text-sm text-gray-700 leading-relaxed">
              {user.bio || <span className="text-gray-400 italic">No bio yet.</span>}
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-gray-400 font-medium">External links</p>
              <button className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-medium transition-colors">
                <Plus className="w-3.5 h-3.5" />
                Add link
              </button>
            </div>
            {user.externalLinks.length > 0
              ? <ul className="space-y-1.5">
                  {user.externalLinks.map(link => (
                    <li key={link.url}>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-800 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              : <p className="text-sm text-gray-400 italic">No links added yet.</p>
            }
          </div>
        </div>
      </Card>

      {/* Education */}
      <Card
        title="Education"
        action={
          <button className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-medium transition-colors">
            <Plus className="w-3.5 h-3.5" />
            Add education
          </button>
        }
      >
        {user.education.length > 0
          ? <ul className="space-y-3">
              {user.education.map((edu, i) => (
                <li key={i} className="flex items-start gap-3 group">
                  <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 mt-0.5">
                    <GraduationCap className="w-4 h-4 text-gray-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900">{edu.institution}</p>
                    <p className="text-xs text-gray-500">{edu.degree} · {edu.year}</p>
                  </div>
                  <button className="p-1 rounded text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-all" aria-label="Edit education">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          : <p className="text-sm text-gray-400 italic">No education entries yet.</p>
        }
      </Card>

    </div>
  )
}

// ── Shared helpers ─────────────────────────────────────────────

function Card({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        {action}
      </div>
      {children}
    </div>
  )
}

function EditButton({ label }: { label: string }) {
  return (
    <button aria-label={label} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
      <Pencil className="w-4 h-4" />
    </button>
  )
}
