// noinspection JSUnusedGlobalSymbols
import {
  Editor,
  type MarkdownFileInfo,
  MarkdownView,
  Plugin,
  TFile,
} from 'obsidian'
import App from './components/App.svelte'
import { HandwritingRenderChild } from './HandwritingRenderChild'
import { mount } from 'svelte'

export default class HandwritingPlugin extends Plugin {
  async onload() {
    this.registerMarkdownCodeBlockProcessor(
      'drawing',
      async (source, el, ctx) => {
        console.log('RUNNING!!!', { source, el, ctx })

        const fileOrFolder = this.app.vault.getAbstractFileByPath(source)

        if (fileOrFolder instanceof TFile) {
          const contents = await this.app.vault.read(fileOrFolder)

          const svelteRoot = mount(App, {
            target: el,
            props: {
              initialSource: contents,
              onchange: contents => this.app.vault.modify(fileOrFolder, contents),
            },
          })

          ctx.addChild(new HandwritingRenderChild(svelteRoot, el))
        } else {
          el.textContent =
            'Provided filepath does not exist or is not a valid file.'
        }
      },
    )

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
  }
}
