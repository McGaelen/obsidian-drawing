<script lang='ts'>
  import { getStroke } from 'perfect-freehand'
  import { create_path_data } from '../../utils/create_path_data'
  import { onMount } from 'svelte'

  type InputPoint = { x: number, y: number, pressure?: number }

  let svg: SVGElement
  let pen_coords: InputPoint | null = $state(null)
  let is_drawing = $state(false)
  let current_path: SVGPathElement | null = null

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
      current_path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
      current_path.style.fill = '#ffffff'
      svg.appendChild(current_path)
    }

    const points: InputPoint[] = []
    // This effect should run everytime the pen moves, but only while drawing
    $effect(() => {
      if (!pen_coords) return

      points.push(pen_coords)

      const path_data = create_path_data(getStroke(points, {
        simulatePressure: false,
        size: 5,
        smoothing: 0.5,
        streamline: 0.4,
      }))

      current_path?.setAttribute('d', path_data)
    })
  })

  function handle(handler?: (e: PointerEvent) => void): (e: PointerEvent) => void {
    return (e) => {
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
  bind:this={svg}
  on:pointerdown={handle((e) => {
    pen_coords = {x: e.offsetX, y: e.offsetY, pressure: e.pressure}
    is_drawing = true
  })}
  on:pointerup={handle(() => is_drawing = false)}
  on:pointerleave={handle(() => is_drawing = false)}
  on:pointermove={handle((e) => {
    pen_coords = {x: e.offsetX, y: e.offsetY, pressure: e.pressure}
  })}
  width='1000'
  height='1000'
  viewBox='0 0 1000 1000'
  style='transform: scale(1.0)'
  stroke-width='2'
  stroke='#FFFFFF'
  fill='none'
  stroke-linecap='round'
  stroke-linejoin='round'
/>

<style>
  svg {
    border: 1px solid red;
  }
</style>
