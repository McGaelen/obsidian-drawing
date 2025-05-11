import { Platform } from 'obsidian'

export function useMarkdownView(): HTMLDivElement {
  const selector = Platform.isMobile ? '.markdown-reading-view' : '.cm-scroller'
  const cm_scroller = document.querySelector<HTMLDivElement>(selector)

  if (!cm_scroller) {
    throw new Error(`
      Couldn't find the '${selector}' element!
      This react app needs to be mounted by an Obsidian Plugin!
    `)
  }

  return cm_scroller
}
