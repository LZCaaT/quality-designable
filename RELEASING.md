# npm 发布流程

`@designable-next/*` 包使用 GitHub Trusted Publishing 发布，不使用本地 npm token 或 OTP。

## 依赖的运行时版本

设计器的 `FormGrid`、`FormItem` 等预览组件依赖独立仓库中的 `@designable-next/formily-antd-v6`。发布设计器前必须先发布运行时包，并将其确切版本写入 `release.config.json`。

发布工作流会完成以下检查：

- 按 `v<运行时版本>` Git tag 检出运行时仓库，不读取开发分支最新代码。
- 确认该运行时版本已经存在于 npm。
- 确认 `@designable-next/formily-antd` 的 peer dependency 不低于该修复版本。
- 确认 Git tag、`lerna.json` 和全部公开工作区版本一致。
- 运行测试、构建，并检查七个 npm tarball 都包含 `lib` 和 `esm` 输出。
- 通过 GitHub Trusted Publishing 发布，随后从 npm 回读全部版本。

## 发布预发布版本

1. 确认 `release.config.json` 指向已发布的运行时版本。
2. 使用 Node.js 22 执行 `npm ci --ignore-scripts`，完成一次干净安装。
3. `preversion` 会运行测试、构建和只读 lint 检查。
4. 执行 `npm run version:alpha -- --yes --no-push`，生成发布提交和 `v<version>` 标签。
5. 推送发布提交，再推送标签。标签触发 `.github/workflows/publish.yml`。

预发布版本统一发布到 `next` dist-tag，正式版本发布到 `latest`。
