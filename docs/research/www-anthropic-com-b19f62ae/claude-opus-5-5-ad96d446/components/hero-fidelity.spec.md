# Hydrated hero correction

The earlier inspection confused loading states with the hydrated hero. Source browser extraction now waits for `.stage.ready`. Data: `hero-live-states.json`, `hero-settings.json`; screenshots `/tmp/opus-final-state-0.png` and `/tmp/opus-final-state-100.png`.

- Initial source section height is 190vh. The viewport stage is sticky top0, height100lvh. It presents three textures immediately, with Introducing at the horizon. There is no335px blank leading area.
- Initial desktop left seam27% and right seam69%; narrow-screen initial values interpolate toward17% and80%. Expanded seams are6% and91.5% desktop,4.5% and94% mobile.
- The original shrinks to120vh after a scroll-and-time animation. For robust page interaction use a120vh sticky stage, first-scroll-driven expansion, and a local smooth settle. Preserve sticky backdrop while revealing the title. Reduced-motion uses100lvh settled state. Do not trap input or forcibly reset user scroll.
- Actual middle image was hidden by procedural rendering and previously missed. It has now been downloaded from the source hero settings to `public/sites/www-anthropic-com-b19f62ae/claude-opus-5-5-ad96d446/images/hero-middle.webp`. Use this real artwork instead of an approximate gradient.
- The renderer should draw local textures with native WebGL, with explicit resource disposal and context-loss fallback. No Three.js or copied minified application runtime. A CSS/local image fallback must remain visible if WebGL or loading fails. Stop render loops when offscreen; reduced motion renders a fixed settled frame.
- Source shader asset placement geometry is inspectable in `/tmp/opus-renderer.js`, particularly placeTexture equivalent lines306–375 and composed scene lines2085–2200. The original assets’ arcs/zooms are in hero-settings.json. Reference only; write readable typed source. Preserve logical pixels vs framebuffer DPR.
- Initial Introducing font43.2 at1440 (clamp22..58 from width*.03 desktop). Center at around50% viewport height.
- Hydrated title at1440 is95px. It uses the Anthropic Serif private-use Claude glyph U+E11C with dlig/ligatures enabled, followed by Opus5.5 at465 weight. Render an accessible semantic h1 with aria-label and a decorative brand glyph. Full desktop width is around726px.
- Header/date/title/TOC all stay positioned relative to the viewport stage while sticky. Source apex ~53%H; title visible bounds411..541 atH1000; date at~378; TOC at~621. Restore original typography and a gentle ink roughening filter with unique IDs; preserve accessible full text.
- Source title SVG ink filter: fractalNoise .9 seed4, displacement.6, blur.7, alpha slope1.14; scratch mask noise.75 seed12. Keep implementation unobtrusive and responsive.
- Main body widths, article data, evidence components and footer stay unchanged. Scope all hero CSS to source owner; no site-wide font or palette edits.

Validate WebGL/error fallback, reduced motion, scroll/sticky state, responsive390/768/1440 and no horizontal overflow. Add meaningful browser checks in the root integration pass. Document remaining source shader differences accurately.
