import interact from 'interactjs'
import { useState } from 'react'
import { useMarkdownViewWidth } from './hooks/useMarkdownViewWidth'

export function FloatingToolbar() {
  const width = useMarkdownViewWidth()

  const [x, setX] = useState(0)
  const [y, setY] = useState(0)

  function divRef(div: HTMLDivElement) {
    if (!div) return
    interact(div!).draggable({
      inertia: true,
      modifiers: [
        interact.modifiers.restrictRect({
          restriction: 'parent',
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

  return (
    <div
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
      }}
      ref={divRef}
    />
  )
}
