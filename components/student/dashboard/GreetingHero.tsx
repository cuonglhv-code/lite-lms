'use client'

import { useState } from 'react'
import { Pencil, Target } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

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

export default function GreetingHero({ userName, goalText: initialGoalText }: Props) {
  const [goalText, setGoalText] = useState(initialGoalText)
  const [showModal, setShowModal] = useState(false)

  const [targetBand, setTargetBand] = useState('7.0')
  const [targetDate, setTargetDate] = useState('')
  const [outcome, setOutcome] = useState('')

  const nameParts = userName.split(' ')
  const givenName = nameParts[nameParts.length - 1]

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setGoalText(`IELTS Academic Band ${targetBand}+`)
    setShowModal(false)
  }

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
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors"
        >
          <Pencil className="w-3 h-3" />
          Edit goal
        </button>
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <form onSubmit={handleSave} className="space-y-4">
            <DialogHeader>
              <DialogTitle>Edit Learning Goal</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4 pr-1">
              <div className="space-y-2">
                <Label>Target Band</Label>
                <select 
                  value={targetBand} 
                  onChange={e => setTargetBand(e.target.value)} 
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                  {['5.0', '5.5', '6.0', '6.5', '7.0', '7.5', '8.0', '8.5', '9.0'].map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Target Test Date</Label>
                <Input type="date" value={targetDate} onChange={e => setTargetDate(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Desired Outcome</Label>
                <Input value={outcome} onChange={e => setOutcome(e.target.value)} placeholder="e.g. University application" required />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button type="submit">Save Goal</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
