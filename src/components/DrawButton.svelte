<script lang="ts">
  import { state } from '../stores/state'
  import { PencilLine } from 'lucide-svelte'
  import paper from 'paper'

  let path: paper.Path | null
  state.registerTool(
    'draw',
    new paper.Tool().on({
      mousedown(e: paper.MouseEvent) {
        path = new paper.Path()
        path.strokeColor = new paper.Color('#ffffff')
        path.strokeWidth = 5
        path.moveTo(e.point)
      },
      mousemove(e: paper.MouseEvent) {
        if (!path) return
        path.lineTo(e.point)
      },
      mouseup(_: paper.MouseEvent) {
        if (!path) return
        path.smooth()
        path = null
      },
    }),
  )
  state.activateTool('draw')
</script>

<button
  class:mod-cta={$state.activeTool === 'draw'}
  on:click={() => state.activateTool('draw')}
>
  <PencilLine />
</button>
