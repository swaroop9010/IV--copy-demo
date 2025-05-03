// bar-chart.js
let barSVG, barOriginalData;

function updateBarChart(data) {
  barOriginalData = data;
  d3.select("#barChart").select("svg").remove();

  const mpgByOrigin = d3.rollups(
    data,
    v => d3.mean(v, d => +d.MPG),
    d => d.Origin
  ).map(([Origin, AvgMPG]) => ({ Origin, AvgMPG }))
   .sort((a, b) => d3.descending(a.AvgMPG, b.AvgMPG));

  const margin = { top: 20, right: 30, bottom: 40, left: 60 },
        width = 500 - margin.left - margin.right,
        height = 350 - margin.top - margin.bottom;

  barSVG = d3.select("#barChart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const x = d3.scaleBand()
              .domain(mpgByOrigin.map(d => d.Origin))
              .range([0, width])
              .padding(0.4);

  const y = d3.scaleLinear()
              .domain([0, d3.max(mpgByOrigin, d => d.AvgMPG)])
              .range([height, 0]);

  // X Axis
  barSVG.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x));

  // Y Axis
  barSVG.append("g")
    .call(d3.axisLeft(y));

  // Bars
  barSVG.selectAll("rect")
    .data(mpgByOrigin)
    .enter().append("rect")
    .attr("x", d => x(d.Origin))
    .attr("y", d => y(d.AvgMPG))
    .attr("width", x.bandwidth())
    .attr("height", d => height - y(d.AvgMPG))
    .attr("fill", "#ff7f0e")
    .on("click", (event, d) => handleInteraction({ Origin: d.Origin }));

  barSVG.selectAll(".axis path, .axis line, .axis text")
    .attr("stroke", "black")
    .attr("fill", "black");
}
