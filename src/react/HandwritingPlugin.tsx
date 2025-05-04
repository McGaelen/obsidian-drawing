import { CanvasContainer } from './CanvasContainer'
import { Resizer } from './Resizer'
import { Suspense } from 'react'
import { Canvas } from './Canvas'

export function HandwritingPlugin() {
  return <>
    <CanvasContainer>
      <Suspense fallback={<div>parsing file...</div>}>
        <Canvas />
      </Suspense>
    </CanvasContainer>
    <Resizer />
    <div style={{paddingBottom: '10px'}}></div>
  </>
}


