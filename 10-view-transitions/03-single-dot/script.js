const dot = document.querySelector(".dot");
const one = document.querySelector(".one");
const two = document.querySelector(".two");

// a function that moves the dot from one to two and vice versa
const moveDot = () => {
  if (one.contains(dot)) {
    two.appendChild(dot);
  } else {
    one.appendChild(dot);
  }
};

dot.addEventListener("click", function (event) {
  // moveDot();
  // now with viewtransition
  document.startViewTransition(() => moveDot());
});
