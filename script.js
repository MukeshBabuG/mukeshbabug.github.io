const hamburger = document.getElementById("hamburger");
const topNav = document.getElementById("topNav");
const topNavLinks = topNav ? topNav.querySelectorAll("a[href^='#']") : [];
const sideMenuLinks = document.querySelectorAll(".side-menu a[href^='#']");
const allNavLinks = [...topNavLinks, ...sideMenuLinks];
const sections = document.querySelectorAll("section[id]");
const runningText = document.getElementById("running-text");
const siteHeader = document.querySelector(".site-header") || document.querySelector(".hero-header");
const contactForm = document.getElementById("contact-form");
const contactFormStatus = document.getElementById("contact-form-status");

if (hamburger && topNav) {
  hamburger.addEventListener("click", () => {
    const isOpen = topNav.classList.toggle("show");
    hamburger.setAttribute("aria-expanded", String(isOpen));
  });

  document.addEventListener("click", (event) => {
    if (!topNav.contains(event.target) && !hamburger.contains(event.target)) {
      topNav.classList.remove("show");
      hamburger.setAttribute("aria-expanded", "false");
    }
  });
}

const closeMobileMenu = () => {
  if (topNav) {
    topNav.classList.remove("show");
  }
  if (hamburger) {
    hamburger.setAttribute("aria-expanded", "false");
  }
};

const handleAnchorClick = (event) => {
  const href = event.currentTarget.getAttribute("href");
  if (!href || !href.startsWith("#")) {
    return;
  }

  const target = document.querySelector(href);
  if (!target) {
    return;
  }

  event.preventDefault();
  target.scrollIntoView({ behavior: "smooth", block: "start" });
  closeMobileMenu();
};

topNavLinks.forEach((link) => {
  link.addEventListener("click", handleAnchorClick);
});

sideMenuLinks.forEach((link) => {
  link.addEventListener("click", handleAnchorClick);
});

if (sections.length > 0) {
  const syncActiveMenu = () => {
    const cursor = window.scrollY + window.innerHeight * 0.25;

    if (siteHeader) {
      siteHeader.classList.toggle("is-scrolled", window.scrollY > 12);
    }

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionBottom = sectionTop + section.offsetHeight;
      const id = section.getAttribute("id");
      const matchingLinks = allNavLinks.filter((link) => link.getAttribute("href") === `#${id}`);

      if (cursor >= sectionTop && cursor < sectionBottom) {
        allNavLinks.forEach((link) => link.classList.remove("active"));
        matchingLinks.forEach((link) => link.classList.add("active"));
      }
    });
  };

  window.addEventListener("scroll", syncActiveMenu);
  syncActiveMenu();
}

window.addEventListener("resize", () => {
  if (window.innerWidth > 767) {
    closeMobileMenu();
  }
});

if (runningText) {
  const phrase = runningText.getAttribute("data-text") || "Hi, I'm Mukesh Babu";
  let hasTyped = false;

  const startTyping = () => {
    if (hasTyped) {
      return;
    }
    hasTyped = true;

    let index = 0;
    runningText.textContent = "";
    runningText.classList.add("is-typing");

    const typeOnce = setInterval(() => {
      index += 1;
      runningText.textContent = phrase.slice(0, index);

      if (index >= phrase.length) {
        clearInterval(typeOnce);
        runningText.classList.remove("is-typing");
      }
    }, 75);
  };

  const atHomeHash = window.location.hash === "" || window.location.hash === "#home";
  runningText.textContent = atHomeHash ? "" : phrase;

  if (atHomeHash) {
    startTyping();
  } else {
    const homeSection = document.getElementById("home");
    if (homeSection) {
      const homeObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              startTyping();
              observer.disconnect();
            }
          });
        },
        { threshold: 0.45 }
      );

      homeObserver.observe(homeSection);
    }
  }
}

if (contactForm) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!contactForm.reportValidity()) {
      return;
    }

    const submitButton = contactForm.querySelector("button[type='submit']");
    const originalLabel = submitButton ? submitButton.textContent : "Submit";

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Sending...";
    }

    if (contactFormStatus) {
      contactFormStatus.textContent = "Sending your message...";
      contactFormStatus.classList.remove("is-success", "is-error");
    }

    try {
      const response = await fetch(contactForm.action, {
        method: "POST",
        body: new FormData(contactForm),
        headers: {
          Accept: "application/json"
        }
      });

      const payload = await response.json().catch(() => ({}));
      const submitted = response.ok && (payload.success === "true" || payload.success === true || !payload.success);

      if (!submitted) {
        throw new Error("Submission failed");
      }

      contactForm.reset();

      if (contactFormStatus) {
        contactFormStatus.textContent = "Thanks! Your message has been sent successfully.";
        contactFormStatus.classList.add("is-success");
      }
    } catch (error) {
      if (contactFormStatus) {
        contactFormStatus.textContent = "Unable to send right now. Please try again in a moment.";
        contactFormStatus.classList.add("is-error");
      }
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = originalLabel || "Submit";
      }
    }
  });
}

