import { type PropsWithChildren, useEffect, useState } from 'react'
import { fromResizeObserver } from '../utils/fromResizeObserver'
import { throttleTime } from 'rxjs'

export function HandwritingContainer({children}: PropsWithChildren) {
  let [maxWidth, setMaxWidth] = useState(0)

  const cm_scroller = document.querySelector('.cm-scroller')
  if (!cm_scroller) {
    return <>
      <h1>Couldn't find the `.cm-scroller` element!</h1>
      <p>This react app needs to be mounted by an Obsidian Plugin!</p>
    </>
  }

  const {unsubscribe} = fromResizeObserver(cm_scroller)
    .pipe(throttleTime(100))
    .subscribe(_ => {
      setMaxWidth(cm_scroller.clientWidth - 100)
    })

  useEffect(() => () => unsubscribe(), [])

  return (
    <div
      style={{
        position: 'relative',
        height: '500px',
        width: `${maxWidth}px`,
        left: '50%',
        translate: '-50%',
        contain: 'style !important'
      }}
      // Capture the wheel event so event bubbling goes top-down,
      // then stopPropagation to prevent all children from handling it.
      // We don't want tldraw listening to mouse wheel events because it
      // prevents the markdown view from scrolling!
      onWheelCapture={e => e.stopPropagation()}
    >
      {children}
    </div>
  )
}
