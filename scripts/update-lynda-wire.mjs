/**
 * Lynda: keep $120k wire available, replace post-wire spend with daily
 * expenses through today, and set balance from $3,750 + wire − expenses.
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

/** Small realistic spend Sep 25 → today (inclusive). */
function buildPostWireExpenses(wireDateLabel, today = new Date()) {
  const start = new Date(parseHistDate(wireDateLabel) || Date.parse('Sep 24, 2026'));
  start.setDate(start.getDate() + 1);
  start.setHours(12, 0, 0, 0);

  const end = new Date(today);
  end.setHours(12, 0, 0, 0);

  const catalog = [
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
    ['NETFLIX', 'Subscription', 15.49, 15.49],
    ['SPOTIFY', 'Subscription', 10.99, 10.99],
  ];

  const items = [];
  // Deterministic-ish amounts from day index so re-runs stay stable
  let dayIndex = 0;
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1), dayIndex++) {
    const dateLabel = formatDate(d);
    const perDay = 2 + (dayIndex % 2); // 2 or 3 little expenses
    for (let i = 0; i < perDay; i++) {
      const cat = catalog[(dayIndex * 3 + i * 5) % catalog.length];
      const [merchant, type, lo, hi] = cat;
      const span = hi - lo;
      const cents = Math.round((lo + ((dayIndex * 17 + i * 31) % 100) / 100 * span) * 100);
      const amount = '-$' + (cents / 100).toFixed(2);
      items.push({ date: dateLabel, merchant, type, amount });
    }
  }
  // Newest first
  return items.reverse();
}

function isOurPriorExpense(item) {
  // Remove previously injected post-wire spend (Oct 8–12 batch or any debit after wire date)
  return true;
}

async function main() {
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
  let wireIdx = hist.findIndex(
    (i) => /120,?000/.test(String(i.amount || '')) && !String(i.amount).trim().startsWith('-')
  );
  if (wireIdx < 0) throw new Error('Could not find $120,000 incoming wire on Lynda');

  const wire = { ...hist[wireIdx] };
  delete wire.pending;
  wire.merchant = 'INCOMING WIRE';
  wire.type = 'Wire Transfer';
  wire.amount = '$120,000.00';
  if (!wire.date) wire.date = 'Sep 24, 2026';

  const wireTs = parseHistDate(wire.date);
  // Keep history up through the wire (and older). Drop anything newer than the wire
  // so we can rebuild continuous daily spend through today.
  const olderOrWire = hist.filter((item, idx) => {
    if (idx === wireIdx) return false; // re-insert cleaned wire
    const ts = parseHistDate(item.date);
    if (ts == null) return true;
    return ts <= wireTs;
  });

  const postWire = buildPostWireExpenses(wire.date, new Date());
  const expenseTotal = postWire.reduce((s, e) => s + Math.abs(parseMoney(e.amount)), 0);
  const newBal = BASE_BEFORE_WIRE + WIRE_AMOUNT - expenseTotal;
  const balStr = formatMoney(newBal);

  // Newest first: expenses, then wire, then older
  user.historyExtras = [...postWire, wire, ...olderOrWire];
  user.cardBalance = balStr;
  if (Array.isArray(user.accounts) && user.accounts[0]) {
    user.accounts = user.accounts.map((a, i) => (i === 0 ? { ...a, balance: balStr } : a));
  } else {
    user.accounts = [
      { title: 'Everyday Checking...5688', balance: balStr, theme: 'dark', dot: 'wf-dot-black' },
    ];
  }

  console.log({
    baseBeforeWire: formatMoney(BASE_BEFORE_WIRE),
    wire: formatMoney(WIRE_AMOUNT),
    postWireDays: postWire.length,
    expenseTotal: formatMoney(expenseTotal),
    math: `${BASE_BEFORE_WIRE} + ${WIRE_AMOUNT} - ${expenseTotal.toFixed(2)} = ${newBal.toFixed(2)}`,
    newBalance: balStr,
    historyCount: user.historyExtras.length,
    newest: user.historyExtras.slice(0, 6),
    wireEntry: wire,
  });

  const saved = await call('admin_upsert_customer', {
    p_token: token,
    p_payload: userToPayload(user),
  });
  const out = normalizeUser(saved);
  console.log('Saved Lynda:', out?.name, out?.cardBalance, 'txns', (out?.historyExtras || []).length);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
