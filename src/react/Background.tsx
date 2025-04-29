import { LinedBackground } from './backgrounds/LinedBackground'

export function Background() {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: 'var(--background-primary)'
      }}
    >
      <LinedBackground />
    </div>
  )
}
