import { Engine } from '@designable-next/core'
import {
  transformToSchema,
  transformToTreeNode,
} from '@designable-next/formily-transformer'

export const saveSchema = (designer: Engine, onSuccess?: () => void) => {
  localStorage.setItem(
    'formily-schema',
    JSON.stringify(transformToSchema(designer.getCurrentTree()))
  )
  onSuccess?.()
}

export const loadInitialSchema = (designer: Engine) => {
  try {
    designer.setCurrentTree(
      transformToTreeNode(JSON.parse(localStorage.getItem('formily-schema')), {
        migrateV5Schema: designer.props.migrateV5Schema,
      })
    )
  } catch {}
}
