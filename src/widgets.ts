import { WidgetType } from '@codemirror/view'
import DrawingPlugin from './components/DrawingPlugin.svelte'
import { App } from 'obsidian'

export class SvelteRoot extends WidgetType {
  drawingPlugin: DrawingPlugin

  constructor(private app: App, private source: string) {
    super()
  }

  toDOM(): HTMLElement {
    console.log('toDOM - THIS WILL CAUSE SCROLLING')
    if (this.drawingPlugin) {
      this.drawingPlugin.$destroy()
    }

    const domRoot = document.createElement('div')

    this.drawingPlugin = new DrawingPlugin({
      target: domRoot,
      props: {
        app: this.app,
        source: this.source,
      },
    })

    return domRoot
  }

  updateDOM() {
    console.log('updateDOM - NOT SCROLLING')
    return true
  }

  destroy() {
    this.drawingPlugin?.$destroy()
  }
}
