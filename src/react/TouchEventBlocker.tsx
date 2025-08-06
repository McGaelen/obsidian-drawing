import { DefaultCanvas, useEditor } from 'tldraw'

/**
 * This is where all the gross and disgusting code is that allows scrolling the page
 * using touch, even when touching the tldraw container.
 *
 * Don't look at this if you don't have to. You won't be able to un-see it.
 *
 * No, we cannot use tldraw's `InFrontOfCanvas` component override because that component
 * won't be a parent of the canvas in the DOM hierarchy. (tldraw will put it as a sibling to the canvas)
 */
export function TouchEventBlocker() {
  const editor = useEditor()
  return (
    <div
      ref={div => {
        let usingPen = false

        function onPointerDown(e: PointerEvent) {
          if (e.pointerType === 'pen') {
            e.preventDefault()
            usingPen = true
            editor.focus({ focusContainer: false })
          } else if (e.pointerType === 'touch') {
            editor.blur({ blurContainer: false })
            e.stopPropagation()
          }
        }

        function onPointerMove(e: PointerEvent) {
          if (e.pointerType === 'pen') {
            e.preventDefault()
          } else if (e.pointerType === 'touch') {
            e.stopPropagation()
          }
        }

        function onPointerUp(e: PointerEvent) {
          usingPen = false
        }

        function onTouchStart(e: TouchEvent) {
          if (usingPen) {
            e.preventDefault()
          }
        }

        function onTouchMove(e: TouchEvent) {
          if (usingPen) {
            e.preventDefault()
          }
        }

        function onTouchEnd(e: TouchEvent) {
          usingPen = false
        }

        div!.addEventListener('pointerdown', onPointerDown, { capture: true })
        div!.addEventListener('pointermove', onPointerMove, { capture: true })
        div!.addEventListener('pointerup', onPointerUp, { capture: true })
        // These touch events have to be set manually since touch events in React are always passive
        div!.addEventListener('touchstart', onTouchStart, { capture: true })
        div!.addEventListener('touchmove', onTouchMove, { capture: true })
        div!.addEventListener('touchend', onTouchEnd, { capture: true })
        return () => {
          div!.removeEventListener('pointerdown', onPointerDown)
          div!.removeEventListener('pointermove', onPointerMove)
          div!.removeEventListener('pointerup', onPointerUp, { capture: true })
          div!.removeEventListener('touchstart', onTouchStart)
          div!.removeEventListener('touchmove', onTouchMove)
          div!.removeEventListener('touchend', onTouchEnd, { capture: true })
        }
      }}
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        // @ts-expect-error
        userSelect: 'none !important',
        touchAction: 'pan-y pan-x',
      }}
    >
      <DefaultCanvas />
    </div>
  )
}
