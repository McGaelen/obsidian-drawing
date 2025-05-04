// noinspection JSUnusedGlobalSymbols
import {
  Editor,
  type MarkdownFileInfo,
  MarkdownView,
  Plugin,
  TFile,
} from 'obsidian'
import { HandwritingRenderChild } from './HandwritingRenderChild'
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

        const reactRoot = createRoot(el)
        reactRoot.render(App({
          filename: options.filename, app: this.app
        }))

        ctx.addChild(new HandwritingRenderChild(reactRoot, el))
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
