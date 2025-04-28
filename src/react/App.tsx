import {
  Tldraw,
  type TLEditorSnapshot,
  type TLOnMountHandler,
  type Editor,
  type TLComponents,
} from 'tldraw'
import { debounce } from 'lodash-es'
import { Background } from './Background'
import { SetDarkMode } from './SetDarkMode'
import { HandwritingContainer } from './HandwritingContainer'

export function App({ initialState, onchange }: {initialState?: TLEditorSnapshot, onchange: (snapshot: TLEditorSnapshot) => void }) {
  const onchangeDebounced = debounce(
    (editor: Editor) => onchange(editor.getSnapshot()),
    1000 // 1 second
  )

  const components: TLComponents = {
    Background,
  }
  
  const onTldrawMount: TLOnMountHandler = editor => {
    editor.sideEffects.registerAfterChangeHandler('shape', () => {
      onchangeDebounced(editor)
    })
  }

  return (
    <HandwritingContainer>
      <Tldraw onMount={onTldrawMount} snapshot={initialState} components={components}>
        <SetDarkMode />
      </Tldraw>
    </HandwritingContainer>
  )
}
