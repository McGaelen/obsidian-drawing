import { StateProvider } from './StateContext'
import { HandwritingPlugin } from './HandwritingPlugin'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export function HandwritingRoot(
  { initialState, onStateChange }: HandwritingRootProps
) {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <StateProvider initialState={initialState} onStateChange={onStateChange}>
        <HandwritingPlugin />
      </StateProvider>
    </QueryClientProvider>
  )
}
