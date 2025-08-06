import { Observable } from 'rxjs'

export function fromMutationObserver(
  el: Element,
  options?: MutationObserverInit,
): Observable<{ mutations: MutationRecord[]; observer: MutationObserver }> {
  return new Observable(subscriber => {
    const mutObs = new MutationObserver((mutations, observer) =>
      subscriber.next({ mutations, observer }),
    )
    mutObs.observe(el, options)
    return () => {
      mutObs.disconnect()
    }
  })
}
