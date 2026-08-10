const toggle = document.getElementById("toggle");
const menu = document.getElementById("menu");

if (toggle && menu) {
  toggle.addEventListener("click", () => {
    menu.classList.toggle("show");
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => menu.classList.remove("show"));
  });
}

const y = document.getElementById("year");
if (y) y.textContent = new Date().getFullYear();
