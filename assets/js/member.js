/* ============================================================
   member.js — Nexus Studio individual member card
   ============================================================ */

const DATA_URL = '../data/team.json';

// ---- Inline SVG icons ----------------------------------------

const ICONS = {
  person: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>`,
  mail: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>`,
  linkedin: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/>
  </svg>`,
  instagram: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>`,
  facebook: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>`,
  chevronRight: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="m9 18 6-6-6-6"/>
  </svg>`,
  chevronLeft: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="m15 18-6-6 6-6"/>
  </svg>`,
};

// ---- Contact preview modal --------------------------------------

function showContactModal(member, companyName) {
  // Remove existing modal if any
  const existing = document.getElementById('contact-modal');
  if (existing) existing.remove();

  const phone = ICONS.phone || `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`;

  // Build detail rows
  const rows = [];
  if (member.phone) {
    rows.push(`
      <a href="tel:${escapeHTML(member.phone)}" class="contact-modal__row">
        <span class="contact-modal__row-icon">${phone}</span>
        <span class="contact-modal__row-text">
          <span class="contact-modal__row-label">Phone</span>
          <span class="contact-modal__row-value">${escapeHTML(member.phone)}</span>
        </span>
      </a>
    `);
  }
  if (member.email) {
    rows.push(`
      <a href="mailto:${escapeHTML(member.email)}" class="contact-modal__row">
        <span class="contact-modal__row-icon">${ICONS.mail}</span>
        <span class="contact-modal__row-text">
          <span class="contact-modal__row-label">Email</span>
          <span class="contact-modal__row-value">${escapeHTML(member.email)}</span>
        </span>
      </a>
    `);
  }
  if (member.linkedin) {
    rows.push(`
      <div class="contact-modal__row">
        <span class="contact-modal__row-icon">${ICONS.linkedin}</span>
        <span class="contact-modal__row-text">
          <span class="contact-modal__row-label">LinkedIn</span>
          <span class="contact-modal__row-value">LinkedIn Profile</span>
        </span>
      </div>
    `);
  }

  const modal = document.createElement('div');
  modal.id = 'contact-modal';
  modal.className = 'contact-modal';
  modal.innerHTML = `
    <div class="contact-modal__backdrop"></div>
    <div class="contact-modal__sheet">
      <div class="contact-modal__handle"></div>
      <div class="contact-modal__header">
        <img
          class="contact-modal__photo"
          src="${escapeHTML(member.photo)}"
          alt="${escapeHTML(member.name)}"
          width="72"
          height="72"
        >
        <h2 class="contact-modal__name">${escapeHTML(member.name)}</h2>
        <p class="contact-modal__role">${escapeHTML(member.role)}</p>
        <p class="contact-modal__company">${escapeHTML(companyName)}</p>
      </div>
      <div class="contact-modal__details">
        ${rows.join('')}
      </div>
      <div class="contact-modal__actions">
        <button id="modal-save-contact" class="contact-modal__save" type="button">
          Save to Contacts
        </button>
        <button id="modal-cancel" class="contact-modal__cancel" type="button">
          Cancel
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Trigger animation on next frame
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      modal.classList.add('contact-modal--open');
    });
  });

  // Close handlers
  const close = () => {
    modal.classList.remove('contact-modal--open');
    modal.addEventListener('transitionend', () => modal.remove(), { once: true });
    // Fallback removal if transition doesn't fire
    setTimeout(() => { if (modal.parentNode) modal.remove(); }, 400);
  };

  modal.querySelector('.contact-modal__backdrop').addEventListener('click', close);
  document.getElementById('modal-cancel').addEventListener('click', close);

  // Save button — navigate to Cloudflare Worker which serves the VCF
  // with Content-Disposition: inline, so Android/iOS open Contacts app directly
  const WORKER_BASE = 'https://commerzn-vcard.claudioalexsantos.workers.dev';
  document.getElementById('modal-save-contact').addEventListener('click', () => {
    window.location.href = `${WORKER_BASE}/${member.id}.vcf`;
  });
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

function getMemberIdFromURL() {
  return new URLSearchParams(window.location.search).get('id');
}

function goBack() {
  // If there's a real history entry from within the site, go back.
  // Otherwise, navigate to index.
  if (history.length > 1 && document.referrer) {
    history.back();
  } else {
    window.location.href = '../';
  }
}

function navigateTo(url) {
  document.body.classList.add('is-navigating');
  setTimeout(() => { window.location.href = url; }, 220);
}

// ---- Render --------------------------------------------------

