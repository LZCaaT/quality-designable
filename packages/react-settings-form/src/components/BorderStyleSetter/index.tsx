import { GlobalRegistry } from '@designable-next/core'
import { Select } from '@designable-next/formily-antd-v6'
import { usePrefix } from '@designable-next/react'
import { Field as FieldType } from '@formily/core'
import { Field, observer, useField } from '@formily/react'
import { observable } from '@formily/reactive'
import { camelCase } from '@formily/shared'
import cls from 'classnames'
import React, { Fragment, useMemo } from 'react'
import { ColorInput } from '../ColorInput'
import { FoldItem } from '../FoldItem'
import { PositionInput } from '../PositionInput'
import { SizeInput } from '../SizeInput'
import './styles.scss'

const Positions = ['center', 'top', 'right', 'bottom', 'left']

const getBorderStyleOptions = () =>
  ['none', 'solid', 'dashed', 'dotted'].map((value) => ({
    label: GlobalRegistry.getDesignerMessage(
      `SettingComponents.BorderStyleSetter.${value}`
    ),
    value,
  }))

const renderBorderStyleOption = ({
  data,
}: {
  data?: { label?: React.ReactNode; value?: string }
}) => {
  if (!data?.value || data.value === 'none') return data?.label
  return <span className={`border-style-${data.value}-line`} />
}

const createBorderProp = (position: string, key: string) => {
  const insert = position === 'center' ? '' : `-${position}`
  return camelCase(`border${insert}-${key}`)
}

const parseInitPosition = (field: FieldType) => {
  const basePath = field.address.parent()
  for (let i = 0; i < Positions.length; i++) {
    const position = Positions[i]
    const stylePath = `${basePath}.${createBorderProp(position, 'style')}`
    const widthPath = `${basePath}.${createBorderProp(position, 'width')}`
    const colorPath = `${basePath}.${createBorderProp(position, 'color')}`
    if (
      field.query(stylePath).value() ||
      field.query(widthPath).value() ||
      field.query(colorPath).value()
    ) {
      return position
    }
  }
  return 'center'
}
export interface IBorderStyleSetterProps {
  className?: string
  style?: React.CSSProperties
}

export const BorderStyleSetter: React.FC<IBorderStyleSetterProps> = observer(
  ({ className, style }) => {
    const field = useField<FieldType>()
    const currentPosition = useMemo(
      () =>
        observable({
          value: parseInitPosition(field),
        }),
      [field.value]
    )
    const prefix = usePrefix('border-style-setter')
    const createReaction = (position: string) => (field: FieldType) => {
      field.display = currentPosition.value === position ? 'visible' : 'hidden'
      if (position !== 'center') {
        const borderStyle = field.query('.borderStyle').value()
        const borderWidth = field.query('.borderWidth').value()
        const borderColor = field.query('.borderColor').value()
        if (borderStyle || borderWidth || borderColor) {
          field.value = undefined
        }
      }
    }

    return (
      <FoldItem label={field.title}>
        <FoldItem.Extra>
          <div className={cls(prefix, className)} style={style}>
            <div className={prefix + '-position'}>
              <PositionInput
                value={currentPosition.value}
                onChange={(value) => {
                  currentPosition.value = value
                }}
              />
            </div>
            <div className={prefix + '-input'}>
              {Positions.map((position, key) => {
                return (
                  <Fragment key={key}>
                    <Field
                      name={createBorderProp(position, 'style')}
                      basePath={field.address.parent()}
                      dataSource={getBorderStyleOptions()}
                      reactions={createReaction(position)}
                      component={[
                        Select,
                        {
                          optionRender: renderBorderStyleOption,
                          placeholder: 'Please Select',
                        },
                      ]}
                    />
                    <Field
                      name={createBorderProp(position, 'width')}
                      basePath={field.address.parent()}
                      reactions={createReaction(position)}
                      component={[SizeInput, { exclude: ['auto'] }]}
                    />
                    <Field
                      name={createBorderProp(position, 'color')}
                      basePath={field.address.parent()}
                      reactions={createReaction(position)}
                      component={[ColorInput]}
                    />
                  </Fragment>
                )
              })}
            </div>
          </div>
        </FoldItem.Extra>
      </FoldItem>
    )
  }
)
