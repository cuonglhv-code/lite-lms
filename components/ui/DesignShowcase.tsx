// ─────────────────────────────────────────────────────────────
// DesignShowcase — "kitchen sink" page showing every Coursera-
// inspired component. Visit /design to preview.
// ─────────────────────────────────────────────────────────────

'use client'

import { useState } from 'react'
import {
  Search, Bell, ChevronDown, BookOpen, Play, CheckCircle,
  AlertTriangle, Star, Settings, LogOut, CreditCard,
  BarChart2, Users, Calendar, Zap,
} from 'lucide-react'

// ── Section wrapper ─────────────────────────────────────────
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold" style={{ color: 'var(--text-heading)' }}>{title}</h2>
      <hr className="divider" />
      {children}
    </section>
  )
}

// ── Colour swatch ────────────────────────────────────────────
function Swatch({ hex, label, textDark = false }: { hex: string; label: string; textDark?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        className="w-14 h-14 rounded-lg border border-black/10 shadow-sm"
        style={{ backgroundColor: hex }}
      />
      <span className="text-xs font-mono text-center leading-tight" style={{ color: 'var(--text-secondary)' }}>
        {hex}<br />
        <span style={{ color: 'var(--text-muted)' }}>{label}</span>
      </span>
    </div>
  )
}

// ── Type specimen ────────────────────────────────────────────
function TypeRow({ size, label, weight = '400', sample }: { size: string; label: string; weight?: string; sample: string }) {
  return (
    <div className="flex items-baseline gap-6 py-2 border-b border-neutral-100">
      <span className="w-24 text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{label}</span>
      <span style={{ fontSize: size, fontWeight: weight, color: 'var(--text-heading)', lineHeight: 1.3 }}>
        {sample}
      </span>
    </div>
  )
}

// ── Avatar ───────────────────────────────────────────────────
function Avatar({ initials, size }: { initials: string; size: 'sm' | 'md' | 'lg' }) {
  return <div className={`avatar-${size}`}>{initials}</div>
}

// ── Progress bar ─────────────────────────────────────────────
function ProgressBar({ value, thin = true, green = false }: { value: number; thin?: boolean; green?: boolean }) {
  return (
    <div className={thin ? 'progress-track-thin' : 'progress-track-medium'} style={{ width: '100%' }}>
      <div className={green ? 'progress-fill-green' : 'progress-fill'} style={{ width: `${value}%` }} />
    </div>
  )
}

