function Chevron({ down }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d={down ? 'M3.5 6l4.5 4.5L12.5 6' : 'M3.5 10l4.5-4.5L12.5 10'} />
    </svg>
  )
}

// Position it inside a `relative` wrapper that does NOT scroll.
export function ScrollNav({ state, onScroll, label = 'content' }) {
  if (!state.overflow) return null

  const button = (direction, disabled) => (
    <button
      type="button"
      aria-label={`Scroll ${label} ${direction < 0 ? 'up' : 'down'}`}
      aria-disabled={disabled}
      onClick={() => {
        if (!disabled) onScroll(direction)
      }}
      className="scroll-nav-button inline-flex h-11 w-11 items-center justify-center rounded-full border border-ink/15 bg-white/80 text-ink shadow-md backdrop-blur-sm transition duration-150 ease-out hover:bg-white active:scale-95 aria-disabled:cursor-default aria-disabled:opacity-40 aria-disabled:hover:bg-white/80 aria-disabled:active:scale-100 motion-reduce:transition-none"
    >
      <Chevron down={direction > 0} />
    </button>
  )

  return (
    <div className="absolute bottom-4 right-3 z-10 flex flex-col gap-2">
      {button(-1, state.atStart)}
      {button(1, state.atEnd)}
    </div>
  )
}
