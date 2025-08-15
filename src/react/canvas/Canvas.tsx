import { SetDarkMode } from './SetDarkMode'
import { SetCameraOptions } from './SetCameraOptions'
import { SaveOnChange } from './SaveOnChange'
import { type TLComponents, Tldraw } from 'tldraw'
import { useContext } from 'react'
import { Background } from './ui/Background'
import { TouchEventBlocker } from './ui/TouchEventBlocker'
import { FloatingToolbar } from './ui/FloatingToolbar'
import { StateManagerContext } from '../contexts/StateManagerContext'

export function Canvas() {
  const stateManager = useContext(StateManagerContext)

  const components: TLComponents = {
    Background,
    Canvas: TouchEventBlocker,
    Toolbar: FloatingToolbar,
  }

  return (
    <Tldraw
      snapshot={stateManager.current.snapshot}
      components={components}
      onMount={editor =>
        editor.user.updateUserPreferences({ edgeScrollSpeed: 0 })
      }
    >
      <SetDarkMode />
      <SetCameraOptions />
      <SaveOnChange />
    </Tldraw>
  )
}
