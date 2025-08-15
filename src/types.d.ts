import type { TLEditorSnapshot } from 'tldraw'
import type { ReactNode } from 'react'

declare global {
  interface HandwritingState {
    height: number
    snapshot?: TLEditorSnapshot
    floatingToolbar: {
      x: number
      y: number
    }
  }
}
