<script lang="ts">
  import { onMount } from 'svelte'
  import { type App, debounce, Platform, type TFile } from 'obsidian'
  import interact from 'interactjs'
  import { fabric } from 'fabric'

  export let app: App
  export let source: string

  let canvas: fabric.Canvas
  let canvasEl: HTMLCanvasElement
  let resizer: HTMLDivElement
  let container: HTMLDivElement

  let height = 500

  $: if (canvas) {
    canvas.setHeight(height)
  }

  onMount(async () => {
    const svgFile: TFile | null =
      app.vault.getFiles().find(file => file.path === source) ?? null

    interact(resizer).draggable({
      listeners: {
        move(e) {
          height += e.dy
        },
      },
    })

    if (!svgFile) return

    const svgSource = await app.vault.cachedRead(svgFile)

    const saved_svg = new DOMParser()
      .parseFromString(svgSource, 'image/svg+xml')
      .querySelector('svg')

    const saved_height = saved_svg?.getAttribute('height')
    height = saved_height ? parseInt(saved_height) : height

    canvas = new fabric.Canvas(canvasEl, {
      isDrawingMode: true,
      freeDrawingCursor: 'crosshair',
    })

    canvas.setWidth(800)

    fabric.loadSVGFromString(svgSource, (results, options) => {
      for (const res of results) {
        canvas.add(res)
      }
      canvas.renderAll()
    })

    canvas.on('mouse:up', _ => write())
    canvas.freeDrawingBrush.color = '#ffffff'
    canvas.freeDrawingBrush.width = 5
  })

  const debouncedWrite = debounce(write, 2000, true)

  async function write() {
    console.log('writing...')

    const svgFile: TFile | null =
      app.vault.getFiles().find(file => file.path === source) ?? null

    if (!svgFile) return

    await app.vault.process(svgFile, _ => canvas.toSVG())
  }
</script>

<div bind:this={container}>
  <div class="toolbar">
    <button
      on:click={() => {
        if (!canvas) return
        canvas.isDrawingMode = !canvas.isDrawingMode
      }}>Toggle Drawing</button
    >
    <button on:click={() => canvas.setWidth(container.offsetWidth)}
      >reset width</button
    >
  </div>
  <canvas {height} bind:this={canvasEl} />
  <div
    bind:this={resizer}
    class="resizer"
    class:taller={Platform.isMobile || Platform.isMobileApp}
  />
</div>

<style>
  canvas {
    border: 1px solid red;
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
    height: 20px;
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
  }
</style>
