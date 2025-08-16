import { SetDarkMode } from './SetDarkMode'
import { SetCameraOptions } from './SetCameraOptions'
import { SaveOnChange } from './SaveOnChange'
import { MobileStylePanel, type TLComponents, Tldraw } from 'tldraw'
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
    ZoomMenu: null,
    ZoomBrush: null,
    Minimap: null,
    PageMenu: null,
    ActionsMenu: null,
    MainMenu: null,
  }

  return (
    <Tldraw
      snapshot={stateManager.current.snapshot}
      components={components}
      options={{
        edgeScrollSpeed: 0,
        actionShortcutsLocation: 'toolbar',
      }}
    >
      <SetDarkMode />
      <SetCameraOptions />
      <SaveOnChange />
    </Tldraw>
  )
}
