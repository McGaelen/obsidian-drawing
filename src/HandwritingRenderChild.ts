import { MarkdownRenderChild } from 'obsidian'
import App from './components/App.svelte'

export class HandwritingRenderChild extends MarkdownRenderChild {
  constructor(private svelteComponentInstance: App, containerEl: HTMLElement) {
    super(containerEl)
  }

  public unload() {
    this.svelteComponentInstance.$destroy()
    super.unload()
  }
}
