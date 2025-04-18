import { type PropsWithChildren, useEffect, useState } from 'react'

export function HandwritingContainer({children}: PropsWithChildren) {
  let [maxWidth, setMaxWidth] = useState(0)

  const cm_scroller = document.querySelector('.cm-scroller')
  if (!cm_scroller) {
    return <>
      <h1>Couldn't find the `.cm-scroller` element!</h1>
      <p>This plugin needs to be mounted by the Obsidian Plugin!</p>
    </>
  }

  const resizeObs = new ResizeObserver(() => {
    setMaxWidth(cm_scroller.clientWidth)
  })
  resizeObs.observe(cm_scroller)

  useEffect(() => () => resizeObs.disconnect(), [])

  return (
    <div
      style={{
        position: 'relative',
        height: '700px',
        width: `${maxWidth}px`,
        left: '50%',
        translate: '-50%',
        contain: 'style !important'
      }}
    >
      {children}
    </div>
  )
}
