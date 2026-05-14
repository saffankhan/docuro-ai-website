const countUpNodes = document.querySelectorAll(".countup");

if (countUpNodes.length) {
  const countObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) {
          return;
        }

        const node = entry.target;
        const target = Number(node.dataset.count || "0");
        const suffix = target === 24 ? "/7" : target === 10 ? "x" : "%";
        const duration = 1200;
        const start = performance.now();

        const tick = now => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          node.textContent = Math.round(target * eased);

          if (progress < 1) {
            window.requestAnimationFrame(tick);
          } else {
            node.textContent = target;
            node.insertAdjacentText("beforeend", suffix);
          }
        };

        window.requestAnimationFrame(tick);
        countObserver.unobserve(node);
      });
    },
    { threshold: 0.4 }
  );

  countUpNodes.forEach(node => countObserver.observe(node));
}
