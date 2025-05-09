import { type ReactNode, useContext, useState } from 'react'
import { StateContext } from './StateContext'
import { useMarkdownViewWidth } from './hooks/useMarkdownViewWidth'

export function CanvasContainer({children}: {children: ReactNode}) {
  let width = useMarkdownViewWidth()
  let {height} = useContext(StateContext)
  let [isFinger, setIsFinger] = useState(false)

  return <div
    style={{
      position: 'relative',
      height: `${height}px`,
      width: `${width}px`,
      left: '50%',
      translate: '-50%',
      contain: 'style !important',
      paddingTop: '10px',
    }}
    // Capture the wheel event so event bubbling goes top-down,
    // then stopPropagation to prevent all children from handling it.
    // We don't want tldraw listening to mouse wheel events because it
    // prevents the markdown view from scrolling!
    onWheelCapture={e => e.stopPropagation()}

    // onPointerDownCapture={e => {
    //   console.log('onPointerDownCapture')
    //   if (e.pointerType === 'touch') {
    //     setIsFinger(true)
    //     e.stopPropagation()
    //   } else {
    //     setIsFinger(false)
    //   }
    // }}
    // onPointerMoveCapture={e => {
    //   console.log('onPointerMoveCapture')
    //   e.stopPropagation()
    // }}
    // onPointerUpCapture={e => {
    //   console.log('onPointerUpCapture')
    //   setIsFinger(false)
    //   // e.stopPropagation()
    // }}
    // onPointerCancelCapture={e => {
    //   console.log('onPointerCancelCapture')
    //   e.stopPropagation()
    // }}
    //
    // onPointerEnterCapture={e => {
    //   console.log('onPointerEnterCapture')
    //   e.stopImmediatePropagation()
    // }}
    // onPointerOverCapture={e => {
    //   console.log('onPointerOverCapture')
    //   e.stopPropagation()
    // }}
    // onPointerLeaveCapture={e => {
    //   console.log('onPointerLeaveCapture')
    //   e.stopImmediatePropagation()
    // }}
    //
    // onTouchStartCapture={e => {
    //   console.log('onTouchStartCapture')
    //   e.stopPropagation()
    // }}
    // onTouchMoveCapture={e => {
    //   console.log('onTouchMoveCapture')
    //   e.stopPropagation()
    // }}
    // onTouchEndCapture={e => {
    //   console.log('onTouchEndCapture')
    //   e.stopPropagation()
    // }}
    //
    // onDragOverCapture={e => {
    //   e.stopPropagation()
    // }}
  >
    {children}
    {isFinger &&
      <style>{`
        .tl-canvas {
          touch-action: pan-y !important;
        }
      `}</style>
    }
  </div>
}
