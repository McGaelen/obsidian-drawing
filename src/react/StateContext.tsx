import {
  type ActionDispatch,
  createContext,
  useEffect,
  useReducer,
} from 'react'

// All serializable state goes here
export const StateContext = createContext({} as HandwritingState)
// The dispatch function for the reducer goes here
export const DispatchContext = createContext((() => {}) as ActionDispatch<[HandwritingAction]>)

/**
 * This component sets up the global context for the entire plugin.
 * Whenever the state changes, it fires onStateChange, which the Plugin code
 * then saves to the state file.
 */
export function StateProvider(
  { initialState, onStateChange, children }: StateProviderProps
) {
  const [state, dispatch] = useReducer<HandwritingState, [HandwritingAction]>(reducer, initialState)

  useEffect(() => onStateChange(state), [state])

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  )
}

function reducer(state: HandwritingState, action: HandwritingAction): HandwritingState {
  switch (action.type) {
    case 'change-height':
      return {
        ...state,
        height: state.height + action.amount,
      }
    case 'set-snapshot':
      return {
        ...state,
        snapshot: action.snapshot,
      }
    default:
      throw new Error('Unknown action: ' + action)
  }
}
