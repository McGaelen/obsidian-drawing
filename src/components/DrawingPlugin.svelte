<script lang="ts">
  import { getStroke } from 'perfect-freehand'
  import { create_path_data } from '../utils/create_path_data'
  import { onMount } from 'svelte'
  import { type App, debounce } from 'obsidian'
  import interact from 'interactjs'

  type InputPoint = { x: number; y: number; pressure?: number }

  const { app, source } = $props<{ app: App; source: string }>()

  let svg: SVGElement
  let resizer: HTMLDivElement
  let pen_coords: InputPoint | null = $state(null)
  let is_drawing = $state(false)
  let current_path: SVGPathElement | null = null
  let height = $state(500)

  onMount(() => {
    const saved_svg = new DOMParser()
      .parseFromString(source, 'image/svg+xml')
      .querySelector('svg')

    if (saved_svg) {
      for (const attr of saved_svg.getAttributeNames()) {
        svg.setAttr(attr, saved_svg.getAttribute(attr))
      }

      svg.innerHTML = saved_svg.innerHTML
    }

    const saved_height = svg.getAttribute('height')
    height = saved_height ? parseInt(saved_height) : height

    interact(resizer).draggable({
      listeners: {
        move(e) {
          height += e.dy
        }
      }
    })

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
    svg.addEventListener('touchstart', handle_touch)
    svg.addEventListener('touchmove', handle_touch)
    /** END WEIRD AND STUPID ZONE */
  })

  // This effect should run everytime the pen starts touching the screen
  $effect(() => {
    if (!is_drawing) {
      current_path = null
      return
    }

    if (!current_path) {
      current_path = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'path',
      )
      current_path.style.fill = '#ffffff'
      svg.appendChild(current_path)
    }

    const points: InputPoint[] = []
    // This effect should run everytime the pen moves, but only while drawing
    $effect(async () => {
      if (!pen_coords) return

      points.push(pen_coords)

      const path_data = create_path_data(
        getStroke(points, {
          simulatePressure: false,
          size: 5,
          smoothing: 0.5,
          streamline: 0.4,
        }),
      )

      current_path?.setAttribute('d', path_data)

      debouncedWrite()
    })
  })

  const debouncedWrite = debounce(async () => {
    if (is_drawing) return

    const file = app.workspace.getActiveFile()!

    await app.vault.process(file, content => {
      const start_idx = content.indexOf("```drawing") + 10 // plus length of ```drawing
      const end_idx = content.indexOf("```", start_idx)

      const ary = Array.from(content)
      ary.splice(start_idx, end_idx - start_idx, '\n', svg.outerHTML, '\n')

      return ary.join('')
    })
  }, 2000, true)

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

<svg
  {height}
  bind:this={svg}
  on:pointerdown={handle(e => {
    pen_coords = { x: e.offsetX, y: e.offsetY, pressure: e.pressure }
    is_drawing = true
  })}
  on:pointerup={handle(() => {
    is_drawing = false
    debouncedWrite()
  })}
  on:pointerleave={handle(() => (is_drawing = false))}
  on:pointermove={handle(e => {
    pen_coords = { x: e.offsetX, y: e.offsetY, pressure: e.pressure }
  })}
/>

<div bind:this={resizer} class="resizer"/>


<style>
  svg {
    width: -webkit-fill-available;
  }

  :global(.block-language-drawing) {
    cursor: crosshair !important;
  }

  .resizer {
    transition: all;
    transition-duration: 200ms;
    height: 5px;
    background-color: var(--divider-color);
    border-bottom-left-radius: var(--radius-s);
    border-bottom-right-radius: var(--radius-s);
    cursor: row-resize !important;
  }

  .resizer:hover {
    background-color: var(--interactive-accent);
  }
</style>
