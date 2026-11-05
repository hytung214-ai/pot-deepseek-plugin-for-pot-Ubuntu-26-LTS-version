# DeepSeek 插件修改版 / AI-assisted modification

本项目是对他人 DeepSeek 翻译插件的修改，不是我原创的插件，也不是 Pot 或 DeepSeek 的官方发行版。适配、修复及相关修改借助 AI 完成。

已有来源记录：pot-app-translate-plugin-deepseek-1.0.0.zip，SHA256 为 74d30bb86dd338ae114ebbf924f0c561dfd6729bcd4194f8f8bc85c6ae24d153。

This is an unofficial modification of an existing third-party DeepSeek translation plugin. Changes were made with AI assistance; we do not claim authorship of the original plugin. The original author, upstream URL, and license remain to be verified from the supplied source archive.

---

# DeepSeek 翻译插件：Pot Desktop 3.0.7 适配版

版本：1.0.1。适用于我本人仓库里的修改版 Ubuntu 26.04 版 Pot Desktop 3.0.7（由于 pot 项目已归档，我无法在原项目下进行comment,所以只能指向我个人的仓库，该修改版在 pot 源代码的基础上解决了 Ubuntu 26 lTS 的依赖问题，属于该系统定制版本，不一定同其他Ubuntu版本兼容）；纯 JavaScript 插件，
不依赖旧版 WebKitGTK，不需要重建或替换 Pot deb。

## 安装与配置

1. 使用发布文件 `plugin.com.pot-app.deepseek.potext`，不要选择源码 ZIP。
2. 打开 Pot 的“偏好设置 → 服务设置 → 翻译 → 添加外部插件/安装插件”，选择 `.potext`。
3. 在外部插件列表中选择 DeepSeek，创建翻译服务实例。
4. 选择模型、填写你自己的 DeepSeek API 密钥，保存。
5. 在翻译窗口启用该 DeepSeek 服务即可

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

源码来源：用户提供的 pot-app-translate-plugin-deepseek-1.0.0.zip。
原始包 SHA256：74d30bb86dd338ae114ebbf924f0c561dfd6729bcd4194f8f8bc85c6ae24d153。

官方文档：
- https://api-docs.deepseek.com/api/create-chat-completion/
- https://api-docs.deepseek.com/quick_start/error_codes/
