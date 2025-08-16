import { DefaultCanvas } from 'tldraw'

export function AllowDefaultScrollEvents() {
  return (
    <div
      onWheelCapture={e => {
        e.stopPropagation()
      }}
      onTouchStartCapture={e => {
        e.stopPropagation()
      }}
      onPointerDownCapture={e => {
        if (e.pointerType === 'touch') {
          e.stopPropagation()
        }
      }}
    >
      <DefaultCanvas />
    </div>
  )
}
