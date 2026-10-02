# Observed behaviors

- Hero is scroll-driven: horizon, text and side textures move with scroll; it is not a static screenshot. Header hides when scrolling down and returns on upward scroll.
- Research, Commitments and Learn open 250px paper dropdowns with 24px padding; every group and link is retained in navigation-states.json. Clone uses shadcn Menu for desktop and expanding groups in its mobile Sheet.
- Four in-page TOC destinations: introduction, performance-and-cost-effectiveness, safety, availability. Side TOC marks current section.
- Six charts organized in two groups of three tabs; click/keyboard-driven switch, not scroll selection. Tabs have horizontal overflow on narrow screens.
- Legend buttons toggle individual series via aria-pressed. Point hover displays exact score, cost and effort label.
- Chart entrance animates when the plot enters the viewport. Preserve progressive enhancement and support reduced motion.
- Benchmark is a semantic table with highlighted subject column, per-row best result, qualifiers (with tools/partial), and horizontal scrolling on mobile.
- Reusable tables compact pinned columns to 128px + 104px on phones so a complete competitor column remains readable after horizontal scrolling.
- Testimonials are click-driven company tabs; all 21 quote states extracted.
- Response comparison uses three example tabs; each shows Opus 5.5 and Opus 5 outputs with playback/replay, independently scrollable response areas.
- Every original text, quote, chart point and paired output is captured in article-body.json and normalized into typed article-data.ts.
