d3.csv("a1-cars.csv").then(data => {
  data.forEach(d => {
    d["Model Year"] = +d["Model Year"];
    d.MPG = +d.MPG;
  });

  const nested = d3.groups(data, d => d["Origin"]);
  const margin = {top: 40, right: 80, bottom: 50, left: 60},
        width = 800 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

  const svg = d3.select("#lineChart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const x = d3.scaleLinear().domain([70, 82]).range([0, width]);
  const y = d3.scaleLinear().domain([0, d3.max(data, d => d.MPG)]).range([height, 0]);
  const color = d3.scaleOrdinal(d3.schemeSet2);

  // X Axis
  svg.append("g")
     .attr("transform", `translate(0,${height})`)
     .attr("class", "axis")
     .call(d3.axisBottom(x).tickFormat(d => 1900 + d));

  // Y Axis
  svg.append("g")
     .attr("class", "axis")
     .call(d3.axisLeft(y));

  // Line generator
  const line = d3.line()
    .defined(d => !isNaN(d.MPG))
    .x(d => x(d["Model Year"]))
    .y(d => y(d.MPG));

  // Plot lines and labels
  nested.forEach(([origin, values], i) => {
  svg.append("path")
    .datum(values)
    .attr("fill", "none")
    .attr("stroke", color(origin))
    .attr("stroke-width", 2)
    .attr("d", line);
});

// Add legend-like labels on the right side
nested.forEach(([origin], i) => {
  svg.append("text")
    .attr("x", width + 10)  // just outside the chart area
    .attr("y", i * 20)      // stacked vertically
    .attr("dy", "0.35em")
    .attr("fill", color(origin))
    .style("font-size", "12px")
    .text(origin);
});


  // Make axis text and lines black
  svg.selectAll(".axis path, .axis line, .axis text")
     .attr("stroke", "black")
     .attr("fill", "black");
});
