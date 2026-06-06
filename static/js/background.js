// const canvas = document.getElementById("background-canvas");
// const ctx = canvas.getContext("2d");

// let dots = [];

// // init
// setupCanvas();
// createDots();
// drawDots();

// // update on scroll
// window.addEventListener("scroll", () => {
//   drawDots(window.scrollY);
// });

// // resize
// window.addEventListener("resize", () => {
//   setupCanvas();
//   createDots();
//   drawDots(window.scrollY);
// });

function setupCanvas() {
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;

  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  canvas.style.width = rect.width + "px";
  canvas.style.height = rect.height + "px";
}

function createDots(count = 150) {
  dots = [];

  for (let i = 0; i < count; i++) {
    dots.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + 0.5,
      speed: Math.random() * 0.5 + 0.2, // parallax strength
      alpha: Math.random()
    });
  }
}

function drawDots(scrollY = 0) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  dots.forEach(dot => {
    const yOffset = scrollY * dot.speed;

    let y = dot.y + yOffset;

    // wrap vertically
    y = y % canvas.height;
    if (y < 0) y += canvas.height;

    ctx.beginPath();
    ctx.arc(dot.x, y, dot.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${dot.alpha})`;
    ctx.fill();
  });
}
