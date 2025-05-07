import { type ReactNode, useContext } from 'react'
import { StateContext } from './StateContext'
import { useMarkdownViewWidth } from './hooks/useMarkdownViewWidth'

export function CanvasContainer({children}: {children: ReactNode}) {
  let width = useMarkdownViewWidth()
  let {height} = useContext(StateContext)

  return <div
    style={{
      position: 'relative',
      height: `${height}px`,
      width: `${width}px`,
      left: '50%',
      translate: '-50%',
      contain: 'style !important',
      paddingTop: '10px'
    }}
    // Capture the wheel event so event bubbling goes top-down,
    // then stopPropagation to prevent all children from handling it.
    // We don't want tldraw listening to mouse wheel events because it
    // prevents the markdown view from scrolling!
    onWheelCapture={e => e.stopPropagation()}
  >
    {children}
  </div>
}
