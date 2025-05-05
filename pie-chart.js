// pie-chart.js
let pieSVG, pieOriginalData;
let selectedOrigin = null;

function updatePieChart(data, selectedOriginParam = null) {
  pieOriginalData = data;
  selectedOrigin = selectedOriginParam;
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
  const labelArc = d3.arc().innerRadius(0).outerRadius(radius - 40);

  const arcs = pieSVG.selectAll("arc")
    .data(pie(originCounts))
    .enter().append("g").attr("class", "arc");

  arcs.append("path")
    .attr("d", arc)
    .attr("fill", d => color(d.data.Origin))
    .attr("opacity", d => selectedOrigin === null || d.data.Origin === selectedOrigin ? 1 : 0.3)
    .on("click", (event, d) => {
      selectedOrigin = d.data.Origin;
      updatePieChart(pieOriginalData, selectedOrigin);
      handleInteraction({ Origin: d.data.Origin });
    });

  arcs.append("text")
    .attr("transform", d => `translate(${labelArc.centroid(d)})`)
    .attr("dy", "0.35em")
    .attr("text-anchor", "middle")
    .style("font-size", "12px")
    .text(d => selectedOrigin === null || d.data.Origin === selectedOrigin
      ? `${d.data.Count} (${((d.data.Count / total) * 100).toFixed(1)}%)`
      : "")
    .attr("fill", "white");

  const legend = d3.select("#pieChart svg")
    .append("g")
    .attr("transform", `translate(${width - 40}, 20)`);

  originCounts.forEach((d, i) => {
    const row = legend.append("g").attr("transform", `translate(0, ${i * 20})`);
    row.append("rect").attr("width", 15).attr("height", 15).attr("fill", color(d.Origin));
    row.append("text").attr("x", 20).attr("y", 12).text(d.Origin).style("font-size", "12px").attr("fill", "black");
  });
}
