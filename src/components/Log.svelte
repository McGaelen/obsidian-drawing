<script lang='ts'>
  /**
   * Why does this component exist? Because I can't see dev tools on an iPad because I don't have a Mac.
   * It's janky, but it works, and it's only a development tool.
   */
  import log from '../stores/log.store'

  let { show = false } = $props()

  let div: HTMLDivElement
  let mutObs = new MutationObserver(scroll)

  $effect(() => {
    if (show) {
      mutObs.observe(div, { childList: true })
      scroll()
    } else {
      mutObs.disconnect()
    }
  })

  function scroll() {
    div.scrollTop = div.scrollHeight
  }
</script>

{#if show}
  <div bind:this={div}>
    {#each log.lines as text}
      <code>{@html text}</code>
    {/each}
  </div>
{/if}

<style>
  div {
    position: sticky;
    bottom: 0;
    height: 300px;
    overflow-y: scroll;
    border-top: 3px solid #595959;
    width: 100%;
    background-color: #2c2c2c;
  }

  code {
    padding-top: 10px;
    padding-bottom: 10px;
    display: block;
    border-top: 1px solid rgb(128, 128, 128);
  }

  code:hover {
    background-color: #595959;
  }
</style>
