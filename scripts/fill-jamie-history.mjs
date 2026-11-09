/**
 * Fill Jamie Tanner history through today while keeping $52,500 + transfer hold.
 * Usage: node scripts/fill-jamie-history.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import vm from 'vm';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

function loadEnv() {
  try {
    const raw = fs.readFileSync(path.join(root, '.env'), 'utf8');
    for (const line of raw.split('\n')) {
      const m = line.match(/^([^#=]+)=(.*)$/);
      if (!m) continue;
      if (!process.env[m[1].trim()]) process.env[m[1].trim()] = m[2].trim();
    }
  } catch (_) {}
}
loadEnv();

const URL = process.env.SUPABASE_URL;
const ANON = process.env.SUPABASE_ANON_KEY;

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
  if (!res.ok) throw new Error(`${name} ${res.status} ${text.slice(0, 300)}`);
  return data;
}

// Load browser history generator in a fake window
const genSrc = fs.readFileSync(path.join(root, 'admin/js/history-generator.js'), 'utf8');
const sandbox = { window: {}, console };
vm.runInNewContext(genSrc, sandbox);
const hist = sandbox.window.wfHistoryGen.generateHistory('Since 2020', { seedKey: 'jamie' });

console.log('Generated history items:', hist.length);
console.log('Newest:', hist[0]);
console.log('Oldest:', hist[hist.length - 1]);

const session = await rpc('admin_login', {
  p_username: 'admin@wells.com',
  p_password: 'Odusanya2020$',
});
const existing = await rpc('admin_get_customer', { p_token: session.token, p_id: 'jamie' });
if (!existing?.id) throw new Error('Jamie not in database');

const payload = {
  id: existing.id,
  username: existing.username,
  password: existing.password,
  full_name: existing.full_name || existing.name,
  first_name: existing.first_name || existing.firstName || existing.full_name,
  dob: existing.dob || '04/28/1992',
  age: existing.age || '34',
  sex: existing.sex || 'Female',
  relationship: existing.relationship || '',
  address: existing.address || '3106 Goldsboro Street',
  state: existing.state || 'TX',
  zip: existing.zip || '78230',
  email: existing.email || '',
  phone: existing.phone || '',
  photo_url: existing.photo_url || existing.photo || '',
  since_label: existing.since_label || existing.since || 'Since 2020',
  show_address: true,
  account_number: existing.account_number || existing.accountNumber || '4892017630',
  routing_number: existing.routing_number || existing.routingNumber || '121000248',
  accounts: existing.accounts?.length
    ? existing.accounts.map((a, i) => (i === 0 ? { ...a, balance: '$52,500.00' } : a))
    : [{ title: 'Everyday Checking...7630', balance: '$52,500.00', theme: 'dark', dot: 'wf-dot-black' }],
  card_balance: '$52,500.00',
  spending_balance: '$0.00',
  show_spending_card: false,
  show_restriction_notice: true,
  history_extras: hist,
  restriction: existing.restriction || {
    title: 'Transfer Unavailable',
    greeting: 'Dear {name},',
    message:
      'We were unable to complete your transfer. A compliance hold is active on this account after a review of recent outbound activity.\n\nTo release the hold and restore outgoing transfers, a settlement fee of {fee} must be paid. Until that fee is cleared, transfers will remain blocked.',
    feeText: 'Settlement fee due: {fee}',
    button: 'I Understand',
    support: 'Contact Support',
    settlementFee: 4300,
  },
  transfer_error: existing.transfer_error || existing.transferError || {
    title: 'Transfer Unavailable',
    message:
      'We were unable to complete your transfer. A compliance hold is active on this account. Please pay the {fee} settlement fee to restore outgoing transfers.',
    button: 'Retry',
  },
};

const saved = await rpc('admin_upsert_customer', {
  p_token: session.token,
  p_payload: payload,
});

const outHist = saved.history_extras || saved.historyExtras || [];
console.log('Saved in DB:', {
  id: saved.id,
  bal: saved.card_balance || saved.cardBalance,
  hist: outHist.length,
  newest: outHist[0],
  fee: (saved.restriction || {}).settlementFee,
  restricted: saved.show_restriction_notice ?? saved.showRestrictionNotice,
});

const login = await rpc('authenticate_bank_user', {
  p_username: 'JamieT06',
  p_password: 'Tanner10',
  p_user_agent: 'fill-history',
});
console.log('Login hist:', (login.historyExtras || []).length, 'newest', (login.historyExtras || [])[0]);
