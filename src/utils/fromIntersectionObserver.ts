import { Observable } from 'rxjs'

export function fromIntersectionObserver(
  el: Element,
  options?: IntersectionObserverInit,
): Observable<{
  entries: IntersectionObserverEntry[]
  observer: IntersectionObserver
}> {
  return new Observable(subscriber => {
    const resizeObs = new IntersectionObserver(
      (entries, observer) => subscriber.next({ entries, observer }),
      options,
    )
    resizeObs.observe(el)
    return () => {
      resizeObs.disconnect()
    }
  })
}
