import {
  createContext,
  type ReactNode,
  Ref,
  RefObject,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { useMarkdownViewRect } from '../hooks/useMarkdownViewRect'
import { StateManagerContext } from '../contexts/StateManagerContext'
import { Platform } from 'obsidian'
import { clsx } from 'clsx'
import { Draggable } from 'gsap/Draggable'

export const CanvasSizerContext = createContext(
  {} as RefObject<HTMLDivElement | null>,
)

export function CanvasSizer({ children }: { children: ReactNode }) {
  let rect = useMarkdownViewRect()
  let stateManager = useContext(StateManagerContext)
  const draggable = useRef<Draggable>(null)
  const sizerRef = useRef<HTMLDivElement>(null)

  const [height, setHeight] = useState<number>(stateManager.current.height)

  function setupDraggable(div: HTMLDivElement) {
    if (!draggable.current) {
      draggable.current = new Draggable(div, {
        type: 'top',
        cursor: 'row-resize',

        onDrag() {
          stateManager.update(state => {
            state.height += draggable.current!.deltaY
          })
          setHeight(h => {
            h += draggable.current!.deltaY
            return h
          })
        },
      })
    }
  }

  useEffect(() => {
    return () => {
      console.log('tearing down...')
      draggable.current?.kill()
    }
  }, [])

  if (!rect) {
    return <></>
  }

  return (
    <div ref={sizerRef} className="oh-canvas-sizer">
      <CanvasSizerContext.Provider value={sizerRef}>
        <div
          className="oh-canvas-container relative pt-[10px] left-1/2"
          style={{
            height: `${height}px`,
            width: `${rect.width}px`,
            translate: '-50%',
            contain: 'unset',
          }}
        >
          {children}
        </div>
        <div
          ref={setupDraggable}
          className={clsx(
            'oh-resizer transition-all h-[5px] bg-(--divider-color) rounded-(--radius-s) touch-none hover:bg-(--interactive-accent)',
            { 'h-[15px]': Platform.isMobile || Platform.isMobileApp },
          )}
          style={{ transitionDuration: '200ms' }}
        />
      </CanvasSizerContext.Provider>
    </div>
  )
}
