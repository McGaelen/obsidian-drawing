import { createContext, PropsWithChildren } from 'react'
import { HandwritingStateManager } from '../../HandwritingStateManager'

// All serializable state goes here
export const StateManagerContext = createContext({} as HandwritingStateManager)

export function StateManagerProvider({
  stateManager,
  children,
}: PropsWithChildren<{ stateManager: HandwritingStateManager }>) {
  return (
    <StateManagerContext.Provider value={stateManager}>
      {children}
    </StateManagerContext.Provider>
  )
}
