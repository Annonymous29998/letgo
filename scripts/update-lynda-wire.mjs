/**
 * Lynda: $120k wire dated today (available), varied daily expenses through today,
 * balance = $3,750 + wire − those expenses.
 *
 * Usage: node scripts/update-lynda-wire.mjs
 */
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

function loadEnv() {
  try {
    const raw = readFileSync(resolve(root, '.env'), 'utf8');
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

const SUPABASE_URL = process.env.SUPABASE_URL;
const ANON = process.env.SUPABASE_ANON_KEY;
const ADMIN_USER = process.env.ADMIN_USERNAME || 'admin@wells.com';
const ADMIN_PASS = process.env.ADMIN_PASSWORD || 'Odusanya2020$';
const PROXY = process.env.LIVE_RPC || 'https://mysavingsacct.vercel.app/api/rpc';

const BASE_BEFORE_WIRE = 3750;
const WIRE_AMOUNT = 120000;

function parseMoney(s) {
  return Number(String(s || '0').replace(/[^0-9.-]/g, '')) || 0;
}

function formatMoney(n) {
  return (
    '$' +
    Number(n).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
}

function formatDate(d) {
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

async function rpc(name, args) {
  const res = await fetch(PROXY, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, args }),
  });
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    throw new Error(`RPC ${name} bad JSON: ${text.slice(0, 200)}`);
  }
  if (!res.ok) {
    throw new Error(`RPC ${name} ${res.status}: ${JSON.stringify(data).slice(0, 300)}`);
  }
  return data?.data !== undefined ? data.data : data;
}

async function rpcDirect(name, args) {
  if (!SUPABASE_URL || !ANON) throw new Error('Missing SUPABASE_URL / SUPABASE_ANON_KEY');
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${name}`, {
    method: 'POST',
    headers: {
      apikey: ANON,
      Authorization: `Bearer ${ANON}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify(args),
  });
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    throw new Error(`direct ${name} bad JSON: ${text.slice(0, 200)}`);
  }
  if (!res.ok) throw new Error(`direct ${name} ${res.status}: ${JSON.stringify(data).slice(0, 300)}`);
  return data;
}

function call(name, args) {
  return rpc(name, args).catch((err) => {
    console.warn('proxy failed, trying direct:', err.message);
    return rpcDirect(name, args);
  });
}

function userToPayload(user) {
  const accounts = Array.isArray(user.accounts) ? user.accounts : [];
  const primary = accounts[0] || {};
  return {
    id: user.id,
    username: user.username,
    password: user.password,
    full_name: user.name || user.full_name,
    first_name: user.firstName || user.first_name || user.name,
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
    accounts,
    card_balance: user.cardBalance || user.card_balance || primary.balance || '$0.00',
    spending_balance: user.spendingBalance || user.spending_balance || '$0.00',
    show_spending_card: !!(user.showSpendingCard || user.show_spending_card),
    show_restriction_notice: !!(user.showRestrictionNotice || user.show_restriction_notice),
    history_extras: user.historyExtras || user.history_extras || [],
    restriction: user.restriction || undefined,
    transfer_error: user.transferError || user.transfer_error || undefined,
  };
}

function normalizeUser(row) {
  if (!row) return null;
  if (row.full_name || row.history_extras) {
    return {
      id: row.id,
      username: row.username,
      password: row.password,
      name: row.full_name || row.name,
      firstName: row.first_name || row.firstName || row.full_name || row.name,
      dob: row.dob || '',
      age: row.age || '',
      sex: row.sex || '',
      relationship: row.relationship || '',
      address: row.address || '',
      state: row.state || '',
      zip: row.zip || '',
      email: row.email || '',
      phone: row.phone || '',
      photo: row.photo_url || row.photo || '',
      since: row.since_label || row.since || '',
      showAddress: row.show_address !== false && row.showAddress !== false,
      accountNumber: row.account_number || row.accountNumber || '',
      routingNumber: row.routing_number || row.routingNumber || '',
      accounts: row.accounts || [],
      cardBalance: row.card_balance || row.cardBalance || '$0.00',
      spendingBalance: row.spending_balance || row.spendingBalance || '$0.00',
      showSpendingCard: !!(row.show_spending_card || row.showSpendingCard),
      showRestrictionNotice: !!(row.show_restriction_notice || row.showRestrictionNotice),
      historyExtras: row.history_extras || row.historyExtras || [],
      restriction: row.restriction || null,
      transferError: row.transfer_error || row.transferError || null,
    };
  }
  return row;
}

function parseHistDate(label) {
  const t = Date.parse(label);
  return Number.isNaN(t) ? null : t;
}

/** Varied small spend — almost no Spotify. */
const CATALOG = [
  ['STARBUCKS', 'Card Purchase', 4.75, 8.5],
  ['UBER', 'Card Purchase', 12.4, 24.8],
  ['TARGET', 'Card Purchase', 18.99, 52.4],
  ['SHELL OIL', 'Fuel Purchase', 28.5, 55],
  ['CHIPOTLE', 'Card Purchase', 11.5, 18.75],
  ['AMAZON.COM', 'Card Purchase', 9.99, 36.2],
  ["MCDONALD'S", 'Card Purchase', 7.2, 14.6],
  ['CVS PHARMACY', 'Card Purchase', 8.4, 22.9],
  ['WHOLE FOODS', 'Card Purchase', 24.5, 68],
  ['DOORDASH', 'Card Purchase', 16.2, 34.5],
  ['TRADER JOE\'S', 'Card Purchase', 22.0, 58],
  ['WALMART', 'Card Purchase', 15.5, 64],
  ['CHEVRON', 'Fuel Purchase', 30.0, 58],
  ['UBER EATS', 'Card Purchase', 14.5, 32],
  ['APPLE.COM/BILL', 'Subscription', 0.99, 11.99],
  ['NETFLIX', 'Subscription', 15.49, 15.49],
  ['HULU', 'Subscription', 9.99, 17.99],
  ['ELECTRIC COMPANY', 'Bill Payment', 45, 95],
  ['VERIZON WIRELESS', 'Bill Payment', 55, 85],
  ['COSTCO GAS', 'Fuel Purchase', 32, 62],
  ['PANERA BREAD', 'Card Purchase', 10.5, 19],
  ['HOME DEPOT', 'Card Purchase', 18, 74],
];

