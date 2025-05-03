
// pie-chart.js
let pieSVG, pieOriginalData;

function drawPieChart(data) {
  pieOriginalData = data;
  d3.select("#pieChart").select("svg").remove();

  const width = 300, height = 300, radius = Math.min(width, height) / 2;
  const color = d3.scaleOrdinal(d3.schemeCategory10);

  pieSVG = d3.select("#pieChart")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${width / 2}, ${height / 2})`);

  const pie = d3.pie().value(d => d.MPG);
  const arc = d3.arc().innerRadius(0).outerRadius(radius);

  const arcs = pieSVG.selectAll("arc")
    .data(pie(data))
    .enter().append("g").attr("class", "arc");

  arcs.append("path")
    .attr("d", arc)
    .attr("fill", (d, i) => color(i))
    .on("click", (event, d) => handleInteraction(d.data));

  arcs.append("title").text(d => `${d.Car}: ${d.MPG}`);
}

function updatePieChart(data) {
  drawPieChart(data);
}

function resetPieChart() {
  drawPieChart(pieOriginalData);
}