// ── Main showcase ─────────────────────────────────────────────
export default function DesignShowcase() {
  const [activeTab, setActiveTab] = useState(0)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const tabs = ['Overview', 'My Learning', 'Assessments', 'Progress', 'Settings']

  return (
    <div style={{ backgroundColor: 'var(--page-bg)', minHeight: '100vh', fontFamily: "'Source Sans Pro', sans-serif" }}>

      {/* ── HEADER ───────────────────────────────────────── */}
      <header className="bg-white sticky top-0 z-40" style={{ borderBottom: '1px solid var(--border-color)', boxShadow: 'var(--shadow-header)', height: 'var(--header-height)' }}>
        <div className="page-container h-full flex items-center justify-between gap-6">
          {/* Logo */}
          <span className="text-xl font-bold shrink-0" style={{ color: 'var(--text-heading)' }}>
            Jaxtina<span style={{ color: 'var(--brand)' }}>LMS</span>
          </span>

          {/* Search */}
          <div className="search-bar max-w-sm w-full hidden md:flex">
            <Search size={16} style={{ color: 'var(--text-muted)' }} className="shrink-0" />
            <input
              type="text"
              placeholder="Search courses, lessons…"
              className="bg-transparent border-none outline-none w-full text-sm"
              style={{ color: 'var(--text-body)' }}
            />
          </div>

          {/* Nav */}
          <div className="flex items-center gap-1">
            <button className="nav-link hidden md:block">Courses</button>
            <button className="nav-link hidden md:block">Progress</button>
            <button className="nav-link hidden md:block">Schedule</button>

            <button className="nav-link relative">
              <Bell size={18} />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--danger)' }} />
            </button>

            {/* Avatar + dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(d => !d)}
                className="flex items-center gap-2 rounded-sm px-2 py-1.5 transition-std"
                style={{ borderRadius: 'var(--input-radius)' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--surface-hover)')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <div className="avatar-sm">CL</div>
                <ChevronDown size={14} style={{ color: 'var(--text-secondary)' }} />
              </button>

              {dropdownOpen && (
                <div className="dropdown-menu right-0 mt-1">
                  {/* Header */}
                  <div className="p-4" style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="avatar-md">CL</div>
                      <div>
                        <p className="font-bold text-sm" style={{ color: 'var(--text-heading)' }}>Cuong Le</p>
                        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>cuong@jaxtina.edu.vn</p>
                      </div>
                    </div>
                    <span className="badge-blue">Target: IELTS 7.0</span>
                  </div>

                  {/* Items */}
                  {[
                    { icon: <Users size={16} />, label: 'My Profile' },
                    { icon: <BookOpen size={16} />, label: 'My Learning' },
                    { icon: <BarChart2 size={16} />, label: 'Progress' },
                    { icon: <Settings size={16} />, label: 'Settings' },
                  ].map(item => (
                    <button key={item.label} className="flex items-center gap-3 w-full text-left transition-std"
                      style={{ padding: '10px 16px', fontSize: '0.875rem', color: 'var(--text-body)' }}
                      onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--surface-hover)')}
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}>
                      <span style={{ color: 'var(--text-secondary)' }}>{item.icon}</span>
                      {item.label}
                    </button>
                  ))}

                  <hr className="divider mx-0 my-1" />

                  <button className="btn-danger flex items-center gap-3 w-full text-left"
                    style={{ padding: '10px 16px', borderRadius: 0 }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--danger-light)')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}>
                    <LogOut size={16} />Sign out
                  </button>

                  {/* Upgrade strip */}
                  <div className="upgrade-strip flex items-center justify-between" style={{ borderRadius: '0 0 12px 12px' }}>
                    <div className="flex items-center gap-2">
                      <Zap size={14} style={{ color: 'var(--premium)' }} />
                      <span>Upgrade to Jaxtina Plus</span>
                    </div>
                    <span style={{ color: 'var(--brand)', fontSize: '0.75rem' }}>→</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ── PAGE CONTENT ─────────────────────────────────── */}
      <div className="page-container py-8 space-y-12">

        {/* Hero greeting */}
        <div className="space-y-1">
          <p className="meta-text">Saturday, 21 March 2026</p>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--text-heading)' }}>Good morning, Cuong 👋</h1>
          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>You have 2 tasks due today and your exam is in 30 days.</p>
        </div>

        {/* ── 1. COLOUR PALETTE ─────────────────────────── */}
        <Section title="1 · Colour Palette">
          <div className="space-y-6">
            <div>
              <p className="meta-text mb-3 font-semibold">Brand Blues</p>
              <div className="flex flex-wrap gap-5">
                <Swatch hex="#0056D2" label="brand" />
                <Swatch hex="#0040A8" label="brand-hover" />
                <Swatch hex="#E8F1FB" label="brand-light" textDark />
                <Swatch hex="#F5F9FF" label="brand-subtle" textDark />
              </div>
            </div>
            <div>
              <p className="meta-text mb-3 font-semibold">Neutral Greys</p>
              <div className="flex flex-wrap gap-5">
                {[
                  ['#F9FAFB','50·page-bg'], ['#F3F4F6','100·hover'],
                  ['#E5E7EB','200·border'], ['#D1D5DB','300·input-border'],
                  ['#9CA3AF','400·placeholder'], ['#6B7280','500·secondary'],
                  ['#374151','600·body'], ['#1F2937','700·heading'],
                  ['#111827','800·darkest'],
                ].map(([hex, label]) => <Swatch key={hex} hex={hex} label={label} textDark={['#F9FAFB','#F3F4F6','#E5E7EB','#D1D5DB'].includes(hex)} />)}
              </div>
            </div>
            <div>
              <p className="meta-text mb-3 font-semibold">Semantic</p>
              <div className="flex flex-wrap gap-5">
                <Swatch hex="#1DB954" label="success" />
                <Swatch hex="#D1FAE5" label="success-light" textDark />
                <Swatch hex="#FBBF24" label="warning" />
                <Swatch hex="#FFFBEB" label="warning-light" textDark />
                <Swatch hex="#EF4444" label="danger" />
                <Swatch hex="#FEF2F2" label="danger-light" textDark />
                <Swatch hex="#7C3AED" label="premium" />
                <Swatch hex="#F3E8FF" label="premium-light" textDark />
              </div>
            </div>
          </div>
        </Section>

        {/* ── 2. TYPOGRAPHY ─────────────────────────────── */}
        <Section title="2 · Typography Scale">
          <div className="card space-y-0">
            <TypeRow size="2.25rem" label="36px / 4xl" weight="700" sample="Band Score 7.0" />
            <TypeRow size="1.875rem" label="30px / 3xl" weight="700" sample="Good morning, Cuong" />
            <TypeRow size="1.5rem"   label="24px / 2xl" weight="700" sample="IELTS Writing — Band 6" />
            <TypeRow size="1.25rem"  label="20px / xl"  weight="700" sample="Today's Learning Goals" />
            <TypeRow size="1.125rem" label="18px / lg"  weight="600" sample="Your Progress This Week" />
            <TypeRow size="1rem"     label="16px / md"  weight="700" sample="Task 2 — Problem-Solution Essay" />
            <TypeRow size="0.875rem" label="14px / base" weight="400" sample="Navigate to any lesson and track your daily streak here." />
            <TypeRow size="0.8125rem" label="13px / sm" weight="400" sample="Course · 11% complete · Est. completion: Nov 1" />
            <TypeRow size="0.75rem"  label="12px / xs"  weight="300" sample="Updated 2 days ago · 45 min remaining" />
            <TypeRow size="0.6875rem" label="11px / 2xs" weight="600" sample="IELTS FOUNDATION · TARGET 6.0" />
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <span style={{ fontWeight: 300, color: 'var(--text-secondary)' }}>Light 300</span>
            <span style={{ fontWeight: 400, color: 'var(--text-body)' }}>Regular 400</span>
            <span style={{ fontWeight: 600, color: 'var(--text-heading)' }}>Semibold 600</span>
            <span style={{ fontWeight: 700, color: 'var(--text-heading)' }}>Bold 700</span>
          </div>
        </Section>

        {/* ── 3. BUTTONS ────────────────────────────────── */}
        <Section title="3 · Buttons">
          <div className="card flex flex-wrap gap-4 items-center">
            <button className="btn-primary">Resume Course</button>
            <button className="btn-secondary">View Details</button>
            <button className="btn-ghost">Skip for now</button>
            <button className="btn-danger flex items-center gap-2"><LogOut size={14} /> Sign out</button>
            <button className="btn-primary" disabled style={{ opacity: 0.4, cursor: 'not-allowed' }}>Disabled</button>
          </div>
          <div className="card flex flex-wrap gap-4 items-center">
            <button className="btn-primary flex items-center gap-2"><Play size={14} /> Start Lesson</button>
            <button className="btn-primary flex items-center gap-2"><CheckCircle size={14} /> Mark Complete</button>
            <button className="btn-secondary flex items-center gap-2"><Star size={14} /> Save Course</button>
          </div>
        </Section>

        {/* ── 4. BADGES ─────────────────────────────────── */}
        <Section title="4 · Badges & Chips">
          <div className="card flex flex-wrap gap-3 items-center">
            <span className="badge-blue">IELTS Foundation</span>
            <span className="badge-green">Completed</span>
            <span className="badge-grey">In Progress</span>
            <span className="badge-purple">Plus Feature</span>
            <span className="badge-amber">Due Today</span>
            <span className="badge-red">Overdue</span>
          </div>
          <div className="card flex flex-wrap gap-3 items-center">
            <span className="chip">Quiz</span>
            <span className="chip">Video</span>
            <span className="chip">Reading</span>
            <span className="chip">Essay</span>
            <span className="chip">Mock Test</span>
          </div>
        </Section>

        {/* ── 5. PROGRESS BARS ──────────────────────────── */}
        <Section title="5 · Progress Bars">
          <div className="card space-y-5">
            {[
              { label: 'Writing · 72% complete', value: 72, thin: true },
              { label: 'Reading · 45% complete', value: 45, thin: true },
              { label: 'Listening · 91% complete', value: 91, thin: false },
              { label: 'Speaking · 18% complete', value: 18, thin: false },
            ].map(bar => (
              <div key={bar.label} className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="meta-text">{bar.label}</span>
                  <span className="meta-text font-semibold">{bar.value}%</span>
                </div>
                <ProgressBar value={bar.value} thin={bar.thin} />
              </div>
            ))}
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="meta-text">Overall Progress · 100%</span>
                <span className="meta-text font-semibold" style={{ color: 'var(--success-dark)' }}>✓ Complete</span>
              </div>
              <ProgressBar value={100} thin={false} green />
            </div>
          </div>
        </Section>

        {/* ── 6. COURSE CARD ────────────────────────────── */}
        <Section title="6 · Course Card">
          <div className="card space-y-4">
            {/* Provider + title */}
            <div>
              <p className="meta-text font-semibold mb-1">Jaxtina IELTS Centre</p>
              <h3 className="card-title">IELTS Writing — Task 2 Mastery Course</h3>
            </div>

            {/* Meta row */}
            <div className="flex items-center gap-0 flex-wrap meta-text">
              <span>Course</span>
              <span className="dot-sep">72% complete</span>
              <span className="dot-sep">Est. completion: Apr 20</span>
              <span className="dot-sep">12 lessons left</span>
            </div>

            {/* Progress */}
            <ProgressBar value={72} thin />

            {/* Next activity row */}
            <div className="activity-row flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Play size={16} style={{ color: 'var(--brand)' }} className="shrink-0" />
                <div>
                  <p className="text-sm font-semibold" style={{ color: 'var(--text-body)' }}>Problem-Solution Essay Workshop</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="chip">Video</span>
                    <span className="timestamp">24 min</span>
                  </div>
                </div>
              </div>
              <button className="btn-primary shrink-0" style={{ padding: '6px 16px', fontSize: '0.8125rem' }}>Resume</button>
            </div>

            {/* Skill tags */}
            <div className="flex flex-wrap gap-2">
              {['Coherence', 'Task Achievement', 'Lexical Resource', 'Grammatical Range'].map(tag => (
                <span key={tag} className="badge-blue" style={{ fontSize: '0.75rem' }}>{tag}</span>
              ))}
            </div>
          </div>
        </Section>

        {/* ── 7. INPUT FIELDS ───────────────────────────── */}
        <Section title="7 · Input Fields">
          <div className="card grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="input-label">Full name</label>
              <input className="input-field" type="text" placeholder="e.g. Nguyen Van A" />
            </div>
            <div>
              <label className="input-label">Email address</label>
              <input className="input-field" type="email" placeholder="you@example.com" />
            </div>
            <div>
              <label className="input-label">Target IELTS band</label>
              <select className="input-field">
                <option>5.0</option><option selected>6.0</option>
                <option>6.5</option><option>7.0</option><option>7.5</option>
              </select>
            </div>
            <div>
              <label className="input-label">Search courses</label>
              <div className="search-bar">
                <Search size={16} style={{ color: 'var(--text-muted)' }} className="shrink-0" />
                <input type="text" placeholder="IELTS Writing, Speaking…" className="bg-transparent border-none outline-none w-full text-sm" />
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="input-label">Essay response</label>
              <textarea className="input-field" rows={3} placeholder="Write your Task 2 essay here…" />
            </div>
          </div>
        </Section>

        {/* ── 8. TABS ───────────────────────────────────── */}
        <Section title="8 · Tab Bar">
          <div>
            <div className="tab-bar">
              {tabs.map((tab, i) => (
                <button
                  key={tab}
                  className={i === activeTab ? 'tab-active' : 'tab-inactive'}
                  onClick={() => setActiveTab(i)}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="card mt-0" style={{ borderTop: 'none', borderRadius: '0 0 8px 8px' }}>
              <p className="meta-text">Tab content for <strong className="font-semibold">{tabs[activeTab]}</strong> goes here.</p>
            </div>
          </div>
        </Section>

        {/* ── 9. WARNING BANNER ─────────────────────────── */}
        <Section title="9 · Warning Banner">
          <div className="warning-banner">
            <AlertTriangle size={18} className="shrink-0 mt-0.5" style={{ color: 'var(--warning)' }} />
            <p>
              Your profile is incomplete.{' '}
              <a href="#" style={{ color: 'var(--brand)', fontWeight: 600 }}>Add your exam date</a>{' '}
              so we can build a personalised study plan for you.
            </p>
          </div>
        </Section>

        {/* ── 10. AVATARS ───────────────────────────────── */}
        <Section title="10 · Avatars">
          <div className="card flex items-end gap-6">
            <div className="flex flex-col items-center gap-2">
              <Avatar initials="CL" size="sm" />
              <span className="timestamp">Small 32px</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Avatar initials="CL" size="md" />
              <span className="timestamp">Medium 40px</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Avatar initials="CL" size="lg" />
              <span className="timestamp">Large 80px</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="avatar-lg" style={{ backgroundColor: 'var(--success)' }}>NV</div>
              <span className="timestamp">Green variant</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="avatar-lg" style={{ backgroundColor: 'var(--premium)' }}>TT</div>
              <span className="timestamp">Purple variant</span>
            </div>
          </div>
        </Section>

        {/* ── 11. CALENDAR HEATMAP ──────────────────────── */}
        <Section title="11 · Calendar / Heatmap">
          <div className="card">
            <p className="text-xl font-bold mb-4" style={{ color: 'var(--text-heading)' }}>March 2026</p>
            {/* Day labels */}
            <div className="grid grid-cols-7 gap-1 mb-1">
              {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map(d => (
                <div key={d} className="text-center" style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>{d}</div>
              ))}
            </div>
            {/* Cells — 4 weeks */}
            <div className="grid grid-cols-7 gap-1">
              {[
                'empty','empty','empty','empty','empty','some','empty',
                'full','some','full','some','some','full','empty',
                'some','empty','full','full','some','empty','some',
                'today','some','empty','some','full','full','some',
              ].map((type, i) => (
                <div
                  key={i}
                  className={
                    type === 'full'  ? 'cal-cell-full'  :
                    type === 'some'  ? 'cal-cell-some'  :
                    type === 'today' ? 'cal-cell-today' : 'cal-cell'
                  }
                  title={`Day ${i + 1}`}
                />
              ))}
            </div>
            <div className="flex items-center gap-3 mt-4">
              <div className="flex items-center gap-1.5">
                <div className="cal-cell" style={{ width: 14, height: 14 }} />
                <span className="timestamp">No study</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="cal-cell-some" style={{ width: 14, height: 14 }} />
                <span className="timestamp">Partial</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="cal-cell-full" style={{ width: 14, height: 14 }} />
                <span className="timestamp">Full session</span>
              </div>
            </div>
          </div>
        </Section>

        {/* ── 12. KPI CARDS ─────────────────────────────── */}
        <Section title="12 · KPI Cards">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Current Band', value: '5.5',  sub: 'Target 7.0', color: 'var(--brand)' },
              { label: 'Study Streak', value: '14d',  sub: 'Personal best!', color: 'var(--success)' },
              { label: 'Days to Exam', value: '30',   sub: 'Apr 20, 2026', color: 'var(--warning)' },
              { label: 'HW Complete',  value: '72%',  sub: '9 of 12 tasks', color: 'var(--premium)' },
            ].map(kpi => (
              <div key={kpi.label} className="card text-center">
                <p className="meta-text mb-1">{kpi.label}</p>
                <p className="text-3xl font-bold" style={{ color: kpi.color }}>{kpi.value}</p>
                <p className="timestamp mt-0.5">{kpi.sub}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* ── 13. DROPDOWN PREVIEW ──────────────────────── */}
        <Section title="13 · Dropdown Menu (static preview)">
          <div className="flex justify-start">
            <div className="dropdown-menu relative" style={{ position: 'relative' }}>
              <div className="p-4" style={{ borderBottom: '1px solid var(--border-color)' }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="avatar-md">CL</div>
                  <div>
                    <p className="font-bold text-sm" style={{ color: 'var(--text-heading)' }}>Cuong Le</p>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>cuong@jaxtina.edu.vn</p>
                  </div>
                </div>
                <span className="badge-blue">Target: IELTS 7.0</span>
              </div>
              {[
                { icon: <Users size={16} />, label: 'My Profile' },
                { icon: <BookOpen size={16} />, label: 'My Learning' },
                { icon: <CreditCard size={16} />, label: 'Billing' },
                { icon: <Settings size={16} />, label: 'Settings' },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-3 w-full"
                  style={{ padding: '10px 16px', fontSize: '0.875rem', color: 'var(--text-body)' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{item.icon}</span>
                  {item.label}
                </div>
              ))}
              <hr className="divider mx-0 my-1" />
              <div className="flex items-center gap-3 w-full" style={{ padding: '10px 16px', fontSize: '0.875rem', color: 'var(--danger)' }}>
                <LogOut size={16} /> Sign out
              </div>
              <div className="upgrade-strip flex items-center justify-between" style={{ borderRadius: '0 0 12px 12px' }}>
                <div className="flex items-center gap-2">
                  <Zap size={14} style={{ color: 'var(--premium)' }} />
                  <span>Upgrade to Jaxtina Plus</span>
                </div>
                <span style={{ color: 'var(--brand)', fontSize: '0.75rem' }}>→</span>
              </div>
            </div>
          </div>
        </Section>

        {/* ── 14. SKELETON LOADERS ──────────────────────── */}
        <Section title="14 · Skeleton Loaders">
          <div className="card space-y-4">
            <div className="flex items-center gap-4">
              <div className="skeleton rounded-full" style={{ width: 40, height: 40 }} />
              <div className="space-y-2 flex-1">
                <div className="skeleton" style={{ height: 14, width: '60%' }} />
                <div className="skeleton" style={{ height: 12, width: '40%' }} />
              </div>
            </div>
            <div className="skeleton" style={{ height: 12, width: '100%' }} />
            <div className="skeleton" style={{ height: 12, width: '80%' }} />
            <div className="skeleton" style={{ height: 12, width: '90%' }} />
            <div className="skeleton" style={{ height: 48, width: '100%', borderRadius: 8 }} />
          </div>
        </Section>

        {/* ── 15. UPGRADE STRIP ─────────────────────────── */}
        <Section title="15 · Upgrade Strip">
          <div className="card-lg" style={{ backgroundColor: 'var(--brand-subtle)' }}>
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <div style={{ width: 40, height: 40, background: 'var(--premium-light)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Zap size={20} style={{ color: 'var(--premium)' }} />
                </div>
                <div>
                  <p className="font-bold" style={{ fontSize: '0.875rem', color: 'var(--text-heading)' }}>Unlock Jaxtina Plus</p>
                  <p className="meta-text">Get personalised feedback, mock test analysis &amp; more.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button className="btn-ghost" style={{ fontSize: '0.8125rem' }}>Maybe later</button>
                <button className="btn-primary" style={{ fontSize: '0.8125rem', backgroundColor: 'var(--premium)' }}>
                  Upgrade — ₫499k/month
                </button>
              </div>
            </div>
          </div>
        </Section>

        {/* Footer spacer */}
        <div className="h-16" />
      </div>
    </div>
  )
}
