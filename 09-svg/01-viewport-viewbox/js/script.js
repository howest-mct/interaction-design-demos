const svg = document.querySelector(".demo__svg");
const form = document.querySelector(".controls");
const output = document.querySelector(".controls__output");

function update() {
    const { width, height, useViewBox, vbX, vbY, vbWidth, vbHeight, aspect } = form.elements;

    // Viewport: the size of the SVG on the page
    svg.setAttribute("width", width.value);
    svg.setAttribute("height", height.value);

    // viewBox: which part of the canvas is visible in the viewport
    const viewBox = `${vbX.value} ${vbY.value} ${vbWidth.value} ${vbHeight.value}`;
    let tag = `<svg width="${width.value}" height="${height.value}"`;

    if (useViewBox.checked) {
        svg.setAttribute("viewBox", viewBox);
        svg.setAttribute("preserveAspectRatio", aspect.value);
        tag += ` viewBox="${viewBox}" preserveAspectRatio="${aspect.value}"`;
    } else {
        // Without a viewBox, 1 user unit = 1px: the drawing no longer scales
        svg.removeAttribute("viewBox");
        svg.removeAttribute("preserveAspectRatio");
    }

    // Without a viewBox, these settings do nothing
    for (const input of [vbX, vbY, vbWidth, vbHeight, aspect]) {
        input.disabled = !useViewBox.checked;
    }

    output.textContent = `${tag}>`;
}

form.addEventListener("input", update);

// The reset event fires before the inputs get their default values back
form.addEventListener("reset", () => {
    requestAnimationFrame(update);
});

update();
