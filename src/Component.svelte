<script>
  import { tweened } from "svelte/motion"
  import { expoOut } from "svelte/easing"
  import Log from "./Log.svelte"
  import {log} from './stores/log.store'

  /** @type {Path2D} */
  const thing = new Path2D()
  /** @type {{d: string}[]} */
  let paths = []
  /** @type {{d: string} | null} */
  let currentPath

  let scale = tweened(1.0, { easing: expoOut })

  let showLog = false

  // TODO: it appears that either `offset` coords or `movement` coords (or both) do not change their scale when the svg's scale changes.
  // TODO: when using pen on iPad, it scrolls instead of continuing to fire PointerEvents.
  // TODO: drawings don't appear until another mouse event happens.

  /** @param event {PointerEvent}*/
  function onPointerDown(event) {
    if (event.pointerType === "pen" || event.pointerType === "mouse") {
      event.preventDefault()
      currentPath = { d: `M${event.offsetX},${event.offsetY}` }
      paths = [...paths, currentPath]
    }
  }

  /**
   * `event.pointerType` can be 'mouse' | 'touch' | 'pen'
   * @param event {PointerEvent}
   */
  function onPointerMove(event) {
    //event.preventDefault()
    if (event.pointerType === "pen" || event.pointerType === "mouse") {
      event.preventDefault()
      if (currentPath) {
        log(event)
        currentPath.d += `l${event.movementX},${event.movementY}`
      }
    }
  }

  /** @param event {PointerEvent}*/
  function onPointerUp(event) {
    if (event.pointerType === "pen" || event.pointerType === "mouse") {
      currentPath = null
    }
  }

  let previousDistance = 0
  let change = 0

  /** @param event {TouchEvent}*/
  function onTouchMove(event) {
    // on iOS, inputs from apple pencil are turned into touch events for some reason.
    // We don't want any pen inputs firing as touch events, so we suppress it here.
    event.touches.some(touch => log(touch))
    if (event.touches.some(touch => touch.touchType === "stylus")) {
      log("stylus detected")
      event.preventDefault()
    }

    switch (event.touches.length) {
      case 2:
        event.preventDefault()
        const x1 = event.touches[0].screenX,
          y1 = event.touches[0].screenY,
          x2 = event.touches[1].screenX,
          y2 = event.touches[1].screenY
        const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)
        if (previousDistance) {
          change = distance - previousDistance
          $scale = $scale < 0 ? 0 : $scale + change / window.devicePixelRatio
        }
        previousDistance = distance
        return
      default:
    }
  }
</script>

<nav>
  <h1>My Drawing App!</h1>
  <input type="range" min="0" max="2" step="0.000000001" bind:value={$scale} />
  <button on:click={() => showLog = !showLog}>Show Log</button>
</nav>

<svg
  on:touchmove={onTouchMove}
  on:touchend={() => (previousDistance = 0)}
  on:pointermove={onPointerMove}
  on:pointerdown={onPointerDown}
  on:pointerup={onPointerUp}
  width="1000"
  height="1000"
  style="transform: scale({$scale});"
  viewBox="0 0 1000 1000"
  stroke-width="2"
  stroke="#FFFFFF"
  fill="none"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  {#each paths as path (path.d)}
    <path d={path.d} />
  {/each}
</svg>

<Log show={showLog}/>

<style>
  nav {
    display: flex;
    gap: 10px;
    height: 60px;
    align-items: center;
  }
  svg {
    border: 1px solid red;
  }
</style>
