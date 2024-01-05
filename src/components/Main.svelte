<script>
  import WebCanvas from './web-based/WebCanvas.svelte'
  import Log from './Log.svelte'

  let show_log = $state(false)
</script>

<nav>
  <h1>My Drawing App!</h1>
  <button on:click={() => show_log = !show_log}>Show Log</button>
</nav>

<WebCanvas />

<Log show={show_log} />

<style>
  nav {
    display: flex;
    gap: 10px;
    height: 60px;
    align-items: center;
  }
</style>
