/**
 * Upsert Jamie Tanner into Supabase (photo + $52,500 + transfer hold / $4,300 fee).
 * Usage: node scripts/add-jamie.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

function loadEnv() {
  try {
    const raw = fs.readFileSync(path.join(root, '.env'), 'utf8');
    for (const line of raw.split('\n')) {
      const m = line.match(/^([^#=]+)=(.*)$/);
      if (!m) continue;
      const k = m[1].trim();
      const v = m[2].trim();
      if (!process.env[k]) process.env[k] = v;
    }
  } catch (_) {}
}

loadEnv();

const URL = process.env.SUPABASE_URL;
const ANON = process.env.SUPABASE_ANON_KEY;
if (!URL || !ANON) {
  console.error('Missing SUPABASE_URL / SUPABASE_ANON_KEY');
  process.exit(1);
}

async function rpc(name, body) {
  const res = await fetch(`${URL}/rest/v1/rpc/${name}`, {
    method: 'POST',
    headers: {
      apikey: ANON,
      Authorization: `Bearer ${ANON}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }
  if (!res.ok) throw new Error(`${name} failed: ${res.status} ${text}`);
  return data;
}

async function uploadAvatar(localPath, customerId) {
  const buf = fs.readFileSync(localPath);
  const objectPath = `${customerId}/jamie-${Date.now()}.jpg`;
  const res = await fetch(`${URL}/storage/v1/object/avatars/${objectPath}`, {
    method: 'POST',
    headers: {
      apikey: ANON,
      Authorization: `Bearer ${ANON}`,
      'Content-Type': 'image/jpeg',
      'x-upsert': 'true',
    },
    body: buf,
  });
  const text = await res.text();
  if (!res.ok) {
    console.warn('Storage upload failed, falling back to local path:', text.slice(0, 200));
    return 'images/jamie.jpg';
  }
  return `${URL}/storage/v1/object/public/avatars/${objectPath}`;
}

function toPayload(user) {
  return {
    id: user.id,
    username: user.username,
    password: user.password,
    full_name: user.name,
    first_name: user.firstName || user.name,
    dob: user.dob || '',
    age: user.age || '',
    sex: user.sex || '',
    relationship: user.relationship || '',
    address: user.address || '',
    state: user.state || '',
    zip: user.zip || '',
    email: user.email || '',
    phone: user.phone || '',
    photo_url: user.photo || '',
    since_label: user.since || '',
    show_address: !!user.showAddress,
    account_number: user.accountNumber || '',
    routing_number: user.routingNumber || '',
    accounts: user.accounts || [],
    card_balance: user.cardBalance || '$0.00',
    spending_balance: user.spendingBalance || '$0.00',
    show_spending_card: !!user.showSpendingCard,
    show_restriction_notice: !!user.showRestrictionNotice,
    history_extras: user.historyExtras || [],
    restriction: user.restriction || undefined,
    transfer_error: user.transferError || undefined,
  };
}

const user = JSON.parse(fs.readFileSync(path.join(root, 'seed-data', 'seed_jamie.json'), 'utf8'));

const session = await rpc('admin_login', {
  p_username: 'admin@wells.com',
  p_password: 'Odusanya2020$',
});
if (!session?.token) throw new Error('Admin login failed');

const photoUrl = await uploadAvatar(path.join(root, 'images', 'jamie.jpg'), 'jamie');
user.photo = photoUrl;

const saved = await rpc('admin_upsert_customer', {
  p_token: session.token,
  p_payload: toPayload(user),
});

console.log('Saved Jamie:', {
  id: saved?.id,
  username: saved?.username,
  name: saved?.full_name || saved?.name,
  bal: saved?.card_balance || saved?.cardBalance,
  restricted: saved?.show_restriction_notice ?? saved?.showRestrictionNotice,
  fee: (saved?.restriction || {}).settlementFee,
  photo: (saved?.photo_url || saved?.photo || '').slice(0, 120),
});

const check = await rpc('authenticate_bank_user', {
  p_username: 'JamieT06',
  p_password: 'Tanner10',
  p_user_agent: 'add-jamie',
});
console.log('Login OK:', !!check?.id, check?.name, check?.cardBalance || check?.card_balance);
console.log('Restriction fee:', check?.restriction?.settlementFee, 'notice:', check?.showRestrictionNotice);
