import { createContext, type PropsWithChildren, useState } from 'react'
import { useMarkdownViewWidth } from './hooks/useMarkdownViewWidth'
import { Resizer } from './Resizer'

export function HandwritingContainer({children}: PropsWithChildren) {
  let width = useMarkdownViewWidth()
  let [height, setHeight] = useState(500)
  console.log(height)

  return <>
    <div
      style={{
        position: 'relative',
        height: `${height}px`,
        width: `${width}px`,
        left: '50%',
        translate: '-50%',
        contain: 'style !important',
        marginTop: '10px'
      }}
      // Capture the wheel event so event bubbling goes top-down,
      // then stopPropagation to prevent all children from handling it.
      // We don't want tldraw listening to mouse wheel events because it
      // prevents the markdown view from scrolling!
      onWheelCapture={e => e.stopPropagation()}
    >
      {children}
    </div>
    <Resizer
      onResize={delta => setHeight(h => h + delta)}
    />
    <div style={{marginBottom: '10px'}}></div>
  </>
}
