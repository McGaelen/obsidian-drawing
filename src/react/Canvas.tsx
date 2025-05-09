import { SetDarkMode } from './SetDarkMode'
import { SetCameraOptions } from './SetCameraOptions'
import { SaveOnChange } from './SaveOnChange'
import { type TLComponents, Tldraw, useEditor } from 'tldraw'
import { useContext, useRef, useState } from 'react'
import { StateContext } from './StateContext'
import { Background } from './Background'

export function Canvas() {
  const { current: { snapshot } } = useRef(useContext(StateContext))

  const components: TLComponents = {
    Background,
    InFrontOfTheCanvas: () => {
      const [isFinger, setIsFinger] = useState(false)
      return (
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            pointerEvents: isFinger ? 'all': 'none',
          }}
          onTouchStart={e => {
            console.log('onTouchStart')
            e.stopPropagation()
          }}
        >
          hi
        </div>
      )
    }
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


