import {
  calcRectByStartEndPoint,
  isCrossRectInRect,
  isRectInRect,
  Point,
} from '@designable-next/shared'
import { DragMoveEvent, DragStopEvent } from '../events'
import { CursorDragType, CursorType } from '../models/Cursor'
import type { Engine } from '../models/Engine'
import type { TreeNode } from '../models/TreeNode'

export const useFreeSelectionEffect = (engine: Engine) => {
  let isMovingNode = false

  engine.subscribeTo(DragMoveEvent, () => {
    engine.workbench.eachWorkspace((workspace) => {
      if (workspace.operation.moveHelper.dragNodes.length) {
        isMovingNode = true
      }
    })
  })

  engine.subscribeTo(DragStopEvent, (event) => {
    if (isMovingNode) {
      isMovingNode = false
      return
    }
    if (engine.cursor.dragType !== CursorDragType.Move) {
      return
    }
    engine.workbench.eachWorkspace((workspace) => {
      const viewport = workspace.viewport
      const dragEndPoint = new Point(
        event.data.topClientX,
        event.data.topClientY
      )
      const dragStartOffsetPoint = viewport.getOffsetPoint(
        new Point(
          engine.cursor.dragStartPosition.topClientX,
          engine.cursor.dragStartPosition.topClientY
        )
      )
      const dragEndOffsetPoint = viewport.getOffsetPoint(
        new Point(
          engine.cursor.position.topClientX,
          engine.cursor.position.topClientY
        )
      )
      if (!viewport.isPointInViewport(dragEndPoint, false)) return
      const tree = workspace.operation.tree
      const selectionRect = calcRectByStartEndPoint(
        dragStartOffsetPoint,
        dragEndOffsetPoint,
        viewport.dragScrollXDelta,
        viewport.dragScrollYDelta
      )
      const selected: [TreeNode, DOMRect][] = []
      tree.eachChildren((node) => {
        const nodeRect = viewport.getValidNodeOffsetRect(node)
        if (nodeRect && isCrossRectInRect(selectionRect, nodeRect)) {
          selected.push([node, nodeRect])
        }
      })
      const selectedNodes: TreeNode[] = selected.reduce(
        (buf, [node, nodeRect]) => {
          if (isRectInRect(nodeRect, selectionRect)) {
            if (selected.some(([selectNode]) => selectNode.isMyParents(node))) {
              return buf
            }
          }
          return buf.concat(node)
        },
        []
      )
      workspace.operation.selection.batchSafeSelect(selectedNodes)
    })
    if (engine.cursor.type === CursorType.Selection) {
      engine.cursor.setType(CursorType.Normal)
    }
  })
}
