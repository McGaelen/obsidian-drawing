<script lang='ts'>
  let { origin = { x: 0, y: 0 } } = $props<{ origin: { x: number, y: number } }>()

  let d = $state(`M${origin.x},${origin.y}`)

  export function lineTo(x: number, y: number) {
    d = `${d}L${x},${y}`
  }
</script>

<path {d} />
