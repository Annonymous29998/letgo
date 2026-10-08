(function () {
  const SECTION_META = {
    overview: { title: 'Overview', subtitle: 'Live customer summary and quick actions' },
    users: { title: 'Customers', subtitle: 'Search, paginate, and manage bank logins' },
    editor: { title: 'Edit Customer', subtitle: 'Credentials, balances, photo, and history' },
  };

  const SIDEBAR_KEY = 'wf_admin_sidebar_collapsed';
  const PAGE_SIZE_KEY = 'wf_admin_page_size';
  const ONLINE_THRESHOLD_MS = 45000;
  const SESSION_REFRESH_MS = 10000;

  let customersCache = [];
  let photoFile = null;
  let currentPage = 1;
  let pageSize = Number(localStorage.getItem(PAGE_SIZE_KEY) || 10);
  let searchQuery = '';
  let toastTimer = null;
  let sessionRefreshTimer = null;

  /** Working copy of historyExtras while editing a customer */
  let historyItems = [];
  let txnPage = 1;
  let txnPageSize = 25;
  let txnSearch = '';
  let isNewCustomer = true;

  const els = {
    boot: document.getElementById('adminBootLoader'),
    sidebar: document.getElementById('adminSidebar'),
    backdrop: document.getElementById('sidebarBackdrop'),
    toast: document.getElementById('toast'),
    sectionTitle: document.getElementById('sectionTitle'),
    sectionSubtitle: document.getElementById('sectionSubtitle'),
    recentTable: document.getElementById('recentTable'),
    usersTable: document.getElementById('usersTable'),
    paginationMeta: document.getElementById('paginationMeta'),
    paginationPages: document.getElementById('paginationPages'),
    userCountLabel: document.getElementById('userCountLabel'),
    userSearch: document.getElementById('userSearch'),
    pageSize: document.getElementById('pageSize'),
    accountsEditor: document.getElementById('accountsEditor'),
    photoPreview: document.getElementById('photoPreview'),
    photoFile: document.getElementById('photoFile'),
    customerForm: document.getElementById('customerForm'),
    editorTitle: document.getElementById('editorTitle'),
    editorPresence: document.getElementById('editorPresence'),
    activeUserSelect: document.getElementById('activeUserSelect'),
    editorUserCards: document.getElementById('editorUserCards'),
    deleteBtn: document.getElementById('deleteBtn'),
    historyTableBody: document.getElementById('historyTableBody'),
    historyJson: document.getElementById('historyJson'),
    historyCountLabel: document.getElementById('historyCountLabel'),
    txnPaginationMeta: document.getElementById('txnPaginationMeta'),
    txnPaginationPages: document.getElementById('txnPaginationPages'),
    txnSearch: document.getElementById('txnSearch'),
    txnPageSize: document.getElementById('txnPageSize'),
  };

  function money(value) {
    const n = Number(String(value || '0').replace(/[^0-9.-]/g, ''));
    if (Number.isNaN(n)) return '$0.00';
    return n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  }

  function parseMoney(value) {
    const n = Number(String(value || '0').replace(/[^0-9.-]/g, ''));
    return Number.isNaN(n) ? 0 : n;
  }

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function toast(message, type) {
    if (!els.toast) return;
    els.toast.textContent = message;
    els.toast.className = 'toast is-visible' + (type === 'error' ? ' toast-error' : ' toast-success');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      els.toast.classList.remove('is-visible');
    }, 2800);
  }

  let confirmResolver = null;

  function askConfirm(title, message) {
    const modal = document.getElementById('confirmModal');
    const titleEl = document.getElementById('confirmTitle');
    const messageEl = document.getElementById('confirmMessage');
    if (!modal || !titleEl || !messageEl) {
      return Promise.resolve(window.confirm(message || title));
    }
    titleEl.textContent = title || 'Are you sure?';
    messageEl.textContent = message || 'This action cannot be undone.';
    modal.hidden = false;
    return new Promise((resolve) => {
      confirmResolver = resolve;
    });
  }

  function closeConfirm(answer) {
    const modal = document.getElementById('confirmModal');
    if (modal) modal.hidden = true;
    if (confirmResolver) {
      const resolve = confirmResolver;
      confirmResolver = null;
      resolve(!!answer);
    }
  }

  function primaryBalance(user) {
    return (user.accounts && user.accounts[0] && user.accounts[0].balance) || user.cardBalance || '$0.00';
  }

  /** Admin pages live under /admin/, so local image paths need ../ */
  function resolvePhotoUrl(photo) {
    if (!photo) return '../images/wells.png';
    if (/^(https?:|blob:|data:)/i.test(photo)) return photo;
    const cleaned = String(photo).replace(/^\.\//, '');
    if (cleaned.startsWith('../images/')) return cleaned;
    if (cleaned.startsWith('images/')) return '../' + cleaned;
    if (cleaned.startsWith('/images/')) return '..' + cleaned;
    return photo;
  }

  /** Store app-root relative paths so the bank app can load them */
  function normalizePhotoForSave(photo) {
    if (!photo) return '';
    if (/^(https?:|blob:|data:)/i.test(photo)) {
      if (photo.includes('wells.png') && !photo.startsWith('http')) return '';
      return photo;
    }
    const cleaned = String(photo).replace(/^\.\//, '');
    if (cleaned.startsWith('../images/')) return cleaned.slice(3);
    if (cleaned.startsWith('/images/')) return cleaned.slice(1);
    return cleaned;
  }

  function setBoot(loading) {
    if (!els.boot) return;
    els.boot.hidden = !loading;
  }

  function closeMobileNav() {
    document.body.classList.remove('sidebar-mobile-open');
  }

  function openMobileNav() {
    document.body.classList.add('sidebar-mobile-open');
  }

  function setSection(section) {
    const key = SECTION_META[section] ? section : 'overview';
    document.querySelectorAll('.content-section').forEach((el) => {
      el.classList.toggle('active', el.getAttribute('data-section') === key);
    });
    document.querySelectorAll('.nav-item').forEach((btn) => {
      btn.classList.toggle('active', btn.getAttribute('data-section') === key);
    });
    const meta = SECTION_META[key];
    els.sectionTitle.textContent = meta.title;
    els.sectionSubtitle.textContent = meta.subtitle;
    closeMobileNav();
    if (key === 'users') renderUsersPage();
    if (key === 'overview') renderOverview();
    if (key === 'editor') renderEditorSwitcher(getEditingCustomerId());
  }

  function applySidebarCollapsed(collapsed) {
    els.sidebar.classList.toggle('collapsed', collapsed);
    const icon = document.querySelector('#sidebarToggle i');
    if (icon) {
      icon.className = collapsed ? 'fas fa-chevron-right' : 'fas fa-chevron-left';
    }
    localStorage.setItem(SIDEBAR_KEY, collapsed ? '1' : '0');
  }

  async function ensureAuth() {
    if (!window.wfDb || !window.wfDb.configured()) {
      toast('Configure js/supabase-config.js first.', 'error');
      location.replace('index.html');
      return false;
    }
    const ok = await window.wfDb.requireAdminSession();
    if (!ok) {
      location.replace('index.html');
      return false;
    }
    return true;
  }

  async function refreshCustomers() {
    customersCache = await window.wfDb.listCustomers();
    return customersCache;
  }

  function filteredCustomers() {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return customersCache.slice();
    return customersCache.filter((u) => {
      const hay = [u.name, u.username, u.email, u.phone, u.id].join(' ').toLowerCase();
      return hay.includes(q);
    });
  }

  function isUserOnline(user) {
    if (!user || !user.lastActiveAt) return false;
    const ts = new Date(user.lastActiveAt).getTime();
    if (Number.isNaN(ts)) return false;
    return Date.now() - ts <= ONLINE_THRESHOLD_MS;
  }

  function formatRelativeTime(value) {
    if (!value) return 'Never';
    const ts = new Date(value).getTime();
    if (Number.isNaN(ts)) return 'Never';
    const diffSec = Math.max(0, Math.floor((Date.now() - ts) / 1000));
    if (diffSec < 45) return 'Just now';
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return diffMin + ' min ago';
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return diffHr + ' hr ago';
    const diffDay = Math.floor(diffHr / 24);
    return diffDay + ' day' + (diffDay === 1 ? '' : 's') + ' ago';
  }

  function sessionBadgeHtml(user) {
    if (isUserOnline(user)) {
      return '<span class="session-badge online">Online</span>';
    }
    return '<span class="session-badge offline">Offline</span>';
  }

  function lastSeenLabel(user) {
    if (isUserOnline(user)) return 'Active now';
    const at = user.lastActiveAt || user.lastLoginAt;
    if (!at) return 'Never seen';
    return formatRelativeTime(at) + ' · ' + new Date(at).toLocaleString();
  }

  function summarizeUserAgent(ua) {
    const raw = String(ua || '').trim();
    if (!raw) return { label: 'Unknown device', detail: '' };

    let os = 'Unknown OS';
    if (/iPhone/i.test(raw)) os = 'iPhone';
    else if (/iPad/i.test(raw)) os = 'iPad';
    else if (/Android/i.test(raw)) {
      const m = raw.match(/Android\s+([\d.]+)/i);
      os = m ? 'Android ' + m[1] : 'Android';
    } else if (/Windows NT/i.test(raw)) os = 'Windows';
    else if (/Mac OS X/i.test(raw)) os = 'Mac';
    else if (/CrOS/i.test(raw)) os = 'ChromeOS';
    else if (/Linux/i.test(raw)) os = 'Linux';

    let browser = 'Browser';
    if (/Edg\//i.test(raw)) browser = 'Edge';
    else if (/OPR\/|Opera/i.test(raw)) browser = 'Opera';
    else if (/Chrome\//i.test(raw) && !/Edg\//i.test(raw)) browser = 'Chrome';
    else if (/Safari\//i.test(raw) && !/Chrome\//i.test(raw)) browser = 'Safari';
    else if (/Firefox\//i.test(raw)) browser = 'Firefox';

    const mobile = /Mobile|Android|iPhone|iPad/i.test(raw);
    const kind = mobile ? 'Mobile' : 'Desktop';
    return {
      label: kind + ' · ' + os + ' · ' + browser,
      detail: raw,
    };
  }

  function deviceCellHtml(user) {
    const info = summarizeUserAgent(user.lastUserAgent);
    const title = info.detail ? ' title="' + escapeHtml(info.detail) + '"' : '';
    return (
      '<div class="device-cell"' +
      title +
      '>' +
      '<strong>' +
      escapeHtml(info.label) +
      '</strong>' +
      (info.detail
        ? '<br /><span class="muted-note device-ua">' + escapeHtml(info.detail) + '</span>'
        : '') +
      '</div>'
    );
  }

  function customerRow(u, opts) {
    const showActions = !opts || opts.actions !== false;
    const bal = primaryBalance(u);
    const photoSrc = resolvePhotoUrl(u.photo);
    return `
      <tr>
        <td>
          <div class="user-chip">
            <img src="${escapeHtml(photoSrc)}" alt="" onerror="this.src='../images/wells.png'" />
            <div>
              <strong>${escapeHtml(u.name)}</strong><br />
              <span class="muted-note">${escapeHtml(u.phone || 'No phone')}</span>
            </div>
          </div>
        </td>
        <td>${escapeHtml(u.username)}</td>
        <td>${sessionBadgeHtml(u)}</td>
        <td><span class="muted-note">${escapeHtml(lastSeenLabel(u))}</span></td>
        <td>${deviceCellHtml(u)}</td>
        ${
          opts && opts.recent
            ? ''
            : `<td><code style="font-size:12px">${escapeHtml(u.password || '—')}</code></td>
               <td>${escapeHtml(u.email || '—')}</td>`
        }
        <td>${escapeHtml(bal)}</td>
        <td>
          ${
            showActions
              ? `<div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end">
                  <button class="btn btn-secondary" type="button" data-edit="${escapeHtml(u.id)}">Edit</button>
                  <button class="btn btn-danger" type="button" data-delete="${escapeHtml(u.id)}">Delete</button>
                </div>`
              : ''
          }
        </td>
      </tr>`;
  }

  function renderOverview() {
    const total = customersCache.length;
    const onlineCount = customersCache.filter(isUserOnline).length;
    const withPhoto = customersCache.filter((u) => u.photo).length;
    const accountCount = customersCache.reduce((sum, u) => sum + (u.accounts || []).length, 0);
    const balanceSum = customersCache.reduce((sum, u) => sum + parseMoney(primaryBalance(u)), 0);

    document.getElementById('statTotal').textContent = String(total);
    const onlineEl = document.getElementById('statOnline');
    if (onlineEl) onlineEl.textContent = String(onlineCount);
    document.getElementById('statPhotos').textContent = String(withPhoto);
    document.getElementById('statBalances').textContent = money(balanceSum);
    document.getElementById('statAccounts').textContent = String(accountCount);

    const recent = customersCache.slice(0, 6);
    els.recentTable.innerHTML = recent.length
      ? recent.map((u) => customerRow(u, { recent: true })).join('')
      : '<tr><td colspan="7" class="muted-note">No customers yet. Use New customer to create one.</td></tr>';
  }

  function renderPagination(total, page, size) {
    const pages = Math.max(1, Math.ceil(total / size));
    if (page > pages) page = pages;
    currentPage = page;

    const start = total === 0 ? 0 : (page - 1) * size + 1;
    const end = Math.min(total, page * size);
    els.paginationMeta.textContent = `Showing ${start}–${end} of ${total}`;

    const buttons = [];
    buttons.push(
      `<button type="button" class="page-btn" data-page="${page - 1}" ${page <= 1 ? 'disabled' : ''} aria-label="Previous">‹</button>`
    );

    const windowSize = 5;
    let from = Math.max(1, page - Math.floor(windowSize / 2));
    let to = Math.min(pages, from + windowSize - 1);
    from = Math.max(1, to - windowSize + 1);

    if (from > 1) {
      buttons.push(`<button type="button" class="page-btn" data-page="1">1</button>`);
      if (from > 2) buttons.push('<span class="muted-note">…</span>');
    }
    for (let i = from; i <= to; i++) {
      buttons.push(
        `<button type="button" class="page-btn${i === page ? ' active' : ''}" data-page="${i}">${i}</button>`
      );
    }
    if (to < pages) {
      if (to < pages - 1) buttons.push('<span class="muted-note">…</span>');
      buttons.push(`<button type="button" class="page-btn" data-page="${pages}">${pages}</button>`);
    }

    buttons.push(
      `<button type="button" class="page-btn" data-page="${page + 1}" ${page >= pages ? 'disabled' : ''} aria-label="Next">›</button>`
    );

    els.paginationPages.innerHTML = buttons.join('');
  }

  function renderUsersPage() {
    const list = filteredCustomers();
    const total = list.length;
    els.userCountLabel.textContent = `${total} customer${total === 1 ? '' : 's'}`;

    const pages = Math.max(1, Math.ceil(total / pageSize) || 1);
    if (currentPage > pages) currentPage = pages;

    const start = (currentPage - 1) * pageSize;
    const slice = list.slice(start, start + pageSize);

    els.usersTable.innerHTML = slice.length
      ? slice.map((u) => customerRow(u)).join('')
      : '<tr><td colspan="9" class="muted-note">No customers match your search.</td></tr>';

    renderPagination(total, currentPage, pageSize);
  }

  function emptyAccounts() {
    return [{ title: 'Everyday Checking...0000', balance: '$0.00', theme: 'dark', dot: 'wf-dot-black' }];
  }

  function renderAccounts(accounts) {
    const rows = accounts && accounts.length ? accounts : emptyAccounts();
    els.accountsEditor.innerHTML = rows
      .map(
        (a, i) => `
      <div class="account-row" data-acc="${i}">
        <input data-k="title" placeholder="Account title" value="${escapeHtml(a.title || '')}" />
        <input data-k="balance" placeholder="$0.00" value="${escapeHtml(a.balance || '$0.00')}" />
        <select data-k="theme">
          <option value="dark" ${a.theme === 'dark' ? 'selected' : ''}>Dark</option>
          <option value="blue" ${a.theme === 'blue' ? 'selected' : ''}>Blue</option>
        </select>
        <button type="button" class="btn btn-danger" data-remove-acc="${i}">Remove</button>
      </div>`
      )
      .join('');
  }

  function collectAccounts() {
    return Array.from(document.querySelectorAll('#accountsEditor .account-row')).map((row) => {
      const title = row.querySelector('[data-k="title"]').value.trim();
      const balanceRaw = row.querySelector('[data-k="balance"]').value.trim() || '$0.00';
      const theme = row.querySelector('[data-k="theme"]').value;
      const last4 = (title.match(/(\d{4})\s*$/) || [])[1] || '0000';
      return {
        title: title || `Everyday Checking...${last4}`,
        balance: balanceRaw.startsWith('$') ? balanceRaw : money(balanceRaw),
        theme,
        dot: theme === 'dark' ? 'wf-dot-black' : 'wf-dot-blue',
      };
    });
  }

  function syncHistoryJson() {
    if (els.historyJson) {
      els.historyJson.value = JSON.stringify(historyItems, null, 2);
    }
  }

  function setHistoryItems(items, opts) {
    historyItems = Array.isArray(items) ? items.map((row) => ({ ...row })) : [];
    txnPage = 1;
    syncHistoryJson();
    renderHistoryEditor();
    if (opts && opts.toast) toast(opts.toast);
  }

  function filteredHistory() {
    const q = txnSearch.trim().toLowerCase();
    if (!q) return historyItems.map((item, index) => ({ item, index }));
    return historyItems
      .map((item, index) => ({ item, index }))
      .filter(({ item }) => {
        const hay = [item.date, item.merchant, item.type, item.amount].join(' ').toLowerCase();
        return hay.includes(q);
      });
  }

  function renderTxnPagination(total, page, size) {
    const pages = Math.max(1, Math.ceil(total / size) || 1);
    if (page > pages) page = pages;
    txnPage = page;
    const start = total === 0 ? 0 : (page - 1) * size + 1;
    const end = Math.min(total, page * size);
    els.txnPaginationMeta.textContent = `Showing ${start}–${end} of ${total}`;

    const buttons = [];
    buttons.push(
      `<button type="button" class="page-btn" data-txn-page="${page - 1}" ${page <= 1 ? 'disabled' : ''}>‹</button>`
    );
    const windowSize = 5;
    let from = Math.max(1, page - Math.floor(windowSize / 2));
    let to = Math.min(pages, from + windowSize - 1);
    from = Math.max(1, to - windowSize + 1);
    for (let i = from; i <= to; i++) {
      buttons.push(
        `<button type="button" class="page-btn${i === page ? ' active' : ''}" data-txn-page="${i}">${i}</button>`
      );
    }
    buttons.push(
      `<button type="button" class="page-btn" data-txn-page="${page + 1}" ${page >= pages ? 'disabled' : ''}>›</button>`
    );
    els.txnPaginationPages.innerHTML = buttons.join('');
  }

  const TXN_CATEGORIES = [
    'Card Purchase',
    'Direct Deposit',
    'Wire Transfer',
    'Fuel Purchase',
    'Cash Withdrawal',
    'Bill Payment',
    'Subscription',
    'Transfer',
    'Other',
  ];

  function detectTxnFlow(item) {
    if (item && (item.flow === 'credit' || item.flow === 'debit')) return item.flow;
    const amt = String((item && item.amount) || '').trim();
    return amt.startsWith('-') ? 'debit' : 'credit';
  }

  function absoluteAmountDisplay(amount) {
    const n = Math.abs(parseMoney(amount));
    return money(n);
  }

  function formatTxnAmount(rawAmount, flow) {
    const formatted = absoluteAmountDisplay(rawAmount);
    return flow === 'debit' ? '-' + formatted : formatted;
  }

  function categoryOptionsHtml(selected) {
    const current = selected || 'Card Purchase';
    const opts = TXN_CATEGORIES.slice();
    if (current && !opts.includes(current)) opts.unshift(current);
    return opts
      .map(
        (cat) =>
          `<option value="${escapeHtml(cat)}" ${cat === current ? 'selected' : ''}>${escapeHtml(cat)}</option>`
      )
      .join('');
  }

  function normalizeHistoryItem(row) {
    const flow = detectTxnFlow(row);
    const item = {
      date: String(row.date || '').trim(),
      merchant: String(row.merchant || '').trim(),
      type: String(row.type || '').trim() || 'Card Purchase',
      amount: formatTxnAmount(row.amount || '0', flow),
      flow,
    };
    if (row.pending) item.pending = true;
    return item;
  }

  function renderHistoryEditor() {
    const list = filteredHistory();
    const total = list.length;
    const startYear = window.wfHistoryGen
      ? window.wfHistoryGen.parseSinceDate(document.getElementById('memberSince').value).getFullYear()
      : '—';
    els.historyCountLabel.textContent = total
      ? `${historyItems.length} transactions. Edit date, merchant, category, credit/debit, amount, or pending — then Save.`
      : `No transactions yet. New accounts auto-generate from Since ${startYear} through today.`;

    const pages = Math.max(1, Math.ceil(total / txnPageSize) || 1);
    if (txnPage > pages) txnPage = pages;
    const start = (txnPage - 1) * txnPageSize;
    const slice = list.slice(start, start + txnPageSize);

    if (!slice.length) {
      els.historyTableBody.innerHTML =
        '<tr><td colspan="7" class="muted-note">No transactions on this page.</td></tr>';
    } else {
      els.historyTableBody.innerHTML = slice
        .map(({ item, index }) => {
          const flow = detectTxnFlow(item);
          return `
          <tr data-txn-index="${index}">
            <td><input data-txn-k="date" value="${escapeHtml(item.date || '')}" /></td>
            <td><input data-txn-k="merchant" value="${escapeHtml(item.merchant || '')}" /></td>
            <td>
              <select data-txn-k="type">${categoryOptionsHtml(item.type)}</select>
            </td>
            <td>
              <select data-txn-k="flow">
                <option value="debit" ${flow === 'debit' ? 'selected' : ''}>Debit</option>
                <option value="credit" ${flow === 'credit' ? 'selected' : ''}>Credit</option>
              </select>
            </td>
            <td><input data-txn-k="amount" value="${escapeHtml(absoluteAmountDisplay(item.amount))}" /></td>
            <td style="text-align:center">
              <input type="checkbox" data-txn-k="pending" ${item.pending ? 'checked' : ''} />
            </td>
            <td>
              <button type="button" class="btn btn-danger" data-txn-remove="${index}">Delete</button>
            </td>
          </tr>`;
        })
        .join('');
    }

    renderTxnPagination(total, txnPage, txnPageSize);
    syncHistoryJson();
  }

  function defaultRestriction() {
    return {
      title: 'Error',
      greeting: '',
      message: "We're sorry, we weren't able to complete your request. Please try again.",
      feeText: '',
      button: 'Retry',
      support: '',
      settlementFee: 0,
    };
  }

  function defaultTransferError() {
    return {
      title: 'Error',
      message: "We're sorry, we weren't able to complete your request. Please try again.",
      button: 'Retry',
    };
  }

  function normalizeRestriction(restriction) {
    const defaults = defaultRestriction();
    const src = restriction || {};
    const next = Object.assign({}, defaults, src);
    next.settlementFee = Number(next.settlementFee) || 0;
    // Migrate old BOA-style multi-line fields into one Wells message
    if (src.greeting || src.feeText) {
      next.message =
        [src.greeting, src.message, src.feeText].filter(Boolean).join('\n\n') || defaults.message;
    }
    if (!next.title) next.title = defaults.title;
    if (next.title === 'Account Restricted') next.title = 'Error';
    if (!next.button || next.button === 'I Understand') next.button = defaults.button;
    next.greeting = '';
    next.feeText = '';
    next.support = '';
    return next;
  }

  function fillRestrictionPlaceholders(template, name, feeFormatted) {
    return String(template || '')
      .replace(/\{name\}/gi, name || 'Customer')
      .replace(/\{fee\}/gi, feeFormatted || '$0.00');
  }

  function formatFee(value) {
    const n = Number(value) || 0;
    return n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  }

  function collectRestrictionFromUi() {
    return normalizeRestriction({
      title: document.getElementById('restrictionTitle').value.trim(),
      greeting: document.getElementById('restrictionGreeting').value.trim(),
      message: document.getElementById('restrictionMessage').value.trim(),
      feeText: document.getElementById('restrictionFeeText').value.trim(),
      button: document.getElementById('restrictionButton').value.trim(),
      support: document.getElementById('restrictionSupport').value.trim(),
      settlementFee: Number(document.getElementById('settlementFee').value) || 0,
    });
  }

  function collectTransferErrorFromUi() {
    // Keep transfer_error in sync with the Wells transfer/pending modal fields
    const r = collectRestrictionFromUi();
    return {
      title: r.title || 'Error',
      message: r.message || defaultTransferError().message,
      button: r.button || 'Retry',
    };
  }

  function fillRestrictionForm(restriction) {
    const r = normalizeRestriction(restriction);
    document.getElementById('restrictionTitle').value = r.title || 'Error';
    document.getElementById('restrictionGreeting').value = '';
    document.getElementById('restrictionMessage').value = r.message || '';
    document.getElementById('restrictionFeeText').value = '';
    document.getElementById('restrictionButton').value = r.button || 'Retry';
    document.getElementById('restrictionSupport').value = '';
    document.getElementById('settlementFee').value = r.settlementFee;
    updateRestrictionPreview();
  }

  function fillTransferErrorForm(transferError) {
    // If restriction already filled, prefer that; otherwise seed from transferError
    const titleEl = document.getElementById('restrictionTitle');
    if (transferError && (!titleEl.value || titleEl.value === 'Error')) {
      const t = Object.assign({}, defaultTransferError(), transferError || {});
      if (!document.getElementById('restrictionMessage').value) {
        document.getElementById('restrictionTitle').value = t.title || 'Error';
        document.getElementById('restrictionMessage').value = t.message || '';
        document.getElementById('restrictionButton').value = t.button || 'Retry';
        updateRestrictionPreview();
      }
    }
  }

  function updateRestrictionPreview() {
    const name = document.getElementById('fullName').value.trim() || 'Customer';
    const fee = formatFee(document.getElementById('settlementFee').value);
    const title = document.getElementById('restrictionTitle').value.trim() || 'Error';
    const message = fillRestrictionPlaceholders(
      document.getElementById('restrictionMessage').value || defaultRestriction().message,
      name,
      fee
    );
    const button = document.getElementById('restrictionButton').value.trim() || 'Retry';

    document.getElementById('restrictionPreviewTitle').textContent = title;
    document.getElementById('restrictionPreviewBody').textContent = message;
    document.getElementById('restrictionPreviewButton').textContent = button;
  }

  async function generateHistoryFromSince(force) {
    if (!window.wfHistoryGen) {
      toast('History generator failed to load.', 'error');
      return;
    }
    if (!force && historyItems.length) {
      const ok = await askConfirm(
        'Replace history?',
        'Are you sure you want to replace the current transaction list with a new generated history?'
      );
      if (!ok) return;
    }
    const since = document.getElementById('memberSince').value.trim() || 'Since 2026';
    const seed =
      document.getElementById('username').value.trim() ||
      document.getElementById('fullName').value.trim() ||
      since;
    const items = window.wfHistoryGen.generateHistory(since, {
      endDate: new Date(),
      seed,
    });
    setHistoryItems(items, {
      toast: `Generated ${items.length} transactions from ${since} through today.`,
    });
  }

  function updateEditorPresence(user) {
    if (!els.editorPresence) return;
    if (!user || !user.id) {
      els.editorPresence.textContent =
        'Login credentials, profile photo, balances, and transaction history';
      return;
    }
    const status = isUserOnline(user) ? 'Online now' : 'Offline';
    const lastLogin = user.lastLoginAt
      ? formatRelativeTime(user.lastLoginAt) + ' (' + new Date(user.lastLoginAt).toLocaleString() + ')'
      : 'Never logged in';
    const lastSeen = lastSeenLabel(user);
    const device = summarizeUserAgent(user.lastUserAgent);
    els.editorPresence.innerHTML =
      `<span class="session-badge ${isUserOnline(user) ? 'online' : 'offline'}">${status}</span>` +
      ` <span class="muted-note">Last seen: ${escapeHtml(lastSeen)} · Last login: ${escapeHtml(lastLogin)}</span>` +
      `<br /><span class="muted-note" title="${escapeHtml(device.detail)}">Device: ${escapeHtml(device.label)}</span>`;
  }

  function fillForm(user) {
    const isNew = !user || !user.id;
    isNewCustomer = isNew;
    photoFile = null;
    document.getElementById('editId').value = user.id || '';
    els.editorTitle.textContent = isNew ? 'Create customer' : `Edit ${user.name}`;
    els.deleteBtn.hidden = isNew;
    updateEditorPresence(user);

    document.getElementById('fullName').value = user.name || '';
    document.getElementById('firstName').value = user.firstName || user.name || '';
    document.getElementById('username').value = user.username || '';
    document.getElementById('password').value = user.password || '';
    document.getElementById('email').value = user.email || '';
    document.getElementById('phone').value = user.phone || '';
    document.getElementById('dob').value = user.dob || '';
    document.getElementById('age').value = user.age || '';
    document.getElementById('sex').value = user.sex || '';
    document.getElementById('relationship').value = user.relationship || '';
    document.getElementById('address').value = user.address || '';
    document.getElementById('state').value = user.state || '';
    document.getElementById('zip').value = user.zip || '';
    document.getElementById('memberSince').value = user.since || 'Since 2026';
    document.getElementById('accountNumber').value = user.accountNumber || '';
    document.getElementById('routingNumber').value = user.routingNumber || '121000248';
    document.getElementById('cardBalance').value = user.cardBalance || '$0.00';
    document.getElementById('spendingBalance').value = user.spendingBalance || '$0.00';
    document.getElementById('showAddress').checked = user.showAddress !== false;
    document.getElementById('showSpending').checked = !!user.showSpendingCard;
    document.getElementById('showRestriction').checked = !!user.showRestrictionNotice;
    els.photoPreview.src = resolvePhotoUrl(user.photo);
    els.photoFile.value = '';
    renderAccounts(user.accounts);
    fillRestrictionForm(user.restriction);
    fillTransferErrorForm(user.transferError);

    txnSearch = '';
    if (els.txnSearch) els.txnSearch.value = '';
    const existing = Array.isArray(user.historyExtras) ? user.historyExtras : [];
    if (isNew && !existing.length && window.wfHistoryGen) {
      const since = user.since || document.getElementById('memberSince').value || 'Since 2026';
      historyItems = window.wfHistoryGen.generateHistory(since, {
        endDate: new Date(),
        seed: user.username || user.name || since,
      });
    } else {
      historyItems = existing.map((row) => ({ ...row }));
    }
    txnPage = 1;
    renderHistoryEditor();

    const pwd = document.getElementById('password');
    if (pwd) pwd.type = 'password';
    const toggle = document.querySelector('.password-toggle[data-target="password"]');
    if (toggle) {
      toggle.innerHTML = '<i class="fas fa-eye"></i>';
      toggle.setAttribute('aria-label', 'Show password');
    }
  }

  function getEditingCustomerId() {
    return document.getElementById('editId')?.value || '';
  }

  function renderEditorSwitcher(selectedId) {
    const currentId = selectedId !== undefined ? selectedId : getEditingCustomerId();
    const sorted = customersCache
      .slice()
      .sort((a, b) => String(a.name || '').localeCompare(String(b.name || '')));

    if (els.activeUserSelect) {
      const options = [
        '<option value="">New customer…</option>',
        ...sorted.map((u) => {
          const bal = primaryBalance(u);
          const online = isUserOnline(u) ? ' ●' : '';
          const selected = u.id === currentId ? ' selected' : '';
          return `<option value="${escapeHtml(u.id)}"${selected}>${escapeHtml(u.name || u.username)} (${escapeHtml(bal)})${online}</option>`;
        }),
      ];
      els.activeUserSelect.innerHTML = options.join('');
      if (!currentId) els.activeUserSelect.value = '';
    }

    if (els.editorUserCards) {
      if (!sorted.length) {
        els.editorUserCards.innerHTML =
          '<p class="muted-note" style="margin:0;flex:0 0 auto">No customers yet. Create one below.</p>';
        return;
      }
      els.editorUserCards.innerHTML = sorted
        .map((u) => {
          const active = u.id === currentId ? ' active' : '';
          const photoSrc = resolvePhotoUrl(u.photo);
          return `
            <button type="button" class="editor-user-card${active}" data-switch-user="${escapeHtml(u.id)}">
              <img src="${escapeHtml(photoSrc)}" alt="" onerror="this.src='../images/wells.png'" />
              <div>
                <strong>${escapeHtml(u.name || u.username)}</strong>
                <span class="muted-note">${escapeHtml(u.username || '')}</span>
                ${sessionBadgeHtml(u)}
              </div>
            </button>`;
        })
        .join('');
    }
  }

  async function switchEditorCustomer(userId) {
    const currentId = getEditingCustomerId();
    const nextId = userId || '';
    if (nextId === currentId) {
      renderEditorSwitcher(currentId);
      return;
    }

    if (isNewCustomer && !currentId) {
      const ok = await askConfirm(
        'Leave new customer?',
        'Unsaved details for this new customer will be lost. Continue?'
      );
      if (!ok) {
        renderEditorSwitcher(currentId);
        return;
      }
    }

    if (!nextId) {
      openEditor({});
      return;
    }

    const user = customersCache.find((u) => u.id === nextId);
    if (!user) {
      toast('Customer not found.', 'error');
      renderEditorSwitcher(currentId);
      return;
    }
    openEditor(user);
  }

  function openEditor(user) {
    fillForm(user || {});
    renderEditorSwitcher(user && user.id ? user.id : '');
    setSection('editor');
  }

  function collectHistoryFromUi() {
    // Prefer in-memory edits; allow JSON override if advanced panel was edited
    try {
      const raw = els.historyJson.value.trim();
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          historyItems = parsed.map(normalizeHistoryItem);
        }
      }
    } catch (e) {
      throw new Error('History JSON is invalid.');
    }
    historyItems = historyItems.map(normalizeHistoryItem);
    return historyItems
      .map((row) => {
        const item = {
          date: row.date,
          merchant: row.merchant,
          type: row.type,
          amount: row.amount,
          flow: row.flow,
        };
        if (row.pending) item.pending = true;
        return item;
      })
      .filter((row) => row.date || row.merchant || row.amount);
  }

  async function saveCustomer(event) {
    event.preventDefault();
    let historyExtras;
    try {
      historyExtras = collectHistoryFromUi();
    } catch (e) {
      toast(e.message || 'History is invalid.', 'error');
      return;
    }

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const name = document.getElementById('fullName').value.trim();
    const since = document.getElementById('memberSince').value.trim() || 'Since 2026';
    if (!username || !password || !name) {
      toast('Username, password, and full name are required.', 'error');
      return;
    }

    // New accounts always get full history if empty
    if (isNewCustomer && (!historyExtras.length) && window.wfHistoryGen) {
      historyExtras = window.wfHistoryGen.generateHistory(since, {
        endDate: new Date(),
        seed: username,
      });
      setHistoryItems(historyExtras);
    }

    const accounts = collectAccounts();
    let photo = normalizePhotoForSave(els.photoPreview.getAttribute('src') || '');
    if (!photo || photo === 'images/wells.png' || photo.endsWith('/wells.png')) photo = '';

    const editingId = document.getElementById('editId').value || null;
    const id =
      editingId ||
      username
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') ||
      'user-' + Date.now();

    const saveBtn = document.getElementById('saveBtn');
    saveBtn.disabled = true;
    try {
      if (photoFile) {
        photo = await window.wfDb.uploadAvatar(photoFile, id);
      }

      const primary = accounts[0] ? accounts[0].balance : document.getElementById('cardBalance').value;
      const payload = {
        id,
        username,
        password,
        name,
        firstName: document.getElementById('firstName').value.trim() || name,
        dob: document.getElementById('dob').value.trim(),
        age: document.getElementById('age').value.trim(),
        sex: document.getElementById('sex').value.trim(),
        relationship: document.getElementById('relationship').value.trim(),
        address: document.getElementById('address').value.trim(),
        state: document.getElementById('state').value.trim(),
        zip: document.getElementById('zip').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        photo,
        since,
        showAddress: document.getElementById('showAddress').checked,
        accountNumber: document.getElementById('accountNumber').value.trim(),
        routingNumber: document.getElementById('routingNumber').value.trim(),
        accounts,
        cardBalance: document.getElementById('cardBalance').value.trim() || primary,
        spendingBalance: document.getElementById('spendingBalance').value.trim() || '$0.00',
        showSpendingCard: document.getElementById('showSpending').checked,
        showRestrictionNotice: document.getElementById('showRestriction').checked,
        historyExtras,
        restriction: collectRestrictionFromUi(),
        transferError: collectTransferErrorFromUi(),
      };

      const saved = await window.wfDb.upsertCustomer(payload);
      await refreshCustomers();
      fillForm(saved);
      renderEditorSwitcher(saved.id || '');
      toast(
        isNewCustomer
          ? `Customer created with ${historyExtras.length} history items.`
          : 'Customer saved.'
      );
      setSection('users');
    } catch (err) {
      toast(err.message || 'Save failed.', 'error');
    } finally {
      saveBtn.disabled = false;
    }
  }

  async function deleteCustomer(id) {
    if (!id) return;
    const ok = await askConfirm('Delete customer?', 'Are you sure you want to delete this customer? This cannot be undone.');
    if (!ok) return;
    try {
      await window.wfDb.deleteCustomer(id);
      await refreshCustomers();
      toast('Customer deleted.');
      if (getEditingCustomerId() === id) {
        openEditor({});
      } else {
        renderEditorSwitcher(getEditingCustomerId());
      }
      renderOverview();
      renderUsersPage();
    } catch (err) {
      toast(err.message || 'Delete failed.', 'error');
    }
  }

  function bindUi() {
    document.getElementById('confirmYesBtn').addEventListener('click', () => closeConfirm(true));
    document.getElementById('confirmNoBtn').addEventListener('click', () => closeConfirm(false));
    document.getElementById('confirmModal').addEventListener('click', (event) => {
      if (event.target.id === 'confirmModal') closeConfirm(false);
    });

    document.getElementById('sidebarToggle').addEventListener('click', () => {
      applySidebarCollapsed(!els.sidebar.classList.contains('collapsed'));
    });

    document.getElementById('mobileMenuBtn').addEventListener('click', openMobileNav);
    els.backdrop.addEventListener('click', closeMobileNav);

    document.querySelectorAll('.nav-item').forEach((btn) => {
      btn.addEventListener('click', () => {
        const section = btn.getAttribute('data-section');
        if (section === 'editor' && !document.getElementById('editId').value) {
          openEditor({});
          return;
        }
        setSection(section);
      });
    });

    document.getElementById('logoutBtn').addEventListener('click', async () => {
      await window.wfDb.adminLogout();
      location.replace('index.html');
    });

    document.getElementById('refreshBtn').addEventListener('click', async () => {
      try {
        await refreshCustomers();
        renderOverview();
        renderUsersPage();
        renderEditorSwitcher(getEditingCustomerId());
        toast('Refreshed.');
      } catch (err) {
        toast(err.message || 'Refresh failed.', 'error');
      }
    });

    document.getElementById('newCustomerBtn').addEventListener('click', () => openEditor({}));
    document.getElementById('createUserBtn').addEventListener('click', () => openEditor({}));

    if (els.activeUserSelect) {
      els.activeUserSelect.addEventListener('change', () => {
        switchEditorCustomer(els.activeUserSelect.value);
      });
    }

    if (els.editorUserCards) {
      els.editorUserCards.addEventListener('click', (event) => {
        const card = event.target.closest('[data-switch-user]');
        if (!card) return;
        switchEditorCustomer(card.getAttribute('data-switch-user'));
      });
    }

    document.querySelectorAll('[data-goto]').forEach((btn) => {
      btn.addEventListener('click', () => setSection(btn.getAttribute('data-goto')));
    });

    els.userSearch.addEventListener('input', () => {
      searchQuery = els.userSearch.value;
      currentPage = 1;
      renderUsersPage();
    });

    els.pageSize.value = String(pageSize);
    els.pageSize.addEventListener('change', () => {
      pageSize = Number(els.pageSize.value) || 10;
      localStorage.setItem(PAGE_SIZE_KEY, String(pageSize));
      currentPage = 1;
      renderUsersPage();
    });

    els.paginationPages.addEventListener('click', (event) => {
      const btn = event.target.closest('[data-page]');
      if (!btn || btn.disabled) return;
      const page = Number(btn.getAttribute('data-page'));
      if (!page || page === currentPage) return;
      currentPage = page;
      renderUsersPage();
    });

    document.getElementById('addAccountBtn').addEventListener('click', () => {
      const i = els.accountsEditor.querySelectorAll('.account-row').length;
      const row = document.createElement('div');
      row.className = 'account-row';
      row.dataset.acc = String(i);
      row.innerHTML = `
        <input data-k="title" placeholder="Account title" value="Everyday Checking...0000" />
        <input data-k="balance" placeholder="$0.00" value="$0.00" />
        <select data-k="theme">
          <option value="dark" selected>Dark</option>
          <option value="blue">Blue</option>
        </select>
        <button type="button" class="btn btn-danger" data-remove-acc="${i}">Remove</button>
      `;
      els.accountsEditor.appendChild(row);
    });

    els.accountsEditor.addEventListener('click', async (event) => {
      const remove = event.target.closest('[data-remove-acc]');
      if (!remove) return;
      const ok = await askConfirm('Remove account?', 'Are you sure you want to remove this account from the customer?');
      if (!ok) return;
      remove.closest('.account-row')?.remove();
    });

    els.photoFile.addEventListener('change', () => {
      if (els.photoFile.files && els.photoFile.files[0]) {
        photoFile = els.photoFile.files[0];
        els.photoPreview.src = URL.createObjectURL(photoFile);
      }
    });

    els.customerForm.addEventListener('submit', saveCustomer);

    els.deleteBtn.addEventListener('click', () => {
      deleteCustomer(document.getElementById('editId').value);
    });

    ['restrictionTitle', 'restrictionMessage', 'restrictionButton', 'settlementFee', 'fullName'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('input', updateRestrictionPreview);
    });

    document.getElementById('generateHistoryBtn').addEventListener('click', () => {
      generateHistoryFromSince(false);
    });

    document.getElementById('addTxnBtn').addEventListener('click', () => {
      const blank = normalizeHistoryItem(
        window.wfHistoryGen
          ? window.wfHistoryGen.emptyTransaction()
          : { date: '', merchant: '', type: 'Card Purchase', amount: '-$0.00', flow: 'debit' }
      );
      blank.flow = 'debit';
      blank.amount = formatTxnAmount(blank.amount || '0', 'debit');
      historyItems.unshift(blank);
      txnPage = 1;
      renderHistoryEditor();
    });

    els.txnSearch.addEventListener('input', () => {
      txnSearch = els.txnSearch.value;
      txnPage = 1;
      renderHistoryEditor();
    });

    els.txnPageSize.addEventListener('change', () => {
      txnPageSize = Number(els.txnPageSize.value) || 25;
      txnPage = 1;
      renderHistoryEditor();
    });

    els.txnPaginationPages.addEventListener('click', (event) => {
      const btn = event.target.closest('[data-txn-page]');
      if (!btn || btn.disabled) return;
      const page = Number(btn.getAttribute('data-txn-page'));
      if (!page || page === txnPage) return;
      txnPage = page;
      renderHistoryEditor();
    });

    els.historyTableBody.addEventListener('input', (event) => {
      const row = event.target.closest('tr[data-txn-index]');
      if (!row) return;
      const index = Number(row.getAttribute('data-txn-index'));
      const key = event.target.getAttribute('data-txn-k');
      if (!historyItems[index] || !key || key === 'pending' || key === 'flow' || key === 'type') return;
      if (key === 'amount') {
        const flow = detectTxnFlow(historyItems[index]);
        historyItems[index].amount = formatTxnAmount(event.target.value, flow);
        historyItems[index].flow = flow;
      } else {
        historyItems[index][key] = event.target.value;
      }
      syncHistoryJson();
    });

    els.historyTableBody.addEventListener('change', (event) => {
      const row = event.target.closest('tr[data-txn-index]');
      if (!row) return;
      const index = Number(row.getAttribute('data-txn-index'));
      const key = event.target.getAttribute('data-txn-k');
      if (!historyItems[index] || !key) return;

      if (key === 'pending') {
        if (event.target.checked) historyItems[index].pending = true;
        else delete historyItems[index].pending;
        syncHistoryJson();
        return;
      }

      if (key === 'type') {
        historyItems[index].type = event.target.value;
        syncHistoryJson();
        return;
      }

      if (key === 'flow') {
        const flow = event.target.value === 'credit' ? 'credit' : 'debit';
        historyItems[index].flow = flow;
        historyItems[index].amount = formatTxnAmount(historyItems[index].amount || '0', flow);
        const amountInput = row.querySelector('[data-txn-k="amount"]');
        if (amountInput) amountInput.value = absoluteAmountDisplay(historyItems[index].amount);
        syncHistoryJson();
      }
    });

    els.historyTableBody.addEventListener('click', async (event) => {
      const remove = event.target.closest('[data-txn-remove]');
      if (!remove) return;
      const index = Number(remove.getAttribute('data-txn-remove'));
      if (Number.isNaN(index)) return;
      const ok = await askConfirm(
        'Delete transaction?',
        'Are you sure you want to delete this transaction?'
      );
      if (!ok) return;
      historyItems.splice(index, 1);
      renderHistoryEditor();
    });

    els.historyJson.addEventListener('change', () => {
      try {
        const parsed = JSON.parse(els.historyJson.value || '[]');
        if (!Array.isArray(parsed)) throw new Error('not array');
        historyItems = parsed;
        txnPage = 1;
        renderHistoryEditor();
      } catch (e) {
        toast('History JSON is invalid.', 'error');
      }
    });

    document.getElementById('memberSince').addEventListener('change', async () => {
      if (isNewCustomer && historyItems.length) {
        const ok = await askConfirm(
          'Update history?',
          'Are you sure you want to update generated history to match the new Since date?'
        );
        if (ok) generateHistoryFromSince(true);
      }
    });

    document.body.addEventListener('click', (event) => {
      const edit = event.target.closest('[data-edit]');
      if (edit) {
        const user = customersCache.find((u) => u.id === edit.getAttribute('data-edit'));
        if (user) openEditor(user);
        return;
      }
      const del = event.target.closest('[data-delete]');
      if (del) {
        deleteCustomer(del.getAttribute('data-delete'));
      }
    });

    document.querySelectorAll('.password-toggle').forEach((btn) => {
      btn.addEventListener('click', () => {
        const input = document.getElementById(btn.getAttribute('data-target'));
        if (!input) return;
        const hiding = input.type === 'text';
        input.type = hiding ? 'password' : 'text';
        btn.innerHTML = hiding ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
        btn.setAttribute('aria-label', hiding ? 'Show password' : 'Hide password');
      });
    });
  }

  async function refreshSessionsQuietly() {
    try {
      await refreshCustomers();
      renderOverview();
      renderUsersPage();
      const editId = getEditingCustomerId();
      renderEditorSwitcher(editId);
      if (editId) {
        const current = customersCache.find((u) => u.id === editId);
        if (current) updateEditorPresence(current);
      }
    } catch (e) {
      // ignore background refresh errors
    }
  }

  function startSessionRefresh() {
    if (sessionRefreshTimer) clearInterval(sessionRefreshTimer);
    sessionRefreshTimer = setInterval(refreshSessionsQuietly, SESSION_REFRESH_MS);
  }

  async function boot() {
    applySidebarCollapsed(localStorage.getItem(SIDEBAR_KEY) === '1');
    bindUi();
    setBoot(true);
    try {
      const ok = await ensureAuth();
      if (!ok) return;
      await refreshCustomers();
      renderOverview();
      renderUsersPage();
      fillForm({});
      setSection('overview');
      startSessionRefresh();
    } catch (err) {
      toast(err.message || 'Failed to load admin.', 'error');
    } finally {
      setBoot(false);
      document.documentElement.classList.remove('admin-session-pending');
    }
  }

  boot();
})();
