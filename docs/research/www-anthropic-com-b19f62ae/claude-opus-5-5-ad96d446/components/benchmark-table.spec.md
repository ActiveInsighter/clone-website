# BenchmarkTable / PricingTable

Target: `src/components/evidence/benchmark-table.tsx`, `pricing-table.tsx`, `comparison-table.css`.
Screenshot: table-BenchmarkGrid-module-scss-module__zKqBAG__table.png (relative to the matching design-references site/page root).
Data/props: `src/components/evidence/types.ts`, `BenchmarkTableProps` and `PricingTableProps`.
Use existing shadcn Table/Header/Body/Row/Head/Cell. Product-neutral props; no Anthropic data embedded in components.
Desktop benchmark width 880px, label column 240px, five metric columns 128px. 1px #141413 square borders. Header height46; data rows72; font AnthropicSans 14px/19.6; cell padding10px 12px; labels bold with muted second line. Numeric values left aligned, tabular figures. Leading subject highlight peach #edcbb9 with orange #eb6834 3px frame; best values bold and competitor winners #d1cfc5. Null values display em dash; qualifiers 11px muted below score.
Mobile/tablet min-width840, pinned label and highlighted subject column. Do not cause page-level horizontal overflow. Add accessible caption, scope=row/col, keyboard-scrollable wrapper and visually unobtrusive overflow hint. Every full model name remains accessible. Respect reduced motion; subtle row hover, no moving cell values.
Pricing screenshot: table-Table-module-scss-module__Z3bHXa__table.png. Width640; compact simple rules, serif body16/20. Price row labels: Cache reads, Input tokens, Output tokens, Cache writes. Preserve displayed precision ($0.20, $0.50 etc). Reusable through same column/row data contract; no forced calculation.
Empty rows need meaningful empty state, no crash. All table styling namespaced under evidence classes. Import shared theme CSS if needed; do not edit types.ts or theme file unless communicating first.

## Reusable mobile adaptation after QA
At widths below 600px the library uses 128px row labels and 104px value columns, with 96px body rows and 8px horizontal padding. This intentional adaptation allows pinned label and subject plus a complete competing column within a 390px viewport. Original desktop 880px geometry is unchanged.
