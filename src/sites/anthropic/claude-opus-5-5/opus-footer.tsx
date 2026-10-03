import { OpusMonogram } from "./opus-wordmark"

// All footer labels and destinations come from the inspected source DOM.
const footerGroups = [
  {
    "title": "Products",
    "links": [
      {
        "href": "https://claude.com/product/overview",
        "label": "Claude"
      },
      {
        "href": "https://claude.com/product/claude-code",
        "label": "Claude Code"
      },
      {
        "href": "https://claude.com/product/claude-code/enterprise",
        "label": "Claude Code Enterprise"
      },
      {
        "href": "https://claude.com/product/cowork",
        "label": "Claude Cowork"
      },
      {
        "href": "https://claude.com/product/tag",
        "label": "@Claude"
      },
      {
        "href": "https://claude.com/product/design",
        "label": "Claude Design"
      },
      {
        "href": "https://claude.com/product/claude-science",
        "label": "Claude Science"
      },
      {
        "href": "https://claude.com/product/claude-security",
        "label": "Claude Security"
      },
      {
        "href": "https://claude.com/claude-in-chrome",
        "label": "Claude in Chrome"
      },
      {
        "href": "https://claude.com/claude-for-microsoft-365",
        "label": "Claude for Microsoft 365"
      },
      {
        "href": "https://www.claude.com/skills",
        "label": "Skills"
      },
      {
        "href": "https://claude.ai/download",
        "label": "Download app"
      },
      {
        "href": "https://claude.com/pricing",
        "label": "Pricing"
      },
      {
        "href": "https://claude.ai/",
        "label": "Log in to Claude"
      }
    ]
  },
  {
    "title": "Models",
    "links": [
      {
        "href": "https://www.anthropic.com/claude/mythos",
        "label": "Mythos"
      },
      {
        "href": "https://www.anthropic.com/claude/fable",
        "label": "Fable"
      },
      {
        "href": "https://www.anthropic.com/claude/opus",
        "label": "Opus"
      },
      {
        "href": "https://www.anthropic.com/claude/sonnet",
        "label": "Sonnet"
      },
      {
        "href": "https://www.anthropic.com/claude/haiku",
        "label": "Haiku"
      }
    ]
  },
  {
    "title": "Solutions",
    "links": [
      {
        "href": "https://claude.com/solutions/agents",
        "label": "AI agents"
      },
      {
        "href": "https://claude.com/solutions/code-modernization",
        "label": "Code modernization"
      },
      {
        "href": "https://claude.com/solutions/coding",
        "label": "Coding"
      },
      {
        "href": "https://claude.com/solutions/commerce",
        "label": "Commerce"
      },
      {
        "href": "https://claude.com/solutions/customer-support",
        "label": "Customer support"
      },
      {
        "href": "https://claude.com/solutions/cybersecurity",
        "label": "Cybersecurity"
      },
      {
        "href": "https://claude.com/solutions/enterprise",
        "label": "Enterprise"
      },
      {
        "href": "https://claude.com/solutions/financial-services",
        "label": "Financial services"
      },
      {
        "href": "https://claude.com/solutions/government",
        "label": "Government"
      },
      {
        "href": "https://claude.com/solutions/healthcare",
        "label": "Healthcare"
      },
      {
        "href": "https://claude.com/solutions/education",
        "label": "Higher education"
      },
      {
        "href": "https://claude.com/solutions/teachers",
        "label": "K-12 teachers"
      },
      {
        "href": "https://claude.com/solutions/legal",
        "label": "Legal"
      },
      {
        "href": "https://claude.com/solutions/life-sciences",
        "label": "Life sciences"
      },
      {
        "href": "https://claude.com/solutions/nonprofits",
        "label": "Nonprofits"
      },
      {
        "href": "https://claude.com/solutions/sales",
        "label": "Sales"
      },
      {
        "href": "https://claude.com/solutions/small-business",
        "label": "Small business"
      }
    ]
  },
  {
    "title": "Claude Platform",
    "links": [
      {
        "href": "https://claude.com/platform/api",
        "label": "Overview"
      },
      {
        "href": "https://platform.claude.com/docs",
        "label": "Developer docs"
      },
      {
        "href": "https://claude.com/pricing#api",
        "label": "Pricing"
      },
      {
        "href": "https://claude.com/ecosystem",
        "label": "Ecosystem"
      },
      {
        "href": "https://claude.com/platform/marketplace",
        "label": "Marketplace"
      },
      {
        "href": "https://claude.com/regional-compliance",
        "label": "Regional compliance"
      },
      {
        "href": "https://claude.com/partners/claude-on-aws",
        "label": "Claude on AWS"
      },
      {
        "href": "https://claude.com/partners/google-cloud-vertex-ai",
        "label": "Google Cloud"
      },
      {
        "href": "https://claude.com/partners/microsoft-foundry",
        "label": "Microsoft Foundry"
      },
      {
        "href": "https://platform.claude.com/",
        "label": "Console login"
      }
    ]
  },
  {
    "title": "Resources",
    "links": [
      {
        "href": "https://claude.com/blog",
        "label": "Blog"
      },
      {
        "href": "https://claude.com/partners",
        "label": "Claude partner network"
      },
      {
        "href": "https://claude.com/community",
        "label": "Community"
      },
      {
        "href": "https://claude.com/connectors",
        "label": "Connectors"
      },
      {
        "href": "https://academy.claude.com",
        "label": "Courses"
      },
      {
        "href": "https://claude.com/customers",
        "label": "Customer stories"
      },
      {
        "href": "https://claude.dev",
        "label": "Developer blog"
      },
      {
        "href": "https://www.anthropic.com/engineering",
        "label": "Engineering at Anthropic"
      },
      {
        "href": "https://www.anthropic.com/events",
        "label": "Events"
      },
      {
        "href": "https://claude.com/plugins",
        "label": "Plugins"
      },
      {
        "href": "https://claude.com/partners/powered-by-claude",
        "label": "Powered by Claude"
      },
      {
        "href": "https://claude.com/partners/services",
        "label": "Service partners"
      },
      {
        "href": "https://claude.com/resources/tutorials",
        "label": "Tutorials"
      },
      {
        "href": "https://claude.com/resources/use-cases",
        "label": "Use cases"
      }
    ]
  },
  {
    "title": "Programs",
    "links": [
      {
        "href": "https://claude.com/programs/startups",
        "label": "Startups"
      },
      {
        "href": "https://claude.com/programs/team-plan-for-scientists",
        "label": "Scientists"
      }
    ]
  },
  {
    "title": "Help and security",
    "links": [
      {
        "href": "https://www.anthropic.com/supported-countries",
        "label": "Availability"
      },
      {
        "href": "https://status.anthropic.com/",
        "label": "Status"
      },
      {
        "href": "https://support.claude.com/en/",
        "label": "Support center"
      }
    ]
  },
  {
    "title": "Company",
    "links": [
      {
        "href": "https://www.anthropic.com/company",
        "label": "Anthropic"
      },
      {
        "href": "https://www.anthropic.com/careers",
        "label": "Careers"
      },
      {
        "href": "https://www.anthropic.com/company/leadership",
        "label": "Leadership"
      },
      {
        "href": "https://www.anthropic.com/policy",
        "label": "Policy"
      },
      {
        "href": "https://www.anthropic.com/economic-futures",
        "label": "Economic Futures"
      },
      {
        "href": "https://www.anthropic.com/research",
        "label": "Research"
      },
      {
        "href": "https://www.anthropic.com/news",
        "label": "News"
      },
      {
        "href": "https://www.anthropic.com/constitution",
        "label": "Claude’s Constitution"
      },
      {
        "href": "https://www.anthropic.com/claude-corps",
        "label": "Claude Corps"
      },
      {
        "href": "https://www.anthropic.com/path-to-hope",
        "label": "Keep thinking"
      },
      {
        "href": "https://www.anthropic.com/policy-on-the-ai-exponential",
        "label": "Policy on the AI Exponential"
      },
      {
        "href": "https://www.anthropic.com/news/announcing-our-updated-responsible-scaling-policy",
        "label": "Responsible Scaling Policy"
      },
      {
        "href": "https://trust.anthropic.com/",
        "label": "Security and compliance"
      },
      {
        "href": "https://www.anthropic.com/transparency",
        "label": "Transparency"
      }
    ]
  },
  {
    "title": "Terms and policies",
    "links": [
      {
        "href": "https://www.anthropic.com/legal/privacy",
        "label": "Privacy policy"
      },
      {
        "href": "https://www.anthropic.com/legal/consumer-health-data-privacy-policy",
        "label": "Consumer health data privacy policy"
      },
      {
        "href": "https://www.anthropic.com/responsible-disclosure-policy",
        "label": "Responsible disclosure policy"
      },
      {
        "href": "https://www.anthropic.com/legal/commercial-terms",
        "label": "Terms of service: Commercial"
      },
      {
        "href": "https://www.anthropic.com/legal/consumer-terms",
        "label": "Terms of service: Consumer"
      },
      {
        "href": "https://anthropic.com/legal/k12-terms",
        "label": "Terms of Service: US K-12"
      },
      {
        "href": "https://anthropic.com/legal/k12-dpa",
        "label": "Data Processing Agreement: US K-12"
      },
      {
        "href": "https://www.anthropic.com/legal/aup",
        "label": "Usage policy"
      }
    ]
  }
] as const
const footerColumns = [[0, 1], [2, 3], [4, 5, 6], [7, 8]] as const

