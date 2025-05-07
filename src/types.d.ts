import type { App, TFile } from 'obsidian'
import type { TLEditorSnapshot } from 'tldraw'

declare global {
  interface HandwritingState {
    file: TFile
    app: App
    height: number
    // snapshot: TLEditorSnapshot
  }

  interface ChangeHeightAction {
    type: 'change-height'
    amount: number
  }

  interface SetSnapshotAction {
    type: 'set-snapshot'
    snapshot: TLEditorSnapshot
  }

  type AnyAction = ChangeHeightAction | SetSnapshotAction
}
