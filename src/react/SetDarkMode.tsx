import { type Editor, useEditor } from 'tldraw'
import { useEffect } from 'react'

export function SetDarkMode() {
  const editor = useEditor()
  const mutObs = new MutationObserver(_ => setDarkMode(editor))
  mutObs.observe(document.body, { attributes: true, })

  // Disconnect MutationObserver when component unmounts
  useEffect(() => () => mutObs.disconnect(), [])

  return <></>
}

function setDarkMode(editor: Editor) {
  if (document.body.classList.contains('theme-dark')) {
    editor.user.updateUserPreferences({ colorScheme: 'dark' })
  } else {
    editor.user.updateUserPreferences({ colorScheme: 'light' })
  }
}
