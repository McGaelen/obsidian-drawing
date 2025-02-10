// noinspection JSUnusedGlobalSymbols
import { Editor, type MarkdownFileInfo, MarkdownView, Plugin, TFile } from 'obsidian'
import App from './components/App.svelte'
import { HandwritingRenderChild } from './HandwritingRenderChild'

export default class HandwritingPlugin extends Plugin {
  async onload() {
    // This adds a settings tab so the user can configure various aspects of the plugin
    // this.addSettingTab(new SampleSettingTab(this.app, this))

    this.registerMarkdownCodeBlockProcessor('drawing', async (source, el, ctx) => {
      console.log('RUNNING!!!', {source, el, ctx})

      const fileOrFolder = this.app.vault.getAbstractFileByPath(source)

      if (fileOrFolder instanceof TFile) {
        const contents = await this.app.vault.read(fileOrFolder)

        const svelteRoot = new App({
          target: el,
          props: {
            initialSource: contents
          }
        })
        svelteRoot.$on(
          'save',
          ({detail: contents}) => this.app.vault.modify(fileOrFolder, contents)
        )

        ctx.addChild(new HandwritingRenderChild(svelteRoot, el))
      } else {
        el.textContent = 'Provided filepath does not exist or is not a valid file.'
      }
    })

    const self = this
    this.addCommand({
      id: 'add-drawing',
      name: 'Add Drawing to current document',
      editorCallback(editor: Editor, _ctx: MarkdownView | MarkdownFileInfo) {
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

    // this.registerExtensions(['handwriting'], HandwritingView.type)

    // this.registerView(HandwritingView.type, leaf => new HandwritingView(leaf))
  }

  // async loadSettings() {
  //   this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData())
  // }

  // async saveSettings() {
  //   await this.saveData(this.settings)
  // }
}
