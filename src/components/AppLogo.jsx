export function AppLogo({ compact = false }) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-2xl bg-[#07111c] shadow-lg shadow-cyan-500/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(45,212,191,0.35),transparent_36%),radial-gradient(circle_at_80%_90%,rgba(96,165,250,0.28),transparent_42%)]" />
        <svg className="relative h-8 w-8" viewBox="0 0 48 48" fill="none" aria-hidden="true">
          <rect x="7" y="10" width="5.5" height="14" rx="2" fill="#1D4ED8" />
          <rect x="20.8" y="7" width="5.5" height="18" rx="2" fill="#2DD4BF" />
          <rect x="34.5" y="10" width="5.5" height="12" rx="2" fill="#F59E0B" />
          <path
            d="M7.5 31L16.4 22.1L22.4 28.1L37.8 12.7"
            stroke="#2DD4BF"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M32.8 12.7H37.8V17.7" stroke="#60A5FA" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M9 38H39" stroke="#E5EEF8" strokeWidth="2.8" strokeLinecap="round" opacity="0.9" />
        </svg>
      </div>
      {!compact && (
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[var(--accent)]">TradePilot</p>
          <h1 className="text-2xl font-black tracking-tight">Journal Desk</h1>
        </div>
      )}
    </div>
  )
}
