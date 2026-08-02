/* ============================================================
   Aalokit Harry — Portfolio interactions
   Vanilla JS, no dependencies.
   ============================================================ */
(() => {
  "use strict";

  /* ---------- Preloader ---------- */
  const preloader = document.getElementById("preloader");
  const preloaderFill = document.getElementById("preloaderFill");
  let pct = 0;
  const fillTimer = setInterval(() => {
    pct += Math.random() * 18;
    if (pct >= 100) pct = 100;
    preloaderFill.style.width = pct + "%";
    if (pct === 100) clearInterval(fillTimer);
  }, 120);

  window.addEventListener("load", () => {
    setTimeout(() => {
      preloaderFill.style.width = "100%";
      setTimeout(() => {
        preloader.classList.add("is-hidden");
        document.getElementById("hero").classList.add("is-ready");
      }, 250);
    }, 300);
  });

  // Fallback in case 'load' is slow/blocked
  setTimeout(() => {
    preloader.classList.add("is-hidden");
    document.getElementById("hero").classList.add("is-ready");
  }, 2600);

  /* ---------- Footer year ---------- */
  document.getElementById("year").textContent = new Date().getFullYear();

  /* ---------- Custom cursor ---------- */
  const dot = document.getElementById("cursorDot");
  const ring = document.getElementById("cursorRing");
  const isTouch = window.matchMedia("(hover: none), (pointer: coarse)").matches;

  if (!isTouch) {
    let mx = 0, my = 0, rx = 0, ry = 0;
    window.addEventListener("mousemove", (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx + "px";
      dot.style.top = my + "px";
    });
    const animateRing = () => {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      ring.style.left = rx + "px";
      ring.style.top = ry + "px";
      requestAnimationFrame(animateRing);
    };
    animateRing();

    document.querySelectorAll("[data-cursor]").forEach((el) => {
      el.addEventListener("mouseenter", () => {
        dot.classList.add("cursor--hover");
        ring.classList.add("cursor--hover");
      });
      el.addEventListener("mouseleave", () => {
        dot.classList.remove("cursor--hover");
        ring.classList.remove("cursor--hover");
      });
    });
  } else {
    dot.style.display = "none";
    ring.style.display = "none";
  }

  /* ---------- Theme toggle ---------- */
  const root = document.documentElement;
  const themeToggle = document.getElementById("themeToggle");
  const savedTheme = localStorage.getItem("ah-theme");
  if (savedTheme) root.setAttribute("data-theme", savedTheme);

  themeToggle.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    localStorage.setItem("ah-theme", next);
  });

  /* ---------- Header scroll behaviour ---------- */
  const header = document.getElementById("siteHeader");
  let lastY = window.scrollY;

  window.addEventListener("scroll", () => {
    const y = window.scrollY;
    header.classList.toggle("is-scrolled", y > 40);
    if (y > lastY && y > 160) header.classList.add("is-hidden");
    else header.classList.remove("is-hidden");
    lastY = y;

    const toTop = document.getElementById("toTopBtn");
    toTop.style.opacity = y > 600 ? "1" : "0";
    toTop.style.pointerEvents = y > 600 ? "auto" : "none";
  }, { passive: true });

  /* ---------- Mobile menu ---------- */
  const burger = document.getElementById("burgerBtn");
  const mobileMenu = document.getElementById("mobileMenu");
  burger.addEventListener("click", () => {
    const open = mobileMenu.classList.toggle("is-open");
    burger.setAttribute("aria-expanded", open ? "true" : "false");
    document.body.classList.toggle("modal-open", open);
  });
  mobileMenu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => {
    mobileMenu.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
    document.body.classList.remove("modal-open");
  }));

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll(".reveal-up");
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
  revealEls.forEach((el) => revealObserver.observe(el));

  /* ---------- Stats count-up ---------- */
  const statNums = document.querySelectorAll(".stat__num");
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10) || 0;
      const duration = 1400;
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(eased * target);
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      statObserver.unobserve(el);
    });
  }, { threshold: 0.5 });
  statNums.forEach((el) => statObserver.observe(el));

  /* ---------- Magnetic buttons ---------- */
  document.querySelectorAll(".magnetic").forEach((btn) => {
    if (isTouch) return;
    btn.addEventListener("mousemove", (e) => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      btn.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
    });
    btn.addEventListener("mouseleave", () => { btn.style.transform = "translate(0,0)"; });
  });

  /* ---------- Work filter ---------- */
  const filterBtns = document.querySelectorAll(".filter-btn");
  const workCards = document.querySelectorAll(".work-card");
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      const filter = btn.dataset.filter;
      workCards.forEach((card) => {
        const match = filter === "all" || card.dataset.cat === filter;
        card.classList.toggle("is-hidden", !match);
      });
    });
  });

  /* ---------- Lightbox modal ---------- */
  const modal = document.getElementById("workModal");
  const modalMedia = document.getElementById("modalMedia");
  const modalTitle = document.getElementById("modalTitle");
  const modalDesc = document.getElementById("modalDesc");
  const modalTag = document.getElementById("modalTag");

  const gradClasses = ["grad-1", "grad-2", "grad-3", "grad-4", "grad-5", "grad-6"];

  function openModal(card) {
    modalTitle.textContent = card.dataset.title || "";
    modalDesc.textContent = card.dataset.desc || "";
    modalTag.textContent = card.dataset.tag || "";
    modalMedia.innerHTML = "";
    modalMedia.style.backgroundImage = "";
    const mediaEl = card.querySelector(".work-card__media");
    const youtubeId = card.dataset.youtube;
    const img = mediaEl.querySelector("img");
    if (youtubeId) {
      modalMedia.className = "modal__media modal__media--video";
      const iframe = document.createElement("iframe");
      iframe.src = `https://www.youtube.com/embed/${youtubeId}?rel=0`;
      iframe.title = card.dataset.title || "Video";
      iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
      iframe.allowFullscreen = true;
      iframe.frameBorder = "0";
      modalMedia.appendChild(iframe);
    } else if (img) {
      modalMedia.className = "modal__media";
      modalMedia.style.backgroundImage = `url("${img.src}")`;
      modalMedia.style.backgroundSize = "cover";
      modalMedia.style.backgroundPosition = "center";
    } else {
      const gradClass = gradClasses.find((g) => mediaEl.classList.contains(g)) || "grad-1";
      modalMedia.className = "modal__media " + gradClass;
    }
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
  }
  function closeModal() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    modalMedia.innerHTML = "";
  }
  workCards.forEach((card) => card.addEventListener("click", () => openModal(card)));
  document.getElementById("modalClose").addEventListener("click", closeModal);
  document.getElementById("modalBackdrop").addEventListener("click", closeModal);
  window.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });

  /* ---------- Testimonial carousel ---------- */
  const track = document.getElementById("testiTrack");
  const dotsWrap = document.getElementById("testiDots");
  const slides = track.querySelectorAll(".testi__slide");
  let activeSlide = 0;
  let testiTimer;

  slides.forEach((_, i) => {
    const d = document.createElement("button");
    if (i === 0) d.classList.add("is-active");
    d.addEventListener("click", () => goToSlide(i));
    dotsWrap.appendChild(d);
  });
  const dots = dotsWrap.querySelectorAll("button");

  function goToSlide(i) {
    activeSlide = i;
    track.style.transform = `translateX(-${i * 100}%)`;
    dots.forEach((d, di) => d.classList.toggle("is-active", di === i));
    resetTestiTimer();
  }
  function resetTestiTimer() {
    clearInterval(testiTimer);
    testiTimer = setInterval(() => goToSlide((activeSlide + 1) % slides.length), 5500);
  }
  resetTestiTimer();

  /* ---------- Copy email ---------- */
  const copyBtn = document.getElementById("copyEmailBtn");
  const copyToast = document.getElementById("copyToast");
  copyBtn.addEventListener("click", async () => {
    const email = document.getElementById("emailText").textContent.trim();
    try {
      await navigator.clipboard.writeText(email);
    } catch (err) {
      // Clipboard API unavailable — fall back to opening mail client
      window.location.href = "mailto:" + email;
    }
    copyToast.classList.add("is-shown");
    setTimeout(() => copyToast.classList.remove("is-shown"), 2000);
  });

  /* ---------- Back to top ---------- */
  document.getElementById("toTopBtn").addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ---------- Smooth anchor scroll (accounts for fixed header) ---------- */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const offset = 84;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    });
  });
})();
