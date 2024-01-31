// noinspection JSUnusedGlobalSymbols
import { Plugin } from 'obsidian'
import SampleSettingTab from './SampleSettingTab'
import DrawingPlugin from './components/DrawingPlugin.svelte'

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

    let app = this.app
    let svelteRoot: DrawingPlugin

    this.registerMarkdownCodeBlockProcessor('drawing', (source, el, ctx) => {
      if (svelteRoot) svelteRoot.$destroy()

      console.log('RUNNING!!!')

      svelteRoot = new DrawingPlugin({
        target: el,
        props: { app, source },
      })
    })
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData())
  }

  async saveSettings() {
    await this.saveData(this.settings)
  }
}
