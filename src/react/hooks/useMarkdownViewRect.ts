import { useEffect, useState } from 'react'
import { fromResizeObserver } from '../../utils/fromResizeObserver'
import { debounceTime } from 'rxjs'
import { useMarkdownView } from './useMarkdownView'

export function useMarkdownViewRect(): DOMRect | undefined {
  const mdView = useMarkdownView()
  console.log(mdView)
  let [rect, setRect] = useState<DOMRect>()

  useEffect(() => {
    const sub = fromResizeObserver(mdView)
      // .pipe(debounceTime(50))
      .subscribe(_ => {
        console.log('mdview', mdView.getBoundingClientRect())
        setRect(mdView.getBoundingClientRect())
      })

    return () => sub.unsubscribe()
  }, [])

  return rect
}
