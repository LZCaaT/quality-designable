import { Card as CardLocale } from '../locales/Card'
import { Field } from '../locales/Field'
import { Card } from '../schemas/Card'
import { Cascader } from '../schemas/Cascader'
import { DatePicker } from '../schemas/DatePicker'
import { Input } from '../schemas/Input'
import { NumberPicker } from '../schemas/NumberPicker'
import { Select } from '../schemas/Select'
import { TimePicker } from '../schemas/TimePicker'
import { TreeSelect } from '../schemas/TreeSelect'

const commonVariantSchemas = [
  Cascader,
  DatePicker,
  Input,
  Input.TextArea,
  NumberPicker,
  Select,
  TimePicker,
  TreeSelect,
]

const getVariantLabels = (locale: Record<string, any>, path: string[]) => {
  return path.reduce((current, key) => current[key], locale).dataSource
}

describe('variant settings', () => {
  it.each(['zh-CN', 'en-US', 'ko-KR'])(
    'labels every common variant in %s',
    (language) => {
      const labels = getVariantLabels(Field[language], [
        'settings',
        'x-component-props',
        'variant',
      ])

      commonVariantSchemas.forEach((schema) => {
        expect(schema.properties.variant.enum).toEqual([
          'outlined',
          'borderless',
          'filled',
          'underlined',
          '',
        ])
        expect(labels).toHaveLength(schema.properties.variant.enum.length)
      })
      expect(labels.every(Boolean)).toBe(true)
    }
  )

  it.each(['zh-CN', 'en-US', 'ko-KR'])(
    'labels every Card variant in %s',
    (language) => {
      const variants = Card.properties.variant.enum as string[]
      const labels = getVariantLabels(CardLocale[language], [
        'settings',
        'x-component-props',
        'variant',
      ])

      expect(variants).toEqual(['outlined', 'borderless', ''])
      expect(labels).toHaveLength(variants.length)
      expect(labels.every(Boolean)).toBe(true)
    }
  )
})
