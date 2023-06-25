<script>
  import Log from './Log.svelte'
  import WebCanvas from './web-based/WebCanvas.svelte'
  import { scale } from '../stores/scale.store'
  import RustCanvas from './rust-based/RustCanvas.svelte'
  import {Notice} from 'obsidian'
  let showLog = false
</script>

<nav>
  <h1>My Drawing App!</h1>
  <input type='range' min='0' max='2' step='0.000000001' bind:value={$scale} />
  <button on:click={() => showLog = !showLog}>Show Log</button>
</nav>

<!-- <WebCanvas /> -->
<RustCanvas />

<Log show={showLog} />

<style>
  nav {
    display: flex;
    gap: 10px;
    height: 60px;
    align-items: center;
  }
</style>
