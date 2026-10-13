const SVG_NS = "http://www.w3.org/2000/svg";
const HEIGHT = 50; // the plot is 100 wide and 50 high, see the viewBox
const WIDTH = 100;

const chart = document.querySelector("#chart");
const tableBody = document.querySelector("#table tbody");
const description = document.querySelector("#chart-desc");

const numberFormat = new Intl.NumberFormat("en");

// Create an SVG element with attributes (SVG elements need createElementNS)
const svg = (tag, attributes = {}, text) => {
    const element = document.createElementNS(SVG_NS, tag);
    for (const [name, value] of Object.entries(attributes)) {
        element.setAttribute(name, value);
    }
    // textContent, not innerHTML: data from outside is never markup
    if (text !== undefined) element.textContent = text;
    return element;
};

const drawChart = (data) => {
    // 1. Scale: the maximum becomes the top of the plot, rounded up to a nice number
    const max = Math.ceil(Math.max(...data.map((d) => d.visitors)) / 5000) * 5000;
    const toY = (value) => HEIGHT - (value / max) * HEIGHT;

    // 2. Gridlines and y labels
    const grid = svg("g", { class: "chart__grid" });
    const yLabels = svg("g", { class: "chart__labels chart__labels--y" });
    for (let value = 0; value <= max; value += 5000) {
        grid.append(svg("line", { x1: 0, y1: toY(value), x2: WIDTH, y2: toY(value) }));
        yLabels.append(svg("text", { x: -2, y: toY(value) }, `${value / 1000}k`));
    }

    // 3. One bar and one x label per row of data
    const slot = WIDTH / data.length;
    const bars = svg("g", { class: "chart__bars" });
    const xLabels = svg("g", { class: "chart__labels chart__labels--x" });
    data.forEach((d, index) => {
        const height = (d.visitors / max) * HEIGHT;
        bars.append(
            svg("rect", {
                x: index * slot + slot * 0.15,
                y: HEIGHT - height,
                width: slot * 0.7,
                height,
            }),
        );
        xLabels.append(svg("text", { x: index * slot + slot / 2, y: HEIGHT + 5 }, d.day));
    });

    chart.append(grid, bars, yLabels, xLabels);
};

const drawTable = (data) => {
    for (const d of data) {
        const row = document.createElement("tr");
        const day = document.createElement("th");
        day.scope = "row";
        day.textContent = d.day;
        const visitors = document.createElement("td");
        visitors.textContent = numberFormat.format(d.visitors);
        row.append(day, visitors);
        tableBody.append(row);
    }
};

const describe = (data) => {
    const top = data.reduce((a, b) => (b.visitors > a.visitors ? b : a));
    const low = data.reduce((a, b) => (b.visitors < a.visitors ? b : a));
    description.textContent = `${top.day} is the busiest day with ${numberFormat.format(top.visitors)} visitors, ${low.day} the quietest with ${numberFormat.format(low.visitors)}.`;
};

// Fetch the data, then render. Change data.json and the chart, table and description follow.
const response = await fetch("data.json");
const data = await response.json();

drawChart(data);
drawTable(data);
describe(data);
