import { Draggable } from 'gsap/Draggable'
import { useEffect, useRef, useState } from 'react'
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
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'

const TOOLBAR_HEIGHT = 90

export function FloatingToolbar(props: {}) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const toolbarRef = useRef<HTMLDivElement | null>(null)
  const topAnchorRef = useRef<HTMLDivElement | null>(null)
  const bottomAnchorRef = useRef<HTMLDivElement | null>(null)

  const [snapPosition, setSnapPosition] = useState<'top' | 'bottom'>('top')
  const [isDragging, setDragging] = useState(false)

  useGSAP(
    () => {
      // Animate the toolbar being "picked up" when dragging it
      if (isDragging) {
        gsap.to(toolbarRef.current, {
          scale: 1.05,
          boxShadow: 'rgba(0, 0, 0, 0.5) 0px 0px 40px',
          duration: 0.3,
        })
      } else {
        gsap.to(toolbarRef.current, {
          scale: 1,
          boxShadow: 'rgba(0, 0, 0, 0.3) 0px 0px 20px',
          duration: 0.3,
        })
      }
    },
    { dependencies: [isDragging] },
  )

  useEffect(() => {
    if (snapPosition === 'top') {
      toolbarRef.current!.remove()
      topAnchorRef.current!.appendChild(toolbarRef.current!)
    } else {
      toolbarRef.current!.remove()
      bottomAnchorRef.current!.appendChild(toolbarRef.current!)
    }
  }, [snapPosition])

  useEffect(() => {
    const draggable = new Draggable(toolbarRef.current, {
      type: 'y',
      // inertia: true,
      bounds: containerRef.current,
      minimumMovement: 0,
      onDragStart: () => {
        // console.log(toolbarRef.current?.offsetTop)
        // gsap.set(toolbarRef.current, { top: toolbarRef.current!.offsetTop })
        // draggable.update(false)
        setDragging(true)
      },
      onDragEnd() {
        setDragging(false)
        // const flipState = Flip.getState(toolbarRef.current)

        // Since origin is top-left, we need to calculate the center of the toolbar
        const y_at_center = draggable.y + TOOLBAR_HEIGHT / 2

        // Then get the midpoint of the entire container div (in front of the entire canvas)
        const rect = containerRef.current!.getBoundingClientRect()
        const midpoint = rect.height / 2

        if (y_at_center < midpoint) {
          setSnapPosition('top')
          // gsap.to(toolbarRef.current, { top: 0 })
          // return 0 // Snap to top
        } else {
          setSnapPosition('bottom')
          // gsap.to(toolbarRef.current, { top: rect.height - TOOLBAR_HEIGHT })
          // return rect.height - TOOLBAR_HEIGHT // Snap to bottom, accounting for the height of the toolbar
        }
        draggable.update(false)
        gsap.set(toolbarRef.current, { y: 0 })

        // Flip.from(flipState, { duration: 1, ease: 'power1.inOut' })
      },
      onThrowComplete() {},
      // snap: {
      //   y: y => {
      //     // Since origin is top-left, we need to calculate the center of the toolbar
      //     const y_at_center = y + TOOLBAR_HEIGHT / 2
      //
      //     // Then get the midpoint of the entire container div (in front of the entire canvas)
      //     const rect = containerRef.current!.getBoundingClientRect()
      //     const midpoint = rect.height / 2
      //
      //     if (y_at_center < midpoint) {
      //       return topAnchorRef.current!.clientTop // Snap to top
      //     } else {
      //       return bottomAnchorRef.current!.clientTop // Snap to bottom, accounting for the height of the toolbar
      //     }
      //   },
      // },
    })

    return () => {
      draggable.kill()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="absolute h-full w-full flex flex-col justify-between pointer-events-none"
    >
      <div
        ref={topAnchorRef}
        className="oh-floating-toolbar__top-anchor sticky top-0 w-full flex justify-center"
        style={{ height: `${TOOLBAR_HEIGHT}px` }}
      >
        <div
          data-flip-id="1"
          ref={toolbarRef}
          className="oh-toolbar w-fit overflow-auto bg-(--background-secondary) rounded-[11px] border border-(--divider-color)"
          style={{
            position: 'relative',
            height: `${TOOLBAR_HEIGHT}px`,
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
      </div>

      <div
        ref={bottomAnchorRef}
        className="oh-floating-toolbar__bottom-anchor sticky bottom-0 w-full flex justify-center"
        style={{ height: `${TOOLBAR_HEIGHT}px` }}
      ></div>
    </div>
  )
}
