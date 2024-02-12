import { TextFileView } from 'obsidian'
import App from './components/App.svelte'

export class HandwritingView extends TextFileView {
  
  static type = 'handwriting-view'

  private svelte: App

  async onOpen() {
    this.contentEl.style.padding = '0px'

    this.svelte = new App({
      target: this.contentEl,
      props: {
        source: '',
      },
    })

    this.svelte.$on('save', ({detail}) => {
      this.setViewData(detail, true)
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
    return this.svelte.getSource()
  }

  setViewData(data: string, clear: boolean): void {
    this.svelte.$set({
      source: clear ? data : this.svelte.getSource() + data
    })
  }

  clear(): void {
    this.svelte.$set({
      source: ''
    })
  }
}
