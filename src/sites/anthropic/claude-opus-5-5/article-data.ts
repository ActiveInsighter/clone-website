import type { ArticleNode } from "./article-types"

// Extracted from the source page on 2026-10-02; benchmark values are not invented.
export const articleNodes: readonly ArticleNode[] = [
  {
    "id": "c80e0a51aea1",
    "type": "anchor",
    "anchor": "introduction",
    "label": "Introduction",
    "heroLabel": "Introduction"
  },
  {
    "id": "18c95c65d607",
    "type": "text",
    "block": {
      "id": "18c95c65d607",
      "style": "articleSummary",
      "spans": [
        {
          "text": "We’re introducing Claude Opus 5.5, the first model in our new Claude 5.5 family. It performs at the level of Claude Fable 5.1 on most work and costs 40% less to run than Opus 5.",
          "marks": []
        }
      ]
    }
  },
  {
    "id": "ef45f63d2ea1",
    "type": "text",
    "block": {
      "id": "ef45f63d2ea1",
      "style": "normal",
      "spans": [
        {
          "text": "Claude Opus 5.5 is our first release since we called for ",
          "marks": []
        },
        {
          "text": "pacing the frontier",
          "marks": [
            "1fb375e9f0f3"
          ]
        },
        {
          "text": ". It was tested before release by external evaluators, including ",
          "marks": []
        },
        {
          "text": "Frontier Design",
          "marks": [
            "3661b3c0ff57"
          ]
        },
        {
          "text": " and ",
          "marks": []
        },
        {
          "text": "METR",
          "marks": [
            "d0a972976320"
          ]
        },
        {
          "text": ". On our automated behavioral audit, the most comprehensive alignment test we run, Opus 5.5 is the strongest-performing model we’ve tested to date. It also comes with the safeguards we’ve developed for our most capable models.",
          "marks": []
        }
      ],
      "links": {
        "1fb375e9f0f3": "https://darioamodei.com/post/we-must-pace-the-frontier",
        "3661b3c0ff57": "https://www.imaginefrontier.com/",
        "d0a972976320": "https://metr.org/"
      }
    }
  },
  {
    "id": "a8512855a0d5",
    "type": "text",
    "block": {
      "id": "a8512855a0d5",
      "style": "normal",
      "spans": [
        {
          "text": "Here are some of the improvements you can expect from Opus 5.5:",
          "marks": []
        }
      ]
    }
  },
  {
    "id": "c65fc9f9d1c7",
    "type": "text",
    "block": {
      "id": "c65fc9f9d1c7",
      "style": "normal",
      "spans": [
        {
          "text": "Performance.",
          "marks": [
            "strong"
          ]
        },
        {
          "text": " Opus 5.5 is a major step up from Opus 5. It’s the new leading model, and early testers saw large jumps in performance on their most complex work. One tester completed a 680,000-line code migration in less than a day—work that would have taken an engineering team weeks. It’s good at finding and fixing inefficiencies in software: when we asked it to cut load times across every page of a web app, Opus 5.5 succeeded 39 of 40 times, while Opus 5 made smaller improvements that also altered the app’s behavior. A different tester had several Claude models build a game from a single prompt; Opus 5.5 scored higher than any other model on the strength of its graphics and polish.",
          "marks": []
        }
      ]
    }
  },
  {
    "id": "23e9e57e493c",
    "type": "text",
    "block": {
      "id": "23e9e57e493c",
      "style": "normal",
      "spans": [
        {
          "text": "Safety.",
          "marks": [
            "strong"
          ]
        },
        {
          "text": " Opus 5.5 achieves the best scores of any model to date on our automated behavioral audit, our alignment suite that tests Claude across thousands of simulated scenarios. It is much less likely than recent models to take hard-to-reverse actions or act outside the boundaries it’s been given, and it’s more resistant than Opus 5 to prompt injection. We’ve also broadened our alignment testing to cover longer tasks, impossible tasks, and scenarios modeled on real incidents, though it still has limits. Full details of our evaluation are available in the ",
          "marks": []
        },
        {
          "text": "Opus 5.5 System Card",
          "marks": [
            "e304e62f57d7"
          ]
        },
        {
          "text": ".",
          "marks": []
        }
      ],
      "links": {
        "e304e62f57d7": "https://anthropic.com/claude-opus-5-5-system-card"
      }
    }
  },
  {
    "id": "8fe994fdfaa7",
    "type": "text",
    "block": {
      "id": "8fe994fdfaa7",
      "style": "normal",
      "spans": [
        {
          "text": "Because Opus 5.5 is comparable to Claude Mythos 5.1 in biology and cybersecurity, we’re deploying it with safeguards similar to those on Claude Fable 5.1. Vetted organizations can apply today to our ",
          "marks": []
        },
        {
          "text": "Life Sciences Verification Program",
          "marks": [
            "4e49328ecccd"
          ]
        },
        {
          "text": " to use Opus 5.5 for biology research. In the coming weeks we will also be expanding access to our ",
          "marks": []
        },
        {
          "text": "Cyber Verification Program",
          "marks": [
            "7f4e3cbd0d63"
          ]
        },
        {
          "text": ", and verified cybersecurity practitioners will be able to use Opus 5.5 for their work.",
          "marks": []
        }
      ],
      "links": {
        "4e49328ecccd": "https://www.anthropic.com/news/life-sciences-verification-program",
        "7f4e3cbd0d63": "https://support.claude.com/en/articles/14604842-real-time-cyber-safeguards-on-claude-opus-and-sonnet"
      }
    }
  },
  {
    "id": "f128dd367d01",
    "type": "text",
    "block": {
      "id": "f128dd367d01",
      "style": "normal",
      "spans": [
        {
          "text": "Cost and speed.",
          "marks": [
            "strong"
          ]
        },
        {
          "text": " Opus 5.5 requires less compute to serve than Opus 5, and its pricing reflects that. Our tests show that at default settings it will cost 40% less than Opus 5 on typical workloads. Input and output tokens are $4 and $20 per million, 20% less than Opus 5. Cache reads (which make up the majority of agentic and coding work costs) are $0.20 per million tokens, 60% less than Opus 5. Opus 5.5 also generates output more than 30% faster than Opus 5.",
          "marks": []
        }
      ]
    }
  },
  {
    "id": "8773ff76526c",
    "type": "text",
    "block": {
      "id": "8773ff76526c",
      "style": "normal",
      "spans": [
        {
          "text": "In addition to the price drop, we’re increasing five-hour usage limits on Pro, Max, Team, and seat-based Enterprise plans. We’re also providing subscription users a rate limit reset, which you can now save and use whenever you choose.",
          "marks": []
        }
      ]
    }
  },
  {
    "id": "88dff2b19212",
    "type": "text",
    "block": {
      "id": "88dff2b19212",
      "style": "normal",
      "spans": [
        {
          "text": "Communication.",
          "marks": [
            "strong"
          ]
        },
        {
          "text": " Opus 5.5 communicates more naturally than prior models. Early testers found its writing clearer and easier to follow, which addresses some of the common feedback we heard about Opus 5. It puts the most important information up front, and its style makes it a better work partner over long sessions. As one early tester put it, “it writes the way I do.” In our own use, this has made Opus 5.5’s work easier to follow and check—which is a safety benefit as well as a practical one.",
          "marks": []
        }
      ]
    }
  },
  {
    "id": "60be36ff208b",
    "type": "text",
    "block": {
      "id": "60be36ff208b",
      "style": "normal",
      "spans": [
        {
          "text": "Claude Sonnet 5.5 and Claude Haiku 5.5 will follow in the coming weeks, with many of the same improvements to performance, efficiency, and safety.",
          "marks": []
        }
      ]
    }
  },
  {
    "id": "3c95d69ade9e",
    "type": "anchor",
    "anchor": "performance-and-cost-effectiveness",
    "label": "Performance and cost-effectiveness",
    "heroLabel": "Performance and cost"
  },
  {
    "id": "54fd2988ddc1",
    "type": "text",
    "block": {
      "id": "54fd2988ddc1",
      "style": "h2",
      "spans": [
        {
          "text": "Performance and cost-effectiveness",
          "marks": []
        }
      ]
    }
  },
  {
    "id": "51d17ea9638e",
    "type": "text",
    "block": {
      "id": "51d17ea9638e",
      "style": "normal",
      "spans": [
        {
          "text": "On our benchmarks, Claude Opus 5.5 leads in agentic coding, computer use, and knowledge work. That said, at these levels of capability we’ve found that benchmark margins have become a less reliable guide to real-world differences. In our own use, the gap between Opus 5.5 and Claude Fable 5.1 is narrower than these scores suggest.",
          "marks": []
        }
      ]
    }
  },
  {
    "id": "6920924806c1",
    "type": "benchmark",
    "columns": [
      {
        "id": "Opus 5.5",
        "label": "Opus 5.5"
      },
      {
        "id": "Fable 5.1",
        "label": "Fable 5.1"
      },
      {
        "id": "Opus 5",
        "label": "Opus 5"
      },
      {
        "id": "GPT-6 Astra",
        "label": "GPT-6 Astra"
      },
      {
        "id": "GPT-5.6 Sol",
        "label": "GPT-5.6 Sol"
      }
    ],
    "rows": [
      {
        "id": "0",
        "label": "Agentic coding",
        "description": "Terminal-Bench 4.0¹",
        "values": {
          "Opus 5.5": {
            "value": "66.4%",
            "note": "",
            "best": true
          },
          "Fable 5.1": {
            "value": "55.8%",
            "note": "",
            "best": false
          },
          "Opus 5": {
            "value": "52.3%",
            "note": "",
            "best": false
          },
          "GPT-6 Astra": {
            "value": "57.9%",
            "note": "",
            "best": false
          },
          "GPT-5.6 Sol": {
            "value": "37.3%",
            "note": "",
            "best": false
          }
        }
      },
      {
        "id": "1",
        "label": "Agentic coding",
        "description": "FrontierCode v1.1 (Main)",
        "values": {
          "Opus 5.5": {
            "value": "54.4%",
            "note": "",
            "best": true
          },
          "Fable 5.1": {
            "value": "50.3%",
            "note": "",
            "best": false
          },
          "Opus 5": {
            "value": "48.0%",
            "note": "",
            "best": false
          },
          "GPT-6 Astra": {
            "value": "53.3%",
            "note": "",
            "best": false
          },
          "GPT-5.6 Sol": {
            "value": "47.5%",
            "note": "",
            "best": false
          }
        }
      },
      {
        "id": "2",
        "label": "Agentic coding",
        "description": "CursorBench 4.0",
        "values": {
          "Opus 5.5": {
            "value": "57.8%",
            "note": "",
            "best": true
          },
          "Fable 5.1": {
            "value": "51.8%",
            "note": "",
            "best": false
          },
          "Opus 5": {
            "value": "46.6%",
            "note": "",
            "best": false
          },
          "GPT-6 Astra": {
            "value": null,
            "note": "",
            "best": false
          },
          "GPT-5.6 Sol": {
            "value": "41.7%",
            "note": "",
            "best": false
          }
        }
      },
      {
        "id": "3",
        "label": "Knowledge work",
        "description": "GDPval-AA v2.1",
        "values": {
          "Opus 5.5": {
            "value": "1846",
            "note": "",
            "best": true
          },
          "Fable 5.1": {
            "value": "1735",
            "note": "",
            "best": false
          },
          "Opus 5": {
            "value": "1708",
            "note": "",
            "best": false
          },
          "GPT-6 Astra": {
            "value": "1542",
            "note": "",
            "best": false
          },
          "GPT-5.6 Sol": {
            "value": "1588",
            "note": "",
            "best": false
          }
        }
      },
      {
        "id": "4",
        "label": "Business workflows",
        "description": "AutomationBench²",
        "values": {
          "Opus 5.5": {
            "value": "40.0%",
            "note": "",
            "best": false
          },
          "Fable 5.1": {
            "value": "31.4%",
            "note": "",
            "best": false
          },
          "Opus 5": {
            "value": "26.9%",
            "note": "",
            "best": false
          },
          "GPT-6 Astra": {
            "value": "41.4%",
            "note": "",
            "best": true
          },
          "GPT-5.6 Sol": {
            "value": "28.8%",
            "note": "",
            "best": false
          }
        }
      },
      {
        "id": "5",
        "label": "Multidisciplinary reasoning",
        "description": "Humanity's Last Exam",
        "values": {
          "Opus 5.5": {
            "value": "67.7%",
            "note": "with tools",
            "best": true
          },
          "Fable 5.1": {
            "value": "65.6%",
            "note": "with tools",
            "best": false
          },
          "Opus 5": {
            "value": "63.6%",
            "note": "with tools",
            "best": false
          },
          "GPT-6 Astra": {
            "value": "57.2%",
            "note": "with tools",
            "best": false
          },
          "GPT-5.6 Sol": {
            "value": null,
            "note": "with tools",
            "best": false
          }
        }
      },
      {
        "id": "6",
        "label": "Agentic scientific research",
        "description": "Terminal-Bench-Science 0.1³",
        "values": {
          "Opus 5.5": {
            "value": "58.7%",
            "note": "",
            "best": false
          },
          "Fable 5.1": {
            "value": "52.6%",
            "note": "",
            "best": false
          },
          "Opus 5": {
            "value": "29.0%",
            "note": "",
            "best": false
          },
          "GPT-6 Astra": {
            "value": "64.6%",
            "note": "",
            "best": true
          },
          "GPT-5.6 Sol": {
            "value": "22.4%",
            "note": "",
            "best": false
          }
        }
      },
      {
        "id": "7",
        "label": "Computer use",
        "description": "OSWorld 2.1",
        "values": {
          "Opus 5.5": {
            "value": "81.8%",
            "note": "partial",
            "best": true
          },
          "Fable 5.1": {
            "value": "80.7%",
            "note": "partial",
            "best": false
          },
          "Opus 5": {
            "value": "74.0%",
            "note": "partial",
            "best": false
          },
          "GPT-6 Astra": {
            "value": null,
            "note": "partial",
            "best": false
          },
          "GPT-5.6 Sol": {
            "value": null,
            "note": "partial",
            "best": false
          }
        }
      },
      {
        "id": "8",
        "label": "Visual chart recognition",
        "description": "Chartography",
        "values": {
          "Opus 5.5": {
            "value": "89.0%",
            "note": "with tools",
            "best": true
          },
          "Fable 5.1": {
            "value": "88.4%",
            "note": "with tools",
            "best": false
          },
          "Opus 5": {
            "value": "83.4%",
            "note": "with tools",
            "best": false
          },
          "GPT-6 Astra": {
            "value": null,
            "note": "with tools",
            "best": false
          },
          "GPT-5.6 Sol": {
            "value": null,
            "note": "with tools",
            "best": false
          }
        }
      }
    ],
    "highlightColumn": "Opus 5.5",
    "caption": "Claude Opus 5.5 benchmark comparison",
    "notes": [
      {
        "id": "noteintro",
        "style": "left",
        "spans": [
          {
            "text": "Unless otherwise noted, all Claude Opus 5.5 results use adaptive thinking at max effort. Terminal-Bench 4.0 results are reported for Claude Opus 5.5 at xhigh effort and GPT-6 Astra at high effort, as reported by OpenAI; these represent each model’s highest score. Claude Opus 5.5 was evaluated with its production safeguards enabled. When they intervened, cybersecurity tasks were completed by Claude Opus 4.8, and biology and frontier LLM development tasks were completed by Claude Opus 5. This likely reduces Claude Opus 5.5’s performance on these benchmarks.",
            "marks": []
          }
        ]
      },
      {
        "id": "note1",
        "style": "left",
        "spans": [
          {
            "text": "1",
            "marks": [
              "sup"
            ]
          },
          {
            "text": "  Terminal-Bench 4.0:",
            "marks": [
              "strong"
            ]
          },
          {
            "text": " The standard error is ±2.6 pts for Claude Opus 5.5 and ±1.6–2 pts for the other Claude models. The public leaderboard (5 trials/task, Claude Code harness) reports Claude Opus 5 at 51.8%; our setup reproduces it at 52.3%, within noise. GPT-6 Astra and GPT-5.6 Sol figures are as reported by OpenAI.",
            "marks": []
          }
        ]
      },
      {
        "id": "note2",
        "style": "left",
        "spans": [
          {
            "text": "2",
            "marks": [
              "sup"
            ]
          },
          {
            "text": "  AutomationBench:",
            "marks": [
              "strong"
            ]
          },
          {
            "text": " AutomationBench results were run and reported by Zapier. These runs were performed without fallback models, so safeguard interventions were considered failures—this resulted in a lower score than Claude Opus 5.5 would achieve in practice. Claude Opus 5.5 results come from Zapier’s own evaluation during early access. Results for Opus 5, GPT-5.6 Sol, and GPT-6 Astra come from Zapier’s public leaderboard.",
            "marks": []
          }
        ]
      },
      {
        "id": "note3",
        "style": "left",
        "spans": [
          {
            "text": "3",
            "marks": [
              "sup"
            ]
          },
          {
            "text": "  Terminal-Bench-Science 0.1:",
            "marks": [
              "strong"
            ]
          },
          {
            "text": " The standard error is ±3.5–5 pts per model. The public leaderboard (3 trials/task, Claude Code harness) reports Claude Opus 5 at 30.0%; our setup reproduces it at 29.0%, within noise. The GPT-6 Astra figure is as reported by OpenAI.",
            "marks": []
          }
        ]
      }
    ]
  },
  {
    "id": "6f97019793d4",
    "type": "text",
    "block": {
      "id": "6f97019793d4",
      "style": "normal",
      "spans": [
        {
          "text": "Where Opus 5.5’s advantage is very clear is efficiency. It costs less per token than Opus 5 and uses fewer tokens per task, which nets out to a 40% drop in costs.",
          "marks": []
        }
      ]
    }
  },
  {
    "id": "c4222c82ee46",
    "type": "pricing",
    "columns": [
      {
        "id": "0",
        "label": "Claude Opus 5.5"
      },
      {
        "id": "1",
        "label": "Claude Opus 5"
      }
    ],
    "rows": [
      {
        "id": "7340bf5aeb73",
        "label": "Cache reads",
        "values": {
          "0": {
            "value": "$0.20"
          },
          "1": {
            "value": "$0.50"
          }
        }
      },
      {
        "id": "a4918c796ea4",
        "label": "Input tokens",
        "values": {
          "0": {
            "value": "$4"
          },
          "1": {
            "value": "$5"
          }
        }
      },
      {
        "id": "8e27c9933bd9",
        "label": "Output tokens",
        "values": {
          "0": {
            "value": "$20"
          },
          "1": {
            "value": "$25"
          }
        }
      },
      {
        "id": "952547753ba5",
        "label": "Cache writes",
        "values": {
          "0": {
            "value": "$5"
          },
          "1": {
            "value": "$6.25"
          }
        }
      }
    ],
    "caption": "Prices per 1M tokens"
  },
  {
    "id": "e8d5738da6d6",
    "type": "text",
    "block": {
      "id": "e8d5738da6d6",
      "style": "normal",
      "spans": [
        {
          "text": "Fast mode for Opus 5.5 is also available in Claude Code and the Claude Platform with up to 2.5x speed. It costs $8 per million input tokens and $40 per million output tokens.",
          "marks": []
        }
      ]
    }
  },
  {
    "id": "11d3a0f7e6ba",
    "type": "text",
    "block": {
      "id": "11d3a0f7e6ba",
      "style": "h2",
      "spans": [
        {
          "text": "Coding",
          "marks": []
        }
      ]
    }
  },
  {
    "id": "520c6438c705",
    "type": "text",
    "block": {
      "id": "520c6438c705",
      "style": "normal",
      "spans": [
        {
          "text": "Opus 5.5 is particularly good at long and sprawling jobs like codebase-wide migrations and audits. An early tester used it to audit and fix a 200,000-line codebase in under three hours, where Opus 5 took over 20 hours and used 2.5x as many tokens. In an internal test, we asked Opus 5.5 and Fable 5.1 to translate HAProxy, widely used software that balances web traffic loads across servers, from C into Rust. Both rewrites passed nearly all of HAProxy’s own regression tests, but Opus 5.5 finished in 9.5 hours compared to 12 for Fable 5.1, and cost 51% less.",
          "marks": []
        }
      ]
    }
  },
  {
    "id": "239fc42e060b",
    "type": "text",
    "block": {
      "id": "239fc42e060b",
      "style": "normal",
      "spans": [
        {
          "text": "Opus 5.5 delivers frontier results on agentic coding at a fraction of the cost. At its default effort level on FrontierCode, it beats GPT-6 Astra at roughly 20% of the cost per task. On Terminal Bench 4.0, it matches Astra for about 40% of the cost, while on CursorBench it beats GPT-5.6 Sol by 11 points for about a third of the cost.",
          "marks": []
        }
      ]
    }
  },
  {
    "id": "9d51ceea7f10",
    "type": "charts",
    "tabs": [
      {
        "id": "4d4800ae0fa2",
        "label": "Agentic terminal coding",
        "chart": {
          "title": "Terminal-Bench 4.0",
          "subtitle": "Accuracy vs Cost",
          "series": [
            {
              "id": "opus55",
              "label": "Opus 5.5",
              "color": "var(--evidence-orange)",
              "points": [
                {
                  "x": 1.29,
                  "y": 38.5,
                  "label": "Low",
                  "labelPlacement": "above"
                },
                {
                  "x": 2.94,
                  "y": 57.6,
                  "label": "Med",
                  "labelPlacement": "above"
                },
                {
                  "x": 3.88,
                  "y": 64.2,
                  "label": "High",
                  "labelPlacement": "above"
                },
                {
                  "x": 7.35,
                  "y": 66.4,
                  "label": "Xhigh",
                  "labelPlacement": "above"
                },
                {
                  "x": 11.24,
                  "y": 64.8,
                  "label": "Max",
                  "labelPlacement": "above"
                }
              ]
            },
            {
              "id": "fable51",
              "label": "Fable 5.1",
              "color": "var(--evidence-green)",
              "points": [
                {
                  "x": 5.7,
                  "y": 40.2,
                  "label": "Low",
                  "labelPlacement": "hidden"
                },
                {
                  "x": 7.8,
                  "y": 43.4,
                  "label": "Med",
                  "labelPlacement": "hidden"
                },
                {
                  "x": 10.5,
                  "y": 49.4,
                  "label": "High",
                  "labelPlacement": "hidden"
                },
                {
                  "x": 15.8,
                  "y": 51.3,
                  "label": "Xhigh",
                  "labelPlacement": "hidden"
                },
                {
                  "x": 19.5,
                  "y": 55.8,
                  "label": "Max",
                  "labelPlacement": "hidden"
                }
              ]
            },
            {
              "id": "opus5",
              "label": "Opus 5",
              "color": "var(--evidence-yellow)",
              "points": [
                {
                  "x": 4.25,
                  "y": 28.5,
                  "label": "Low",
                  "labelPlacement": "hidden"
                },
                {
                  "x": 7.0,
                  "y": 41.2,
                  "label": "Med",
                  "labelPlacement": "hidden"
                },
                {
                  "x": 10.64,
                  "y": 47.0,
                  "label": "High",
                  "labelPlacement": "hidden"
                },
                {
                  "x": 13.48,
                  "y": 50.6,
                  "label": "Xhigh",
                  "labelPlacement": "hidden"
                },
                {
                  "x": 15.83,
                  "y": 52.3,
                  "label": "Max",
                  "labelPlacement": "hidden"
                }
              ]
            },
            {
              "id": "gpt6astra",
              "label": "GPT-6 Astra",
              "color": "var(--evidence-gray)",
              "points": [
                {
                  "x": 4.95,
                  "y": 49.7,
                  "label": "Low",
                  "labelPlacement": "hidden"
                },
                {
                  "x": 6.15,
                  "y": 53.9,
                  "label": "Med",
                  "labelPlacement": "hidden"
                },
                {
                  "x": 7.21,
                  "y": 57.9,
                  "label": "High",
                  "labelPlacement": "hidden"
                },
                {
                  "x": 7.48,
                  "y": 57.6,
                  "label": "Xhigh",
                  "labelPlacement": "hidden"
                },
                {
                  "x": 10.35,
                  "y": 56.7,
                  "label": "Max",
                  "labelPlacement": "hidden"
                }
              ]
            },
            {
              "id": "gpt56sol",
              "label": "GPT-5.6 Sol",
              "color": "var(--evidence-gray-light)",
              "points": [
                {
                  "x": 1.46,
                  "y": 7.9,
                  "label": "Low",
                  "labelPlacement": "hidden"
                },
                {
                  "x": 2.69,
                  "y": 20.9,
                  "label": "Med",
                  "labelPlacement": "hidden"
                },
                {
                  "x": 4.12,
                  "y": 26.1,
                  "label": "High",
                  "labelPlacement": "hidden"
                },
                {
                  "x": 5.39,
                  "y": 28.5,
                  "label": "Xhigh",
                  "labelPlacement": "hidden"
                },
                {
                  "x": 7.89,
                  "y": 37.3,
                  "label": "Max",
                  "labelPlacement": "hidden"
                }
              ]
            }
          ],
          "xAxis": {
            "label": "Cost per attempt (USD, log scale)",
            "domain": [
              1.1,
              25
            ],
            "ticks": [
              2.0,
              5.0,
              10.0,
              20.0
            ],
            "scale": "log",
            "format": "currency"
          },
          "yAxis": {
            "label": "Score (%)",
            "domain": [
              0,
              75
            ],
            "ticks": [
              0.0,
              10.0,
              20.0,
              30.0,
              40.0,
              50.0,
              60.0,
              70.0
            ],
            "scale": "linear",
            "format": "percent"
          }
        },
        "notes": [
          {
            "id": "note",
            "style": "normal",
            "spans": [
              {
                "text": "Terminal-Bench 4.0 measures how well a model can complete complex, multi-step professional tasks within a command line interface. Opus 5.5 at default effort beats Opus 5 at max effort for about a fifth of the cost. It matches GPT-6 Astra at about 40% of the cost.",
                "marks": []
              }
            ]
          }
        ]
      },
      {
        "id": "8fed885984d6",
        "label": "Agentic coding: FrontierCode",
        "chart": {
          "title": "FrontierCode v1.1, main set",
          "subtitle": "Accuracy vs Cost",
          "series": [
            {
              "id": "opus55",
              "label": "Opus 5.5",
              "color": "var(--evidence-orange)",
              "points": [
                {
                  "x": 0.4036,
                  "y": 47.3,
                  "label": "Low",
                  "labelPlacement": "above"
                },
                {
                  "x": 0.8016,
                  "y": 54.64,
                  "label": "Med",
                  "labelPlacement": "above"
                },
                {
                  "x": 1.0896,
                  "y": 53.99,
                  "label": "High",
                  "labelPlacement": "below"
                },
                {
                  "x": 2.2545,
                  "y": 51.42,
                  "label": "Xhigh",
                  "labelPlacement": "below"
                },
                {
                  "x": 6.191,
                  "y": 54.43,
                  "label": "Max",
                  "labelPlacement": "above"
                }
              ]
            },
            {
              "id": "fable51",
              "label": "Fable 5.1",
              "color": "var(--evidence-green)",
              "points": [
                {
                  "x": 2.4665,
                  "y": 52.8,
                  "label": "Low",
                  "labelPlacement": "hidden"
                },
                {
                  "x": 3.2845,
                  "y": 50.91,
                  "label": "Med",
                  "labelPlacement": "hidden"
                },
                {
                  "x": 5.2741,
                  "y": 50.34,
                  "label": "High",
                  "labelPlacement": "hidden"
                },
                {
                  "x": 9.2739,
                  "y": 48.73,
                  "label": "Xhigh",
                  "labelPlacement": "hidden"
                },
                {
                  "x": 12.8218,
                  "y": 50.28,
                  "label": "Max",
                  "labelPlacement": "hidden"
                }
              ]
            },
            {
              "id": "opus5",
              "label": "Opus 5",
              "color": "var(--evidence-yellow)",
              "points": [
                {
                  "x": 2.6415,
                  "y": 41.95,
                  "label": "Low",
                  "labelPlacement": "hidden"
                },
                {
                  "x": 4.6066,
                  "y": 53.38,
                  "label": "Med",
                  "labelPlacement": "hidden"
                },
                {
                  "x": 7.615,
                  "y": 47.99,
                  "label": "High",
                  "labelPlacement": "hidden"
                },
                {
                  "x": 8.9885,
                  "y": 43.65,
                  "label": "Xhigh",
                  "labelPlacement": "hidden"
                },
                {
                  "x": 12.2814,
                  "y": 48.04,
                  "label": "Max",
                  "labelPlacement": "hidden"
                }
              ]
            },
            {
              "id": "gpt6astra",
              "label": "GPT-6 Astra",
              "color": "var(--evidence-gray)",
              "points": [
                {
                  "x": 1.5927,
                  "y": 45.27,
                  "label": "Low",
                  "labelPlacement": "hidden"
                },
                {
                  "x": 2.2845,
                  "y": 48.83,
                  "label": "Med",
                  "labelPlacement": "hidden"
                },
                {
                  "x": 2.847,
                  "y": 50.94,
                  "label": "High",
                  "labelPlacement": "hidden"
                },
                {
                  "x": 3.0961,
                  "y": 50.62,
                  "label": "Xhigh",
                  "labelPlacement": "hidden"
                },
                {
                  "x": 4.3632,
                  "y": 53.26,
                  "label": "Max",
                  "labelPlacement": "hidden"
                }
              ]
            },
            {
              "id": "gpt56sol",
              "label": "GPT-5.6 Sol",
              "color": "var(--evidence-gray-light)",
              "points": [
                {
                  "x": 1.7476,
                  "y": 35.44,
                  "label": "Low",
                  "labelPlacement": "hidden"
                },
                {
                  "x": 2.4986,
                  "y": 39.93,
                  "label": "Med",
                  "labelPlacement": "hidden"
                },
                {
                  "x": 3.2488,
                  "y": 45.06,
                  "label": "High",
                  "labelPlacement": "hidden"
                },
                {
                  "x": 3.8806,
                  "y": 46.84,
                  "label": "Xhigh",
                  "labelPlacement": "hidden"
                },
                {
                  "x": 4.8477,
                  "y": 47.49,
                  "label": "Max",
                  "labelPlacement": "hidden"
                }
              ]
            }
          ],
          "xAxis": {
            "label": "Cost per task (USD, log scale)",
            "domain": [
              0.35,
              20
            ],
            "ticks": [
              0.5,
              1.0,
              2.0,
              5.0,
              10.0
            ],
            "scale": "log",
            "format": "currency"
          },
          "yAxis": {
            "label": "Score (%)",
            "domain": [
              32,
              58
            ],
            "ticks": [
              35.0,
              40.0,
              45.0,
              50.0,
              55.0
            ],
            "scale": "linear",
            "format": "percent"
          }
        },
        "notes": [
          {
            "id": "note",
            "style": "normal",
            "spans": [
              {
                "text": "FrontierCode measures whether an agent’s code changes would be merged. At default effort (medium), Opus 5.5 scores 54.6%, higher than all other models, beating GPT-6 Astra’s top score (53.3%) for about a fifth of the cost per task.",
                "marks": []
              }
            ]
          }
        ]
      },
      {
        "id": "2d2f6e0e30d4",
        "label": "Agentic coding: CursorBench",
        "chart": {
          "title": "CursorBench 4.0",
          "subtitle": "Accuracy vs Cost",
          "series": [
            {
              "id": "opus55",
              "label": "Opus 5.5",
              "color": "var(--evidence-orange)",
              "points": [
                {
                  "x": 1.18,
                  "y": 43.7,
                  "label": "Low",
                  "labelPlacement": "above"
                },
                {
                  "x": 2.9,
                  "y": 52.5,
                  "label": "Med",
                  "labelPlacement": "below"
                },
                {
                  "x": 3.97,
                  "y": 56.0,
                  "label": "High",
                  "labelPlacement": "above"
                },
                {
                  "x": 6.99,
                  "y": 56.0,
                  "label": "Xhigh",
                  "labelPlacement": "above"
                },
                {
                  "x": 13.43,
                  "y": 57.8,
                  "label": "Max",
                  "labelPlacement": "above"
                }
              ]
            },
            {
              "id": "fable51",
              "label": "Fable 5.1",
              "color": "var(--evidence-green)",
              "points": [
                {
                  "x": 5.44,
                  "y": 45.1,
                  "label": "Low",
                  "labelPlacement": "hidden"
                },
                {
                  "x": 7.05,
                  "y": 46.8,
                  "label": "Med",
                  "labelPlacement": "hidden"
                },
                {
                  "x": 9.08,
                  "y": 49.2,
                  "label": "High",
                  "labelPlacement": "hidden"
                },
                {
                  "x": 13.01,
                  "y": 51.6,
                  "label": "Xhigh",
                  "labelPlacement": "hidden"
                },
                {
                  "x": 17.28,
                  "y": 51.8,
                  "label": "Max",
                  "labelPlacement": "hidden"
                }
              ]
            },
            {
              "id": "opus5",
              "label": "Opus 5",
              "color": "var(--evidence-yellow)",
              "points": [
                {
                  "x": 4.87,
                  "y": 40.7,
                  "label": "Low",
                  "labelPlacement": "hidden"
                },
                {
                  "x": 6.94,
                  "y": 43.3,
                  "label": "Med",
                  "labelPlacement": "hidden"
                },
                {
                  "x": 9.0,
                  "y": 44.7,
                  "label": "High",
                  "labelPlacement": "hidden"
                },
                {
                  "x": 11.43,
                  "y": 46.1,
                  "label": "Xhigh",
                  "labelPlacement": "hidden"
                },
                {
                  "x": 11.95,
                  "y": 46.6,
                  "label": "Max",
                  "labelPlacement": "hidden"
                }
              ]
            },
            {
              "id": "gpt56sol",
              "label": "GPT-5.6 Sol",
              "color": "var(--evidence-gray-light)",
              "points": [
                {
                  "x": 0.87,
                  "y": 24.6,
                  "label": "Low",
                  "labelPlacement": "hidden"
                },
                {
                  "x": 1.77,
                  "y": 31.1,
                  "label": "Med",
                  "labelPlacement": "hidden"
                },
                {
                  "x": 2.85,
                  "y": 35.7,
                  "label": "High",
                  "labelPlacement": "hidden"
                },
                {
                  "x": 4.4,
                  "y": 37.7,
                  "label": "Xhigh",
                  "labelPlacement": "hidden"
                },
                {
                  "x": 8.23,
                  "y": 41.7,
                  "label": "Max",
                  "labelPlacement": "hidden"
                }
              ]
            }
          ],
          "xAxis": {
            "label": "Cost per task (USD, log scale)",
            "domain": [
              0.8,
              30
            ],
            "ticks": [
              1.0,
              2.0,
              5.0,
              10.0,
              20.0
            ],
            "scale": "log",
            "format": "currency"
          },
          "yAxis": {
            "label": "Score (%)",
            "domain": [
              22,
              62
            ],
            "ticks": [
              25.0,
              30.0,
              35.0,
              40.0,
              45.0,
              50.0,
              55.0,
              60.0
            ],
            "scale": "linear",
            "format": "percent"
          }
        },
        "notes": [
          {
            "id": "note",
            "style": "normal",
            "spans": [
              {
                "text": "CursorBench evaluates coding agents on ambiguous, multi-file tasks taken from real Cursor sessions. At default effort (medium), Opus 5.5 scores 52.5%, compared to 51.8% for Fable 5.1 (max) and 46.6% for Opus 5 (max). It beats GPT-5.6 Sol’s top score (41.7%) by 11 points for about a third of the cost per task.",
                "marks": []
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "4d6783769ec3",
    "type": "text",
    "block": {
      "id": "4d6783769ec3",
      "style": "normal",
      "spans": [
        {
          "text": "\n\nOur early testers reported similar efficiency and intelligence gains:",
          "marks": []
        }
      ]
    }
  },
  {
    "id": "c5d912a6394a",
    "type": "testimonials",
    "items": [
      {
        "id": "3cedcb33c375",
        "company": "GitHub",
        "author": "Mario Rodriguez",
        "role": "Chief Product Officer",
        "quote": [
          {
            "id": "0a96ad28f6ac",
            "style": "normal",
            "spans": [
              {
                "text": "“Developers want agents that can take on real software work and finish it. In our testing across GitHub Copilot CLI and VS Code, Claude Opus 5.5 used among the fewest tokens and steps we measured. In VS Code, it solved more terminal tasks than Opus 5 in less than half the steps. More than making individual tasks more efficient, it’s making developers’ bigger projects more achievable.”",
                "marks": []
              }
            ]
          }
        ]
      },
      {
        "id": "b41cd43cf3e6",
        "company": "Clio",
        "author": "Sean Heintz",
        "role": "Staff Software Developer",
        "quote": [
          {
            "id": "dbcfcfd2e11b",
            "style": "normal",
            "spans": [
              {
                "text": "“I handed Claude Opus 5.5 a large engineering task across six of our repositories and let it run overnight, unattended. It stayed on task for over 18 hours defining how our services talk to each other and working out how each one should apply that. Compared with Opus 5, it hit milestones faster and required minimal reworking. Its code comments were short and useful instead of long and prose-heavy. I’m struggling to find anything negative to say.”",
                "marks": []
              }
            ]
          }
        ]
      },
      {
        "id": "b8aeee0e48c8",
        "company": "Lovable",
        "author": "Fabian Hedin",
        "role": "CTO and Co-founder",
        "quote": [
          {
            "id": "450e2e644838",
            "style": "normal",
            "spans": [
              {
                "text": "“For Lovable builders, Opus 5.5 means faster builds with the same quality, whether you’re starting from scratch or working on a live app. It gathers context once, makes fewer and more complete edits, and doesn’t get stuck retrying, finishing in a third to half fewer steps and using significantly fewer tokens along the way.”",
                "marks": []
              }
            ]
          }
        ]
      },
      {
        "id": "8d5a479f924e",
        "company": "Quantium",
        "author": "Harley Barnes",
        "role": "Executive Manager, AI Technology",
        "quote": [
          {
            "id": "428b5838e9d3",
            "style": "normal",
            "spans": [
              {
                "text": "“We tested Claude Opus 5.5 across Chat, Cowork, and Claude Code, the full range of how our teams work. A complex coding task that previously took 38 prompts over four days came in at 11 prompts over three hours, with more production-ready outputs and less rework. For our teams solving complex problems at pace, that means less time iterating and more time interrogating: testing assumptions, pressure-testing outputs, and landing on the best solution for our clients.”",
                "marks": []
              }
            ]
          }
        ]
      },
      {
        "id": "06b42c13a096",
        "company": "Spotify",
        "author": "Aleksandar Mitic",
        "role": "Senior Engineer",
        "quote": [
          {
            "id": "a913643bb323",
            "style": "normal",
            "spans": [
              {
                "text": "“With Claude Opus 5.5, we’ve seen a clear improvement in token efficiency across our internal evaluations, as we’ve been able to complete the same tasks both cheaper and faster.”",
                "marks": []
              }
            ]
          }
        ]
      },
      {
        "id": "4ad688b3a2ae",
        "company": "Optiver",
        "author": "Noyan Tokgozoglu",
        "role": "Global Head of AI Engineering",
        "quote": [
          {
            "id": "a7c1d412d4cb",
            "style": "normal",
            "spans": [
              {
                "text": "“We test models on real engineering and trading-desk work. On our agentic coding tasks, Claude Opus 5.5 matched Opus 5’s quality in about half the turns, time and output tokens, cutting the cost of that workload by 40 to 50%. It posted the highest score we’ve recorded on one desk’s trading-support suite, passing tasks earlier Claude models had failed, and topped all eight models on our analysis task.”",
                "marks": []
              }
            ]
          }
        ]
      },
      {
        "id": "1ec9a5df5172",
        "company": "Column",
        "author": "Mitch Fierro",
        "role": "Engineering",
        "quote": [
          {
            "id": "3b3676f863d7",
            "style": "normal",
            "spans": [
              {
                "text": "“Claude Opus 5.5 delegates to subagents far more effectively and checks its own work in creative ways. Self-verification loops feel easier to set up. It found savings opportunities in our cloud bill that previous models had missed, and in code review it caught a bug by checking external docs for a third-party integration we’d modeled wrong several commits earlier.”",
                "marks": []
              }
            ]
          }
        ]
      },
      {
        "id": "40fde191fcf7",
        "company": "Kiro",
        "author": "Deepak Singh",
        "role": "VP of Agentic AI",
        "quote": [
          {
            "id": "e7aafe82fe0a",
            "style": "normal",
            "spans": [
              {
                "text": "“Every call an agent makes is time and cost a developer feels. On a public benchmark of real command-line tasks, Claude Opus 5.5 solved more than Opus 5 while making about 40% fewer calls and using half the tokens. For developers building with Kiro, that means faster, more affordable agent sessions for routine tasks and complex challenges alike. Opus 5.5 will soon be available in Kiro.”",
                "marks": []
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "42c72dfbab3f",
    "type": "text",
    "block": {
      "id": "42c72dfbab3f",
      "style": "h2",
      "spans": [
        {
          "text": "The most secure coding agent",
          "marks": []
        }
      ]
    }
  },
  {
    "id": "b9721da79047",
    "type": "text",
    "block": {
      "id": "b9721da79047",
      "style": "normal",
      "spans": [
        {
          "text": "Enterprises that use agents within their systems need to know that those agents are operating as intended, particularly when they run autonomously for many hours. Opus 5.5 has a classifier that screens every action before it runs, an open-source sandbox that security teams can audit, and code review that catches vulnerabilities before they merge.",
          "marks": []
        }
      ]
    }
  },
  {
    "id": "7d426451a6fb",
    "type": "text",
    "block": {
      "id": "7d426451a6fb",
      "style": "normal",
      "spans": [
        {
          "text": "The model itself also has stronger defenses. On prompt injection attacks, it matches or beats Opus 5 in every setting we tested, including coding, tool use, computer use, and web browsing. On a benchmark run by the AI security firm Gray Swan, Opus 5.5 ties Fable 5.1 for the lowest prompt injection success rate of any model tested.",
          "marks": []
        }
      ]
    }
  },
  {
    "id": "598657b70b14",
    "type": "text",
    "block": {
      "id": "598657b70b14",
      "style": "h2",
      "spans": [
        {
          "text": "Knowledge work",
          "marks": []
        }
      ]
    }
  },
  {
    "id": "5911c1c720f1",
    "type": "text",
    "block": {
      "id": "5911c1c720f1",
      "style": "normal",
      "spans": [
        {
          "text": "Opus 5.5 is a reliable and adept researcher. In one internal test, we asked Opus 5.5, Fable 5.1, and Opus 5 to write a report on a company’s quarterly performance using only the information it could find on a copy of the web where the earnings release was hard to locate. An automated grader checked every figure and quote against sources. Across different effort settings, 16 out of 18 of Opus 5.5’s reports cleared our quality bar, where any invented figure or quote would have failed. Neither Fable 5.1 nor Opus 5 cleared that bar in any attempt.",
          "marks": []
        }
      ]
    }
  },
  {
    "id": "b0c222d6535b",
    "type": "text",
    "block": {
      "id": "b0c222d6535b",
      "style": "normal",
      "spans": [
        {
          "text": "It’s also strong in financial analysis and business work. Walleye Capital, an investment firm and early tester, reported that Opus 5.5 largely solved their evaluation suite on its lowest setting; on higher settings, it performed even better, noticing an error in their evaluation instructions and correcting for it. No other model had caught this error before.",
          "marks": []
        }
      ]
    }
  },
  {
    "id": "2001248a3157",
    "type": "text",
    "block": {
      "id": "2001248a3157",
      "style": "normal",
      "spans": [
        {
          "text": "In another test, we tasked both Opus 5.5 and Opus 5 with analyzing a proposed merger between two fictional HR software companies. Each built a financial model in Excel, then turned it into an executive presentation on whether the deal made sense at its price. Both models reached the same conclusions about the deal, but Opus 5.5’s model was more thorough and its presentation easier to read, while Opus 5’s had minor errors. Opus 5.5 finished in 63 minutes compared to 93 for Opus 5, and cost 50% less to produce.",
          "marks": []
        }
      ]
    }
  },
  {
    "id": "e1b4b577729b",
    "type": "text",
    "block": {
      "id": "e1b4b577729b",
      "style": "normal",
      "spans": [
        {
          "text": "On knowledge work evaluations, Opus 5.5 outperforms other models while also using fewer tokens. On GDPval-AA v2.1, a test of real-world work across 44 occupations, Opus 5.5 scores 1846 Elo, ahead of Fable 5.1 and Opus 5. At default effort (medium), Opus 5.5 beats GPT-6 Astra at max effort for about a fifth of the cost per task. It likewise outperformed other models on benchmarks measuring business workflows and large-scale data collection.",
          "marks": []
        }
      ]
    }
  },
  {
    "id": "ab3c85d1d836",
    "type": "charts",
    "tabs": [
      {
        "id": "10bb7f0a4d5e",
        "label": "GDPval-AA v2.1",
        "chart": {
          "title": "GDPval-AA v2.1",
          "subtitle": "Elo vs Cost",
          "series": [
            {
              "id": "opus55",
              "label": "Opus 5.5",
              "color": "var(--evidence-orange)",
              "points": [
                {
                  "x": 0.2137,
                  "y": 1224.0,
                  "label": "Low",
                  "labelPlacement": "below"
                },
                {
                  "x": 0.8563,
                  "y": 1576.0,
                  "label": "Med",
                  "labelPlacement": "above"
                },
                {
                  "x": 1.5424,
                  "y": 1692.0,
                  "label": "High",
                  "labelPlacement": "above"
                },
                {
                  "x": 4.2104,
                  "y": 1820.0,
                  "label": "Xhigh",
                  "labelPlacement": "above"
                },
                {
                  "x": 8.9154,
                  "y": 1846.0,
                  "label": "Max",
                  "labelPlacement": "above"
                }
              ]
            },
            {
              "id": "fable51",
              "label": "Fable 5.1",
              "color": "var(--evidence-green)",
              "points": [
                {
                  "x": 1.4147,
                  "y": 1450.0,
                  "label": "Low",
                  "labelPlacement": "hidden"
                },
                {
                  "x": 2.1682,
                  "y": 1536.0,
                  "label": "Med",
                  "labelPlacement": "hidden"
                },
                {
                  "x": 3.4287,
                  "y": 1617.0,
                  "label": "High",
                  "labelPlacement": "hidden"
                },
                {
                  "x": 7.0862,
                  "y": 1721.0,
                  "label": "Xhigh",
                  "labelPlacement": "hidden"
                },
                {
                  "x": 9.5863,
                  "y": 1735.0,
                  "label": "Max",
                  "labelPlacement": "hidden"
                }
              ]
            },
            {
              "id": "opus5",
              "label": "Opus 5",
              "color": "var(--evidence-yellow)",
              "points": [
                {
                  "x": 0.5817,
                  "y": 1294.0,
                  "label": "Low",
                  "labelPlacement": "hidden"
                },
                {
                  "x": 1.3639,
                  "y": 1476.0,
                  "label": "Med",
                  "labelPlacement": "hidden"
                },
                {
                  "x": 3.0266,
                  "y": 1581.0,
                  "label": "High",
                  "labelPlacement": "hidden"
                },
                {
                  "x": 4.962,
                  "y": 1676.0,
                  "label": "Xhigh",
                  "labelPlacement": "hidden"
                },
                {
                  "x": 6.7647,
                  "y": 1708.0,
                  "label": "Max",
                  "labelPlacement": "hidden"
                }
              ]
            },
            {
              "id": "gpt6astra",
              "label": "GPT-6 Astra",
              "color": "var(--evidence-gray)",
              "points": [
                {
                  "x": 0.8545,
                  "y": 1366.0,
                  "label": "Low",
                  "labelPlacement": "hidden"
                },
                {
                  "x": 1.8223,
                  "y": 1468.0,
                  "label": "Med",
                  "labelPlacement": "hidden"
                },
                {
                  "x": 2.4321,
                  "y": 1485.0,
                  "label": "High",
                  "labelPlacement": "hidden"
                },
                {
                  "x": 3.038,
                  "y": 1516.0,
                  "label": "Xhigh",
                  "labelPlacement": "hidden"
                },
                {
                  "x": 4.5293,
                  "y": 1542.0,
                  "label": "Max",
                  "labelPlacement": "hidden"
                }
              ]
            },
            {
              "id": "gpt56sol",
              "label": "GPT-5.6 Sol",
              "color": "var(--evidence-gray-light)",
              "points": [
                {
                  "x": 0.2677,
                  "y": 1289.0,
                  "label": "Low",
                  "labelPlacement": "hidden"
                },
                {
                  "x": 0.5954,
                  "y": 1403.0,
                  "label": "Med",
                  "labelPlacement": "hidden"
                },
                {
                  "x": 1.106,
                  "y": 1480.0,
                  "label": "High",
                  "labelPlacement": "hidden"
                },
                {
                  "x": 1.7042,
                  "y": 1548.0,
                  "label": "Xhigh",
                  "labelPlacement": "hidden"
                },
                {
                  "x": 2.8099,
                  "y": 1588.0,
                  "label": "Max",
                  "labelPlacement": "hidden"
                }
              ]
            }
          ],
          "xAxis": {
            "label": "Estimated cost per task (USD, log scale)",
            "domain": [
              0.18,
              12
            ],
            "ticks": [
              0.2,
              0.5,
              1.0,
              2.0,
              5.0,
              10.0
            ],
            "scale": "log",
            "format": "currency"
          },
          "yAxis": {
            "label": "Elo",
            "domain": [
              1150,
              1900
            ],
            "ticks": [
              1200.0,
              1300.0,
              1400.0,
              1500.0,
              1600.0,
              1700.0,
              1800.0
            ],
            "scale": "linear",
            "format": "number"
          }
        },
        "notes": [
          {
            "id": "note",
            "style": "normal",
            "spans": [
              {
                "text": "Artificial Analysis’s GDPval-AA v2.1 evaluates agents on real-world professional work across 44 occupations. At max effort, Opus 5.5 scores 1846 Elo, where Fable 5.1 scores 1735 and Opus 5 scores 1708. At default effort (medium), Opus 5.5 beats GPT-6 Astra at max effort for about a fifth of the cost per task.",
                "marks": []
              }
            ]
          }
        ]
      },
      {
        "id": "8084b5934111",
        "label": "AutomationBench",
        "chart": {
          "title": "AutomationBench",
          "subtitle": "Accuracy vs Cost",
          "series": [
            {
              "id": "opus55",
              "label": "Opus 5.5",
              "color": "var(--evidence-orange)",
              "points": [
                {
                  "x": 0.5,
                  "y": 23.3,
                  "label": "Low",
                  "labelPlacement": "above"
                },
                {
                  "x": 0.64,
                  "y": 28.6,
                  "label": "Med",
                  "labelPlacement": "below"
                },
                {
                  "x": 0.7,
                  "y": 32.0,
                  "label": "High",
                  "labelPlacement": "above"
                },
                {
                  "x": 0.86,
                  "y": 34.4,
                  "label": "Xhigh",
                  "labelPlacement": "above"
                },
                {
                  "x": 1.37,
                  "y": 40.0,
                  "label": "Max",
                  "labelPlacement": "above"
                }
              ]
            },
            {
              "id": "opus5",
              "label": "Opus 5",
              "color": "var(--evidence-yellow)",
              "points": [
                {
                  "x": 0.75,
                  "y": 20.4,
                  "label": "Low",
                  "labelPlacement": "hidden"
                },
                {
                  "x": 0.89,
                  "y": 23.9,
                  "label": "Med",
                  "labelPlacement": "hidden"
                },
                {
                  "x": 1.03,
                  "y": 20.6,
                  "label": "High",
                  "labelPlacement": "hidden"
                },
                {
                  "x": 1.15,
                  "y": 25.3,
                  "label": "Xhigh",
                  "labelPlacement": "hidden"
                },
                {
                  "x": 1.27,
                  "y": 26.9,
                  "label": "Max",
                  "labelPlacement": "hidden"
                }
              ]
            },
            {
              "id": "gpt6astra",
              "label": "GPT-6 Astra",
              "color": "var(--evidence-gray)",
              "points": [
                {
                  "x": 1.08,
                  "y": 30.3,
                  "label": "Low",
                  "labelPlacement": "hidden"
                },
                {
                  "x": 1.28,
                  "y": 34.1,
                  "label": "Med",
                  "labelPlacement": "hidden"
                },
                {
                  "x": 1.45,
                  "y": 37.1,
                  "label": "High",
                  "labelPlacement": "hidden"
                },
                {
                  "x": 1.53,
                  "y": 39.0,
                  "label": "Xhigh",
                  "labelPlacement": "hidden"
                },
                {
                  "x": 1.77,
                  "y": 41.4,
                  "label": "Max",
                  "labelPlacement": "hidden"
                }
              ]
            },
            {
              "id": "gpt56sol",
              "label": "GPT-5.6 Sol",
              "color": "var(--evidence-gray-light)",
              "points": [
                {
                  "x": 0.42,
                  "y": 11.7,
                  "label": "Low",
                  "labelPlacement": "hidden"
                },
                {
                  "x": 0.57,
                  "y": 19.6,
                  "label": "Med",
                  "labelPlacement": "hidden"
                },
                {
                  "x": 0.64,
                  "y": 24.8,
                  "label": "High",
                  "labelPlacement": "hidden"
                },
                {
                  "x": 0.74,
                  "y": 26.3,
                  "label": "Xhigh",
                  "labelPlacement": "hidden"
                },
                {
                  "x": 0.91,
                  "y": 28.8,
                  "label": "Max",
                  "labelPlacement": "hidden"
                }
              ]
            }
          ],
          "xAxis": {
            "label": "Cost per task (USD, log scale)",
            "domain": [
              0.38,
              2.1
            ],
            "ticks": [
              0.5,
              1.0,
              2.0
            ],
            "scale": "log",
            "format": "currency"
          },
          "yAxis": {
            "label": "Pass rate (%)",
            "domain": [
              0,
              45
            ],
            "ticks": [
              0.0,
              10.0,
              20.0,
              30.0,
              40.0
            ],
            "scale": "linear",
            "format": "percent"
          }
        },
        "notes": [
          {
            "id": "note",
            "style": "normal",
            "spans": [
              {
                "text": "AutomationBench, built by Zapier, tests whether an agent can carry out real business workflows across many connected apps. Opus 5.5 outscores Opus 5 and GPT-5.6 Sol at every effort level.",
                "marks": []
              }
            ]
          }
        ]
      },
      {
        "id": "430c7aca0d7c",
        "label": "WANDR",
        "chart": {
          "title": "WANDR",
          "subtitle": "Accuracy vs Cost",
          "series": [
            {
              "id": "opus55",
              "label": "Opus 5.5",
              "color": "var(--evidence-orange)",
              "points": [
                {
                  "x": 1.2,
                  "y": 31.2,
                  "label": "Low",
                  "labelPlacement": "above"
                },
                {
                  "x": 11.2,
                  "y": 62.8,
                  "label": "Med",
                  "labelPlacement": "above"
                },
                {
                  "x": 16.88,
                  "y": 67.3,
                  "label": "High",
                  "labelPlacement": "above"
                },
                {
                  "x": 29.06,
                  "y": 71.3,
                  "label": "Xhigh",
                  "labelPlacement": "above"
                },
                {
                  "x": 37.92,
                  "y": 72.3,
                  "label": "Max",
                  "labelPlacement": "above"
                }
              ]
            },
            {
              "id": "fable51",
              "label": "Fable 5.1",
              "color": "var(--evidence-green)",
              "points": [
                {
                  "x": 23.25,
                  "y": 63.3,
                  "label": "Low",
                  "labelPlacement": "hidden"
                },
                {
                  "x": 27.41,
                  "y": 64.5,
                  "label": "Med",
                  "labelPlacement": "hidden"
                },
                {
                  "x": 33.62,
                  "y": 66.7,
                  "label": "High",
                  "labelPlacement": "hidden"
                },
                {
                  "x": 42.81,
                  "y": 67.7,
                  "label": "Xhigh",
                  "labelPlacement": "hidden"
                },
                {
                  "x": 49.02,
                  "y": 68.7,
                  "label": "Max",
                  "labelPlacement": "hidden"
                }
              ]
            },
            {
              "id": "opus5",
              "label": "Opus 5",
              "color": "var(--evidence-yellow)",
              "points": [
                {
                  "x": 10.65,
                  "y": 50.5,
                  "label": "Low",
                  "labelPlacement": "hidden"
                },
                {
                  "x": 23.97,
                  "y": 58.1,
                  "label": "Med",
                  "labelPlacement": "hidden"
                },
                {
                  "x": 43.49,
                  "y": 64.6,
                  "label": "High",
                  "labelPlacement": "hidden"
                },
                {
                  "x": 53.84,
                  "y": 67.0,
                  "label": "Xhigh",
                  "labelPlacement": "hidden"
                },
                {
                  "x": 61.62,
                  "y": 67.2,
                  "label": "Max",
                  "labelPlacement": "hidden"
                }
              ]
            }
          ],
          "xAxis": {
            "label": "Cost per attempt (USD, log scale)",
            "domain": [
              1,
              70
            ],
            "ticks": [
              1.0,
              2.0,
              5.0,
              10.0,
              20.0,
              50.0
            ],
            "scale": "log",
            "format": "currency"
          },
          "yAxis": {
            "label": "Score (%)",
            "domain": [
              25,
              78
            ],
            "ticks": [
              30.0,
              40.0,
              50.0,
              60.0,
              70.0
            ],
            "scale": "linear",
            "format": "percent"
          }
        },
        "notes": [
          {
            "id": "note",
            "style": "left",
            "spans": [
              {
                "text": "Perplexity’s WANDR benchmark measures agents on large data collection tasks. Opus 5.5 outperforms Fable 5.1 and Opus 5 at a lower cost per task",
                "marks": []
              },
              {
                "text": "4",
                "marks": [
                  "sup"
                ]
              },
              {
                "text": ".",
                "marks": []
              }
            ]
          },
          {
            "id": "60888dee615c",
            "style": "left",
            "spans": [
              {
                "text": "4",
                "marks": [
                  "sup"
                ]
              },
              {
                "text": "WANDR:",
                "marks": [
                  "strong"
                ]
              },
              {
                "text": " Claude models were run with offline versions of the web search and web fetch tools, programmatic tool calling, code execution, and a 980k-token task budget. This differs from Perplexity’s published setup, scores are not directly comparable across the two and we only show models scored under the same conditions.",
                "marks": []
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "72a8b2177149",
    "type": "text",
    "block": {
      "id": "72a8b2177149",
      "style": "normal",
      "spans": [
        {
          "text": "\n\nOur customers have reported similar results. Here’s what they told us about working with the model:\n\n",
          "marks": []
        }
      ]
    }
  },
  {
    "id": "253d2f0df583",
    "type": "testimonials",
    "items": [
      {
        "id": "1ae2c29f7fc0",
        "company": "Deloitte Consulting LLP",
        "author": "Carl Bennett",
        "role": "CIO",
        "quote": [
          {
            "id": "9ed7f1378fbd",
            "style": "normal",
            "spans": [
              {
                "text": "“Even at its lowest effort setting, Claude Opus 5.5 caught 72% of known bugs in our code reviews to Opus 5’s 56% at high effort, with fewer false alarms and a fraction of the output. On US consulting analysis, low thinking effort matched its higher thinking settings on half the output and passed our quality checks. When more lower thinking efforts are deployed in production, that’s client-ready work delivered efficiently.”",
                "marks": []
              }
            ]
          }
        ]
      },
      {
        "id": "157289bfcdae",
        "company": "Rogo",
        "author": "Strib Walker",
        "role": "Head of Product",
        "quote": [
          {
            "id": "6397ced9c9a8",
            "style": "normal",
            "spans": [
              {
                "text": "“Financial firms need outputs that are consistently correct. At its lowest effort setting, Claude Opus 5.5 beat Opus 5 at high effort on our BigFinance Bench with about 60% fewer output tokens. Its answers are shorter and better structured, and its slides come out denser, more in line with industry standards.”",
                "marks": []
              }
            ]
          }
        ]
      },
      {
        "id": "5269cc9f1b60",
        "company": "LexisNexis Legal & Professional",
        "author": "Min Chen",
        "role": "Chief AI Officer",
        "quote": [
          {
            "id": "16325004ff1b",
            "style": "normal",
            "spans": [
              {
                "text": "“Evaluating new models is central to the multi-model approach behind the LexisNexis Legal Intelligence Engine. In our initial evaluations, Claude Opus 5.5 identified highly relevant citations consistently, demonstrated strength with statutes, and structured its answers around the central legal frameworks and key issues. These are the kinds of capabilities we look for to help our customers accomplish more with Lexis+ with Protégé.”",
                "marks": []
              }
            ]
          }
        ]
      },
      {
        "id": "b2938613e198",
        "company": "Walleye Capital",
        "author": "Frank Corrao",
        "role": "Head of Central Equity Quant Research Engineering",
        "quote": [
          {
            "id": "d324f0d5da74",
            "style": "normal",
            "spans": [
              {
                "text": "“In quant research, one wrong assumption can undermine a result. At its lowest effort setting, Claude Opus 5.5 largely solved our evaluation task. At higher settings, it went even further: it detected that the minute indexing in our own instructions was off by one and corrected for it, noting that this would cost it points with the grader. It was right, and no model we’ve tested had caught and acted on that before.”",
                "marks": []
              }
            ]
          }
        ]
      },
      {
        "id": "0816d6ce6847",
        "company": "Hex",
        "author": "Izzy Miller",
        "role": "AI Engineer",
        "quote": [
          {
            "id": "b8bf95b90cb6",
            "style": "normal",
            "spans": [
              {
                "text": "“As models get better at data work, we’re seeing more convincing-sounding conclusions the data doesn’t support. Claude Opus 5.5 keeps digging past the first plausible answer. One task in our DataBench benchmark asks whether packages were late or tracking was just slow. Opus 5 checked delivery confirmations and called tracking healthy. Opus 5.5 found the packages were late and tracking was broken too. We’re bringing it into the Hex agent for this work.”",
                "marks": []
              }
            ]
          }
        ]
      },
      {
        "id": "7b2b32a775c7",
        "company": "Thomson Reuters Labs",
        "author": "Omar Bari",
        "role": "VP Applied Research",
        "quote": [
          {
            "id": "eca4a45a8382",
            "style": "normal",
            "spans": [
              {
                "text": "“CoCounsel combines multiple models with our content and expertise for complex legal work. With Claude Opus 5.5, we’re seeing better results in our expert evaluations and on our internal benchmarks, alongside gains in speed and token efficiency. We’re excited for customers to experience that difference in the back-and-forth with CoCounsel as a sounding board, weighing evidence and refining their thinking in ways benchmarks don’t fully capture.”",
                "marks": []
              }
            ]
          }
        ]
      },
      {
        "id": "c4c7948252fb",
        "company": "Hebbia",
        "author": "Aabhas Sharma",
        "role": "CTO",
        "quote": [
          {
            "id": "9dc431f8065b",
            "style": "normal",
            "spans": [
              {
                "text": "“On end-to-end finance workflows graded against expert rubrics, Claude Opus 5.5 covered 86.6% of what we look for versus 60.3% for Opus 5. On retrieval evals, it achieved our best-ever citation recall with better token efficiency than Opus 5, which keeps our cost per research task in check.”",
                "marks": []
              }
            ]
          }
        ]
      },
      {
        "id": "872ebbef3868",
        "company": "Viktor",
        "author": "Peter Albert",
        "role": "Co-Founder",
        "quote": [
          {
            "id": "46c0c0743025",
            "style": "normal",
            "spans": [
              {
                "text": "“Viktor is an AI employee that lives in Slack and Microsoft Teams, so every step he takes shows up in our costs. At the same effort, Claude Opus 5.5 needs fewer steps and tool calls per task than Opus 5 and costs nearly half as much, while getting twice as many of our hardest tasks right.”",
                "marks": []
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "837b6526dd6c",
    "type": "text",
    "block": {
      "id": "837b6526dd6c",
      "style": "h2",
      "spans": [
        {
          "text": "Communication",
          "marks": []
        }
      ]
    }
  },
  {
    "id": "030cf318da6f",
    "type": "text",
    "block": {
      "id": "030cf318da6f",
      "style": "normal",
      "spans": [
        {
          "text": "We’ve made major improvements to the way Opus 5.5 writes and communicates, one of the most common areas of feedback we heard about Opus 5. Its messages are much easier to understand at a glance, which testers said helped during long working sessions. It puts the most important information up front, is less likely to use jargon or idiosyncratic phrases, and follows the writing rules you give it. We find that this makes Opus 5.5 a noticeably better collaborator. Here’s a side-by-side comparison of the two models:",
          "marks": []
        }
      ]
    }
  },
  {
    "id": "0bbab7062619",
    "type": "responses",
    "examples": [
      {
        "id": "9ae8d84b0652",
        "label": "Explaining a bug",
        "prompt": "Please explain the issue to me.",
        "left": {
          "label": "Opus 5.5",
          "blocks": [
            {
              "id": "e53f601e8739",
              "style": "normal",
              "spans": [
                {
                  "text": "The extra drop is a bug in the billing refactor",
                  "marks": [
                    "strong"
                  ]
                }
              ]
            },
            {
              "id": "8e2de43404d1",
              "style": "normal",
              "spans": [
                {
                  "text": "The free-tier change accounts for only ",
                  "marks": []
                },
                {
                  "text": "$1.50",
                  "marks": [
                    "strong"
                  ]
                },
                {
                  "text": " of acme’s August drop. The other ",
                  "marks": []
                },
                {
                  "text": "$9.92",
                  "marks": [
                    "strong"
                  ]
                },
                {
                  "text": " comes from a bug in commit ",
                  "marks": []
                },
                {
                  "text": "0552feb",
                  "marks": [
                    "code"
                  ]
                },
                {
                  "text": ". That commit was labelled “No behaviour change,” but it stops counting usage from the last day of the month.",
                  "marks": []
                }
              ]
            },
            {
              "id": "929aaa5c25c4",
              "style": "normal",
              "spans": [
                {
                  "text": "What changed",
                  "marks": [
                    "strong"
                  ]
                }
              ]
            },
            {
              "id": "ba47d1ba5923",
              "style": "normal",
              "spans": [
                {
                  "text": "Before the merge, ",
                  "marks": []
                },
                {
                  "text": "aggregate.py",
                  "marks": [
                    "code"
                  ]
                },
                {
                  "text": " used a half-open interval:",
                  "marks": []
                }
              ]
            },
            {
              "id": "36cf7eaef80e",
              "code": "start <= e.ts < next_month_start(year, month)    # [Aug 1 00:00, Sep 1 00:00)",
              "spans": []
            },
            {
              "id": "a6b96d0a598d",
              "style": "normal",
              "spans": [
                {
                  "text": "The refactor moved this into ",
                  "marks": []
                },
                {
                  "text": "Period.contains",
                  "marks": [
                    "code"
                  ]
                },
                {
                  "text": " and made the interval closed on the wrong boundary:",
                  "marks": []
                }
              ]
            },
            {
              "id": "24f901ea3b2e",
              "code": "last_day = next_month_start(...) - timedelta(days=1)    # = 2026-08-31T00:00:00Z\nreturn self.first_day <= ts <= self.last_day",
              "spans": []
            },
            {
              "id": "177bec6c5b99",
              "style": "normal",
              "spans": [
                {
                  "text": "last_day",
                  "marks": [
                    "code"
                  ]
                },
                {
                  "text": " is a timestamp at midnight, not a whole day. So every event after ",
                  "marks": []
                },
                {
                  "text": "2026-08-31T00:00:00Z",
                  "marks": [
                    "code"
                  ]
                },
                {
                  "text": " is excluded. The September period starts Sep 1, so it doesn’t pick these events up either. The usage isn’t moved to another month; it’s never billed at all.",
                  "marks": []
                }
              ]
            }
          ]
        },
        "right": {
          "label": "Opus 5",
          "blocks": [
            {
              "id": "7f4453ce0e40",
              "style": "normal",
              "spans": [
                {
                  "text": "What I found",
                  "marks": [
                    "strong"
                  ]
                }
              ]
            },
            {
              "id": "bf7be6c25692",
              "style": "normal",
              "spans": [
                {
                  "text": "The extra drop isn’t the free tier — it’s a regression in ",
                  "marks": []
                },
                {
                  "text": "0552feb",
                  "marks": [
                    "code"
                  ]
                },
                {
                  "text": " (“extract billing period boundaries into periods.py”, labelled “No behaviour change”).",
                  "marks": []
                }
              ]
            },
            {
              "id": "c3cbd9dec69d",
              "style": "normal",
              "spans": [
                {
                  "text": "The bug",
                  "marks": [
                    "strong"
                  ]
                }
              ]
            },
            {
              "id": "1d7c72e38c60",
              "style": "normal",
              "spans": [
                {
                  "text": "aggregate.monthly_usage",
                  "marks": [
                    "code"
                  ]
                },
                {
                  "text": " used to do a half-open interval:",
                  "marks": []
                }
              ]
            },
            {
              "id": "75a9049ce104",
              "code": "start, end = month_start(year, month), next_month_start(year, month)\nif start <= e.ts < end:",
              "spans": []
            },
            {
              "id": "8e022ba802df",
              "style": "normal",
              "spans": [
                {
                  "text": "It now does:",
                  "marks": []
                }
              ]
            },
            {
              "id": "3da46959f7bd",
              "code": "if period.contains(e.ts)",
              "spans": []
            },
            {
              "id": "9031244e09a6",
              "style": "normal",
              "spans": [
                {
                  "text": "and in ",
                  "marks": []
                },
                {
                  "text": "periods.py",
                  "marks": [
                    "code"
                  ]
                },
                {
                  "text": ":",
                  "marks": []
                }
              ]
            },
            {
              "id": "255cc2fadcd5",
              "code": "@property\ndef last_day(self) -> datetime:\n    return next_month_start(...) - timedelta(days=1)   # 2026-08-31 00:00:00 UTC\n\ndef contains(self, ts):\n    return self.first_day <= ts <= self.last_day",
              "spans": []
            },
            {
              "id": "bb6fdbb04bd2",
              "style": "normal",
              "spans": [
                {
                  "text": "last_day",
                  "marks": [
                    "code"
                  ]
                },
                {
                  "text": " is a datetime at midnight, not a whole day. Subtracting one day from Sep 1 00:00 gives Aug 31 ",
                  "marks": []
                },
                {
                  "text": "00:00",
                  "marks": [
                    "strong"
                  ]
                },
                {
                  "text": ", and the comparison is inclusive, so the period effectively ends at the first instant of the 31st. ",
                  "marks": []
                },
                {
                  "text": "Every event timestamped after midnight on the last day of the month is silently dropped",
                  "marks": [
                    "strong"
                  ]
                },
                {
                  "text": " — roughly one day of usage per account, per month.",
                  "marks": []
                }
              ]
            },
            {
              "id": "e20b452c85aa",
              "style": "normal",
              "spans": [
                {
                  "text": "The new ",
                  "marks": []
                },
                {
                  "text": "test_periods.py",
                  "marks": [
                    "code"
                  ]
                },
                {
                  "text": " doesn’t catch it because it only checks ",
                  "marks": []
                },
                {
                  "text": "last_day.date()",
                  "marks": [
                    "code"
                  ]
                },
                {
                  "text": " (which is correctly ",
                  "marks": []
                },
                {
                  "text": "2026-08-31",
                  "marks": [
                    "code"
                  ]
                },
                {
                  "text": ") and tests ",
                  "marks": []
                },
                {
                  "text": "contains",
                  "marks": [
                    "code"
                  ]
                },
                {
                  "text": " at Aug 1 00:00, Aug 15 12:00, Jul 31 23:59 and Sep 1 00:00 — it never probes anywhere inside the 31st.",
                  "marks": []
                }
              ]
            }
          ]
        }
      },
      {
        "id": "c6a65dd43ec4",
        "label": "Summarizing a thread",
        "prompt": "Summarize this Slack thread for my manager in three bullet points:\n\n[09:41] Dana Osei: I’ll tell them. I’ll also confirm nobody else reads the Friday file.\n[09:43] Marcus Webb: I can move the schedule, it’s a one-line cron change. But not until Dana confirms.\n[10:02] Dana Osei: Finance says the Friday file is only used Monday. Sunday night is fine.",
        "left": {
          "label": "Opus 5.5",
          "blocks": [
            {
              "id": "2a5c207d620e",
              "style": "normal",
              "spans": [
                {
                  "text": "Problem:",
                  "marks": [
                    "strong"
                  ]
                },
                {
                  "text": " The Friday orders export has failed twice this month. The warehouse query times out after 2 hours because order volume is up ~40% since the summer sale. As a result, Finance was missing weekend numbers for their Monday 9am review.",
                  "marks": []
                }
              ]
            },
            {
              "id": "17078acb051f",
              "style": "normal",
              "spans": [
                {
                  "text": "Immediate fixes:",
                  "marks": [
                    "strong"
                  ]
                },
                {
                  "text": " The export will move to Sunday 10pm starting next week, and the Friday run will be dropped (Marcus). Finance has confirmed this works for them (Dana). The ops dashboard tile that depended on the Friday file now reads from the live table (Sam, done). A failure alert now pages the on-call channel (Priya, done and tested). For this Friday only, Marcus will increase the warehouse slot as a ~$300 one-off stopgap, which Dana approved.",
                  "marks": []
                }
              ]
            },
            {
              "id": "801d3014ac04",
              "style": "normal",
              "spans": [
                {
                  "text": "Longer-term fix:",
                  "marks": [
                    "strong"
                  ]
                },
                {
                  "text": " Ji-woo will rewrite the query to process only new orders, re-scanning the last 3 days to catch late arrivals. This should cut runtime from hours to minutes. The work will take ~2 weeks including testing, with a design doc due for review by Thursday.",
                  "marks": []
                }
              ]
            }
          ]
        },
        "right": {
          "label": "Opus 5",
          "blocks": [
            {
              "id": "30f497c9d97b",
              "style": "normal",
              "spans": [
                {
                  "text": "Friday orders export — #data-platform, Tuesday",
                  "marks": [
                    "strong"
                  ]
                }
              ]
            },
            {
              "id": "a655756799b4",
              "style": "normal",
              "spans": [
                {
                  "text": "Problem:",
                  "marks": [
                    "strong"
                  ]
                },
                {
                  "text": " The Friday orders export timed out again (second failure this month) after running 2h on the warehouse query; order volume is up ~40% since the summer sale. Finance was left without weekend numbers for their Monday 9am review, and both failures only surfaced on Monday.",
                  "marks": []
                }
              ]
            },
            {
              "id": "c822ae8cb3e2",
              "style": "normal",
              "spans": [
                {
                  "text": "Fixed same day:",
                  "marks": [
                    "strong"
                  ]
                },
                {
                  "text": " The Saturday ops dashboard tile was repointed to read the live table instead of the export (Sam), finance confirmed the Friday file is only used on Mondays (Dana), a failure alert now pages the on-call channel (Priya), and the export moves to Sunday 10pm from next week with the Friday run dropped (Marcus). A one-off ~$300 warehouse upgrade covers this Friday as a stopgap.",
                  "marks": []
                }
              ]
            },
            {
              "id": "ef16d7d165e0",
              "style": "normal",
              "spans": [
                {
                  "text": "Still in progress:",
                  "marks": [
                    "strong"
                  ]
                },
                {
                  "text": " Ji-woo owns rewriting the query to run incrementally (re-scanning the last 3 days to catch late-arriving orders), expected to cut runtime from hours to minutes — design doc Thursday, roughly two weeks including testing. The schedule change buys time in the meantime.",
                  "marks": []
                }
              ]
            }
          ]
        }
      },
      {
        "id": "a96ede567a74",
        "label": "Explaining a design change",
        "prompt": "Write Python that reads a chess position (FEN) and lists which pieces are under attack. Use TensorFlow for speed. Here's my design: build an 8x8 tensor board, generate an attack map for each piece type from its movement pattern, and flag opposing pieces on attacked squares. Change anything you think is wrong, and in your final summary explain each change you made and why.",
        "left": {
          "label": "Opus 5.5",
          "blocks": [
            {
              "id": "745c0cea298e",
              "style": "normal",
              "spans": [
                {
                  "text": "Blocked lines (bishops, rooks, queens). A fixed mask can't say “stop at the first piece in the way.” I added a second stack of masks marking the squares strictly between every two squares on the same line. One matrix multiply with the board's occupancy counts the blockers on every line at once, and an attack survives only if that count is zero. Knights and single steps have nothing between them, so one rule covers every piece.",
                  "marks": []
                }
              ]
            }
          ]
        },
        "right": {
          "label": "Opus 5",
          "blocks": [
            {
              "id": "1abbb462e3ce",
              "style": "normal",
              "spans": [
                {
                  "text": "tf.math.cumsum",
                  "marks": [
                    "code"
                  ]
                },
                {
                  "text": " replaces the bit scan. The geometry is unrolled into ",
                  "marks": []
                },
                {
                  "text": "ray_targets[square, direction, step]",
                  "marks": [
                    "code"
                  ]
                },
                {
                  "text": " — an ordered walk outwards. An exclusive cumsum over the step axis counts blockers strictly before each step, so the first blocker on a ray is the single step that is blocking with nothing blocking before it. This is the vectorized form of the bit scan a bitboard engine uses. I did look at ",
                  "marks": []
                },
                {
                  "text": "bitwise_ops",
                  "marks": [
                    "code"
                  ]
                },
                {
                  "text": " for true 64-bit bitboards — population_count exists, but hyperbola-quintessence needs a byte-reverse primitive TF doesn't expose, so it would have fallen back to per-direction loops anyway.",
                  "marks": []
                }
              ]
            }
          ]
        }
      }
    ]
  },
  {
    "id": "df7583bb449c",
    "type": "text",
    "block": {
      "id": "df7583bb449c",
      "style": "normal",
      "spans": [
        {
          "text": "\nOur customers’ feedback supports these findings:",
          "marks": []
        }
      ]
    }
  },
  {
    "id": "68761a69de1e",
    "type": "testimonials",
    "items": [
      {
        "id": "f548b21fa3a2",
        "company": "Ramp",
        "author": "John Ruelas",
        "role": "Staff Software Engineer",
        "quote": [
          {
            "id": "dcdd93cd9414",
            "style": "normal",
            "spans": [
              {
                "text": "“Verbose, hard-to-follow output has been my biggest frustration with frontier models, and Claude Opus 5.5 fixes it. It writes like a good colleague, and follows our writing rules. A design spec came out usable with very minimal edits, and when it rewrote one of our prompts I preferred its version to my own. When it optimized our test suite, I could follow its reasoning easily and shipped the change with confidence.”",
                "marks": []
              }
            ]
          }
        ]
      },
      {
        "id": "6dc73a10df56",
        "company": "Stripe",
        "author": "Cristian Rivera",
        "role": "Staff Software Engineer",
        "quote": [
          {
            "id": "5c3eb89e00c5",
            "style": "normal",
            "spans": [
              {
                "text": "“I run long Claude Code sessions every day. On a multi-day rebase of 40 stacked pull requests, one Claude Opus 5.5 session directed a dozen more sessions and laid out every conflict plainly. On the calls that it held, it framed them clearly that after hours away I could answer in minutes. All 40 passed CI the next afternoon. It’s a substantial upgrade over Opus 5.”",
                "marks": []
              }
            ]
          }
        ]
      },
      {
        "id": "71e513fef3a2",
        "company": "Box",
        "author": "Yashodha Bhavnani",
        "role": "VP of AI Products",
        "quote": [
          {
            "id": "c3a3e0f8be98",
            "style": "normal",
            "spans": [
              {
                "text": "“Our customers use Box AI on enormous amounts of content, so speed and cost are a top priority. In our evaluations, Claude Opus 5.5 used a third of the tokens Opus 5 did, and its answers were 40% less verbose without losing accuracy. We expect that to matter a lot for teams running agents across their content in areas like financial services and the public sector.”",
                "marks": []
              }
            ]
          }
        ]
      },
      {
        "id": "5e688c3892e2",
        "company": "Chicago Trading Company",
        "author": "Austen Tomek",
        "role": "Principal Engineer",
        "quote": [
          {
            "id": "6faae826ed9e",
            "style": "normal",
            "spans": [
              {
                "text": "“Overnight, Claude Opus 5.5 autonomously handled a bug in our Lakehouse services layer that I hadn’t had time to diagnose. It investigated, designed the fix, and implemented it on its own. By morning the change was done and passed our test suite. Its writing is easy to follow and more coherent than Opus 5’s. Our pull requests and user-facing docs have needed almost no editing.”",
                "marks": []
              }
            ]
          }
        ]
      },
      {
        "id": "cd6a82d6f5ce",
        "company": "Factory",
        "author": "Zimu Li",
        "role": "Member of Technical Staff",
        "quote": [
          {
            "id": "bf17d51121ad",
            "style": "normal",
            "spans": [
              {
                "text": "“Claude Opus 5.5 is the first model we’d default to at medium effort. In our testing it matched Opus 5 on high effort, while using 20 to 25% fewer output tokens. On long, messy investigations it always came back with a clear, actionable answer. This means our customers get more done for less.”",
                "marks": []
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "43ab5572fd03",
    "type": "anchor",
    "anchor": "safety",
    "label": "Safety",
    "heroLabel": "Safety"
  },
  {
    "id": "1f06ce8c6653",
    "type": "text",
    "block": {
      "id": "1f06ce8c6653",
      "style": "h2",
      "spans": [
        {
          "text": "Safety",
          "marks": []
        }
      ]
    }
  },
  {
    "id": "4f62602356db",
    "type": "text",
    "block": {
      "id": "4f62602356db",
      "style": "h3",
      "spans": [
        {
          "text": "Pacing the frontier",
          "marks": []
        }
      ]
    }
  },
  {
    "id": "a19f958b9495",
    "type": "text",
    "block": {
      "id": "a19f958b9495",
      "style": "normal",
      "spans": [
        {
          "text": "Last week, our CEO, Dario Amodei, argued that ",
          "marks": []
        },
        {
          "text": "AI progress should be paced",
          "marks": [
            "76aad39f982f"
          ]
        },
        {
          "text": " so that safety practices stay ahead of model capabilities. Pacing is an approach to keeping AI safe, remaining competitive with China, and realizing AI’s benefits, particularly in areas like biology and medicine.",
          "marks": []
        }
      ],
      "links": {
        "76aad39f982f": "https://darioamodei.com/post/we-must-pace-the-frontier"
      }
    }
  },
  {
    "id": "1bb42642ffd2",
    "type": "text",
    "block": {
      "id": "1bb42642ffd2",
      "style": "normal",
      "spans": [
        {
          "text": "We largely understand the risks today’s models present and are well equipped to manage them. However, more serious risks could emerge quickly as capabilities improve, and we need to prepare for them now. For that reason, our safety work takes place on two time horizons at once:",
          "marks": []
        }
      ]
    }
  },
  {
    "id": "19c4e2447fa4",
    "type": "text",
    "block": {
      "id": "19c4e2447fa4",
      "style": "normal",
      "spans": [
        {
          "text": "Safety practices for current models.",
          "marks": [
            "strong"
          ]
        },
        {
          "text": " The current generation of models relies on an established set of practices: extensive alignment testing, pre-release evaluation by outside organizations such as METR and Frontier Design, and safeguards matched to each model’s capabilities in high-risk areas like cybersecurity and biology. We refine these practices with each release. We believe they are appropriate to the worst risks today’s models present, and that they give us a broad, though not perfect, picture of the range of serious risks.",
          "marks": []
        }
      ]
    }
  },
  {
    "id": "cffbc99d8301",
    "type": "text",
    "block": {
      "id": "cffbc99d8301",
      "style": "normal",
      "spans": [
        {
          "text": "Additionally, we track our ability to train and evaluate aligned models, and we report on both our public and internal models in the risk reports we publish under our ",
          "marks": []
        },
        {
          "text": "Responsible Scaling Policy",
          "marks": [
            "04915feb1227"
          ]
        },
        {
          "text": ", our voluntary framework for managing catastrophic risks from advanced AI systems.",
          "marks": []
        }
      ],
      "links": {
        "04915feb1227": "https://www.anthropic.com/responsible-scaling-policy"
      }
    }
  },
  {
    "id": "243eee51172e",
    "type": "text",
    "block": {
      "id": "243eee51172e",
      "style": "normal",
      "spans": [
        {
          "text": "Preparing for future models.",
          "marks": [
            "strong"
          ]
        },
        {
          "text": " We’re preparing our training and evaluation processes in anticipation of more advanced models. We’re tightening how we filter the environments used in reinforcement learning, since ",
          "marks": []
        },
        {
          "text": "flawed environments",
          "marks": [
            "870ae46803cc"
          ]
        },
        {
          "text": " are a major source of misaligned behavior. Additionally, we’re improving our alignment rewards and developing automated processes for producing new, diverse scenarios for safety training. And we are strengthening our ",
          "marks": []
        },
        {
          "text": "security and monitoring",
          "marks": [
            "1e88014a4591"
          ]
        },
        {
          "text": ", including a focused effort to improve interpretability-based monitoring and evaluation. We hope such techniques will help reduce our reliance on auditing a model’s chain-of-thought, or the reasoning it writes out while it works.",
          "marks": []
        }
      ],
      "links": {
        "870ae46803cc": "https://www.anthropic.com/research/alignment-assessment-cybersecurity-incidents",
        "1e88014a4591": "https://www.anthropic.com/news/improving-alignment-security-efforts"
      }
    }
  },
  {
    "id": "a75e6a569fb8",
    "type": "text",
    "block": {
      "id": "a75e6a569fb8",
      "style": "normal",
      "spans": [
        {
          "text": "Models with greater capabilities—such as those that can fully automate the work of AI research itself—require a higher safety standard still. Our calls for pacing were based in large part on our expectation that such models could be trained soon. For these models, we do not assume the measures described above will meet that safety standard on their own. As AI becomes more capable, public policy should play a larger role in making sure the systems people rely on are safe. That capacity takes time to build, and we’ve started to put the infrastructure in place to support it, as described in “",
          "marks": []
        },
        {
          "text": "We Must Pace the Frontier”",
          "marks": [
            "6b75609f7446"
          ]
        },
        {
          "text": " and our recent announcement with ",
          "marks": []
        },
        {
          "text": "Accenture",
          "marks": [
            "199bb493e33d"
          ]
        },
        {
          "text": "; we expect to share more details on these efforts soon. We will also continue to contribute to policy discussions with government and industry, including on approaches to regulation and international coordination.",
          "marks": []
        }
      ],
      "links": {
        "6b75609f7446": "https://darioamodei.com/post/we-must-pace-the-frontier",
        "199bb493e33d": "https://www.anthropic.com/news/accenture-embedded-evaluation"
      }
    }
  },
  {
    "id": "942012f15f28",
    "type": "text",
    "block": {
      "id": "942012f15f28",
      "style": "h3",
      "spans": [
        {
          "text": "Alignment",
          "marks": []
        }
      ]
    }
  },
  {
    "id": "8cc20a61276b",
    "type": "text",
    "block": {
      "id": "8cc20a61276b",
      "style": "normal",
      "spans": [
        {
          "text": "On our primary evaluation suite, an automated behavioral audit that assesses Claude across nearly 2,000 scenarios, Opus 5.5 scored better than any recent Claude model on nearly every measure of misaligned behavior. It’s also our strongest model on most measures of honesty.",
          "marks": []
        }
      ]
    }
  },
  {
    "id": "35e4fa4c9a3c",
    "type": "text",
    "block": {
      "id": "35e4fa4c9a3c",
      "style": "normal",
      "spans": [
        {
          "text": "In particular, Opus 5.5 improves over previous models on several of the behaviors that contributed to recent ",
          "marks": []
        },
        {
          "text": "cybersecurity incidents",
          "marks": [
            "f3780fee24f9"
          ]
        },
        {
          "text": ", including biased or motivated reasoning, attempting to escape a sandbox, and taking harmful actions after concluding it was in a simulated environment. In a new evaluation designed to test a model’s propensity to cross containment boundaries, Opus 5.5 attempted to circumvent boundaries around 85% less often than Opus 5 or Claude Mythos 5.1, and every attempt it made was low severity and self-reported. For teams running Claude unattended across their codebases and systems, this is just as important as raw capability.",
          "marks": []
        }
      ],
      "links": {
        "f3780fee24f9": "https://www.anthropic.com/research/alignment-assessment-cybersecurity-incidents"
      }
    }
  },
  {
    "id": "2365cfdc0daa",
    "type": "text",
    "block": {
      "id": "2365cfdc0daa",
      "style": "normal",
      "spans": [
        {
          "text": "However, as we described in our recent ",
          "marks": []
        },
        {
          "text": "alignment assessment",
          "marks": [
            "97997ade0293"
          ]
        },
        {
          "text": ", building evaluations that reliably catch every failure prior to deployment remains an unsolved problem. We see signs that Opus 5.5 often suspects it is being evaluated, which challenges our ability to assess how it will act in the vast variety of real-world settings it is deployed in. As these settings expand and model capabilities increase, we expect this challenge to grow, unless we make progress on interpretability. Although we are confident that Opus 5.5 shows broad improvements in the areas we are able to measure, we pair our own alignment work with the safeguards described below.",
          "marks": []
        }
      ],
      "links": {
        "97997ade0293": "https://www.anthropic.com/research/alignment-assessment-cybersecurity-incidents"
      }
    }
  },
  {
    "id": "4fcd6a435254",
    "type": "text",
    "block": {
      "id": "4fcd6a435254",
      "style": "h3",
      "spans": [
        {
          "text": "Safeguards",
          "marks": []
        }
      ]
    }
  },
  {
    "id": "074f13fe041d",
    "type": "text",
    "block": {
      "id": "074f13fe041d",
      "style": "normal",
      "spans": [
        {
          "text": "As our models grow more powerful, stricter safeguards are one way we prevent new capabilities from becoming tools for misuse. Opus 5.5 is the first Opus model to launch with a similar class of safeguards to Fable 5.1 on cybersecurity, biology, and distillation, all of which fall back to another model transparently.",
          "marks": []
        }
      ]
    }
  },
  {
    "id": "a5e60a762f8b",
    "type": "text",
    "block": {
      "id": "a5e60a762f8b",
      "style": "normal",
      "spans": [
        {
          "text": "Cybersecurity.",
          "marks": [
            "strong"
          ]
        },
        {
          "text": " Because Opus 5.5 has extremely strong cyber capabilities, we’re applying cybersecurity safeguards to Opus 5.5 that are similar to Fable 5.1’s. Users will be able to identify and fix bugs in their code as part of the routine software development lifecycle, but most cybersecurity tasks will be re-routed to Opus 4.8.",
          "marks": []
        }
      ]
    }
  },
  {
    "id": "9e6027f58d6e",
    "type": "text",
    "block": {
      "id": "9e6027f58d6e",
      "style": "normal",
      "spans": [
        {
          "text": "For cyberdefenders, we’ll soon be expanding our ",
          "marks": []
        },
        {
          "text": "Cyber Verification Program",
          "marks": [
            "8068cfc4ef81"
          ]
        },
        {
          "text": " to include Opus 5.5. The new program will include three tiers for increasingly permissive trusted access, including access to Claude Mythos models. ",
          "marks": []
        },
        {
          "text": "Claude Security",
          "marks": [
            "5ae286da8167"
          ]
        },
        {
          "text": " is already available with access to Claude Mythos 5.1.",
          "marks": []
        }
      ],
      "links": {
        "8068cfc4ef81": "https://support.claude.com/en/articles/14604842-real-time-cyber-safeguards-on-claude-opus-and-sonnet",
        "5ae286da8167": "https://www.anthropic.com/news/claude-code-security"
      }
    }
  },
  {
    "id": "2d6a6027694d",
    "type": "text",
    "block": {
      "id": "2d6a6027694d",
      "style": "normal",
      "spans": [
        {
          "text": "Biology.",
          "marks": [
            "strong"
          ]
        },
        {
          "text": " Opus 5.5 is highly capable in biology, exceeding Opus 5 and matching or beating Claude Mythos 5.1 across many areas of work. For example, Opus 5.5 achieved improvements on a long-horizon molecular prediction and design evaluation conducted in collaboration with Dyno Therapeutics, and expert red-teamers rated its scientific novelty as comparable to the best model they had tested.",
          "marks": []
        }
      ]
    }
  },
  {
    "id": "8378d5dbf2da",
    "type": "text",
    "block": {
      "id": "8378d5dbf2da",
      "style": "normal",
      "spans": [
        {
          "text": "For this reason, Opus 5.5 uses the same biology safeguards as Fable 5.1. To use Opus 5.5 for research and development work impeded by these safeguards, users can apply to our new ",
          "marks": []
        },
        {
          "text": "Life Sciences Verification Program",
          "marks": [
            "d8643cf3778a"
          ]
        },
        {
          "text": ", which gives vetted organizations like academic labs, startups, and pharmaceutical companies access to safeguards designed for the full breadth of biology-related work. ",
          "marks": []
        },
        {
          "text": "Interested organizations can apply here",
          "marks": [
            "0bb21f6359ae"
          ]
        },
        {
          "text": ".",
          "marks": []
        }
      ],
      "links": {
        "d8643cf3778a": "https://www.anthropic.com/news/life-sciences-verification-program",
        "0bb21f6359ae": "https://claude.com/form/life-sciences-verification-program"
      }
    }
  },
  {
    "id": "d45257b99983",
    "type": "text",
    "block": {
      "id": "d45257b99983",
      "style": "h3",
      "spans": [
        {
          "text": "Distillation",
          "marks": []
        }
      ]
    }
  },
  {
    "id": "7537a392610c",
    "type": "text",
    "block": {
      "id": "7537a392610c",
      "style": "normal",
      "spans": [
        {
          "text": "Distillation attacks, in which attackers use thousands of fake accounts to extract a model’s capabilities at industrial scale, create safety and national security risks. Distillation allows bad actors to create highly capable models without the safeguards we build into Claude. Our ",
          "marks": []
        },
        {
          "text": "September 2026 threat intelligence report",
          "marks": [
            "25c68975ea87"
          ]
        },
        {
          "text": " details the illicit distillation activity we’ve detected and disrupted so far.",
          "marks": []
        }
      ],
      "links": {
        "25c68975ea87": "https://www.anthropic.com/threat-intelligence-report-september-2026"
      }
    }
  },
  {
    "id": "95f039047985",
    "type": "text",
    "block": {
      "id": "95f039047985",
      "style": "normal",
      "spans": [
        {
          "text": "Opus 5.5 is launching with preserved thinking, the anti-distillation safeguard we introduced with Fable 5.1. It stops API users from editing Claude’s prior context in an attempt to extract Claude’s reasoning. It applies to Fable 5.1 and Opus 5.5 for API accounts created on or after August 31, 2026. Our ",
          "marks": []
        },
        {
          "text": "Help Center article",
          "marks": [
            "4d21eea916a0"
          ]
        },
        {
          "text": " explains the change, and our ",
          "marks": []
        },
        {
          "text": "preserved thinking docs",
          "marks": [
            "7e84c00dc26b"
          ]
        },
        {
          "text": " show how to test and update your integrations.",
          "marks": []
        }
      ],
      "links": {
        "4d21eea916a0": "https://support.claude.com/en/articles/16761192",
        "7e84c00dc26b": "https://platform.claude.com/docs/en/build-with-claude/preserved-thinking"
      }
    }
  },
  {
    "id": "b8535bf86387",
    "type": "text",
    "block": {
      "id": "b8535bf86387",
      "style": "h3",
      "spans": [
        {
          "text": "Data retention and compliance",
          "marks": []
        }
      ]
    }
  },
  {
    "id": "2364d869aef6",
    "type": "text",
    "block": {
      "id": "2364d869aef6",
      "style": "normal",
      "spans": [
        {
          "text": "Like previous Opus models, Opus 5.5 is available with zero data retention.",
          "marks": []
        }
      ]
    }
  },
  {
    "id": "6e15e5e1db20",
    "type": "text",
    "block": {
      "id": "6e15e5e1db20",
      "style": "normal",
      "spans": [
        {
          "text": "As with Fable 5.1, Opus 5.5 comes with our watermarking measures to comply with the EU AI Act, ",
          "marks": []
        },
        {
          "text": "discussed here",
          "marks": [
            "ed0af051a8ea"
          ]
        },
        {
          "text": ". It is also no longer available with “thinking” mode switched off, as ",
          "marks": []
        },
        {
          "text": "we describe here",
          "marks": [
            "55943b1b60a3"
          ]
        },
        {
          "text": ".",
          "marks": []
        }
      ],
      "links": {
        "ed0af051a8ea": "https://www.anthropic.com/news/claude-text-watermark",
        "55943b1b60a3": "https://platform.claude.com/docs/en/models/opus-5-5/whats-new-opus-5-5#thinking-cant-be-disabled"
      }
    }
  },
  {
    "id": "323d59714489",
    "type": "anchor",
    "anchor": "availability",
    "label": "Availability",
    "heroLabel": "Availability"
  },
  {
    "id": "292d75984055",
    "type": "text",
    "block": {
      "id": "292d75984055",
      "style": "h2",
      "spans": [
        {
          "text": "Availability",
          "marks": []
        }
      ]
    }
  },
  {
    "id": "a08d9fdce47b",
    "type": "text",
    "block": {
      "id": "a08d9fdce47b",
      "style": "normal",
      "spans": [
        {
          "text": "Claude Opus 5.5 is now available on all platforms, including Amazon Web Services, Google Cloud, and Microsoft Azure. On the Claude Platform, developers can ",
          "marks": []
        },
        {
          "text": "get started",
          "marks": [
            "6ceaf2fe4c25"
          ]
        },
        {
          "text": " with ",
          "marks": []
        },
        {
          "text": "claude-opus-5-5",
          "marks": [
            "code"
          ]
        },
        {
          "text": ". See our ",
          "marks": []
        },
        {
          "text": "migration guide for details.",
          "marks": [
            "bf3a8e8f7713"
          ]
        }
      ],
      "links": {
        "6ceaf2fe4c25": "https://platform.claude.com/docs/en/models/overview",
        "bf3a8e8f7713": "https://platform.claude.com/docs/en/models/opus-5-5/migration-guide"
      }
    }
  }
]
