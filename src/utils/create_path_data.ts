import { fabric } from 'fabric'

/**
 * Creates a path data string suitable for use on a <path>
 *   @example <path d={create_path_data([...])}>
 *
 *  @see https://github.com/steveruizok/perfect-freehand/blob/main/tutorial/script.md#adding-perfect-freehand
 */
export function create_path_data(stroke: number[][]): fabric.Point[] {
  // const [first, ...rest] = stroke

  // const firstPoint = new fabric.Point(first[0], first[1])
  // firstPoint.

  return stroke.map(([x, y]) => {
    return new fabric.Point(x, y)
  })
}
