import { type ReactNode, useContext } from 'react'
import { StateContext } from './StateContext'
import { useMarkdownViewRect } from './hooks/useMarkdownViewRect'

export function CanvasContainer({children}: {children: ReactNode}) {
  let rect = useMarkdownViewRect()
  let {height} = useContext(StateContext)

  if (!rect) {
    return <></>
  }

  return <div
    style={{
      position: 'relative',
      height: `${height}px`,
      width: `${rect.width}px`,
      left: '50%',
      translate: '-50%',
      contain: 'unset',
      paddingTop: '10px',
    }}
  >
    {children}
  </div>
}
