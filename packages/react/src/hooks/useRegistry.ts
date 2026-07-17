import { GlobalRegistry, IDesignerRegistry } from '@designable-next/core'
import { globalThisPolyfill } from '@designable-next/shared'

export const useRegistry = (): IDesignerRegistry => {
  return globalThisPolyfill['__DESIGNER_REGISTRY__'] || GlobalRegistry
}
