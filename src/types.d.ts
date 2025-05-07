import type { TLEditorSnapshot } from 'tldraw'
import type { ReactNode } from 'react'

declare global {
  interface HandwritingState {
    height: number
    snapshot?: TLEditorSnapshot
  }

  /** =========== Props =========== */
  interface HandwritingRootProps {
    initialState: HandwritingState
    onStateChange: OnStateChangeHandler
  }

  interface StateProviderProps {
    initialState: HandwritingState
    onStateChange: OnStateChangeHandler
    children: ReactNode
  }

  /** =========== Actions =========== */
  interface ChangeHeightAction {
    type: 'change-height'
    amount: number
  }

  interface SetSnapshotAction {
    type: 'set-snapshot'
    snapshot: TLEditorSnapshot
  }

  type HandwritingAction = ChangeHeightAction | SetSnapshotAction

  /** =========== Other =========== */
  type OnStateChangeHandler = (state: HandwritingState) => void
}
