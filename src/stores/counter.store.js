let num = $state(0)

export default {
  get value() {
    return num
  },
  increment() {
    num += 1
  },
}
