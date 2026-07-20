import { CursorDragType, CursorStatus, TreeNode } from '@designable-next/core'
import { LayoutObserver } from '@designable-next/shared'
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react'
import { useDesigner } from './useDesigner'
import { useViewport } from './useViewport'

const isEqualRect = (rect1: DOMRect, rect2: DOMRect) => {
  return (
    rect1?.x === rect2?.x &&
    rect1?.y === rect2?.y &&
    rect1?.width === rect2?.width &&
    rect1?.height === rect2?.height
  )
}

export const useValidNodeOffsetRect = (node: TreeNode) => {
  const engine = useDesigner()
  const viewport = useViewport()
  const [, forceUpdate] = useState(null)
  const rectRef = useMemo(
    () => ({ current: viewport.getValidNodeOffsetRect(node) }),
    [viewport, node]
  )

  const element = viewport.findElementById(node?.id)
  const cursorStatus = engine.cursor.status

  const compute = useCallback(() => {
    if (
      (engine.cursor.status === CursorStatus.DragStart ||
        engine.cursor.status === CursorStatus.Dragging) &&
      engine.cursor.dragType === CursorDragType.Move
    )
      return
    const nextRect = viewport.getValidNodeOffsetRect(node)
    if (!isEqualRect(rectRef.current, nextRect) && nextRect) {
      rectRef.current = nextRect
      forceUpdate([])
    }
  }, [engine, viewport, node])

  useLayoutEffect(() => {
    compute()
  }, [compute, cursorStatus, rectRef])

  useEffect(() => {
    if (cursorStatus !== CursorStatus.Normal) return

    const frameIds = new Set<number>()
    let cancelled = false
    const run = (frames: number) => {
      const frameId = window.requestAnimationFrame(() => {
        frameIds.delete(frameId)
        if (cancelled) return
        if (frames > 0) return run(frames - 1)
        compute()
      })
      frameIds.add(frameId)
    }

    ;[0, 1, 2, 4].forEach(run)
    return () => {
      cancelled = true
      frameIds.forEach((frameId) => window.cancelAnimationFrame(frameId))
    }
  }, [compute, cursorStatus])

  useEffect(() => {
    const layoutObserver = new LayoutObserver(compute)
    const frameIds = new Set<number>()
    let scheduleToken = 0
    const scheduleCompute = () => {
      scheduleToken += 1
      const token = scheduleToken
      ;[0, 1, 2, 4].forEach((delay) => {
        const run = (frames: number) => {
          const frameId = window.requestAnimationFrame(() => {
            frameIds.delete(frameId)
            if (token !== scheduleToken) return
            if (frames > 0) return run(frames - 1)
            compute()
          })
          frameIds.add(frameId)
        }
        run(delay)
      })
    }
    const unsubscribe = engine.subscribeWith(
      [
        'drag:stop',
        'drop:node',
        'select:node',
        'append:node',
        'insert:after',
        'insert:before',
        'prepend:node',
        'update:children',
        'update:node:props',
        'viewport:scroll',
        'viewport:resize',
      ],
      scheduleCompute
    )
    if (element) layoutObserver.observe(element)
    scheduleCompute()
    return () => {
      scheduleToken += 1
      unsubscribe()
      layoutObserver.disconnect()
      frameIds.forEach((frameId) => window.cancelAnimationFrame(frameId))
    }
  }, [compute, element, engine])
  return rectRef.current
}
