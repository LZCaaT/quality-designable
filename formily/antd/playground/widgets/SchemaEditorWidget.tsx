import { ITreeNode, TreeNode } from '@designable-next/core'
import {
  transformToSchema,
  transformToTreeNode,
} from '@designable-next/formily-transformer'
import { useDesigner } from '@designable-next/react'
import { MonacoInput } from '@designable-next/react-settings-form'
import React from 'react'

export interface ISchemaEditorWidgetProps {
  tree: TreeNode
  onChange?: (tree: ITreeNode) => void
}

export const SchemaEditorWidget: React.FC<ISchemaEditorWidgetProps> = (
  props
) => {
  const engine = useDesigner()
  return (
    <MonacoInput
      {...props}
      value={JSON.stringify(transformToSchema(props.tree), null, 2)}
      onChange={(value) => {
        props.onChange?.(
          transformToTreeNode(JSON.parse(value), {
            migrateV5Schema: engine.props.migrateV5Schema,
          })
        )
      }}
      language="json"
    />
  )
}
