import loader from '@monaco-editor/loader'

type Monaco = typeof import('monaco-editor')

let hasLocalMonaco = false

const Registry = {
  cdn: '//cdn.jsdelivr.net/npm',
}

export const setNpmCDNRegistry = (registry: string) => {
  Registry.cdn = registry
  if (!hasLocalMonaco) {
    loader.config({
      paths: {
        vs: `${registry}/monaco-editor@0.55.1/min/vs`,
      },
    })
  }
}

export const setMonacoEditor = (monaco: Monaco) => {
  hasLocalMonaco = true
  loader.config({ monaco })
}

export const getNpmCDNRegistry = () => String(Registry.cdn).replace(/\/$/, '')
