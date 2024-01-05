// noinspection JSUnusedGlobalSymbols
import { Plugin } from 'obsidian'
import SampleSettingTab from './SampleSettingTab'
import ExampleView, { VIEW_TYPE_EXAMPLE } from './ExampleView'

interface MyPluginSettings {
  mySetting: string
}

const DEFAULT_SETTINGS: MyPluginSettings = {
  mySetting: 'default',
}

export default class HelloWorldPlugin extends Plugin {
  settings: MyPluginSettings

  async onload() {
    await this.loadSettings()

    // This adds a settings tab so the user can configure various aspects of the plugin
    this.addSettingTab(new SampleSettingTab(this.app, this))

    this.registerView(VIEW_TYPE_EXAMPLE, leaf => new ExampleView(leaf))

    this.addRibbonIcon('dice', 'Activate view', async () => {
      this.app.workspace.detachLeavesOfType(VIEW_TYPE_EXAMPLE)

      await this.app.workspace
        .getLeaf(true)
        .setViewState({ type: VIEW_TYPE_EXAMPLE, active: true })

      this.app.workspace.revealLeaf(
        this.app.workspace.getLeavesOfType(VIEW_TYPE_EXAMPLE)[0],
      )
    })
  }

  onunload() {}

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData())
  }

  async saveSettings() {
    await this.saveData(this.settings)
  }
}
