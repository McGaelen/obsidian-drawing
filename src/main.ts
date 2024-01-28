// noinspection JSUnusedGlobalSymbols
import { Plugin } from 'obsidian'
import SampleSettingTab from './SampleSettingTab'
import { Decoration, type DecorationSet, EditorView } from '@codemirror/view'
import { type Extension, RangeSetBuilder, StateField } from '@codemirror/state'
import { HideSvg, SvelteRoot } from './widgets'

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
    const state = StateField.define<DecorationSet>({
      create(_): DecorationSet {
        return Decoration.none
      },
      update(_, tx): DecorationSet {
        const builder = new RangeSetBuilder<Decoration>()

        const content = tx.state.doc.toString()
        const startIdx = content.indexOf('\n```drawing\n') + 12 // index starts at beginning of matched string, so we need to add 11 to get the end instead
        const endIdx = content.indexOf('\n```', startIdx)

        const source = content.slice(startIdx, endIdx)

        // Be very careful adding more decorations... They might break iPad by causing it to scroll again.
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
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData())
  }

  async saveSettings() {
    await this.saveData(this.settings)
  }
}
