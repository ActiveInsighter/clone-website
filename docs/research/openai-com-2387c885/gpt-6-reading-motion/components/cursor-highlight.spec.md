# CursorHighlight specification

Observed original data-cua-motion=cua-highlight. Real inline text; transparent aria-hidden overlay behind relative z-index text; aria-hidden pointer-events:none cursor above. Desktop body 17px / 27.999px. Blue #539af8 at opacity .45; line-height rectangle measured from Range.getClientRects(), rounded .14em. Cursor 24×24, hotspot 4×4, white outline and black interior, dynamic heading.

Original is scroll-driven. Progress begins when text enters viewport bottom and reaches 1 around viewport midpoint. Selection action .2–.8. Consecutive lines add 24 virtual pixels; cursor disappears briefly during line change. Cursor approaches from (-36,48), departs toward (64,-40); scales to .86 while selecting. At p=.3 first line filled .167; p=.55 .582; p=.8 all filled. At endpoints cursor opacity 0, completed selection persists. Mobile text wraps to two lines measured 309.516 and 218.797px at y=0 and 28px.

Extensions: visible and manual playback; active boolean, playKey, duration, delay, showCursor, color variants; imperative play/reset/finish/scrollIntoView. Keep DOM text unchanged, never modify browser Selection. Measure rich inline descendants; merge rects belonging to same visual line; handle RTL. Re-measure fonts/width/content. Reduced motion: instant semantic highlight, no cursor. Keyboard and natural text selection remain available.

Screenshot: local Edge reading-motion-original-mobile.png and user attachment.
