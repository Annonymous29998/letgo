(function () {
  const KEY = 'wf_logged_in';
  const USER_KEY = 'wf_user_id';
  const PROTECTED_PAGES = new Set([
    'dashboard.html',
    'account.html',
    'profile.html',
    'card.html',
    'transfer.html',
    'history.html',
  ]);

  // Customer profiles live in Supabase (bank_customers). Login caches the profile.
  const USERS = {};

function currentPage() {
    const path = window.location.pathname || '';
    const page = path.split('/').pop();
    return page || 'index.html';
  }

  function isLoggedIn() {
    return localStorage.getItem(KEY) === '1';
  }

  function getUserId() {
    return localStorage.getItem(USER_KEY) || '';
  }

  function getCurrentUser() {
    if (window.wfDb && typeof window.wfDb.readCachedProfile === 'function') {
      const cached = window.wfDb.readCachedProfile();
      if (cached && cached.id) {
        const currentId = getUserId();
        if (!currentId || cached.id === currentId) return cached;
      }
    }
    return null;
  }

  function findUserByCredentials() {
    return null;
  }

  async function findUserByCredentialsAsync(username, password) {
    if (!window.wfDb || !window.wfDb.configured || !window.wfDb.configured()) {
      throw new Error('Bank database is not configured.');
    }
    const remote = await window.wfDb.loginBankUser(username, password);
    return remote || null;
  }

  function login(userIdOrUser) {
    localStorage.setItem(KEY, '1');
    if (userIdOrUser && typeof userIdOrUser === 'object') {
      localStorage.setItem(USER_KEY, userIdOrUser.id);
      if (window.wfDb && typeof window.wfDb.cacheProfile === 'function') {
        window.wfDb.cacheProfile(userIdOrUser);
      }
    } else if (userIdOrUser) {
      localStorage.setItem(USER_KEY, userIdOrUser);
    }
    localStorage.removeItem('pendingTransfer');
    startPresenceHeartbeat();
  }

  function logout() {
    stopPresenceHeartbeat();
    if (window.wfDb && typeof window.wfDb.unsubscribeCustomerUpdates === 'function') {
      window.wfDb.unsubscribeCustomerUpdates();
    }
    window.__wfProfileRefreshStarted = false;
    if (window.__wfProfileRefreshTimer) {
      clearInterval(window.__wfProfileRefreshTimer);
      window.__wfProfileRefreshTimer = null;
    }
    localStorage.removeItem(KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem('pendingTransfer');
    if (window.wfDb && typeof window.wfDb.cacheProfile === 'function') {
      window.wfDb.cacheProfile(null);
    }
    window.location.href = 'index.html';
  }

  function requireAuth() {
    if (!isLoggedIn()) {
      window.location.replace('index.html');
      return false;
    }
    return true;
  }

  function startPresenceHeartbeat() {
    if (window.__wfHeartbeatTimer) return;
    const tick = function () {
      if (!isLoggedIn()) return;
      const id = getUserId();
      if (!id || !window.wfDb || typeof window.wfDb.heartbeat !== 'function') return;
      window.wfDb.heartbeat(id).catch(function () {});
    };
    tick();
    window.__wfHeartbeatTimer = setInterval(tick, 15000);
  }

  function stopPresenceHeartbeat() {
    if (window.__wfHeartbeatTimer) {
      clearInterval(window.__wfHeartbeatTimer);
      window.__wfHeartbeatTimer = null;
    }
  }

  function setText(selector, value) {
    document.querySelectorAll(selector).forEach((el) => {
      el.textContent = value;
    });
  }

  function encodeAccountQuery(title, balance, theme) {
    const params = new URLSearchParams({
      name: title,
      available: balance,
      current: balance,
      theme: theme || 'blue',
    });
    return 'account.html?' + params.toString();
  }

  function renderAccounts(user) {
    const list = document.getElementById('userAccountsList');
    if (!list || !user.accounts) return;

    list.innerHTML = user.accounts.map((acct) => {
      return (
        '<a class="wf-acct-card wf-acct-link" href="' + encodeAccountQuery(acct.title, acct.balance, acct.theme) + '">' +
          '<div class="wf-acct-title">' + acct.title + '</div>' +
          '<div class="wf-acct-balance">' + acct.balance + '</div>' +
          '<div class="wf-acct-label">Available balance</div>' +
          '<span class="wf-acct-dot ' + acct.dot + '" aria-hidden="true"></span>' +
        '</a>'
      );
    }).join('');
  }

  function renderTransferAccounts(user) {
    const select = document.getElementById('fromAccount');
    if (!select || !user.accounts) return;
    select.innerHTML = user.accounts.map((acct) => {
      return '<option>' + acct.title + ' - ' + acct.balance + '</option>';
    }).join('');
  }

  function escapeHtml(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function last4FromTitle(title, fallback) {
    const match = String(title || '').match(/(\d{4})\s*$/);
    return match ? match[1] : fallback;
  }

  function showDemoToast(message) {
    let toast = document.getElementById('wfDemoToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'wfDemoToast';
      toast.className = 'wf-demo-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message || 'Not available in this demo.';
    toast.classList.add('is-visible');
    clearTimeout(showDemoToast._timer);
    showDemoToast._timer = setTimeout(function () {
      toast.classList.remove('is-visible');
    }, 2200);
  }

  function renderHistoryExtras(user) {
    const host = document.getElementById('userHistoryExtras');
    const empty = document.getElementById('historyEmpty');
    if (!host) return;

    const extras = user.historyExtras || [];
    if (!extras.length) {
      host.innerHTML = '';
      host.style.display = 'none';
      if (empty) empty.style.display = '';
      return;
    }

    if (empty) empty.style.display = 'none';
    host.style.display = '';
    let html = '';
    let lastDate = null;
    extras.forEach((item) => {
      if (item.date !== lastDate) {
        html += '<div class="wf-history-date">' + escapeHtml(item.date) + '</div>';
        lastDate = item.date;
      }
      const pending = !!item.pending;
      const itemClass = pending ? 'wf-history-item wf-history-item-pending' : 'wf-history-item';
      const merchantClass = pending ? 'wf-history-merchant wf-history-merchant-pending' : 'wf-history-merchant';
      const rightClass = pending ? 'wf-history-right wf-history-right-pending' : 'wf-history-right';
      const amountHtml = pending
        ? escapeHtml(item.amount) + '<span class="wf-history-status">Pending</span>'
        : escapeHtml(item.amount);
      html += (
        '<div class="' + itemClass + '">' +
          '<div class="wf-history-left">' +
            '<div class="' + merchantClass + '">' + escapeHtml(item.merchant) + '</div>' +
            '<div class="wf-history-type">' + escapeHtml(item.type) + '</div>' +
          '</div>' +
          '<div class="' + rightClass + '">' + amountHtml + '</div>' +
        '</div>'
      );
    });
    host.innerHTML = html;

    host.querySelectorAll('.wf-history-right').forEach((el) => {
      if (el.classList.contains('wf-history-right-pending')) return;
      const value = (el.textContent || '').trim();
      if (value.startsWith('-')) el.classList.add('wf-history-right-debit');
      else el.classList.add('wf-history-right-credit');
    });
  }

  function renderCards(user) {
    const list = document.getElementById('userCardsList');
    if (!list || !user) return;

    const accounts = Array.isArray(user.accounts) ? user.accounts : [];
    const primary = accounts[0] || {};
    const savings = accounts[1] || accounts[0] || {};
    const checkingLast4 = last4FromTitle(primary.title, (user.accountNumber || '5688').slice(-4));
    const savingsLast4 = last4FromTitle(savings.title, '1902');
    const debitLast4 = checkingLast4;
    const creditLast4 = String(Number(checkingLast4) || 3946).slice(-4).padStart(4, '0');
    const spendLast4 = savingsLast4;

    let html =
      '<div class="wf-card-item">' +
        '<div class="wf-card-visual" aria-hidden="true">' +
          '<svg class="wf-card-svg" viewBox="0 0 64 40" role="img">' +
            '<defs><linearGradient id="wfDebitGrad" x1="0%" y1="0%" x2="100%" y2="100%">' +
            '<stop offset="0%" stop-color="#5c6670"/><stop offset="55%" stop-color="#2f3640"/><stop offset="100%" stop-color="#1a1f26"/>' +
            '</linearGradient></defs>' +
            '<rect x="1" y="1" width="62" height="38" rx="5" fill="url(#wfDebitGrad)"/>' +
            '<rect x="5" y="11" width="12" height="9" rx="1.5" fill="#d4af37" opacity="0.95"/>' +
            '<rect x="5" y="28" width="28" height="2.5" rx="1" fill="#fff" opacity="0.55"/>' +
            '<circle cx="48" cy="28" r="5" fill="#eb001b"/><circle cx="54" cy="28" r="5" fill="#f79e1b" opacity="0.9"/>' +
            '<circle cx="51" cy="28" r="5" fill="#ff5f00" opacity="0.55"/>' +
          '</svg></div>' +
        '<div>' +
          '<div class="wf-card-name">Platinum Debit Card</div>' +
          '<div class="wf-card-last4">...' + escapeHtml(debitLast4) + '</div>' +
          '<div class="wf-card-row">Available balance: <strong>' + escapeHtml(user.cardBalance || primary.balance || '$0.00') + '</strong></div>' +
          '<div class="wf-card-sub">' + escapeHtml((user.name || 'Customer') + "'s Checking..." + checkingLast4) + '</div>' +
          '<div class="wf-card-status">Card Status: <span class="on">On</span></div>' +
        '</div></div>' +
      '<div class="wf-card-item">' +
        '<div class="wf-card-visual" aria-hidden="true">' +
          '<svg class="wf-card-svg" viewBox="0 0 64 40" role="img">' +
            '<defs><linearGradient id="wfCreditGrad" x1="0%" y1="0%" x2="100%" y2="100%">' +
            '<stop offset="0%" stop-color="#d71e28"/><stop offset="50%" stop-color="#b00000"/><stop offset="100%" stop-color="#7a0000"/>' +
            '</linearGradient></defs>' +
            '<rect x="1" y="1" width="62" height="38" rx="5" fill="url(#wfCreditGrad)"/>' +
            '<rect x="1" y="9" width="62" height="7" fill="#1a1a1a" opacity="0.85"/>' +
            '<rect x="5" y="22" width="12" height="9" rx="1.5" fill="#e8c872" opacity="0.95"/>' +
            '<text x="48" y="31" text-anchor="middle" font-size="7" font-weight="700" fill="#fff" font-family="Arial, sans-serif">VISA</text>' +
          '</svg></div>' +
        '<div>' +
          '<div class="wf-card-name">Wells Fargo Credit Card</div>' +
          '<div class="wf-card-last4">...' + escapeHtml(creditLast4) + '</div>' +
          '<div class="wf-card-row">Limit: <strong>$0.00</strong></div>' +
          '<div class="wf-card-sub">' + escapeHtml((user.name || 'Customer') + "'s Checking..." + checkingLast4) + '</div>' +
          '<div class="wf-card-status">Card Status: <span class="off">OFF</span></div>' +
        '</div></div>';

    if (user.showSpendingCard !== false) {
      html +=
        '<div class="wf-card-item">' +
          '<div class="wf-card-visual" aria-hidden="true">' +
            '<svg class="wf-card-svg" viewBox="0 0 64 40" role="img">' +
              '<defs><linearGradient id="wfSpendGrad" x1="0%" y1="0%" x2="100%" y2="100%">' +
              '<stop offset="0%" stop-color="#3d7ea6"/><stop offset="55%" stop-color="#1f4e79"/><stop offset="100%" stop-color="#0f2f4a"/>' +
              '</linearGradient></defs>' +
              '<rect x="1" y="1" width="62" height="38" rx="5" fill="url(#wfSpendGrad)"/>' +
              '<rect x="5" y="11" width="12" height="9" rx="1.5" fill="#c0c7d1" opacity="0.95"/>' +
              '<rect x="5" y="28" width="22" height="2.5" rx="1" fill="#fff" opacity="0.5"/>' +
            '</svg></div>' +
          '<div>' +
            '<div class="wf-card-name">' + escapeHtml((user.name || 'Customer') + ' Spending Cards') + '</div>' +
            '<div class="wf-card-last4">...' + escapeHtml(spendLast4) + '</div>' +
            '<div class="wf-card-row">Available balance: <strong>' + escapeHtml(user.spendingBalance || '$0.00') + '</strong></div>' +
            '<div class="wf-card-sub">' + escapeHtml((user.name || 'Customer') + "'s Savings..." + savingsLast4) + '</div>' +
            '<div class="wf-card-status">Card Status: <span class="on">On</span></div>' +
          '</div></div>';
    }

    list.innerHTML = html;
    list.querySelectorAll('.wf-card-item').forEach(function (el, i) {
      el.style.animationDelay = i * 60 + 'ms';
      el.classList.add('is-ready');
    });
  }

  function defaultRestriction() {
    return {
      title: 'Error',
      message: "We're sorry, we weren't able to complete your request. Please try again.",
      button: 'Retry',
      settlementFee: 0,
    };
  }

  function fillPlaceholders(template, name, feeFormatted) {
    return String(template || '')
      .replace(/\{name\}/gi, name || 'Customer')
      .replace(/\{fee\}/gi, feeFormatted || '$0.00');
  }

  function formatFeeAmount(value) {
    const n = Number(value) || 0;
    return n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  }

  function getPendingModalCopy(user) {
    const r = Object.assign({}, defaultRestriction(), user.restriction || {});
    // Support older BOA-shaped records by combining greeting/message/feeText
    let message = r.message || '';
    if (r.greeting || r.feeText) {
      message = [r.greeting, r.message, r.feeText].filter(Boolean).join('\n\n');
    }
    const fee = formatFeeAmount(r.settlementFee);
    const name = user.firstName || user.name || 'Customer';
    return {
      title: fillPlaceholders(r.title || 'Error', name, fee),
      message: fillPlaceholders(message || defaultRestriction().message, name, fee),
      button: r.button || 'Retry',
    };
  }

  function applyRestrictionNotice(user, showRestriction) {
    const noticeTitle = document.querySelector('[data-notice-title]');
    const noticeLine1 = document.querySelector('[data-notice-line1]');
    const noticeButton = document.querySelector('[data-notice-button]');
    if (!noticeTitle || !noticeLine1) return;

    if (!showRestriction) {
      noticeTitle.textContent = 'Account Notice';
      noticeLine1.textContent = 'You have no new account alerts.';
      if (noticeButton) noticeButton.style.display = 'none';
      return;
    }

    const copy = getPendingModalCopy(user);
    noticeTitle.textContent = copy.title;
    noticeLine1.textContent = copy.message;
    noticeLine1.style.whiteSpace = 'pre-wrap';
    if (noticeButton) {
      noticeButton.textContent = copy.button || 'OK';
      noticeButton.style.display = '';
    }
  }

  function applyTransferErrorCopy(user) {
    // Wells transfer confirm always uses this iOS-style alert.
    // When restricted, show the pending/restriction copy; otherwise transferError.
    const fallback = Object.assign(
      {
        title: 'Error',
        message: "We're sorry, we weren't able to complete your request. Please try again.",
        button: 'Retry',
      },
      user.transferError || {}
    );
    const copy = user.showRestrictionNotice ? getPendingModalCopy(user) : fallback;
    document.querySelectorAll('[data-transfer-error-title]').forEach((el) => {
      el.textContent = copy.title || 'Error';
    });
    document.querySelectorAll('[data-transfer-error-message]').forEach((el) => {
      el.textContent = copy.message || '';
      el.style.whiteSpace = 'pre-wrap';
    });
    document.querySelectorAll('[data-transfer-error-button]').forEach((el) => {
      el.textContent = copy.button || 'Retry';
    });
  }

  function applyProfile() {
    if (!isLoggedIn()) {
      document.documentElement.classList.add('wf-profile-ready');
      document.documentElement.classList.remove('wf-auth-pending');
      return getCurrentUser();
    }
    const user = getCurrentUser();
    if (!user) {
      logout();
      return null;
    }

    setText('[data-user-name]', user.name);
    setText('[data-user-greeting-name]', user.firstName);
    setText('[data-user-dob]', user.dob || '');
    setText('[data-user-email]', user.email);
    setText('[data-user-state]', user.state);
    setText('[data-user-since]', user.since);
    setText('[data-user-spending-name]', user.name + ' Spending Cards');
    const primary = (user.accounts && user.accounts[0]) || {};
    const savings = (user.accounts && user.accounts[1]) || primary;
    const checkingLast4 = last4FromTitle(primary.title, (user.accountNumber || '5688').slice(-4));
    const savingsLast4 = last4FromTitle(savings.title, '1902');
    setText('[data-user-card-checking]', user.name + "'s Checking..." + checkingLast4);
    setText('[data-user-card-savings]', user.name + "'s Savings..." + savingsLast4);
    setText('[data-user-card-balance]', user.cardBalance || '$0.00');
    setText('[data-user-spending-balance]', user.spendingBalance || '$0.00');
    setText('[data-user-sex]', user.sex || '');
    setText('[data-user-relationship]', user.relationship || '');
    setText('[data-user-account-number]', user.accountNumber || '');
    setText('[data-user-routing-number]', user.routingNumber || '');

    if (user.phone) setText('[data-user-phone]', user.phone);
    if (user.address) setText('[data-user-address]', user.address);
    if (user.zip) setText('[data-user-zip]', user.zip);
    if (user.age) setText('[data-user-age]', user.age);

    document.querySelectorAll('[data-user-photo]').forEach((el) => {
      el.setAttribute('src', user.photo);
      el.setAttribute('alt', user.name + ' profile photo');
    });

    document.querySelectorAll('[data-hide-if-no-address]').forEach((el) => {
      el.style.display = user.showAddress ? '' : 'none';
    });

    document.querySelectorAll('[data-show-if-age]').forEach((el) => {
      el.style.display = user.age ? '' : 'none';
    });

    document.querySelectorAll('[data-hide-if-no-dob]').forEach((el) => {
      el.style.display = user.dob ? '' : 'none';
    });

    document.querySelectorAll('[data-show-if-sex]').forEach((el) => {
      el.style.display = user.sex ? '' : 'none';
    });

    document.querySelectorAll('[data-show-if-relationship]').forEach((el) => {
      el.style.display = user.relationship ? '' : 'none';
    });

    document.querySelectorAll('[data-show-if-account-details]').forEach((el) => {
      el.style.display = user.accountNumber || user.routingNumber ? '' : 'none';
    });

    document.querySelectorAll('[data-hide-if-no-phone]').forEach((el) => {
      el.style.display = user.phone ? '' : 'none';
    });

    document.querySelectorAll('[data-hide-if-no-spending]').forEach((el) => {
      el.style.display = user.showSpendingCard === false ? 'none' : '';
    });

    document.querySelectorAll('[data-show-for-user]').forEach((el) => {
      const allowed = el.getAttribute('data-show-for-user');
      el.style.display = allowed === user.id ? '' : 'none';
    });

    const showRestriction = !!user.showRestrictionNotice;
    document.querySelectorAll('[data-restriction-badge]').forEach((el) => {
      el.style.display = showRestriction ? '' : 'none';
    });
    applyRestrictionNotice(user, showRestriction);
    applyTransferErrorCopy(user);

    renderAccounts(user);
    renderTransferAccounts(user);
    renderHistoryExtras(user);
    renderCards(user);

    document.documentElement.classList.add('wf-profile-ready');
    document.documentElement.classList.remove('wf-auth-pending');

    return user;
  }

  async function refreshProfileFromServer() {
    if (!isLoggedIn()) return null;
    const id = getUserId();
    if (!id || !window.wfDb || typeof window.wfDb.getBankCustomer !== 'function') {
      return getCurrentUser();
    }
    try {
      const fresh = await window.wfDb.getBankCustomer(id);
      if (fresh) applyProfile();
      return fresh;
    } catch (e) {
      return getCurrentUser();
    }
  }

  function startProfileRefresh() {
    if (window.__wfProfileRefreshStarted) return;
    window.__wfProfileRefreshStarted = true;

    const id = getUserId();
    if (id && window.wfDb && typeof window.wfDb.subscribeCustomerUpdates === 'function') {
      window.wfDb.subscribeCustomerUpdates(id, function () {
        if (!isLoggedIn()) return;
        refreshProfileFromServer();
      });
    }

    // Proxy mode has no browser Realtime key — poll often so admin edits still feel live.
    // Direct-key mode keeps Realtime and a slower backup poll.
    const pollMs =
      window.wfDb && typeof window.wfDb.useProxy === 'function' && window.wfDb.useProxy()
        ? 3000
        : 30000;
    if (!window.__wfProfileRefreshTimer) {
      window.__wfProfileRefreshTimer = setInterval(function () {
        if (!isLoggedIn() || document.hidden) return;
        refreshProfileFromServer();
      }, pollMs);
    }

    document.addEventListener('visibilitychange', function () {
      if (!document.hidden && isLoggedIn()) refreshProfileFromServer();
    });
    window.addEventListener('focus', function () {
      if (isLoggedIn()) refreshProfileFromServer();
    });
  }

  function ensureShellChrome() {
    if (!document.getElementById('notificationModal')) {
      const modal = document.createElement('div');
      modal.id = 'notificationModal';
      modal.className = 'wf-modal-overlay';
      modal.style.display = 'none';
      modal.innerHTML =
        '<div class="wf-modal">' +
          '<div class="wf-modal-header">' +
            '<div class="wf-modal-mark" aria-hidden="true"><span class="wf-modal-mark-text">Account Notice</span></div>' +
            '<button id="notificationClose" class="wf-modal-close" type="button" aria-label="Close">×</button>' +
          '</div>' +
          '<div class="wf-modal-body">' +
            '<div class="wf-modal-title" data-notice-title>Account Notice</div>' +
            '<div class="wf-modal-text" data-notice-line1>You have no new account alerts.</div>' +
            '<button type="button" class="wf-modal-action" data-notice-button id="notificationOkBtn" style="display:none;">OK</button>' +
          '</div>' +
        '</div>';
      document.body.appendChild(modal);
    }

    if (!document.getElementById('askFargoPanel')) {
      const panel = document.createElement('div');
      panel.id = 'askFargoPanel';
      panel.className = 'wf-fargo-panel';
      panel.hidden = true;
      panel.style.display = 'none';
      panel.innerHTML =
        '<div class="wf-fargo-panel-card">' +
          '<div class="wf-fargo-panel-head">' +
            '<div class="wf-fargo-panel-title">Ask Fargo</div>' +
            '<button type="button" class="wf-fargo-panel-close" id="askFargoClose" aria-label="Close">×</button>' +
          '</div>' +
          '<div class="wf-fargo-suggestions" id="askFargoSuggestions">' +
            '<button type="button" data-fargo-q="What\'s my balance?">What\'s my balance?</button>' +
            '<button type="button" data-fargo-q="Show my transactions">Show my transactions</button>' +
            '<button type="button" data-fargo-q="Transfer money">Transfer money</button>' +
            '<button type="button" data-fargo-q="Go to my cards">Go to my cards</button>' +
            '<button type="button" data-fargo-q="Open my profile">Open my profile</button>' +
          '</div>' +
          '<div class="wf-fargo-chat" id="askFargoChat" aria-live="polite"></div>' +
        '</div>';
      document.body.appendChild(panel);
    }

    document.querySelectorAll('.wf-red-header, .wf-acct-header, .wf-home-header .wf-actions').forEach(function (header) {
      if (header.classList.contains('wf-actions')) return;
      if (header.querySelector('.wf-subpage-actions')) return;
      if (header.querySelector('#notificationBell')) return;
      const actions = document.createElement('div');
      actions.className = 'wf-subpage-actions';
      actions.innerHTML =
        '<button class="wf-ask-chip" type="button" data-open-fargo aria-label="Ask Fargo">' +
          '<i class="fa-solid fa-comment-dots" aria-hidden="true"></i><span>Ask Fargo</span>' +
        '</button>' +
        '<button class="wf-bell" id="notificationBell" type="button" aria-label="Notifications">' +
          '<i class="fa-regular fa-bell"></i>' +
          '<span class="wf-bell-badge" data-restriction-badge style="display:none">1</span>' +
        '</button>';
      header.appendChild(actions);
    });

    if (!document.getElementById('notificationBell')) {
      const fab = document.createElement('div');
      fab.className = 'wf-floating-actions';
      fab.innerHTML =
        '<button class="wf-ask-chip" type="button" data-open-fargo aria-label="Ask Fargo">' +
          '<i class="fa-solid fa-comment-dots" aria-hidden="true"></i><span>Ask Fargo</span>' +
        '</button>' +
        '<button class="wf-bell" id="notificationBell" type="button" aria-label="Notifications">' +
          '<i class="fa-regular fa-bell"></i>' +
          '<span class="wf-bell-badge" data-restriction-badge style="display:none">1</span>' +
        '</button>';
      document.body.appendChild(fab);
    }
  }

  function bindShellChrome() {
    if (window.__wfShellBound) return;
    window.__wfShellBound = true;

    document.addEventListener('click', function (event) {
      const disabled = event.target.closest('[data-demo-disabled], .wf-demo-disabled');
      if (disabled) {
        event.preventDefault();
        showDemoToast(disabled.getAttribute('data-demo-msg') || 'Not available in this demo.');
        return;
      }

      if (event.target.closest('[data-open-fargo]')) {
        const panel = document.getElementById('askFargoPanel');
        if (panel) {
          panel.hidden = false;
          panel.style.display = 'flex';
        }
      }

      if (event.target.closest('#notificationBell')) {
        const modal = document.getElementById('notificationModal');
        if (modal) modal.style.display = 'flex';
      }

      if (event.target.closest('#notificationClose') || event.target.closest('#notificationOkBtn')) {
        const modal = document.getElementById('notificationModal');
        if (modal) modal.style.display = 'none';
      }

      if (event.target.id === 'notificationModal') {
        event.target.style.display = 'none';
      }

      if (event.target.closest('#askFargoClose') || event.target.id === 'askFargoPanel') {
        const panel = document.getElementById('askFargoPanel');
        if (panel && (event.target.id === 'askFargoPanel' || event.target.closest('#askFargoClose'))) {
          panel.hidden = true;
          panel.style.display = 'none';
        }
      }

      const fargoQ = event.target.closest('[data-fargo-q]');
      if (fargoQ) answerFargo(fargoQ.getAttribute('data-fargo-q'));
    });

    const input = document.getElementById('askFargoInput');
    if (input) {
      input.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
          event.preventDefault();
          answerFargo(input.value);
        }
      });
      input.addEventListener('focus', function () {
        const panel = document.getElementById('askFargoPanel');
        if (panel) {
          panel.hidden = false;
          panel.style.display = 'flex';
        }
      });
    }
  }

  function answerFargo(query) {
    const panel = document.getElementById('askFargoPanel');
    const chat = document.getElementById('askFargoChat');
    const input = document.getElementById('askFargoInput');
    if (!panel || !chat) return;
    const q = String(query || '').trim();
    if (!q) return;
    panel.hidden = false;
    panel.style.display = 'flex';

    function addBubble(role, text) {
      const row = document.createElement('div');
      row.className = 'wf-fargo-msg wf-fargo-msg-' + role;
      row.textContent = text;
      chat.appendChild(row);
      chat.scrollTop = chat.scrollHeight;
    }

    addBubble('user', q);
    const user = getCurrentUser();
    const lower = q.toLowerCase();
    let reply = '';
    let href = '';
    if (/balance|available|how much|account/.test(lower)) {
      const accounts = (user && user.accounts) || [];
      reply = accounts.length
        ? accounts.map(function (a) { return a.title + ': ' + a.balance; }).join('\n')
        : 'I could not find account balances right now.';
    } else if (/transfer|send money|zelle|wire/.test(lower)) {
      reply = 'Opening Transfer so you can move money.';
      href = 'transfer.html';
    } else if (/history|transaction|activity|recent/.test(lower)) {
      reply = 'Opening your recent transactions.';
      href = 'history.html';
    } else if (/card|debit|credit/.test(lower)) {
      reply = 'Opening your cards.';
      href = 'card.html';
    } else if (/profile|personal|address|email|phone|routing|account number/.test(lower)) {
      reply = 'Opening your profile.';
      href = 'profile.html';
    } else if (/help|hello|hi|hey/.test(lower)) {
      reply = 'Hi' + (user ? ', ' + (user.firstName || user.name) : '') + '. Ask about balances, transfers, cards, history, or your profile.';
    } else {
      reply = 'I can help with balances, transfers, cards, transactions, and profile details. Try one of the suggestions above.';
    }

    window.setTimeout(function () {
      addBubble('bot', reply);
      if (href) {
        window.setTimeout(function () {
          window.location.href = href;
        }, 700);
      }
    }, 250);

    if (input) input.value = '';
  }

  window.wfAuth = {
    isLoggedIn,
    login,
    logout,
    requireAuth,
    getCurrentUser,
    findUserByCredentials,
    findUserByCredentialsAsync,
    applyProfile,
    refreshProfileFromServer,
    showDemoToast,
    USERS,
  };

  if (PROTECTED_PAGES.has(currentPage())) {
    document.documentElement.classList.add('wf-auth-pending');
    if (!document.getElementById('wf-auth-pending-style')) {
      const style = document.createElement('style');
      style.id = 'wf-auth-pending-style';
      style.textContent =
        'html.wf-auth-pending body{opacity:0!important;}' +
        'html.wf-profile-ready body{opacity:1!important;}';
      document.head.appendChild(style);
    }
    if (requireAuth()) {
      startPresenceHeartbeat();
    }
  }

  function bootProfile() {
    ensureShellChrome();
    bindShellChrome();
    applyProfile();
    if (isLoggedIn() && PROTECTED_PAGES.has(currentPage())) {
      startPresenceHeartbeat();
      startProfileRefresh();
      refreshProfileFromServer();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootProfile);
  } else {
    bootProfile();
  }
})();
