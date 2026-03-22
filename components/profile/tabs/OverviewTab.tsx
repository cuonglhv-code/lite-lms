'use client'

import { useState } from 'react'
import { Pencil, Plus, ExternalLink, GraduationCap, X, Check } from 'lucide-react'
import type { ProfileUser } from '@/lib/profile-data'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

interface Props {
  user: ProfileUser
}

const ALL_STUDY_PURPOSES = ["University Application", "Career Advancement", "Immigration", "Personal Development", "Work Promotion"]

export default function OverviewTab({ user: initialUser }: Props) {
  const [user, setUser] = useState(initialUser)
  const [toastMsg, setToastMsg] = useState('')

  const showToast = (msg: string) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(''), 3000)
  }

  // Work Preferences State
  const [editWork, setEditWork] = useState(false)
  const [workForm, setWorkForm] = useState({ purposes: user.studyPurposes, outcome: user.desiredOutcome })

  // Additional Info State
  const [editInfo, setEditInfo] = useState(false)
  const [infoForm, setInfoForm] = useState({ bio: user.bio })

  // Add Link State
  const [showAddLink, setShowAddLink] = useState(false)
  const [linkForm, setLinkForm] = useState({ label: '', url: '' })

  // Add Education State
  const [showAddEdu, setShowAddEdu] = useState(false)
  const [eduForm, setEduForm] = useState({ institution: '', degree: '', year: new Date().getFullYear() })

  const handleSaveWork = () => {
    setUser(prev => ({ ...prev, studyPurposes: workForm.purposes, desiredOutcome: workForm.outcome }))
    setEditWork(false)
    showToast('Work preferences updated')
  }

  const handleSaveInfo = () => {
    setUser(prev => ({ ...prev, bio: infoForm.bio }))
    setEditInfo(false)
    showToast('Profile updated')
  }

  const handleSaveLink = () => {
    if (!linkForm.label || !linkForm.url) return
    setUser(prev => ({ ...prev, externalLinks: [...prev.externalLinks, linkForm] }))
    setLinkForm({ label: '', url: '' })
    setShowAddLink(false)
    showToast('Link added')
  }

  const handleSaveEdu = () => {
    if (!eduForm.institution || !eduForm.degree) return
    setUser(prev => ({ ...prev, education: [...prev.education, eduForm] }))
    setEduForm({ institution: '', degree: '', year: new Date().getFullYear() })
    setShowAddEdu(false)
    showToast('Education added')
  }

  const togglePurpose = (p: string) => {
    setWorkForm(prev => ({
      ...prev,
      purposes: prev.purposes.includes(p) ? prev.purposes.filter(x => x !== p) : [...prev.purposes, p]
    }))
  }

  return (
    <div className="space-y-5 relative">
      {/* Fake Toast */}
      {toastMsg && (
        <div className="fixed bottom-4 right-4 bg-gray-900 border border-gray-700 shadow-xl px-4 py-3 rounded-lg flex items-center gap-2 z-50 text-white animate-in slide-in-from-bottom-5 text-sm font-medium">
          <Check className="w-5 h-5 text-green-400" />
          {toastMsg}
        </div>
      )}

      {/* Work Preferences */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-900">Work Preferences</h3>
          {!editWork && (
            <button onClick={() => setEditWork(true)} aria-label="Edit preferences" className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
              <Pencil className="w-4 h-4" />
            </button>
          )}
        </div>
        
        {editWork ? (
          <div className="space-y-4">
            <div>
              <Label className="mb-2 block">Study Purpose (Multiselect)</Label>
              <div className="flex flex-wrap gap-2">
                {ALL_STUDY_PURPOSES.map(p => (
                  <button 
                    key={p} 
                    onClick={() => togglePurpose(p)}
                    className={`text-xs font-medium border rounded-full px-3 py-1 transition-colors ${workForm.purposes.includes(p) ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-indigo-300'}`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label className="mb-2 block">Desired outcome</Label>
              <Textarea 
                value={workForm.outcome}
                onChange={e => setWorkForm(prev => ({ ...prev, outcome: e.target.value }))}
                className="w-full text-sm resize-none h-24" 
              />
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={handleSaveWork}>Save</Button>
              <Button size="sm" variant="outline" onClick={() => setEditWork(false)}>Cancel</Button>
            </div>
          </div>
        ) : (
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
        )}
      </div>

      {/* Additional Info */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-900">Additional Info</h3>
          {!editInfo && (
            <button onClick={() => setEditInfo(true)} aria-label="Edit info" className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
              <Pencil className="w-4 h-4" />
            </button>
          )}
        </div>
        
        {editInfo ? (
          <div className="space-y-4 mb-6 pb-6 border-b border-gray-100">
            <div>
              <Label className="mb-2 block flex justify-between">
                <span>Bio</span>
                <span className="text-xs font-normal text-gray-400">{infoForm.bio.length}/200</span>
              </Label>
              <Textarea 
                value={infoForm.bio}
                maxLength={200}
                onChange={e => setInfoForm({ bio: e.target.value })}
                className="w-full text-sm resize-none h-24" 
              />
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={handleSaveInfo}>Save</Button>
              <Button size="sm" variant="outline" onClick={() => setEditInfo(false)}>Cancel</Button>
            </div>
          </div>
        ) : (
          <div className="mb-6 pb-6 border-b border-gray-100">
            <p className="text-xs text-gray-400 font-medium mb-1">Bio</p>
            <p className="text-sm text-gray-700 leading-relaxed">
              {user.bio || <span className="text-gray-400 italic">No bio yet.</span>}
            </p>
          </div>
        )}

        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-gray-400 font-medium">External links</p>
            {!showAddLink && (
              <button onClick={() => setShowAddLink(true)} className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-medium transition-colors">
                <Plus className="w-3.5 h-3.5" />
                Add link
              </button>
            )}
          </div>
          
          {showAddLink && (
            <div className="mb-4 space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
              <div className="grid grid-cols-2 gap-3">
                <Input placeholder="Label (e.g. LinkedIn)" value={linkForm.label} onChange={e => setLinkForm(p => ({ ...p, label: e.target.value }))} className="text-sm" />
                <Input placeholder="URL" value={linkForm.url} onChange={e => setLinkForm(p => ({ ...p, url: e.target.value }))} className="text-sm" />
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={handleSaveLink}>Save Link</Button>
                <Button size="sm" variant="outline" onClick={() => setShowAddLink(false)}>Cancel</Button>
              </div>
            </div>
          )}

          {user.externalLinks.length > 0
            ? <ul className="space-y-1.5">
                {user.externalLinks.map(link => (
                  <li key={link.url}>
                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-800 transition-colors">
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

      {/* Education */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-900">Education</h3>
          {!showAddEdu && (
            <button onClick={() => setShowAddEdu(true)} className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-medium transition-colors">
              <Plus className="w-3.5 h-3.5" />
              Add education
            </button>
          )}
        </div>

        {showAddEdu && (
          <div className="mb-4 space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
            <div className="space-y-2">
              <Input placeholder="Institution Name" value={eduForm.institution} onChange={e => setEduForm(p => ({ ...p, institution: e.target.value }))} className="text-sm" />
              <div className="grid grid-cols-2 gap-3">
                <Input placeholder="Degree/Qualification" value={eduForm.degree} onChange={e => setEduForm(p => ({ ...p, degree: e.target.value }))} className="text-sm" />
                <Input type="number" placeholder="Year" value={eduForm.year} onChange={e => setEduForm(p => ({ ...p, year: parseInt(e.target.value) || new Date().getFullYear() }))} className="text-sm" />
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={handleSaveEdu}>Save Education</Button>
              <Button size="sm" variant="outline" onClick={() => setShowAddEdu(false)}>Cancel</Button>
            </div>
          </div>
        )}

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
                </li>
              ))}
            </ul>
          : <p className="text-sm text-gray-400 italic">No education entries yet.</p>
        }
      </div>

    </div>
  )
}
