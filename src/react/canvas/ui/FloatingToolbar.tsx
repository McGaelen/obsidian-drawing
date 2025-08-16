import { Draggable } from 'gsap/Draggable'
import { useCallback, useContext, useRef } from 'react'
import { StateManagerContext } from '../../contexts/StateManagerContext'
import { DefaultToolbar } from 'tldraw'

export function FloatingToolbar(props: {}) {
  const stateManager = useContext(StateManagerContext)
  const cmEditor = useRef(document.querySelector('.cm-editor'))

  const handleRef = useCallback((div: HTMLDivElement) => {
    // set initial coordinates
    // gsap.set(div, {
    //   x: stateManager.current.floatingToolbar.x,
    //   y: stateManager.current.floatingToolbar.y,
    //   z: 399,
    // })

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

  return (
    <div
      ref={handleRef}
      className="obsidian-handwriting-toolbar w-fit h-fit overflow-auto absolute bg-(--background-secondary) rounded-[11px] border border-(--divider-color)"
      style={{
        filter: 'drop-shadow(rgba(0, 0, 0, 0.5) 0px 6px 20px)',
        pointerEvents: 'all',
      }}
    >
      <DefaultToolbar {...props} />
    </div>
  )
}
