const filterButtons = Array.from(document.querySelectorAll("[data-filter]"));
const productCards = Array.from(document.querySelectorAll(".product-card"));
const revealNodes = Array.from(document.querySelectorAll("[data-reveal]"));
const partnerForm = document.querySelector("#partner-form");
const formNote = document.querySelector("#form-note");
const yearNode = document.querySelector("#year");
const bodyPage = document.body.dataset.page;
const navLinks = Array.from(document.querySelectorAll("[data-nav]"));

if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}

if (bodyPage) {
  navLinks.forEach((link) => {
    link.classList.toggle("is-active", link.dataset.nav === bodyPage);
  });
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

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -40px 0px",
    }
  );

  revealNodes.forEach((node) => revealObserver.observe(node));
} else {
  revealNodes.forEach((node) => node.classList.add("is-visible"));
}

if (partnerForm && formNote) {
  partnerForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(partnerForm);
    const name = String(formData.get("name") || "").trim();
    const business = String(formData.get("business") || "").trim();
    const city = String(formData.get("city") || "").trim();
    const message = String(formData.get("message") || "").trim();

    const subjectName = name || "Nuevo contacto";
    const lines = [
      "Hola Trabix,",
      "",
      `Mi nombre es: ${name || "No informado"}`,
      `Negocio o proyecto: ${business || "No informado"}`,
      `Ciudad: ${city || "No informada"}`,
      "",
      "Quiero ser parte del negocio y esta es mi idea:",
      message || "Sin mensaje adicional.",
    ];

    const mailtoLink =
      "mailto:trabixgranizados@gmail.com" +
      `?subject=${encodeURIComponent(`Quiero ser parte de Trabix - ${subjectName}`)}` +
      `&body=${encodeURIComponent(lines.join("\n"))}`;

    formNote.textContent = "Abriendo tu cliente de correo con el mensaje preparado.";
    window.location.href = mailtoLink;
  });
}
