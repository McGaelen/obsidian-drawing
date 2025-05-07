import {
  type ActionDispatch,
  createContext,
  type PropsWithChildren,
  useReducer,
  useState,
} from 'react'
import type { App, TFile } from 'obsidian'

export const StateContext = createContext({} as HandwritingState)
export const DispatchContext = createContext((() => {}) as ActionDispatch<[AnyAction]>)

export function StateProvider({file, app, children }: {file: TFile, app: App} & PropsWithChildren) {
  const initialValue: HandwritingState = {
    file,
    app,
    height: 500, // TODO: read this from the json file!
  }

  const [state, dispatch] = useReducer<HandwritingState, [AnyAction]>(reducer, initialValue)

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  )
}

function reducer(state: HandwritingState, action: AnyAction): HandwritingState {
  switch (action.type) {
    case 'change-height':
      return {
        ...state,
        height: state.height + action.amount
      }
    default:
      throw new Error('Unknown action: ' + action.type)
  }
}
