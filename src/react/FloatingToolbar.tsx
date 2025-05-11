import interact from 'interactjs'
import { useEffect, useRef, useState } from 'react'
import type { Interactable } from '@interactjs/core/Interactable'
import { useMarkdownViewRect } from './hooks/useMarkdownViewRect'

export function FloatingToolbar() {
  const mdRect = useMarkdownViewRect()

  const [x, setX] = useState(0)
  const [y, setY] = useState(0)

  const containerRef = useRef<HTMLDivElement>(null)
  const toolbarRef = useRef<HTMLDivElement>(null)

  let interactable: Interactable

  useEffect(() => {
    if (mdRect && !interactable) {
      interactable = interact(toolbarRef.current!).draggable({
        inertia: true,
        modifiers: [
          interact.modifiers.restrictRect({
            restriction: containerRef.current!,
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

    return () => {
      interactable?.unset()
    }
  }, [mdRect])

  return !mdRect ? (<></>) : (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        width: `${mdRect.width}px`,
        height: `${mdRect.height}px`,
      }}
    >
      <div
        ref={toolbarRef}
        style={{
          width: '200px',
          height: '100px',
          borderRadius: '50px',
          position: 'absolute',
          top: `${y}px`,
          left: `${x}px`,
          zIndex: 999999,
          backgroundColor: 'var(--background-secondary-alt)',
          boxShadow: 'rgba(0, 0, 0, 0.5) 0px 6px 20px',
          touchAction: 'none',
        }}
      />
    </div>
  )
}
