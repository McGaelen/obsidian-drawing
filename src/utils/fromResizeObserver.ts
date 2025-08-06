import { Observable } from 'rxjs'

export function fromResizeObserver(
  el: Element,
  options?: ResizeObserverOptions,
): Observable<{ entries: ResizeObserverEntry[]; observer: ResizeObserver }> {
  return new Observable(subscriber => {
    const resizeObs = new ResizeObserver((entries, observer) =>
      subscriber.next({ entries, observer }),
    )
    resizeObs.observe(el, options)
    return () => {
      resizeObs.disconnect()
    }
  })
}
