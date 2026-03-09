const revealEls = document.querySelectorAll(".reveal");
const yearEl = document.getElementById("year");

if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.14,
    rootMargin: "0px 0px -30px 0px",
  }
);

revealEls.forEach((el, index) => {
  el.style.transitionDelay = `${Math.min(index * 70, 280)}ms`;
  revealObserver.observe(el);
});

const canvas = document.getElementById("starfield");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (canvas) {
  const ctx = canvas.getContext("2d");
  let width = 0;
  let height = 0;
  let stars = [];
  let animationId = null;

  const makeStars = () => {
    const density = Math.max(140, Math.floor((width * height) / 9500));
    stars = Array.from({ length: density }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.6 + 0.2,
      speed: Math.random() * 0.18 + 0.04,
      alpha: Math.random() * 0.85 + 0.1,
      twinkle: Math.random() * 0.02 + 0.004,
      hue: Math.random() > 0.84 ? 290 : 200,
    }));
  };

  const resize = () => {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
    makeStars();
  };

  const drawFrame = () => {
    ctx.clearRect(0, 0, width, height);

    stars.forEach((star) => {
      star.y += star.speed;
      star.alpha += star.twinkle;

      if (star.alpha > 0.95 || star.alpha < 0.12) {
        star.twinkle *= -1;
      }

      if (star.y > height + 2) {
        star.y = -2;
        star.x = Math.random() * width;
      }

      const color = `hsla(${star.hue}, 100%, 78%, ${star.alpha})`;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fill();
    });

    animationId = requestAnimationFrame(drawFrame);
  };

  resize();

  if (!prefersReducedMotion) {
    drawFrame();
  } else {
    ctx.clearRect(0, 0, width, height);
    stars.forEach((star) => {
      const color = `hsla(${star.hue}, 100%, 78%, ${star.alpha})`;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  window.addEventListener("resize", () => {
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
    resize();
    if (!prefersReducedMotion) {
      drawFrame();
    }
  });
}
