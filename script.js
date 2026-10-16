// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
  });

  // Nested dropdowns on mobile
  navLinks.querySelectorAll('.has-dropdown > a').forEach((link) => {
    link.addEventListener('click', (e) => {
      if (window.innerWidth <= 1024) {
        e.preventDefault();
        link.parentElement.classList.toggle('open');
      }
    });
  });
}

// Scroll Reveals
const reveals = document.querySelectorAll('.reveal');

function revealOnScroll() {
  const windowHeight = window.innerHeight;
  reveals.forEach((reveal) => {
    const revealTop = reveal.getBoundingClientRect().top;
    const revealPoint = 150;
    if (revealTop < windowHeight - revealPoint) {
      reveal.classList.add('active');
    }
  });
}

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);

// Navbar state on scroll
const navbar = document.querySelector('.navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

// Shared form helpers — validate client-side, then native POST to Web3Forms
// (native navigation avoids CORS issues that affect fetch() on some origins)
function setFieldError(input, message) {
  input.classList.add('error');
  const err = input.parentElement.querySelector('.field-error');
  if (err) {
    err.textContent = message;
    err.classList.add('show');
  }
}

function clearFieldError(input) {
  input.classList.remove('error');
  const err = input.parentElement.querySelector('.field-error');
  if (err) {
    err.textContent = '';
    err.classList.remove('show');
  }
}

function validateEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function validatePhone(value) {
  return /^[\d\s+\-()]{7,}$/.test(value.trim());
}

function ensureAbsoluteRedirect(form) {
  const relative = form.getAttribute('data-redirect');
  if (!relative) return;
  let redirectInput = form.querySelector('input[name="redirect"]');
  if (!redirectInput) {
    redirectInput = document.createElement('input');
    redirectInput.type = 'hidden';
    redirectInput.name = 'redirect';
    form.appendChild(redirectInput);
  }
  try {
    redirectInput.value = new URL(relative, window.location.href).href;
  } catch (e) {
    redirectInput.value = relative;
  }
}

document.querySelectorAll('form[data-ccm-form]').forEach((form) => {
  // Ensure Web3Forms action is set for native submit
  form.setAttribute('action', 'https://api.web3forms.com/submit');
  form.setAttribute('method', 'POST');

  const statusEl = form.querySelector('.form-status');
  const submitBtn = form.querySelector('[type="submit"]');

  form.querySelectorAll('input, select, textarea').forEach((field) => {
    field.addEventListener('input', () => clearFieldError(field));
    field.addEventListener('change', () => clearFieldError(field));
  });

  form.addEventListener('submit', (e) => {
    if (statusEl) {
      statusEl.className = 'form-status';
      statusEl.textContent = '';
    }

    let valid = true;
    const requiredFields = form.querySelectorAll('[required]');
    requiredFields.forEach((field) => {
      clearFieldError(field);
      if (field.type === 'checkbox') {
        if (!field.checked) {
          valid = false;
          field.classList.add('error');
          const group = field.closest('.checkbox-group');
          if (group) {
            let err = group.nextElementSibling;
            if (!err || !err.classList.contains('field-error')) {
              err = document.createElement('div');
              err.className = 'field-error checkbox-error';
              group.insertAdjacentElement('afterend', err);
            }
            err.textContent = 'This confirmation is required.';
            err.classList.add('show');
          }
        }
        return;
      }
      if (!String(field.value || '').trim()) {
        valid = false;
        setFieldError(field, 'This field is required.');
        return;
      }
      if (field.type === 'email' && !validateEmail(field.value.trim())) {
        valid = false;
        setFieldError(field, 'Enter a valid email address.');
      }
      if ((field.type === 'tel' || field.name === 'phone' || field.name === 'telephone') && !validatePhone(field.value)) {
        valid = false;
        setFieldError(field, 'Enter a valid telephone number.');
      }
    });

    if (!valid) {
      e.preventDefault();
      if (statusEl) {
        statusEl.className = 'form-status error';
        statusEl.textContent = 'Please correct the highlighted fields and try again.';
        statusEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      const firstError = form.querySelector('.error');
      if (firstError) firstError.focus({ preventScroll: true });
      return;
    }

    // Valid — prepare absolute redirect and allow native POST to Web3Forms
    ensureAbsoluteRedirect(form);
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Submitting…';
    }
  });
});

// Lightbox (homepage portfolio)
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
if (lightbox && lightboxImg) {
  document.querySelectorAll('.lightbox-trigger').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      lightboxImg.src = trigger.getAttribute('data-full');
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });
  lightbox.addEventListener('click', () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
  });
}
