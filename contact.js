/**
 * Docuro AI — Contact Form
 *
 * Email delivery strategy
 * -----------------------
 * Primary: Web3Forms (https://web3forms.com) — recipient email is bound to the
 *   access key on the server side, so the key below is safe to expose in the
 *   browser. Generate a key with sufiyankhan776602@gmail.com as the recipient
 *   at https://web3forms.com/ and paste it into WEB3FORMS_ACCESS_KEY below.
 *
 * Fallback: if the access key is left as the placeholder, the form opens the
 *   user's mail client pre-addressed to sufiyankhan776602@gmail.com with all
 *   form fields filled in — so the contact form works immediately on deploy,
 *   even before the access key is configured.
 */

const WEB3FORMS_ACCESS_KEY = "YOUR_WEB3FORMS_ACCESS_KEY"; // <-- paste your Web3Forms access key here
const FALLBACK_EMAIL = "sufiyankhan776602@gmail.com";

const contactForm = document.querySelector("#contactForm");
const contactSubmit = document.querySelector("#contactSubmit");
const formStatus = document.querySelector("#formStatus");
const formSuccess = document.querySelector("#formSuccess");
const sendAnotherBtn = document.querySelector("#sendAnother");

if (contactForm && contactSubmit && formStatus) {
  const submitLabel = contactSubmit.querySelector(".button-label") || contactSubmit;
  const originalLabel = submitLabel.textContent;
  let isSubmitting = false;

  const validators = {
    fullName: value => value.trim().length >= 2 || "Please enter your full name.",
    email: value =>
      /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim()) || "Please enter a valid email address.",
    company: value => value.trim().length >= 2 || "Please enter your company or firm name.",
    phone: value => {
      const trimmed = value.trim();
      if (!trimmed) return true; // optional
      return /^[+\d][\d\s\-()]{6,19}$/.test(trimmed) || "Please enter a valid phone number.";
    },
    subject: value => value.trim().length > 0 || "Please select a subject.",
    message: value =>
      value.trim().length >= 10 || "Please share a few more details (at least 10 characters)."
  };

  const sanitize = value => String(value || "").replace(/[<>]/g, "").trim();

  const setFieldError = (field, message) => {
    const wrapper = field.closest(".field");
    if (!wrapper) return;
    const error = wrapper.querySelector(".field-error");
    wrapper.classList.toggle("has-error", Boolean(message));
    if (error) error.textContent = message || "";
  };

  const validateForm = () => {
    let isValid = true;
    let firstInvalid = null;
    Object.entries(validators).forEach(([name, validate]) => {
      const field = contactForm.elements.namedItem(name);
      if (!field) return;
      const result = validate(field.value);
      if (result !== true) {
        isValid = false;
        if (!firstInvalid) firstInvalid = field;
        setFieldError(field, result);
      } else {
        setFieldError(field, "");
      }
    });
    if (firstInvalid) firstInvalid.focus();
    return isValid;
  };

  const setLoading = loading => {
    isSubmitting = loading;
    contactSubmit.disabled = loading;
    contactSubmit.classList.toggle("is-loading", loading);
    if (loading) {
      submitLabel.textContent = "Sending...";
    } else {
      submitLabel.textContent = originalLabel;
    }
  };

  const showSuccess = () => {
    if (!formSuccess) return;
    contactForm.hidden = true;
    formSuccess.hidden = false;
    formSuccess.classList.add("is-visible");
    formSuccess.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const showError = message => {
    formStatus.textContent = message;
    formStatus.classList.add("is-error");
  };

  const clearStatus = () => {
    formStatus.textContent = "";
    formStatus.classList.remove("is-error");
  };

  const collectData = () => ({
    fullName: sanitize(contactForm.elements.fullName.value),
    email: sanitize(contactForm.elements.email.value),
    phone: sanitize(contactForm.elements.phone.value) || "Not provided",
    company: sanitize(contactForm.elements.company.value),
    subject: sanitize(contactForm.elements.subject.value),
    message: sanitize(contactForm.elements.message.value),
    timestamp: new Date().toISOString()
  });

  const buildEmailBody = data => {
    return [
      "New contact form submission — Docuro AI",
      "",
      `Name:      ${data.fullName}`,
      `Email:     ${data.email}`,
      `Phone:     ${data.phone}`,
      `Company:   ${data.company}`,
      `Subject:   ${data.subject}`,
      `Submitted: ${data.timestamp}`,
      "",
      "Message:",
      "--------",
      data.message,
      "",
      "—",
      `Sent from ${window.location.origin}${window.location.pathname}`
    ].join("\n");
  };

  const sendViaWeb3Forms = async data => {
    const payload = {
      access_key: WEB3FORMS_ACCESS_KEY,
      subject: `[Docuro AI] ${data.subject} — ${data.fullName}`,
      from_name: `${data.fullName} (Docuro AI Contact Form)`,
      replyto: data.email,
      name: data.fullName,
      email: data.email,
      phone: data.phone,
      company: data.company,
      inquiry_subject: data.subject,
      message: data.message,
      submitted_at: data.timestamp,
      page_url: window.location.href,
      botcheck: contactForm.elements.botcheck ? contactForm.elements.botcheck.value : ""
    };

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload)
    });

    let result = {};
    try { result = await response.json(); } catch (_) { /* ignore */ }

    if (!response.ok || !result.success) {
      throw new Error(result.message || `Request failed (${response.status}).`);
    }
  };

  const sendViaMailtoFallback = data => {
    const subject = encodeURIComponent(`[Docuro AI] ${data.subject} — ${data.fullName}`);
    const body = encodeURIComponent(buildEmailBody(data));
    const mailto = `mailto:${FALLBACK_EMAIL}?subject=${subject}&body=${body}`;
    // Use an anchor click so the current page never navigates — the OS mail
    // handler opens in a separate context and our success card stays visible.
    const a = document.createElement("a");
    a.href = mailto;
    a.rel = "noopener";
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  contactForm.addEventListener("input", event => {
    const field = event.target;
    if (!(field instanceof HTMLInputElement || field instanceof HTMLSelectElement || field instanceof HTMLTextAreaElement)) return;
    if (validators[field.name]) {
      const result = validators[field.name](field.value);
      setFieldError(field, result === true ? "" : result);
    }
    if (formStatus.classList.contains("is-error")) clearStatus();
  });

  contactForm.addEventListener("submit", async event => {
    event.preventDefault();
    if (isSubmitting) return;
    clearStatus();

    // Honeypot — silently drop bot submissions
    if (contactForm.elements.botcheck && contactForm.elements.botcheck.value) {
      showSuccess();
      return;
    }

    if (!validateForm()) {
      showError("Please fix the highlighted fields and try again.");
      return;
    }

    const data = collectData();
    setLoading(true);

    const keyConfigured =
      WEB3FORMS_ACCESS_KEY &&
      WEB3FORMS_ACCESS_KEY !== "YOUR_WEB3FORMS_ACCESS_KEY" &&
      WEB3FORMS_ACCESS_KEY.length >= 20;

    try {
      if (keyConfigured) {
        await sendViaWeb3Forms(data);
        showSuccess();
        contactForm.reset();
      } else {
        // Fallback: open the user's mail client pre-addressed to the support email
        sendViaMailtoFallback(data);
        showSuccess();
        contactForm.reset();
      }
    } catch (err) {
      console.error("Contact form submission failed:", err);
      showError(
        "We couldn't send your message right now. Please try again, or email " +
          FALLBACK_EMAIL +
          " directly."
      );
    } finally {
      setLoading(false);
    }
  });

  if (sendAnotherBtn && formSuccess) {
    sendAnotherBtn.addEventListener("click", () => {
      formSuccess.hidden = true;
      formSuccess.classList.remove("is-visible");
      contactForm.hidden = false;
      contactForm.scrollIntoView({ behavior: "smooth", block: "center" });
      const firstField = contactForm.querySelector("input, select, textarea");
      if (firstField) firstField.focus();
    });
  }
}
