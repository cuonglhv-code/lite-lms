'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Building2, MapPin, Phone, Mail, Users } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getCenters } from '@/app/(dashboard)/manager/actions'
import { AddCenterModal } from '@/components/modals/AddCenterModal'

export default function ManagerCentersPage() {
  const router = useRouter()
  const [centers, setCenters] = useState<{ id: string; name: string; address?: string | null; phone?: string | null; email?: string | null; isActive?: boolean; _count?: { students: number; teachers: number; classes: number } }[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)

  useEffect(() => {
    loadCenters()
  }, [])

  async function loadCenters() {
    setLoading(true)
    const res = await getCenters()
    if (res.success) {
      setCenters(res.data)
    }
    setLoading(false)
  }

  const filtered = centers.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.address?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Centers</h1>
          <p className="text-sm text-gray-500 mt-1">Manage physical teaching locations and their resources</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-shadow shadow-sm active:scale-95 transition-transform"
        >
          <Building2 className="w-4 h-4" />
          Add New Center
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Centers', value: centers.length, icon: Building2, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Active Locations', value: centers.filter(c => c.isActive).length, icon: MapPin, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Total Staff', value: centers.reduce((acc, c) => acc + (c._count?.teachers || 0), 0), icon: Users, color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-5 flex items-center gap-4 shadow-sm">
            <div className={cn('p-3 rounded-lg', s.bg)}>
              <s.icon className={cn('w-6 h-6', s.color)} />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">{s.label}</p>
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="search"
            placeholder="Search centers by name or address..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
        </div>
        <div className="text-sm text-gray-400 font-medium">
          {filtered.length} center{filtered.length !== 1 ? 's' : ''} found
        </div>
      </div>

      {/* Centers Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(i => (
            <div key={i} className="h-64 bg-gray-50 rounded-2xl animate-pulse border border-gray-100" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(center => (
            <div 
              key={center.id}
              onClick={() => router.push(`/manager/centers/${center.id}`)}
              className="group bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-xl hover:border-indigo-100 transition-all cursor-pointer relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">View Details →</span>
              </div>

              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 bg-gray-50 rounded-xl group-hover:bg-indigo-50 transition-colors">
                  <Building2 className="w-6 h-6 text-gray-400 group-hover:text-indigo-600 transition-colors" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 group-hover:text-indigo-700 transition-colors">{center.name}</h3>
                  <div className="flex items-center gap-1.5 mt-1 text-gray-500">
                    <MapPin className="w-3.5 h-3.5" />
                    <span className="text-xs line-clamp-1">{center.address || 'No address set'}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-2 rounded-lg bg-gray-50/50">
                  <p className="text-xs text-gray-400 mb-0.5 uppercase tracking-tighter font-bold">Students</p>
                  <p className="font-bold text-gray-900">{center._count?.students || 0}</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-gray-50/50">
                  <p className="text-xs text-gray-400 mb-0.5 uppercase tracking-tighter font-bold">Teachers</p>
                  <p className="font-bold text-gray-900">{center._count?.teachers || 0}</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-gray-50/50">
                  <p className="text-xs text-gray-400 mb-0.5 uppercase tracking-tighter font-bold">Classes</p>
                  <p className="font-bold text-gray-900">{center._count?.classes || 0}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-50 space-y-2">
                {center.phone && (
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Phone className="w-3 h-3" />
                    {center.phone}
                  </div>
                )}
                {center.email && (
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Mail className="w-3 h-3" />
                    {center.email}
                  </div>
                )}
              </div>
            </div>
          ))}

          {filtered.length === 0 && !loading && (
            <div className="col-span-full py-20 flex flex-col items-center justify-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 text-gray-400">
              <Building2 className="w-12 h-12 mb-4 opacity-20" />
              <p className="text-lg font-medium">No centers found</p>
              <p className="text-sm">Try adjusting your search or add a new center</p>
            </div>
          )}
        </div>
      )}

      {showAddModal && (
        <AddCenterModal 
          onClose={() => setShowAddModal(false)} 
          onSuccess={() => {
            setShowAddModal(false)
            loadCenters()
          }} 
        />
      )}
    </div>
  )
}
