import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const URL = process.env.SUPABASE_URL || 'https://htrngcwdplmuhntfhdgl.supabase.co';
const ANON = process.env.SUPABASE_ANON_KEY || '';

if (!ANON) {
  console.error('Missing SUPABASE_ANON_KEY');
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
  if (!res.ok) {
    throw new Error(`${name} failed: ${res.status} ${text}`);
  }
  return data;
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
  };
}

const session = await rpc('admin_login', {
  p_username: 'admin@wells.com',
  p_password: 'Odusanya2020$',
});

if (!session?.token) {
  throw new Error('Admin login failed');
}

const files = ['seed_melissa.json', 'seed_lynda.json', 'seed_vivian.json'];
for (const file of files) {
  const user = JSON.parse(fs.readFileSync(path.join(root, 'seed-data', file), 'utf8'));
  const saved = await rpc('admin_upsert_customer', {
    p_token: session.token,
    p_payload: toPayload(user),
  });
  console.log('Seeded', saved?.username || user.username, saved?.id || user.id);
}

const list = await rpc('admin_list_customers', { p_token: session.token });
console.log('Total customers:', Array.isArray(list) ? list.length : list);
