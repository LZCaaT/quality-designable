import { ArrayAddition } from '../locales/ArrayBase'
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

  it.each([
    ['zh-CN', '添加一行', '按钮文案'],
    ['en-US', 'Add Row', 'Button Text'],
    ['ko-KR', '행 추가', '버튼 문구'],
  ])('localizes the addition title in %s', (language, title, label) => {
    expect(ArrayTable.Addition.properties.title).toBeDefined()
    expect(ArrayTableLocale[language].additionTitle).toBe(title)
    expect(ArrayAddition[language].settings['x-component-props'].title).toBe(
      label
    )
  })
})
