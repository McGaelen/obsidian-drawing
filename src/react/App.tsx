import { StateManagerProvider } from './contexts/StateManagerContext'
import { gsap } from 'gsap'
import { Draggable } from 'gsap/Draggable'
import { InertiaPlugin } from 'gsap/InertiaPlugin'
import { HandwritingStateManager } from '../HandwritingStateManager'
import { CanvasSizer } from './resizer/CanvasSizer'
import { Canvas } from './canvas/Canvas'
import { Resizer } from './resizer/Resizer'

gsap.registerPlugin(Draggable, InertiaPlugin)

export function App({
  stateManager,
}: {
  stateManager: HandwritingStateManager
}) {
  return (
    <StateManagerProvider stateManager={stateManager}>
      <CanvasSizer>
        <Canvas />
      </CanvasSizer>
      <Resizer />
      <div style={{ paddingBottom: '10px' }}></div>
    </StateManagerProvider>
  )
}
