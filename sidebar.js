/**
 * sidebar.js — Sistem Anggaran
 * Cara pakai:
 * 1. Tambahkan <div id="sb-root"></div> sebelum .main
 * 2. Tambahkan <script src="sidebar.js"></script> sebelum </body>
 * 3. Beri atribut data-page="<nav-key>" pada <body>
 */

const SB_CONFIG = {
  brand: {
    initials : 'SA',
    name     : 'Sistem Anggaran',
    tagline  : 'Manajer Keuangan',
    href     : 'dashboard.html',
  },

  user: {
    initials   : 'MI',
    name       : 'Muhammad Iqbal',
    role       : 'Administrator',
    href       : 'profile.html',
    logoutHref : 'index.html',
  },

  groups: [
    {
      label: 'Utama',
      items: [
        { nav:'dashboard', href:'dashboard.html', icon:'fa-solid fa-house', label:'Dasbor' },
      ],
    },
    {
      label: 'Perencanaan',
      items: [
        {
          nav: 'perencanaan',
          icon: 'fa-solid fa-file-lines',
          label: 'Menu Perencanaan',
          children: [
            { nav:'rka',        href:'RKACost.html',   icon:'fa-solid fa-file-invoice-dollar', label:'RKA — Cost' },
            { nav:'rkaincome',  href:'RKAIncome.html', icon:'fa-solid fa-money-bill-trend-up', label:'RKA — Income' },
            { nav:'reportrkacost', href:'ReportRKACost.html', icon:'fa-solid fa-chart-column',        label:'Report RKA — Cost' },
          ],
        },
      ],
    },
    {
      label: 'Analitik',
      items: [
        { nav:'laporan', href:'laporan.html', icon:'fa-solid fa-chart-pie', label:'Laporan' },
      ],
    },
    {
      label: 'Master Data',
      items: [
        {
          nav: 'master',
          icon: 'fa-solid fa-folder-tree',
          label: 'Menu Master',
          children: [
            { nav:'mastercoa',      href:'MasterCOA.html',      icon:'fa-solid fa-sitemap',          label:'Master COA' },
            { nav:'masterupk',      href:'MasterUPK.html',      icon:'fa-solid fa-arrows-rotate',    label:'Master UPK' },
            { nav:'masterupt',      href:'MasterUPT.html',      icon:'fa-solid fa-building-columns', label:'Master UPT' },
            { nav:'masterapproval', href:'MasterApproval.html', icon:'fa-solid fa-code-branch',      label:'Master Approval' },
            { nav:'masterrisk',     href:'MasterRisk.html',     icon:'fa-solid fa-shield-halved',    label:'Master Risk' },
            { nav:'masteruser',     href:'MasterUser.html',     icon:'fa-solid fa-users-gear',       label:'Master User' },
          ],
        },
      ],
    },
    {
      label: 'Akun',
      items: [
        { nav:'profil',     href:'profile.html',    icon:'fa-solid fa-circle-user', label:'Profil' },
        { nav:'pengaturan', href:'pengaturan.html', icon:'fa-solid fa-gear',        label:'Pengaturan' },
      ],
    },
  ],
};

