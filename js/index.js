const wrapper = document.querySelector(".wrapper");
const carousel = document.querySelector(".carousel");
const firstCardWidth = carousel.querySelector(".card").offsetWidth;
const arrowBtns = document.querySelectorAll(".wrapper i");
const carouselChildrens = [...carousel.children];
let isDragging = false, isAutoPlay = true, startX, startScrollLeft, timeoutId;
// Get the number of cards that can fit in the carousel at once
let cardPerView = Math.round(carousel.offsetWidth / firstCardWidth);
// Insert copies of the last few cards to beginning of carousel for infinite scrolling
carouselChildrens.slice(-cardPerView).reverse().forEach(card => {
    carousel.insertAdjacentHTML("afterbegin", card.outerHTML);
});
// Insert copies of the first few cards to end of carousel for infinite scrolling
carouselChildrens.slice(0, cardPerView).forEach(card => {
    carousel.insertAdjacentHTML("beforeend", card.outerHTML);
});
// Scroll the carousel at appropriate postition to hide first few duplicate cards on Firefox
carousel.classList.add("no-transition");
carousel.scrollLeft = carousel.offsetWidth;
carousel.classList.remove("no-transition");
// Add event listeners for the arrow buttons to scroll the carousel left and right
arrowBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        carousel.scrollLeft += btn.id == "left" ? -firstCardWidth : firstCardWidth;
    });
});
const dragStart = (e) => {
    isDragging = true;
    carousel.classList.add("dragging");
    // Records the initial cursor and scroll position of the carousel
    startX = e.pageX;
    startScrollLeft = carousel.scrollLeft;
}
const dragging = (e) => {
    if(!isDragging) return; // if isDragging is false return from here
    // Updates the scroll position of the carousel based on the cursor movement
    carousel.scrollLeft = startScrollLeft - (e.pageX - startX);
}
const dragStop = () => {
    isDragging = false;
    carousel.classList.remove("dragging");
}
const infiniteScroll = () => {
    // If the carousel is at the beginning, scroll to the end
    if(carousel.scrollLeft === 0) {
        carousel.classList.add("no-transition");
        carousel.scrollLeft = carousel.scrollWidth - (2 * carousel.offsetWidth);
        carousel.classList.remove("no-transition");
    }
    // If the carousel is at the end, scroll to the beginning
    else if(Math.ceil(carousel.scrollLeft) === carousel.scrollWidth - carousel.offsetWidth) {
        carousel.classList.add("no-transition");
        carousel.scrollLeft = carousel.offsetWidth;
        carousel.classList.remove("no-transition");
    }
    // Clear existing timeout & start autoplay if mouse is not hovering over carousel
    clearTimeout(timeoutId);
    if(!wrapper.matches(":hover")) autoPlay();
}
const autoPlay = () => {
    if(window.innerWidth < 800 || !isAutoPlay) return; // Return if window is smaller than 800 or isAutoPlay is false
    // Autoplay the carousel after every 2500 ms
    timeoutId = setTimeout(() => carousel.scrollLeft += firstCardWidth, 2500);
}
autoPlay();
carousel.addEventListener("mousedown", dragStart);
carousel.addEventListener("mousemove", dragging);
document.addEventListener("mouseup", dragStop);
carousel.addEventListener("scroll", infiniteScroll);
wrapper.addEventListener("mouseenter", () => clearTimeout(timeoutId));
wrapper.addEventListener("mouseleave", autoPlay);

/*

var container = document.querySelector(".anime-container");

var sparks = [];
var sparksIndex = 0;

var a = 10;
// I did a test and it seems mousemove only fires every frame (screen refresh), so sparkCount should be more than the frames a sec they get (so 60 for me).
var sparkCount = 100;
var sparkParticleCount = 6;

function lerp(p1, p2, t) {
  return p1 + (p2 - p1) * t;
}

//https://gist.github.com/gre/1650294
const ease = {
  // no easing, no acceleration
  linear: (t) => t,
  // accelerating from zero velocity
  inQuad: (t) => t * t,
  // decelerating to zero velocity
  outQuad: (t) => t * (2 - t),
  // acceleration until halfway, then deceleration
  inOutQuad: (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  // accelerating from zero velocity
  inCubic: (t) => t * t * t,
  // decelerating to zero velocity
  outCubic: (t) => --t * t * t + 1,
  // acceleration until halfway, then deceleration
  inOutCubic: (t) =>
    t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
  // accelerating from zero velocity
  inQuart: (t) => t * t * t * t,
  // decelerating to zero velocity
  outQuart: (t) => 1 - --t * t * t * t,
  // acceleration until halfway, then deceleration
  inOutQuart: (t) => (t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t),
  // accelerating from zero velocity
  inQuint: (t) => t * t * t * t * t,
  // decelerating to zero velocity
  outQuint: (t) => 1 + --t * t * t * t * t,
  // acceleration until halfway, then deceleration
  inOutQuint: (t) =>
    t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t
};

// https://stackoverflow.com/questions/5837572/generate-a-random-point-within-a-circle-uniformly
function circularRandom(r) {
  // Math.abs(Math.random() - Math.random()) makes it have a bias towards 0, or in our case the center
  r = r * Math.sqrt(Math.abs(Math.random() - Math.random()));
  var theta = Math.random() * 2 * Math.PI;
  var x = r * Math.cos(theta);
  var y = r * Math.sin(theta);
  return { x: x, y: y, r: r };
}

// Create the sparks
for (var i = 0; i <= sparkCount; i += 1) {
  var spark = { els: [] };

  for (var j = 0; j < sparkParticleCount; j++) {
    var dot = document.createElement("div");
    dot.classList.add("dot");
    container.appendChild(dot);
    spark.els.push(dot);

    var particleSize = anime.random(5, 20);
    var sparkRadius = 20;
    var { x, y ,r } = circularRandom(sparkRadius);

    // Make particles further from the center, smaller
    dot.style.width =
      lerp(particleSize, 1, ease.outQuad(r / sparkRadius)) + "px";
    dot.style.height =
      lerp(particleSize, 1, ease.outQuad(r / sparkRadius)) + "px";
    dot.style.opacity = "0";
    // by setting the particles start offset position using translate we can reposition the spark using left and top
    dot.style.transform = "translateX(" + x + "px) translateY(" + y + "px)";
  }

  spark.anime = new anime({
    targets: spark.els,
    loop: false,
    easing: "linear",
    autoplay: false,
    delay: anime.stagger(8),
    opacity: [
      { value: 0, duration: 0 },
      { value: 1, duration: 40 },
      {
        value: 0,
        duration: function () {
          return anime.random(500, 800);
        }
      }
    ],
    width: { value: 2, duration: 500 },
    height: { value: 2, duration: 500 },
    translateX: {
      value: function () {
        return anime.random(-30, 30);
      },
      duration: 800
    },
    translateY: {
      value: function () {
        return anime.random(-30, 30);
      },
      duration: 800
    }
  });
  sparks.push(spark);
}

// Mouse trail bit
window.addEventListener(
  "mousemove",
  function (e) {
    anime.set(sparks[sparksIndex].els, {
      left: e.pageX,
      top: e.pageY
    });
    sparks[sparksIndex].anime.restart();
    sparksIndex++;
    if (sparksIndex == sparks.length) sparksIndex = 0;
  },
  false
);
*/
