// bar-chart.js
let barSVG, barOriginalData;

function updateBarChart(data, selectedOrigin = null) {
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
              .domain([0, d3.max(mpgByOrigin, d => d.AvgMPG) + 5])
              .range([height, 0]);

  barSVG.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

  barSVG.append("g")
        .call(d3.axisLeft(y));

  // Add bars with dynamic highlighting
  barSVG.selectAll(".bar")
    .data(mpgByOrigin)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", d => x(d.Origin))
    .attr("y", d => y(d.AvgMPG))
    .attr("width", x.bandwidth())
    .attr("height", d => height - y(d.AvgMPG))
    .attr("fill", d => {
      if (!selectedOrigin) return "orange";
      return d.Origin === selectedOrigin ? "orange" : "#ccc";
    })
    .on("click", function (event, d) {
      updateAllCharts(d.Origin); // Synchronize with other charts
    });

  // Remove previous labels before adding new ones
  d3.selectAll(".bar-label").remove();

  // Add value labels on top of bars
  barSVG.selectAll(".bar-label")
    .data(mpgByOrigin)
    .enter()
    .append("text")
    .attr("class", "bar-label")
    .attr("x", d => x(d.Origin) + x.bandwidth() / 2)
    .attr("y", d => y(d.AvgMPG) - 5)
    .attr("text-anchor", "middle")
    .style("fill", "black")
    .style("font-weight", "bold")
    .style("font-size", "12px")
    .text(d => {
      if (!selectedOrigin) return "";
      return d.Origin === selectedOrigin ? d.AvgMPG.toFixed(1) : "";
    });
}
