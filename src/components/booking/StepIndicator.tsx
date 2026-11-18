import { Check } from 'lucide-react'

interface Props {
  steps: string[]
  current: number // 0-based
}

export default function StepIndicator({ steps, current }: Props) {
  return (
    <ol className="flex items-center gap-2 sm:gap-3">
      {steps.map((label, i) => {
        const isDone = i < current
        const isActive = i === current
        return (
          <li key={label} className="flex flex-1 items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-2">
              <span
                className={[
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition',
                  isDone
                    ? 'bg-brand text-white'
                    : isActive
                      ? 'bg-brand text-white ring-4 ring-brand-light'
                      : 'bg-slate-100 text-ink-muted',
                ].join(' ')}
              >
                {isDone ? <Check className="h-4 w-4" /> : i + 1}
              </span>
              <span
                className={`hidden text-sm font-medium sm:inline ${
                  isActive ? 'text-ink' : 'text-ink-muted'
                }`}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <span
                className={`h-0.5 flex-1 rounded-full ${isDone ? 'bg-brand' : 'bg-slate-200'}`}
              />
            )}
          </li>
        )
      })}
    </ol>
  )
}
