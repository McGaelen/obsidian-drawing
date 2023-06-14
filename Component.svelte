<script lang="ts">
  import {Modal, Notice} from "obsidian";

  export let variable: number;
  let text: string = ''

  $: new Notice(`new text: ${text}`)
</script>

<div class="number">
  <span>My number is {variable}!</span>
</div>

<button on:click={() => new Notice('hi there from svelte!!!!!!!!!!!')}>click me</button>
<button on:click={() => new Modal()}>modal</button>

<input bind:value={text}>

<style>
  .number {
    color: red;
  }
</style>