(function () {
  const cfg = SB_CONFIG;
  const activePage = document.body.dataset.page || '';
  const root = document.getElementById('sb-root');

  if (!root) {
    console.warn('[sidebar.js] Elemen #sb-root tidak ditemukan.');
    return;
  }

  function renderLeafItem(item) {
    const isActive = item.nav === activePage;
    const badge = item.badge
      ? `<span class="sb-badge">${item.badge}</span>`
      : '';

    return `
      <a href="${item.href}" class="sb-item${isActive ? ' active' : ''}" data-nav="${item.nav}">
        <span class="sb-item-icon"><i class="${item.icon}"></i></span>
        <span class="sb-item-label">${item.label}</span>
        ${badge}
      </a>
    `;
  }

  function renderParentItem(item) {
    const hasActiveChild =
      item.nav === activePage ||
      item.children.some(child => child.nav === activePage);

    const childrenHTML = item.children.map(child => {
      const childActive = child.nav === activePage;

      return `
        <a href="${child.href}" class="sb-subitem${childActive ? ' active' : ''}" data-nav="${child.nav}">
          <span class="sb-subitem-icon"><i class="${child.icon}"></i></span>
          <span class="sb-item-label">${child.label}</span>
        </a>
      `;
    }).join('');

    return `
      <div class="sb-parent${hasActiveChild ? ' open' : ''}">
        <button
          type="button"
          class="sb-item sb-parent-toggle${hasActiveChild ? ' active' : ''}"
          data-nav="${item.nav}"
          aria-expanded="${hasActiveChild ? 'true' : 'false'}"
        >
          <span class="sb-item-icon"><i class="${item.icon}"></i></span>
          <span class="sb-item-label">${item.label}</span>
          <span class="sb-caret"><i class="fa-solid fa-chevron-down"></i></span>
        </button>

        <div class="sb-submenu${hasActiveChild ? ' open' : ''}">
          <div class="sb-submenu-inner">
            ${childrenHTML}
          </div>
        </div>
      </div>
    `;
  }

  function renderItem(item) {
    const hasChildren = Array.isArray(item.children) && item.children.length > 0;
    return hasChildren ? renderParentItem(item) : renderLeafItem(item);
  }

  function renderSidebar() {
    const groupsHTML = cfg.groups.map((group, index) => {
      const itemsHTML = group.items.map(renderItem).join('');
      const dividerHTML = index < cfg.groups.length - 1
        ? `<div class="sb-divider"></div>`
        : '';

      return `
        <div class="sb-section">
          <span class="sb-section-label">${group.label}</span>
          ${itemsHTML}
        </div>
        ${dividerHTML}
      `;
    }).join('');

    return `
      <button class="sb-toggle" id="sbToggle" aria-label="Buka menu">
        <i class="fa-solid fa-bars"></i>
      </button>

      <div class="sb-overlay" id="sbOverlay"></div>

      <aside class="sb" id="sb">
        <a href="${cfg.brand.href}" class="sb-logo">
          <div class="sb-logo-mark">${cfg.brand.initials}</div>
          <div>
            <div class="sb-logo-text">${cfg.brand.name}</div>
            <div class="sb-logo-sub">${cfg.brand.tagline}</div>
          </div>
        </a>

        <div class="sb-body">
          ${groupsHTML}
        </div>

        <div class="sb-footer">
          <div class="sb-user-row">
            <a href="${cfg.user.href}" class="sb-user">
              <div class="sb-avatar">${cfg.user.initials}</div>
              <div class="sb-user-info">
                <div class="sb-user-name">${cfg.user.name}</div>
                <div class="sb-user-role">${cfg.user.role}</div>
              </div>
            </a>

            <button class="sb-logout" id="sbLogout" type="button" title="Keluar">
              <i class="fa-solid fa-right-from-bracket"></i>
            </button>
          </div>
        </div>
      </aside>
    `;
  }

  root.innerHTML = renderSidebar();

  const sb = document.getElementById('sb');
  const overlay = document.getElementById('sbOverlay');
  const toggle = document.getElementById('sbToggle');
  const logout = document.getElementById('sbLogout');

  if (!sb) return;

  function openSb() {
    sb.classList.add('is-open');
    overlay?.classList.add('show');
    document.body.style.overflow = 'hidden';
    if (toggle) toggle.innerHTML = '<i class="fa-solid fa-xmark"></i>';
  }

  function closeSb() {
    sb.classList.remove('is-open');
    overlay?.classList.remove('show');
    document.body.style.overflow = '';
    if (toggle) toggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
  }

  function toggleSb() {
    sb.classList.contains('is-open') ? closeSb() : openSb();
  }

  toggle?.addEventListener('click', toggleSb);
  overlay?.addEventListener('click', closeSb);

  logout?.addEventListener('click', () => {
    window.location.href = cfg.user.logoutHref;
  });

  sb.querySelectorAll('.sb-parent-toggle').forEach(toggleBtn => {
    toggleBtn.addEventListener('click', () => {
      const parent = toggleBtn.closest('.sb-parent');
      const submenu = parent?.querySelector('.sb-submenu');

      if (!parent || !submenu) return;

      const isOpen = parent.classList.contains('open');

      sb.querySelectorAll('.sb-parent').forEach(otherParent => {
        if (otherParent !== parent) {
          otherParent.classList.remove('open');

          const otherToggle = otherParent.querySelector('.sb-parent-toggle');
          const otherSubmenu = otherParent.querySelector('.sb-submenu');

          otherToggle?.setAttribute('aria-expanded', 'false');
          otherSubmenu?.classList.remove('open');
        }
      });

      parent.classList.toggle('open', !isOpen);
      submenu.classList.toggle('open', !isOpen);
      toggleBtn.setAttribute('aria-expanded', String(!isOpen));
    });
  });

  sb.querySelectorAll('.sb-item[href], .sb-subitem[href]').forEach(item => {
    item.addEventListener('click', () => {
      if (window.innerWidth <= 900) closeSb();
    });
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && sb.classList.contains('is-open')) {
      closeSb();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) {
      closeSb();
    }
  });
})();