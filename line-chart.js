// line-chart.js
let lineSVG, lineOriginalData;

function updateLineChart(data) {
  lineOriginalData = data;
  d3.select("#lineChart").select("svg").remove();

  // Sort data by MPG descending and get top 20 cars
  const topCars = [...data]
    .filter(d => d.Car && !isNaN(+d.MPG))
    .sort((a, b) => +b.MPG - +a.MPG)
    .slice(0, 20);

  const margin = {top: 40, right: 80, bottom: 100, left: 60},
        width = 900 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

  lineSVG = d3.select("#lineChart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const x = d3.scalePoint()
              .domain(topCars.map(d => d.Car))
              .range([0, width]);

  const y = d3.scaleLinear()
              .domain([0, d3.max(topCars, d => +d.MPG)])
              .range([height, 0]);

  // X Axis
  lineSVG.append("g")
    .attr("transform", `translate(0,${height})`)
    .attr("class", "axis")
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "rotate(-45)")
    .style("text-anchor", "end")
    .style("font-size", "10px");

  // Y Axis
  lineSVG.append("g")
    .attr("class", "axis")
    .call(d3.axisLeft(y));

  const line = d3.line()
    .x(d => x(d.Car))
    .y(d => y(+d.MPG));

  lineSVG.append("path")
    .datum(topCars)
    .attr("fill", "none")
    .attr("stroke", "#1f77b4")
    .attr("stroke-width", 2)
    .attr("d", line);

  // Circles on points
  lineSVG.selectAll("circle")
    .data(topCars)
    .enter().append("circle")
    .attr("cx", d => x(d.Car))
    .attr("cy", d => y(+d.MPG))
    .attr("r", 4)
    .attr("fill", "steelblue")
    .on("click", (event, d) => handleInteraction(d))
    .append("title")
    .text(d => `${d.Car} – ${d.MPG} MPG`);

  // Style axis
  lineSVG.selectAll(".axis path, .axis line, .axis text")
    .attr("stroke", "black")
    .attr("fill", "black");
}
