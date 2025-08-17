import { Draggable } from 'gsap/Draggable'
import { useCallback, useContext, useRef, useState } from 'react'
import {
  ArrowDownToolbarItem,
  ArrowLeftToolbarItem,
  ArrowRightToolbarItem,
  ArrowToolbarItem,
  ArrowUpToolbarItem,
  AssetToolbarItem,
  CheckBoxToolbarItem,
  CloudToolbarItem,
  DefaultToolbar,
  DiamondToolbarItem,
  DrawToolbarItem,
  EllipseToolbarItem,
  EraserToolbarItem,
  FrameToolbarItem,
  HeartToolbarItem,
  HexagonToolbarItem,
  HighlightToolbarItem,
  LaserToolbarItem,
  LineToolbarItem,
  MobileStylePanel,
  NoteToolbarItem,
  OvalToolbarItem,
  RectangleToolbarItem,
  RhombusToolbarItem,
  SelectToolbarItem,
  StarToolbarItem,
  TextToolbarItem,
  TriangleToolbarItem,
  XBoxToolbarItem,
} from 'tldraw'
import { CanvasSizerContext } from '../CanvasSizer'

export function FloatingToolbar(props: {}) {
  const sizerRef = useContext(CanvasSizerContext)

  const handleRef = useCallback((div: HTMLDivElement) => {
    const draggable = new Draggable(div, {
      type: 'y',
      inertia: true,
      bounds: sizerRef.current,
      minimumMovement: 0,
      snap: {
        y: xVal => {
          // TODO: use InFrontOfCanvas for this instead since theres some weird overlap with the CanvasSizer
          const rect = sizerRef.current!.getBoundingClientRect()
          const midpoint = rect.height / 2

          if (Math.sign(xVal) === 1 || Math.abs(xVal) <= midpoint) {
            return 0
          } else {
            return -rect.height + 40
          }
        },
      },
    })

    return () => {
      draggable.kill()
    }
  }, [])

  return (
    <div
      ref={handleRef}
      className="oh-toolbar w-fit h-fit overflow-auto absolute bg-(--background-secondary) rounded-[11px] border border-(--divider-color)"
      style={{
        filter: 'drop-shadow(rgba(0, 0, 0, 0.5) 0px 6px 20px)',
        pointerEvents: 'all',
      }}
    >
      <DefaultToolbar {...props}>
        <MobileStylePanel />
        <SelectToolbarItem />
        {/*<HandToolbarItem />*/}
        <DrawToolbarItem />
        <EraserToolbarItem />
        <ArrowToolbarItem />
        <TextToolbarItem />
        <NoteToolbarItem />
        <AssetToolbarItem />

        <RectangleToolbarItem />
        <EllipseToolbarItem />
        <TriangleToolbarItem />
        <DiamondToolbarItem />

        <HexagonToolbarItem />
        <OvalToolbarItem />
        <RhombusToolbarItem />
        <StarToolbarItem />

        <CloudToolbarItem />
        <HeartToolbarItem />
        <XBoxToolbarItem />
        <CheckBoxToolbarItem />

        <ArrowLeftToolbarItem />
        <ArrowUpToolbarItem />
        <ArrowDownToolbarItem />
        <ArrowRightToolbarItem />

        <LineToolbarItem />
        <HighlightToolbarItem />
        <LaserToolbarItem />
        <FrameToolbarItem />
      </DefaultToolbar>
    </div>
  )
}
