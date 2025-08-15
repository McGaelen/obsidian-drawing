import { type ReactNode, useContext } from 'react'
import { useMarkdownViewRect } from '../hooks/useMarkdownViewRect'
import { StateManagerContext } from '../contexts/StateManagerContext'

export function CanvasSizer({ children }: { children: ReactNode }) {
  let rect = useMarkdownViewRect()
  let stateManager = useContext(StateManagerContext)

  if (!rect) {
    return <></>
  }

  return (
    <div
      style={{
        position: 'relative',
        height: `${stateManager.current.height}px`,
        width: `${rect.width}px`,
        left: '50%',
        translate: '-50%',
        contain: 'unset',
        paddingTop: '10px',
      }}
    >
      {children}
    </div>
  )
}
