// scatter-plot.js
let scatterSVG, scatterOriginalData;

function updateScatterPlot(data) {
  scatterOriginalData = data;
  d3.select("#scatterPlot").select("svg").remove();

  // Get top 20 cars by MPG
  const topCars = [...data]
    .filter(d => d.MPG && d.Horsepower && d.Car)
    .sort((a, b) => +b.MPG - +a.MPG)
    .slice(0, 20);

  topCars.forEach(d => {
    d.Horsepower = +d.Horsepower;
    d.MPG = +d.MPG;
  });

  const margin = {top: 20, right: 30, bottom: 120, left: 60},
        width = 900 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

  scatterSVG = d3.select("#scatterPlot")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const x = d3.scalePoint()
              .domain(topCars.map(d => d.Car))
              .range([0, width]);

  const y = d3.scaleLinear()
              .domain([0, d3.max(topCars, d => d.Horsepower)])
              .range([height, 0]);

  // X Axis
  scatterSVG.append("g")
    .attr("transform", `translate(0,${height})`)
    .attr("class", "axis")
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "rotate(-45)")
    .style("text-anchor", "end")
    .style("font-size", "10px");

  // Y Axis
  scatterSVG.append("g")
    .attr("class", "axis")
    .call(d3.axisLeft(y));

  // Dots
  scatterSVG.selectAll("circle")
    .data(topCars)
    .enter().append("circle")
    .attr("cx", d => x(d.Car))
    .attr("cy", d => y(d.Horsepower))
    .attr("r", 5)
    .attr("fill", "green")
    .on("click", (event, d) => handleInteraction(d))
    .append("title")
    .text(d => `${d.Car} – ${d.Horsepower} HP`);

  scatterSVG.selectAll(".axis path, .axis line, .axis text")
    .attr("stroke", "black")
    .attr("fill", "black");
}
