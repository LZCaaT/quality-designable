import { render } from '@testing-library/react'
import React from 'react'

test('destroys the expression editor when its popover closes', () => {
  let popoverProps: Record<string, unknown> = {}

  jest.doMock('@designable-next/react', () => ({
    IconWidget: () => null,
    TextWidget: () => null,
    usePrefix: () => 'dn',
  }))
  jest.doMock('antd', () => ({
    Button: ({ children }: React.PropsWithChildren) => (
      <button type="button">{children}</button>
    ),
    Input: () => null,
    InputNumber: () => null,
    Popover: (props: React.PropsWithChildren<Record<string, unknown>>) => {
      popoverProps = props
      return <>{props.children}</>
    },
    Select: () => null,
  }))
  jest.doMock('../components/MonacoInput', () => ({
    MonacoInput: () => null,
  }))
  jest.doMock('../components/PolyInput/styles.scss', () => ({}))

  const { ValueInput } = jest.requireActual(
    '../components/ValueInput'
  ) as typeof import('../components/ValueInput')

  render(<ValueInput value="{{1}}" onChange={jest.fn()} />)

  expect(popoverProps.destroyOnHidden).toBe(true)
})
