import { Draggable } from 'gsap/Draggable'
import { useRef } from 'react'
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
import { VelocityTracker } from 'gsap/InertiaPlugin'

const TOOLBAR_HEIGHT = 90
const ANIMATION_PULLUP_DURATION = 0.5
const ANIMATION_SNAP_TO_ANCHOR_DURATION = 0.3

export function FloatingToolbar(props: {}) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const toolbarRef = useRef<HTMLDivElement | null>(null)
  const topAnchorRef = useRef<HTMLDivElement | null>(null)
  const bottomAnchorRef = useRef<HTMLDivElement | null>(null)
  const snapPosition = useRef<'top' | 'bottom'>('bottom')

  useGSAP(
    () => {
      const velocityTracker = VelocityTracker.track(toolbarRef.current, 'y')[0]
      const draggable = new Draggable(toolbarRef.current, {
        type: 'y',
        bounds: containerRef.current,
        minimumMovement: 0,
        onDragStart() {
          // Animate the toolbar being "picked up" by the user's cursor
          gsap.to(toolbarRef.current, {
            scale: 1.05,
            boxShadow: 'rgba(0, 0, 0, 0.5) 0px 0px 40px',
            duration: ANIMATION_PULLUP_DURATION,
          })
        },
        onDragEnd() {
          // Since draggable's coordinate origin is top-left, we need to calculate the centerline of the toolbar.
          // And draggable.y is negative when dragging upwards (north), so take the abs value
          const toolbarCenterline = Math.abs(draggable.y) + TOOLBAR_HEIGHT / 2
          // The midpoint between the topAnchor and bottomAnchor.
          // This can change depending on the user's scroll position in the markdown document, since the anchors use position: sticky.
          const actualMidpoint =
            (getBottomAnchorTopEdge() - getTopAnchorBottomEdge()) / 2
          // The current velocity of the toolbar caused by the user's drag.
          // This can't be an absolute value.
          const velocity = velocityTracker.get('y')

          // Grab the current state of the toolbar for FLIPing
          const state = Flip.getState(toolbarRef.current)

          // If the drag ended quickly (while the tween in onDragStart is running), then cancel it before we do anything animation-wise
          gsap.killTweensOf(toolbarRef.current)
          // Start undoing the scale
          gsap.to(toolbarRef.current, {
            scale: 1,
            boxShadow: 'rgba(0, 0, 0, 0.3) 0px 0px 20px',
            duration: ANIMATION_PULLUP_DURATION,
          })
          // Since we're about to re-parent the toolbar, we need to set it back to 0, otherwise the
          // FLIP will have a massive offset from where it's supposed to end up.
          gsap.set(toolbarRef.current, { y: 0 })

          // Now we can actually figure out whether to move the toolbar into the other anchor.
          // console.log({ toolbarCenterline, actualMidpoint, velocity })
          if (
            // toolbarCenterline is an absolute value, so check if we went farther away from the current anchor than the midpoint is
            toolbarCenterline > actualMidpoint ||
            // Check if the velocity in a direction is greater than 500.
            // We can just use velocity as an absolute value because the user could drag _in the opposite direction_
            // of the anchor they're trying to reach, and it will still swap anchors.
            (snapPosition.current === 'top' && velocity > 500) ||
            (snapPosition.current === 'bottom' && velocity < -500)
          ) {
            toggleSnapPosition()
          }

          // Now that the toolbar has been re-parented, animate it starting from the
          // point where the user released the mouse to its new anchor.
          Flip.from(state, {
            duration: ANIMATION_SNAP_TO_ANCHOR_DURATION,
            ease: 'back.out(1)',
            onComplete() {
              // After this FLIP completes, the scale will immediately reset to 1.05x,
              // because we capture the state after the drag has already been started,
              // and the "pull-up" animation has already run.
              // SO, if the user didn't start another drag already, then we manually set scale to 1 again.
              // This doesn't seem to cause any flickering or jittering to me; the element just looks like it was never touched.
              if (
                !Flip.isFlipping(toolbarRef.current) &&
                !draggable.isDragging
              ) {
                gsap.set(toolbarRef.current, { scale: 1 })
              }
            },
          })
        },
      })

      return () => {
        draggable.kill()
      }
    },
    { dependencies: [] },
  )

  function getTopAnchorBottomEdge(): number {
    const rect = topAnchorRef.current!.getBoundingClientRect()
    return rect.height
  }

  function getBottomAnchorTopEdge(): number {
    const rect = bottomAnchorRef.current!.getBoundingClientRect()
    return rect.top
  }

  function toggleSnapPosition() {
    if (snapPosition.current === 'bottom') {
      snapPosition.current = 'top'
      toolbarRef.current!.remove()
      topAnchorRef.current!.appendChild(toolbarRef.current!)
    } else {
      snapPosition.current = 'bottom'
      toolbarRef.current!.remove()
      bottomAnchorRef.current!.appendChild(toolbarRef.current!)
    }
  }

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
