import { EditorView, WidgetType } from '@codemirror/view'
import DrawingPlugin from './components/DrawingPlugin.svelte'
import { App } from 'obsidian'

export class HideSvg extends WidgetType {
  toDOM(_: EditorView): HTMLElement {
    return document.createElement('div')
  }
}

export class SvelteRoot extends WidgetType {
  private svelteRoot: DrawingPlugin

  constructor(private app: App, private source: string) {
    super()
  }

  toDOM(): HTMLElement {
    if (this.svelteRoot) {
      this.svelteRoot.$destroy()
    }

    const domRoot = document.createElement('div')

    this.svelteRoot = new DrawingPlugin({
      target: domRoot,
      props: {
        app: this.app,
        source: this.source,
      },
    })

    return domRoot
  }

  updateDOM() {
    return true
  }

  destroy() {
    this.svelteRoot?.$destroy()
  }
}
