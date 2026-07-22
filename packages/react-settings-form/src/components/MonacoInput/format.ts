import { parse } from '@babel/parser'
import prettier from 'prettier/standalone'
interface IPrettierModule {
  format(
    source: string,
    options: {
      semi?: boolean
      parser?: (code: string) => any
    }
  ): string
}

export const format = async (language: string, source: string) => {
  return Promise.resolve(prettier as IPrettierModule).then((module) => {
    if (
      language === 'javascript.expression' ||
      language === 'typescript.expression'
    ) {
      return source
    }
    if (/(?:javascript|typescript)/gi.test(language)) {
      return module.format(source, {
        semi: false,
        parser(text) {
          return parse(text, {
            sourceType: 'module',
            plugins: ['typescript', 'jsx'],
          })
        },
      })
    }
    if (language === 'json') {
      return JSON.stringify(JSON.parse(source), null, 2)
    }
    return source
  })
}
