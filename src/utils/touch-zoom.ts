// import { scale } from '../stores/scale.store'

let previousDistance = 0
let change = 0

function onTouchMove(event: TouchEvent) {
  // on iOS, inputs from apple pencil are turned into touch events for some reason.
  // We don't want any pen inputs firing as touch events, so we suppress it here.
  // Also... `event.touches` is not a standard array for some reason???? So, have to do for loop instead of `some()`.
  // for (const touch of event.touches) {
  //   if (touch.touchType === 'stylus') {
  //     event.preventDefault()
  //   }
  // }

  if (event.touches.length === 2) {
    event.preventDefault()
    const x1 = event.touches[0].screenX,
      y1 = event.touches[0].screenY,
      x2 = event.touches[1].screenX,
      y2 = event.touches[1].screenY

    const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)

    // origin = [
    //   ((x2 - x1) / 2) + 1,
    //   ((y2 - y1) / 2) + 1,
    // ]

    if (previousDistance) {
      change = distance - previousDistance
      // $scale = $scale < 0.5 ? 0.5 : $scale + change * 0.01
    }
    previousDistance = distance
    return
  }
}
