const filterButtons = Array.from(document.querySelectorAll("[data-filter]"));
const productCards = Array.from(document.querySelectorAll(".product-card"));
const yearNode = document.querySelector("#year");

if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");

    productCards.forEach((card) => {
      const matches = filter === "all" || card.dataset.kind === filter;
      card.classList.toggle("is-hidden", !matches);
    });
  });
});
