// noinspection JSUnusedGlobalSymbols
import { type MarkdownPostProcessorContext, Plugin } from 'obsidian'
import SampleSettingTab from './SampleSettingTab'
import { mount } from 'svelte'
import DrawingPlugin from './components/DrawingPlugin.svelte'

interface MyPluginSettings {
  mySetting: string
}

const DEFAULT_SETTINGS: MyPluginSettings = {
  mySetting: 'default',
}

export default class HelloWorldPlugin extends Plugin {
  settings: MyPluginSettings
  unmount: () => void

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
    console.log('onunload')
    this.unmount()
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
  if (this.unmount) this.unmount()

  console.log({ source, el, ctx })
  let [_, unmount] = mount(DrawingPlugin, {
    target: el,
    props: {
      app: this.app,
      source,
    },
  })
  this.unmount = unmount
}
