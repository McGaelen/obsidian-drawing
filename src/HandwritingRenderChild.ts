import { MarkdownRenderChild } from 'obsidian'
// import App from './components/App.svelte'
// import { unmount } from 'svelte'
import type { Root } from 'react-dom/client'

export class HandwritingRenderChild extends MarkdownRenderChild {
  constructor(
    private reactComponentInstance: Root,
    containerEl: HTMLElement,
  ) {
    super(containerEl)
  }

  public unload() {
    this.reactComponentInstance.unmount()
    super.unload()
  }
}
