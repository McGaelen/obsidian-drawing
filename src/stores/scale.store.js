import { tweened } from 'svelte/motion'
import { expoOut } from 'svelte/easing'

export const scale = tweened(1.0, { easing: expoOut })
