import { StateProvider } from './StateContext'
import {type App as ObsidianApp, TFile } from 'obsidian'
import { HandwritingPlugin } from './HandwritingPlugin'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

/**
 * This is the root of the entire plugin - it's responsible for setting up the
 * global state/context.
 */
export function HandwritingRoot({ filename, app }: {filename: string, app: ObsidianApp }) {
  const file = app.vault.getAbstractFileByPath(filename)

  if (file instanceof TFile) {
    return (
      <QueryClientProvider client={new QueryClient()}>
        <StateProvider file={file} app={app}>
          <HandwritingPlugin />
        </StateProvider>
      </QueryClientProvider>
    )
  } else {
    return <div>Provided filepath does not exist or is not a valid file.</div>
  }
}
