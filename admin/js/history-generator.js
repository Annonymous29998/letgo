/**
 * Generates realistic bank history from a "Since …" label through today.
 * Item shape matches app.js historyExtras:
 * { date, merchant, type, amount, pending? }
 */
(function (global) {
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
    { merchant: 'SPOTIFY', type: 'Subscription', amount: 11.99, day: 11 },
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
    const s = String(str || 'wells');
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  function formatMoney(n, debit) {
    const abs = Math.abs(n);
    const formatted = abs.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });
    return debit ? '-' + formatted : formatted;
  }

  function formatDate(d) {
    return MONTHS[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
  }

  function daysInMonth(year, monthIndex) {
    return new Date(year, monthIndex + 1, 0).getDate();
  }

  function clampDay(year, monthIndex, day) {
    return Math.min(day, daysInMonth(year, monthIndex));
  }

  function parseSinceDate(sinceLabel) {
    const text = String(sinceLabel || '').trim();
    const now = new Date();
    const fallback = new Date(now.getFullYear(), 0, 1);

    // "Since April 2019" / "Since 2018" / "April 2019" / "2018"
    const monthYear = text.match(
      /\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{4})\b/i
    );
    if (monthYear) {
      const monthNames = [
        'january',
        'february',
        'march',
        'april',
        'may',
        'june',
        'july',
        'august',
        'september',
        'october',
        'november',
        'december',
      ];
      const mi = monthNames.indexOf(monthYear[1].toLowerCase());
      const year = Number(monthYear[2]);
      if (mi >= 0 && year >= 1990 && year <= now.getFullYear() + 1) {
        return new Date(year, mi, 1);
      }
    }

    const yearOnly = text.match(/\b(19|20)\d{2}\b/);
    if (yearOnly) {
      const year = Number(yearOnly[0]);
      if (year >= 1990 && year <= now.getFullYear() + 1) {
        return new Date(year, 0, 1);
      }
    }

    return fallback;
  }

  function pick(rng, arr) {
    return arr[Math.floor(rng() * arr.length)];
  }

  function randAmount(rng, min, max) {
    return Math.round((min + rng() * (max - min)) * 100) / 100;
  }

  /**
   * @param {string} sinceLabel e.g. "Since 2018" or "Since April 2019"
   * @param {object} [options]
   * @param {Date|string|number} [options.endDate]
   * @param {string} [options.seed] deterministic seed (username/id)
   * @param {number} [options.payrollAmount]
   */
  function generateHistory(sinceLabel, options) {
    const opts = options || {};
    const start = parseSinceDate(sinceLabel);
    const end = opts.endDate ? new Date(opts.endDate) : new Date();
    end.setHours(23, 59, 59, 999);

    if (end < start) return [];

    const rng = mulberry32(hashSeed(opts.seed || sinceLabel || 'history'));
    const payroll = opts.payrollAmount || 2150;
    const items = [];

    let y = start.getFullYear();
    let m = start.getMonth();
    const endY = end.getFullYear();
    const endM = end.getMonth();

    while (y < endY || (y === endY && m <= endM)) {
      const dim = daysInMonth(y, m);
      const monthStartDay = y === start.getFullYear() && m === start.getMonth() ? start.getDate() : 1;
      const monthEndDay = y === endY && m === endM ? end.getDate() : dim;

      // Fixed monthly bills / subscriptions (each month of each year)
      MONTHLY_BILLS.forEach((bill) => {
        const day = clampDay(y, m, bill.day);
        if (day < monthStartDay || day > monthEndDay) return;
        const d = new Date(y, m, day);
        const amount =
          bill.amount != null ? bill.amount : randAmount(rng, bill.min, bill.max);
        items.push({
          date: formatDate(d),
          merchant: bill.merchant,
          type: bill.type,
          amount: formatMoney(amount, true),
          _sort: d.getTime() + 1,
        });
      });

      // Payroll twice a month
      [8, 22].forEach((payDay) => {
        const day = clampDay(y, m, payDay);
        if (day < monthStartDay || day > monthEndDay) return;
        const d = new Date(y, m, day);
        items.push({
          date: formatDate(d),
          merchant: 'PAYROLL DEPOSIT',
          type: 'Direct Deposit',
          amount: formatMoney(payroll, false),
          _sort: d.getTime(),
        });
      });

      // Vivian-style: ~3 everyday purchases on every day of the month
      for (let day = monthStartDay; day <= monthEndDay; day++) {
        const d = new Date(y, m, day);
        const usedMerchants = new Set();
        for (let i = 0; i < 3; i++) {
          let tpl = pick(rng, DEBIT_POOL);
          let tries = 0;
          while (usedMerchants.has(tpl.merchant) && tries < 8) {
            tpl = pick(rng, DEBIT_POOL);
            tries++;
          }
          usedMerchants.add(tpl.merchant);
          const amount = randAmount(rng, tpl.min, tpl.max);
          items.push({
            date: formatDate(d),
            merchant: tpl.merchant,
            type: tpl.type,
            amount: formatMoney(amount, true),
            _sort: d.getTime() + 10 + i,
          });
        }
      }

      m += 1;
      if (m > 11) {
        m = 0;
        y += 1;
      }
    }

    // Newest first (matches Lynda/Vivian seed order)
    items.sort((a, b) => b._sort - a._sort);

    // Mark the newest debit-ish item as pending occasionally for realism
    const newest = items[0];
    if (newest && newest.amount.startsWith('-') && rng() > 0.55) {
      // leave pending off by default for generated history
    }

    return items.map(({ date, merchant, type, amount, pending }) => {
      const flow = String(amount || '').trim().startsWith('-') ? 'debit' : 'credit';
      const row = { date, merchant, type, amount, flow };
      if (pending) row.pending = true;
      return row;
    });
  }

  function emptyTransaction() {
    const d = new Date();
    return {
      date: formatDate(d),
      merchant: '',
      type: 'Card Purchase',
      amount: '-$0.00',
      flow: 'debit',
      pending: false,
    };
  }

  global.wfHistoryGen = {
    parseSinceDate,
    generateHistory,
    formatDate,
    emptyTransaction,
  };
})(window);
