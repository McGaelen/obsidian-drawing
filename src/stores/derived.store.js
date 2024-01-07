import counter from './counter.store'

let doubled = $derived(counter.value * 2)

export default {
  get value() {
    return doubled
  },
}
