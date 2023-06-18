<script>
  import { log } from './stores/log.store'

  /** @type {{x: number, y: number}} */
  export let origin = { x: 0, y: 0 }

  let d = ''
  $: d = `M${origin.x},${origin.y}`

  export function lineTo(x, y) {
    log(`${d}L${x},${y}`)
    d = `${d}L${x},${y}`
  }
</script>

<path {d} />
