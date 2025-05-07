import { times } from 'lodash-es'

export function LinedBackground() {
  return <>
    {times(20).map(n => (
      <div
        key={n}
        style={{
          top: `${(n * 50) + 50}px`,
          left: '50px',
          position: 'relative',
          backgroundColor: 'var(--background-modifier-hover)',
          height: '2px',
          width: 'calc(100% - 100px)',
        }}
      />
    ))}
  </>
}
