import { useEditor } from 'tldraw'
import { StateContext } from './StateContext'
import { useContext } from 'react'
import { debounceTime, fromEventPattern, merge } from 'rxjs'

export function SaveOnChange() {
  const {file, app} = useContext(StateContext)

  const editor = useEditor()

  const onChange = fromEventPattern(
    handler => editor.sideEffects.registerAfterChangeHandler('shape', handler),
  )
  const onDelete = fromEventPattern(
    handler => editor.sideEffects.registerAfterDeleteHandler('shape', handler),
  )

  const {unsubscribe} = merge(onChange, onDelete).pipe(debounceTime(500)).subscribe(async () => {
    await app.vault.modify(file, JSON.stringify(editor.getSnapshot()))
  })

  return <></>
}
