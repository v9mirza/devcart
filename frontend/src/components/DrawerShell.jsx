import { useLockBodyScroll } from '../hooks/useLockBodyScroll'

export default function DrawerShell({ open, onClose, children, panelClassName = '' }) {
  useLockBodyScroll(open)

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[55] overflow-hidden">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs animate-drawer-backdrop"
        aria-hidden="true"
      />

      <div className="absolute inset-y-0 right-0 w-full flex justify-end pointer-events-none">
        <div
          role="dialog"
          aria-modal="true"
          className={`pointer-events-auto w-full sm:max-w-md bg-surface border-l border-zinc-200 shadow-[0_18px_44px_-24px_rgba(15,23,42,0.34)] flex flex-col h-[100dvh] max-h-[100dvh] min-h-0 animate-drawer-panel ${panelClassName}`}
        >
          {children}
        </div>
      </div>
    </div>
  )
}
