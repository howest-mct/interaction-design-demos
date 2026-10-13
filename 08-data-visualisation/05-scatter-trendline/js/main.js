const SVG_NS = "http://www.w3.org/2000/svg";
const WIDTH = 100;
const HEIGHT = 60;
const COUNT = 30;

const chart = document.querySelector("#chart");
const result = document.querySelector("#result");
const description = document.querySelector("#chart-desc");

const svg = (tag, attributes = {}, text) => {
    const element = document.createElementNS(SVG_NS, tag);
    for (const [name, value] of Object.entries(attributes)) {
        element.setAttribute(name, value);
    }
    if (text !== undefined) element.textContent = text;
    return element;
};

// x and y both run from 0 to 1. The noise is what makes it look like real data.
const generators = {
    positive: (x) => 0.1 + 0.8 * x + (Math.random() - 0.5) * 0.25,
    negative: (x) => 0.9 - 0.8 * x + (Math.random() - 0.5) * 0.25,
    none: () => 0.1 + 0.8 * Math.random(),
    curve: (x) => 0.1 + 0.8 * (1 - (2 * x - 1) ** 2) + (Math.random() - 0.5) * 0.1,
};

const average = (values) => values.reduce((sum, value) => sum + value, 0) / values.length;

// Least squares: the line that stays closest to all points, and Pearson's r
const analyse = (points) => {
    const meanX = average(points.map((p) => p.x));
    const meanY = average(points.map((p) => p.y));
    let sxy = 0;
    let sxx = 0;
    let syy = 0;
    for (const { x, y } of points) {
        sxy += (x - meanX) * (y - meanY);
        sxx += (x - meanX) ** 2;
        syy += (y - meanY) ** 2;
    }
    const slope = sxy / sxx;
    return { slope, intercept: meanY - slope * meanX, r: sxy / Math.sqrt(sxx * syy) };
};

const strength = (r) => {
    const size = Math.abs(r);
    const how = size > 0.7 ? "strong" : size > 0.4 ? "weak" : "no";
    const direction = r > 0 ? "positive " : r < 0 ? "negative " : "";
    return how === "no" ? "no correlation" : `${how} ${direction}correlation`;
};

const draw = (kind) => {
    const points = Array.from({ length: COUNT }, () => {
        const x = Math.random();
        return { x, y: Math.min(1, Math.max(0, generators[kind](x))) };
    });
    const { slope, intercept, r } = analyse(points);

    const toX = (x) => x * WIDTH;
    const toY = (y) => HEIGHT - y * HEIGHT;

    const grid = svg("g", { class: "chart__grid" });
    for (let step = 0; step <= 4; step++) {
        const y = (step / 4) * HEIGHT;
        grid.append(svg("line", { x1: 0, y1: y, x2: WIDTH, y2: y }));
    }

    const dots = svg("g", { class: "chart__dots" });
    for (const point of points) {
        dots.append(svg("circle", { cx: toX(point.x), cy: toY(point.y), r: 1.3 }));
    }

    // The trend line from x = 0 to x = 1
    const trend = svg("line", {
        class: "chart__trend",
        x1: toX(0),
        y1: toY(intercept),
        x2: toX(1),
        y2: toY(slope + intercept),
    });

    const labels = svg("g", { class: "chart__labels" });
    labels.append(svg("text", { class: "chart__labels--x", x: WIDTH / 2, y: HEIGHT + 7 }, "Hours studied per week"));
    labels.append(svg("text", { transform: `translate(-8 ${HEIGHT / 2}) rotate(-90)`, "text-anchor": "middle" }, "Score"));

    chart.replaceChildren(chart.querySelector("title"), chart.querySelector("desc"), grid, dots, trend, labels);

    const text = `r = ${r.toFixed(2)}: ${strength(r)}`;
    result.textContent = text;
    description.textContent = `Scatter plot of ${COUNT} students. ${text}.`;
};

for (const button of document.querySelectorAll("button[data-kind]")) {
    button.addEventListener("click", () => draw(button.dataset.kind));
}

draw("positive");
