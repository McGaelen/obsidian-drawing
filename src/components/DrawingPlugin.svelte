<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte'
  import { Platform } from 'obsidian'
  import interact from 'interactjs'
  import { fabric } from 'fabric'
  import { init_canvas } from 'obsidian-drawing-rust'

  export let source: string

  const dispatch = createEventDispatcher()

  let canvas: fabric.Canvas
  let canvasEl: HTMLCanvasElement
  let resizer: HTMLDivElement
  let container: HTMLDivElement

  let height = 500

  $: if (canvas) {
    canvas.setHeight(height)
  }

  onMount(async () => {
    interact(resizer).draggable({
      listeners: {
        move(e) {
          height += e.dy
        },
      },
    })

    const saved_svg = new DOMParser()
      .parseFromString(source, 'image/svg+xml')
      .querySelector('svg')

    const saved_height = saved_svg?.getAttribute('height')
    height = saved_height ? parseInt(saved_height) : height

    init_canvas(canvasEl)

    canvasEl.addEventListener('touchstart', handle_touch)
    canvasEl.addEventListener('touchmove', handle_touch)
  })

  function handle_touch(e: TouchEvent) {
    for (const touch of e.touches) {
      if (touch.touchType === 'stylus') {
        e.preventDefault()
      }
    }
  }

  async function write() {
    console.log('writing...')
    dispatch('save', canvas.toSVG())
  }
</script>

<div bind:this={container}>
  <div class="toolbar" class:mobile={Platform.isMobile || Platform.isMobileApp}>
    <button
      on:click={() => {
        if (!canvas) return
        canvas.isDrawingMode = !canvas.isDrawingMode
      }}>Toggle Drawing</button
    >
    <button on:click={() => (canvasEl.width = container.offsetWidth)}
      >reset width</button
    >
  </div>
  <canvas {height} width="800" bind:this={canvasEl} />
  <div
    bind:this={resizer}
    class="resizer"
    class:taller={Platform.isMobile || Platform.isMobileApp}
  />
</div>

<style>
  canvas {
    /*border: 1px solid var(--divider-color);*/
    cursor: crosshair;
  }

  .resizer {
    transition: all;
    transition-duration: 200ms;
    height: 5px;
    background-color: var(--divider-color);
    border-radius: var(--radius-s);
    cursor: row-resize !important;
    touch-action: none;
  }

  .resizer.taller {
    height: 15px;
  }

  .resizer:hover {
    background-color: var(--interactive-accent);
  }

  button:active {
    background-color: red;
  }

  .toolbar {
    position: sticky;
    top: -32px;
    left: 0;
    z-index: 999999;
    background-color: var(--divider-color);
    border-top-left-radius: var(--radius-s);
    border-top-right-radius: var(--radius-s);
    cursor: default;
  }

  .toolbar.mobile {
    top: -8px;
  }
</style>
