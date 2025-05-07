import { useEditor } from 'tldraw'
import { DispatchContext } from './StateContext'
import { useContext, useEffect } from 'react'
import { debounceTime, fromEventPattern, merge } from 'rxjs'

export function SaveOnChange() {
  const dispatch = useContext(DispatchContext)
  const editor = useEditor()

  useEffect(() => {
    const onChange = fromEventPattern(
      handler => editor.sideEffects.registerAfterChangeHandler('shape', handler),
    )
    const onDelete = fromEventPattern(
      handler => editor.sideEffects.registerAfterDeleteHandler('shape', handler),
    )

    const sub = merge(onChange, onDelete).pipe(debounceTime(500)).subscribe(() => {
      dispatch({ type: 'set-snapshot', snapshot: editor.getSnapshot() })
    })

    return () => sub.unsubscribe()
  }, [])

  return <></>
}
