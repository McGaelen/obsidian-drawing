import { useEditor } from 'tldraw'
import { useContext, useEffect } from 'react'
import { debounceTime, fromEventPattern, merge } from 'rxjs'
import { StateManagerContext } from './StateManagerContext'

export function SaveOnChange() {
  const stateManager = useContext(StateManagerContext)
  const editor = useEditor()

  useEffect(() => {
    const onChange = fromEventPattern(handler =>
      editor.sideEffects.registerAfterChangeHandler('shape', handler),
    )
    const onDelete = fromEventPattern(handler =>
      editor.sideEffects.registerAfterDeleteHandler('shape', handler),
    )

    // If this isn't debounced, it fires CONSTANTLY
    const sub = merge(onChange, onDelete)
      .pipe(debounceTime(100))
      .subscribe(() => {
        stateManager.update(state => {
          state.snapshot = editor.getSnapshot()
        })
      })

    return () => sub.unsubscribe()
  }, [])

  return <></>
}
