const body = document.body;
const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const revealItems = document.querySelectorAll("[data-reveal]");
const billingButtons = document.querySelectorAll(".toggle-option");
const priceValues = document.querySelectorAll("[data-monthly]");
const rangeInput = document.querySelector("#invoiceRange");
const invoiceCount = document.querySelector("#invoiceCount");
const hoursSaved = document.querySelector("#hoursSaved");
const errorSaved = document.querySelector("#errorSaved");
const chatbotToggle = document.querySelector(".chatbot-toggle");
const chatbotPanel = document.querySelector("#chatbotPanel");
const chatMessages = document.querySelector("#chatMessages");
const chatPrompts = document.querySelectorAll(".chat-prompt");
const demoModal = document.querySelector("#demoModal");
const demoImage = document.querySelector("#demoImage");
const demoCaptionTitle = document.querySelector("#demoCaptionTitle");
const demoCaptionBody = document.querySelector("#demoCaptionBody");
const demoOpeners = document.querySelectorAll(".js-open-demo");
const demoClosers = document.querySelectorAll(".js-close-demo");
const carouselTrack = document.querySelector(".carousel-track");
const carouselSlides = Array.from(document.querySelectorAll(".carousel-slide"));
const carouselDotsWrap = document.querySelector(".carousel-dots");
const carouselPrev = document.querySelector(".js-carousel-prev");
const carouselNext = document.querySelector(".js-carousel-next");

const demoFrames = [
  {
    src: "./assets/images/invoice-upload.png",
    title: "Upload invoice",
    body: "Capture bills, PDFs, or WhatsApp images and send them into one structured AI workflow."
  },
  {
    src: "./assets/images/ca-workspace.png",
    title: "Review client workspaces",
    body: "Manage multiple entities and review queues from a CA-friendly operational dashboard."
  },
  {
    src: "./assets/images/gst-dashboard.png",
    title: "Monitor GST in real time",
    body: "See payable amounts, filing alerts, and compliance readiness before the deadline hits."
  },
  {
    src: "./assets/images/tally-export.png",
    title: "Export into Tally",
    body: "Push approved entries downstream once AI classification and human review are complete."
  }
];

const chatReplies = {
  "How does Tally export work?":
    "Docuro AI structures approved vouchers and prepares them for Tally-ready export, which cuts the manual cleanup step before posting.",
  "Can you handle GST workflows?":
    "Yes. The platform is positioned around Indian GST workflows with live payable tracking, alerts, and filing-ready reporting support.",
  "Which plan is right for a CA firm?":
    "Most CA firms will fit best on Pro because it adds AI inbox controls, multi-client workspaces, and stronger review workflows."
};

let currentFrame = 0;
let demoInterval;
let currentSlide = 0;

const setHeaderState = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 12);
};

const setupReveal = () => {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.05, rootMargin: "0px 0px -10% 0px" }
  );

  revealItems.forEach(item => {
    // Safety net: large elements (taller than viewport) may never reach 18% visibility
    // before the user scrolls past the top — show them immediately.
    if (item.offsetHeight > window.innerHeight * 0.9) {
      item.classList.add("is-visible");
    } else {
      observer.observe(item);
    }
  });
};

const setBilling = billing => {
  billingButtons.forEach(button => {
    button.classList.toggle("is-active", button.dataset.billing === billing);
  });

  priceValues.forEach(price => {
    price.textContent = price.dataset[billing];
    const suffix = price.nextElementSibling;
    if (suffix) {
      suffix.textContent = billing === "monthly" ? "/month" : "/month billed yearly";
    }
  });
};

const formatNumber = value => new Intl.NumberFormat("en-IN").format(value);

const updateCalculator = () => {
  const invoices = Number(rangeInput.value);
  const savedHours = Math.round((invoices * 8 * 0.8) / 60);
  const avoidedErrors = Math.round(invoices * 0.9);

  invoiceCount.textContent = formatNumber(invoices);
  hoursSaved.textContent = formatNumber(savedHours);
  errorSaved.textContent = formatNumber(avoidedErrors);
};

