import { clsx } from 'clsx'

interface Props {
  current: number
  target: number
  className?: string
}

export const WordCounter = ({ current, target, className }: Props) => {
  const isReady = current >= target

  return (
    <div className={clsx(
      'badge transition-std py-1.5 px-3',
      isReady ? 'badge-green' : 'badge-grey',
      className
    )}>
      <span className="font-bold mr-1">{current}</span>
      <span className="opacity-70">/ {target} words</span>
      {isReady && <span className="ml-2 font-bold">✓ Ready</span>}
    </div>
  )
}
