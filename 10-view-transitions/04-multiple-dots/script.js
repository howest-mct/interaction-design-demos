const dot = document.querySelectorAll('.dot');
const one = document.querySelector('.one');
const two = document.querySelector('.two');

// a function that appends the dots from one to two and vice versa if you click on it
const moveDots = (e) => {
    if (one.contains(e.target)) {
        two.appendChild(e.target);
    } else if (two.contains(e.target)) {
        one.appendChild(e.target);
    }
}

// add event listener to each dot
dot.forEach(item => {
    item.addEventListener('click', function (e) {
        // moveDots(e);
        // now with viewtransition
        document.startViewTransition(() => moveDots(e));
    });
});