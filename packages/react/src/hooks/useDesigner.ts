import { Engine } from '@designable-next/core'
import { globalThisPolyfill, isFn } from '@designable-next/shared'
import { useContext, useEffect } from 'react'
import { DesignerEngineContext } from '../context'
export interface IEffects {
  (engine: Engine): void
}

export const useDesigner = (effects?: IEffects): Engine => {
  const designer: Engine =
    globalThisPolyfill['__DESIGNABLE_ENGINE__'] ||
    useContext(DesignerEngineContext)
  useEffect(() => {
    if (isFn(effects)) {
      return effects(designer)
    }
  }, [])
  return designer
}
