/**
 * sidebar.js — Sistem Anggaran
 *
 * TUJUAN:
 * - Tidak perlu ganti path sidebar satu-satu saat halaman dipindah ke folder
 * - sidebar.css otomatis dimuat oleh sidebar.js
 * - href menu otomatis dibentuk dari 1 base/root aplikasi
 * - active menu bisa baca dari URL pathname, bukan hanya data-page
 *
 * CARA PAKAI DI SEMUA HALAMAN:
 * 1) Tambahkan <div id="sb-root"></div> sebelum .main
 * 2) Tambahkan:
 *    <script src="/sidebar.js" defer></script>
 *
 * CATATAN:
 * - Jika project Anda tidak di web root, ubah appBase di bawah.
 *   Contoh kalau project ada di /sistem-anggaran/, maka:
 *   appBase: '/sistem-anggaran/'
 */

const SB_CONFIG = {
  // UBAH SEKALI SAJA DI SINI
  appBase: '/',

  assets: {
    css: 'sidebar.css',
  },

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
            {
              nav: 'perencanaan-cost',
              icon: 'fa-solid fa-coins',
              label: 'Cost',
              children: [
                { nav:'anggarancost',  href:'Cost/AnggaranCost.html',  icon:'fa-solid fa-file-invoice-dollar', label:'Anggaran Cost' },
                { nav:'realisasicost', href:'Cost/RealisasiCost.html', icon:'fa-solid fa-wallet',               label:'Realisasi Cost' },
                { nav:'reportcost',    href:'Cost/ReportCost.html',    icon:'fa-solid fa-chart-column',         label:'Report Cost' },
              ],
            },
            {
              nav: 'perencanaan-income',
              icon: 'fa-solid fa-money-bill-trend-up',
              label: 'Income',
              children: [
                { nav:'anggaranincome',  href:'Income/AnggaranIncome.html',  icon:'fa-solid fa-file-circle-plus', label:'Anggaran Income' },
                { nav:'realisasiincome', href:'Income/RealisasiIncome.html', icon:'fa-solid fa-cash-register',    label:'Realisasi Income' },
                { nav:'reportincome',    href:'Income/ReportIncome.html',    icon:'fa-solid fa-chart-line',       label:'Report Income' },
              ],
            },
          ],
        },
      ],
    },
    {
      label: 'Approval',
      items: [
        { nav:'approval', href:'Approval.html', icon:'fa-solid fa-file-lines', label:'Approval' },
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
            { nav:'mastermataanggaran', href:'MasterMataAnggaran.html', icon:'fa-solid fa-building-columns', label:'Master Mata Anggaran' },
            { nav:'masterprogram', href:'MasterProgram.html', icon:'fa-solid fa-building-columns', label:'Master Program' },
            { nav:'masterkegiatan', href:'MasterKegiatan.html', icon:'fa-solid fa-building-columns', label:'Master Kegiatan' },
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
        { nav:'profil', href:'profile.html', icon:'fa-solid fa-circle-user', label:'Profil' },
        {
          nav: 'menu-pengaturan',
          icon: 'fa-solid fa-gear',
          label: 'Pengaturan',
          children: [
            { nav:'penomoran',  href:'Pengaturan/Penomoran.html',  icon:'fa-solid fa-hashtag', label:'Penomoran' },
          ],
        },
      ],
    },
  ],
};

