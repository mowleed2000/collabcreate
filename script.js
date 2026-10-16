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

// Shared form helpers — Web3Forms with validation + feedback
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

document.querySelectorAll('form[data-ccm-form]').forEach((form) => {
  const statusEl = form.querySelector('.form-status');
  const submitBtn = form.querySelector('[type="submit"]');

  form.querySelectorAll('input, select, textarea').forEach((field) => {
    field.addEventListener('input', () => clearFieldError(field));
    field.addEventListener('change', () => clearFieldError(field));
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
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
          if (group && !group.querySelector('.field-error.show')) {
            let err = group.parentElement.querySelector('.checkbox-error');
            if (!err) {
              err = document.createElement('div');
              err.className = 'field-error checkbox-error show';
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
      if (statusEl) {
        statusEl.className = 'form-status error';
        statusEl.textContent = 'Please correct the highlighted fields and try again.';
      }
      const firstError = form.querySelector('.error');
      if (firstError) firstError.focus();
      return;
    }

    const originalLabel = submitBtn ? submitBtn.textContent : '';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Submitting…';
    }

    try {
      const formData = new FormData(form);
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();

      if (response.ok && result.success) {
        const redirect = form.getAttribute('data-redirect');
        if (redirect) {
          window.location.href = redirect;
          return;
        }
        if (statusEl) {
          statusEl.className = 'form-status success';
          statusEl.textContent = form.getAttribute('data-success-message') || 'Thank you — your submission has been received.';
        }
        form.reset();
      } else {
        throw new Error(result.message || 'Submission failed');
      }
    } catch (err) {
      if (statusEl) {
        statusEl.className = 'form-status error';
        statusEl.textContent = 'Something went wrong. Please try again or email Collabcreatemarketing@gmail.com.';
      }
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalLabel;
      }
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
