import { render } from '@testing-library/react'
import React from 'react'
import { Card } from '../components/Card/preview'

jest.mock('antd', () => {
  const React = jest.requireActual('react') as typeof import('react')
  const { default: toArray } = jest.requireActual(
    '@rc-component/util/lib/Children/toArray'
  )

  return {
    Card: ({ children }: React.PropsWithChildren) => {
      const childNodes = toArray(children)
      return (
        <div>
          {childNodes.length ? (
            <div className="ant-card-body">{children}</div>
          ) : null}
        </div>
      )
    },
  }
})

jest.mock('@designable-next/core', () => ({
  createBehavior: () => ({}),
  createResource: () => ({}),
}))

jest.mock('@designable-next/react', () => ({}))

jest.mock('../components/Field', () => ({
  createVoidFieldSchema: () => ({}),
}))

jest.mock('../locales', () => ({ AllLocales: { Card: {} } }))

jest.mock('../schemas', () => ({ AllSchemas: { Card: {} } }))

test('renders a body for an empty designer Card', () => {
  const { container } = render(<Card title="Title" />)

  expect(container.querySelector('.ant-card-body')).not.toBeNull()
})
