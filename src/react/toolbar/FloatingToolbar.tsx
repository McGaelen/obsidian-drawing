import interact from 'interactjs'
import { useRef, useState } from 'react'
import { useMarkdownViewRect } from '../hooks/useMarkdownViewRect'
import { createPortal } from 'react-dom'
import {Tools} from './Tools'
import type { Interactable } from '@interactjs/core/Interactable'

export function FloatingToolbar() {
  const interactableRef = useRef<Interactable | null>(null)

  const mdRect = useMarkdownViewRect()

  const [x, setX] = useState(0)
  const [y, setY] = useState(0)

  const cmEditor = document.querySelector('.cm-editor')

  if (!mdRect || !cmEditor) {
    return <></>
  } else {
    return createPortal(
      <div
        ref={div => {
          if (div && !interactableRef.current) {
            interactableRef.current = interact(div).draggable({
              inertia: true,
              modifiers: [
                interact.modifiers.restrictRect({
                  restriction: cmEditor,
                })
              ],
              listeners: {
                move(e) {
                  setX(x => x + e.dx)
                  setY(y => y + e.dy)
                }
              }
            })
          }
        }}
        style={{
          width: '200px',
          height: '100px',
          borderRadius: '50px',
          padding: '15px 25px',
          position: 'absolute',
          top: `${y}px`,
          left: `${x}px`,
          zIndex: 999999,
          backgroundColor: 'var(--background-secondary-alt)',
          boxShadow: 'rgba(0, 0, 0, 0.5) 0px 6px 20px',
          touchAction: 'none',
        }}
      >
        <Tools />
      </div>,
      cmEditor
    )
  }
}
