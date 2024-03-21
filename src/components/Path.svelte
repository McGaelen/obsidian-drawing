<script lang="ts">
  export let origin = { x: 0, y: 0 }

  let d = `M${origin.x},${origin.y}`

  export function lineTo(x: number, y: number) {
    d = `${d}L${x},${y}`
  }
</script>

<path {d} />
