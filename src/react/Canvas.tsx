import { SetDarkMode } from './SetDarkMode'
import { SetCameraOptions } from './SetCameraOptions'
import { SaveOnChange } from './SaveOnChange'
import {
  DefaultToolbar,
  DefaultToolbarContent,
  type Editor,
  type TLComponents,
  Tldraw,
} from 'tldraw'
import { createContext, useContext, useRef, useState } from 'react'
import { StateContext } from './StateContext'
import { Background } from './Background'
import { TouchEventBlocker } from './TouchEventBlocker'
import { FloatingToolbar } from './toolbar/FloatingToolbar'

export const EditorContext = createContext({} as Editor)

export function Canvas() {
  const {
    current: { snapshot },
  } = useRef(useContext(StateContext))

  const [editor, setEditor] = useState<Editor | null>(null)

  const components: TLComponents = {
    Background,
    Canvas: TouchEventBlocker,
    Toolbar: props => {
      console.log('hello')
      return (
        <FloatingToolbar>
          <DefaultToolbar {...props}>
            <DefaultToolbarContent />
          </DefaultToolbar>
        </FloatingToolbar>
      )
    },
  }

  return (
    <>
      <Tldraw
        snapshot={snapshot}
        components={components}
        // hideUi
        onMount={editor => {
          setEditor(editor)
          editor.user.updateUserPreferences({ edgeScrollSpeed: 0 })
        }}
      >
        <SetDarkMode />
        <SetCameraOptions />
        <SaveOnChange />
      </Tldraw>
      {editor && (
        <EditorContext.Provider value={editor}>
          <FloatingToolbar />
        </EditorContext.Provider>
      )}
    </>
  )
}
