// noinspection JSUnusedGlobalSymbols
import {App, MarkdownEditView, type MarkdownPostProcessorContext, MarkdownView, Plugin} from 'obsidian'
import SampleSettingTab from './SampleSettingTab'
import {createRoot, mount} from 'svelte'
import DrawingPlugin from './components/DrawingPlugin.svelte'
import type {PluginValue} from "@codemirror/view";
import {EditorView, ViewPlugin, ViewUpdate} from "@codemirror/view";
import {StateField} from "@codemirror/state";

interface MyPluginSettings {
  mySetting: string
}

const DEFAULT_SETTINGS: MyPluginSettings = {
  mySetting: 'default',
}

export default class HelloWorldPlugin extends Plugin {
  settings: MyPluginSettings
  svelte_root: null | (Record<string, any> & {   $destroy: () => void;   $set: (props: Partial<{     app: App;     source: string;   }>) => void; } ) = null

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
  if (this.svelte_root) {
    this.svelte_root.$destroy()
  }

  this.svelte_root  = createRoot(DrawingPlugin, {
    target: el,
    props: {
      app: this.app,
      source,
    },
  })
}


