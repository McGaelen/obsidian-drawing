import { StateManagerProvider } from './contexts/StateManagerContext'
import { HandwritingStateManager } from '../HandwritingStateManager'
import { Canvas } from './canvas/Canvas'

export function App({
  stateManager,
}: {
  stateManager: HandwritingStateManager
}) {
  return (
    <StateManagerProvider stateManager={stateManager}>
      <Canvas />
      <div className="pb-[10px]" />
    </StateManagerProvider>
  )
}
