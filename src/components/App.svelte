<script lang="ts">
  import { mount, onDestroy, onMount } from 'svelte'
  import Toolbar from './Toolbar.svelte'
  import Path from './Path.svelte'
  import Resizer from './Resizer.svelte'
  import { pencil } from '../assets/assets'

  let {
    initialSource,
    onchange,
  }: { initialSource: string; onchange: (contents: string) => void } = $props()

  let svgEl: SVGElement
  let svgResizeObs: ResizeObserver
  let currentPath: Path | null = null

  let height = $state(500)
  let currentScale = $state(1)
  let hideCursor = $state(false)

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

    if (initialSource) setSource(initialSource)

    svgResizeObs = new ResizeObserver(_entries => {
      currentScale = 1000 / svgEl.clientWidth
    })
    svgResizeObs.observe(svgEl)
  })

  onDestroy(() => {
    console.log('destroying')
    svgResizeObs.disconnect()
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

<!--   style="left: 50%; translate: -50%; width: 1000px; position: relative;" -->
<div class="obsidian-drawing-markdown-renderer">
  <Toolbar />
  <svg
    bind:this={svgEl}
    viewBox="0 0 1000 {height}"
    style={hideCursor ? 'cursor: none;' : ''}
    onpointerdown={handle(e => {
      if (e.pointerType === 'pen') {
        hideCursor = true
      } else {
        hideCursor = false
      }
      currentPath = mount(Path, {
        target: svgEl,
        props: {
          origin: { x: e.offsetX * currentScale, y: e.offsetY * currentScale },
        },
      })
    })}
    onpointerup={handle(() => {
      currentPath = null
      onchange(svgEl.outerHTML)
    })}
    onpointerleave={handle(() => {
      currentPath = null
    })}
    onpointermove={handle(e => {
      currentPath?.lineTo(e.offsetX * currentScale, e.offsetY * currentScale)
    })}
    stroke-width="3"
    fill="none"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <defs>
      <pattern id="pencil" width="10" height="10">
        <image
          href="https://c1.staticflickr.com/1/182/404542445_61cfc5f1f8_b.jpg"
        />
      </pattern>
    </defs>
  </svg>
  <Resizer bind:height />
</div>

<style>
  svg {
    cursor: crosshair;
    width: 100%;
  }
</style>
