import { Upload } from '../locales/Upload'

describe('Upload settings', () => {
  it.each(['zh-CN', 'en-US', 'ko-KR'])(
    'uses a single label for openFileDialogOnClick in %s',
    (language) => {
      expect(
        Upload[language].settings['x-component-props'].openFileDialogOnClick
      ).toEqual(expect.any(String))
    }
  )
})
