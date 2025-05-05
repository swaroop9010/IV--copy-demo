// bar-chart.js
let barSVG, barOriginalData, activeBar = null;

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

  // Axes
  barSVG.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x))
    .selectAll("text").attr("fill", "black");

  barSVG.append("g")
    .call(d3.axisLeft(y))
    .selectAll("text").attr("fill", "black");

  barSVG.selectAll("path.domain, .tick line")
    .style("stroke", "black")
    .style("stroke-width", "1px");

  // Draw bars
  barSVG.selectAll("rect")
    .data(mpgByOrigin)
    .enter().append("rect")
    .attr("x", d => x(d.Origin))
    .attr("y", d => y(d.AvgMPG))
    .attr("width", x.bandwidth())
    .attr("height", d => height - y(d.AvgMPG))
    .attr("fill", d => d.Origin === activeBar ? "#d62728" : "#ff7f0e")
    .style("opacity", d => activeBar && d.Origin !== activeBar ? 0.3 : 1)
    .on("click", (event, d) => {
      activeBar = d.Origin;
      updateBarChart(barOriginalData);
      handleInteraction({ Origin: d.Origin });
    });

  // Show MPG value on selected bar
  if (activeBar) {
    const selected = mpgByOrigin.find(d => d.Origin === activeBar);
    barSVG.append("text")
      .attr("x", x(selected.Origin) + x.bandwidth() / 2)
      .attr("y", y(selected.AvgMPG) - 8)
      .attr("text-anchor", "middle")
      .attr("fill", "black")
      .style("font-size", "13px")
      .text(selected.AvgMPG.toFixed(1));
  }
}

// Global Reset Handler
function resetBarChart() {
  activeBar = null;
  updateBarChart(barOriginalData);
}
