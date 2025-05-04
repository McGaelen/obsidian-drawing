import { type PropsWithChildren, useContext } from 'react'
import { HandwritingStateContext } from './HandwritingStateContext'
import { useMarkdownViewWidth } from './hooks/useMarkdownViewWidth'

export function HandwritingContainer({children}: PropsWithChildren) {
  let width = useMarkdownViewWidth()
  let {height} = useContext(HandwritingStateContext)

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
