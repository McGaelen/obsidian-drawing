// noinspection JSUnusedGlobalSymbols
import { App, type MarkdownPostProcessorContext, Plugin } from 'obsidian'
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
  svelte_root: DrawingPlugin | null

  async onload() {
    await this.loadSettings()

    // This adds a settings tab so the user can configure various aspects of the plugin
    this.addSettingTab(new SampleSettingTab(this.app, this))

    this.registerMarkdownCodeBlockProcessor(
      'drawing',
      drawingMarkdownCodeBlockProcessor.bind(this),
    )
  }

  onunload() {
    this.svelte_root?.$destroy()
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData())
  }

  async saveSettings() {
    await this.saveData(this.settings)
  }
}

function drawingMarkdownCodeBlockProcessor(
  this: HelloWorldPlugin,
  source: string,
  el: HTMLElement,
  ctx: MarkdownPostProcessorContext,
) {
  // debugger

  this.svelte_root = new DrawingPlugin({
    target: el,
    props: {
      app: this.app,
      source,
    },
  })

  el.parentElement!.style.height =
    this.svelte_root.get_height().toString() + 'px'
}