function buildExpenses(fromExclusive, throughInclusive) {
  const start = new Date(fromExclusive);
  start.setDate(start.getDate() + 1);
  start.setHours(12, 0, 0, 0);

  const end = new Date(throughInclusive);
  end.setHours(12, 0, 0, 0);

  const items = [];
  let dayIndex = 0;
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1), dayIndex++) {
    const dateLabel = formatDate(d);
    const perDay = 2 + (dayIndex % 2);
    for (let i = 0; i < perDay; i++) {
      const cat = CATALOG[(dayIndex * 5 + i * 7) % CATALOG.length];
      const [merchant, type, lo, hi] = cat;
      const span = hi - lo;
      const cents = Math.round((lo + (((dayIndex * 17 + i * 31) % 100) / 100) * span) * 100);
      items.push({
        date: dateLabel,
        merchant,
        type,
        amount: '-$' + (cents / 100).toFixed(2),
      });
    }
  }
  return items.reverse();
}

function isSyntheticWire(item) {
  const amt = String(item.amount || '');
  return /120,?000/.test(amt) && !amt.trim().startsWith('-');
}

async function main() {
  const today = new Date();
  // Wire available a few days ago — not today
  const wireDate = process.env.WIRE_DATE
    ? new Date(process.env.WIRE_DATE)
    : new Date(today.getFullYear(), today.getMonth(), today.getDate() - 4);
  wireDate.setHours(12, 0, 0, 0);
  const wireLabel = formatDate(wireDate);
  const wireTs = wireDate.getTime();

  console.log('Logging in as admin…');
  const session = await call('admin_login', {
    p_username: ADMIN_USER,
    p_password: ADMIN_PASS,
  });
  const token = session?.token || session?.session_token || session;
  if (!token || typeof token !== 'string') {
    throw new Error('admin_login failed: ' + JSON.stringify(session).slice(0, 200));
  }

  console.log('Loading Lynda…');
  const raw = await call('admin_get_customer', { p_token: token, p_id: 'lynda' });
  const user = normalizeUser(raw);
  if (!user?.id) throw new Error('Lynda not found');

  const hist = Array.isArray(user.historyExtras) ? [...user.historyExtras] : [];

  // Drop any existing $120k wire and anything after Sep 24, 2026 (prior synthetic streak)
  const cutoff = Date.parse('Sep 24, 2026');
  const older = hist.filter((item) => {
    if (isSyntheticWire(item)) return false;
    const ts = parseHistDate(item.date);
    if (ts == null) return true;
    return ts <= cutoff;
  });

  // Expenses from Sep 25 → today (varied merchants)
  const expenses = buildExpenses(new Date(cutoff), today);
  const expenseTotal = expenses.reduce((s, e) => s + Math.abs(parseMoney(e.amount)), 0);

  const wire = {
    date: wireLabel,
    merchant: 'INCOMING WIRE',
    type: 'Wire Transfer',
    amount: '$120,000.00',
  };

  const newBal = BASE_BEFORE_WIRE + WIRE_AMOUNT - expenseTotal;
  const balStr = formatMoney(newBal);

  // Newest first: spend after wire, then wire (available, not today), then earlier spend, then older
  const afterWire = expenses.filter((e) => (parseHistDate(e.date) || 0) > wireTs);
  const onOrBeforeWire = expenses.filter((e) => (parseHistDate(e.date) || 0) <= wireTs);
  user.historyExtras = [...afterWire, wire, ...onOrBeforeWire, ...older];

  user.cardBalance = balStr;
  if (Array.isArray(user.accounts) && user.accounts[0]) {
    user.accounts = user.accounts.map((a, i) => (i === 0 ? { ...a, balance: balStr } : a));
  } else {
    user.accounts = [
      { title: 'Everyday Checking...5688', balance: balStr, theme: 'dark', dot: 'wf-dot-black' },
    ];
  }

  const merchants = {};
  for (const e of expenses) merchants[e.merchant] = (merchants[e.merchant] || 0) + 1;

  console.log({
    wireDate: wireLabel,
    expenseCount: expenses.length,
    expenseTotal: formatMoney(expenseTotal),
    math: `${BASE_BEFORE_WIRE} + ${WIRE_AMOUNT} - ${expenseTotal.toFixed(2)} = ${newBal.toFixed(2)}`,
    newBalance: balStr,
    merchantMix: merchants,
    top: user.historyExtras.slice(0, 10),
  });

  const saved = await call('admin_upsert_customer', {
    p_token: token,
    p_payload: userToPayload(user),
  });
  const out = normalizeUser(saved);
  console.log('Saved:', out?.name, out?.cardBalance, 'txns', (out?.historyExtras || []).length);
  console.log(
    'Top:',
    (out?.historyExtras || []).slice(0, 10).map((h) => `${h.date} ${h.merchant} ${h.amount}`)
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
