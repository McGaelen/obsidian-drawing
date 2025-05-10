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
      contain: 'unset',
      paddingTop: '10px',
    }}
  >
    {children}
  </div>
}