function renderMember(member, company) {
  document.title = `${member.name} — ${company.name}`;

  const profileHTML = `
    <div class="member-avatar">
      <div class="member-avatar__inner">
        <img
          class="member-avatar__img"
          src="${escapeHTML(member.photo)}"
          alt="${escapeHTML(member.name)}"
          width="400"
          height="400"
          loading="eager"
        >
      </div>
    </div>
    <h1 class="member-name">${escapeHTML(member.name)}</h1>
    <p class="member-role">${escapeHTML(member.role)}</p>
    <p class="member-company">${escapeHTML(company.name)}</p>
    <ul class="action-list" aria-label="Contact options">
      ${buildActionButtons(member)}
    </ul>
  `;

  document.getElementById('member-profile').innerHTML = profileHTML;

  document.getElementById('btn-add-contact')
    .addEventListener('click', () => showContactModal(member, company.name));
}

function buildActionButtons(member) {
  const buttons = [];

  // 1. Add Contact (primary)
  buttons.push(`
    <li>
      <button
        id="btn-add-contact"
        class="action-btn action-btn--primary"
        type="button"
        aria-label="Save ${escapeHTML(member.name)} to contacts"
      >
        <span class="action-btn__icon">${ICONS.person}</span>
        <span class="action-btn__body">
          <span class="action-btn__label">Add Contact</span>
          <span class="action-btn__sub">Save to your phone</span>
        </span>
        <span class="action-btn__chevron" aria-hidden="true">${ICONS.chevronRight}</span>
      </button>
    </li>
  `);

  // 2. LinkedIn
  if (member.linkedin) {
    buttons.push(actionLink({
      href: member.linkedin,
      icon: ICONS.linkedin,
      label: 'LinkedIn',
      sub: member.linkedin.replace('https://linkedin.com/in/', ''),
      external: true,
    }));
  }

  // 3. Email
  if (member.email) {
    buttons.push(actionLink({
      href: `mailto:${member.email}`,
      icon: ICONS.mail,
      label: 'Email',
      sub: member.email,
    }));
  }

  // 4. Instagram
  if (member.instagram) {
    buttons.push(actionLink({
      href: member.instagram,
      icon: ICONS.instagram,
      label: 'Instagram',
      sub: '@' + member.instagram.replace('https://instagram.com/', '').replace(/\/$/, ''),
      external: true,
    }));
  }

  // 5. Facebook
  if (member.facebook) {
    buttons.push(actionLink({
      href: member.facebook,
      icon: ICONS.facebook,
      label: 'Facebook',
      sub: member.facebook.replace('https://facebook.com/', '').replace(/\/$/, ''),
      external: true,
    }));
  }

  return buttons.join('');
}

function actionLink({ href, icon, label, sub, external = false }) {
  const attrs = external
    ? `target="_blank" rel="noopener noreferrer"`
    : '';
  return `
    <li>
      <a
        href="${escapeHTML(href)}"
        class="action-btn"
        ${attrs}
        aria-label="${escapeHTML(label)}: ${escapeHTML(sub)}"
      >
        <span class="action-btn__icon">${icon}</span>
        <span class="action-btn__body">
          <span class="action-btn__label">${escapeHTML(label)}</span>
          <span class="action-btn__sub">${escapeHTML(sub)}</span>
        </span>
        <span class="action-btn__chevron" aria-hidden="true">${ICONS.chevronRight}</span>
      </a>
    </li>
  `;
}

function showError(msg) {
  document.getElementById('loading').remove();
  document.getElementById('member-profile').innerHTML = `
    <div class="state-error">
      <p class="state-error__title">${escapeHTML(msg)}</p>
      <p class="state-error__msg">Double-check the URL and try again.</p>
      <a href="../" class="state-error__back">Back to Team</a>
    </div>
  `;
  document.getElementById('member-profile').hidden = false;
}

// ---- Boot ----------------------------------------------------

async function init() {
  // Wire up back button immediately
  const backBtn = document.getElementById('back-btn');
  if (backBtn) {
    backBtn.addEventListener('click', () => navigateTo('../'));
  }

  const id = getMemberIdFromURL();

  if (!id) {
    showError('No member specified.');
    return;
  }

  try {
    const res  = await fetch(DATA_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    const member = data.members.find(m => m.id === id);
    if (!member) {
      showError(`Member "${id}" not found.`);
      return;
    }

    document.getElementById('loading').remove();
    document.getElementById('member-profile').hidden = false;
    renderMember(member, data.company);

  } catch (err) {
    showError('Could not load data. ' + err.message);
  }
}

init();
