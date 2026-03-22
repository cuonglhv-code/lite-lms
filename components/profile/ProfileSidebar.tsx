// Left sidebar: avatar, visibility toggle, personal details card, IELTS goal card

'use client'

import { useState, useRef } from 'react'
import {
  Camera, Share2, Lock, Pencil, Check, X,
  Globe, EyeOff, Target, Calendar,
} from 'lucide-react'
import type { ProfileUser } from '@/lib/profile-data'

interface Props {
  user: ProfileUser
}

const LANGUAGES = ['Vietnamese', 'English', 'Japanese', 'Korean', 'French', 'German']

export default function ProfileSidebar({ user }: Props) {
  const [isPublic, setIsPublic] = useState(user.isPublic)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [toastMsg, setToastMsg] = useState('')

  function showToast(msg: string) {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(''), 3000)
  }

  function handleVisibilityToggle() {
    setIsPublic(v => !v)
    showToast(`Profile is now ${!isPublic ? 'public' : 'private'}`)
  }

  // Copy-to-clipboard toast
  const [copied, setCopied] = useState(false)
  function copyLink() {
    navigator.clipboard.writeText(`https://jaxtina.com/learner/${user.displayName}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Personal details edit mode
  const [editingDetails, setEditingDetails] = useState(false)
  const [details, setDetails] = useState({
    name:        user.name,
    displayName: user.displayName,
    location:    user.location,
    language:    user.language,
    bio:         user.bio,
  })
  const [savedDetails, setSavedDetails] = useState(details)

  function saveDetails() {
    setSavedDetails(details)
    setEditingDetails(false)
    showToast('Personal details updated')
  }
  function cancelDetails() {
    setDetails(savedDetails)
    setEditingDetails(false)
  }

  // IELTS goal edit
  const [editingGoal, setEditingGoal] = useState(false)
  const [goal, setGoal] = useState(user.goal)
  const [savedGoal, setSavedGoal] = useState(goal)

  function saveGoal() {
    setSavedGoal(goal)
    setEditingGoal(false)
    showToast('IELTS goal updated')
  }

  const handleAvatarClick = () => fileInputRef.current?.click()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      showToast('Avatar updated successfully')
    }
  }

  return (
    <aside className="flex flex-col gap-4 relative">
      {toastMsg && (
        <div className="fixed bottom-4 right-4 bg-gray-900 border border-gray-700 shadow-xl px-4 py-3 rounded-lg flex items-center gap-2 z-50 text-white animate-in slide-in-from-bottom-5 text-sm font-medium">
          <Check className="w-5 h-5 text-green-400" />
          {toastMsg}
        </div>
      )}

      {/* ── Avatar card ── */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 flex flex-col items-center gap-3">
        {/* Avatar with photo-change overlay */}
        <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
          <div className="w-24 h-24 rounded-full bg-indigo-600 flex items-center justify-center text-white text-3xl font-bold select-none">
            {user.avatarInitial}
          </div>
          <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center
                          opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="w-6 h-6 text-white" />
          </div>
        </div>

        <div className="text-center">
          <p className="text-base font-semibold text-gray-900">{savedDetails.name}</p>
          <p className="text-xs text-gray-400">@{savedDetails.displayName}</p>
        </div>

        {/* Share profile link */}
        <button
          onClick={copyLink}
          className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800
                     font-medium transition-colors"
        >
          {copied
            ? <><Check className="w-4 h-4 text-green-500" /><span className="text-green-600">Copied!</span></>
            : <><Share2 className="w-4 h-4" /><span>Share profile link</span></>
          }
        </button>

        {/* Visibility toggle */}
        <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2 w-full justify-between">
          <span className="text-sm text-gray-600 font-medium">Profile visibility</span>
          <button
            onClick={handleVisibilityToggle}
            aria-pressed={isPublic}
            aria-label={`Profile is ${isPublic ? 'public' : 'private'}, click to toggle`}
            className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full transition-all
              ${isPublic
                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
          >
            {isPublic
              ? <><Globe className="w-3 h-3" /> Public</>
              : <><EyeOff className="w-3 h-3" /> Private</>
            }
          </button>
        </div>
      </div>

      {/* ── Personal Details card ── */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-900">Personal Details</h2>
          {!editingDetails
            ? <button
                onClick={() => setEditingDetails(true)}
                aria-label="Edit personal details"
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <Pencil className="w-4 h-4" />
              </button>
            : <div className="flex gap-1">
                <button onClick={saveDetails}   aria-label="Save" className="p-1.5 rounded-lg text-green-600 hover:bg-green-50 transition-colors"><Check className="w-4 h-4" /></button>
                <button onClick={cancelDetails} aria-label="Cancel" className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"><X className="w-4 h-4" /></button>
              </div>
          }
        </div>

        <div className="space-y-3">
          {/* Full name */}
          <Field label="Full name" editing={editingDetails}>
            {editingDetails
              ? <input value={details.name} onChange={e => setDetails(d => ({ ...d, name: e.target.value }))}
                  className={inputCls} />
              : <span className={valueCls}>{savedDetails.name}</span>
            }
          </Field>

          {/* Display name */}
          <Field label="Display name" editing={editingDetails}>
            {editingDetails
              ? <div className="flex items-center gap-1">
                  <span className="text-gray-400 text-sm">@</span>
                  <input value={details.displayName} onChange={e => setDetails(d => ({ ...d, displayName: e.target.value }))}
                    className={inputCls} />
                </div>
              : <span className={valueCls}>@{savedDetails.displayName}</span>
            }
          </Field>

          {/* Email — always read-only */}
          <Field label="Email">
            <div className="flex items-center gap-1.5">
              <span className={valueCls}>{user.email}</span>
              <Lock className="w-3 h-3 text-gray-300 shrink-0" aria-label="Email cannot be changed" />
            </div>
          </Field>

          {/* Location */}
          <Field label="Location" editing={editingDetails}>
            {editingDetails
              ? <input value={details.location} onChange={e => setDetails(d => ({ ...d, location: e.target.value }))}
                  placeholder="City, Country" className={inputCls} />
              : <span className={valueCls}>{savedDetails.location || '—'}</span>
            }
          </Field>

          {/* Language */}
          <Field label="Language" editing={editingDetails}>
            {editingDetails
              ? <select value={details.language} onChange={e => setDetails(d => ({ ...d, language: e.target.value }))}
                  className={inputCls}>
                  {LANGUAGES.map(l => <option key={l}>{l}</option>)}
                </select>
              : <span className={valueCls}>{savedDetails.language}</span>
            }
          </Field>

          {/* Bio */}
          <div>
            <label className="text-xs text-gray-400 font-medium block mb-1">Bio</label>
            {editingDetails
              ? <>
                  <textarea
                    value={details.bio}
                    onChange={e => setDetails(d => ({ ...d, bio: e.target.value.slice(0, 200) }))}
                    rows={3}
                    maxLength={200}
                    aria-label="Bio"
                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 resize-none
                               focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <p className={`text-xs text-right mt-0.5 ${details.bio.length >= 180 ? 'text-amber-500' : 'text-gray-400'}`}>
                    {details.bio.length}/200
                  </p>
                </>
              : <p className="text-sm text-gray-700 leading-relaxed">{savedDetails.bio || '—'}</p>
            }
          </div>
        </div>
      </div>

      {/* ── IELTS Goal card ── */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-900">IELTS Goal</h2>
          {!editingGoal
            ? <button onClick={() => setEditingGoal(true)} aria-label="Edit IELTS goal"
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
                <Pencil className="w-4 h-4" />
              </button>
            : <div className="flex gap-1">
                <button onClick={saveGoal}            aria-label="Save" className="p-1.5 rounded-lg text-green-600 hover:bg-green-50 transition-colors"><Check className="w-4 h-4" /></button>
                <button onClick={() => { setGoal(savedGoal); setEditingGoal(false) }} aria-label="Cancel" className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"><X className="w-4 h-4" /></button>
              </div>
          }
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
              <Target className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-400">Target band</p>
              {editingGoal
                ? <input value={goal.targetBand} onChange={e => setGoal(g => ({ ...g, targetBand: e.target.value }))}
                    className={inputCls} />
                : <p className="text-sm font-semibold text-gray-900">{savedGoal.targetBand}</p>
              }
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
              <Calendar className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-400">Target test date</p>
              {editingGoal
                ? <input type="date" value={goal.targetDate} onChange={e => setGoal(g => ({ ...g, targetDate: e.target.value }))}
                    className={inputCls} />
                : <p className="text-sm font-semibold text-gray-900">
                    {new Date(savedGoal.targetDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
              }
            </div>
          </div>
        </div>
      </div>

    </aside>
  )
}

// ── Helpers ────────────────────────────────────────────────────

function Field({
  label, children,
}: {
  label: string
  children: React.ReactNode
  editing?: boolean
}) {
  return (
    <div>
      <label className="text-xs text-gray-400 font-medium block mb-0.5">{label}</label>
      {children}
    </div>
  )
}

const inputCls =
  'w-full text-sm text-gray-900 border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white'

const valueCls = 'text-sm text-gray-700'
