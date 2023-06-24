import { ItemView, WorkspaceLeaf } from 'obsidian'
// @ts-ignore
import Main from './components/Main.svelte'

export const VIEW_TYPE_EXAMPLE = 'example-view'

export default class ExampleView extends ItemView {
  component: Main

  constructor(leaf: WorkspaceLeaf) {
    super(leaf)
  }

  getViewType() {
    return VIEW_TYPE_EXAMPLE
  }

  getDisplayText() {
    return 'Example view'
  }

  async onOpen() {
    this.component = new Main({
      target: this.contentEl,
      props: {
        variable: 1,
      },
    })
    this.contentEl.style.contain = 'strict'
    this.contentEl.style.padding = '0'
  }

  async onClose() {
    this.component.$destroy()
  }
}
