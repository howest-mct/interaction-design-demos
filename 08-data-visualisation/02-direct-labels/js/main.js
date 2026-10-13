const SVG_NS = "http://www.w3.org/2000/svg";
const WIDTH = 90; // room on the right for the direct labels
const HEIGHT = 50;
const MAX = 50;

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
const series = [
    { name: "Search", color: "chart-1", values: [20, 24, 30, 34, 40, 46] },
    { name: "Social", color: "chart-2", values: [8, 14, 22, 20, 28, 26] },
    { name: "Mail", color: "chart-3", values: [12, 11, 14, 13, 15, 14], dashed: true },
];

const svg = (tag, attributes = {}, text) => {
    const element = document.createElementNS(SVG_NS, tag);
    for (const [name, value] of Object.entries(attributes)) {
        element.setAttribute(name, value);
    }
    if (text !== undefined) element.textContent = text;
    return element;
};

const toX = (index) => (index / (months.length - 1)) * WIDTH;
const toY = (value) => HEIGHT - (value / MAX) * HEIGHT;

const drawAxes = (chart) => {
    const grid = svg("g", { class: "chart__grid" });
    const yLabels = svg("g", { class: "chart__labels chart__labels--y" });
    for (let value = 0; value <= MAX; value += 10) {
        grid.append(svg("line", { x1: 0, y1: toY(value), x2: WIDTH + 14, y2: toY(value) }));
        yLabels.append(svg("text", { x: -2, y: toY(value) }, value));
    }
    const xLabels = svg("g", { class: "chart__labels chart__labels--x" });
    months.forEach((month, index) => xLabels.append(svg("text", { x: toX(index), y: HEIGHT + 5 }, month)));
    chart.append(grid, yLabels, xLabels);
};

const drawLines = (chart) => {
    for (const { color, values, dashed } of series) {
        const points = values.map((value, index) => `${toX(index)},${toY(value)}`).join(" ");
        const line = svg("polyline", { class: `chart__line chart__line--${color}`, points });
        // A line style is a second cue next to color
        if (dashed) line.setAttribute("stroke-dasharray", "2.5 1.5");
        chart.append(line);
    }
};

// Version 1: a legend at the top
const legendChart = document.querySelector("#chart-legend");
drawAxes(legendChart);
drawLines(legendChart);
const legend = svg("g", { class: "chart__labels chart__legend" });
series.forEach(({ name, color }, index) => {
    const x = index * 30;
    legend.append(svg("rect", { class: `chart__swatch chart__swatch--${color}`, x, y: -8, width: 4, height: 4 }));
    legend.append(svg("text", { x: x + 6, y: -5.8 }, name));
});
legendChart.append(legend);

// Version 2: the label sits at the end of the line, in the color of the line
const directChart = document.querySelector("#chart-direct");
drawAxes(directChart);
drawLines(directChart);
const labels = svg("g", { class: "chart__labels chart__labels--direct" });
for (const { name, color, values } of series) {
    labels.append(
        svg("text", { class: `chart__label--${color}`, x: WIDTH + 2.5, y: toY(values.at(-1)) }, name),
    );
}
directChart.append(labels);

// The grayscale check: if you can still read the chart, so can everyone else
document.querySelector("#grayscale").addEventListener("change", (event) => {
    document.querySelector("#charts").classList.toggle("is-grayscale", event.target.checked);
});
