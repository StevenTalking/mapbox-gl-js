# D3.js + Mapbox GL JS Example

This example shows how to combine **Mapbox GL JS** (interactive map rendering) with **d3.js** (data visualization library).

## What’s happening here?

1. **Mapbox draws the base map**
   - We initialize a Mapbox map with a style, center, and zoom level.
   - Mapbox handles panning, zooming, and rendering tiles.

2. **d3 draws an SVG overlay**
   - We add an `<svg>` element inside the Mapbox canvas container.
   - d3 can then draw circles, lines, or shapes in this SVG layer.

3. **Syncing coordinates**
   - Geographic coordinates are in `[lng, lat]` format.
   - Mapbox gives us a function `map.project([lng, lat])` which converts `[lng, lat]` → pixel screen coordinates.
   - We feed those pixel positions into d3 shapes (`circle`, `path`, etc.).

4. **Updating on map movement**
   - Whenever the map pans, zooms, or rotates, the pixel positions change.
   - We listen to Mapbox events (`move`, `zoom`, `rotate`) and tell d3 to re-position shapes.

## What’s in the demo?

- **Red circles**: Represent points (two GeoJSON features).
- **Blue line**: A simple line string drawn between coordinates.

Both stay aligned with the map as you pan and zoom.

## Why use d3 with Mapbox?

- Mapbox is great at **maps, tiles, projections**.
- d3 is great at **data-driven visuals** (shapes, scales, tooltips, animations).
- Together, you can build **interactive data maps** (e.g., heatmaps, scatterplots, animated flows).

## How to run

1. Compile the TypeScript file (`d3-mapbox-example.ts`) into JavaScript.
   ```bash
   tsc d3-mapbox-example.ts --outDir .
