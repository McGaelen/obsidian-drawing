<script lang="ts">
  import { Platform } from 'obsidian'
  import { onMount } from 'svelte'
  import interact from 'interactjs'

  let { height = $bindable() }: { height: number } = $props()

  let resizer: HTMLDivElement

  onMount(() => {
    interact(resizer).draggable({
      listeners: {
        move(e) {
          height += e.dy
        },
      },
    })
  })
</script>

<div
  bind:this={resizer}
  class="resizer"
  class:taller={Platform.isMobile || Platform.isMobileApp}
></div>

<style>
  .resizer {
    transition: all;
    transition-duration: 200ms;
    height: 5px;
    background-color: var(--divider-color);
    border-radius: var(--radius-s);
    cursor: row-resize !important;
    touch-action: none;
  }

  .resizer.taller {
    height: 15px;
  }

  .resizer:hover {
    background-color: var(--interactive-accent);
  }
</style>
