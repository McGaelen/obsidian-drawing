import { CanvasContainer } from './CanvasContainer'
import { Resizer } from './Resizer'
import { Canvas } from './Canvas'

export function HandwritingPlugin() {
  return <>
    <CanvasContainer>
      <Canvas />
    </CanvasContainer>
    <Resizer />
    <div style={{paddingBottom: '10px'}}></div>
  </>
}


