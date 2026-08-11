# Hero imagery — provenance

## `hero-facets.png`

Abstract faceted backdrop behind the homepage hero. Contains no people, no
faces, no text, and no third-party marks.

| | |
|---|---|
| Origin | Generated 2026-08-11 via the Higgsfield MCP |
| Model | Recraft V4.1 (`recraft_v4_1`), `model_type: standard` |
| Output | 2688×1536, 16:9, `resolution: 2k` |
| Palette | Locked to the brand hexes below |

Palette passed to the model, so the output sits inside the design system rather
than being colour-corrected after the fact:

```
#071840  #0B2D78  #1A5FBF  #2D84D8  #4BAEF0  #5DCDE6
```

Prompt:

> Abstract dark geometric background for a premium South African insurance and
> financial technology brand. Deep navy and indigo low-poly faceted crystalline
> planes, angular shard geometry, subtle prismatic light refraction in cyan and
> bright blue breaking across the upper right corner. Predominantly very dark
> and low-key, with deep shadow holding the left two thirds of the frame so
> overlaid white text stays legible. Smooth cinematic gradient falloff, soft
> volumetric glow, fine film grain, elegant and restrained. Corporate,
> sophisticated, trustworthy. No people, no faces, no text, no lettering, no
> logos, no watermarks.

### Why the composition matters

The dark left two-thirds is load-bearing, not aesthetic. The headline sits in
that region, and `HeroSection` layers two scrims over this image specifically to
hold the navbar band and the headline column to a dark floor. Every text region
over it was measured at or above WCAG AA. **If this asset is ever replaced,
re-measure those regions** — a lighter image will quietly break the hero's
contrast.

### Weight

The 1.9 MB PNG is the master. It is never served as-is: `next/image` delivers it
at ~23 KB WebP at 1920w. Keep the master at full resolution.

### Before reusing commercially

Confirm the generation service's licensing terms cover commercial use for a
client deliverable, and record that confirmation with the client. This has not
been verified here.