const addMessage = (message, type) => {
  const bubble = document.createElement("div");
  bubble.className = `chat-message ${type}`;
  bubble.textContent = message;
  chatMessages.appendChild(bubble);
};

const toggleChatbot = () => {
  const isExpanded = chatbotToggle.getAttribute("aria-expanded") === "true";
  chatbotToggle.setAttribute("aria-expanded", String(!isExpanded));
  chatbotPanel.hidden = isExpanded;
};

const showDemoFrame = index => {
  const frame = demoFrames[index];
  demoImage.src = frame.src;
  demoCaptionTitle.textContent = frame.title;
  demoCaptionBody.textContent = frame.body;
};

const startDemo = () => {
  demoModal.hidden = false;
  body.style.overflow = "hidden";
  currentFrame = 0;
  showDemoFrame(currentFrame);

  clearInterval(demoInterval);
  demoInterval = window.setInterval(() => {
    currentFrame = (currentFrame + 1) % demoFrames.length;
    showDemoFrame(currentFrame);
  }, 2600);
};

const closeDemo = () => {
  demoModal.hidden = true;
  body.style.overflow = "";
  clearInterval(demoInterval);
};

const renderCarouselDots = () => {
  carouselSlides.forEach((slide, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = `carousel-dot${index === 0 ? " is-active" : ""}`;
    dot.textContent = slide.dataset.label;
    dot.addEventListener("click", () => goToSlide(index));
    carouselDotsWrap.appendChild(dot);
  });
};

const goToSlide = index => {
  currentSlide = (index + carouselSlides.length) % carouselSlides.length;
  carouselTrack.style.transform = `translateX(-${currentSlide * 100}%)`;

  carouselSlides.forEach((slide, slideIndex) => {
    slide.classList.toggle("is-active", slideIndex === currentSlide);
  });

  const dots = carouselDotsWrap.querySelectorAll(".carousel-dot");
  dots.forEach((dot, dotIndex) => {
    dot.classList.toggle("is-active", dotIndex === currentSlide);
  });
};

window.addEventListener("scroll", setHeaderState);
window.addEventListener("load", setHeaderState);

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const expanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!expanded));
    menuToggle.classList.toggle("is-active", !expanded);
    navLinks.classList.toggle("is-open", !expanded);
  });

  navLinks.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.classList.remove("is-active");
      navLinks.classList.remove("is-open");
    });
  });
}

billingButtons.forEach(button => {
  button.addEventListener("click", () => setBilling(button.dataset.billing));
});

if (rangeInput) {
  rangeInput.addEventListener("input", updateCalculator);
  updateCalculator();
}

if (chatbotToggle && chatbotPanel) {
  chatbotToggle.addEventListener("click", toggleChatbot);
}

chatPrompts.forEach(promptButton => {
  promptButton.addEventListener("click", () => {
    const prompt = promptButton.dataset.prompt;
    addMessage(prompt, "user");
    window.setTimeout(() => {
      addMessage(chatReplies[prompt] || "Our team can show you the right workflow during a guided demo.", "bot");
    }, 300);
  });
});

demoOpeners.forEach(button => button.addEventListener("click", startDemo));
demoClosers.forEach(button => button.addEventListener("click", closeDemo));

document.addEventListener("keydown", event => {
  if (demoModal && event.key === "Escape" && !demoModal.hidden) {
    closeDemo();
  }
});

if (carouselTrack && carouselDotsWrap && carouselSlides.length) {
  renderCarouselDots();
  goToSlide(0);
}

if (carouselPrev) {
  carouselPrev.addEventListener("click", () => goToSlide(currentSlide - 1));
}

if (carouselNext) {
  carouselNext.addEventListener("click", () => goToSlide(currentSlide + 1));
}

setupReveal();
setBilling("monthly");
