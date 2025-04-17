// noinspection JSUnusedGlobalSymbols
import {
  Editor,
  type MarkdownFileInfo,
  MarkdownView,
  Plugin,
  TFile,
} from 'obsidian'
// import App from './components/App.svelte'
import { HandwritingRenderChild } from './HandwritingRenderChild'
// import { mount } from 'svelte'
import { createRoot } from 'react-dom/client'
import {App} from './react/App'
import type { TLEditorSnapshot } from 'tldraw'

export default class HandwritingPlugin extends Plugin {
  async onload() {
    this.registerMarkdownCodeBlockProcessor(
      'drawing',
      async (source, el, ctx) => {
        let options: { filename: string }
        try {
          options = JSON.parse(source)
        } catch (e) {
          console.error(e)
          el.textContent = 'Failed to parse options JSON'
          return
        }

        const fileOrFolder = this.app.vault.getAbstractFileByPath(
          options.filename,
        )

        if (fileOrFolder instanceof TFile) {
          const contents = await this.app.vault.read(fileOrFolder)

          let initialState: TLEditorSnapshot | undefined = undefined
          try {
            initialState = JSON.parse(contents)
          } catch (e) {
            console.warn(e, 'Failed to parse tldraw file; creating new one.')
          }

          const reactRoot = createRoot(el)
          reactRoot.render(App({
            initialState,
            onchange: (snapshot) => {
              this.app.vault.modify(fileOrFolder, JSON.stringify(snapshot))
            }
          }))

          ctx.addChild(new HandwritingRenderChild(reactRoot, el))
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
      async editorCallback(
        editor: Editor,
        _ctx: MarkdownView | MarkdownFileInfo,
      ) {
        const filename = `tldraw/${crypto.randomUUID()}.tldraw`

        await self.app.vault.create(filename, '')

        const optionsStr = JSON.stringify({ filename })
        editor.replaceRange(
          '\n```drawing\n' + optionsStr + '\n```\n',
          editor.getCursor(),
        )
      },
    })

    this.addRibbonIcon('pen', 'Add Drawing to current file', () => {
      // @ts-expect-error WARNING: this is not in the public api!!!
      this.app.commands.executeCommandById('obsidian-drawing:add-drawing')
    })
  }
}
