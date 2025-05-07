import { useContext, useEffect, useRef } from 'react'
import { Platform } from 'obsidian'
import interact from 'interactjs'
import { DispatchContext } from './StateContext'

export function Resizer() {
  const dispatch = useContext(DispatchContext)

  let divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    interact(divRef.current!).draggable({
      listeners: {
        move(e) {
          dispatch({
            type: 'change-height',
            amount: e.dy
          })
        },
      },
    })
  }, [])

  return <>
    <div
      ref={divRef}
      className={`resizer ${Platform.isMobile || Platform.isMobileApp ? 'taller' : ''}`}
    ></div>
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

}
