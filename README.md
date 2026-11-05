# DeepSeek 插件修改版 / AI-assisted modification

本项目是对他人 DeepSeek 翻译插件的修改，不是我们原创的插件，也不是 Pot 或 DeepSeek 的官方发行版。适配、修复及相关修改借助 AI 完成。

已有来源记录：pot-app-translate-plugin-deepseek-1.0.0.zip，SHA256 为 74d30bb86dd338ae114ebbf924f0c561dfd6729bcd4194f8f8bc85c6ae24d153。当前提供的源码包没有原作者身份和许可证文件，原作者、准确上游链接与许可仍需核实；不应把其他 DeepSeek 插件的作者或许可证套用于本项目。本声明不授予对上游代码的新许可。

This is an unofficial modification of an existing third-party DeepSeek translation plugin. Changes were made with AI assistance; we do not claim authorship of the original plugin. The original author, upstream URL, and license remain to be verified from the supplied source archive.

---

# DeepSeek 翻译插件：Pot Desktop 3.0.7 适配版

版本：1.0.1。适用于本次 Ubuntu 26.04 版 Pot Desktop 3.0.7；纯 JavaScript 插件，
不依赖旧版 WebKitGTK，不需要重建或替换 Pot deb。

## 安装与配置

1. 使用发布文件 `plugin.com.pot-app.deepseek.potext`，不要选择源码 ZIP。
2. 打开 Pot 的“偏好设置 → 服务设置 → 翻译 → 添加外部插件/安装插件”，选择 `.potext`。
3. 在外部插件列表中选择 DeepSeek，创建翻译服务实例。
4. 选择模型、填写你自己的 DeepSeek API 密钥，保存。
5. 在翻译窗口启用该 DeepSeek 服务实例，输入文本验证。

API 密钥在 DeepSeek 平台创建：https://platform.deepseek.com/api_keys
不要把真实密钥写入 main.js、源码包或发送到聊天中。本发布包不含任何有效密钥。

## 模型兼容

截至 2026-11-04，官方 Chat Completions 文档列出 `deepseek-flash` 和 `deepseek-v4-pro`。
默认使用 Flash 并显式关闭思考，输出仅包含译文。

| 设置项 | 实际请求 |
| --- | --- |
| DeepSeek Flash | deepseek-flash，非思考 |
| DeepSeek V4 Pro | deepseek-v4-pro，非思考 |
| 旧配置 deepseek-chat | 映射到 deepseek-flash，非思考 |
| 旧配置 deepseek-reasoner | 映射到 deepseek-flash，思考 |

插件 ID、`apiKey` 和 `model` 字段保留。安装到同一插件目录时不删除 Pot 已保存的配置。
新建服务时推荐直接选择当前模型。思考模式不将 reasoning_content 当作译文显示。

## 适配范围

- 修复原 ZIP 不能直接导入的问题：标准 `.potext`、正确文件名、根目录包含 info.json/main.js。
- 保留 Pot 的 `utils.tauriFetch`、Tauri 1 Json body 格式和非流式返回。
- 空密钥在联网前提示；空输入不发送请求；模型和目标语言检查。
- 提示 401/402/429 等错误，拒绝空响应、仅思考内容及被截断的译文。
- 保留有意义的引号；错误信息不回显密钥；不自动重试付费请求。

## 验证与构建

```bash
node test.mjs
python3 build.py
```

构建结果位于本目录 dist/。Node 契约测试使用测试响应，覆盖配置兼容、参数、
错误处理和输出完整性；真实 Pot 的导入/加载检查结果另见测试报告。
没有提供有效密钥，因此没有完成 DeepSeek 真实译文和账户余额验证。
本次没有修改你的现有 Pot 配置，也没有安装插件到你的日常配置中。

源码来源：用户提供的 pot-app-translate-plugin-deepseek-1.0.0.zip。
原始包 SHA256：74d30bb86dd338ae114ebbf924f0c561dfd6729bcd4194f8f8bc85c6ae24d153。

官方文档：
- https://api-docs.deepseek.com/api/create-chat-completion/
- https://api-docs.deepseek.com/quick_start/error_codes/
