import { ArrayTable as ArrayTableLocale } from '../locales/ArrayTable'
import { ArrayTable } from '../schemas/ArrayTable'

describe('ArrayTable settings', () => {
  it.each([
    ['zh-CN', '是否有边框'],
    ['en-US', 'Bordered'],
    ['ko-KR', '테두리'],
  ])('labels bordered in %s', (language, label) => {
    expect(ArrayTable.properties.bordered).toBeDefined()
    expect(
      ArrayTableLocale[language].settings['x-component-props'].bordered
    ).toBe(label)
  })
})
