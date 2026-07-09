document.addEventListener('DOMContentLoaded', () => {

  /* Footer year */
  document.getElementById('year').textContent = new Date().getFullYear();

  /* Navbar background on scroll */
  const nav = document.getElementById('mainNav');
  const toggleNavBg = () => {
    if (window.scrollY > 60) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  toggleNavBg();
  window.addEventListener('scroll', toggleNavBg);

  /* Collapse mobile menu after a link is clicked */
  const navMenu = document.getElementById('navMenu');
  navMenu.querySelectorAll('.nav-link, .btn-book').forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('show')) {
        bootstrap.Collapse.getOrCreateInstance(navMenu).hide();
      }
    });
  });

  /* Scroll-reveal animations */
  const animatedEls = document.querySelectorAll('[data-animate]');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  animatedEls.forEach(el => revealObserver.observe(el));

  /* Active nav link highlighting via scrollspy-like observer */
  const sections = document.querySelectorAll('section[id], header[id]');
  const navLinks = document.querySelectorAll('#navMenu .nav-link');
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach(section => sectionObserver.observe(section));

  /* Back to top button */
  const backToTop = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('show', window.scrollY > 500);
  });

  /* Newsletter form ("Join Our Circle") — client-side only */
  const circleForm = document.getElementById('circleForm');
  const circleEmail = document.getElementById('circleEmail');
  const circleFeedback = document.getElementById('circleFeedback');

  circleForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = circleEmail.value.trim();
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!isValid) {
      circleFeedback.textContent = 'Please enter a valid email address.';
      circleEmail.classList.add('is-invalid');
      return;
    }

    circleEmail.classList.remove('is-invalid');
    circleFeedback.textContent = `Welcome to the circle, ${email}! Check your inbox soon.`;
    circleForm.reset();
  });

});
