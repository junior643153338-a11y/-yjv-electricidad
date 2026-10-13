'use strict';

// Datos de contacto: cambia estos valores por los del negocio.
// WHATSAPP_NUMBER: prefijo de país + número, solo dígitos (ej. 34600111222 o 595981111222).
const CONFIG = Object.freeze({
  WHATSAPP_NUMBER: '000000000000',
  WHATSAPP_MESSAGE: 'Hola, quiero pedir presupuesto para un mueble/mesa metálica a medida.',
  PHONE: '+000000000000',
  PHONE_LABEL: '+00 000 000 000',
  EMAIL: 'contacto@tu-dominio.com'
});

function whatsappUrl() {
  const number = String(CONFIG.WHATSAPP_NUMBER).replace(/\D/g, '');
  return 'https://wa.me/' + number + '?text=' + encodeURIComponent(CONFIG.WHATSAPP_MESSAGE);
}

function setupContactLinks() {
  const waUrl = whatsappUrl();
  document.querySelectorAll('[data-whatsapp]').forEach(function (link) {
    link.href = waUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  });

  const phone = String(CONFIG.PHONE).replace(/[^\d+]/g, '');
  document.querySelectorAll('[data-phone]').forEach(function (link) {
    link.href = 'tel:' + phone;
  });
  document.querySelectorAll('[data-phone-label]').forEach(function (el) {
    el.textContent = CONFIG.PHONE_LABEL;
  });

  document.querySelectorAll('[data-email]').forEach(function (link) {
    link.href = 'mailto:' + encodeURIComponent(CONFIG.EMAIL).replace('%40', '@');
  });
  document.querySelectorAll('[data-email-label]').forEach(function (el) {
    el.textContent = CONFIG.EMAIL;
  });
}

function setupMobileMenu() {
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.getElementById('menu');
  if (!toggle || !menu) return;

  function setOpen(open) {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    menu.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
  }

  toggle.addEventListener('click', function () {
    setOpen(toggle.getAttribute('aria-expanded') !== 'true');
  });
  menu.addEventListener('click', function (event) {
    if (event.target.closest('a')) setOpen(false);
  });
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') setOpen(false);
  });
  window.matchMedia('(min-width: 860px)').addEventListener('change', function (mq) {
    if (mq.matches) setOpen(false);
  });
}

function setupSmoothScroll() {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const header = document.querySelector('.topbar');

  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (event) {
      const id = link.getAttribute('href').slice(1);
      const target = id ? document.getElementById(id) : null;
      if (!target) return;
      event.preventDefault();
      const offset = header ? header.offsetHeight : 0;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: Math.max(top, 0), behavior: reduceMotion.matches ? 'auto' : 'smooth' });
      history.replaceState(null, '', '#' + id);
    });
  });
}

document.addEventListener('DOMContentLoaded', function () {
  setupContactLinks();
  setupMobileMenu();
  setupSmoothScroll();
  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
});
