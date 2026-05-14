const faqTocLinks = Array.from(document.querySelectorAll(".faq-toc a"));
const faqSections = Array.from(document.querySelectorAll("#faq-main-content, #general, #ai, #gst, #billing, #security, #support, #access, #need-help"));
const faqMobileLinks = Array.from(document.querySelectorAll(".faq-mobile-links a"));
const categoryCards = Array.from(document.querySelectorAll(".category-card"));
const faqSearch = document.querySelector("#faqSearch");
const faqItems = Array.from(document.querySelectorAll(".faq-item"));
const suggestionPills = Array.from(document.querySelectorAll(".suggestion-pill"));

if (faqTocLinks.length && faqSections.length) {
  const setActiveFaqLink = id => {
    faqTocLinks.forEach(link => {
      const isMatch = link.getAttribute("href") === `#${id}`;
      link.classList.toggle("is-active", isMatch);
    });
  };

  const faqObserver = new IntersectionObserver(
    entries => {
      const visible = entries
        .filter(entry => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (visible?.target?.id) {
        setActiveFaqLink(visible.target.id);
      }
    },
    {
      rootMargin: "-20% 0px -55% 0px",
      threshold: [0.15, 0.35, 0.55]
    }
  );

  faqSections.forEach(section => faqObserver.observe(section));
}

faqMobileLinks.forEach(link => {
  link.addEventListener("click", () => {
    const details = document.querySelector(".faq-mobile-toc");
    if (details) {
      details.removeAttribute("open");
    }
  });
});

categoryCards.forEach(card => {
  card.addEventListener("click", () => {
    const target = document.querySelector(`#${card.dataset.target}`);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      if (target instanceof HTMLDetailsElement) {
        target.open = true;
      }
    }
  });
});

const filterFaqItems = query => {
  const term = query.trim().toLowerCase();
  faqItems.forEach(item => {
    const content = item.textContent.toLowerCase();
    item.style.display = !term || content.includes(term) ? "" : "none";
  });
};

if (faqSearch) {
  faqSearch.addEventListener("input", event => {
    filterFaqItems(event.target.value);
  });
}

suggestionPills.forEach(pill => {
  pill.addEventListener("click", () => {
    if (faqSearch) {
      faqSearch.value = pill.textContent || "";
      filterFaqItems(faqSearch.value);
      faqSearch.focus();
    }
  });
});
