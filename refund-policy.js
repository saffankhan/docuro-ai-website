const refundTocLinks = Array.from(document.querySelectorAll(".refund-toc a"));
const refundSections = Array.from(document.querySelectorAll("#refund-overview, #refund-document, #refund-section-support, #refund-contact-card"));
const refundMobileLinks = Array.from(document.querySelectorAll(".refund-mobile-links a"));

if (refundTocLinks.length && refundSections.length) {
  const setActiveRefundLink = id => {
    refundTocLinks.forEach(link => {
      const isMatch = link.getAttribute("href") === `#${id}`;
      link.classList.toggle("is-active", isMatch);
    });
  };

  const refundObserver = new IntersectionObserver(
    entries => {
      const visible = entries
        .filter(entry => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (visible?.target?.id) {
        setActiveRefundLink(visible.target.id);
      }
    },
    {
      rootMargin: "-20% 0px -55% 0px",
      threshold: [0.15, 0.35, 0.55]
    }
  );

  refundSections.forEach(section => refundObserver.observe(section));
}

refundMobileLinks.forEach(link => {
  link.addEventListener("click", () => {
    const details = document.querySelector(".refund-mobile-toc");
    if (details) {
      details.removeAttribute("open");
    }
  });
});
