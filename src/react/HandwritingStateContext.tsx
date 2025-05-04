import { createContext, type Dispatch, type PropsWithChildren, type SetStateAction, useState } from 'react'
import type { App, TFile } from 'obsidian'

interface HandwritingState {
  file: TFile
  app: App
  height: number
  setHeight: Dispatch<SetStateAction<number>>
}

export const HandwritingStateContext = createContext({} as HandwritingState)

export function HandwritingStateProvider({file, app, children }: {file: TFile, app: App} & PropsWithChildren) {
  let [height, setHeight] = useState(500)

  const initialValue: HandwritingState = {
    file,
    app,
    height,
    setHeight
  }

  return <HandwritingStateContext.Provider value={initialValue}>
    {children}
  </HandwritingStateContext.Provider>
}