(function () {
  const cfg = SB_CONFIG;
  const root = document.getElementById('sb-root');

  if (!root) {
    console.warn('[sidebar.js] Elemen #sb-root tidak ditemukan.');
    return;
  }

  const currentScriptEl = getCurrentScriptEl();
  const appBaseUrl = buildAppBaseUrl(cfg.appBase);
  const currentPath = normalizePath(window.location.pathname);
  const activePageFromBody = document.body?.dataset?.page || '';

  ensureSidebarCss();
  injectNestedStyles();

  function getCurrentScriptEl() {
    if (document.currentScript) return document.currentScript;

    const scripts = Array.from(document.getElementsByTagName('script'));
    return scripts.find(s => (s.getAttribute('src') || '').includes('sidebar.js')) || null;
  }

  function buildAppBaseUrl(appBase) {
    const safeBase = typeof appBase === 'string' && appBase.trim() ? appBase.trim() : '/';

    if (/^https?:\/\//i.test(safeBase)) {
      return new URL(safeBase);
    }

    const normalized = safeBase.startsWith('/') ? safeBase : `/${safeBase}`;
    return new URL(normalized, window.location.origin);
  }

  function resolveHref(href) {
    if (!href) return '#';

    const value = String(href).trim();

    if (
      value.startsWith('http://') ||
      value.startsWith('https://') ||
      value.startsWith('mailto:') ||
      value.startsWith('tel:') ||
      value.startsWith('#')
    ) {
      return value;
    }

    if (value.startsWith('/')) {
      return new URL(value, window.location.origin).href;
    }

    return new URL(value, appBaseUrl).href;
  }

  function ensureSidebarCss() {
    const alreadyExists = Array.from(document.styleSheets).some(sheet => {
      try {
        return (sheet.href || '').includes('sidebar.css');
      } catch {
        return false;
      }
    });

    if (alreadyExists) return;

    const existingLink = document.querySelector('link[data-sidebar-css="true"]');
    if (existingLink) return;

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = resolveHref(cfg.assets?.css || 'sidebar.css');
    link.setAttribute('data-sidebar-css', 'true');
    document.head.appendChild(link);
  }

  function normalizePath(path) {
    const cleaned = String(path || '')
      .replace(/[?#].*$/, '')
      .replace(/\/{2,}/g, '/')
      .replace(/\/+$/, '');

    return cleaned || '/';
  }

  function getItemPath(item) {
    if (!item?.href) return '';
    try {
      const url = new URL(resolveHref(item.href), window.location.href);
      return normalizePath(url.pathname);
    } catch {
      return '';
    }
  }

  function isLeafActive(item) {
    if (!item) return false;

    if (activePageFromBody && item.nav === activePageFromBody) {
      return true;
    }

    const itemPath = getItemPath(item);
    return itemPath && itemPath === currentPath;
  }

  function isItemActive(item) {
    if (!item) return false;
    if (isLeafActive(item)) return true;

    if (Array.isArray(item.children) && item.children.length) {
      return item.children.some(child => isItemActive(child));
    }

    return false;
  }

  function renderIcon(iconClass, depth, isLeaf) {
    const iconWrapperClass = depth === 0 && isLeaf ? 'sb-item-icon' : 'sb-subitem-icon';

    return `
      <span class="${iconWrapperClass}">
        <i class="${iconClass}"></i>
      </span>
    `;
  }

  function renderLeafItem(item, depth = 0) {
    const isActive = isLeafActive(item);
    const baseClass = depth === 0 ? 'sb-item' : `sb-subitem sb-depth-${depth}`;
    const badge = item.badge ? `<span class="sb-badge">${item.badge}</span>` : '';
    const href = resolveHref(item.href);

    return `
      <a href="${href}" class="${baseClass}${isActive ? ' active' : ''}" data-nav="${item.nav || ''}">
        ${renderIcon(item.icon, depth, depth === 0)}
        <span class="sb-item-label">${item.label}</span>
        ${badge}
      </a>
    `;
  }

  function renderParentItem(item, depth = 0) {
    const open = isItemActive(item);
    const buttonClass = depth === 0
      ? 'sb-item sb-parent-toggle'
      : `sb-subitem sb-parent-toggle sb-depth-${depth}`;

    const childrenHTML = item.children.map(child => renderItem(child, depth + 1)).join('');

    return `
      <div class="sb-parent sb-depth-${depth}${open ? ' open' : ''}">
        <button
          type="button"
          class="${buttonClass}${open ? ' active' : ''}"
          data-nav="${item.nav || ''}"
          aria-expanded="${open ? 'true' : 'false'}"
        >
          ${renderIcon(item.icon, depth, false)}
          <span class="sb-item-label">${item.label}</span>
          <span class="sb-caret"><i class="fa-solid fa-chevron-down"></i></span>
        </button>

        <div class="sb-submenu sb-depth-${depth}${open ? ' open' : ''}">
          <div class="sb-submenu-inner">
            ${childrenHTML}
          </div>
        </div>
      </div>
    `;
  }

  function renderItem(item, depth = 0) {
    const hasChildren = Array.isArray(item.children) && item.children.length > 0;
    return hasChildren ? renderParentItem(item, depth) : renderLeafItem(item, depth);
  }

  function renderSidebar() {
    const groupsHTML = cfg.groups.map((group, index) => {
      const itemsHTML = group.items.map(item => renderItem(item, 0)).join('');
      const dividerHTML = index < cfg.groups.length - 1 ? `<div class="sb-divider"></div>` : '';

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
        <a href="${resolveHref(cfg.brand.href)}" class="sb-logo">
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
            <a href="${resolveHref(cfg.user.href)}" class="sb-user">
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

  function injectNestedStyles() {
    if (document.getElementById('sb-nested-style')) return;

    const style = document.createElement('style');
    style.id = 'sb-nested-style';
    style.textContent = `
      .sb-submenu {
        max-height: 0;
        overflow: hidden;
        opacity: 0;
        transition: max-height .25s ease, opacity .2s ease;
      }

      .sb-submenu.open {
        max-height: 1400px;
        opacity: 1;
      }

      .sb-submenu-inner {
        display: flex;
        flex-direction: column;
        gap: 4px;
        padding-top: 6px;
      }

      .sb-submenu.sb-depth-0 > .sb-submenu-inner,
      .sb-submenu.sb-depth-1 > .sb-submenu-inner,
      .sb-submenu.sb-depth-2 > .sb-submenu-inner {
        margin-left: 14px;
        padding-left: 12px;
        border-left: 1px dashed var(--cream-dark, #d5e0f0);
      }

      .sb-subitem {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 9px 10px;
        border-radius: 10px;
        color: var(--ink-soft, #5a6e8a);
        font-size: 13px;
        font-weight: 500;
        cursor: pointer;
        text-decoration: none;
        transition: background .15s, color .15s, border-color .15s;
        position: relative;
        white-space: nowrap;
        background: transparent;
        border: 1px solid transparent;
        width: 100%;
        text-align: left;
      }

      .sb-subitem:hover {
        background: var(--cream, #f4f7fc);
        color: var(--ink, #1a2333);
      }

      .sb-subitem.active {
        background: var(--sage-dim, rgba(57,114,184,0.1));
        color: var(--sage, #3972B8);
        font-weight: 600;
      }

      .sb-subitem.sb-depth-1 { margin-left: 0; }
      .sb-subitem.sb-depth-2 { margin-left: 4px; font-size: 12.5px; }
      .sb-subitem.sb-depth-3 { margin-left: 8px; font-size: 12px; }

      .sb-subitem-icon {
        width: 28px;
        height: 28px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        flex-shrink: 0;
        transition: background .15s, color .15s;
      }

      .sb-subitem:hover .sb-subitem-icon {
        background: var(--cream-mid, #e8eef8);
      }

      .sb-subitem.active .sb-subitem-icon {
        background: rgba(57,114,184,0.12);
        color: var(--sage, #3972B8);
      }

      .sb-parent-toggle {
        background: transparent;
        border: none;
      }

      .sb-caret {
        margin-left: auto;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        transition: transform .2s ease;
        font-size: 11px;
        color: inherit;
      }

      .sb-parent.open > .sb-parent-toggle .sb-caret {
        transform: rotate(180deg);
      }

      .sb-parent.open > .sb-parent-toggle.active {
        font-weight: 600;
      }
    `;
    document.head.appendChild(style);
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

  function setParentOpenState(parentEl, isOpen) {
    if (!parentEl) return;

    const toggleBtn = parentEl.children[0];
    const submenu = parentEl.children[1];

    parentEl.classList.toggle('open', isOpen);
    toggleBtn?.setAttribute('aria-expanded', String(isOpen));
    submenu?.classList.toggle('open', isOpen);
  }

  function closeSiblingParents(parentEl) {
    const container = parentEl?.parentElement;
    if (!container) return;

    Array.from(container.children).forEach(child => {
      if (child !== parentEl && child.classList.contains('sb-parent')) {
        setParentOpenState(child, false);
      }
    });
  }

  toggle?.addEventListener('click', toggleSb);
  overlay?.addEventListener('click', closeSb);

  logout?.addEventListener('click', () => {
    window.location.href = resolveHref(cfg.user.logoutHref);
  });

  sb.querySelectorAll('.sb-parent-toggle').forEach(toggleBtn => {
    toggleBtn.addEventListener('click', () => {
      const parent = toggleBtn.closest('.sb-parent');
      if (!parent) return;

      const isOpen = parent.classList.contains('open');
      closeSiblingParents(parent);
      setParentOpenState(parent, !isOpen);
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