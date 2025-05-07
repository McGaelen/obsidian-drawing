import {
  type ActionDispatch,
  createContext,
  useEffect,
  useReducer,
} from 'react'

export const StateContext = createContext({} as HandwritingState)
export const DispatchContext = createContext((() => {}) as ActionDispatch<[HandwritingAction]>)

export function StateProvider(
  { initialState, onStateChange, children }: StateProviderProps
) {
  const [state, dispatch] = useReducer<HandwritingState, [HandwritingAction]>(reducer, initialState)

  useEffect(() => {
    console.log('state changed')
    onStateChange(state)
  }, [state])

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
