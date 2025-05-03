// pie-chart.js
let pieSVG, pieOriginalData;

function updatePieChart(data) {
  pieOriginalData = data;
  d3.select("#pieChart").select("svg").remove();

  // Count cars by origin
  const originCounts = d3.rollups(
    data,
    v => v.length,
    d => d.Origin
  ).map(([Origin, Count]) => ({ Origin, Count }));

  const width = 500, height = 350, radius = Math.min(width, height) / 2;
  const color = d3.scaleOrdinal(d3.schemeCategory10);

  pieSVG = d3.select("#pieChart")
    .append("svg")
    .attr("width", width + 200)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${radius}, ${height / 2})`);

  const pie = d3.pie().value(d => d.Count).sort(null);
  const arc = d3.arc().innerRadius(0).outerRadius(radius);

  const arcs = pieSVG.selectAll("arc")
    .data(pie(originCounts))
    .enter().append("g").attr("class", "arc");

  arcs.append("path")
    .attr("d", arc)
    .attr("fill", d => color(d.data.Origin))
    .on("click", (event, d) => {
      handleInteraction({ Origin: d.data.Origin });
    });

  arcs.append("title")
    .text(d => `${d.data.Origin} – ${d.data.Count} cars`);

  // Add legend
  const legend = d3.select("#pieChart svg")
    .append("g")
    .attr("transform", `translate(${width - 10}, 20)`);

  originCounts.forEach((d, i) => {
    const row = legend.append("g").attr("transform", `translate(0, ${i * 20})`);
    row.append("rect").attr("width", 15).attr("height", 15).attr("fill", color(d.Origin));
    row.append("text")
      .attr("x", 20)
      .attr("y", 12)
      .text(`${d.Origin}`)
      .style("font-size", "12px")
      .attr("fill", "black");
  });
}
