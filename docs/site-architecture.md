# 多站点架构与 Cloudflare 部署

这个项目保留一个 Next.js 应用，每个复刻站点拥有自己的组件、内容、配置、路由清单和样式。新增或修改一个站点时，优先只打开 `src/sites/<siteId>/`。

```text
src/
  app/                              # 薄路由入口、布局、错误边界
    clones/[siteId]/[[...path]]/      # 保留来源网站的路径
  sites/
    types.ts                        # 站点契约
    manifest.ts                     # 只聚合各站点清单
    loaders.ts                      # 显式动态导入站点入口
    pathname.ts                     # 来源路径与项目路径的转换
    openai/                         # entry、manifest、CSS Module、components
    chatgpt/                        # entry、manifest、routes、home、config、sidebar
    studio/                         # entry、manifest、routes、demo、navigation
    gemini/                         # entry、manifest、CSS Module、components
    anthropic/                      # entry、manifest、claude-opus-5-5 页面
  components/
    ui/                             # shadcn 原子组件
    sidebar/                        # 可配置、可复用侧栏
    studio-app-shell/               # 可复用应用布局
    openai-navigation/              # 可复用响应式导航
    evidence/                       # 可独立导出的图表、表格、叙述组件
    clone-picker.tsx                 # 项目选择页
```

## 依赖与样式边界

- 路由层选择站点；站点入口组合自己的页面与共享组件。
- 一个站点不能引用另一个站点的私有实现。共享组件也不能反向依赖某个站点。`npm run test:architecture` 使用 TypeScript 模块解析检查别名、相对引用、重导出和动态导入；`npm run lint` 自动包含它。
- 全局 CSS 只保留 Tailwind/shadcn 中性基础。OpenAI、ChatGPT、Gemini、Studio 的私有样式和主题变量放在各自 `site.module.css`。
- CSS Modules 生成独立的根类。保留原页面类名的规则使用 `.root :global(...)`，同一份 CSS 即使在客户端导航后仍驻留，也只匹配所属站点的后代。
- 弹窗、菜单、工具提示使用共享 `PortalScope`，通过 [Base UI Portal.container](https://base-ui.com/react/components/dialog#portal) 挂载到当前页面的主题节点，避免脱离 CSS Modules 与深色主题作用域。没有作用域的组件维持 Base UI 默认容器；调用者显式传入的容器优先。
- Anthropic 的原页面样式使用已有的 `.opus-*` 命名空间，共享 Evidence 样式使用 `.evidence-*` 和 `data-evidence-theme`；图片、字体与研究资料的已有路径保留。
- `loaders.ts` 的显式 `import()` 保留站点代码分割。清单只导入数据和纯函数，不导入站点 React 实现。

Next.js 官方推荐局部组件使用 [CSS Modules](https://nextjs.org/docs/app/getting-started/css#css-modules)，全局 CSS 用于真正通用的样式；它同时提醒客户端导航不会卸载全局样式，因此只移动 CSS 的导入位置并不足以防止串样式。

[Multi-Zones](https://nextjs.org/docs/app/guides/multi-zones) 适合需要各自发布和独立应用的站点，会增加部署与跨区导航成本。当前五个复刻站点共用工具链、组件库和一次部署，采用站点目录、模块样式与依赖检查更贴合实际需求。

## 路由规则

来源 `/` 映射到 `/clones/<siteId>`，来源 `/library` 映射到 `/clones/<siteId>/library`。

每个站点的 `manifest.ts` 声明 `paths`；ChatGPT 和 Studio 使用自己的 `routes.ts`。`getStaticCloneParams()` 导出所有已知路径，`getCloneRoute()` 拒绝未登记的路径。`getCloneHref()` 用于站点内导航，避免侧栏跳到项目根路径或另一个站点。

ChatGPT 导出的聊天与项目页面来自现有演示数据。运行时新建的任意聊天 ID 没有对应静态页面；持久化业务页面需要后续增加后端。Gemini、ChatGPT 的部分子路径复用现有演示页面，并不代表新增了真实服务。

新增站点：创建目录、入口、清单和样式；在 `types.ts`、聚合清单和 `loaders.ts` 登记；在清单中列出支持的来源路径；再运行质量检查。新增私有组件不应放回 `src/components/`。

## Cloudflare Workers Static Assets

依据 [Next.js 静态导出](https://nextjs.org/docs/app/guides/static-exports) 与 [Cloudflare 静态站点配置](https://developers.cloudflare.com/workers/static-assets/routing/static-site-generation/)，部署流程为：

```bash
npm ci
npm run check
npm test
npm run test:routes
npm run test:e2e
npm run build:assets
npm run preview:assets
# 另一个终端
CLONE_BASE_URL=http://127.0.0.1:3091 npm run test:routes
PLAYWRIGHT_BASE_URL=http://127.0.0.1:3091 npm run test:e2e
# 验证通过后
npx wrangler deploy
```

Node.js 24+，npm 11.9.0。`build:assets` 先生成独立 Evidence 下载包，再使用 `NEXT_OUTPUT=export` 导出 `out/`。开发服务器和普通 `npm run build` 仍支持 Next.js standalone。

`wrangler.jsonc` 将 `out/` 上传到 Worker `clone-website-lab`，没有服务端 Worker 脚本或数据库绑定。HTML 路径移除尾斜杠；未知地址使用真实 404 页面，避免兜底到别的站点。图片直接作为静态资源分发，不依赖 Next.js 图片优化服务器。

`public/_redirects` 保留 `/` 到 `/clones` 的 HTTP 跳转。`public/_headers` 给带内容哈希的 `/_next/static/` 文件设置长期缓存，其余文件使用 Cloudflare 默认重新验证。配置依据：[Redirects](https://developers.cloudflare.com/workers/static-assets/redirects/)、[Headers](https://developers.cloudflare.com/workers/static-assets/headers/)。

凭据由本机 Wrangler 登录或 `CLOUDFLARE_API_TOKEN` / `CLOUDFLARE_ACCOUNT_ID` 提供，不写入项目。

## 本次部署与验证

2026-10-03 已部署到 [Cloudflare 网站入口](https://clone-website-lab.2212148739lbw.workers.dev/clones)。

- 本地开发分支：`codex/site-isolation-cloudflare-assets`。
- 应用提交：`dd12c03`；部署版本：`eb80ff74-c9d6-4f74-bc51-2141cf75f065`。
- `npm run check`：架构检查、ESLint、TypeScript、Next.js 生产构建通过。
- `npm test`：72 项通过，包括独立组件包编译与站点路由契约。
- Next.js 生产服务器和 Wrangler 静态预览：53 条站点路径、选择页、组件库、根跳转与未知路径 404 通过；13 项浏览器测试通过。
- 正式地址：同一套路由 HTTP 检查通过；3 项站点隔离浏览器测试通过，包含跨站导航、手机布局、弹层与主题继承。
- Cloudflare 返回 HTML 200 和预期响应头。静态资源只上传 `out/`，现有依赖版本未改动；新增固定版本 Wrangler 部署工具。

代码提交保存在本地分支，本次未推送 GitHub。
