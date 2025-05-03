// scatter-plot.js
let scatterSVG, scatterOriginalData;

function updateScatterPlot(data) {
  scatterOriginalData = data;
  d3.select("#scatterPlot").select("svg").remove();

  // Filter valid data
  data = data.filter(d => d.Horsepower && d.Weight)
             .map(d => ({
               ...d,
               Horsepower: +d.Horsepower,
               Weight: +d.Weight
             }));

  const margin = { top: 20, right: 30, bottom: 50, left: 60 },
        width = 800 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

  scatterSVG = d3.select("#scatterPlot")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const x = d3.scaleLinear()
              .domain(d3.extent(data, d => d.Weight))
              .range([0, width]);

  const y = d3.scaleLinear()
              .domain(d3.extent(data, d => d.Horsepower))
              .range([height, 0]);

  // X Axis
  scatterSVG.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x));

  // Y Axis
  scatterSVG.append("g")
    .call(d3.axisLeft(y));

  // Circles
  scatterSVG.selectAll("circle")
    .data(data)
    .enter().append("circle")
    .attr("cx", d => x(d.Weight))
    .attr("cy", d => y(d.Horsepower))
    .attr("r", 5)
    .attr("fill", "green")
    .attr("opacity", 0.7)
    .on("click", (event, d) => handleInteraction(d))
    .append("title")
    .text(d => `${d.Car}\nWeight: ${d.Weight} lbs\nHP: ${d.Horsepower}`);

  scatterSVG.selectAll("path.domain").attr("stroke", "black");
  scatterSVG.selectAll(".tick line").attr("stroke", "black");
  scatterSVG.selectAll(".tick text").attr("fill", "black");
}
