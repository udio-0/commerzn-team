/* ============================================================
   main.js — Nexus Studio team directory
   ============================================================ */

const DATA_URL = 'data/team.json';

// ---- Icon helpers (inline SVG) --------------------------------

const icons = {
  location: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="company-meta__icon">
    <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>`,
  globe: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="company-meta__icon">
    <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>`,
};

// ---- Navigate with fade transition ---------------------------

function navigateTo(url) {
  document.body.classList.add('is-navigating');
  setTimeout(() => { window.location.href = url; }, 220);
}

// ---- Render company header -----------------------------------

function renderHeader(company) {
  document.getElementById('company-tagline').textContent = company.tagline;
  document.getElementById('company-address').innerHTML   =
    `<a class="company-meta__link" href="https://maps.app.goo.gl/jr45B7meg1LMcwos8" target="_blank" rel="noopener noreferrer">${icons.location}${escapeHTML(company.address)}</a>`;
  document.getElementById('company-website-row').innerHTML =
    `<a class="company-meta__link" href="${escapeHTML(company.website)}" target="_blank" rel="noopener noreferrer">${icons.globe}${escapeHTML(company.websiteLabel)}</a>`;
  document.title        = company.name + ' — Team';
}

// ---- Render team grid ----------------------------------------

function renderTeam(members) {
  const grid = document.getElementById('team-grid');
  grid.innerHTML = '';

  // CEO first, then rest
  const sorted = [
    ...members.filter(m => m.ceo),
    ...members.filter(m => !m.ceo),
  ];

  sorted.forEach((member, i) => {
    const card = document.createElement('a');
    card.className  = 'member-card' + (member.ceo ? ' member-card--ceo' : '');
    card.href       = `team/?id=${encodeURIComponent(member.id)}`;
    card.setAttribute('aria-label', `${member.name}, ${member.role}`);

    // staggered animation
    card.style.animation = `cardIn 0.4s ease ${i * 55}ms both`;

    card.innerHTML = `
      <div class="member-card__photo-wrap">
        <img
          class="member-card__photo"
          src="${escapeHTML(member.photo)}"
          alt="${escapeHTML(member.name)}"
          loading="${i < 2 ? 'eager' : 'lazy'}"
          width="400"
          height="400"
        >
      </div>
      <div class="member-card__info">
        <div>
          <p class="member-card__name">${escapeHTML(member.name)}</p>
          <p class="member-card__role">${escapeHTML(member.role)}</p>
        </div>
        ${member.ceo ? '<span class="ceo-badge">CEO</span>' : ''}
      </div>
    `;

    grid.appendChild(card);
  });
}

// ---- Render projects as Swiper slides ---------------------------

function renderProjects(projects) {
  const wrapper = document.getElementById('projects-slides');
  wrapper.innerHTML = '';

  projects.forEach(p => {
    const slide = document.createElement('div');
    slide.className = 'swiper-slide';
    if (p.link) slide.dataset.link = p.link;
    slide.dataset.desc = p.description;

    slide.innerHTML = `
      <div class="project-slide__image-wrap">
        <img src="${escapeHTML(p.image)}" alt="${escapeHTML(p.name)}" loading="lazy">
        <div class="project-slide__overlay">
          <p class="project-slide__name">${escapeHTML(p.name)}</p>
          <p class="project-slide__year">${escapeHTML(String(p.year))}</p>
        </div>
      </div>
    `;
    wrapper.appendChild(slide);
  });
}

function updateProjectDescription(swiper) {
  const descEl = document.getElementById('project-description');
  const activeSlide = swiper.slides[swiper.activeIndex];
  const newText = activeSlide ? activeSlide.dataset.desc : '';

  descEl.style.opacity = '0';
  descEl.style.transform = 'translateY(6px)';
  setTimeout(() => {
    descEl.textContent = newText;
    descEl.style.opacity = '1';
    descEl.style.transform = 'translateY(0)';
  }, 300);
}

function initProjectsSwiper() {
  const swiperEl = document.getElementById('projects-swiper');

  const swiper = new Swiper(swiperEl, {
    effect: 'coverflow',
    coverflowEffect: {
      rotate: 0,
      stretch: 80,
      depth: 200,
      modifier: 1,
      slideShadows: false,
    },
    speed: 700,
    cssEase: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
    longSwipesMs: 200,
    longSwipesRatio: 0.3,
    slidesPerView: 1.4,
    centeredSlides: true,
    initialSlide: Math.floor(swiperEl.querySelectorAll('.swiper-slide').length / 2),
    grabCursor: true,
    observer: true,
    observeParents: true,
    breakpoints: {
      480: { slidesPerView: 2, coverflowEffect: { stretch: 60, depth: 180 } },
      768: { slidesPerView: 3, coverflowEffect: { stretch: 80, depth: 200 } },
    },
    on: {
      click: function () {
        const activeSlide = swiperEl.querySelector('.swiper-slide-active');
        const link = activeSlide && activeSlide.dataset.link;
        if (link) window.open(link, '_blank', 'noopener,noreferrer');
      },
      slideChange: function () {
        updateProjectDescription(this);
      },
    },
  });

  // Set a fixed height for the description based on the longest text
  const descEl = document.getElementById('project-description');
  const slides = Array.from(swiperEl.querySelectorAll('.swiper-slide'));
  let maxHeight = 0;
  slides.forEach(s => {
    descEl.textContent = s.dataset.desc || '';
    maxHeight = Math.max(maxHeight, descEl.scrollHeight);
  });
  descEl.style.minHeight = `${maxHeight}px`;

  updateProjectDescription(swiper);

  const calculateHeight = () => {
    const wraps = Array.from(swiperEl.querySelectorAll('.project-slide__image-wrap'));
    if (!wraps.length) return;
    const width = wraps[0].getBoundingClientRect().width;
    const height = Math.round(width * (4 / 3));
    wraps.forEach(el => el.style.height = `${height}px`);
    swiper.update();
  };

  calculateHeight();
  window.addEventListener('resize', calculateHeight);
}

// ---- Utility -------------------------------------------------

function escapeHTML(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function showError(message) {
  document.getElementById('main-content').innerHTML = `
    <div class="state-error">
      <p class="state-error__title">Something went wrong</p>
      <p class="state-error__msg">${escapeHTML(message)}</p>
    </div>
  `;
}

// ---- Boot ----------------------------------------------------

async function init() {
  try {
    const res  = await fetch(DATA_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    renderHeader(data.company);
    renderTeam(data.members.filter(m => m.ceo));
    renderProjects(data.projects);

    document.getElementById('footer-company').textContent =
      `© ${new Date().getFullYear()} ${data.company.name}. All rights reserved.`;

    // Remove spinner, show content, then init Swiper (needs visible DOM)
    document.getElementById('loading').remove();
    document.getElementById('main-content').hidden = false;
    initProjectsSwiper();

  } catch (err) {
    document.getElementById('loading').remove();
    document.getElementById('main-content').hidden = false;
    showError('Could not load team data. ' + err.message);
  }
}

init();
