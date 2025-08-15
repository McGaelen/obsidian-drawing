import { useMarkdownViewRect } from '../hooks/useMarkdownViewRect'
import { createPortal } from 'react-dom'
import { Draggable } from 'gsap/Draggable'
import { gsap } from 'gsap'
import { PropsWithChildren, useContext } from 'react'
import { StateManagerContext } from '../StateManagerContext'

export function FloatingToolbar({ children }: PropsWithChildren) {
  const stateManager = useContext(StateManagerContext)
  const mdRect = useMarkdownViewRect()
  const cmEditor = document.querySelector('.cm-editor')

  console.log(stateManager.current.floatingToolbar)

  if (!mdRect || !cmEditor) {
    return <></>
  } else {
    return createPortal(
      <div
        className="w-fit h-[50px] absolute z-[999999] bg-(--background-secondary) touch-none"
        style={{
          boxShadow: 'rgba(0, 0, 0, 0.5) 0px 6px 20px',
        }}
        ref={div => {
          gsap.set(div, {
            x: stateManager.current.floatingToolbar.x,
            y: stateManager.current.floatingToolbar.y,
          })
          const draggable = new Draggable(div, {
            type: 'x,y',
            inertia: true,
            bounds: cmEditor,
            minimumMovement: 10,
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
        }}
      >
        {children}
      </div>,
      cmEditor,
    )
  }
}
