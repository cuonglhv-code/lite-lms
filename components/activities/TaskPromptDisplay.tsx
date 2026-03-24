interface Props {
  title: string
  prompt: string
  hasImage?: boolean
}

export const TaskPromptDisplay = ({ title, prompt, hasImage }: Props) => {
  return (
    <div className="card-lg bg-surface-alt border-l-4 border-l-brand flex flex-col gap-4">
      <h2 className="text-heading font-bold text-xl">{title}</h2>
      
      {hasImage && (
        <div className="w-full aspect-video bg-white border-2 border-dashed border-gray-200 rounded-md flex items-center justify-center text-muted-c">
          <div className="flex flex-col items-center gap-2">
            <svg className="w-8 h-8 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span className="text-sm font-semibold uppercase tracking-widest">Chart / Diagram</span>
          </div>
        </div>
      )}

      <div className="text-body leading-relaxed whitespace-pre-wrap">
        {prompt}
      </div>
    </div>
  )
}
