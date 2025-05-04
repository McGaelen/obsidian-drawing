import { useEffect, useState } from 'react'
import { fromResizeObserver } from '../../utils/fromResizeObserver'
import { throttleTime } from 'rxjs'

export function useMarkdownViewWidth(): number {
  let [width, setWidth] = useState(0)

  const cm_scroller = document.querySelector('.cm-scroller')
  if (!cm_scroller) {
    throw new Error(`
      Couldn't find the '.cm-scroller' element!
      This react app needs to be mounted by an Obsidian Plugin!
    `)
  }

  const {unsubscribe} = fromResizeObserver(cm_scroller)
    .pipe(throttleTime(100))
    .subscribe(_ => {
      setWidth(cm_scroller.clientWidth)
    })

  // TODO: figure out why this blows up
  // useEffect(() => () => unsubscribe(), [])

  return width
}
