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
import { Flip } from 'gsap/Flip'
import { flushSync } from 'react-dom'

const TOOLBAR_HEIGHT = 90

export function FloatingToolbar(props: {}) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const toolbarRef = useRef<HTMLDivElement | null>(null)
  const topAnchorRef = useRef<HTMLDivElement | null>(null)
  const bottomAnchorRef = useRef<HTMLDivElement | null>(null)

  const [snapPosition, setSnapPosition] = useState<'top' | 'bottom'>('bottom')
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

  function getTopAnchorMidpoint(): number {
    const rect = topAnchorRef.current!.getBoundingClientRect()
    return rect.height / 2
  }

  function getBottomAnchorMidpoint(): number {
    const rect = bottomAnchorRef.current!.getBoundingClientRect()
    return rect.top + rect.height / 2
  }

  useEffect(() => {
    const draggable = new Draggable(toolbarRef.current, {
      type: 'y',
      inertia: true,
      bounds: containerRef.current,
      minimumMovement: 0,
      onDragStart() {
        setDragging(true)
      },
      snap: {
        y: y => {
          setDragging(false)

          const isFromTop = Math.sign(y) > 0

          // Since origin is top-left, we need to calculate the center of the toolbar
          const toolbarMidpoint = isFromTop
            ? y + TOOLBAR_HEIGHT / 2
            : Math.abs(y) + TOOLBAR_HEIGHT / 2
          const topAnchorMidpoint = getTopAnchorMidpoint()
          const bottomAnchorMidpoint = getBottomAnchorMidpoint()
          const actualMidpoint = (bottomAnchorMidpoint - topAnchorMidpoint) / 2
          // console.log({ toolbarMidpoint, actualMidpoint })

          if (isFromTop) {
            if (toolbarMidpoint < actualMidpoint) {
              return 0
            } else {
              return (
                bottomAnchorRef.current!.getBoundingClientRect().top -
                topAnchorRef.current!.getBoundingClientRect().top
              )
            }
          } else {
            if (toolbarMidpoint > actualMidpoint) {
              // Note the negative number
              return (
                -1 *
                (bottomAnchorRef.current!.getBoundingClientRect().top -
                  topAnchorRef.current!.getBoundingClientRect().top)
              )
            } else {
              return 0
            }
          }
        },
      },
      onThrowComplete() {
        const isFromTop = Math.sign(draggable.y) > 0

        // Since origin is top-left, we need to calculate the center of the toolbar
        const toolbarMidpoint = isFromTop
          ? draggable.y + TOOLBAR_HEIGHT / 2
          : Math.abs(draggable.y) + TOOLBAR_HEIGHT / 2
        const topAnchorMidpoint = getTopAnchorMidpoint()
        const bottomAnchorMidpoint = getBottomAnchorMidpoint()
        const actualMidpoint = (bottomAnchorMidpoint - topAnchorMidpoint) / 2
        // console.log({ toolbarMidpoint, actualMidpoint })

        gsap.set(toolbarRef.current, { y: 0 })

        flushSync(() => {
          if (isFromTop) {
            if (toolbarMidpoint < actualMidpoint) {
              setSnapPosition('top')
            } else {
              setSnapPosition('bottom')
            }
          } else {
            if (toolbarMidpoint > actualMidpoint) {
              setSnapPosition('top')
            } else {
              setSnapPosition('bottom')
            }
          }
        })

        draggable.update(false)
      },
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
      />

      <div
        ref={bottomAnchorRef}
        className="oh-floating-toolbar__bottom-anchor sticky bottom-0 w-full flex justify-center"
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
    </div>
  )
}
