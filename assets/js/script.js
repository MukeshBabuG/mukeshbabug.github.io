const toggle = document.getElementById("toggle");
const menu = document.getElementById("menu");
const menuLinks = document.querySelectorAll(".menu a");
const revealElements = document.querySelectorAll(".reveal-up");
const sections = document.querySelectorAll("section[id]");
const runningText = document.getElementById("running-text");

if (toggle && menu) {
  toggle.addEventListener("click", () => menu.classList.toggle("show"));

  menuLinks.forEach((link) => {
    link.addEventListener("click", () => {
      menu.classList.remove("show");
    });
  });

  document.addEventListener("click", (event) => {
    if (!menu.contains(event.target) && !toggle.contains(event.target)) {
      menu.classList.remove("show");
    }
  });
}

if (revealElements.length > 0) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealElements.forEach((el) => revealObserver.observe(el));
}

if (sections.length > 0 && menuLinks.length > 0) {
  const activateMenuLink = () => {
    const scrollY = window.scrollY + 140;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute("id");
      const matchingLink = document.querySelector(`.menu a[href="#${id}"]`);

      if (!matchingLink) {
        return;
      }

      if (scrollY >= top && scrollY < top + height) {
        matchingLink.classList.add("active");
      } else {
        matchingLink.classList.remove("active");
      }
    });
  };

  window.addEventListener("scroll", activateMenuLink);
  activateMenuLink();
}

if (runningText) {
  const phrase = runningText.getAttribute("data-text") || "Hi, I'm Mukesh Babu";
  let index = 0;
  runningText.textContent = "";

  const typeOnce = setInterval(() => {
    index += 1;
    runningText.textContent = phrase.slice(0, index);

    if (index >= phrase.length) {
      clearInterval(typeOnce);
    }
  }, 90);
}
