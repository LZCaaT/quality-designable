export const Card = {
  'zh-CN': {
    title: '卡片',
    settings: {
      'x-component-props': {
        type: '类型',
        title: '标题',
        extra: '右侧扩展',
        variant: {
          title: '变体',
          dataSource: ['描边', '无边框', '继承'],
        },
        cardTypes: [
          { label: '内置', value: 'inner' },
          { label: '默认', value: '' },
        ],
      },
    },
  },
  'en-US': {
    title: 'Card',
    settings: {
      'x-component-props': {
        type: 'Type',
        title: 'Title',
        extra: 'Extra',
        variant: {
          title: 'Variant',
          dataSource: ['Outlined', 'Borderless', 'Inherit'],
        },
        cardTypes: [
          { label: 'Inner', value: 'inner' },
          { label: 'Default', value: '' },
        ],
      },
    },
  },
  'ko-KR': {
    title: '카드',
    settings: {
      'x-component-props': {
        type: '타입',
        title: '제목',
        extra: '추가 항목',
        variant: {
          title: '변형',
          dataSource: ['외곽선', '테두리 없음', '상속'],
        },
        cardTypes: [
          { label: '안쪽', value: 'inner' },
          { label: '기본', value: '' },
        ],
      },
    },
  },
}
