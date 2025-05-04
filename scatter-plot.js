// scatter-plot.js
let scatterSVG, scatterOriginalData;

function updateScatterPlot(data) {
  scatterOriginalData = data;
  d3.select("#scatterPlot").select("svg").remove();

  data = data.filter(d => d.Horsepower && d.Weight && d.Origin)
             .map(d => ({
               ...d,
               Horsepower: +d.Horsepower,
               Weight: +d.Weight
             }));

  const margin = { top: 30, right: 40, bottom: 60, left: 60 },
        width = 800 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

  const color = d3.scaleOrdinal(d3.schemeCategory10);

  scatterSVG = d3.select("#scatterPlot")
    .append("svg")
    .attr("width", width + margin.left + margin.right + 100)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const x = d3.scaleLinear()
              .domain(d3.extent(data, d => d.Weight))
              .range([0, width]);

  const y = d3.scaleLinear()
              .domain(d3.extent(data, d => d.Horsepower))
              .range([height, 0]);

  scatterSVG.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x));
  scatterSVG.selectAll("path.domain").attr("stroke", "black");
  scatterSVG.selectAll(".tick line").attr("stroke", "black");
  scatterSVG.selectAll(".tick text").attr("fill", "black");

  scatterSVG.append("g")
    .call(d3.axisLeft(y));
  scatterSVG.selectAll("path.domain").attr("stroke", "black");
  scatterSVG.selectAll(".tick line").attr("stroke", "black");
  scatterSVG.selectAll(".tick text").attr("fill", "black");

  // Plot circles colored by origin
  scatterSVG.selectAll("circle")
    .data(data)
    .enter().append("circle")
    .attr("cx", d => x(d.Weight))
    .attr("cy", d => y(d.Horsepower))
    .attr("r", 5)
    .attr("fill", d => color(d.Origin))
    .attr("opacity", 0.7)
    .on("click", (event, d) => handleInteraction(d))
    .append("title")
    .text(d => `${d.Car}\nWeight: ${d.Weight} lbs\nHP: ${d.Horsepower}\nOrigin: ${d.Origin}`);

  // Legend
  const origins = Array.from(new Set(data.map(d => d.Origin)));
  const legend = scatterSVG.append("g")
    .attr("transform", `translate(${width + 30}, 20)`);

  origins.forEach((origin, i) => {
    const row = legend.append("g").attr("transform", `translate(0, ${i * 20})`);
    row.append("rect").attr("width", 15).attr("height", 15).attr("fill", color(origin));
    row.append("text")
      .attr("x", 20)
      .attr("y", 12)
      .text(origin)
      .style("font-size", "12px")
      .attr("fill", "black");
  });
}
