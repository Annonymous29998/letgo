(async function () {
  const form = document.getElementById('adminLoginForm');
  const errorEl = document.getElementById('loginError');
  const warnEl = document.getElementById('configWarn');
  const btn = document.getElementById('loginBtn');

  document.querySelectorAll('.password-toggle').forEach((toggle) => {
    toggle.addEventListener('click', () => {
      const input = document.getElementById(toggle.getAttribute('data-target'));
      if (!input) return;
      const show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      toggle.innerHTML = show ? '<i class="fas fa-eye-slash"></i>' : '<i class="fas fa-eye"></i>';
      toggle.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
    });
  });

  if (!window.wfDb || !window.wfDb.configured()) {
    warnEl.style.display = 'block';
  } else if (await window.wfDb.requireAdminSession()) {
    window.location.replace('app.html');
    return;
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    errorEl.textContent = '';

    if (!window.wfDb.configured()) {
      errorEl.textContent = 'Configure Supabase in js/supabase-config.js first.';
      return;
    }

    btn.disabled = true;
    btn.textContent = 'Signing in...';
    try {
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      const session = await window.wfDb.adminLogin(username, password);
      if (!session) {
        errorEl.textContent = 'Invalid admin username or password.';
        return;
      }
      window.location.href = 'app.html';
    } catch (err) {
      errorEl.textContent = err.message || 'Login failed.';
    } finally {
      btn.disabled = false;
      btn.textContent = 'Sign In';
    }
  });
})();
