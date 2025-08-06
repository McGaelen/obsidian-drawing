import { useContext, useEffect } from 'react'
import { EditorContext } from '../Canvas'
import { useValue } from 'tldraw'

export const ToolIds = {
  select: 'select',
  draw: 'draw',
  eraser: 'eraser',

  getDisplayName(val: string) {
    switch (val) {
      case ToolIds.select:
        return 'Select'
      case ToolIds.draw:
        return 'Draw'
      case ToolIds.eraser:
        return 'Eraser'
      default:
        return
    }
  },
} as const

export function Tools() {
  const editor = useContext(EditorContext)
  const currentToolId = useValue(
    'current tool id',
    () => editor?.getCurrentToolId(),
    [editor],
  )

  useEffect(() => console.log(currentToolId), [currentToolId])

  return (
    <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
      <button onClick={() => editor.setCurrentTool(ToolIds.select)}>
        {ToolIds.getDisplayName(ToolIds.select)}
      </button>
      <button onClick={() => editor.setCurrentTool(ToolIds.draw)}>
        {ToolIds.getDisplayName(ToolIds.draw)}
      </button>
      <button onClick={() => editor.setCurrentTool(ToolIds.eraser)}>
        {ToolIds.getDisplayName(ToolIds.eraser)}
      </button>
    </div>
  )
}
