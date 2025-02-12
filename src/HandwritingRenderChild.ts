import { MarkdownRenderChild } from 'obsidian'
import App from './components/App.svelte'
import { unmount } from 'svelte'

export class HandwritingRenderChild extends MarkdownRenderChild {
  constructor(
    private svelteComponentInstance: App,
    containerEl: HTMLElement,
  ) {
    super(containerEl)
  }

  public unload() {
    unmount(this.svelteComponentInstance)
    super.unload()
  }
}
