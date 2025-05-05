// pie-chart.js
d3.csv("a1-cars.csv").then(function(data) {
    const width = 450, height = 450, margin = 40;
    const radius = Math.min(width, height) / 2 - margin;

    const svg = d3.select("#pieChart")
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .append("g")
        .attr("transform", `translate(${width / 2},${height / 2})`);

    const color = d3.scaleOrdinal()
        .domain(["American", "European", "Japanese"])
        .range(["#1f77b4", "#ff7f0e", "#2ca02c"]);

    let selectedOrigin = null;

    function updateChart(selected = null) {
        const counts = d3.rollup(data, v => v.length, d => d.Origin);
        const pie = d3.pie().value(d => d[1]);
        const data_ready = pie(Array.from(counts));

        const arc = d3.arc()
            .innerRadius(0)
            .outerRadius(radius);

        const pieGroups = svg.selectAll("path").data(data_ready, d => d.data[0]);

        pieGroups.enter()
            .append("path")
            .merge(pieGroups)
            .transition().duration(500)
            .attr("d", arc)
            .attr("fill", d => color(d.data[0]))
            .attr("opacity", d => !selected || selected === d.data[0] ? 1 : 0.3);

        pieGroups.enter()
            .append("title")
            .merge(pieGroups.select("title"))
            .text(d => `${d.data[0]}: ${d.data[1]} (${((d.data[1] / data.length) * 100).toFixed(1)}%)`);

        const labels = svg.selectAll("text").data(data_ready, d => d.data[0]);
        labels.enter()
            .append("text")
            .merge(labels)
            .text(d =>
                !selected || selected === d.data[0]
                    ? `${d.data[0]}: ${d.data[1]} (${((d.data[1] / data.length) * 100).toFixed(1)}%)`
                    : ""
            )
            .attr("transform", d => `translate(${arc.centroid(d)})`)
            .style("text-anchor", "middle")
            .style("font-size", "14px")
            .attr("fill", "black");

        pieGroups.exit().remove();
        labels.exit().remove();
    }

    updateChart();

    svg.selectAll("path").on("click", function(event, d) {
        selectedOrigin = d.data[0] === selectedOrigin ? null : d.data[0];
        updateChart(selectedOrigin);
        window.dispatchEvent(new CustomEvent('originSelected', { detail: selectedOrigin }));
    });

    document.getElementById("resetBtnPie").addEventListener("click", () => {
        selectedOrigin = null;
        updateChart(null);
        window.dispatchEvent(new CustomEvent('originSelected', { detail: null }));
    });
});
