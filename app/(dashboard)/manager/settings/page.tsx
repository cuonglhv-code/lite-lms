export default function ManagerSettingsPage() {
  return (
    <div className="space-y-5 max-w-2xl">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-0.5">Centre configuration and preferences</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
        {[
          { label: 'Centre Name', value: 'Jaxtina English Centre', type: 'text' },
          { label: 'Manager Email', value: 'manager@jaxtina.edu.vn', type: 'email' },
          { label: 'Default Exam Target', value: '6.5', type: 'text' },
          { label: 'At-Risk Attendance Threshold', value: '70%', type: 'text' },
          { label: 'Finance Currency', value: 'VND', type: 'text' },
        ].map(field => (
          <div key={field.label} className="flex items-center justify-between px-5 py-4">
            <label className="text-sm font-medium text-gray-700 w-52 shrink-0">{field.label}</label>
            <input
              type={field.type}
              defaultValue={field.value}
              className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50"
            />
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <button className="px-5 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors">
          Save Changes
        </button>
      </div>
    </div>
  )
}
