import { useResizeEffect } from '../effects/useResizeEffect'
import { DragMoveEvent, DragStartEvent, DragStopEvent } from '../events'
import { CursorDragType } from '../models/Cursor'
import type { Engine } from '../models/Engine'
import type { TreeNode } from '../models/TreeNode'

describe('useResizeEffect', () => {
  const createFixture = () => {
    const callbacks = new Map<unknown, (event: any) => void>()
    const plus = jest.fn()
    const minus = jest.fn()
    const node = {
      designerProps: {
        resizable: {
          width: () => ({ plus, minus }),
        },
      },
    } as unknown as TreeNode
    const selection = document.createElement('div')
    const handler = document.createElement('div')
    selection.setAttribute('data-selection-id', 'node-1')
    handler.setAttribute('data-resize-handler', 'right-center')
    selection.append(handler)
    document.body.append(selection)
    Object.defineProperty(selection, 'getBoundingClientRect', {
      value: () => ({
        bottom: 40,
        height: 40,
        left: 0,
        right: 100,
        top: 0,
        width: 100,
        x: 0,
        y: 0,
      }),
    })

    const cursor = {
      dragType: CursorDragType.Move,
      setDragType: jest.fn((dragType) => {
        cursor.dragType = dragType
      }),
      setStyle: jest.fn(),
    }
    const engine = {
      cursor,
      findNodeById: jest.fn(() => node),
      props: {
        nodeResizeHandlerAttrName: 'data-resize-handler',
        nodeSelectionIdAttrName: 'data-selection-id',
      },
      subscribeTo: jest.fn((eventType, callback) => {
        callbacks.set(eventType, callback)
        return jest.fn()
      }),
    } as unknown as Engine

    useResizeEffect(engine)

    return { callbacks, cursor, handler, minus, plus, selection }
  }

  afterEach(() => {
    document.body.innerHTML = ''
    jest.clearAllMocks()
  })

  it('updates the schema handler without writing layout styles to the DOM', () => {
    const { callbacks, cursor, handler, minus, plus, selection } =
      createFixture()
    const eventData = (clientX: number) => ({
      data: { clientX, clientY: 20, target: handler },
    })

    callbacks.get(DragStartEvent)(eventData(100))
    callbacks.get(DragMoveEvent)(eventData(110))
    callbacks.get(DragMoveEvent)(eventData(90))

    expect(cursor.dragType).toBe(CursorDragType.Resize)
    expect(cursor.setStyle).toHaveBeenCalledWith('ew-resize')
    expect(plus).toHaveBeenCalledTimes(1)
    expect(minus).toHaveBeenCalledTimes(1)
    expect(selection.getAttribute('style')).toBeNull()

    callbacks.get(DragStopEvent)(eventData(90))
    expect(cursor.dragType).toBe(CursorDragType.Move)
    expect(cursor.setStyle).toHaveBeenLastCalledWith('')
  })
})
