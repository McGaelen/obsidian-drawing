import { writable } from 'svelte/store'

const { update, subscribe } = writable([])

export let log = {
  subscribe,
}

const oldLog = console.log
console.log = function () {
  oldLog('lol ', ...arguments)

  let output = getOutput(...arguments)

  update(arr => [...arr, output])
}

function getOutput() {
  let output = `<span style='color: dodgerblue'>${new Date().toISOString()}: </span>`

  for (const thing of arguments) {
    if (typeof thing === 'object') {
      for (const prop in thing) {
        if (typeof thing[prop] !== 'function') {
          output += `${prop}: ${thing[prop]}, `
        }
      }
    } else {
      output += thing?.toString()
    }
  }

  return output
}
