# DeepSeek 插件适配测试记录

日期：2026-11-04。目标：已移植的 Pot Desktop 3.0.7 / Ubuntu 26.04 amd64。

- 原始源码已单独提交：3c4ba7f；适配在 compat/deepseek-plugin 分支进行。
- Node 22 的 24 项契约检查通过，包括当前/旧模型配置、请求体、简繁体语言、
  密钥缺失、HTTP 错误、密钥回显过滤、无效/空响应和截断输出。
- 使用真实 Pot release、WebKitGTK WebView 和原生 install_plugin 命令导入
  plugin.com.pot-app.deepseek.potext，返回安装数量 1。
- 通过 Tauri 文件接口读取实际安装的 main.js/info.json；按照 Pot 原有 eval
  加载方式获得 translate 函数。
- 使用项目原版 @tauri-apps/api/http 实现调用 Rust HTTP 后端，连接仅在本机
  启动的 HTTP 测试服务；验证认证头、JSON body 和旧模型映射后返回固定测试响应。
  这证明插件与 Pot 的网络接口衔接可用，不代表已获得 DeepSeek 真实译文。
- 空密钥验证通过；真实配置界面成功显示模型选择和 API 密钥输入框，截图已检查。
  模型显示名称缩短以适应 Pot 3.0.7 固定宽度的配置按钮。
- 未提供有效 API 密钥，没有调用 DeepSeek 生成译文，也没有验证账户余额。
- 测试使用隔离配置、缓存、X11 显示和私有 D-Bus；未改变用户日常 Pot 配置。
- 不需要重建或替换已交付的 Pot deb，也不需要额外系统库。

可重复执行：

```bash
node plugins/deepseek/test.mjs
python3 plugins/deepseek/build.py --output work/deepseek/dist
source scripts/local-env.sh
/usr/bin/python3 scripts/runtime-smoke.py \
  --plugin-package work/deepseek/dist/plugin.com.pot-app.deepseek.potext
```

集成测试依赖前一次移植中准备的本地工具。单独下载源码包时可运行其中的 Node
契约测试及 build.py；真实 Pot 集成测试需要完整工作仓库和 WebKitWebDriver/Xvfb。
