const ALLOWED_RPCS = new Set([
  'authenticate_bank_user',
  'bank_user_heartbeat',
  'get_bank_customer',
  'bank_user_record_transfer',
  'admin_login',
  'admin_logout',
  'admin_session_valid',
  'admin_list_customers',
  'admin_get_customer',
  'admin_upsert_customer',
  'admin_delete_customer',
]);

function allowedOrigin(req) {
  const host = req.headers.host || '';
  const origin = req.headers.origin || '';
  if (!origin) return true;
  try {
    return new URL(origin).host === host;
  } catch (e) {
    return false;
  }
}

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  if (!allowedOrigin(req)) {
    res.status(403).json({ error: 'Forbidden origin' });
    return;
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY;
  if (!supabaseUrl || !anonKey) {
    res.status(500).json({ error: 'Server is missing SUPABASE_URL / SUPABASE_ANON_KEY' });
    return;
  }

  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
  const name = String(body.name || '').trim();
  const args = body.args && typeof body.args === 'object' ? body.args : {};

  if (!name || !ALLOWED_RPCS.has(name)) {
    res.status(400).json({ error: 'RPC not allowed' });
    return;
  }

  try {
    const upstream = await fetch(`${supabaseUrl}/rest/v1/rpc/${encodeURIComponent(name)}`, {
      method: 'POST',
      headers: {
        apikey: anonKey,
        Authorization: 'Bearer ' + anonKey,
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      body: JSON.stringify(args),
    });

    const text = await upstream.text();
    let data = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch (e) {
      data = text;
    }

    if (!upstream.ok) {
      const message =
        data && typeof data === 'object'
          ? data.message || data.error || data.hint || JSON.stringify(data)
          : text || 'RPC failed';
      res.status(upstream.status).json({ error: message });
      return;
    }

    res.status(200).json({ data });
  } catch (err) {
    res.status(502).json({ error: err.message || 'Upstream request failed' });
  }
};
