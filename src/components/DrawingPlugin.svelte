<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import { type App, debounce, Platform } from "obsidian";
  import interact from "interactjs";
  import { fabric } from "fabric";

  export let app: App
  export let source: string

  const dispatch = createEventDispatcher()

  let canvasEl: HTMLCanvasElement
  let canvas: fabric.Canvas
  let resizer: HTMLDivElement

  let height = 500

  export function get_height() {
    return height
  }

  $: if (canvas) {
    canvas.setHeight(height)
    dispatch('heightChange', height)
  }

  onMount(() => {

    const saved_svg = new DOMParser()
      .parseFromString(source, 'image/svg+xml')
      .querySelector('svg')

    const saved_height = saved_svg?.getAttribute('height')
    height = saved_height ? parseInt(saved_height) : height
    dispatch('heightChange', height)

    interact(resizer).draggable({
      listeners: {
        move(e) {
          height += e.dy
        }
      }
    })

    canvas = new fabric.Canvas(canvasEl, {
      isDrawingMode: true,
      freeDrawingCursor: 'crosshair',
    })

    fabric.loadSVGFromString(source, (results, options) => {
      const obj = fabric.util.groupSVGElements(results, options);
      // console.log({results, options})
      canvas.add(obj).renderAll();
    })

    canvas.on('mouse:up', _ => write())

    canvas.freeDrawingBrush.color = '#ffffff'
    canvas.freeDrawingBrush.width = 5
  })

  const debouncedWrite = debounce(write, 2000, true)

  async function write() {
    console.log('writing...')
    const file = app.workspace.getActiveFile()!

    await app.vault.process(file, content => {
      const start_idx = content.indexOf("```drawing") + 10 // plus length of ```drawing
      const end_idx = content.indexOf("```", start_idx)

      const ary = Array.from(content)
      const svg_text = canvas.toSVG().replaceAll('\n', '')
      ary.splice(start_idx, end_idx - start_idx, '\n', svg_text, '\n')

      return ary.join('')
    })
  }
</script>

<div >
  {#key source}
  <div class="toolbar">
    <button on:click={() => {
      if (!canvas) return
      canvas.isDrawingMode = !canvas.isDrawingMode
    }}>Toggle Drawing</button>
    <button on:click={() => {
      console.log('hello')
      write()
    }}>Save</button>
  </div>
    {/key}
  <canvas
    {height}
    bind:this={canvasEl}
  />
<div bind:this={resizer} class="resizer" class:taller={Platform.isMobile || Platform.isMobileApp}/>
</div>

<style>
  canvas {
    width: 100% !important;
    /*width: -webkit-fill-available;*/
  }

  .resizer {
    transition: all;
    transition-duration: 200ms;
    height: 5px;
    background-color: var(--divider-color);
    border-bottom-left-radius: var(--radius-s);
    border-bottom-right-radius: var(--radius-s);
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
    top: 0;
    left: 0;
    z-index: 999999;
  }
</style>
