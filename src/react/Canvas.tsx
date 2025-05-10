import { SetDarkMode } from './SetDarkMode'
import { SetCameraOptions } from './SetCameraOptions'
import { SaveOnChange } from './SaveOnChange'
import { type TLComponents, Tldraw } from 'tldraw'
import { useContext, useRef } from 'react'
import { StateContext } from './StateContext'
import { Background } from './Background'
import { TouchEventBlocker } from './TouchEventBlocker'

export function Canvas() {
  const { current: { snapshot } } = useRef(useContext(StateContext))

  const components: TLComponents = {
    Background,
    Canvas: TouchEventBlocker
  }

  return (
    <Tldraw
      snapshot={snapshot}
      components={components}
      onMount={editor => {
        editor.user.updateUserPreferences({edgeScrollSpeed: 0})
      }}
    >
      <SetDarkMode />
      <SetCameraOptions />
      <SaveOnChange />
    </Tldraw>
  )
}


