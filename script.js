// Interações: menu móvel, mostrar/ocultar dicas, FAQ e ano no rodapé
document.addEventListener('DOMContentLoaded', () => {
  // Ano no rodapé
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Menu móvel toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const mainNav = document.getElementById('main-nav');
  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!expanded));
      if (!expanded) {
        mainNav.style.display = 'flex';
        mainNav.style.flexDirection = 'column';
        mainNav.style.gap = '8px';
        // move foco para o primeiro link
        const firstLink = mainNav.querySelector('a');
        if (firstLink) firstLink.focus();
      } else {
        mainNav.style.display = '';
        mainNav.style.flexDirection = '';
        mainNav.style.gap = '';
      }
    });

    // fecha nav ao redimensionar para telas maiores
    window.addEventListener('resize', () => {
      if (window.innerWidth > 880) {
        mainNav.style.display = '';
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Smooth navigation: ensure internal links close mobile nav and focus target
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href.length > 1) {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({behavior: 'smooth', block: 'start'});
          // close mobile nav after navigation
          if (mainNav && window.innerWidth <= 880) {
            mainNav.style.display = '';
            menuToggle && menuToggle.setAttribute('aria-expanded', 'false');
          }
          // set focus for accessibility
          target.setAttribute('tabindex', '-1');
          target.focus({preventScroll: true});
          target.removeAttribute('tabindex');
        }
      }
    });
  });

  // Tip toggles (mostrar/ocultar dicas)
  const tipToggles = document.querySelectorAll('.tip-toggle');
  tipToggles.forEach(btn => {
    const targetId = btn.getAttribute('aria-controls');
    const content = document.getElementById(targetId);
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      if (content) {
        if (!expanded) {
          content.hidden = false;
          btn.textContent = 'Esconder';
          content.scrollIntoView({behavior: 'smooth', block: 'nearest'});
        } else {
          content.hidden = true;
          btn.textContent = 'Mostrar mais';
        }
      }
    });
  });

  // FAQ toggles
  const faqButtons = document.querySelectorAll('.faq-question');
  faqButtons.forEach(btn => {
    const answer = btn.nextElementSibling;
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      if (answer) {
        answer.hidden = expanded; // toggle: if expanded true -> hide; else show
        if (!expanded) answer.scrollIntoView({behavior: 'smooth', block: 'nearest'});
      }
    });
  });

  // close mobile nav when clicking outside for better UX
  document.addEventListener('click', (event) => {
    if (!mainNav || !menuToggle) return;
    const target = event.target;
    const insideNav = mainNav.contains(target) || menuToggle.contains(target);
    if (!insideNav && window.innerWidth <= 880) {
      mainNav.style.display = '';
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  });

  // keyboard: close nav or collapse open panels with Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (mainNav && window.innerWidth <= 880) {
        mainNav.style.display = '';
        menuToggle && menuToggle.setAttribute('aria-expanded', 'false');
      }
      // collapse all tips and FAQs
      document.querySelectorAll('.tip-toggle[aria-expanded="true"]').forEach(btn => btn.click());
      document.querySelectorAll('.faq-question[aria-expanded="true"]').forEach(btn => btn.click());
    }
  });
});