import { writable } from 'svelte/store'
import paper from 'paper'

interface State {
  paper?: typeof paper
  activeTool?: string
  tools: Map<string, paper.Tool>
}

const initialState: State = {
  tools: new Map(),
}

const { subscribe, update } = writable(initialState)

export const state = {
  subscribe,

  init(canvas: HTMLCanvasElement) {
    paper.setup(canvas)
    update(val => ({ ...val, paper }))
  },

  registerTool(name: string, tool: paper.Tool) {
    update(state => {
      state.tools.set(name, tool)
      return state
    })
  },

  activateTool(name: string) {
    update(state => {
      if (state.tools.has(name)) {
        state.tools.get(name)!.activate()
        state.activeTool = name
      }
      return state
    })
  },
}
