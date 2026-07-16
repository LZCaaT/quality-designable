import {
  CursorDragType,
  CursorStatus,
  Engine,
  TreeNode,
  Viewport,
} from '@designable-next/core'
import { act, renderHook } from '@testing-library/react'
import { useDesigner } from '../hooks/useDesigner'
import { useValidNodeOffsetRect } from '../hooks/useValidNodeOffsetRect'
import { useViewport } from '../hooks/useViewport'

jest.mock('../hooks/useDesigner', () => ({
  useDesigner: jest.fn(),
}))

jest.mock('../hooks/useViewport', () => ({
  useViewport: jest.fn(),
}))

class TestObserver {
  observe() {}

  disconnect() {}
}

describe('useValidNodeOffsetRect', () => {
  const node = { id: 'node-1' } as TreeNode
  const oldRect = { x: 10, y: 20, width: 100, height: 30 } as DOMRect
  const movedRect = { x: 210, y: 120, width: 100, height: 30 } as DOMRect
  const lateRect = { x: 410, y: 220, width: 100, height: 30 } as DOMRect

  let cursorStatus: CursorStatus
  let currentRect: DOMRect
  let subscriptions: Map<string, () => void>

  const renderRect = () => {
    const cursor = {
      dragType: CursorDragType.Move,
      get status() {
        return cursorStatus
      },
    }
    const engine = {
      cursor,
      subscribeWith: jest.fn((events: string[], callback: () => void) => {
        events.forEach((event) => subscriptions.set(event, callback))
        return jest.fn()
      }),
    } as unknown as Engine
    const viewport = {
      findElementById: jest.fn(),
      getValidNodeOffsetRect: jest.fn(() => currentRect),
    } as unknown as Viewport

    jest.mocked(useDesigner).mockReturnValue(engine)
    jest.mocked(useViewport).mockReturnValue(viewport)

    return renderHook(() => useValidNodeOffsetRect(node))
  }

  beforeAll(() => {
    global.ResizeObserver = TestObserver as unknown as typeof ResizeObserver
    global.PerformanceObserver =
      TestObserver as unknown as typeof PerformanceObserver
  })

  beforeEach(() => {
    jest.useFakeTimers()
    cursorStatus = CursorStatus.Normal
    currentRect = oldRect
    subscriptions = new Map()
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
    jest.clearAllMocks()
  })

  it('measures a newly dropped node when its rect was initially unavailable', () => {
    currentRect = undefined
    const { result } = renderRect()

    expect(result.current).toBeUndefined()

    currentRect = oldRect
    act(() => {
      jest.runAllTimers()
    })

    expect(result.current).toBe(oldRect)
  })

  it('keeps the old rect while dragging and updates it on drag stop', () => {
    cursorStatus = CursorStatus.Dragging
    const { rerender, result } = renderRect()

    currentRect = movedRect
    act(() => {
      jest.runAllTimers()
    })
    expect(result.current).toBe(oldRect)

    cursorStatus = CursorStatus.DragStop
    rerender()
    act(() => {
      subscriptions.get('drag:stop')()
      jest.runAllTimers()
    })

    expect(result.current).toBe(movedRect)
  })

  it('remeasures after the cursor normalizes when layout settles late', () => {
    cursorStatus = CursorStatus.DragStop
    const { rerender, result } = renderRect()

    act(() => {
      jest.runAllTimers()
    })
    expect(result.current).toBe(oldRect)

    currentRect = lateRect
    cursorStatus = CursorStatus.Normal
    rerender()
    act(() => {
      jest.runAllTimers()
    })

    expect(result.current).toBe(lateRect)
  })
})
