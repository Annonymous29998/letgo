/**
 * One-time migrate: push Melissa / Lynda / Vivian + photos into Supabase.
 * App login then uses the database only (no local USERS seed).
 *
 * Usage:
 *   node scripts/migrate-to-db.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

function readConfig() {
  const raw = fs.readFileSync(path.join(root, 'js/supabase-config.js'), 'utf8');
  const url = (raw.match(/url:\s*'([^']+)'/) || [])[1];
  const anonKey = (raw.match(/anonKey:\s*'([^']+)'/) || [])[1];
  if (!url || !anonKey) throw new Error('Could not read js/supabase-config.js');
  return { url, anonKey };
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DEBIT_POOL = [
  { merchant: 'STARBUCKS', type: 'Card Purchase', min: 5.5, max: 12.5 },
  { merchant: 'UBER', type: 'Card Purchase', min: 12, max: 28 },
  { merchant: 'TARGET', type: 'Card Purchase', min: 28, max: 130 },
  { merchant: 'AMAZON.COM', type: 'Card Purchase', min: 15, max: 90 },
  { merchant: 'WALMART', type: 'Card Purchase', min: 35, max: 110 },
  { merchant: 'HEB GROCERY', type: 'Card Purchase', min: 45, max: 160 },
  { merchant: 'WHOLE FOODS', type: 'Card Purchase', min: 40, max: 120 },
  { merchant: 'COSTCO WHOLESALE', type: 'Card Purchase', min: 80, max: 220 },
  { merchant: 'CVS PHARMACY', type: 'Card Purchase', min: 12, max: 40 },
  { merchant: 'SHELL OIL', type: 'Fuel Purchase', min: 35, max: 65 },
  { merchant: "MCDONALD'S", type: 'Card Purchase', min: 8, max: 16 },
  { merchant: 'CHIPOTLE', type: 'Card Purchase', min: 12, max: 20 },
  { merchant: 'DOORDASH', type: 'Card Purchase', min: 18, max: 40 },
  { merchant: 'BEST BUY', type: 'Card Purchase', min: 50, max: 300 },
  { merchant: 'ATM WITHDRAWAL', type: 'Cash Withdrawal', min: 40, max: 200 },
];
const MONTHLY_BILLS = [
  { merchant: 'NETFLIX', type: 'Subscription', amount: 22.99, day: 15 },
  { merchant: 'APPLE.COM/BILL', type: 'Subscription', amount: 11.99, day: 8 },
  { merchant: 'VERIZON WIRELESS', type: 'Bill Payment', amount: 89.99, day: 2 },
  { merchant: 'ELECTRIC COMPANY', type: 'Bill Payment', min: 95, max: 135, day: 18 },
  { merchant: 'RENT PAYMENT', type: 'Bill Payment', amount: 1450, day: 1 },
];

function mulberry32(seed) {
  let t = seed >>> 0;
  return function () {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function hashSeed(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function formatMoney(n, debit) {
  const formatted = Math.abs(n).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  return debit ? '-' + formatted : formatted;
}

function formatDate(d) {
  return MONTHS[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
}

function daysInMonth(year, monthIndex) {
  return new Date(year, monthIndex + 1, 0).getDate();
}

function parseSinceDate(sinceLabel) {
  const text = String(sinceLabel || '');
  const now = new Date();
  const monthYear = text.match(
    /\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{4})\b/i
  );
  if (monthYear) {
    const names = [
      'january', 'february', 'march', 'april', 'may', 'june',
      'july', 'august', 'september', 'october', 'november', 'december',
    ];
    const mi = names.indexOf(monthYear[1].toLowerCase());
    return new Date(Number(monthYear[2]), Math.max(0, mi), 1);
  }
  const yearOnly = text.match(/\b(19|20)\d{2}\b/);
  if (yearOnly) return new Date(Number(yearOnly[0]), 0, 1);
  return new Date(now.getFullYear(), 0, 1);
}

function generateHistory(sinceLabel, seed) {
  const start = parseSinceDate(sinceLabel);
  const end = new Date();
  const rng = mulberry32(hashSeed(seed || sinceLabel));
  const items = [];
  let y = start.getFullYear();
  let m = start.getMonth();
  const endY = end.getFullYear();
  const endM = end.getMonth();

  while (y < endY || (y === endY && m <= endM)) {
    const dim = daysInMonth(y, m);
    const monthStartDay = y === start.getFullYear() && m === start.getMonth() ? start.getDate() : 1;
    const monthEndDay = y === endY && m === endM ? end.getDate() : dim;

    MONTHLY_BILLS.forEach((bill) => {
      const day = Math.min(bill.day, dim);
      if (day < monthStartDay || day > monthEndDay) return;
      const d = new Date(y, m, day);
      const amount =
        bill.amount != null
          ? bill.amount
          : Math.round((bill.min + rng() * (bill.max - bill.min)) * 100) / 100;
      items.push({
        date: formatDate(d),
        merchant: bill.merchant,
        type: bill.type,
        amount: formatMoney(amount, true),
        _sort: d.getTime() + 1,
      });
    });

    [8, 22].forEach((payDay) => {
      const day = Math.min(payDay, dim);
      if (day < monthStartDay || day > monthEndDay) return;
      const d = new Date(y, m, day);
      items.push({
        date: formatDate(d),
        merchant: 'PAYROLL DEPOSIT',
        type: 'Direct Deposit',
        amount: formatMoney(2150, false),
        _sort: d.getTime(),
      });
    });

    const activeDays = new Set();
    const targetDays = Math.min(16, Math.max(8, monthEndDay - monthStartDay + 1));
    let guard = 0;
    while (activeDays.size < targetDays && guard < 80) {
      guard++;
      activeDays.add(monthStartDay + Math.floor(rng() * (monthEndDay - monthStartDay + 1)));
    }
    [...activeDays].sort((a, b) => a - b).forEach((day) => {
      const d = new Date(y, m, day);
      const count = 2 + Math.floor(rng() * 3);
      for (let i = 0; i < count; i++) {
        const tpl = DEBIT_POOL[Math.floor(rng() * DEBIT_POOL.length)];
        const amount = Math.round((tpl.min + rng() * (tpl.max - tpl.min)) * 100) / 100;
        items.push({
          date: formatDate(d),
          merchant: tpl.merchant,
          type: tpl.type,
          amount: formatMoney(amount, true),
          _sort: d.getTime() + 10 + i,
        });
      }
    });

    m += 1;
    if (m > 11) {
      m = 0;
      y += 1;
    }
  }

  items.sort((a, b) => b._sort - a._sort);
  return items.map(({ date, merchant, type, amount, pending }) => {
    const row = { date, merchant, type, amount };
    if (pending) row.pending = true;
    return row;
  });
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

const { url, anonKey } = readConfig();

async function rpc(name, body) {
  const res = await fetch(`${url}/rest/v1/rpc/${name}`, {
    method: 'POST',
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`,
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

async function uploadAvatar(customerId, filePath) {
  const ext = path.extname(filePath).replace('.', '') || 'png';
  const contentType = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : 'image/png';
  const storagePath = `${customerId}/profile.${ext}`;
  const bytes = fs.readFileSync(filePath);

  const res = await fetch(`${url}/storage/v1/object/avatars/${storagePath}`, {
    method: 'POST',
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`,
      'Content-Type': contentType,
      'x-upsert': 'true',
    },
    body: bytes,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Upload ${customerId} failed: ${res.status} ${text}`);
  }
  return `${url}/storage/v1/object/public/avatars/${storagePath}`;
}

const session = await rpc('admin_login', {
  p_username: 'admin@wells.com',
  p_password: 'Odusanya2020$',
});
if (!session?.token) throw new Error('Admin login failed');

const files = [
  { json: 'seed_melissa.json', image: 'images/melissa.png' },
  { json: 'seed_lynda.json', image: 'images/lynda.png' },
  { json: 'seed_vivian.json', image: 'images/vivian.jpg' },
];

for (const entry of files) {
  const user = JSON.parse(fs.readFileSync(path.join(root, 'seed-data', entry.json), 'utf8'));
  const imagePath = path.join(root, entry.image);
  if (!fs.existsSync(imagePath)) throw new Error('Missing image: ' + entry.image);

  user.photo = await uploadAvatar(user.id, imagePath);

  if (!Array.isArray(user.historyExtras) || user.historyExtras.length === 0) {
    user.historyExtras = generateHistory(user.since || 'Since 2020', user.username);
    console.log(`Generated ${user.historyExtras.length} history rows for ${user.username}`);
  }

  const saved = await rpc('admin_upsert_customer', {
    p_token: session.token,
    p_payload: toPayload(user),
  });
  console.log('Migrated', saved?.username || user.username, 'photo:', user.photo);
}

const list = await rpc('admin_list_customers', { p_token: session.token });
console.log('Total customers in DB:', Array.isArray(list) ? list.length : list);
console.log('Done. Bank app should login via Supabase only.');
