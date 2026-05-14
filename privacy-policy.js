const legalTocLinks = Array.from(document.querySelectorAll(".legal-toc a"));
const legalSections = Array.from(document.querySelectorAll(".legal-section, #privacy-top"));
const legalTocSelect = document.querySelector("#legalTocSelect");

if (legalSections.length && legalTocLinks.length) {
  const activateTocLink = id => {
    legalTocLinks.forEach(link => {
      const isMatch = link.getAttribute("href") === `#${id}`;
      link.classList.toggle("is-active", isMatch);
    });

    if (legalTocSelect) {
      legalTocSelect.value = `#${id}`;
    }
  };

  const legalObserver = new IntersectionObserver(
    entries => {
      const visible = entries
        .filter(entry => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (visible?.target?.id) {
        activateTocLink(visible.target.id);
      }
    },
    {
      rootMargin: "-18% 0px -58% 0px",
      threshold: [0.1, 0.3, 0.5, 0.7]
    }
  );

  legalSections.forEach(section => legalObserver.observe(section));
}

if (legalTocSelect) {
  legalTocSelect.addEventListener("change", event => {
    const target = document.querySelector(event.target.value);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
}
