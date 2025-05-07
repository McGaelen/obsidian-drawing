import { SetDarkMode } from './SetDarkMode'
import { SetCameraOptions } from './SetCameraOptions'
import { SaveOnChange } from './SaveOnChange'
import { type TLComponents, Tldraw } from 'tldraw'
import { useContext, useRef } from 'react'
import { StateContext } from './StateContext'
import { Background } from './Background'

export function Canvas() {
  const { current: { snapshot } } = useRef(useContext(StateContext))

  const components: TLComponents = {
    Background,
  }

  return (
    <Tldraw
      snapshot={snapshot}
      components={components}
    >
      <SetDarkMode />
      <SetCameraOptions />
      <SaveOnChange />
    </Tldraw>
  )
}


