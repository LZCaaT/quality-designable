import { transformToTreeNode } from '../index'

const componentProps = (node: any) => node.props['x-component-props']

describe('legacy component prop migration', () => {
  it('keeps Table bordered because antd v6 still supports it', () => {
    const tree = transformToTreeNode(
      {
        form: {},
        schema: {
          type: 'object',
          properties: {
            table: {
              type: 'array',
              'x-component': 'ArrayTable',
              'x-component-props': { bordered: false },
            },
          },
        },
      },
      { migrateV5Schema: true }
    )

    expect(componentProps(tree.children[0])).toEqual({ bordered: false })
  })

  it('converts Card bordered to the antd v6 variant prop', () => {
    const tree = transformToTreeNode(
      {
        form: {},
        schema: {
          type: 'object',
          properties: {
            card: {
              type: 'object',
              'x-component': 'Card',
              'x-component-props': { bordered: false },
            },
          },
        },
      },
      { migrateV5Schema: true }
    )

    expect(componentProps(tree.children[0])).toEqual({ variant: 'borderless' })
  })

  it('removes an empty legacy variant so antd v6 uses its default', () => {
    const tree = transformToTreeNode(
      {
        form: {},
        schema: {
          type: 'object',
          properties: {
            input: {
              type: 'string',
              'x-component': 'Input',
              'x-component-props': { variant: '' },
            },
          },
        },
      },
      { migrateV5Schema: true }
    )

    expect(componentProps(tree.children[0])).toEqual({})
  })

  it('normalizes Select popup and Slider tooltip props', () => {
    const tree = transformToTreeNode(
      {
        form: {},
        schema: {
          type: 'object',
          properties: {
            select: {
              type: 'string',
              'x-component': 'Select',
              'x-component-props': { dropdownMatchSelectWidth: false },
            },
            slider: {
              type: 'number',
              'x-component': 'Slider',
              'x-component-props': {
                tooltipVisible: true,
                tooltipPlacement: 'top',
              },
            },
          },
        },
      },
      { migrateV5Schema: true }
    )

    expect(componentProps(tree.children[0])).toEqual({
      popupMatchSelectWidth: false,
    })
    expect(componentProps(tree.children[1])).toEqual({
      tooltip: { open: true, placement: 'top' },
    })
  })
})
