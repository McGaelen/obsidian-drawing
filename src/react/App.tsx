import {
  Tldraw,
  type TLEditorSnapshot,
  type TLOnMountHandler,
  type Editor,
  type TLComponents,
} from 'tldraw'
import { debounce } from 'lodash-es'
import { Background } from './Background'

export function App({ initialState, onchange }: {initialState?: TLEditorSnapshot, onchange: (snapshot: TLEditorSnapshot) => void }) {
  const onchangeDebounced = debounce((editor: Editor) => {
    console.log('hello')
    onchange(editor.getSnapshot())
  }, 1000)

  const components: TLComponents = {
    Background,
  }
  
  const onTldrawMount: TLOnMountHandler = editor => {
    editor.sideEffects.registerAfterChangeHandler('shape', () => {
// console.log('shape')
      onchangeDebounced(editor)
    })
  }
  return (
    <div
      style={{ position: 'relative', inset: 0, height: '500px', width: '100%' }}
    >
      <Tldraw onMount={onTldrawMount} snapshot={initialState} components={components} />
    </div>
  )
}
