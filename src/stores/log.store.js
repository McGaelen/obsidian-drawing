import { writable } from 'svelte/store'

const { update, subscribe } = writable([])

export let log = thing => {
  console.log(thing)

  let output = ''

  if (typeof thing === 'object') {
    for (const prop in thing) {
      if (typeof thing[prop] !== 'function') {
        output += `${prop}: ${thing[prop]}, `
      }
    }
  } else {
    output = thing?.toString()
  }

  update(arr => [...arr, output])
}

log.subscribe = subscribe
