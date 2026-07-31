import { useFreeSelectionEffect } from '../effects/useFreeSelectionEffect'
import { DragMoveEvent, DragStopEvent } from '../events'
import { CursorDragType, CursorType } from '../models/Cursor'
import type { Engine } from '../models/Engine'
import type { TreeNode } from '../models/TreeNode'

describe('useFreeSelectionEffect', () => {
  const createFixture = (dragNodes: TreeNode[] = []) => {
    const callbacks = new Map<unknown, (event: any) => void>()
    const node = {
      isMyParents: () => false,
    } as unknown as TreeNode
    const batchSafeSelect = jest.fn()
    const workspace = {
      operation: {
        moveHelper: { dragNodes },
        selection: { batchSafeSelect },
        tree: {
          eachChildren: (visitor: (child: TreeNode) => void) => visitor(node),
        },
      },
      viewport: {
        dragScrollXDelta: 0,
        dragScrollYDelta: 0,
        getOffsetPoint: (point: { x: number; y: number }) => point,
        getValidNodeOffsetRect: () => ({
          height: 20,
          width: 20,
          x: 10,
          y: 10,
        }),
        isPointInViewport: () => true,
      },
    }
    const cursor = {
      dragStartPosition: { topClientX: 0, topClientY: 0 },
      dragType: CursorDragType.Move,
      position: { topClientX: 100, topClientY: 100 },
      setType: jest.fn(),
      type: CursorType.Normal,
    }
    const engine = {
      cursor,
      subscribeTo: jest.fn((eventType, callback) => {
        callbacks.set(eventType, callback)
        return jest.fn()
      }),
      workbench: {
        eachWorkspace: (visitor) => visitor(workspace),
      },
    } as unknown as Engine

    useFreeSelectionEffect(engine)

    return { batchSafeSelect, callbacks, cursor, node }
  }

  it('does not apply free selection after dragging nodes', () => {
    const draggedNode = {} as TreeNode
    const { batchSafeSelect, callbacks } = createFixture([draggedNode])

    callbacks.get(DragMoveEvent)({})
    callbacks.get(DragStopEvent)({
      data: { topClientX: 100, topClientY: 100 },
    })

    expect(batchSafeSelect).not.toHaveBeenCalled()
  })

  it('keeps free selection available when no nodes are being dragged', () => {
    const { batchSafeSelect, callbacks, node } = createFixture()

    callbacks.get(DragMoveEvent)({})
    callbacks.get(DragStopEvent)({
      data: { topClientX: 100, topClientY: 100 },
    })

    expect(batchSafeSelect).toHaveBeenCalledWith([node])
  })
})
