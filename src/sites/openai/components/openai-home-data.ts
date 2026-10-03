export {
  openAiMenus,
  openAiNavigationItems,
  openAiLoginItems,
  type OpenAiMenuColumn,
  type OpenAiMenuGroup,
  type OpenAiMenuKey,
  type OpenAiMenuLink,
  type OpenAiNavigationItemId,
} from "./openai-navigation-data.ts";

export const openAiPromptSuggestions = [
  "Quiz me on vocabulary",
  "Plan a surf trip to Costa Rica in August",
  "India stock market today",
  "Explica por qué el maíz palomitas explota",
  "Teach me Mahjong for beginners",
  "Find hiking boots for wide feet",
  "Explain this code",
  "Was mach ich in Berlin wenn es regnet?",
  "What are some outdoor markets in Mexico City?",
  "Rédigez une note de remerciement",
  "Recommend an easy potluck dish",
  "写一段 Python 脚本",
] as const;

export const openAiFeatureCards = [
  {
    title: "GPT-5.6：随宏大目标灵活扩展的前沿智能",
    meta: "产品 · 18 分钟阅读",
    href: "/zh-Hans-CN/index/gpt-5-6/",
    media: "/images/openai-home/01-gpt-5-6-poster.png",
    size: "large",
  },
  {
    title: "Improving GPT‑5.6 Sol in ChatGPT—and expanding access to GPT-5.6 Luna for free users",
    meta: "产品 · 5 分钟阅读",
    href: "/index/improving-gpt-5-6-sol-in-chatgpt/",
    media: "/images/openai-home/02-gpt-5-6-poster.png",
    size: "medium",
  },
  {
    title: "在 ChatGPT 中推出“健康”功能",
    meta: "产品 · 2026年7月23日 · 7 分钟阅读",
    href: "/zh-Hans-CN/index/health-in-chatgpt/",
    media: "/images/openai-home/03-1_1_Art_Card.png",
    size: "small",
  },
  {
    title: "借助 ChatGPT 应对极具挑战性的工作",
    meta: "5 分钟阅读",
    href: "/zh-Hans-CN/chatgpt-work/",
    media: "/images/openai-home/04-ChatGPT_Work_1x1.png",
    size: "small",
  },
] as const;

