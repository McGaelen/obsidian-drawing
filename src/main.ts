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
    const canvas = StateField.define<DecorationSet>({
      create(_): DecorationSet {
        return Decoration.none
      },
      update(_, tx): DecorationSet {
        const builder = new RangeSetBuilder<Decoration>()

        const content = tx.state.doc.toString()
        const startIdx = content.indexOf('\n```drawing\n') // index starts at beginning of matched string, so we need to add 11 to get the end instead
        if (startIdx === -1) {
          return Decoration.none
        }
        const startTailIdx = startIdx + 12
        const endIdx = content.indexOf('\n```', startTailIdx)

        const source = content.slice(startTailIdx, endIdx)

        // Be very careful adding more decorations... They might break iPad by causing it to scroll again.
        builder.add(
          startIdx + 1,
          startTailIdx,
          Decoration.replace({ widget: new SvelteRoot(app, source) }),
        )

        // builder.add(
        //   startTailIdx + 1,
        //   endIdx,
        //   Decoration.replace({ widget: new HideSvg() }),
        // )

        return builder.finish()
      },
      provide(field: StateField<DecorationSet>): Extension {
        return EditorView.decorations.from(field)
      },
    })

    this.registerEditorExtension([canvas])
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData())
  }

  async saveSettings() {
    await this.saveData(this.settings)
  }
}
