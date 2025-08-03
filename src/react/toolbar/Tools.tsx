import { useContext } from 'react'
import { EditorContext } from '../Canvas'

export function Tools() {
  const editor = useContext(EditorContext)
  return (
    <button onClick={() => editor.setCurrentTool('draw')}>Pen</button>
  )
}