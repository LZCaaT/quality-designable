import { DragMoveEvent, DragStartEvent, DragStopEvent } from '../events'
import { CursorDragType } from '../models/Cursor'
import type { Engine } from '../models/Engine'
import type { TreeNode } from '../models/TreeNode'

type ResizeState = {
  direction: string
  element: Element
  node: TreeNode
  pointX: number
  pointY: number
}

export const useResizeEffect = (engine: Engine) => {
  let resizing: ResizeState | null = null

  const findStartNodeHandler = (target: HTMLElement) => {
    const handler = target?.closest(
      `*[${engine.props.nodeResizeHandlerAttrName}]`
    )
    if (!handler) return

    const direction = handler.getAttribute(
      engine.props.nodeResizeHandlerAttrName
    )
    const element = handler.closest(
      `*[${engine.props.nodeSelectionIdAttrName}]`
    )
    const nodeId = element?.getAttribute(engine.props.nodeSelectionIdAttrName)
    const node = nodeId ? engine.findNodeById(nodeId) : null
    if (direction && element && node) return { direction, element, node }
  }

  engine.subscribeTo(DragStartEvent, (event) => {
    const handler = findStartNodeHandler(event.data.target as HTMLElement)
    if (!handler) return

    const { direction, element, node } = handler
    const { resizable = {} } = node.designerProps
    const resizeX = direction.includes('left') || direction.includes('right')
    const resizeY = direction.includes('top') || direction.includes('bottom')
    if ((resizeX && !resizable.width) || (resizeY && !resizable.height)) return

    resizing = {
      direction,
      element,
      node,
      pointX: event.data.clientX,
      pointY: event.data.clientY,
    }
    engine.cursor.setDragType(CursorDragType.Resize)
    const diagonalStyle =
      direction.includes('left-top') || direction.includes('right-bottom')
        ? 'nwse-resize'
        : 'nesw-resize'
    engine.cursor.setStyle(
      resizeX && resizeY ? diagonalStyle : resizeX ? 'ew-resize' : 'ns-resize'
    )
  })

  engine.subscribeTo(DragMoveEvent, (event) => {
    if (engine.cursor.dragType !== CursorDragType.Resize || !resizing) return

    const { direction, element, node } = resizing
    const { resizable = {} } = node.designerProps
    const rect = element.getBoundingClientRect()

    if (
      (direction.includes('left') || direction.includes('right')) &&
      resizable.width
    ) {
      const currentX = event.data.clientX
      const isRight = direction.includes('right')
      const shouldPlus = isRight
        ? currentX > resizing.pointX
        : currentX < resizing.pointX
      const crossedEdge = isRight
        ? shouldPlus
          ? currentX >= rect.right
          : currentX <= rect.right
        : shouldPlus
        ? currentX <= rect.left
        : currentX >= rect.left

      if (crossedEdge) {
        const handler = resizable.width(node, element)
        shouldPlus ? handler.plus() : handler.minus()
        resizing.pointX = currentX
      }
    }

    if (
      (direction.includes('top') || direction.includes('bottom')) &&
      resizable.height
    ) {
      const currentY = event.data.clientY
      const isBottom = direction.includes('bottom')
      const shouldPlus = isBottom
        ? currentY > resizing.pointY
        : currentY < resizing.pointY
      const crossedEdge = isBottom
        ? shouldPlus
          ? currentY >= rect.bottom
          : currentY <= rect.bottom
        : shouldPlus
        ? currentY <= rect.top
        : currentY >= rect.top

      if (crossedEdge) {
        const handler = resizable.height(node, element)
        shouldPlus ? handler.plus() : handler.minus()
        resizing.pointY = currentY
      }
    }
  })

  engine.subscribeTo(DragStopEvent, () => {
    if (engine.cursor.dragType !== CursorDragType.Resize) return
    resizing = null
    engine.cursor.setDragType(CursorDragType.Move)
    engine.cursor.setStyle('')
  })
}
