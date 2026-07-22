import {
  MonacoInput,
  getTypeScriptApi,
} from '@designable-next/react-settings-form'
import formilyCoreDeclaration from './formilyCoreDeclaration'

let declarationPromise: Promise<void> | undefined

const initializeDeclaration = () => {
  return MonacoInput.loader.init().then((monaco) => {
    const typescript = getTypeScriptApi(monaco)
    typescript.typescriptDefaults.addExtraLib(
      `declare module '@formily/core'{ ${formilyCoreDeclaration} }`,
      'file:///node_modules/@formily/core/index.d.ts'
    )
    typescript.typescriptDefaults.addExtraLib(
      `
    import { Form, Field } from '@formily/core'
    declare global {
      /*
       * Form Model
       **/
      declare var $form: Form
      /*
       * Form Values
       **/
      declare var $values: any
      /*
       * Field Model
       **/
      declare var $self: Field
      /*
       * create an persistent observable state object
       **/
      declare var $observable: <T>(target: T, deps?: any[]) => T
      /*
       * create a persistent data
       **/
      declare var $memo: <T>(callback: () => T, deps?: any[]) => T
      /*
       * handle side-effect logic
       **/
      declare var $effect: (callback: () => void | (() => void), deps?: any[]) => void
      /*
       * set initial component props to current field
       **/
      declare var $props: (props: any) => void
    }
    `,
      `file:///node_modules/formily_global.d.ts`
    )
  })
}

export const initDeclaration = () => {
  if (!declarationPromise) {
    declarationPromise = initializeDeclaration().catch((error) => {
      declarationPromise = undefined
      throw error
    })
  }
  return declarationPromise
}
