import { App, TFile } from 'obsidian'
import { produce } from 'immer'

const defaultState: HandwritingState = {
  height: 500,
}

export class HandwritingStateManager {
  #app: App
  #file: TFile
  #state: HandwritingState

  constructor(
    app: App,
    file: TFile,
    initialState: HandwritingState | undefined,
  ) {
    this.#app = app
    this.#file = file
    this.#state = initialState ?? defaultState
  }

  get current() {
    return this.#state
  }

  update(producer: (draft: HandwritingState) => void) {
    this.#state = produce(this.#state, producer)
    this.#app.vault.modify(this.#file, JSON.stringify(this.#state))
  }
}
