// pie-chart.js
let pieSVG, pieOriginalData;
let selectedOrigin = null;
let pieClickedFromSelf = false;

function updatePieChart(data, selectedOriginParam = null, clickedFromSelf = false) {
  pieOriginalData = data;
  selectedOrigin = selectedOriginParam;
  pieClickedFromSelf = clickedFromSelf;

  d3.select("#pieChart").select("svg").remove();

  const originCounts = d3.rollups(
    data,
    v => v.length,
    d => d.Origin
  ).map(([Origin, Count]) => ({ Origin, Count }));

  const total = d3.sum(originCounts, d => d.Count);
  const width = 400, height = 300, radius = Math.min(width, height) / 2;
  const color = d3.scaleOrdinal(d3.schemeCategory10);

  pieSVG = d3.select("#pieChart")
    .append("svg")
    .attr("width", width + 100)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${radius + 20}, ${height / 2})`);

  const pie = d3.pie().value(d => d.Count).sort(null);
  const arc = d3.arc().innerRadius(0).outerRadius(radius);
  const labelArc = d3.arc().innerRadius(0).outerRadius(radius + 30);

  // Draw pie slices
  pieSVG.selectAll("path")
    .data(pie(originCounts))
    .enter()
    .append("path")
    .attr("d", arc)
    .attr("fill", d => color(d.data.Origin))
    .attr("stroke", "white")
    .attr("stroke-width", 2)
    .style("opacity", d => {
      if (!selectedOrigin) return 1;
      return d.data.Origin === selectedOrigin ? 1 : 0.3;
    })
    .on("click", function (event, d) {
      updateAllCharts(d.data.Origin); // Trigger interactions
    });

  // Add value-only label for selected segment (no percentage)
  pieSVG.selectAll(".arc-label")
    .data(pie(originCounts))
    .enter()
    .append("text")
    .attr("class", "arc-label")
    .attr("transform", d => `translate(${labelArc.centroid(d)})`)
    .attr("text-anchor", "middle")
    .style("font-size", "12px")
    .style("font-weight", "bold")
    .text(d => {
      return selectedOrigin && d.data.Origin === selectedOrigin ? `${d.data.Count}` : "";
    });
}
