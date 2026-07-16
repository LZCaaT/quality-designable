import { GithubOutlined } from '@ant-design/icons'
import { observer } from '@formily/react'
import { GlobalRegistry } from '@quality-designable/core'
import { TextWidget, useDesigner } from '@quality-designable/react'
import { App, Button, Space } from 'antd'
import React, { useEffect } from 'react'
import { loadInitialSchema, saveSchema } from '../service'

export const ActionsWidget = observer(() => {
  const designer = useDesigner()
  const { message } = App.useApp()
  useEffect(() => {
    GlobalRegistry.setDesignerLanguage('en-us')
    loadInitialSchema(designer)
  }, [])

  return (
    <Space style={{ marginRight: 10 }}>
      <Button
        href="https://github.com/LZCaaT/quality-designable"
        target="_blank"
      >
        <GithubOutlined />
        Github
      </Button>
      <Button
        onClick={() => {
          saveSchema(designer, () => message.success('Save Success'))
        }}
      >
        <TextWidget>Save</TextWidget>
      </Button>
      <Button
        type="primary"
        onClick={() => {
          saveSchema(designer, () => message.success('Save Success'))
        }}
      >
        <TextWidget>Publish</TextWidget>
      </Button>
    </Space>
  )
})
