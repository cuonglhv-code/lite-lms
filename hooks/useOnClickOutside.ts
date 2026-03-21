// Reusable hook: fires a callback when a click or touch occurs outside the given ref element

import { useEffect, RefObject, useCallback } from 'react'

type AnyEvent = MouseEvent | TouchEvent

export function useOnClickOutside<T extends HTMLElement>(
  ref: RefObject<T>,
  handler: (event: AnyEvent) => void,
): void {
  const stableHandler = useCallback(handler, [handler])

  useEffect(() => {
    const listener = (event: AnyEvent) => {
      const el = ref.current
      if (!el || el.contains(event.target as Node)) return
      stableHandler(event)
    }

    document.addEventListener('mousedown', listener)
    document.addEventListener('touchstart', listener)
    return () => {
      document.removeEventListener('mousedown', listener)
      document.removeEventListener('touchstart', listener)
    }
  }, [ref, stableHandler])
}
