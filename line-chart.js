// line-chart.js
let lineSVG, lineOriginalData;

function updateLineChart(data) {
  lineOriginalData = data;
  d3.select("#lineChart").select("svg").remove();

  data.forEach(d => {
    d["Model Year"] = +d["Model Year"];
    d.MPG = +d.MPG;
  });

  const groupedData = Array.from(
    d3.group(data, d => d.Origin),
    ([origin, values]) => ({
      origin,
      values: d3.rollups(
        values,
        v => d3.mean(v, d => d.MPG),
        d => d["Model Year"]
      ).map(([year, avgMPG]) => ({ year, avgMPG }))
        .sort((a, b) => a.year - b.year)
    })
  );

  const margin = { top: 40, right: 80, bottom: 50, left: 60 },
        width = 450 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

  lineSVG = d3.select("#lineChart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const x = d3.scaleLinear().domain([70, 82]).range([0, width]);
  const y = d3.scaleLinear()
              .domain([0, d3.max(groupedData, g => d3.max(g.values, d => d.avgMPG))])
              .range([height, 0]);

  const color = d3.scaleOrdinal(d3.schemeCategory10);

  // X Axis
  lineSVG.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x).tickFormat(d => 1900 + d));
  lineSVG.selectAll("path.domain").attr("stroke", "black");
  lineSVG.selectAll(".tick line").attr("stroke", "black");
  lineSVG.selectAll(".tick text").attr("fill", "black");

  // Y Axis
  lineSVG.append("g")
    .call(d3.axisLeft(y));
  lineSVG.selectAll("path.domain").attr("stroke", "black");
  lineSVG.selectAll(".tick line").attr("stroke", "black");
  lineSVG.selectAll(".tick text").attr("fill", "black");

  const line = d3.line()
    .x(d => x(d.year))
    .y(d => y(d.avgMPG));

  groupedData.forEach(group => {
    lineSVG.append("path")
      .datum(group.values)
      .attr("fill", "none")
      .attr("stroke", color(group.origin))
      .attr("stroke-width", 2)
      .attr("d", line)
      .on("click", () => handleInteraction({ Origin: group.origin }));
  });

  const legend = lineSVG.append("g")
    .attr("transform", `translate(${width - 40}, 10)`);

  groupedData.forEach((group, i) => {
    const legendRow = legend.append("g")
      .attr("transform", `translate(0, ${i * 20})`);
    legendRow.append("rect").attr("width", 15).attr("height", 15).attr("fill", color(group.origin));
    legendRow.append("text").attr("x", 20).attr("y", 12).text(group.origin).style("font-size", "12px").attr("fill", "black");
  });
}
