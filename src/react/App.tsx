import { StateProvider } from './StateContext'
import { HandwritingPlugin } from './HandwritingPlugin'
import { gsap } from 'gsap'
import { Draggable } from 'gsap/Draggable'
import { InertiaPlugin } from 'gsap/InertiaPlugin'

gsap.registerPlugin(Draggable, InertiaPlugin)

export function App({ initialState, onStateChange }: HandwritingRootProps) {
  return (
    <StateProvider initialState={initialState} onStateChange={onStateChange}>
      <HandwritingPlugin />
    </StateProvider>
  )
}
