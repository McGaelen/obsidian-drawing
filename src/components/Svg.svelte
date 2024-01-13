<script lang='ts'>
  import { onMount } from 'svelte'

  let { 'svg-str': svg_str, children, ...restProps } = $props<{ 'svg-str'?: string } & SVGElement>()

  let svg: SVGElement

  $effect(() => {
    // if (!svg_str) {
    //   svg_str = `<svg
    //     class='drawing-plugin'
    //     height='1000'
    //     viewBox='0 0 1000 1000'
    //     style='transform: scale(1.0)'
    //     stroke-width='2'
    //     stroke='#FFFFFF'
    //     fill='none'
    //     stroke-linecap='round'
    //     stroke-linejoin='round'></svg>`
    // }

    const innerSvg = svg_str?.replace(/<svg(.*)>/, '').replace(/<\/svg>/, '') || '';
    console.log({innerSvg})

    svg.innerHTML = innerSvg
    svg.addEventListener('touchstart', handle_touch)
    svg.addEventListener('touchmove', handle_touch)
  })

  function handle_touch(e: TouchEvent) {
    for (const touch of e.touches) {
      if (touch.touchType === 'stylus') {
        e.preventDefault()
      }
    }
  }
</script>

<svg bind:this={svg} {...restProps} />

<style>
  svg {
    border: 1px solid red;
    width: -webkit-fill-available;
  }
</style>