import { useEditor } from 'tldraw'

export function SetCameraOptions() {
  const editor = useEditor()

  editor.setCameraOptions({
    isLocked: true,
    wheelBehavior: 'none',
    constraints: {
      baseZoom: 'default',
      initialZoom: 'default',
      bounds: {
        x: 0,
        y: 0,
        w: 820,
        h: 500,
      },
      origin: { x: 0, y: 0 },
      padding: { x: 0, y: 0 },
      behavior: 'fixed',
    },
  })
  editor.setCamera(editor.getCamera(), { immediate: true, reset: true })

  return <></>
}
