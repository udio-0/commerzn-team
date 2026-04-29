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

// ---- VCF parsing & contact preview modal ---------------------

function parseVCF(text) {
  const fields = {};
  text.split(/\r?\n/).forEach(line => {
    if (!line || line === 'BEGIN:VCARD' || line === 'END:VCARD') return;
    const idx = line.indexOf(':');
    if (idx === -1) return;
    const key = line.substring(0, idx).split(';')[0].toUpperCase();
    const val = line.substring(idx + 1).trim();
    if (key === 'FN')    fields.name  = val;
    if (key === 'TEL')   fields.phone = val;
    if (key === 'EMAIL') fields.email = val;
    if (key === 'ORG')   fields.org   = val;
    if (key === 'TITLE') fields.title = val;
    if (key === 'ADR')   fields.address = val.replace(/;/g, ' ').replace(/\\\,/g, ',').trim();
    if (key === 'URL')   fields.url   = val;
  });
  return fields;
}

function formatPhone(raw) {
  // Display-friendly: +351912345678 -> +351 912 345 678
  const m = raw.match(/^\+(\d{1,3})(\d+)$/);
  if (!m) return raw;
  const code = m[1];
  const num  = m[2].replace(/(\d{3})(?=\d)/g, '$1 ');
  return `+${code} ${num}`;
}

function showContactModal(vcfContent, member) {
  const fields   = parseVCF(vcfContent);
  const filename = `${member.id}.vcf`;

  // Build modal row helpers
  const row = (icon, label, value) => {
    if (!value) return '';
    return `
      <div class="modal-field">
        <span class="modal-field__icon">${icon}</span>
        <div class="modal-field__body">
          <span class="modal-field__label">${escapeHTML(label)}</span>
          <span class="modal-field__value">${escapeHTML(value)}</span>
        </div>
      </div>`;
  };

  const phoneIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`;
  const mailIcon  = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`;
  const orgIcon   = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg>`;
  const pinIcon   = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0z"/><circle cx="12" cy="10" r="3"/></svg>`;
  const globeIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`;

  const overlay = document.createElement('div');
  overlay.className = 'contact-modal-overlay';
  overlay.innerHTML = `
    <div class="contact-modal" role="dialog" aria-labelledby="modal-title">
      <div class="contact-modal__header">
        <h2 id="modal-title" class="contact-modal__name">${escapeHTML(fields.name || member.name)}</h2>
        ${fields.title ? `<p class="contact-modal__role">${escapeHTML(fields.title)}</p>` : ''}
      </div>
      <div class="contact-modal__fields">
        ${row(phoneIcon, 'Phone',   fields.phone ? formatPhone(fields.phone) : '')}
        ${row(mailIcon,  'Email',   fields.email)}
        ${row(orgIcon,   'Company', fields.org)}
        ${row(pinIcon,   'Address', fields.address)}
        ${row(globeIcon, 'Website', fields.url)}
      </div>
      <div class="contact-modal__actions">
        <button type="button" class="contact-modal__btn contact-modal__btn--save">Save to Contacts</button>
        <button type="button" class="contact-modal__btn contact-modal__btn--cancel">Cancel</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  // Animate in
  requestAnimationFrame(() => overlay.classList.add('is-visible'));

  function close() {
    overlay.classList.remove('is-visible');
    overlay.addEventListener('transitionend', () => overlay.remove(), { once: true });
  }

  // Cancel
  overlay.querySelector('.contact-modal__btn--cancel').addEventListener('click', close);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });

  // Save
  overlay.querySelector('.contact-modal__btn--save').addEventListener('click', () => {
    close();
    downloadVCF(vcfContent, filename);
  });
}

function downloadVCF(content, filename) {
  const isAndroid = /android/i.test(navigator.userAgent);

  if (isAndroid) {
    const blob = new Blob([content], { type: 'text/x-vcard' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 10000);
    return;
  }

  if (navigator.share) {
    const mimeTypes = ['text/vcard', 'text/x-vcard', 'text/plain'];
    for (const mime of mimeTypes) {
      const f = new File([content], filename, { type: mime });
      if (!navigator.canShare || navigator.canShare({ files: [f] })) {
        navigator.share({ files: [f] }).catch(() => {});
        return;
      }
    }
  }

  const url = URL.createObjectURL(new Blob([content], { type: 'text/vcard' }));
  const a   = document.createElement('a');
  a.href     = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

async function addContact(member) {
  const vcfUrl = `../data/vcf/${member.id}.vcf`;

  const res = await fetch(vcfUrl);
  if (!res.ok) throw new Error(`Could not load contact file (${res.status})`);
  const content = await res.text();

  showContactModal(content, member);
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

function resolvePhoto(photo) {
  if (/^(https?:|data:|\/)/.test(photo)) return photo;
  return `../${photo}`;
}

function renderMember(member, company) {
  document.title = `${member.name} — ${company.name}`;

  const profileHTML = `
    <div class="member-avatar">
      <div class="member-avatar__inner">
        <img
          class="member-avatar__img"
          src="${escapeHTML(resolvePhoto(member.photo))}"
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
    .addEventListener('click', () => addContact(member));
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
