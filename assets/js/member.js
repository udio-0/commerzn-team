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

// ---- VCF generation ------------------------------------------

function buildVCF(member, companyName) {
  const [first, ...rest] = member.name.trim().split(/\s+/);
  const last = rest.join(' ');

  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${member.name}`,
    `N:${last};${first};;;`,
    `TITLE:${member.role}`,
    `ORG:${companyName}`,
    `EMAIL;TYPE=WORK:${member.email}`,
  ];

  if (member.phone)     lines.push(`TEL;TYPE=WORK,VOICE:${member.phone}`);
  if (member.linkedin)  lines.push(`URL;TYPE=LinkedIn:${member.linkedin}`);
  if (member.instagram) lines.push(`URL;TYPE=Instagram:${member.instagram}`);

  lines.push('END:VCARD');
  return lines.join('\r\n');
}

async function addContact(member, companyName) {
  const content  = buildVCF(member, companyName);
  const filename = `${member.id}.vcf`;
  const isAndroid = /android/i.test(navigator.userAgent);

  // Android: open the VCF via an <a> click WITHOUT the download attribute.
  // This tells the browser to let the OS handle the MIME type, which triggers
  // Android's native "Create Contact" screen with all details pre-filled.
  if (isAndroid) {
    const blob = new Blob([content], { type: 'text/x-vcard' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    // No a.download — this is intentional so Android opens instead of saving
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 10000);
    return;
  }

  // iOS / macOS: Web Share API works well with vCard files
  if (navigator.share) {
    const mimeTypes = ['text/vcard', 'text/x-vcard', 'text/plain'];
    let shareFile = null;
    for (const mime of mimeTypes) {
      const f = new File([content], filename, { type: mime });
      if (!navigator.canShare || navigator.canShare({ files: [f] })) {
        shareFile = f;
        break;
      }
    }

    if (shareFile) {
      try {
        await navigator.share({ files: [shareFile] });
        return;
      } catch (e) {
        if (e.name === 'AbortError') return; // user cancelled
      }
    }
  }

  // Fallback: download (desktop)
  const url = URL.createObjectURL(new Blob([content], { type: 'text/vcard' }));
  const a   = document.createElement('a');
  a.href     = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
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
    .addEventListener('click', () => addContact(member, company.name));
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
