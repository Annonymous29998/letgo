(function () {
  const PROFILE_KEY = 'wf_user_profile';
  const ADMIN_TOKEN_KEY = 'wf_admin_token';
  const ADMIN_META_KEY = 'wf_admin_meta';

  function cfg() {
    return window.WF_SUPABASE || {};
  }

  function useProxy() {
    const c = cfg();
    if (c.useProxy === false && c.url && c.anonKey) return false;
    if (c.url && c.anonKey && window.supabase && c.useProxy !== true) return false;
    return true;
  }

  function configured() {
    if (useProxy()) return true;
    const c = cfg();
    return !!(c.url && c.anonKey && window.supabase);
  }

  function client() {
    if (useProxy()) return null;
    const c = cfg();
    if (!c.url || !c.anonKey || !window.supabase) return null;
    if (!window.__wfSupabase) {
      window.__wfSupabase = window.supabase.createClient(c.url, c.anonKey);
    }
    return window.__wfSupabase;
  }

  async function callRpc(name, args) {
    if (useProxy()) {
      const res = await fetch('/api/rpc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name, args: args || {} }),
      });
      let json = null;
      try {
        json = await res.json();
      } catch (e) {
        json = null;
      }
      if (!res.ok) {
        throw new Error((json && json.error) || 'Request failed');
      }
      return json ? json.data : null;
    }

    const sb = client();
    if (!sb) throw new Error('Supabase is not configured');
    const { data, error } = await sb.rpc(name, args || {});
    if (error) throw error;
    return data;
  }

  function rowToUser(row) {
    if (!row) return null;
    // RPC authenticate returns camelCase already; table rows are snake_case
    if (row.full_name || row.photo_url !== undefined) {
      return {
        id: row.id,
        username: row.username,
        password: row.password,
        name: row.full_name,
        firstName: row.first_name || row.full_name,
        dob: row.dob || '',
        age: row.age || '',
        sex: row.sex || '',
        relationship: row.relationship || '',
        address: row.address || '',
        state: row.state || '',
        zip: row.zip || '',
        email: row.email || '',
        phone: row.phone || '',
        photo: row.photo_url || '',
        since: row.since_label || '',
        showAddress: !!row.show_address,
        accountNumber: row.account_number || '',
        routingNumber: row.routing_number || '',
        accounts: row.accounts || [],
        cardBalance: row.card_balance || '$0.00',
        spendingBalance: row.spending_balance || '$0.00',
        showSpendingCard: !!row.show_spending_card,
        showRestrictionNotice: !!row.show_restriction_notice,
        historyExtras: row.history_extras || [],
        restriction: row.restriction || null,
        transferError: row.transfer_error || null,
        lastLoginAt: row.last_login_at || null,
        lastActiveAt: row.last_active_at || null,
        lastUserAgent: row.last_user_agent || '',
      };
    }
    return {
      id: row.id,
      username: row.username,
      password: row.password,
      name: row.name,
      firstName: row.firstName || row.name,
      dob: row.dob || '',
      age: row.age || '',
      sex: row.sex || '',
      relationship: row.relationship || '',
      address: row.address || '',
      state: row.state || '',
      zip: row.zip || '',
      email: row.email || '',
      phone: row.phone || '',
      photo: row.photo || '',
      since: row.since || '',
      showAddress: !!row.showAddress,
      accountNumber: row.accountNumber || '',
      routingNumber: row.routingNumber || '',
      accounts: row.accounts || [],
      cardBalance: row.cardBalance || '$0.00',
      spendingBalance: row.spendingBalance || '$0.00',
      showSpendingCard: !!row.showSpendingCard,
      showRestrictionNotice: !!row.showRestrictionNotice,
      historyExtras: row.historyExtras || [],
      restriction: row.restriction || null,
      transferError: row.transferError || row.transfer_error || null,
      lastLoginAt: row.lastLoginAt || row.last_login_at || null,
      lastActiveAt: row.lastActiveAt || row.last_active_at || null,
      lastUserAgent: row.lastUserAgent || row.last_user_agent || '',
    };
  }

  function currentUserAgent() {
    try {
      return String(navigator.userAgent || '').slice(0, 512);
    } catch (e) {
      return '';
    }
  }

  function userToPayload(user) {
    const accounts = Array.isArray(user.accounts) ? user.accounts : [];
    const primary = accounts[0] || {};
    return {
      id: user.id || undefined,
      username: String(user.username || '').trim(),
      password: String(user.password || ''),
      full_name: String(user.name || user.full_name || '').trim(),
      first_name: String(user.firstName || user.first_name || user.name || '').trim(),
      dob: user.dob || '',
      age: user.age || '',
      sex: user.sex || '',
      relationship: user.relationship || '',
      address: user.address || '',
      state: user.state || '',
      zip: user.zip || '',
      email: user.email || '',
      phone: user.phone || '',
      photo_url: user.photo || user.photo_url || '',
      since_label: user.since || user.since_label || '',
      show_address: user.showAddress !== false && user.show_address !== false,
      account_number: user.accountNumber || user.account_number || '',
      routing_number: user.routingNumber || user.routing_number || '',
      accounts: accounts,
      card_balance: user.cardBalance || user.card_balance || primary.balance || '$0.00',
      spending_balance: user.spendingBalance || user.spending_balance || '$0.00',
      show_spending_card: !!(user.showSpendingCard || user.show_spending_card),
      show_restriction_notice: !!(user.showRestrictionNotice || user.show_restriction_notice),
      history_extras: Array.isArray(user.historyExtras)
        ? user.historyExtras
        : Array.isArray(user.history_extras)
          ? user.history_extras
          : [],
      restriction: user.restriction || undefined,
      transfer_error: user.transferError || user.transfer_error || undefined,
    };
  }

  function cacheProfile(user) {
    if (!user) {
      localStorage.removeItem(PROFILE_KEY);
      return;
    }
    localStorage.setItem(PROFILE_KEY, JSON.stringify(user));
  }

  function readCachedProfile() {
    try {
      const raw = localStorage.getItem(PROFILE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  async function loginBankUser(username, password) {
    if (!configured()) return null;
    const data = await callRpc('authenticate_bank_user', {
      p_username: username,
      p_password: password,
      p_user_agent: currentUserAgent(),
    });
    if (!data) return null;
    const user = rowToUser(data);
    cacheProfile(user);
    return user;
  }

  async function heartbeat(customerId) {
    if (!configured() || !customerId) return false;
    const data = await callRpc('bank_user_heartbeat', {
      p_customer_id: customerId,
      p_user_agent: currentUserAgent(),
    });
    return !!data;
  }

  async function getBankCustomer(customerId) {
    if (!configured() || !customerId) return null;
    const data = await callRpc('get_bank_customer', {
      p_customer_id: customerId,
    });
    if (!data) return null;
    const user = rowToUser(data);
    cacheProfile(user);
    return user;
  }

  async function recordTransfer(customerId, payload) {
    if (!configured() || !customerId) return null;
    const data = await callRpc('bank_user_record_transfer', {
      p_customer_id: customerId,
      p_payload: payload || {},
    });
    if (!data) return null;
    const user = rowToUser(data);
    cacheProfile(user);
    return user;
  }

  function unsubscribeCustomerUpdates() {
    const sb = client();
    if (!sb || !window.__wfCustomerChannel) return;
    try {
      sb.removeChannel(window.__wfCustomerChannel);
    } catch (e) {
      // ignore
    }
    window.__wfCustomerChannel = null;
  }

  function subscribeCustomerUpdates(customerId, onUpdate) {
    // Realtime needs a browser Supabase key; proxy mode relies on fast polling instead.
    const sb = client();
    if (!sb || !customerId || typeof onUpdate !== 'function') return null;

    unsubscribeCustomerUpdates();

    const topic = 'bank-customer:' + customerId;
    const channel = sb
      .channel(topic, { config: { broadcast: { self: false } } })
      .on('broadcast', { event: 'customer_updated' }, function () {
        onUpdate(customerId);
      })
      .subscribe();

    window.__wfCustomerChannel = channel;
    return channel;
  }

  async function adminLogin(username, password) {
    if (!configured()) throw new Error('Supabase is not configured');
    const data = await callRpc('admin_login', {
      p_username: username,
      p_password: password,
    });
    if (!data || !data.token) return null;
    localStorage.setItem(ADMIN_TOKEN_KEY, data.token);
    localStorage.setItem(
      ADMIN_META_KEY,
      JSON.stringify({
        username: data.username,
        displayName: data.displayName,
        expiresAt: data.expiresAt,
      })
    );
    return data;
  }

  function getAdminToken() {
    return localStorage.getItem(ADMIN_TOKEN_KEY) || '';
  }

  function getAdminMeta() {
    try {
      return JSON.parse(localStorage.getItem(ADMIN_META_KEY) || 'null');
    } catch (e) {
      return null;
    }
  }

  async function adminLogout() {
    const token = getAdminToken();
    if (configured() && token) {
      try {
        await callRpc('admin_logout', { p_token: token });
      } catch (e) {
        // ignore
      }
    }
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    localStorage.removeItem(ADMIN_META_KEY);
  }

  async function requireAdminSession() {
    const token = getAdminToken();
    if (!configured() || !token) return false;
    try {
      const data = await callRpc('admin_session_valid', { p_token: token });
      if (!data) {
        localStorage.removeItem(ADMIN_TOKEN_KEY);
        localStorage.removeItem(ADMIN_META_KEY);
        return false;
      }
      return true;
    } catch (e) {
      localStorage.removeItem(ADMIN_TOKEN_KEY);
      localStorage.removeItem(ADMIN_META_KEY);
      return false;
    }
  }

  async function listCustomers() {
    if (!configured()) throw new Error('Supabase is not configured');
    const token = getAdminToken();
    const data = await callRpc('admin_list_customers', { p_token: token });
    return (data || []).map(rowToUser);
  }

  async function getCustomer(id) {
    if (!configured()) throw new Error('Supabase is not configured');
    const token = getAdminToken();
    const data = await callRpc('admin_get_customer', {
      p_token: token,
      p_id: id,
    });
    return rowToUser(data);
  }

  async function upsertCustomer(user) {
    if (!configured()) throw new Error('Supabase is not configured');
    const token = getAdminToken();
    const payload = userToPayload(user);
    const data = await callRpc('admin_upsert_customer', {
      p_token: token,
      p_payload: payload,
    });
    return rowToUser(data);
  }

  async function deleteCustomer(id) {
    if (!configured()) throw new Error('Supabase is not configured');
    const token = getAdminToken();
    await callRpc('admin_delete_customer', {
      p_token: token,
      p_id: id,
    });
    return true;
  }

  function readFileAsDataUrl(file) {
    return new Promise(function (resolve, reject) {
      const reader = new FileReader();
      reader.onload = function () {
        resolve(String(reader.result || ''));
      };
      reader.onerror = function () {
        reject(new Error('Could not read file'));
      };
      reader.readAsDataURL(file);
    });
  }

  async function uploadAvatar(file, customerId) {
    if (!configured()) throw new Error('Supabase is not configured');

    if (useProxy()) {
      const dataUrl = await readFileAsDataUrl(file);
      const res = await fetch('/api/upload-avatar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileBase64: dataUrl,
          contentType: file.type || 'image/jpeg',
          fileName: file.name || 'photo.jpg',
          customerId: customerId || 'tmp',
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error((json && json.error) || 'Upload failed');
      return json.publicUrl;
    }

    const sb = client();
    if (!sb) throw new Error('Supabase is not configured');
    const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
    const path = `${customerId || 'tmp'}/${Date.now()}.${ext}`;
    const { error } = await sb.storage.from('avatars').upload(path, file, {
      upsert: true,
      contentType: file.type || 'image/jpeg',
    });
    if (error) throw error;
    const { data } = sb.storage.from('avatars').getPublicUrl(path);
    return data.publicUrl;
  }

  window.wfDb = {
    configured,
    useProxy,
    client,
    rowToUser,
    userToPayload,
    cacheProfile,
    readCachedProfile,
    loginBankUser,
    heartbeat,
    getBankCustomer,
    recordTransfer,
    subscribeCustomerUpdates,
    unsubscribeCustomerUpdates,
    adminLogin,
    adminLogout,
    getAdminToken,
    getAdminMeta,
    requireAdminSession,
    listCustomers,
    getCustomer,
    upsertCustomer,
    deleteCustomer,
    uploadAvatar,
    PROFILE_KEY,
  };
})();
