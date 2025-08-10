import { useContext } from 'react'
import { EditorContext } from '../Canvas'
import { MousePointer2, Pencil, Eraser } from 'lucide-react'
import { useValue } from 'tldraw'
import { clsx } from 'clsx'

export const ToolIds = {
  select: 'select',
  draw: 'draw',
  eraser: 'eraser',
} as const

export function Tools() {
  const editor = useContext(EditorContext)
  const currentToolId = useValue(
    'current tool id',
    () => editor?.getCurrentToolId(),
    [editor],
  )

  // uncomment to see what tool IDs already exist
  // useEffect(() => console.log(currentToolId), [currentToolId])

  return (
    <>
      <div className="flex items-center h-full">
        <button
          className={clsx('clickable-icon w-[50px]! h-full!', {
            selected: currentToolId === ToolIds.select,
          })}
          onClick={() => editor.setCurrentTool(ToolIds.select)}
        >
          <MousePointer2 />
        </button>
        <button
          className={clsx('clickable-icon w-[50px]! h-full!', {
            selected: currentToolId === ToolIds.draw,
          })}
          onClick={() => editor.setCurrentTool(ToolIds.draw)}
        >
          <Pencil />
        </button>
        <button
          className={clsx('clickable-icon w-[50px]! h-full!', {
            selected: currentToolId === ToolIds.eraser,
          })}
          onClick={() => editor.setCurrentTool(ToolIds.eraser)}
        >
          <Eraser />
        </button>
      </div>
      <style>{`
        .selected {
          color: var(--text-on-accent);
          background-color: var(--interactive-accent);
        }
        .selected:hover {
          color: var(--text-on-accent);
          background-color: var(--interactive-accent);
        }
      `}</style>
    </>
  )
}
