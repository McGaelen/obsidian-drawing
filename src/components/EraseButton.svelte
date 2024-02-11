<script lang="ts">
  import { state } from '../stores/state'
  import { Eraser } from 'lucide-svelte'
  import paper from 'paper'

  let isErasing = false
  state.registerTool(
    'erase',
    new paper.Tool().on({
      mousedown(e: paper.MouseEvent) {
        isErasing = true
      },
      mousemove(e: paper.MouseEvent) {
        if (!isErasing) return
        // @ts-expect-error the types are lying, `item` actually does exist (it's just nullable)
        e.item?.remove()
      },
      mouseup(e: paper.MouseEvent) {
        isErasing = false
      },
    }),
  )
</script>

<button
  class:mod-cta={$state.activeTool === 'erase'}
  on:click={() => state.activateTool('erase')}><Eraser /></button
>
