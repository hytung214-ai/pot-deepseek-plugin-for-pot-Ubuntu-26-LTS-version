# Pot DeepSeek 插件修改版 / Modified DeepSeek Plugin

## 中文

基于他人 DeepSeek 翻译插件，使用 AI 辅助修改；非原创项目，也不是 Pot 或 DeepSeek 官方发行版。来源记录与待核实的作者、许可信息见 [ATTRIBUTION.md](ATTRIBUTION.md)。

- **安装问题**：整理为 Pot 可导入的标准 `.potext`，将 `info.json`、`main.js` 和图标放在包根目录。
- **调用与错误处理**：适配 Pot 3.0.7 的 `utils.tauriFetch` 和 Tauri 1 JSON 请求格式，增加密钥、输入和目标语言检查；明确提示鉴权失败、余额不足、限流及译文截断等错误，不把思考内容当译文显示。
- **依赖**：纯 JavaScript，运行依赖 Pot Desktop 3.0.7、网络及用户自己的有效 DeepSeek API 密钥；插件本身不额外引入 WebKitGTK 原生库，无需为安装插件重编译 Pot。构建使用 Python 3，契约测试使用 Node.js。

安装：下载 [dist 中的 .potext](dist/plugin.com.pot-app.deepseek.potext)，在 Pot 的外部翻译插件设置中导入并配置密钥。未完成有效密钥下的真实翻译验证；模型映射能否被当前 API 接受仍需实测。测试范围见 [TESTING.md](TESTING.md)。

## English

An unofficial modification of a third-party DeepSeek translation plugin, made with AI assistance. We do not claim original authorship or official affiliation with Pot or DeepSeek. See [ATTRIBUTION.md](ATTRIBUTION.md) for source records and unresolved author/license information.

- **Installation:** packages the plugin as an importable `.potext`, with `info.json`, `main.js` and the icon at the archive root.
- **Requests and errors:** uses Pot 3.0.7 `utils.tauriFetch` and the Tauri 1 JSON request format; validates credentials, input and target language, reports authentication, balance, rate-limit and truncation errors, and excludes reasoning text from translations.
- **Dependencies:** pure JavaScript; requires Pot Desktop 3.0.7, network access and your own valid DeepSeek API key. The plugin adds no native WebKitGTK library dependency and does not require rebuilding Pot. Packaging uses Python 3; contract tests use Node.js.

Install the [.potext in dist](dist/plugin.com.pot-app.deepseek.potext) through Pot external translation plugin settings and configure your key. Live translation with valid credentials has not been verified; acceptance of the configured model mappings by the current API requires testing. See [TESTING.md](TESTING.md).
