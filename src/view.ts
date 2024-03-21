import { TextFileView } from 'obsidian'
import App from './components/App.svelte'

export class HandwritingView extends TextFileView {
  static type = 'handwriting-view'

  private svelte: App

  async onOpen() {
    this.contentEl.style.padding = '0px'

    this.svelte = new App({
      target: this.contentEl,
    })

    this.svelte.$on('save', ({ detail }) => {
      // this.setViewData(detail, true)
      this.requestSave()
    })
  }

  async onClose() {
    this.svelte.$destroy()
  }

  getDisplayText(): string {
    return 'Handwriting'
  }

  getViewType(): string {
    return HandwritingView.type
  }

  getViewData(): string {
    console.log('getViewData')
    return this.svelte.getSource()
  }

  setViewData(data: string, clear: boolean): void {
    console.log('setViewData')
    this.svelte.setSource(clear ? data : this.svelte.getSource() + data)
  }

  clear(): void {
    console.log('clear')
    this.svelte.setSource('')
  }
}
