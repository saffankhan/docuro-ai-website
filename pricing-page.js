const pricingToggleButtons = document.querySelectorAll(".pricing-toggle-option");
const pricingAmounts = document.querySelectorAll(".pricing-plan-price strong");

const applyPricingBilling = billing => {
  pricingToggleButtons.forEach(button => {
    button.classList.toggle("is-active", button.dataset.billing === billing);
  });

  pricingAmounts.forEach(amount => {
    amount.textContent = amount.dataset[billing];
    const suffix = amount.nextElementSibling;
    if (suffix) {
      suffix.textContent = billing === "monthly" ? "/month" : "/month billed yearly";
    }
  });
};

pricingToggleButtons.forEach(button => {
  button.addEventListener("click", () => applyPricingBilling(button.dataset.billing));
});

applyPricingBilling("monthly");
