import { useEffect, useState } from 'react'
import { fromResizeObserver } from '../../utils/fromResizeObserver'
import { throttleTime } from 'rxjs'
import { Platform } from 'obsidian'

export function useMarkdownViewWidth(): number {
  let [width, setWidth] = useState(0)

  const selector = Platform.isMobile ? '.markdown-reading-view' : '.cm-scroller'
  const cm_scroller = document.querySelector(selector)

  if (!cm_scroller) {
    throw new Error(`
      Couldn't find the '${selector}' element!
      This react app needs to be mounted by an Obsidian Plugin!
    `)
  }

  useEffect(() => {
    const sub = fromResizeObserver(cm_scroller)
      .pipe(throttleTime(100))
      .subscribe(_ => {
        setWidth(cm_scroller.clientWidth)
      })

    return () => sub.unsubscribe()
  }, [])

  return width
}
