import { SetDarkMode } from './SetDarkMode'
import { SetCameraOptions } from './SetCameraOptions'
import { SaveOnChange } from './SaveOnChange'
import { type TLComponents, Tldraw } from 'tldraw'
import { useContext } from 'react'
import { Background } from './ui/Background'
import { AllowDefaultScrollEvents } from './ui/AllowDefaultScrollEvents'
import { FloatingToolbar } from './ui/FloatingToolbar'
import { StateManagerContext } from '../contexts/StateManagerContext'
import { CanvasSizer } from './CanvasSizer'

export function Canvas() {
  const stateManager = useContext(StateManagerContext)

  const components: TLComponents = {
    Background,
    Canvas: AllowDefaultScrollEvents,
    Toolbar: FloatingToolbar,
    ZoomMenu: null,
    ZoomBrush: null,
    Minimap: null,
    PageMenu: null,
    MainMenu: null,
  }

  return (
    <CanvasSizer>
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
    </CanvasSizer>
  )
}
