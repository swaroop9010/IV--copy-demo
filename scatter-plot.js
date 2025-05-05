// scatter-plot.js
let scatterSVG, scatterOriginalData, activeOrigin = null;

function updateScatterPlot(data, originFilter = null) {
  scatterOriginalData = data;
  d3.select("#scatterPlot").select("svg").remove();

  const margin = { top: 20, right: 20, bottom: 50, left: 60 },
        width = 500 - margin.left - margin.right,
        height = 350 - margin.top - margin.bottom;

  scatterSVG = d3.select("#scatterPlot")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const x = d3.scaleLinear()
              .domain(d3.extent(data, d => +d.Weight))
              .nice()
              .range([0, width]);

  const y = d3.scaleLinear()
              .domain(d3.extent(data, d => +d.Horsepower))
              .nice()
              .range([height, 0]);

  const color = d3.scaleOrdinal(d3.schemeCategory10);

  scatterSVG.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x))
    .selectAll("text").attr("fill", "black");

  scatterSVG.append("g")
    .call(d3.axisLeft(y))
    .selectAll("text").attr("fill", "black");

  scatterSVG.selectAll("path.domain, .tick line")
    .style("stroke", "black")
    .style("stroke-width", "1px");

  scatterSVG.selectAll("circle")
    .data(data)
    .enter().append("circle")
    .attr("cx", d => x(+d.Weight))
    .attr("cy", d => y(+d.Horsepower))
    .attr("r", 4)
    .attr("fill", d => color(d.Origin))
    .attr("opacity", d => originFilter && d.Origin !== originFilter ? 0.2 : 1);

  // Legend
  const regions = [...new Set(data.map(d => d.Origin))];
  const legend = scatterSVG.append("g").attr("transform", `translate(${width - 100}, 10)`);

  regions.forEach((origin, i) => {
    const row = legend.append("g").attr("transform", `translate(0, ${i * 20})`);
    row.append("rect").attr("width", 15).attr("height", 15).attr("fill", color(origin));
    row.append("text").attr("x", 20).attr("y", 12).text(origin).style("font-size", "12px").attr("fill", "black");
  });
}

// Called externally when filters change
function filterScatterPlotByOrigin(origin) {
  activeOrigin = origin;
  updateScatterPlot(scatterOriginalData, origin);
}

function resetScatterPlot() {
  activeOrigin = null;
  updateScatterPlot(scatterOriginalData);
}