export function OpusFooter() {
  return (
    <footer id="footer" className="opus-footer">
      <div className="opus-footer-inner">
        <a className="opus-footer-logo" href="https://www.anthropic.com/" aria-label="Anthropic home"><OpusMonogram /></a>
        <nav className="opus-footer-columns" aria-label="Footer navigation">
          {footerColumns.map((column, index) => (
            <div key={index} className="opus-footer-column">
              {column.map((groupIndex) => {
                const group = footerGroups[groupIndex]
                return (
                  <div className="opus-footer-group" key={group.title}>
                    <h2>{group.title}</h2>
                    <ul>{group.title === "Terms and policies" && <li><a href="https://www.anthropic.com/legal/privacy">Privacy choices</a></li>}{group.links.map((link) => <li key={link.href}><a href={link.href}>{link.label}</a></li>)}</ul>
                  </div>
                )
              })}
            </div>
          ))}
        </nav>
        <div className="opus-footer-bottom">
          <p>© 2026 Anthropic PBC</p>
          <div className="opus-footer-social" aria-label="Social media">
            <a href="https://www.linkedin.com/company/anthropicresearch" aria-label="Anthropic on LinkedIn"><svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M25.8182 4H6.18182C4.97636 4 4 4.97636 4 6.18182V25.8182C4 27.0236 4.97636 28 6.18182 28H25.8182C27.0236 28 28 27.0236 28 25.8182V6.18182C28 4.97636 27.0236 4 25.8182 4ZM11.5862 23.6364H8.368V13.2815H11.5862V23.6364ZM9.94436 11.8011C8.90691 11.8011 8.068 10.96 8.068 9.92473C8.068 8.88945 8.908 8.04945 9.94436 8.04945C10.9785 8.04945 11.8196 8.89055 11.8196 9.92473C11.8196 10.96 10.9785 11.8011 9.94436 11.8011ZM23.6407 23.6364H20.4247V18.6007C20.4247 17.3996 20.4029 15.8549 18.7524 15.8549C17.0778 15.8549 16.8204 17.1629 16.8204 18.5135V23.6364H13.6044V13.2815H16.6916V14.6964H16.7353C17.1651 13.8825 18.2145 13.024 19.78 13.024C23.0385 13.024 23.6407 15.1687 23.6407 17.9571V23.6364Z" /></svg></a>
            <a href="https://x.com/AnthropicAI" aria-label="Anthropic on X"><svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M28 28L18.6145 14.0124L18.6305 14.0255L27.0929 4H24.265L17.3713 12.16L11.8968 4H4.48021L13.2425 17.0593L13.2414 17.0582L4 28H6.82792L14.4921 18.9215L20.5834 28H28ZM10.7763 6.18182L23.9449 25.8182H21.7039L8.52468 6.18182H10.7763Z" /></svg></a>
            <a href="https://www.youtube.com/@anthropic-ai" aria-label="Anthropic on YouTube"><svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M29.2184 9.4375C28.9596 8.06299 27.7263 7.06201 26.2951 6.74951C24.1533 6.3125 20.1896 6 15.901 6C11.615 6 7.58782 6.3125 5.44354 6.74951C4.01486 7.06201 2.77905 7.99951 2.52021 9.4375C2.25884 11 2 13.1875 2 16C2 18.8125 2.25884 21 2.58365 22.5625C2.84502 23.937 4.0783 24.938 5.50698 25.2505C7.78068 25.6875 11.6784 26 15.967 26C20.2556 26 24.1533 25.6875 26.427 25.2505C27.8557 24.938 29.089 24.0005 29.3504 22.5625C29.6092 21 29.934 18.749 30 16C29.868 13.1875 29.5432 11 29.2184 9.4375ZM12.3941 20.375V11.625L20.319 16L12.3941 20.375Z" /></svg></a>
          </div>
        </div>
      </div>
    </footer>
  )
}
