<script>
  import { writable } from 'svelte/store'
  import Path from './Path.svelte'
  import { scale } from '../../stores/scale.store'

  /** @type SVGElement */
  let svg
  /** @type {Path | null} */
  let currentPath = null
  /** @type {import('svelte/store').Writable<[number, number]>}*/
  let origin = writable([0, 0])

  // TODO: When viewBox and width/height are different, the offsetX/Y property doesn't work correctly.
  // TODO: Origin for pinch-to-zoom doesn't work correctly. It zooms the svg, but not at the center of the touch points.

  /** @param event {PointerEvent}*/
  function onPointerDown(event) {
    if (event.pointerType === 'pen' || event.pointerType === 'mouse') {
      event.preventDefault()
      currentPath = new Path({
          target: svg,
          props: {
            origin: { x: event.offsetX, y: event.offsetY },
          },
        },
      )
    }
  }

  /**
   * `event.pointerType` can be 'mouse' | 'touch' | 'pen'
   * @param event {PointerEvent}
   */
  function onPointerMove(event) {
    if (event.pointerType === 'pen' || event.pointerType === 'mouse') {
      event.preventDefault()

      if (currentPath) {
        currentPath.lineTo(event.offsetX, event.offsetY)
      }
    }
  }

  /** @param event {PointerEvent}*/
  function onPointerUp(event) {
    if (event.pointerType === 'pen' || event.pointerType === 'mouse') {
      currentPath = null
    }
  }

  let previousDistance = 0
  let change = 0

  /** @param event {TouchEvent}*/
  function onTouchMove(event) {
    // on iOS, inputs from apple pencil are turned into touch events for some reason.
    // We don't want any pen inputs firing as touch events, so we suppress it here.
    // Also... `event.touches` is not a standard array for some reason???? So, have to do for loop instead of `some()`.
    for (const touch of event.touches) {
      if (touch.touchType === 'stylus') {
        event.preventDefault()
      }
    }

    switch (event.touches.length) {
      case 2:
        event.preventDefault()
        const x1 = event.touches[0].screenX,
          y1 = event.touches[0].screenY,
          x2 = event.touches[1].screenX,
          y2 = event.touches[1].screenY

        const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)

        origin.set([
          ((x2 - x1) / 2) + 1,
          ((y2 - y1) / 2) + 1,
        ])

        if (previousDistance) {
          change = distance - previousDistance
          $scale = $scale < 0.5 ? 0.5 : $scale + change * 0.01
        }
        previousDistance = distance
        return
      default:
    }
  }
</script>

<svg
  bind:this={svg}
  on:touchmove={onTouchMove}
  on:touchend={() => (previousDistance = 0)}
  on:pointermove={onPointerMove}
  on:pointerdown={onPointerDown}
  on:pointerup={onPointerUp}
  width='1000'
  height='1000'
  viewBox='0 0 1000 1000'
  style='transform: scale({$scale}); transform-origin: {$origin[0]}px {$origin[1]}px'
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
