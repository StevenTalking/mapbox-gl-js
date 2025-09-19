<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>D3 + Mapbox US Bubble Plot Example</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <!-- Mapbox CSS -->
  <link href="https://api.mapbox.com/mapbox-gl-js/v2.14.1/mapbox-gl.css" rel="stylesheet" />

  <style>
    body { margin: 0; padding: 0; }
    #map { width: 100%; height: 100vh; }
    .bubble {
      fill: steelblue;
      fill-opacity: 0.6;
      stroke: white;
      stroke-width: 1px;
    }
  </style>
</head>
<body>
  <div id="map"></div>

  <!-- Mapbox + D3 -->
  <script src="https://api.mapbox.com/mapbox-gl-js/v2.14.1/mapbox-gl.js"></script>
  <script src="https://d3js.org/d3.v7.min.js"></script>
  <script>
    // Replace with your Mapbox access token
    mapboxgl.accessToken = 'YOUR_MAPBOX_ACCESS_TOKEN';

    // Initialize map
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/light-v11',
      center: [-98, 39], // center of USA
      zoom: 3
    });

    // Example bubble data: [longitude, latitude, value]
    const bubbleData = [
      { city: "New York", coords: [-74.006, 40.7128], value: 50 },
      { city: "Los Angeles", coords: [-118.2437, 34.0522], value: 40 },
      { city: "Chicago", coords: [-87.6298, 41.8781], value: 30 },
      { city: "Houston", coords: [-95.3698, 29.7604], value: 25 },
      { city: "Miami", coords: [-80.1918, 25.7617], value: 20 }
    ];

    map.on('load', () => {
      // Add an SVG layer on top of Mapbox canvas
      const container = map.getCanvasContainer();
      const svg = d3.select(container).append("svg")
        .attr("class", "d3-overlay")
        .style("position", "absolute")
        .style("top", 0)
        .style("left", 0)
        .style("width", "100%")
        .style("height", "100%")
        .style("pointer-events", "none");

      const project = (lng, lat) => {
        return map.project(new mapboxgl.LngLat(lng, lat));
      };

      const bubbles = svg.selectAll("circle")
        .data(bubbleData)
        .enter()
        .append("circle")
        .attr("class", "bubble");

      function render() {
        bubbles
          .attr("cx", d => project(d.coords[0], d.coords[1]).x)
          .attr("cy", d => project(d.coords[0], d.coords[1]).y)
          .attr("r", d => d.value * map.getZoom() / 5); // bubble size scales with zoom
      }

      // Initial render
      render();

      // Re-render on map events
      map.on("viewreset", render);
      map.on("move", render);
      map.on("moveend", render);
      map.on("zoom", render);
    });
  </script>
</body>
</html>
