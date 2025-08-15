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
import { App } from './react/App'
import { HandwritingStateManager } from './HandwritingStateManager'

export default class HandwritingPlugin extends Plugin {
  async onload() {
    this.registerMarkdownCodeBlockProcessor(
      'drawing',
      async (source, el, ctx) => {
        const reactRoot = createRoot(el)

        const file = this.app.vault.getAbstractFileByPath(source)

        if (file instanceof TFile) {
          const contents = await this.app.vault.read(file)
          reactRoot.render(
            App({
              stateManager: new HandwritingStateManager(
                this.app,
                file,
                JSON.parse(contents),
              ),
            }),
          )

          ctx.addChild(new HandwritingRenderChild(reactRoot, el))
        } else {
          throw new Error('Invalid state file provided')
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
        const filename = `tldraw/${crypto.randomUUID()}.md`

        await self.app.vault.create(filename, '{"height": 500}')

        editor.replaceRange(
          '\n```drawing\n' + filename + '\n```\n',
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
