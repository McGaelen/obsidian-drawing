<script>
  import {init_canvas, init_p} from 'obsidian-drawing-rust'
  import { onMount } from 'svelte'

  let canvas, div

  onMount(() => {
    init_canvas(canvas)
    init_p(div)
  })
</script>

<div bind:this={div}></div>
<canvas bind:this={canvas}></canvas>