/**
 * sidebar.js — Sistem Anggaran
 * ─────────────────────────────────────────────────────────────────────────────
 * Sidebar dinamis: cukup edit bagian KONFIGURASI di bawah untuk menambah,
 * mengubah, atau menghapus menu — tanpa menyentuh satu pun halaman HTML.
 *
 * Cara pakai di tiap halaman HTML:
 *   1. Tambahkan <div id="sb-root"></div> di dalam .app-shell (sebelum .main)
 *   2. Tambahkan <script src="sidebar.js"></script> sebelum </body>
 *   3. Beri atribut data-page="<nav-key>" pada tag <body>
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ═══════════════════════════════════════════════════════════
//  KONFIGURASI APLIKASI
// ═══════════════════════════════════════════════════════════
const SB_CONFIG = {
  brand: {
    initials : 'SA',
    name     : 'Sistem Anggaran',
    tagline  : 'Manajer Keuangan',
    href     : 'dashboard.html',
  },

  user: {
    initials : 'MI',
    name     : 'Muhammad Iqbal',
    role     : 'Administrator',
    href     : 'profile.html',
    logoutHref: 'index.html',
  },

  // ── MENU ─────────────────────────────────────────────────
  // Struktur per group:
  //   { label: 'Nama Seksi', items: [ ...item ] }
  //
  // Struktur per item:
  //   {
  //     nav   : 'key'          ← cocok dengan data-page di <body>
  //     href  : 'file.html'
  //     icon  : 'fa-solid fa-...'   ← class Font Awesome
  //     label : 'Teks Menu'
  //     badge : 4              ← opsional, angka badge merah
  //   }
  // ─────────────────────────────────────────────────────────
  groups: [
    {
      label: 'Utama',
      items: [
        { nav:'dashboard', href:'dashboard.html',  icon:'fa-solid fa-house',                  label:'Dasbor'          },
        { nav:'transaksi', href:'transaksi.html',  icon:'fa-solid fa-arrow-right-arrow-left', label:'Transaksi', badge:4 },
        { nav:'anggaran',  href:'anggaran.html',   icon:'fa-solid fa-wallet',                 label:'Anggaran'        },
        { nav:'tabungan',  href:'tabungan.html',   icon:'fa-solid fa-piggy-bank',             label:'Tujuan Tabungan' },
      ],
    },
    {
      label: 'Perencanaan',
      items: [
        { nav:'rka', href:'RKACost.html', icon:'fa-solid fa-file-invoice-dollar', label:'RKA — Cost' },
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
        { nav:'mastercoa',      href:'MasterCOA.html',      icon:'fa-solid fa-sitemap',          label:'Master COA'      },
        { nav:'masterupt',      href:'MasterUPT.html',      icon:'fa-solid fa-building-columns', label:'Master UPT'      },
        { nav:'masterapproval', href:'MasterApproval.html', icon:'fa-solid fa-code-branch',      label:'Master Approval' },
        { nav:'masterrisk',     href:'MasterRisk.html',     icon:'fa-solid fa-shield-halved',    label:'Master Risk'     },
        { nav:'masteruser',     href:'MasterUser.html',     icon:'fa-solid fa-users-gear',       label:'Master User'     },
      ],
    },
    {
      label: 'Akun',
      items: [
        { nav:'profil',      href:'profile.html',     icon:'fa-solid fa-circle-user', label:'Profil'      },
        { nav:'pengaturan',  href:'pengaturan.html',  icon:'fa-solid fa-gear',        label:'Pengaturan'  },
      ],
    },
  ],
};

// ═══════════════════════════════════════════════════════════
//  ENGINE — jangan ubah di bawah ini kecuali perlu
// ═══════════════════════════════════════════════════════════
(function () {
  const cfg      = SB_CONFIG;
  const activePage = document.body.dataset.page || '';

  /* ── 1. Render HTML ─────────────────────────────────── */
  function renderSidebar() {
    const groupsHTML = cfg.groups.map(g => {
      const itemsHTML = g.items.map(item => {
        const isActive = item.nav === activePage;
        const badge    = item.badge
          ? `<span class="sb-badge">${item.badge}</span>`
          : '';
        return `
          <a href="${item.href}" class="sb-item${isActive ? ' active' : ''}" data-nav="${item.nav}">
            <span class="sb-item-icon"><i class="${item.icon}"></i></span>
            ${item.label}
            ${badge}
          </a>`;
      }).join('');

      return `
        <div class="sb-section">
          <span class="sb-section-label">${g.label}</span>
          ${itemsHTML}
        </div>
        <div class="sb-divider"></div>`;
    }).join('');

    return `
      <!-- ════ MOBILE TOGGLE ════ -->
      <button class="sb-toggle" id="sbToggle" aria-label="Buka menu">
        <i class="fa-solid fa-bars"></i>
      </button>
      <div class="sb-overlay" id="sbOverlay"></div>

      <!-- ════ SIDEBAR ════ -->
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
          <a href="${cfg.user.href}" class="sb-user">
            <div class="sb-avatar">${cfg.user.initials}</div>
            <div class="sb-user-info">
              <div class="sb-user-name">${cfg.user.name}</div>
              <div class="sb-user-role">${cfg.user.role}</div>
            </div>
            <button class="sb-logout"
                    onclick="event.stopPropagation(); window.location.href='${cfg.user.logoutHref}'"
                    title="Keluar">
              <i class="fa-solid fa-right-from-bracket"></i>
            </button>
          </a>
        </div>
      </aside>`;
  }

  /* ── 2. Mount ───────────────────────────────────────── */
  const root = document.getElementById('sb-root');
  if (!root) {
    console.warn('[sidebar.js] Elemen #sb-root tidak ditemukan.');
    return;
  }
  root.innerHTML = renderSidebar();

  /* ── 3. Mobile toggle logic ─────────────────────────── */
  const sb      = document.getElementById('sb');
  const overlay = document.getElementById('sbOverlay');
  const toggle  = document.getElementById('sbToggle');
  if (!sb) return;

  function openSb() {
    sb.classList.add('is-open');
    if (overlay) overlay.classList.add('show');
    document.body.style.overflow = 'hidden';
    if (toggle) toggle.innerHTML = '<i class="fa-solid fa-xmark"></i>';
  }
  function closeSb() {
    sb.classList.remove('is-open');
    if (overlay) overlay.classList.remove('show');
    document.body.style.overflow = '';
    if (toggle) toggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
  }

  if (toggle)  toggle.addEventListener('click', () =>
    sb.classList.contains('is-open') ? closeSb() : openSb());
  if (overlay) overlay.addEventListener('click', closeSb);

  sb.querySelectorAll('.sb-item').forEach(item => {
    item.addEventListener('click', () => {
      if (window.innerWidth <= 900) closeSb();
    });
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && sb.classList.contains('is-open')) closeSb();
  });
})();