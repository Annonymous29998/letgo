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

  const USERS = {
    melissa: {
      id: 'melissa',
      username: 'Santiago1994',
      password: 'Santiamelissa2020$',
      name: 'Melissa Santiago',
      firstName: 'Melissa Santiago',
      dob: '06/04/1994',
      address: '4201 S W Young Dr',
      state: 'TX',
      zip: '76542',
      email: 'sm8565168@gmail.com',
      phone: '+1 (419) 318-6043',
      photo: 'images/melissa.png',
      since: 'Since April 2019',
      showAddress: true,
      accounts: [
        { title: 'Wells Fargo Way2Save Checking...3203', balance: '$263,385.00', theme: 'blue', dot: 'wf-dot-blue' },
        { title: 'Everyday Checking...5688', balance: '$802,751.00', theme: 'dark', dot: 'wf-dot-black' },
        { title: 'Wells Fargo Way2Save Savings...1902', balance: '$590,603.00', theme: 'blue', dot: 'wf-dot-blue' },
        { title: 'Wells Fargo Active Cash Card...7654', balance: '$65,307.00', theme: 'blue', dot: 'wf-dot-brown' },
      ],
      cardBalance: '$802,751.00',
      spendingBalance: '$590,603.00',
      showSpendingCard: true,
      historyExtras: [],
    },
    lynda: {
      id: 'lynda',
      username: 'Lyndakaren399',
      password: 'Passcode123$',
      name: 'Lynda Karen Jack',
      firstName: 'Lynda Karen Jack',
      dob: 'November 21 1994',
      age: '32',
      address: '',
      state: 'Nebraska',
      zip: '',
      email: '18010211058j@gmail.com',
      phone: '',
      photo: 'images/lynda.png',
      since: 'Since 2018',
      showAddress: false,
      accounts: [
        { title: 'Everyday Checking...5688', balance: '$3,750.00', theme: 'dark', dot: 'wf-dot-black' },
      ],
      cardBalance: '$3,750.00',
      spendingBalance: '$0.00',
      showSpendingCard: false,
      historyExtras: [
        {
          date: 'Sep 24, 2026',
          merchant: 'INCOMING WIRE',
          type: 'Wire Transfer',
          amount: '$120,000.00',
          pending: true,
        },
      ],
    },
  };

  function currentPage() {
    const path = window.location.pathname || '';
    const page = path.split('/').pop();
    return page || 'index.html';
  }

  function isLoggedIn() {
    return localStorage.getItem(KEY) === '1';
  }

  function getUserId() {
    return localStorage.getItem(USER_KEY) || 'melissa';
  }

  function getCurrentUser() {
    return USERS[getUserId()] || USERS.melissa;
  }

  function findUserByCredentials(username, password) {
    const u = String(username || '').trim();
    const p = String(password || '');
    return Object.values(USERS).find((user) => user.username === u && user.password === p) || null;
  }

  function login(userId) {
    localStorage.setItem(KEY, '1');
    if (userId && USERS[userId]) {
      localStorage.setItem(USER_KEY, userId);
    }
    localStorage.removeItem('pendingTransfer');
  }

  function logout() {
    localStorage.removeItem(KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem('pendingTransfer');
    window.location.href = 'index.html';
  }

  function requireAuth() {
    if (!isLoggedIn()) {
      window.location.replace('index.html');
      return false;
    }
    return true;
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

  function renderHistoryExtras(user) {
    const host = document.getElementById('userHistoryExtras');
    if (!host) return;

    const extras = user.historyExtras || [];
    if (!extras.length) {
      host.innerHTML = '';
      host.style.display = 'none';
      return;
    }

    host.style.display = '';
    host.innerHTML = extras.map((item) => {
      const pending = !!item.pending;
      const itemClass = pending ? 'wf-history-item wf-history-item-pending' : 'wf-history-item';
      const merchantClass = pending ? 'wf-history-merchant wf-history-merchant-pending' : 'wf-history-merchant';
      const rightClass = pending ? 'wf-history-right wf-history-right-pending' : 'wf-history-right';
      const amountHtml = pending
        ? item.amount + '<span class="wf-history-status">Pending</span>'
        : item.amount;
      return (
        '<div class="wf-history-date">' + item.date + '</div>' +
        '<div class="' + itemClass + '">' +
          '<div class="wf-history-left">' +
            '<div class="' + merchantClass + '">' + item.merchant + '</div>' +
            '<div class="wf-history-type">' + item.type + '</div>' +
          '</div>' +
          '<div class="' + rightClass + '">' + amountHtml + '</div>' +
        '</div>'
      );
    }).join('');

    host.querySelectorAll('.wf-history-right').forEach((el) => {
      if (el.classList.contains('wf-history-right-pending')) return;
      const value = (el.textContent || '').trim();
      if (value.startsWith('-')) el.classList.add('wf-history-right-debit');
      else el.classList.add('wf-history-right-credit');
    });
  }

  function applyProfile() {
    if (!isLoggedIn()) return getCurrentUser();
    const user = getCurrentUser();

    setText('[data-user-name]', user.name);
    setText('[data-user-greeting-name]', user.firstName);
    setText('[data-user-dob]', user.dob);
    setText('[data-user-email]', user.email);
    setText('[data-user-state]', user.state);
    setText('[data-user-since]', user.since);
    setText('[data-user-spending-name]', user.name + ' Spending Cards');
    setText('[data-user-card-checking]', user.name + "'s Checking...5688");
    setText('[data-user-card-savings]', user.name + "'s Savings...1902");
    setText('[data-user-card-balance]', user.cardBalance || '$0.00');
    setText('[data-user-spending-balance]', user.spendingBalance || '$0.00');

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

    document.querySelectorAll('[data-hide-if-no-phone]').forEach((el) => {
      el.style.display = user.phone ? '' : 'none';
    });

    document.querySelectorAll('[data-hide-if-no-spending]').forEach((el) => {
      el.style.display = user.showSpendingCard === false ? 'none' : '';
    });

    renderAccounts(user);
    renderTransferAccounts(user);
    renderHistoryExtras(user);

    return user;
  }

  window.wfAuth = {
    isLoggedIn,
    login,
    logout,
    requireAuth,
    getCurrentUser,
    findUserByCredentials,
    applyProfile,
    USERS,
  };

  if (PROTECTED_PAGES.has(currentPage())) {
    requireAuth();
  }

  document.addEventListener('DOMContentLoaded', applyProfile);
})();
