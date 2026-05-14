const termsTocLinks = Array.from(document.querySelectorAll(".terms-toc a"));
const termsSections = Array.from(document.querySelectorAll("#terms-overview, #terms-document, #terms-section-support, #terms-contact-card"));
const termsMobileLinks = Array.from(document.querySelectorAll(".terms-mobile-links a"));

if (termsTocLinks.length && termsSections.length) {
  const setActiveTermsLink = id => {
    termsTocLinks.forEach(link => {
      const isMatch = link.getAttribute("href") === `#${id}`;
      link.classList.toggle("is-active", isMatch);
    });
  };

  const termsObserver = new IntersectionObserver(
    entries => {
      const visible = entries
        .filter(entry => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (visible?.target?.id) {
        setActiveTermsLink(visible.target.id);
      }
    },
    {
      rootMargin: "-20% 0px -55% 0px",
      threshold: [0.15, 0.35, 0.55]
    }
  );

  termsSections.forEach(section => termsObserver.observe(section));
}

termsMobileLinks.forEach(link => {
  link.addEventListener("click", () => {
    const details = document.querySelector(".terms-mobile-toc");
    if (details) {
      details.removeAttribute("open");
    }
  });
});
