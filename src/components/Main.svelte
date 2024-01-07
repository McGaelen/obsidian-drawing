<script>
  import WebCanvas from './web-based/WebCanvas.svelte'
  import Log from './Log.svelte'
  import counter from '../stores/counter.store'
  import doubled from '../stores/derived.store'

  let show_log = $state(false)
</script>

<nav>
  <h1>My Drawing App!</h1>
  <button on:click={() => show_log = !show_log}>Show Log</button>
</nav>

<span>Counter Value: <code>{counter.value}</code></span>
<span>Doubled Value: <code>{doubled.value}</code></span>
<button on:click={() => counter.increment()}>Increment</button>

<WebCanvas />

<Log show={show_log} />

<style>
  nav {
    position: sticky;
    top: 0;
    left: 0;
    display: flex;
    gap: 10px;
    height: 60px;
    align-items: center;
  }
</style>
