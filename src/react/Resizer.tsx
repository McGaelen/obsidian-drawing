import { useContext } from 'react'
import { Platform } from 'obsidian'
import { Draggable } from 'gsap/Draggable'
import { StateManagerContext } from './StateManagerContext'

export function Resizer() {
  const stateManager = useContext(StateManagerContext)

  function setupDraggable(div: HTMLDivElement): () => void {
    const draggable = new Draggable(div, {
      type: 'top',

      onDrag() {
        stateManager.update(state => {
          state.height += draggable.deltaY
        })
      },
    })

    return () => {
      draggable.kill()
    }
  }

  return (
    <>
      <div
        ref={setupDraggable}
        className={`resizer ${Platform.isMobile || Platform.isMobileApp ? 'taller' : ''}`}
      />
      <style>{`
      .resizer {
        transition: all;
        transition-duration: 200ms;
        height: 5px;
        background-color: var(--divider-color);
        border-radius: var(--radius-s);
        cursor: row-resize !important;
        touch-action: none;
      }
    
      .resizer.taller {
        height: 15px;
      }
    
      .resizer:hover {
        background-color: var(--interactive-accent);
      }
    `}</style>
    </>
  )
}
