# OpenAiHome Specification

## Overview

- Target: src/components/openai-site/openai-home.tsx
- Interaction model: time-driven prompt rotation, click-driven links, hover-driven card emphasis.
- Assets: public/images/openai-home/*

## Hero

- Black background.
- Desktop featured media begins around y=674px; compact around y=706px; mobile around y=650px.
- Heading centered with 28–36px responsive size.
- Composer max-width 768px, width calc(100vw - 72px) on desktop and calc(100vw - 54px) below desktop, height 117px, radius 16px.
- Composer submit control is a circular 40–41px dark button at the lower right.
- Prompt suggestions change every 3600ms. The prompt slot has stable height and a 450ms fade/translate animation.
- Pills use 45px minimum height, thin white border and 8px gap. At 390px they wrap into two centered rows.

## Featured content

- Desktop first row uses approximately 3.17fr 1fr columns and 28px gap.
- Compact/mobile stack to one column.
- Images fill their media boxes with object-fit: cover.
- Hover applies a small image scale transition and a dark bottom gradient.

## Page sections

After the featured row the page renders latest updates, customer stories, latest research, enterprise solutions, a ChatGPT CTA and footer. Each section is data-driven from openai-home-data.ts and keeps the existing local assets.
