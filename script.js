const hamburger = document.getElementById("hamburger");
const topNav = document.getElementById("topNav");
const topNavLinks = topNav ? topNav.querySelectorAll("a[href^='#']") : [];
const sideMenuLinks = document.querySelectorAll(".side-menu a[href^='#']");
const inPageLinks = document.querySelectorAll("a[href^='#']");
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
  const headerOffset = siteHeader ? siteHeader.offsetHeight + 12 : 0;
  const isContactAnchor = href === "#contact" || target.id === "contact";

  let targetY;

  if (isContactAnchor) {
    const sectionBottom = target.getBoundingClientRect().top + window.scrollY + target.offsetHeight;
    targetY = sectionBottom - window.innerHeight;
  } else {
    const contentStart = target.querySelector(".section-heading, .resume-showcase__heading, .content-wrap, .site-container");
    const anchorPoint = contentStart || target;
    targetY = anchorPoint.getBoundingClientRect().top + window.scrollY - headerOffset;
  }

  const maxScrollY = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

  window.scrollTo({
    top: Math.min(maxScrollY, Math.max(0, targetY)),
    behavior: "smooth"
  });

  closeMobileMenu();
};

inPageLinks.forEach((link) => {
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
  const typingDisabled = runningText.getAttribute("data-disable-typing") === "true";
  let hasTyped = false;

  if (typingDisabled) {
    runningText.textContent = phrase;
    runningText.classList.remove("is-typing");
  }

  const startTyping = () => {
    if (typingDisabled) {
      return;
    }

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
    }, 115);
  };

  const atHomeHash = window.location.hash === "" || window.location.hash === "#home";
  runningText.textContent = typingDisabled ? phrase : (atHomeHash ? "" : phrase);

  if (atHomeHash) {
    setTimeout(startTyping, 320);
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

    if (window.location.protocol === "file:") {
      if (contactFormStatus) {
        contactFormStatus.textContent = "Open this site through a web server (for example GitHub Pages or Live Server) before sending messages.";
        contactFormStatus.classList.remove("is-success");
        contactFormStatus.classList.add("is-error");
      }
      return;
    }

    const submitButton = contactForm.querySelector("button[type='submit']");
    const originalLabel = submitButton ? submitButton.textContent : "Submit";

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.setAttribute("aria-busy", "true");
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
        const apiMessage = typeof payload.message === "string" ? payload.message.trim() : "";
        throw new Error(apiMessage || "Submission failed");
      }

      contactForm.reset();

      if (contactFormStatus) {
        contactFormStatus.textContent = "Thanks! Your message has been sent successfully.";
        contactFormStatus.classList.add("is-success");
      }
    } catch (error) {
      if (contactFormStatus) {
        const errorMessage = error instanceof Error && error.message
          ? error.message
          : "Unable to send right now. Please try again in a moment.";
        contactFormStatus.textContent = errorMessage;
        contactFormStatus.classList.add("is-error");
      }
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.removeAttribute("aria-busy");
        submitButton.textContent = originalLabel || "Submit";
      }
    }
  });
}

