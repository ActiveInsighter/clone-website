# Reading motion output plan

Source: https://openai.com/zh-Hans-CN/index/gpt-6-for-everyone/
App root: /root/Documents/Projects/clone-website
Destination: /components/reading-motion (new component gallery; not a full-page clone)
Reusable source: src/components/reading-motion/
Demo: src/app/components/reading-motion/
Registry: public/r/reading-motion.json
Download: public/downloads/reading-motion-kit.tar.gz
Existing clones and global styles remain owned by their current sites.
No new runtime dependency. React + local CSS Module; interoperable with shadcn Base UI or Radix.

Design: white reading canvas, graphite text, source blue selection (#539af8 at .45 opacity), muted blue-gray controls. English serif reading text; Chinese sans-serif UI. Large live typography carries the motion, with a compact control rail and two practical examples. Responsive single column on mobile.

Inspection: local Edge browser MCP loaded actual original DOM and JS; generic browser received 403. Edge reload with a cache-busting query loaded successfully. Desktop 1424×812, mobile 390×844. Reading extraction also available through agent-reach/Jina. No whole-page copy or external media.
