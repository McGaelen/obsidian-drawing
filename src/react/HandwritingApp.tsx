import { HandwritingContainer } from './HandwritingContainer'
import { type TLComponents, Tldraw, type TLEditorSnapshot } from 'tldraw'
import { SetDarkMode } from './SetDarkMode'
import { SetCameraOptions } from './SetCameraOptions'
import { SaveOnChange } from './SaveOnChange'
import { Resizer } from './Resizer'
import { Background } from './Background'
import { Suspense, use, useContext } from 'react'
import { HandwritingStateContext } from './HandwritingStateContext'
import { type App, TFile } from 'obsidian'
import { useQuery } from '@tanstack/react-query'

export function HandwritingApp() {
  const {app, file} = useContext(HandwritingStateContext)

  const {data: initialSnapshot} = useQuery({
    queryKey: ['snapshot'],
    queryFn: () => readSnapshotFile(app, file),
  })

  const components: TLComponents = {
    Background,
  }

  return <>
    <HandwritingContainer>
      <Suspense fallback={<div>parsing file...</div>}>
        <Tldraw
          snapshot={initialSnapshot}
          components={components}
        >
          <SetDarkMode />
          <SetCameraOptions />
          <SaveOnChange />
        </Tldraw>
      </Suspense>
    </HandwritingContainer>
    <Resizer />
    <div style={{paddingBottom: '10px'}}></div>
  </>
}

async function readSnapshotFile(app: App, file: TFile): Promise<TLEditorSnapshot> {
  const contents = await app.vault.read(file)
  return JSON.parse(contents)
}
