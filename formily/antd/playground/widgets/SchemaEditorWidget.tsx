import { ITreeNode, TreeNode } from '@quality-designable/core'
import {
  transformToSchema,
  transformToTreeNode,
} from '@quality-designable/formily-transformer'
import { useDesigner } from '@quality-designable/react'
import { MonacoInput } from '@quality-designable/react-settings-form'
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
