// noinspection JSUnusedGlobalSymbols
import { Plugin } from 'obsidian'
import { HandwritingView } from './view'

export default class HandwritingPlugin extends Plugin {
  async onload() {
    // This adds a settings tab so the user can configure various aspects of the plugin
    // this.addSettingTab(new SampleSettingTab(this.app, this))

    this.addRibbonIcon('pen', 'Add Drawing to current file', async () => {
      this.app.workspace.detachLeavesOfType(HandwritingView.type)

      await this.app.workspace.getLeaf(false).setViewState({
        type: HandwritingView.type,
        active: true,
      })

      this.app.workspace.revealLeaf(
        this.app.workspace.getLeavesOfType(HandwritingView.type)[0],
      )
    })

    this.registerExtensions(['handwriting'], HandwritingView.type)

    this.registerView(HandwritingView.type, leaf => new HandwritingView(leaf))
  }

  // async loadSettings() {
  //   this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData())
  // }

  // async saveSettings() {
  //   await this.saveData(this.settings)
  // }
}
