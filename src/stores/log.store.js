let lines = $state([])

export default {
  get lines() {
    return lines
  },
}

export const oldLog = console.log
console.log = function () {
  oldLog(...arguments)
  lines = [...lines, getOutput(...arguments)]
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
