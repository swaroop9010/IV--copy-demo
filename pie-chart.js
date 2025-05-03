// pie-chart.js
let pieSVG, pieOriginalData;

function updatePieChart(data) {
  pieOriginalData = data;
  d3.select("#pieChart").select("svg").remove();

  // Limit to top 10 by MPG
  const topCars = data
    .sort((a, b) => +b.MPG - +a.MPG)
    .slice(0, 10);

  const width = 500, height = 350, radius = Math.min(width, height) / 2;
  const color = d3.scaleOrdinal(d3.schemeCategory10);

  pieSVG = d3.select("#pieChart")
    .append("svg")
    .attr("width", width + 200)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${radius}, ${height / 2})`);

  const pie = d3.pie().value(d => d.MPG).sort(null);
  const arc = d3.arc().innerRadius(0).outerRadius(radius);

  const arcs = pieSVG.selectAll("arc")
    .data(pie(topCars))
    .enter()
    .append("g")
    .attr("class", "arc");

  arcs.append("path")
    .attr("d", arc)
    .attr("fill", (d, i) => color(d.data.Car))
    .on("click", (event, d) => {
      handleInteraction(d.data);
    });

  arcs.append("title")
    .text(d => `${d.data.Car} – ${d.data.MPG} MPG`);

  // Add legend
  const legend = d3.select("#pieChart svg")
    .append("g")
    .attr("transform", `translate(${width - 20}, 20)`);

  topCars.forEach((d, i) => {
    const legendRow = legend.append("g")
      .attr("transform", `translate(0, ${i * 20})`);

    legendRow.append("rect")
      .attr("width", 15)
      .attr("height", 15)
      .attr("fill", color(d.Car));

    legendRow.append("text")
      .attr("x", 20)
      .attr("y", 12)
      .text(d.Car)
      .style("font-size", "12px")
      .attr("fill", "black");
  });
}
