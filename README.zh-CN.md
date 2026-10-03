# AI Website Cloner Template 中文版

<p align="left">
  <a href="https://github.com/JCodesMore/ai-website-cloner-template/blob/master/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue" alt="MIT License" /></a>
  <a href="https://github.com/JCodesMore/ai-website-cloner-template/stargazers"><img src="https://img.shields.io/github/stars/JCodesMore/ai-website-cloner-template?style=flat" alt="Stars" /></a>
  <a href="https://discord.gg/hrTSX5yTpB"><img src="https://img.shields.io/discord/1400896964597383279?label=discord" alt="Discord" /></a>
  <img src="https://img.shields.io/endpoint?url=https://gittokens.rsamf.com/badge/JCodesMore/ai-website-cloner-template" alt="tokens" />
</p>

> 简体中文文档 | [English README](README.md)

一套可复用的模板，借助 AI 编程代理将任意网站反向工程为干净、现代的 Next.js 代码库。

**推荐：使用 [Claude Code](https://docs.anthropic.com/en/docs/claude-code) + Opus 5.5 以获得最佳效果**，同时支持 Codex、Cursor 和 OpenCode。

只需给定目标 URL，运行 `/clone-website`，AI 代理就会自动完成站点检查、设计 token 与资源提取、组件规格编写，并派出并行构建器逐个还原页面区块。

## 演示

[![观看演示](docs/design-references/comparison.png)](https://youtu.be/O669pVZ_qr0)

> 点击上方图片即可在 YouTube 观看完整演示。

## 快速开始

> **重要提示：** 请先使用 GitHub 的 **Use this template** 按钮创建自己的副本。不要直接克隆本模板仓库用于你的实际网站项目，也不要在此提交你生成的网站代码。

1. **从模板创建自己的仓库**

   在本项目的 GitHub 页面点击 **Use this template**，然后点击 **Create a new repository**。

   为新仓库命名，选择公开或私有，再点击 **Create repository**。如果出现 **Include all branches** 选项，可保持关闭。

   这样你就能拥有一个独立的项目空间，你的网站修改会保留在你自己的账号下，而不会回到模板仓库。

2. **在本地打开新仓库**

   GitHub 创建副本后，打开该仓库。点击 **Code**，用你喜欢的工具打开或克隆。

   如果使用终端，命令大致如下：

   ```bash
   git clone https://github.com/YOUR-USERNAME/YOUR-NEW-REPOSITORY.git
   cd YOUR-NEW-REPOSITORY
   ```

3. **安装依赖**
   ```bash
   npm install
   ```
4. **启动你的 AI 代理** — 推荐使用 Claude Code：
   ```bash
   claude --chrome
   ```
5. **运行克隆指令**：
   ```
   /clone-website <目标网址1> [<目标网址2> ...]
   ```
6. **按需定制**（可选） — 基础克隆完成后，可进一步修改。

> 使用其他 AI 代理？打开 `AGENTS.md` 查看项目指令 — 大多数代理会自动读取。

## 多站点开发

参见[站点目录、样式隔离、路由和 Cloudflare 部署说明](docs/site-architecture.md)。站点私有代码统一放在 `src/sites/<siteId>/`，`src/components/` 保留共享组件。

所有复刻网站共享一个 Next.js 开发服务器和一个端口。启动一次即可通过不同路径打开站点：

```bash
npm run dev
```

Next.js 16 在开发环境默认使用 Turbopack，项目不需要额外的 bundler 配置。开发服务器默认监听 `3000` 端口；如需临时使用其他端口，可显式传入端口参数。

然后访问：

```text
http://localhost:3000/                  # 自动进入站点选择页
http://localhost:3000/clones            # 站点选择页
http://localhost:3000/clones/openai
http://localhost:3000/clones/chatgpt
http://localhost:3000/clones/studio
http://localhost:3000/clones/gemini
```

每个站点仍然拥有独立的路由入口，修改站点代码时使用 Next.js Fast Refresh 热更新，不需要为每个网站重复启动端口。未知的站点路径会返回 404，不会回退到另一个复刻网站。

## 支持的平台

| 代理                                                          | 状态                        |
| ------------------------------------------------------------- | --------------------------- |
| [Claude Code](https://docs.anthropic.com/en/docs/claude-code) | **推荐** — Opus 5.5           |
| [OpenAI Codex 桌面端 / CLI](https://developers.openai.com/codex/) | 已支持 — 仓库 Skill + 浏览器 MCP |
| [OpenCode](https://opencode.ai/)                              | 已支持                      |
| [Cursor](https://cursor.com/)                                 | 已支持                      |

## 前置要求

- [Node.js](https://nodejs.org/) 24+
- 一个 AI 编程代理（见[支持的平台](#支持的平台)）

## 技术栈

- **Next.js 16** — App Router、React 19、TypeScript strict
- **shadcn/ui** — Radix 基础组件 + Tailwind CSS v4
- **Tailwind CSS v4** — oklch 设计 token
- **Lucide React** — 默认图标（克隆过程中会替换为提取的 SVG）

## 工作原理

`/clone-website` 指令会运行一个多阶段流水线：

1. **侦察（Reconnaissance）** — 截图、提取设计 token、扫描交互行为（滚动、点击、悬停、响应式）
2. **基础搭建（Foundation）** — 更新字体、颜色、全局样式，下载全部资源
3. **组件规格（Component Specs）** — 编写详细的规格文件（`docs/research/<site-key>/<page-key>/components/`），包含精确的计算 CSS 值、状态、行为和内容
4. **并行构建（Parallel Build）** — 在 git worktree 中分派构建器代理，每个代理负责一个区块或组件
5. **组装与 QA（Assembly & QA）** — 合并 worktree、拼接页面、与原站进行视觉对比

每个构建器代理都会收到完整的组件规格内联说明 —— 精确的 `getComputedStyle()` 值、交互模型、多状态内容、响应式断点、资源路径，无需猜测。

## 使用场景

- **平台迁移** — 将你自己拥有的 WordPress / Webflow / Squarespace 站点重建为现代 Next.js 代码库
- **源码丢失** — 站点仍在线上，但仓库丢失、开发者离职或技术栈过时，用现代格式把代码拿回来
- **学习研究** — 通过真实代码拆解生产站点如何实现特定布局、动画和响应式行为

## 不适用于

- **钓鱼或冒充** — 本项目严禁用于欺骗、冒充或任何违法活动。
- **将他人设计据为己有** — 徽标、品牌资产和原始文案均归其所有者所有。
- **违反服务条款** — 部分站点明确禁止抓取或复制，请先确认相关规定。

## 项目结构

```
src/
  app/              # Next.js 路由
  components/       # React 组件
    ui/             # shadcn/ui 基础组件
    icons.tsx       # 提取的 SVG 图标
  lib/utils.ts      # cn() 工具函数
  types/            # TypeScript 接口
  hooks/            # 自定义 React hooks
public/
  images/           # 从目标站点下载的图片
  videos/           # 从目标站点下载的视频
  seo/              # Favicon、OG 图片
docs/
  research/         # 提取产物与组件规格
  design-references/ # 截图参考
.agents/skills/clone-website/ # 官方统一 Skill 与检查指南
.claude/commands/clone-website.md # Claude Code 轻量入口
AGENTS.md           # 代理指令（单一事实来源）
CLAUDE.md           # Claude Code 配置（引用 AGENTS.md）
```

## 常用命令

```bash
npm run dev      # 启动开发服务器
npm run build    # 生产构建
npm run lint     # ESLint 检查
npm run typecheck # TypeScript 检查
npm run check    # 同时运行 lint + typecheck + build
npm run test:routes # 构建后验证站点访问和 404 行为
```

### 使用 Docker

```bash
docker compose up app --build # 构建并运行应用
docker compose up dev --build # 在开发模式下运行，端口 3001
```

## 代理支持与模板更新

官方模板已同步至 [v0.5.1](https://github.com/JCodesMore/ai-website-cloner-template/releases/tag/v0.5.1)。统一提示词位于 `.agents/skills/clone-website/`，Codex、Cursor 和 OpenCode 直接发现该 Skill；Claude Code 通过 `.claude/commands/clone-website.md` 调用。后续直接编辑统一 Skill，不再维护重复提示词或运行同步脚本。

在 Codex 中打开本项目，启用浏览器自动化工具后发送：

```text
使用 clone-website skill 复刻：https://example.com
```

已有多站点路由约定保留在 `AGENTS.md`。固定的上游版本和本项目保留的行为见[升级记录](docs/template-upgrade.md)。浏览器 MCP 需要在代理中配置，仓库没有提供 Codex MCP 配置文件。中文文档作为本项目说明保留，官方目前只维护英文 README。

## Star 历史

[![Star History Chart](https://api.star-history.com/svg?repos=JCodesMore/ai-website-cloner-template&type=Date)](https://star-history.com/#JCodesMore/ai-website-cloner-template&Date)

## 许可证

MIT


## Evidence 可复用组件库

Anthropic Opus 5.5 复刻页面：`/clones/anthropic/claude-opus-5-5`。组件展示页：`/components/evidence`。参阅[组件 API 与迁移说明](docs/components/evidence.md)，了解 shadcn 表格、Recharts 图表、主题和叙述交互组件的复用方式。
