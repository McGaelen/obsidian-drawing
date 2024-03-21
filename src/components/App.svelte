<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte'
  import Toolbar from './Toolbar.svelte'
  import Path from './Path.svelte'
  import Resizer from './Resizer.svelte'

  const dispatch = createEventDispatcher()

  let svgEl: SVGElement
  let height = 500
  let currentPath: Path | null = null
  let penCoords: { x: number; y: number; pressure: number } | null = null

  onMount(() => {
    /**
     * WARNING!!!!! WEIRD AND STUPID THINGS LIE AHEAD!!!!!
     * DO NOT READ if you are allergic to browser-specific bugs like I am.
     * Yes, we are _forced_ to add these listeners here using Vanilla JS.
     * Why, you ask? No idea. It's the only way to make Safari work.
     * Otherwise, on iPad with an Apple Pencil, the pointer events will stop emitting
     * and be replaced by touch events (which then scrolls the page if you don't preventDefault().)
     * It's like the listeners aren't even being set correctly? Could be a bug with Svelte 5.
     * But why only these events and not others?
     */
    svgEl.addEventListener('touchstart', handle_touch)
    svgEl.addEventListener('touchmove', handle_touch)
    /** END WEIRD AND STUPID ZONE */
  })

  export function getSource(): string {
    return svgEl.outerHTML
  }

  export function setSource(source: string) {
    const saved_svg = new DOMParser()
      .parseFromString(source, 'image/svg+xml')
      .querySelector('svg')

    const saved_height = saved_svg?.getAttribute('height')
    height = saved_height ? parseInt(saved_height) : height

    if (saved_svg) {
      svgEl.innerHTML = saved_svg.innerHTML
    }
  }

  function write() {
    console.log('writing...')
    dispatch('save', svgEl.outerHTML)
  }

  function handle(
    handler?: (e: PointerEvent) => void,
  ): (e: PointerEvent) => void {
    return e => {
      if (e.pointerType === 'pen' || e.pointerType === 'mouse') {
        e.preventDefault()
        handler?.(e)
      }
    }
  }

  function handle_touch(e: TouchEvent) {
    for (const touch of e.touches) {
      if (touch.touchType === 'stylus') {
        e.preventDefault()
      }
    }
  }
</script>

<div>
  <Toolbar />
  <svg
    {height}
    bind:this={svgEl}
    on:pointerdown={handle(e => {
      penCoords = { x: e.offsetX, y: e.offsetY, pressure: e.pressure }
      currentPath = new Path({
        target: svgEl,
        props: { origin: { x: penCoords.x, y: penCoords.y } },
      })
    })}
    on:pointerup={handle(() => {
      currentPath = null
      write()
    })}
    on:pointerleave={handle(() => (currentPath = null))}
    on:pointermove={handle(e => {
      penCoords = { x: e.offsetX, y: e.offsetY, pressure: e.pressure }
      currentPath?.lineTo(penCoords.x, penCoords.y)
    })}
    stroke-width="3"
    stroke="#FFFFFF"
    fill="none"
    stroke-linecap="round"
    stroke-linejoin="round"
  />
  <Resizer bind:height />
</div>

<style>
  svg {
    cursor: crosshair;
    width: 100%;
  }
</style>
