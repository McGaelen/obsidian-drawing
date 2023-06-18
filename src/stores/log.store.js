import { writable } from 'svelte/store'

const { update, subscribe } = writable([])

export let log = thing => {
  console.log(thing)

  let output = ''

  if (typeof thing === 'object') {
    for (const prop in thing) {
      output += `${prop}: ${thing[prop]}, `
    }
  } else {
    output = thing?.toString()
  }

  update(arr => [...arr, output])
}

log.subscribe = subscribe
