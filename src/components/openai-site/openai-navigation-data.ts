import type {
  SiteNavigationColumn,
  SiteNavigationItem,
  SiteNavigationLink,
} from "@/components/navigation/navigation-types";

export type OpenAiMenuKey = "research" | "products" | "business" | "developers" | "company";

export type OpenAiMenuLink = {
  label: string;
  href: string;
  external?: boolean;
};

export type OpenAiMenuColumn = {
  heading: string;
  links: OpenAiMenuLink[];
};

export type OpenAiMenuGroup = {
  key: OpenAiMenuKey;
  label: string;
  href?: string;
  columns: OpenAiMenuColumn[];
};

export const openAiLoginItems = [
  { label: "ChatGPT", href: "https://chatgpt.com/auth/login" },
  { label: "API 平台", href: "https://platform.openai.com/login" },
  { label: "Codex", href: "https://chatgpt.com/codex" },
] as const;

export const openAiMenus: OpenAiMenuGroup[] = [
  {
    key: "research",
    label: "研究",
    href: "/zh-Hans-CN/research/index/",
    columns: [
      {
        heading: "探索 研究",
        links: [
          { label: "研究索引", href: "/zh-Hans-CN/research/index/" },
          { label: "研究概览", href: "/zh-Hans-CN/research/" },
          { label: "研究驻留", href: "/zh-Hans-CN/residency/" },
          { label: "安全", href: "/zh-Hans-CN/safety/" },
        ],
      },
      {
        heading: "最新进展",
        links: [
          { label: "GPT-5.6", href: "/zh-Hans-CN/index/gpt-5-6/" },
          { label: "GPT-5.5", href: "/zh-Hans-CN/index/introducing-gpt-5-5/" },
          { label: "GPT-5.4", href: "/zh-Hans-CN/index/introducing-gpt-5-4/" },
          { label: "GPT-5.3 Instant", href: "/zh-Hans-CN/index/gpt-5-3-instant/" },
          { label: "GPT-5.3-Codex", href: "/zh-Hans-CN/index/introducing-gpt-5-3-codex/" },
        ],
      },
    ],
  },
  {
    key: "products",
    label: "产品",
    columns: [
      {
        heading: "探索 产品",
        links: [
          { label: "ChatGPT", href: "https://chatgpt.com/zh-Hans-CN/overview", external: true },
          { label: "Codex", href: "/zh-Hans-CN/codex/" },
        ],
      },
      {
        heading: "资源",
        links: [
          { label: "发布说明", href: "/zh-Hans-CN/products/release-notes/" },
          { label: "API 平台", href: "/zh-Hans-CN/api/" },
          { label: "OpenAI Academy", href: "/academy/" },
        ],
      },
    ],
  },
  {
    key: "business",
    label: "企业",
    href: "/zh-Hans-CN/business/",
    columns: [
      {
        heading: "探索 企业",
        links: [
          { label: "概览", href: "/zh-Hans-CN/business/" },
          { label: "解决方案", href: "/zh-Hans-CN/solutions/" },
          { label: "资源", href: "/zh-Hans-CN/business/learn/" },
          { label: "客户案例", href: "/zh-Hans-CN/business/customer-stories/" },
          { label: "定价", href: "/zh-Hans-CN/business/pricing/" },
          { label: "联系销售团队", href: "/zh-Hans-CN/contact-sales/" },
        ],
      },
      {
        heading: "产品",
        links: [
          { label: "ChatGPT Work", href: "/zh-Hans-CN/chatgpt-work/" },
          { label: "Codex", href: "/zh-Hans-CN/codex/" },
          { label: "API 平台", href: "/zh-Hans-CN/api/" },
          { label: "OpenAI Frontier", href: "/zh-Hans-CN/business/frontier/" },
          { label: "OpenAI Presence", href: "/zh-Hans-CN/business/openai-presence/" },
        ],
      },
      {
        heading: "解决方案",
        links: [
          { label: "金融", href: "/zh-Hans-CN/business/solutions/finance/" },
          { label: "数据分析", href: "/zh-Hans-CN/business/solutions/data/" },
          { label: "设计", href: "/zh-Hans-CN/business/solutions/design/" },
          { label: "生命科学", href: "/zh-Hans-CN/gpt-rosalind/" },
          { label: "网络安全", href: "/zh-Hans-CN/daybreak/" },
          { label: "金融服务", href: "/zh-Hans-CN/solutions/industries/financial-services/" },
          { label: "教育", href: "/business/solutions/education/" },
          { label: "所有解决方案", href: "/zh-Hans-CN/solutions/" },
        ],
      },
    ],
  },
  {
    key: "developers",
    label: "开发人员",
    href: "/zh-Hans-CN/api/",
    columns: [
      {
        heading: "探索 开发人员",
        links: [
          { label: "Codex", href: "/zh-Hans-CN/codex/" },
          { label: "API 平台", href: "/zh-Hans-CN/api/" },
          { label: "智能体", href: "https://developers.openai.com/api/docs/guides/agents", external: true },
          { label: "开放模型", href: "/zh-Hans-CN/open-models/" },
          { label: "应用程序 SDK", href: "https://developers.openai.com/apps-sdk", external: true },
        ],
      },
      {
        heading: "资源",
        links: [
          { label: "文档", href: "https://developers.openai.com/", external: true },
          { label: "Codex 用例", href: "https://developers.openai.com/codex/use-cases", external: true },
          { label: "Codex 更新日志", href: "https://developers.openai.com/codex/changelog", external: true },
          { label: "实用手册", href: "https://developers.openai.com/cookbook", external: true },
          { label: "开发者案例展示", href: "https://developers.openai.com/showcase", external: true },
          { label: "开发者博客", href: "https://developers.openai.com/blog", external: true },
          { label: "社区", href: "https://developers.openai.com/community", external: true },
        ],
      },
    ],
  },
  {
    key: "company",
    label: "公司",
    href: "/zh-Hans-CN/about/",
    columns: [
      {
        heading: "探索 公司",
        links: [
          { label: "关于我们", href: "/zh-Hans-CN/about/" },
          { label: "工作机会", href: "/careers/" },
          { label: "新闻", href: "/zh-Hans-CN/news/company-announcements/" },
          { label: "客户案例", href: "/zh-Hans-CN/stories/" },
          { label: "Supply Co.", href: "/zh-Hans-CN/supply/" },
        ],
      },
      {
        heading: "资源",
        links: [
          { label: "品牌规范", href: "/zh-Hans-CN/brand/" },
          { label: "公共政策", href: "/zh-Hans-CN/company/public-policy/" },
        ],
      },
    ],
  },
];

function toNavigationColumn(column: OpenAiMenuColumn): SiteNavigationColumn {
  return {
    id: column.heading,
    title: column.heading,
    items: column.links.map((link): SiteNavigationLink => ({
      external: link.external,
      href: link.href,
      label: link.label,
    })),
  };
}

export type OpenAiNavigationItemId = OpenAiMenuKey | "foundation";

export function toOpenAiNavigationItems(
  menus: OpenAiMenuGroup[],
): SiteNavigationItem<OpenAiNavigationItemId>[] {
  return [
    ...menus.map((menu) => ({
      id: menu.key,
      label: menu.label,
      href: menu.href,
      menu: { columns: menu.columns.map(toNavigationColumn) },
      menuLabel: `${menu.label} 菜单`,
    })),
    {
      id: "foundation",
      label: "基金会",
      href: "https://openaifoundation.org/zh-Hans-CN/",
      external: true,
    },
  ];
}

export const openAiNavigationItems = toOpenAiNavigationItems(openAiMenus);
