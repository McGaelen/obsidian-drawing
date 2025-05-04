import { type Editor, useEditor } from 'tldraw'
import { useEffect } from 'react'
import { fromMutationObserver } from '../utils/fromMutationObserver'

export function SetDarkMode() {
  const editor = useEditor()
  setDarkMode(editor)

  const {unsubscribe} = fromMutationObserver(document.body, { attributes: true })
    .subscribe(_ => {
      setDarkMode(editor)
    })

  // TODO: figure out why this blows up
  // useEffect(() => () => unsubscribe(), [])

  return <></>
}

function setDarkMode(editor: Editor) {
  if (document.body.classList.contains('theme-dark')) {
    editor.user.updateUserPreferences({ colorScheme: 'dark' })
  } else {
    editor.user.updateUserPreferences({ colorScheme: 'light' })
  }
}
