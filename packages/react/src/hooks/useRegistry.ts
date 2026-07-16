import { GlobalRegistry, IDesignerRegistry } from '@quality-designable/core'
import { globalThisPolyfill } from '@quality-designable/shared'

export const useRegistry = (): IDesignerRegistry => {
  return globalThisPolyfill['__DESIGNER_REGISTRY__'] || GlobalRegistry
}
