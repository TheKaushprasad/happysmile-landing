import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Props {
  selected: string | null
  onSelect: (iso: string) => void
}

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

function toISO(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

export default function Calendar({ selected, onSelect }: Props) {
  const today = startOfDay(new Date())
  const [view, setView] = useState<Date>(new Date(today.getFullYear(), today.getMonth(), 1))

  const year = view.getFullYear()
  const month = view.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  // Don't allow navigating to months fully in the past.
  const atCurrentMonth = year === today.getFullYear() && month === today.getMonth()

  const cells: (Date | null)[] = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d))

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-card">
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setView(new Date(year, month - 1, 1))}
          disabled={atCurrentMonth}
          className="flex h-9 w-9 items-center justify-center rounded-full text-ink-muted transition hover:bg-brand-soft hover:text-brand disabled:opacity-30 disabled:hover:bg-transparent"
          aria-label="Previous month"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <span className="font-display text-base font-semibold text-ink">
          {MONTHS[month]} {year}
        </span>
        <button
          type="button"
          onClick={() => setView(new Date(year, month + 1, 1))}
          className="flex h-9 w-9 items-center justify-center rounded-full text-ink-muted transition hover:bg-brand-soft hover:text-brand"
          aria-label="Next month"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="mb-1 grid grid-cols-7 gap-1 text-center text-xs font-semibold text-ink-muted">
        {WEEKDAYS.map((w) => (
          <div key={w} className="py-1">
            {w}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((date, i) => {
          if (!date) return <div key={`e-${i}`} />
          const iso = toISO(date)
          const isPast = date < today
          const isSunday = date.getDay() === 0
          const disabled = isPast
          const isSelected = selected === iso
          return (
            <button
              key={iso}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(iso)}
              className={[
                'flex h-10 items-center justify-center rounded-xl text-sm font-medium transition',
                isSelected
                  ? 'bg-brand text-white shadow-card'
                  : disabled
                    ? 'cursor-not-allowed text-slate-300'
                    : isSunday
                      ? 'text-brand-dark hover:bg-brand-soft'
                      : 'text-ink hover:bg-brand-soft hover:text-brand',
              ].join(' ')}
              aria-pressed={isSelected}
              aria-label={date.toDateString()}
            >
              {date.getDate()}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export function formatDisplayDate(iso: string | null): string {
  if (!iso) return ''
  const [y, m, d] = iso.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  return date.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}
