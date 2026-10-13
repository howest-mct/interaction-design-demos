const SVG_NS = "http://www.w3.org/2000/svg";
const HEIGHT = 50;
const TOP = 100;

const data = [
    { label: "A", value: 96 },
    { label: "B", value: 97 },
    { label: "C", value: 98 },
];

const chart = document.querySelector("#chart");
const slider = document.querySelector("#start");
const output = document.querySelector("#output");
const description = document.querySelector("#chart-desc");

const svg = (tag, attributes = {}, text) => {
    const element = document.createElementNS(SVG_NS, tag);
    for (const [name, value] of Object.entries(attributes)) {
        element.setAttribute(name, value);
    }
    if (text !== undefined) element.textContent = text;
    return element;
};

const draw = (start) => {
    // Everything below is rebuilt when the slider moves: the scale decides the picture
    const toY = (value) => HEIGHT - ((value - start) / (TOP - start)) * HEIGHT;
    const step = start >= 90 ? 1 : start >= 75 ? 5 : 25;

    const grid = svg("g", { class: "chart__grid" });
    const yLabels = svg("g", { class: "chart__labels chart__labels--y" });
    for (let value = start; value <= TOP; value += step) {
        grid.append(svg("line", { x1: 0, y1: toY(value), x2: 100, y2: toY(value) }));
        yLabels.append(svg("text", { x: -2, y: toY(value) }, value));
    }

    const bars = svg("g", { class: "chart__bars" });
    const xLabels = svg("g", { class: "chart__labels chart__labels--x" });
    data.forEach(({ label, value }, index) => {
        const x = 10 + index * 30;
        const y = toY(value);
        bars.append(svg("rect", { x, y, width: 20, height: HEIGHT - y }));
        xLabels.append(svg("text", { x: x + 10, y: HEIGHT + 5 }, label));
    });

    chart.replaceChildren(chart.querySelector("title"), chart.querySelector("desc"), grid, bars, yLabels, xLabels);
};

slider.addEventListener("input", () => {
    const start = Number(slider.value);
    output.textContent = start;
    description.textContent =
        start === 0
            ? "A scores 96, B 97 and C 98. With the axis starting at 0 the difference is small."
            : `A scores 96, B 97 and C 98. The axis starts at ${start}, which makes the difference look much bigger than it is.`;
    draw(start);
});

draw(0);
