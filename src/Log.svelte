<script>
  import { log } from './stores/log.store'

  export let show = false

  /** @type HTMLDivElement */
  let div
  /** @type MutationObserver */
  let mutObs = new MutationObserver(scroll)

  $: if (show && div) {
    mutObs.observe(div, { childList: true })
    scroll()
  } else {
    mutObs.disconnect()
  }

  function scroll() {
    div.scrollTop = div.scrollHeight
  }
</script>

{#if show}
  <div bind:this={div}>
    {#each $log as text}
      <code>{text}</code>
    {/each}
  </div>
{/if}

<style>
  div {
    position: fixed;
    bottom: 0;
    height: 300px;
    overflow-y: scroll;
    border-top: 3px solid #595959;
    width: 100%;
  }

  code {
    display: block;
    border-top: 2px solid gray;
  }

  code:hover {
    background-color: #2c2c2c;
  }
</style>
