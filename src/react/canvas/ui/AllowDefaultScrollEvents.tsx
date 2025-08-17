import { DefaultCanvas } from 'tldraw'
import { TouchEvent, useCallback } from 'react'

export function AllowDefaultScrollEvents() {
  // TODO: figure out why this has red squigglies
  const handleTouchStartCapturePassive = (e: TouchEvent) => {
    e.stopPropagation()
  }
  return (
    <div
      ref={div => {
        // This needs to be set manually because
        div!.addEventListener('touchstart', handleTouchStartCapturePassive, {
          capture: true,
          passive: false,
        })
        return () => {
          div!.removeEventListener(
            'touchstart',
            handleTouchStartCapturePassive,
            { capture: true, passive: false },
          )
        }
      }}
      onWheelCapture={e => {
        e.stopPropagation()
      }}
      onPointerDownCapture={e => {
        if (e.pointerType === 'touch') {
          e.stopPropagation()
        }
      }}
    >
      <DefaultCanvas />
    </div>
  )
}
