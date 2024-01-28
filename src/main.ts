// noinspection JSUnusedGlobalSymbols
import { App, type MarkdownPostProcessorContext, Plugin } from 'obsidian'
import SampleSettingTab from './SampleSettingTab'
import DrawingPlugin from './components/DrawingPlugin.svelte'
import {
  Decoration,
  type DecorationSet,
  EditorView,
  WidgetType,
} from '@codemirror/view'
import { type Extension, RangeSetBuilder, StateField } from '@codemirror/state'

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

    let app = this.app
    const state = StateField.define<DecorationSet>({
      create(_): DecorationSet {
        return Decoration.none
      },
      update(_, tx): DecorationSet {
        const builder = new RangeSetBuilder<Decoration>()

        const content = tx.state.doc.toString()
        const startIdx = content.indexOf('```drawing\n') + 11 // index starts at beginning of matched string, so we need to add 11 to get the end instead
        const endIdx = content.indexOf('\n```', startIdx)

        const source = content.slice(startIdx, endIdx)

        console.log(app)
        builder.add(
          startIdx - 11,
          startIdx,
          Decoration.replace({ widget: new SvelteRoot(app, source) }),
        )

        return builder.finish()
      },
      provide(field: StateField<DecorationSet>): Extension {
        return EditorView.decorations.from(field)
      },
    })

    this.registerEditorExtension(state)

    // this.registerMarkdownCodeBlockProcessor(
    //   'drawing',
    //   drawingMarkdownCodeBlockProcessor.bind(this),
    // )
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
  let old = this.svelte_root
  this.svelte_root = new DrawingPlugin({
    target: el,
    props: {
      app: this.app,
      source,
    },
  })

  if (old) {
    old.$destroy()
  }
}

class SvelteRoot extends WidgetType {
  private svelteRoot: DrawingPlugin

  constructor(private app: App, private source: string) {
    super()
    console.log('constructor')
  }

  toDOM(_: EditorView): HTMLElement {
    const domRoot = document.createElement('div')
    let old = this.svelteRoot
    this.svelteRoot = new DrawingPlugin({
      target: domRoot,
      props: {
        app: this.app,
        source: this.source,
      },
    })

    if (old) {
      old.$destroy()
    }

    return domRoot
  }

  updateDOM(dom: HTMLElement, view: EditorView): boolean {
    console.log('updateDOM', { dom, view })
    return true
  }
}
