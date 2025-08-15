import { StateManagerProvider } from './StateManagerContext'
import { HandwritingPlugin } from './HandwritingPlugin'
import { gsap } from 'gsap'
import { Draggable } from 'gsap/Draggable'
import { InertiaPlugin } from 'gsap/InertiaPlugin'
import { HandwritingStateManager } from '../HandwritingStateManager'

gsap.registerPlugin(Draggable, InertiaPlugin)

export function App({
  stateManager,
}: {
  stateManager: HandwritingStateManager
}) {
  return (
    <StateManagerProvider stateManager={stateManager}>
      <HandwritingPlugin />
    </StateManagerProvider>
  )
}
