import { HandwritingStateProvider } from './HandwritingStateContext'
import {type App as ObsidianApp, TFile } from 'obsidian'
import { HandwritingApp } from './HandwritingApp'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

/**
 * This is the root of the entire plugin - it's responsible for setting up the
 * global state/context.
 */
export function App({ filename, app }: {filename: string, app: ObsidianApp }) {
  const file = app.vault.getAbstractFileByPath(filename)

  if (file instanceof TFile) {
    return (
      <QueryClientProvider client={new QueryClient()}>
        <HandwritingStateProvider file={file} app={app}>
          <HandwritingApp />
        </HandwritingStateProvider>
      </QueryClientProvider>
    )
  } else {
    return <div>Provided filepath does not exist or is not a valid file.</div>
  }
}