export const openAiSections = [
  {
    title: "最新动态",
    linkLabel: "查看更多",
    linkHref: "/zh-Hans-CN/news/company-announcements/",
    cards: [
      { title: "以 GPT‑5.6 拓展性价比的前沿边界", meta: "产品 · 2026年7月30日", href: "/zh-Hans-CN/index/advancing-the-price-performance-frontier-with-gpt-5-6/", media: "/images/openai-home/05-price-performance-frontier_art-card_1x1.png" },
      { title: "推出 OpenAI Presence", meta: "产品 · 2026年7月22日", href: "/zh-Hans-CN/index/introducing-openai-presence/", media: "/images/openai-home/06-OpenAI_Presence_1x1.png" },
      { title: "David Vélez 和 Robin Vince 加入 OpenAI 董事会", meta: "公司 · 2026年7月21日", href: "/zh-Hans-CN/index/david-velez-robin-vince-join-openai-boards/", media: "/images/openai-home/07-c47f1f6d-440a-4f0b-a669-50ca79ce1064.png" },
      { title: "GPT-Red：解锁稳健性自我优化能力", meta: "安全 · 2026年7月15日", href: "/zh-Hans-CN/index/unlocking-self-improvement-gpt-red/", media: "/images/openai-home/08-Art_Card.png" },
      { title: "智能体如何重塑工作方式", meta: "公司 · 2026年6月25日", href: "/zh-Hans-CN/index/how-agents-are-transforming-work/", media: "/images/openai-home/09-Art_Card__1_.png" },
      { title: "Daybreak：为世界各地的机构提供安全防护", meta: "安全防护 · 2026年6月22日", href: "/zh-Hans-CN/index/daybreak-securing-the-world/", media: "/images/openai-home/10-Art_Card__6_.png" },
    ],
  },
  {
    title: "客户案例",
    linkLabel: "查看全部",
    linkHref: "/zh-Hans-CN/stories/",
    cards: [
      { title: "借助 ChatGPT 训练，骑行穿越南极洲", meta: "2026年6月11日", href: "/zh-Hans-CN/index/cycling-across-antarctica/", media: "/images/openai-home/11-OpenAI_Falcon_1x1.jpg" },
      { title: "用 Codex 创建新的黑洞模拟", meta: "2026年6月11日", href: "/zh-Hans-CN/index/creating-new-simulations-black-holes/", media: "/images/openai-home/12-2026_04_Gardi_ProjectOwl_KittPeak_Day1_02144.jpg" },
      { title: "Chip Ganassi Racing × OpenAI", meta: "API · 2026年5月28日", href: "/zh-Hans-CN/index/chip-ganassi-racing/", media: "/images/openai-home/13-OpenAI_Ganassi_1x1.jpg" },
    ],
  },
  {
    title: "最新研究",
    linkLabel: "查看全部",
    linkHref: "/zh-Hans-CN/research/index/",
    cards: [
      { title: "数学与理论计算机科学的十项进展", meta: "刊发 · 2026年8月1日", href: "/zh-Hans-CN/index/ten-advances-in-mathematics/", media: "/images/openai-home/14-math-breakthroughs_art-card_1x1.png" },
      { title: "OpenAI 模型推翻了离散几何领域的核心猜想", meta: "研究 · 2026年5月20日", href: "/zh-Hans-CN/index/model-disproves-discrete-geometry-conjecture/", media: "/images/openai-home/15-ArtCard-Polynomial-Construction.png" },
      { title: "GPT-Rosalind：开启生命科学研究新纪元", meta: "研究 · 2026年4月16日", href: "/zh-Hans-CN/index/introducing-gpt-rosalind/", media: "/images/openai-home/16-OAI_GPT-Rosaling_Art_Card_1x1.png" },
    ],
  },
  {
    title: "OpenAI 企业解决方案",
    linkLabel: "查看全部",
    linkHref: "/zh-Hans-CN/business/customer-stories/",
    cards: [
      { title: "Choco automates food distribution with AI agents", meta: "2026年4月27日", href: "/index/choco/", media: "/images/openai-home/17-oai_Choco_1x1.png" },
      { title: "CyberAgent moves faster with ChatGPT Enterprise and Codex", meta: "2026年4月9日", href: "/index/cyberagent/", media: "/images/openai-home/18-oai_CyberAgent_1x1.png" },
      { title: "Gradient Labs 为银行客户打造专属 AI 客户经理", meta: "初创企业 · 2026年4月1日", href: "/zh-Hans-CN/index/gradient-labs/", media: "/images/openai-home/19-oai_GradientLabs_1x1.png" },
    ],
  },
] as const;

export const openAiFooterGroups = [
  { title: "研究", links: ["研究索引", "研究概览", "经济研究"] },
  { title: "最新进展", links: ["GPT-5.6", "GPT-5.5", "GPT-5.4"] },
  { title: "安全", links: ["安全措施", "部署安全", "安全与隐私", "信任与透明度"] },
  { title: "产品", links: ["ChatGPT", "ChatGPT Business", "ChatGPT Enterprise", "ChatGPT for Education", "Codex", "发布说明"] },
  { title: "API 平台", links: ["概览", "API 登录", "文档"] },
  { title: "Business", links: ["概览", "解决方案", "资源", "客户案例", "合作伙伴网络", "联系销售团队"] },
  { title: "开发者", links: ["Apps SDK", "开放模型", "文档", "资源", "开发者论坛"] },
  { title: "公司", links: ["关于我们", "我们的宪章", "工作机会", "新闻"] },
  { title: "支持", links: ["帮助中心"] },
  { title: "更多", links: ["客户案例", "Academy", "Supply Co.", "直播", "播客", "RSS"] },
  { title: "条款与政策", links: ["使用条款", "隐私政策", "其他政策"] },
] as const;
