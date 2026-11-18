import { BUSINESS } from '../../lib/config'

export default function Logo({ onLight = false }: { onLight?: boolean }) {
  return (
    <a href="#home" className="flex items-center gap-2.5" aria-label={`${BUSINESS.brand} home`}>
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand shadow-card">
        <svg viewBox="0 0 32 32" className="h-6 w-6" aria-hidden="true">
          <path
            d="M16 7c-2.2 0-3.4 1.1-5 1.1S8.2 7.4 7 8.6c-1.3 1.4-1.1 4.2-.2 7.3.7 2.5 1.6 5.6 2.9 7.3.7.9 1.7 1.2 2.4.4.7-.8.9-2.3 1.4-3.6.4-1 .9-1.6 1.5-1.6s1.1.6 1.5 1.6c.5 1.3.7 2.8 1.4 3.6.7.8 1.7.5 2.4-.4 1.3-1.7 2.2-4.8 2.9-7.3.9-3.1 1.1-5.9-.2-7.3-1.2-1.2-2.4-1.5-4-1.5S18.2 7 16 7Z"
            fill="#fff"
          />
        </svg>
      </span>
      <span
        className={`font-display text-xl font-bold tracking-tight ${
          onLight ? 'text-white' : 'text-ink'
        }`}
      >
        Happy<span className="text-brand">Smile</span>
      </span>
    </a>
  )
}
