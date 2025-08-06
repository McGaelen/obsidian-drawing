import { useMarkdownViewRect } from '../hooks/useMarkdownViewRect'
import { createPortal } from 'react-dom'
import { Tools } from './Tools'
import { Draggable } from 'gsap/Draggable'

export function FloatingToolbar() {
  const mdRect = useMarkdownViewRect()
  const cmEditor = document.querySelector('.cm-editor')

  if (!mdRect || !cmEditor) {
    return <></>
  } else {
    return createPortal(
      <div
        ref={div => {
          const draggable = new Draggable(div, {
            type: 'x,y',
            inertia: true,
            bounds: cmEditor,
          })
          return () => {
            draggable.kill()
          }
        }}
        style={{
          width: 'fit-content',
          height: '100px',
          borderRadius: '50px',
          padding: '15px 25px',
          position: 'absolute',
          zIndex: 999999,
          backgroundColor: 'var(--background-secondary-alt)',
          boxShadow: 'rgba(0, 0, 0, 0.5) 0px 6px 20px',
          touchAction: 'none',
        }}
      >
        <Tools />
      </div>,
      cmEditor,
    )
  }
}
