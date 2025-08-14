import { useMarkdownViewRect } from '../hooks/useMarkdownViewRect'
import { createPortal } from 'react-dom'
import { Tools } from './Tools'
import { Draggable } from 'gsap/Draggable'
import { PropsWithChildren } from 'react'

export function FloatingToolbar({ children }: PropsWithChildren) {
  const mdRect = useMarkdownViewRect()
  const cmEditor = document.querySelector('.cm-editor')
  console.log('floating toolbar')
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
          const draggable = new Draggable(div, {
            type: 'x,y',
            inertia: true,
            bounds: cmEditor,
            minimumMovement: 10,
            snap: {
              x: val => val,
              y: val => val,
            },
          })
          return () => {
            draggable.kill()
          }
        }}
      >
        {/*<Tools />*/}
        {children}
      </div>,
      cmEditor,
    )
  }
}
