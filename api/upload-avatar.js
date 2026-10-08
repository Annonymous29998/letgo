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

function extensionFromName(name, contentType) {
  const fromName = String(name || '').split('.').pop();
  if (fromName && fromName.length <= 5) return fromName.toLowerCase();
  if (contentType === 'image/png') return 'png';
  if (contentType === 'image/webp') return 'webp';
  if (contentType === 'image/gif') return 'gif';
  return 'jpg';
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
  const fileBase64 = String(body.fileBase64 || '');
  const contentType = String(body.contentType || 'image/jpeg');
  const fileName = String(body.fileName || 'photo.jpg');
  const customerId = String(body.customerId || 'tmp').replace(/[^a-zA-Z0-9_-]/g, '') || 'tmp';

  if (!fileBase64) {
    res.status(400).json({ error: 'Missing file data' });
    return;
  }

  const raw = fileBase64.includes(',') ? fileBase64.split(',').pop() : fileBase64;
  let buffer;
  try {
    buffer = Buffer.from(raw, 'base64');
  } catch (e) {
    res.status(400).json({ error: 'Invalid file data' });
    return;
  }

  if (!buffer.length || buffer.length > 4.5 * 1024 * 1024) {
    res.status(400).json({ error: 'File must be under 4.5MB' });
    return;
  }

  const ext = extensionFromName(fileName, contentType);
  const path = `${customerId}/${Date.now()}.${ext}`;

  try {
    const upstream = await fetch(
      `${supabaseUrl}/storage/v1/object/avatars/${path}`,
      {
        method: 'POST',
        headers: {
          apikey: anonKey,
          Authorization: 'Bearer ' + anonKey,
          'Content-Type': contentType,
          'x-upsert': 'true',
        },
        body: buffer,
      }
    );

    const text = await upstream.text();
    if (!upstream.ok) {
      res.status(upstream.status).json({ error: text || 'Upload failed' });
      return;
    }

    const publicUrl = `${supabaseUrl}/storage/v1/object/public/avatars/${path}`;
    res.status(200).json({ publicUrl });
  } catch (err) {
    res.status(502).json({ error: err.message || 'Upload failed' });
  }
};
