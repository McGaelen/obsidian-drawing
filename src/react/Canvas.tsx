import { SetDarkMode } from './SetDarkMode'
import { SetCameraOptions } from './SetCameraOptions'
import { SaveOnChange } from './SaveOnChange'
import { type TLComponents, Tldraw, type TLEditorSnapshot } from 'tldraw'
import { useContext } from 'react'
import { StateContext } from './StateContext'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Background } from './Background'
import { App, TFile } from 'obsidian'

export function Canvas() {
  const {app, file} = useContext(StateContext)

  const {data} = useSuspenseQuery({
    queryKey: ['snapshot'],
    queryFn: () => readSnapshotFile(app, file),
  })

  const components: TLComponents = {
    Background,
  }

  return (
    <Tldraw
      snapshot={data}
      components={components}
    >
      <SetDarkMode />
      <SetCameraOptions />
      <SaveOnChange />
    </Tldraw>
  )
}

async function readSnapshotFile(app: App, file: TFile): Promise<TLEditorSnapshot> {
  const contents = await app.vault.read(file)
  // TODO: dont do this terrible hackiness, its disgusting
  return JSON.parse(contents || '{}')
}
