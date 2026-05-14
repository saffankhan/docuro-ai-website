const contactForm = document.querySelector("#contactForm");
const contactSubmit = document.querySelector("#contactSubmit");
const formStatus = document.querySelector("#formStatus");

if (contactForm && contactSubmit && formStatus) {
  const validators = {
    fullName: value => value.trim().length >= 2 || "Enter your full name.",
    email: value => /\S+@\S+\.\S+/.test(value) || "Enter a valid email address.",
    company: value => value.trim().length >= 2 || "Enter your company or firm name.",
    subject: value => value.trim().length > 0 || "Select a subject.",
    message: value => value.trim().length >= 10 || "Enter a message with a bit more detail."
  };

  const setFieldError = (field, message) => {
    const wrapper = field.closest(".field");
    const error = wrapper?.querySelector(".field-error");
    if (wrapper) {
      wrapper.classList.toggle("has-error", Boolean(message));
    }
    if (error) {
      error.textContent = message || "";
    }
  };

  const validateForm = () => {
    let isValid = true;
    Object.entries(validators).forEach(([name, validate]) => {
      const field = contactForm.elements.namedItem(name);
      if (!field) {
        return;
      }
      const result = validate(field.value);
      if (result !== true) {
        isValid = false;
        setFieldError(field, result);
      } else {
        setFieldError(field, "");
      }
    });
    return isValid;
  };

  contactForm.addEventListener("input", event => {
    const field = event.target;
    if (!(field instanceof HTMLInputElement || field instanceof HTMLSelectElement || field instanceof HTMLTextAreaElement)) {
      return;
    }
    if (validators[field.name]) {
      const result = validators[field.name](field.value);
      setFieldError(field, result === true ? "" : result);
    }
  });

  contactForm.addEventListener("submit", event => {
    event.preventDefault();
    formStatus.textContent = "";

    if (!validateForm()) {
      formStatus.textContent = "Please fix the highlighted fields and try again.";
      return;
    }

    contactSubmit.classList.add("is-loading");
    contactSubmit.textContent = "Sending...";

    window.setTimeout(() => {
      contactSubmit.classList.remove("is-loading");
      contactSubmit.classList.add("is-success");
      contactSubmit.textContent = "Message Sent";
      formStatus.textContent = "Your message has been queued successfully. Our team will get back to you soon.";
      contactForm.reset();

      window.setTimeout(() => {
        contactSubmit.classList.remove("is-success");
        contactSubmit.textContent = "Send Message";
      }, 2200);
    }, 1200);
  });
}
