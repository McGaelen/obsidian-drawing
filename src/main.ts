// noinspection JSUnusedGlobalSymbols
import {
  Editor,
  type MarkdownFileInfo,
  type MarkdownPostProcessorContext,
  MarkdownView,
  Plugin,
  type TFile,
} from 'obsidian'
import DrawingPlugin from './components/DrawingPlugin.svelte'
import { initRust } from './utils/initRust'
import { greet } from 'obsidian-drawing-rust'

// interface MyPluginSettings {
//   mySetting: string
// }

// const DEFAULT_SETTINGS: MyPluginSettings = {
//   mySetting: 'default',
// }

export default class HelloWorldPlugin extends Plugin {
  // settings: MyPluginSettings
  sveltes: Map<string, DrawingPlugin> = new Map()

  async onload() {
    // await this.loadSettings()

    await initRust()
    greet()

    // This adds a settings tab so the user can configure various aspects of the plugin
    // this.addSettingTab(new SampleSettingTab(this.app, this))

    const self = this
    this.addCommand({
      id: 'add-drawing',
      name: 'Add Drawing to current document',
      editorCallback(editor: Editor, ctx: MarkdownView | MarkdownFileInfo) {
        const filepath = `svg/${crypto.randomUUID()}.svg`

        self.app.vault.create(filepath, '')

        const position = editor.getCursor()
        editor.replaceRange('\n```drawing\n' + filepath + '\n```\n', position)
      },
    })

    this.addRibbonIcon('pen', 'Add Drawing to current file', () => {
      // @ts-expect-error WARNING: this is not in the public api!!!
      this.app.commands.executeCommandById('obsidian-drawing:add-drawing')
    })

    this.registerMarkdownCodeBlockProcessor(
      'drawing',
      this.drawingBlockProcessor.bind(this),
    )
  }

  async drawingBlockProcessor(
    filepath: string,
    el: HTMLElement,
    ctx: MarkdownPostProcessorContext,
  ) {
    console.log('RUNNING!!! ITS GONNA SCROLL!!!!!!!!', this)

    const svgFile: TFile | undefined = app.vault
      .getFiles()
      .find(file => file.path === filepath.trim())
    if (!svgFile) return

    const source = await app.vault.cachedRead(svgFile)
    if (this.sveltes.has(filepath)) {
      this.sveltes.get(filepath)!.$destroy()
      this.sveltes.delete(filepath)
    }

    const newRoot = new DrawingPlugin({
      target: el,
      props: { source },
    })
    newRoot.$on('save', async ({ detail }) => {
      await this.app.vault.process(svgFile, _ => detail)
    })
    this.sveltes.set(filepath, newRoot)
  }

  // async loadSettings() {
  //   this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData())
  // }

  // async saveSettings() {
  //   await this.saveData(this.settings)
  // }
}
