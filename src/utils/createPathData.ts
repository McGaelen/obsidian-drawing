import { fabric } from 'fabric'

/**
 * Creates a path data string suitable for use on a <path>
 *   @example <path d={create_path_data([...])}>
 *
 *  @see https://github.com/steveruizok/perfect-freehand/blob/main/tutorial/script.md#adding-perfect-freehand
 */
export function createPathData(stroke: number[][]): string {
  const [first, ...rest] = stroke
  return ['M', first, 'L', rest].join(' ')
}
