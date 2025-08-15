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
import { createContext, useContext } from 'react'
import { Background } from './Background'
import { TouchEventBlocker } from './TouchEventBlocker'
import { FloatingToolbar } from './toolbar/FloatingToolbar'
import { StateManagerContext } from './StateManagerContext'

export const EditorContext = createContext({} as Editor)

export function Canvas() {
  const stateManager = useContext(StateManagerContext)

  const components: TLComponents = {
    Background,
    Canvas: TouchEventBlocker,
    Toolbar: props => {
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
        snapshot={stateManager.current.snapshot}
        components={components}
        onMount={editor => {
          editor.user.updateUserPreferences({ edgeScrollSpeed: 0 })
        }}
      >
        <SetDarkMode />
        <SetCameraOptions />
        <SaveOnChange />
      </Tldraw>
    </>
  )
}
