// d3-mapbox-example.ts

// Import types if you're using a bundler (like Vite, Webpack, etc.)
// npm install --save mapbox-gl d3
import mapboxgl, { LngLatLike, Map } from "mapbox-gl";
import * as d3 from "d3";

// Set your Mapbox token
mapboxgl.accessToken = "YOUR_MAPBOX_ACCESS_TOKEN";

// 1. Initialize the Mapbox map
const map: Map = new mapboxgl.Map({
  container: "map", // id of your HTML container
  style: "mapbox://styles/mapbox/light-v11",
  center: [-122.4443, 47.2529], // [lng, lat]
  zoom: 10,
});

// 2. Define a simple GeoJSON dataset
interface PointFeature {
  type: "Feature";
  properties: { name: string };
  geometry: { type: "Point"; coordinates: [number, number] };
}

const geojson: GeoJSON.FeatureCollection<PointFeature> = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { name: "Point A" },
      geometry: { type: "Point", coordinates: [-122.44, 47.25] },
    },
    {
      type: "Feature",
      properties: { name: "Point B" },
      geometry: { type: "Point", coordinates: [-122.45, 47.26] },
    },
  ],
};

// 3. When the map loads, add an SVG overlay for d3
map.on("load", () => {
  const container = map.getCanvasContainer();

  const svg = d3
    .select(container)
    .append("svg")
    .attr("class", "d3-overlay")
    .style("position", "absolute")
    .style("top", "0")
    .style("left", "0")
    .style("width", "100%")
    .style("height", "100%")
    .style("pointer-events", "none"); // allow map interactions

  // Function to project lng/lat -> screen pixel coords
  function project(coords: [number, number]): { x: number; y: number } {
    const p = map.project(coords as LngLatLike);
    return { x: p.x, y: p.y };
  }

  // Draw circles for each point
  const points = svg
    .selectAll<SVGCircleElement, GeoJSON.Feature<PointFeature>>("circle")
    .data(geojson.features)
    .join("circle")
    .attr("r", 6)
    .attr("fill", "red")
    .attr("opacity", 0.7);

  // Update positions on map events
  function update(): void {
    points
      .attr("cx", (d) => project(d.geometry.coordinates).x)
      .attr("cy", (d) => project(d.geometry.coordinates).y);
  }

  update();

  map.on("move", update);
  map.on("zoom", update);
  map.on("rotate", update);
});

// --- Example: drawing a line feature ---
const lineData: GeoJSON.Feature<GeoJSON.LineString> = {
  type: "Feature",
  properties: { name: "Sample Line" },
  geometry: {
    type: "LineString",
    coordinates: [
      [-122.44, 47.25],
      [-122.46, 47.27],
      [-122.48, 47.26],
    ],
  },
};

map.on("load", () => {
  const container = map.getCanvasContainer();

  const svg = d3
    .select(container)
    .append("svg")
    .attr("class", "d3-overlay-line")
    .style("position", "absolute")
    .style("top", "0")
    .style("left", "0")
    .style("width", "100%")
    .style("height", "100%")
    .style("pointer-events", "none");

  const path = svg
    .append("path")
    .datum(lineData)
    .attr("fill", "none")
    .attr("stroke", "blue")
    .attr("stroke-width", 2);

  function updateLine(): void {
    const coords = lineData.geometry.coordinates.map((pt) => {
      const p = map.project(pt as LngLatLike);
      return [p.x, p.y];
    });

    const lineGenerator = d3.line();
    path.attr("d", lineGenerator(coords as [number, number][]));
  }

  updateLine();

  map.on("move", updateLine);
  map.on("zoom", updateLine);
  map.on("rotate", updateLine);
});
