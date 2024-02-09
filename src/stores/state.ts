import { writable, type Readable, type Writable } from 'svelte/store'
import paperApi from 'paper'

interface State {
  paper?: typeof paperApi
  activeTool?: string
  // @ts-expect-error no idea why
  tools: Map<string, paperApi.Tool>
}

const initialState: State = {
  tools: new Map(),
}

export class StateStore implements Readable<State> {
  subscribe: Readable<State>['subscribe']
  private readonly update: Writable<State>['update']

  constructor(canvas: HTMLCanvasElement) {
    const { subscribe, update } = writable(initialState)
    this.subscribe = subscribe
    this.update = update

    paperApi.setup(canvas)
    this.update(val => ({ ...val, paper: paperApi }))
  }

  // @ts-expect-error no idea why
  registerTool(name: string, tool: paperApi.Tool) {
    this.update(state => {
      state.tools.set(name, tool)
      return state
    })
  }

  activateTool(name: string) {
    this.update(state => {
      if (state.tools.has(name)) {
        state.tools.get(name)!.activate()
        state.activeTool = name
      }
      return state
    })
  }
}
