import { useMarkdownViewRect } from '../../hooks/useMarkdownViewRect'
import { createPortal } from 'react-dom'
import { Draggable } from 'gsap/Draggable'
import { gsap } from 'gsap'
import { useCallback, useContext, useRef } from 'react'
import { StateManagerContext } from '../../contexts/StateManagerContext'
import { DefaultToolbar, DefaultToolbarContent } from 'tldraw'

export function FloatingToolbar(props: {}) {
  const stateManager = useContext(StateManagerContext)
  const mdRect = useMarkdownViewRect()
  const cmEditor = useRef(document.querySelector('.cm-editor'))

  const handleRef = useCallback((div: HTMLDivElement) => {
    // set initial coordinates
    gsap.set(div, {
      x: stateManager.current.floatingToolbar.x,
      y: stateManager.current.floatingToolbar.y,
    })

    const draggable = new Draggable(div, {
      type: 'x,y',
      inertia: true,
      bounds: cmEditor.current,
      minimumMovement: 10,
      // This fires when the inertia ends, not when the drag event ends
      onThrowComplete() {
        stateManager.update(state => {
          state.floatingToolbar = {
            x: draggable.x,
            y: draggable.y,
          }
        })
      },
    })

    return () => {
      draggable.kill()
    }
  }, [])

  if (!mdRect || !cmEditor.current) {
    return <></>
  } else {
    return createPortal(
      <div
        ref={handleRef}
        className="w-fit h-[50px] absolute z-[999999] bg-(--background-secondary) touch-none"
        style={{ boxShadow: 'rgba(0, 0, 0, 0.5) 0px 6px 20px' }}
      >
        <DefaultToolbar {...props}>
          <DefaultToolbarContent />
        </DefaultToolbar>
      </div>,
      cmEditor.current,
    )
  }
}
