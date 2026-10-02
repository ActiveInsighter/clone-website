# 官方模板升级记录

- 检查日期：2026-10-02
- 官方上游：https://github.com/JCodesMore/ai-website-cloner-template
- 固定版本：v0.5.1
- 固定提交：`f50066df3f4bdca057d3b239be6f49f17724bb13`
- 本项目升级前版本：0.3.1；本地基线提交：a1866bf

## 已同步

官方 Skill、检查指南和 Claude Code 命令入口从固定上游提交原样复制。统一来源为 `.agents/skills/clone-website/SKILL.md`，检查指南按需读取，不再把长篇提示词复制到各个平台。

新版工作流隔离每个来源站点和页面的路由、调研、截图、组件、资源和下载脚本，防止后续复刻覆盖既有内容，并明确处理 query/fragment 与同路径的关系。

官方 0.5.x 仅集中支持 Claude Code、Codex、Cursor 和 OpenCode；按新版结构移除其他平台的旧版生成提示词和同步脚本，CI 改为直接执行测试、lint、类型检查和构建。官方固定 Next.js 与 eslint-config-next 16.3.5，但 2026-10-02 的依赖审计发现该版本仍受 [GHSA-vcvr-r3jv-pc5j](https://github.com/advisories/GHSA-vcvr-r3jv-pc5j) 影响（next/og ImageResponse 远程代码执行，受影响范围 >=16.2.0 <16.3.6）。因此本项目固定为审计建议的同系列补丁 16.3.8，并同步 eslint-config-next；其余项目专用直接依赖保留，仅在兼容版本范围内刷新间接依赖。

## 项目约定

`AGENTS.md` 保留本项目单服务器、多站点约定：`/` 跳转至 `/clones`，现有站点继续使用 `/clones/<siteId>`，新页面将来源路径映射到其下。沿用 `src/sites/` 注册表和入口，不把该项目当作空白模板。

已有应用组件、研究成果和静态资源保留。生产 HTTP 检查发现既有静态参数未提供可选路径，导致四个站点主页 404；在 `generateStaticParams()` 中补充 `path: []`，并加入 `npm run test:routes` 和 CI 验证，保持原有静态路由策略。中英文 README 继续作为本项目使用说明，更新到官方四个支持平台和统一 Skill 入口。旧检查指南路径保留为新指南的链接。

## 后续更新

先核对上游 release 和固定提交，再对比上述三个官方文件、依赖补丁与 CI。项目约定继续放在 `AGENTS.md`，不复制上游空白应用覆盖 `src/` 或 `public/`。修改后运行 `npm test`、`npm run check` 和 `npm run test:routes`。

## 验证结果

- 三个官方 Skill/入口文件与固定上游提交逐字节一致。
- `npm test`：56 项测试全部通过（Gemini 模型测试也纳入标准测试命令）。
- `npm run check`：lint、类型检查、Next.js 16.3.8 生产构建全部通过。
- `npm run test:routes`：根路径跳转、选择器链接、四个站点 HTTP 200 与正确站点标识、未知站点 HTTP 404 全部通过；测试服务器自动关闭。
- `npm audit`：0 个已知漏洞。
- 应用源码仅修改静态路由参数的一行；现有页面组件和静态资源未改动。
