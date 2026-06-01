(function () {
  const KEY = 'wf_logged_in';
  const PROTECTED_PAGES = new Set([
    'dashboard.html',
    'account.html',
    'profile.html',
    'card.html',
    'transfer.html',
    'history.html',
  ]);

  function currentPage() {
    const path = window.location.pathname || '';
    const page = path.split('/').pop();
    return page || 'index.html';
  }

  function isLoggedIn() {
    return localStorage.getItem(KEY) === '1';
  }

  function login() {
    localStorage.setItem(KEY, '1');
    localStorage.removeItem('pendingTransfer');
  }

  function logout() {
    localStorage.removeItem(KEY);
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

  window.wfAuth = { isLoggedIn, login, logout, requireAuth };

  if (PROTECTED_PAGES.has(currentPage())) {
    requireAuth();
  }
})();
