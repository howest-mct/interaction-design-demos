const chart = document.querySelector("#chart");
const tooltip = document.querySelector("#tooltip");
const tooltipText = tooltip.querySelector(".tooltip__text");
const bars = chart.querySelectorAll(".chart__bar");

const show = (bar) => {
    const x = Number(bar.getAttribute("x")) + Number(bar.getAttribute("width")) / 2;
    const y = Number(bar.getAttribute("y"));

    tooltipText.textContent = `${bar.dataset.label}: ${bar.dataset.value}`;
    // Centered above the bar. The tooltip is 26 wide and 9 high, with a gap of 2.
    tooltip.setAttribute("transform", `translate(${x - 13} ${y - 11})`);
    tooltip.removeAttribute("hidden");

    // Fade the other bars: the CSS reads this attribute
    chart.dataset.active = bar.dataset.label;
};

const hide = () => {
    tooltip.setAttribute("hidden", "");
    delete chart.dataset.active;
};

for (const bar of bars) {
    // Mouse and touch
    bar.addEventListener("pointerenter", () => show(bar));
    bar.addEventListener("pointerleave", hide);
    // Keyboard: the same thing on focus and blur
    bar.addEventListener("focus", () => show(bar));
    bar.addEventListener("blur", hide);
}

// Escape closes the tooltip, also when a bar has focus
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") hide();
});
