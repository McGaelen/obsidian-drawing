<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte'
  import paper from 'paper'
  import { state } from '../stores/state'
  import Resizer from './Resizer.svelte'
  import Toolbar from './Toolbar.svelte'
  import { flatMapDeep } from 'lodash-es'

  export let source: string

  const dispatch = createEventDispatcher()

  let canvasEl: HTMLCanvasElement
  let height = 500

  onMount(() => {
    const saved_svg = new DOMParser()
      .parseFromString(source, 'image/svg+xml')
      .querySelector('svg')

    const saved_height = saved_svg?.getAttribute('height')
    height = saved_height ? parseInt(saved_height) : height

    state.init(canvasEl)

    if (saved_svg) {
      const item = paper.project.importSVG(saved_svg, { insert: false })
      flatMapDeep(item.children, val => val.children).forEach(item =>
        item?.addTo(paper.project),
      )
    }
  })

  function write() {
    console.log('writing...')
    dispatch(
      'save',
      paper.project.exportSVG({
        asString: true,
      }),
    )
  }
</script>

<div>
  <Toolbar />
  <canvas {height} bind:this={canvasEl} on:pointerup={write} />
  <Resizer bind:height />
</div>

<style>
  canvas {
    border: 1px solid var(--divider-color);
    cursor: crosshair;
    width: 100%;
  }
</style>
