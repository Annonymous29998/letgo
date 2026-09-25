(function () {
  const KEY = 'wf_logged_in';
  const USER_KEY = 'wf_user_id';
  const PROTECTED_PAGES = new Set([
    'dashboard.html',
    'account.html',
    'profile.html',
    'card.html',
    'transfer.html',
    'history.html',
  ]);

  const USERS = {
    melissa: {
      id: 'melissa',
      username: 'Santiago1994',
      password: 'Santiamelissa2020$',
      name: 'Melissa Santiago',
      firstName: 'Melissa Santiago',
      dob: '06/04/1994',
      address: '4201 S W Young Dr',
      state: 'TX',
      zip: '76542',
      email: 'sm8565168@gmail.com',
      phone: '+1 (419) 318-6043',
      photo: 'images/melissa.png',
      since: 'Since April 2019',
      showAddress: true,
      accounts: [
        { title: 'Wells Fargo Way2Save Checking...3203', balance: '$263,385.00', theme: 'blue', dot: 'wf-dot-blue' },
        { title: 'Everyday Checking...5688', balance: '$802,751.00', theme: 'dark', dot: 'wf-dot-black' },
        { title: 'Wells Fargo Way2Save Savings...1902', balance: '$590,603.00', theme: 'blue', dot: 'wf-dot-blue' },
        { title: 'Wells Fargo Active Cash Card...7654', balance: '$65,307.00', theme: 'blue', dot: 'wf-dot-brown' },
      ],
      cardBalance: '$802,751.00',
      spendingBalance: '$590,603.00',
      showSpendingCard: true,
      showRestrictionNotice: true,
      historyExtras: [],
    },
    lynda: {
      id: 'lynda',
      username: 'Lyndakaren399',
      password: 'Passcode123$',
      name: 'Lynda Karen Jack',
      firstName: 'Lynda Karen Jack',
      dob: 'November 21 1994',
      age: '32',
      address: '',
      state: 'Nebraska',
      zip: '',
      email: '18010211058j@gmail.com',
      phone: '',
      photo: 'images/lynda.png',
      since: 'Since 2018',
      showAddress: false,
      accounts: [
        { title: 'Everyday Checking...5688', balance: '$3,750.00', theme: 'dark', dot: 'wf-dot-black' },
      ],
      cardBalance: '$3,750.00',
      spendingBalance: '$0.00',
      showSpendingCard: false,
      showRestrictionNotice: true,
      historyExtras: [
        {
          date: 'Sep 24, 2026',
          merchant: "INCOMING WIRE",
          type: 'Wire Transfer',
          amount: '$120,000.00',
          pending: true
        },
        {
          date: 'Sep 23, 2026',
          merchant: "HEB GROCERY",
          type: 'Card Purchase',
          amount: '-$119.90'
        },
        {
          date: 'Sep 23, 2026',
          merchant: "TARGET",
          type: 'Card Purchase',
          amount: '-$74.63'
        },
        {
          date: 'Sep 23, 2026',
          merchant: "AMAZON.COM",
          type: 'Card Purchase',
          amount: '-$35.21'
        },
        {
          date: 'Sep 23, 2026',
          merchant: "STARBUCKS",
          type: 'Card Purchase',
          amount: '-$11.18'
        },
        {
          date: 'Sep 23, 2026',
          merchant: "CVS PHARMACY",
          type: 'Card Purchase',
          amount: '-$34.38'
        },
        {
          date: 'Sep 22, 2026',
          merchant: "PAYROLL DEPOSIT",
          type: 'Direct Deposit',
          amount: '$2,150.00'
        },
        {
          date: 'Sep 22, 2026',
          merchant: "MCDONALD'S",
          type: 'Card Purchase',
          amount: '-$15.83'
        },
        {
          date: 'Sep 22, 2026',
          merchant: "BEST BUY",
          type: 'Card Purchase',
          amount: '-$230.06'
        },
        {
          date: 'Sep 22, 2026',
          merchant: "WALMART",
          type: 'Card Purchase',
          amount: '-$47.50'
        },
        {
          date: 'Sep 22, 2026',
          merchant: "CVS PHARMACY",
          type: 'Card Purchase',
          amount: '-$22.28'
        },
        {
          date: 'Sep 21, 2026',
          merchant: "TARGET",
          type: 'Card Purchase',
          amount: '-$69.38'
        },
        {
          date: 'Sep 21, 2026',
          merchant: "COSTCO WHOLESALE",
          type: 'Card Purchase',
          amount: '-$206.03'
        },
        {
          date: 'Sep 21, 2026',
          merchant: "ATM WITHDRAWAL",
          type: 'Cash Withdrawal',
          amount: '-$142.15'
        },
        {
          date: 'Sep 21, 2026',
          merchant: "BEST BUY",
          type: 'Card Purchase',
          amount: '-$142.33'
        },
        {
          date: 'Sep 21, 2026',
          merchant: "ATM WITHDRAWAL",
          type: 'Cash Withdrawal',
          amount: '-$66.98'
        },
        {
          date: 'Sep 21, 2026',
          merchant: "BEST BUY",
          type: 'Card Purchase',
          amount: '-$267.06'
        },
        {
          date: 'Sep 20, 2026',
          merchant: "COSTCO WHOLESALE",
          type: 'Card Purchase',
          amount: '-$107.18'
        },
        {
          date: 'Sep 20, 2026',
          merchant: "UBER",
          type: 'Card Purchase',
          amount: '-$21.20'
        },
        {
          date: 'Sep 20, 2026',
          merchant: "BEST BUY",
          type: 'Card Purchase',
          amount: '-$201.44'
        },
        {
          date: 'Sep 20, 2026',
          merchant: "COSTCO WHOLESALE",
          type: 'Card Purchase',
          amount: '-$202.15'
        },
        {
          date: 'Sep 20, 2026',
          merchant: "SHELL OIL",
          type: 'Fuel Purchase',
          amount: '-$51.15'
        },
        {
          date: 'Sep 19, 2026',
          merchant: "STARBUCKS",
          type: 'Card Purchase',
          amount: '-$6.04'
        },
        {
          date: 'Sep 19, 2026',
          merchant: "CHIPOTLE",
          type: 'Card Purchase',
          amount: '-$18.18'
        },
        {
          date: 'Sep 19, 2026',
          merchant: "BEST BUY",
          type: 'Card Purchase',
          amount: '-$86.96'
        },
        {
          date: 'Sep 19, 2026',
          merchant: "CHIPOTLE",
          type: 'Card Purchase',
          amount: '-$18.59'
        },
        {
          date: 'Sep 19, 2026',
          merchant: "AMAZON.COM",
          type: 'Card Purchase',
          amount: '-$71.61'
        },
        {
          date: 'Sep 18, 2026',
          merchant: "PAYROLL DEPOSIT",
          type: 'Direct Deposit',
          amount: '$2,150.00'
        },
        {
          date: 'Sep 18, 2026',
          merchant: "ATM WITHDRAWAL",
          type: 'Cash Withdrawal',
          amount: '-$166.56'
        },
        {
          date: 'Sep 18, 2026',
          merchant: "HEB GROCERY",
          type: 'Card Purchase',
          amount: '-$96.83'
        },
        {
          date: 'Sep 18, 2026',
          merchant: "MCDONALD'S",
          type: 'Card Purchase',
          amount: '-$8.16'
        },
        {
          date: 'Sep 18, 2026',
          merchant: "HEB GROCERY",
          type: 'Card Purchase',
          amount: '-$92.98'
        },
        {
          date: 'Sep 18, 2026',
          merchant: "SHELL OIL",
          type: 'Fuel Purchase',
          amount: '-$60.94'
        },
        {
          date: 'Sep 16, 2026',
          merchant: "WHOLE FOODS",
          type: 'Card Purchase',
          amount: '-$113.05'
        },
        {
          date: 'Sep 16, 2026',
          merchant: "CVS PHARMACY",
          type: 'Card Purchase',
          amount: '-$27.74'
        },
        {
          date: 'Sep 16, 2026',
          merchant: "SHELL OIL",
          type: 'Fuel Purchase',
          amount: '-$50.46'
        },
        {
          date: 'Sep 16, 2026',
          merchant: "STARBUCKS",
          type: 'Card Purchase',
          amount: '-$8.01'
        },
        {
          date: 'Sep 16, 2026',
          merchant: "SHELL OIL",
          type: 'Fuel Purchase',
          amount: '-$59.79'
        },
        {
          date: 'Sep 15, 2026',
          merchant: "NETFLIX",
          type: 'Subscription',
          amount: '-$22.99'
        },
        {
          date: 'Sep 15, 2026',
          merchant: "HEB GROCERY",
          type: 'Card Purchase',
          amount: '-$105.14'
        },
        {
          date: 'Sep 15, 2026',
          merchant: "UBER",
          type: 'Card Purchase',
          amount: '-$17.94'
        },
        {
          date: 'Sep 15, 2026',
          merchant: "MCDONALD'S",
          type: 'Card Purchase',
          amount: '-$9.84'
        },
        {
          date: 'Sep 15, 2026',
          merchant: "BEST BUY",
          type: 'Card Purchase',
          amount: '-$72.86'
        },
        {
          date: 'Sep 15, 2026',
          merchant: "AMAZON.COM",
          type: 'Card Purchase',
          amount: '-$33.45'
        },
        {
          date: 'Sep 14, 2026',
          merchant: "WHOLE FOODS",
          type: 'Card Purchase',
          amount: '-$102.98'
        },
        {
          date: 'Sep 14, 2026',
          merchant: "STARBUCKS",
          type: 'Card Purchase',
          amount: '-$9.37'
        },
        {
          date: 'Sep 14, 2026',
          merchant: "AMAZON.COM",
          type: 'Card Purchase',
          amount: '-$71.47'
        },
        {
          date: 'Sep 14, 2026',
          merchant: "MCDONALD'S",
          type: 'Card Purchase',
          amount: '-$14.53'
        },
        {
          date: 'Sep 14, 2026',
          merchant: "CVS PHARMACY",
          type: 'Card Purchase',
          amount: '-$17.90'
        },
        {
          date: 'Sep 12, 2026',
          merchant: "COSTCO WHOLESALE",
          type: 'Card Purchase',
          amount: '-$158.59'
        },
        {
          date: 'Sep 12, 2026',
          merchant: "UBER",
          type: 'Card Purchase',
          amount: '-$22.41'
        },
        {
          date: 'Sep 12, 2026',
          merchant: "AMAZON.COM",
          type: 'Card Purchase',
          amount: '-$66.48'
        },
        {
          date: 'Sep 12, 2026',
          merchant: "STARBUCKS",
          type: 'Card Purchase',
          amount: '-$7.23'
        },
        {
          date: 'Sep 12, 2026',
          merchant: "UBER",
          type: 'Card Purchase',
          amount: '-$15.84'
        },
        {
          date: 'Sep 12, 2026',
          merchant: "DOORDASH",
          type: 'Card Purchase',
          amount: '-$26.79'
        },
        {
          date: 'Sep 11, 2026',
          merchant: "CVS PHARMACY",
          type: 'Card Purchase',
          amount: '-$17.77'
        },
        {
          date: 'Sep 11, 2026',
          merchant: "BEST BUY",
          type: 'Card Purchase',
          amount: '-$199.44'
        },
        {
          date: 'Sep 11, 2026',
          merchant: "STARBUCKS",
          type: 'Card Purchase',
          amount: '-$9.85'
        },
        {
          date: 'Sep 11, 2026',
          merchant: "HEB GROCERY",
          type: 'Card Purchase',
          amount: '-$107.78'
        },
        {
          date: 'Sep 11, 2026',
          merchant: "AMAZON.COM",
          type: 'Card Purchase',
          amount: '-$20.87'
        },
        {
          date: 'Sep 10, 2026',
          merchant: "BEST BUY",
          type: 'Card Purchase',
          amount: '-$103.34'
        },
        {
          date: 'Sep 10, 2026',
          merchant: "SHELL OIL",
          type: 'Fuel Purchase',
          amount: '-$48.12'
        },
        {
          date: 'Sep 10, 2026',
          merchant: "STARBUCKS",
          type: 'Card Purchase',
          amount: '-$7.85'
        },
        {
          date: 'Sep 10, 2026',
          merchant: "CVS PHARMACY",
          type: 'Card Purchase',
          amount: '-$36.62'
        },
        {
          date: 'Sep 10, 2026',
          merchant: "HEB GROCERY",
          type: 'Card Purchase',
          amount: '-$78.32'
        },
        {
          date: 'Sep 8, 2026',
          merchant: "APPLE.COM/BILL",
          type: 'Subscription',
          amount: '-$11.99'
        },
        {
          date: 'Sep 8, 2026',
          merchant: "MCDONALD'S",
          type: 'Card Purchase',
          amount: '-$10.17'
        },
        {
          date: 'Sep 8, 2026',
          merchant: "WHOLE FOODS",
          type: 'Card Purchase',
          amount: '-$119.19'
        },
        {
          date: 'Sep 8, 2026',
          merchant: "WALMART",
          type: 'Card Purchase',
          amount: '-$51.52'
        },
        {
          date: 'Sep 8, 2026',
          merchant: "HEB GROCERY",
          type: 'Card Purchase',
          amount: '-$130.40'
        },
        {
          date: 'Sep 7, 2026',
          merchant: "HEB GROCERY",
          type: 'Card Purchase',
          amount: '-$107.28'
        },
        {
          date: 'Sep 7, 2026',
          merchant: "CHIPOTLE",
          type: 'Card Purchase',
          amount: '-$17.49'
        },
        {
          date: 'Sep 7, 2026',
          merchant: "CVS PHARMACY",
          type: 'Card Purchase',
          amount: '-$37.33'
        },
        {
          date: 'Sep 7, 2026',
          merchant: "TARGET",
          type: 'Card Purchase',
          amount: '-$62.27'
        },
        {
          date: 'Sep 7, 2026',
          merchant: "SHELL OIL",
          type: 'Fuel Purchase',
          amount: '-$40.95'
        },
        {
          date: 'Sep 5, 2026',
          merchant: "WHOLE FOODS",
          type: 'Card Purchase',
          amount: '-$43.30'
        },
        {
          date: 'Sep 5, 2026',
          merchant: "HEB GROCERY",
          type: 'Card Purchase',
          amount: '-$64.54'
        },
        {
          date: 'Sep 5, 2026',
          merchant: "AMAZON.COM",
          type: 'Card Purchase',
          amount: '-$84.65'
        },
        {
          date: 'Sep 5, 2026',
          merchant: "TARGET",
          type: 'Card Purchase',
          amount: '-$89.36'
        },
        {
          date: 'Sep 5, 2026',
          merchant: "CVS PHARMACY",
          type: 'Card Purchase',
          amount: '-$14.39'
        },
        {
          date: 'Sep 4, 2026',
          merchant: "COSTCO WHOLESALE",
          type: 'Card Purchase',
          amount: '-$179.94'
        },
        {
          date: 'Sep 4, 2026',
          merchant: "TARGET",
          type: 'Card Purchase',
          amount: '-$94.29'
        },
        {
          date: 'Sep 4, 2026',
          merchant: "ATM WITHDRAWAL",
          type: 'Cash Withdrawal',
          amount: '-$139.73'
        },
        {
          date: 'Sep 4, 2026',
          merchant: "STARBUCKS",
          type: 'Card Purchase',
          amount: '-$7.37'
        },
        {
          date: 'Sep 4, 2026',
          merchant: "DOORDASH",
          type: 'Card Purchase',
          amount: '-$31.53'
        },
        {
          date: 'Sep 3, 2026',
          merchant: "HEB GROCERY",
          type: 'Card Purchase',
          amount: '-$82.15'
        },
        {
          date: 'Sep 3, 2026',
          merchant: "MCDONALD'S",
          type: 'Card Purchase',
          amount: '-$8.59'
        },
        {
          date: 'Sep 3, 2026',
          merchant: "CVS PHARMACY",
          type: 'Card Purchase',
          amount: '-$26.50'
        },
        {
          date: 'Sep 3, 2026',
          merchant: "MCDONALD'S",
          type: 'Card Purchase',
          amount: '-$9.48'
        },
        {
          date: 'Sep 3, 2026',
          merchant: "HEB GROCERY",
          type: 'Card Purchase',
          amount: '-$151.40'
        },
        {
          date: 'Sep 3, 2026',
          merchant: "UBER",
          type: 'Card Purchase',
          amount: '-$20.17'
        },
        {
          date: 'Sep 2, 2026',
          merchant: "RENT PAYMENT",
          type: 'Bill Payment',
          amount: '-$1,450.00'
        },
        {
          date: 'Sep 2, 2026',
          merchant: "VERIZON WIRELESS",
          type: 'Bill Payment',
          amount: '-$89.99'
        },
        {
          date: 'Sep 2, 2026',
          merchant: "STARBUCKS",
          type: 'Card Purchase',
          amount: '-$7.64'
        },
        {
          date: 'Sep 2, 2026',
          merchant: "STARBUCKS",
          type: 'Card Purchase',
          amount: '-$7.59'
        },
        {
          date: 'Sep 2, 2026',
          merchant: "TARGET",
          type: 'Card Purchase',
          amount: '-$77.56'
        },
        {
          date: 'Aug 30, 2026',
          merchant: "AMAZON.COM",
          type: 'Card Purchase',
          amount: '-$72.98'
        },
        {
          date: 'Aug 30, 2026',
          merchant: "DOORDASH",
          type: 'Card Purchase',
          amount: '-$39.96'
        },
        {
          date: 'Aug 30, 2026',
          merchant: "SHELL OIL",
          type: 'Fuel Purchase',
          amount: '-$63.17'
        },
        {
          date: 'Aug 30, 2026',
          merchant: "DOORDASH",
          type: 'Card Purchase',
          amount: '-$33.94'
        },
        {
          date: 'Aug 30, 2026',
          merchant: "AMAZON.COM",
          type: 'Card Purchase',
          amount: '-$82.69'
        },
        {
          date: 'Aug 30, 2026',
          merchant: "MCDONALD'S",
          type: 'Card Purchase',
          amount: '-$15.78'
        },
        {
          date: 'Aug 29, 2026',
          merchant: "ATM WITHDRAWAL",
          type: 'Cash Withdrawal',
          amount: '-$60.98'
        },
        {
          date: 'Aug 29, 2026',
          merchant: "CVS PHARMACY",
          type: 'Card Purchase',
          amount: '-$36.14'
        },
        {
          date: 'Aug 29, 2026',
          merchant: "BEST BUY",
          type: 'Card Purchase',
          amount: '-$220.72'
        },
        {
          date: 'Aug 29, 2026',
          merchant: "COSTCO WHOLESALE",
          type: 'Card Purchase',
          amount: '-$106.42'
        },
        {
          date: 'Aug 29, 2026',
          merchant: "HEB GROCERY",
          type: 'Card Purchase',
          amount: '-$93.16'
        },
        {
          date: 'Aug 28, 2026',
          merchant: "SHELL OIL",
          type: 'Fuel Purchase',
          amount: '-$43.91'
        },
        {
          date: 'Aug 28, 2026',
          merchant: "DOORDASH",
          type: 'Card Purchase',
          amount: '-$21.19'
        },
        {
          date: 'Aug 28, 2026',
          merchant: "MCDONALD'S",
          type: 'Card Purchase',
          amount: '-$15.24'
        },
        {
          date: 'Aug 28, 2026',
          merchant: "BEST BUY",
          type: 'Card Purchase',
          amount: '-$273.90'
        },
        {
          date: 'Aug 28, 2026',
          merchant: "MCDONALD'S",
          type: 'Card Purchase',
          amount: '-$13.64'
        },
        {
          date: 'Aug 27, 2026',
          merchant: "TARGET",
          type: 'Card Purchase',
          amount: '-$35.52'
        },
        {
          date: 'Aug 27, 2026',
          merchant: "STARBUCKS",
          type: 'Card Purchase',
          amount: '-$8.07'
        },
        {
          date: 'Aug 27, 2026',
          merchant: "WALMART",
          type: 'Card Purchase',
          amount: '-$87.60'
        },
        {
          date: 'Aug 27, 2026',
          merchant: "DOORDASH",
          type: 'Card Purchase',
          amount: '-$28.70'
        },
        {
          date: 'Aug 27, 2026',
          merchant: "DOORDASH",
          type: 'Card Purchase',
          amount: '-$31.62'
        },
        {
          date: 'Aug 27, 2026',
          merchant: "WHOLE FOODS",
          type: 'Card Purchase',
          amount: '-$106.24'
        },
        {
          date: 'Aug 25, 2026',
          merchant: "PAYROLL DEPOSIT",
          type: 'Direct Deposit',
          amount: '$2,150.00'
        },
        {
          date: 'Aug 25, 2026',
          merchant: "SHELL OIL",
          type: 'Fuel Purchase',
          amount: '-$44.92'
        },
        {
          date: 'Aug 25, 2026',
          merchant: "MCDONALD'S",
          type: 'Card Purchase',
          amount: '-$8.23'
        },
        {
          date: 'Aug 25, 2026',
          merchant: "CHIPOTLE",
          type: 'Card Purchase',
          amount: '-$18.52'
        },
        {
          date: 'Aug 25, 2026',
          merchant: "SHELL OIL",
          type: 'Fuel Purchase',
          amount: '-$47.05'
        },
        {
          date: 'Aug 24, 2026',
          merchant: "CVS PHARMACY",
          type: 'Card Purchase',
          amount: '-$37.15'
        },
        {
          date: 'Aug 24, 2026',
          merchant: "COSTCO WHOLESALE",
          type: 'Card Purchase',
          amount: '-$193.81'
        },
        {
          date: 'Aug 24, 2026',
          merchant: "STARBUCKS",
          type: 'Card Purchase',
          amount: '-$11.76'
        },
        {
          date: 'Aug 24, 2026',
          merchant: "ATM WITHDRAWAL",
          type: 'Cash Withdrawal',
          amount: '-$96.25'
        },
        {
          date: 'Aug 24, 2026',
          merchant: "SHELL OIL",
          type: 'Fuel Purchase',
          amount: '-$51.09'
        },
        {
          date: 'Aug 24, 2026',
          merchant: "COSTCO WHOLESALE",
          type: 'Card Purchase',
          amount: '-$117.23'
        },
        {
          date: 'Aug 22, 2026',
          merchant: "PAYROLL DEPOSIT",
          type: 'Direct Deposit',
          amount: '$2,150.00'
        },
        {
          date: 'Aug 22, 2026',
          merchant: "AMAZON.COM",
          type: 'Card Purchase',
          amount: '-$22.89'
        },
        {
          date: 'Aug 22, 2026',
          merchant: "WHOLE FOODS",
          type: 'Card Purchase',
          amount: '-$116.03'
        },
        {
          date: 'Aug 22, 2026',
          merchant: "TARGET",
          type: 'Card Purchase',
          amount: '-$88.02'
        },
        {
          date: 'Aug 22, 2026',
          merchant: "WALMART",
          type: 'Card Purchase',
          amount: '-$80.08'
        },
        {
          date: 'Aug 21, 2026',
          merchant: "COSTCO WHOLESALE",
          type: 'Card Purchase',
          amount: '-$105.20'
        },
        {
          date: 'Aug 21, 2026',
          merchant: "HEB GROCERY",
          type: 'Card Purchase',
          amount: '-$133.43'
        },
        {
          date: 'Aug 21, 2026',
          merchant: "AMAZON.COM",
          type: 'Card Purchase',
          amount: '-$32.71'
        },
        {
          date: 'Aug 21, 2026',
          merchant: "HEB GROCERY",
          type: 'Card Purchase',
          amount: '-$81.97'
        },
        {
          date: 'Aug 21, 2026',
          merchant: "CVS PHARMACY",
          type: 'Card Purchase',
          amount: '-$30.91'
        },
        {
          date: 'Aug 21, 2026',
          merchant: "CVS PHARMACY",
          type: 'Card Purchase',
          amount: '-$31.42'
        },
        {
          date: 'Aug 20, 2026',
          merchant: "CVS PHARMACY",
          type: 'Card Purchase',
          amount: '-$19.44'
        },
        {
          date: 'Aug 20, 2026',
          merchant: "MCDONALD'S",
          type: 'Card Purchase',
          amount: '-$15.23'
        },
        {
          date: 'Aug 20, 2026',
          merchant: "WHOLE FOODS",
          type: 'Card Purchase',
          amount: '-$68.11'
        },
        {
          date: 'Aug 20, 2026',
          merchant: "BEST BUY",
          type: 'Card Purchase',
          amount: '-$120.25'
        },
        {
          date: 'Aug 20, 2026',
          merchant: "WALMART",
          type: 'Card Purchase',
          amount: '-$93.24'
        },
        {
          date: 'Aug 18, 2026',
          merchant: "PAYROLL DEPOSIT",
          type: 'Direct Deposit',
          amount: '$2,150.00'
        },
        {
          date: 'Aug 18, 2026',
          merchant: "AMAZON.COM",
          type: 'Card Purchase',
          amount: '-$22.49'
        },
        {
          date: 'Aug 18, 2026',
          merchant: "WALMART",
          type: 'Card Purchase',
          amount: '-$94.00'
        },
        {
          date: 'Aug 18, 2026',
          merchant: "WALMART",
          type: 'Card Purchase',
          amount: '-$61.26'
        },
        {
          date: 'Aug 18, 2026',
          merchant: "AMAZON.COM",
          type: 'Card Purchase',
          amount: '-$18.84'
        },
        {
          date: 'Aug 18, 2026',
          merchant: "ATM WITHDRAWAL",
          type: 'Cash Withdrawal',
          amount: '-$103.45'
        },
        {
          date: 'Aug 16, 2026',
          merchant: "DOORDASH",
          type: 'Card Purchase',
          amount: '-$38.85'
        },
        {
          date: 'Aug 16, 2026',
          merchant: "HEB GROCERY",
          type: 'Card Purchase',
          amount: '-$110.96'
        },
        {
          date: 'Aug 16, 2026',
          merchant: "STARBUCKS",
          type: 'Card Purchase',
          amount: '-$9.02'
        },
        {
          date: 'Aug 16, 2026',
          merchant: "CHIPOTLE",
          type: 'Card Purchase',
          amount: '-$18.85'
        },
        {
          date: 'Aug 16, 2026',
          merchant: "WALMART",
          type: 'Card Purchase',
          amount: '-$48.48'
        },
        {
          date: 'Aug 15, 2026',
          merchant: "NETFLIX",
          type: 'Subscription',
          amount: '-$22.99'
        },
        {
          date: 'Aug 15, 2026',
          merchant: "CHIPOTLE",
          type: 'Card Purchase',
          amount: '-$19.61'
        },
        {
          date: 'Aug 15, 2026',
          merchant: "AMAZON.COM",
          type: 'Card Purchase',
          amount: '-$21.60'
        },
        {
          date: 'Aug 15, 2026',
          merchant: "DOORDASH",
          type: 'Card Purchase',
          amount: '-$30.76'
        },
        {
          date: 'Aug 15, 2026',
          merchant: "DOORDASH",
          type: 'Card Purchase',
          amount: '-$25.17'
        },
        {
          date: 'Aug 15, 2026',
          merchant: "TARGET",
          type: 'Card Purchase',
          amount: '-$125.41'
        },
        {
          date: 'Aug 14, 2026',
          merchant: "CHIPOTLE",
          type: 'Card Purchase',
          amount: '-$16.36'
        },
        {
          date: 'Aug 14, 2026',
          merchant: "HEB GROCERY",
          type: 'Card Purchase',
          amount: '-$107.30'
        },
        {
          date: 'Aug 14, 2026',
          merchant: "WHOLE FOODS",
          type: 'Card Purchase',
          amount: '-$47.80'
        },
        {
          date: 'Aug 14, 2026',
          merchant: "WALMART",
          type: 'Card Purchase',
          amount: '-$56.77'
        },
        {
          date: 'Aug 14, 2026',
          merchant: "ATM WITHDRAWAL",
          type: 'Cash Withdrawal',
          amount: '-$129.71'
        },
        {
          date: 'Aug 12, 2026',
          merchant: "SHELL OIL",
          type: 'Fuel Purchase',
          amount: '-$49.86'
        },
        {
          date: 'Aug 12, 2026',
          merchant: "CVS PHARMACY",
          type: 'Card Purchase',
          amount: '-$13.59'
        },
        {
          date: 'Aug 12, 2026',
          merchant: "UBER",
          type: 'Card Purchase',
          amount: '-$14.30'
        },
        {
          date: 'Aug 12, 2026',
          merchant: "WHOLE FOODS",
          type: 'Card Purchase',
          amount: '-$71.42'
        },
        {
          date: 'Aug 12, 2026',
          merchant: "DOORDASH",
          type: 'Card Purchase',
          amount: '-$29.16'
        },
        {
          date: 'Aug 12, 2026',
          merchant: "BEST BUY",
          type: 'Card Purchase',
          amount: '-$190.28'
        },
        {
          date: 'Aug 10, 2026',
          merchant: "STARBUCKS",
          type: 'Card Purchase',
          amount: '-$6.83'
        },
        {
          date: 'Aug 10, 2026',
          merchant: "WALMART",
          type: 'Card Purchase',
          amount: '-$76.81'
        },
        {
          date: 'Aug 10, 2026',
          merchant: "COSTCO WHOLESALE",
          type: 'Card Purchase',
          amount: '-$122.98'
        },
        {
          date: 'Aug 10, 2026',
          merchant: "DOORDASH",
          type: 'Card Purchase',
          amount: '-$33.33'
        },
        {
          date: 'Aug 10, 2026',
          merchant: "STARBUCKS",
          type: 'Card Purchase',
          amount: '-$9.00'
        },
        {
          date: 'Aug 8, 2026',
          merchant: "APPLE.COM/BILL",
          type: 'Subscription',
          amount: '-$11.99'
        },
        {
          date: 'Aug 8, 2026',
          merchant: "CHIPOTLE",
          type: 'Card Purchase',
          amount: '-$12.93'
        },
        {
          date: 'Aug 8, 2026',
          merchant: "CVS PHARMACY",
          type: 'Card Purchase',
          amount: '-$33.89'
        },
        {
          date: 'Aug 8, 2026',
          merchant: "WHOLE FOODS",
          type: 'Card Purchase',
          amount: '-$99.13'
        },
        {
          date: 'Aug 8, 2026',
          merchant: "CHIPOTLE",
          type: 'Card Purchase',
          amount: '-$12.62'
        },
        {
          date: 'Aug 5, 2026',
          merchant: "ATM WITHDRAWAL",
          type: 'Cash Withdrawal',
          amount: '-$65.96'
        },
        {
          date: 'Aug 5, 2026',
          merchant: "WALMART",
          type: 'Card Purchase',
          amount: '-$67.21'
        },
        {
          date: 'Aug 5, 2026',
          merchant: "MCDONALD'S",
          type: 'Card Purchase',
          amount: '-$8.35'
        },
        {
          date: 'Aug 5, 2026',
          merchant: "AMAZON.COM",
          type: 'Card Purchase',
          amount: '-$75.83'
        },
        {
          date: 'Aug 5, 2026',
          merchant: "SHELL OIL",
          type: 'Fuel Purchase',
          amount: '-$42.49'
        },
        {
          date: 'Aug 3, 2026',
          merchant: "TARGET",
          type: 'Card Purchase',
          amount: '-$100.01'
        },
        {
          date: 'Aug 3, 2026',
          merchant: "WHOLE FOODS",
          type: 'Card Purchase',
          amount: '-$106.08'
        },
        {
          date: 'Aug 3, 2026',
          merchant: "MCDONALD'S",
          type: 'Card Purchase',
          amount: '-$12.13'
        },
        {
          date: 'Aug 3, 2026',
          merchant: "DOORDASH",
          type: 'Card Purchase',
          amount: '-$30.83'
        },
        {
          date: 'Aug 3, 2026',
          merchant: "MCDONALD'S",
          type: 'Card Purchase',
          amount: '-$13.66'
        },
        {
          date: 'Aug 3, 2026',
          merchant: "TARGET",
          type: 'Card Purchase',
          amount: '-$109.44'
        },
        {
          date: 'Aug 1, 2026',
          merchant: "RENT PAYMENT",
          type: 'Bill Payment',
          amount: '-$1,450.00'
        },
        {
          date: 'Aug 1, 2026',
          merchant: "VERIZON WIRELESS",
          type: 'Bill Payment',
          amount: '-$89.99'
        },
        {
          date: 'Aug 1, 2026',
          merchant: "ELECTRIC COMPANY",
          type: 'Bill Payment',
          amount: '-$118.22'
        },
        {
          date: 'Aug 1, 2026',
          merchant: "AMAZON.COM",
          type: 'Card Purchase',
          amount: '-$41.45'
        },
        {
          date: 'Aug 1, 2026',
          merchant: "WALMART",
          type: 'Card Purchase',
          amount: '-$107.82'
        },
        {
          date: 'Jul 30, 2026',
          merchant: "HEB GROCERY",
          type: 'Card Purchase',
          amount: '-$128.85'
        },
        {
          date: 'Jul 30, 2026',
          merchant: "ATM WITHDRAWAL",
          type: 'Cash Withdrawal',
          amount: '-$114.39'
        },
        {
          date: 'Jul 30, 2026',
          merchant: "MCDONALD'S",
          type: 'Card Purchase',
          amount: '-$9.00'
        },
        {
          date: 'Jul 30, 2026',
          merchant: "SHELL OIL",
          type: 'Fuel Purchase',
          amount: '-$41.40'
        },
        {
          date: 'Jul 30, 2026',
          merchant: "CVS PHARMACY",
          type: 'Card Purchase',
          amount: '-$27.45'
        },
        {
          date: 'Jul 30, 2026',
          merchant: "COSTCO WHOLESALE",
          type: 'Card Purchase',
          amount: '-$105.63'
        },
        {
          date: 'Jul 29, 2026',
          merchant: "WALMART",
          type: 'Card Purchase',
          amount: '-$51.31'
        },
        {
          date: 'Jul 29, 2026',
          merchant: "WALMART",
          type: 'Card Purchase',
          amount: '-$107.70'
        },
        {
          date: 'Jul 29, 2026',
          merchant: "STARBUCKS",
          type: 'Card Purchase',
          amount: '-$9.62'
        },
        {
          date: 'Jul 29, 2026',
          merchant: "BEST BUY",
          type: 'Card Purchase',
          amount: '-$131.95'
        },
        {
          date: 'Jul 29, 2026',
          merchant: "TARGET",
          type: 'Card Purchase',
          amount: '-$34.82'
        },
        {
          date: 'Jul 28, 2026',
          merchant: "SHELL OIL",
          type: 'Fuel Purchase',
          amount: '-$48.93'
        },
        {
          date: 'Jul 28, 2026',
          merchant: "DOORDASH",
          type: 'Card Purchase',
          amount: '-$30.68'
        },
        {
          date: 'Jul 28, 2026',
          merchant: "BEST BUY",
          type: 'Card Purchase',
          amount: '-$93.38'
        },
        {
          date: 'Jul 28, 2026',
          merchant: "COSTCO WHOLESALE",
          type: 'Card Purchase',
          amount: '-$140.08'
        },
        {
          date: 'Jul 28, 2026',
          merchant: "CHIPOTLE",
          type: 'Card Purchase',
          amount: '-$17.84'
        },
        {
          date: 'Jul 26, 2026',
          merchant: "CHIPOTLE",
          type: 'Card Purchase',
          amount: '-$13.07'
        },
        {
          date: 'Jul 26, 2026',
          merchant: "SHELL OIL",
          type: 'Fuel Purchase',
          amount: '-$56.76'
        },
        {
          date: 'Jul 26, 2026',
          merchant: "WHOLE FOODS",
          type: 'Card Purchase',
          amount: '-$111.66'
        },
        {
          date: 'Jul 26, 2026',
          merchant: "DOORDASH",
          type: 'Card Purchase',
          amount: '-$28.25'
        },
        {
          date: 'Jul 26, 2026',
          merchant: "UBER",
          type: 'Card Purchase',
          amount: '-$20.92'
        },
        {
          date: 'Jul 25, 2026',
          merchant: "PAYROLL DEPOSIT",
          type: 'Direct Deposit',
          amount: '$2,150.00'
        },
        {
          date: 'Jul 25, 2026',
          merchant: "CVS PHARMACY",
          type: 'Card Purchase',
          amount: '-$25.80'
        },
        {
          date: 'Jul 25, 2026',
          merchant: "HEB GROCERY",
          type: 'Card Purchase',
          amount: '-$76.79'
        },
        {
          date: 'Jul 25, 2026',
          merchant: "COSTCO WHOLESALE",
          type: 'Card Purchase',
          amount: '-$125.26'
        },
        {
          date: 'Jul 25, 2026',
          merchant: "WHOLE FOODS",
          type: 'Card Purchase',
          amount: '-$105.47'
        },
        {
          date: 'Jul 23, 2026',
          merchant: "HEB GROCERY",
          type: 'Card Purchase',
          amount: '-$77.44'
        },
        {
          date: 'Jul 23, 2026',
          merchant: "BEST BUY",
          type: 'Card Purchase',
          amount: '-$270.91'
        },
        {
          date: 'Jul 23, 2026',
          merchant: "HEB GROCERY",
          type: 'Card Purchase',
          amount: '-$112.19'
        },
        {
          date: 'Jul 23, 2026',
          merchant: "CHIPOTLE",
          type: 'Card Purchase',
          amount: '-$18.29'
        },
        {
          date: 'Jul 23, 2026',
          merchant: "COSTCO WHOLESALE",
          type: 'Card Purchase',
          amount: '-$141.87'
        },
        {
          date: 'Jul 22, 2026',
          merchant: "PAYROLL DEPOSIT",
          type: 'Direct Deposit',
          amount: '$2,150.00'
        },
        {
          date: 'Jul 22, 2026',
          merchant: "AMAZON.COM",
          type: 'Card Purchase',
          amount: '-$28.22'
        },
        {
          date: 'Jul 22, 2026',
          merchant: "COSTCO WHOLESALE",
          type: 'Card Purchase',
          amount: '-$135.35'
        },
        {
          date: 'Jul 22, 2026',
          merchant: "WHOLE FOODS",
          type: 'Card Purchase',
          amount: '-$57.80'
        },
        {
          date: 'Jul 22, 2026',
          merchant: "DOORDASH",
          type: 'Card Purchase',
          amount: '-$28.07'
        },
        {
          date: 'Jul 20, 2026',
          merchant: "WALMART",
          type: 'Card Purchase',
          amount: '-$66.69'
        },
        {
          date: 'Jul 20, 2026',
          merchant: "HEB GROCERY",
          type: 'Card Purchase',
          amount: '-$143.88'
        },
        {
          date: 'Jul 20, 2026',
          merchant: "WHOLE FOODS",
          type: 'Card Purchase',
          amount: '-$87.53'
        },
        {
          date: 'Jul 20, 2026',
          merchant: "TARGET",
          type: 'Card Purchase',
          amount: '-$102.11'
        },
        {
          date: 'Jul 20, 2026',
          merchant: "AMAZON.COM",
          type: 'Card Purchase',
          amount: '-$24.55'
        },
        {
          date: 'Jul 18, 2026',
          merchant: "PAYROLL DEPOSIT",
          type: 'Direct Deposit',
          amount: '$2,150.00'
        },
        {
          date: 'Jul 18, 2026',
          merchant: "CVS PHARMACY",
          type: 'Card Purchase',
          amount: '-$34.45'
        },
        {
          date: 'Jul 18, 2026',
          merchant: "CVS PHARMACY",
          type: 'Card Purchase',
          amount: '-$17.71'
        },
        {
          date: 'Jul 18, 2026',
          merchant: "CHIPOTLE",
          type: 'Card Purchase',
          amount: '-$14.42'
        },
        {
          date: 'Jul 18, 2026',
          merchant: "AMAZON.COM",
          type: 'Card Purchase',
          amount: '-$86.49'
        },
        {
          date: 'Jul 18, 2026',
          merchant: "WHOLE FOODS",
          type: 'Card Purchase',
          amount: '-$52.96'
        },
        {
          date: 'Jul 16, 2026',
          merchant: "AMAZON.COM",
          type: 'Card Purchase',
          amount: '-$53.26'
        },
        {
          date: 'Jul 16, 2026',
          merchant: "SHELL OIL",
          type: 'Fuel Purchase',
          amount: '-$52.85'
        },
        {
          date: 'Jul 16, 2026',
          merchant: "CHIPOTLE",
          type: 'Card Purchase',
          amount: '-$18.67'
        },
        {
          date: 'Jul 16, 2026',
          merchant: "BEST BUY",
          type: 'Card Purchase',
          amount: '-$139.18'
        },
        {
          date: 'Jul 16, 2026',
          merchant: "WHOLE FOODS",
          type: 'Card Purchase',
          amount: '-$62.78'
        },
        {
          date: 'Jul 15, 2026',
          merchant: "NETFLIX",
          type: 'Subscription',
          amount: '-$22.99'
        },
        {
          date: 'Jul 15, 2026',
          merchant: "AMAZON.COM",
          type: 'Card Purchase',
          amount: '-$22.61'
        },
        {
          date: 'Jul 15, 2026',
          merchant: "ATM WITHDRAWAL",
          type: 'Cash Withdrawal',
          amount: '-$103.30'
        },
        {
          date: 'Jul 15, 2026',
          merchant: "CVS PHARMACY",
          type: 'Card Purchase',
          amount: '-$36.09'
        },
        {
          date: 'Jul 15, 2026',
          merchant: "SHELL OIL",
          type: 'Fuel Purchase',
          amount: '-$46.60'
        },
        {
          date: 'Jul 15, 2026',
          merchant: "CHIPOTLE",
          type: 'Card Purchase',
          amount: '-$15.93'
        },
        {
          date: 'Jul 14, 2026',
          merchant: "STARBUCKS",
          type: 'Card Purchase',
          amount: '-$11.60'
        },
        {
          date: 'Jul 14, 2026',
          merchant: "HEB GROCERY",
          type: 'Card Purchase',
          amount: '-$132.04'
        },
        {
          date: 'Jul 14, 2026',
          merchant: "WHOLE FOODS",
          type: 'Card Purchase',
          amount: '-$95.76'
        },
        {
          date: 'Jul 14, 2026',
          merchant: "SHELL OIL",
          type: 'Fuel Purchase',
          amount: '-$41.60'
        },
        {
          date: 'Jul 14, 2026',
          merchant: "CVS PHARMACY",
          type: 'Card Purchase',
          amount: '-$30.78'
        },
        {
          date: 'Jul 12, 2026',
          merchant: "AMAZON.COM",
          type: 'Card Purchase',
          amount: '-$38.03'
        },
        {
          date: 'Jul 12, 2026',
          merchant: "CHIPOTLE",
          type: 'Card Purchase',
          amount: '-$13.51'
        },
        {
          date: 'Jul 12, 2026',
          merchant: "CHIPOTLE",
          type: 'Card Purchase',
          amount: '-$19.99'
        },
        {
          date: 'Jul 12, 2026',
          merchant: "WALMART",
          type: 'Card Purchase',
          amount: '-$93.77'
        },
        {
          date: 'Jul 12, 2026',
          merchant: "DOORDASH",
          type: 'Card Purchase',
          amount: '-$39.71'
        },
        {
          date: 'Jul 12, 2026',
          merchant: "CVS PHARMACY",
          type: 'Card Purchase',
          amount: '-$24.71'
        },
        {
          date: 'Jul 11, 2026',
          merchant: "SHELL OIL",
          type: 'Fuel Purchase',
          amount: '-$59.86'
        },
        {
          date: 'Jul 11, 2026',
          merchant: "HEB GROCERY",
          type: 'Card Purchase',
          amount: '-$131.16'
        },
        {
          date: 'Jul 11, 2026',
          merchant: "STARBUCKS",
          type: 'Card Purchase',
          amount: '-$9.41'
        },
        {
          date: 'Jul 11, 2026',
          merchant: "STARBUCKS",
          type: 'Card Purchase',
          amount: '-$7.81'
        },
        {
          date: 'Jul 11, 2026',
          merchant: "TARGET",
          type: 'Card Purchase',
          amount: '-$34.17'
        },
        {
          date: 'Jul 9, 2026',
          merchant: "AMAZON.COM",
          type: 'Card Purchase',
          amount: '-$82.08'
        },
        {
          date: 'Jul 9, 2026',
          merchant: "WHOLE FOODS",
          type: 'Card Purchase',
          amount: '-$70.31'
        },
        {
          date: 'Jul 9, 2026',
          merchant: "TARGET",
          type: 'Card Purchase',
          amount: '-$96.90'
        },
        {
          date: 'Jul 9, 2026',
          merchant: "STARBUCKS",
          type: 'Card Purchase',
          amount: '-$7.18'
        },
        {
          date: 'Jul 9, 2026',
          merchant: "MCDONALD'S",
          type: 'Card Purchase',
          amount: '-$8.54'
        },
        {
          date: 'Jul 9, 2026',
          merchant: "SHELL OIL",
          type: 'Fuel Purchase',
          amount: '-$58.99'
        },
        {
          date: 'Jul 8, 2026',
          merchant: "APPLE.COM/BILL",
          type: 'Subscription',
          amount: '-$11.99'
        },
        {
          date: 'Jul 8, 2026',
          merchant: "STARBUCKS",
          type: 'Card Purchase',
          amount: '-$11.43'
        },
        {
          date: 'Jul 8, 2026',
          merchant: "HEB GROCERY",
          type: 'Card Purchase',
          amount: '-$82.10'
        },
        {
          date: 'Jul 8, 2026',
          merchant: "BEST BUY",
          type: 'Card Purchase',
          amount: '-$72.95'
        },
        {
          date: 'Jul 8, 2026',
          merchant: "CHIPOTLE",
          type: 'Card Purchase',
          amount: '-$12.50'
        },
        {
          date: 'Jul 5, 2026',
          merchant: "CHIPOTLE",
          type: 'Card Purchase',
          amount: '-$14.25'
        },
        {
          date: 'Jul 5, 2026',
          merchant: "DOORDASH",
          type: 'Card Purchase',
          amount: '-$34.07'
        },
        {
          date: 'Jul 5, 2026',
          merchant: "COSTCO WHOLESALE",
          type: 'Card Purchase',
          amount: '-$167.76'
        },
        {
          date: 'Jul 5, 2026',
          merchant: "ATM WITHDRAWAL",
          type: 'Cash Withdrawal',
          amount: '-$63.70'
        },
        {
          date: 'Jul 5, 2026',
          merchant: "CHIPOTLE",
          type: 'Card Purchase',
          amount: '-$14.53'
        },
        {
          date: 'Jul 3, 2026',
          merchant: "SHELL OIL",
          type: 'Fuel Purchase',
          amount: '-$41.79'
        },
        {
          date: 'Jul 3, 2026',
          merchant: "WHOLE FOODS",
          type: 'Card Purchase',
          amount: '-$77.72'
        },
        {
          date: 'Jul 3, 2026',
          merchant: "ATM WITHDRAWAL",
          type: 'Cash Withdrawal',
          amount: '-$78.52'
        },
        {
          date: 'Jul 3, 2026',
          merchant: "TARGET",
          type: 'Card Purchase',
          amount: '-$93.18'
        },
        {
          date: 'Jul 3, 2026',
          merchant: "WALMART",
          type: 'Card Purchase',
          amount: '-$46.72'
        },
        {
          date: 'Jul 3, 2026',
          merchant: "WHOLE FOODS",
          type: 'Card Purchase',
          amount: '-$80.51'
        },
        {
          date: 'Jul 1, 2026',
          merchant: "RENT PAYMENT",
          type: 'Bill Payment',
          amount: '-$1,450.00'
        },
        {
          date: 'Jul 1, 2026',
          merchant: "VERIZON WIRELESS",
          type: 'Bill Payment',
          amount: '-$89.99'
        },
        {
          date: 'Jul 1, 2026',
          merchant: "ELECTRIC COMPANY",
          type: 'Bill Payment',
          amount: '-$109.80'
        },
        {
          date: 'Jul 1, 2026',
          merchant: "BEST BUY",
          type: 'Card Purchase',
          amount: '-$271.48'
        },
        {
          date: 'Jul 1, 2026',
          merchant: "BEST BUY",
          type: 'Card Purchase',
          amount: '-$217.81'
        },
        {
          date: 'Jun 29, 2026',
          merchant: "CVS PHARMACY",
          type: 'Card Purchase',
          amount: '-$23.18'
        },
        {
          date: 'Jun 29, 2026',
          merchant: "CHIPOTLE",
          type: 'Card Purchase',
          amount: '-$17.41'
        },
        {
          date: 'Jun 29, 2026',
          merchant: "WALMART",
          type: 'Card Purchase',
          amount: '-$52.97'
        },
        {
          date: 'Jun 29, 2026',
          merchant: "CVS PHARMACY",
          type: 'Card Purchase',
          amount: '-$18.32'
        },
        {
          date: 'Jun 29, 2026',
          merchant: "STARBUCKS",
          type: 'Card Purchase',
          amount: '-$8.53'
        },
        {
          date: 'Jun 28, 2026',
          merchant: "WALMART",
          type: 'Card Purchase',
          amount: '-$91.82'
        },
        {
          date: 'Jun 28, 2026',
          merchant: "TARGET",
          type: 'Card Purchase',
          amount: '-$48.05'
        },
        {
          date: 'Jun 28, 2026',
          merchant: "MCDONALD'S",
          type: 'Card Purchase',
          amount: '-$14.83'
        },
        {
          date: 'Jun 28, 2026',
          merchant: "CHIPOTLE",
          type: 'Card Purchase',
          amount: '-$16.43'
        },
        {
          date: 'Jun 28, 2026',
          merchant: "AMAZON.COM",
          type: 'Card Purchase',
          amount: '-$72.63'
        },
        {
          date: 'Jun 27, 2026',
          merchant: "ATM WITHDRAWAL",
          type: 'Cash Withdrawal',
          amount: '-$123.84'
        },
        {
          date: 'Jun 27, 2026',
          merchant: "SHELL OIL",
          type: 'Fuel Purchase',
          amount: '-$64.07'
        },
        {
          date: 'Jun 27, 2026',
          merchant: "COSTCO WHOLESALE",
          type: 'Card Purchase',
          amount: '-$132.87'
        },
        {
          date: 'Jun 27, 2026',
          merchant: "BEST BUY",
          type: 'Card Purchase',
          amount: '-$267.53'
        },
        {
          date: 'Jun 27, 2026',
          merchant: "COSTCO WHOLESALE",
          type: 'Card Purchase',
          amount: '-$133.47'
        },
        {
          date: 'Jun 27, 2026',
          merchant: "BEST BUY",
          type: 'Card Purchase',
          amount: '-$216.27'
        },
        {
          date: 'Jun 25, 2026',
          merchant: "PAYROLL DEPOSIT",
          type: 'Direct Deposit',
          amount: '$2,150.00'
        },
        {
          date: 'Jun 25, 2026',
          merchant: "AMAZON.COM",
          type: 'Card Purchase',
          amount: '-$67.14'
        },
        {
          date: 'Jun 25, 2026',
          merchant: "HEB GROCERY",
          type: 'Card Purchase',
          amount: '-$120.21'
        },
        {
          date: 'Jun 25, 2026',
          merchant: "DOORDASH",
          type: 'Card Purchase',
          amount: '-$38.72'
        },
        {
          date: 'Jun 25, 2026',
          merchant: "DOORDASH",
          type: 'Card Purchase',
          amount: '-$24.72'
        },
        {
          date: 'Jun 24, 2026',
          merchant: "WALMART",
          type: 'Card Purchase',
          amount: '-$97.87'
        },
        {
          date: 'Jun 24, 2026',
          merchant: "AMAZON.COM",
          type: 'Card Purchase',
          amount: '-$32.62'
        },
        {
          date: 'Jun 24, 2026',
          merchant: "DOORDASH",
          type: 'Card Purchase',
          amount: '-$31.01'
        },
        {
          date: 'Jun 24, 2026',
          merchant: "UBER",
          type: 'Card Purchase',
          amount: '-$25.17'
        },
        {
          date: 'Jun 24, 2026',
          merchant: "UBER",
          type: 'Card Purchase',
          amount: '-$19.44'
        },
        {
          date: 'Jun 24, 2026',
          merchant: "DOORDASH",
          type: 'Card Purchase',
          amount: '-$25.06'
        },
        {
          date: 'Jun 22, 2026',
          merchant: "PAYROLL DEPOSIT",
          type: 'Direct Deposit',
          amount: '$2,150.00'
        },
        {
          date: 'Jun 22, 2026',
          merchant: "WALMART",
          type: 'Card Purchase',
          amount: '-$49.48'
        },
        {
          date: 'Jun 22, 2026',
          merchant: "MCDONALD'S",
          type: 'Card Purchase',
          amount: '-$10.46'
        },
        {
          date: 'Jun 22, 2026',
          merchant: "STARBUCKS",
          type: 'Card Purchase',
          amount: '-$6.93'
        },
        {
          date: 'Jun 22, 2026',
          merchant: "DOORDASH",
          type: 'Card Purchase',
          amount: '-$18.08'
        },
        {
          date: 'Jun 20, 2026',
          merchant: "COSTCO WHOLESALE",
          type: 'Card Purchase',
          amount: '-$117.88'
        },
        {
          date: 'Jun 20, 2026',
          merchant: "WALMART",
          type: 'Card Purchase',
          amount: '-$55.22'
        },
        {
          date: 'Jun 20, 2026',
          merchant: "WALMART",
          type: 'Card Purchase',
          amount: '-$92.76'
        },
        {
          date: 'Jun 20, 2026',
          merchant: "WHOLE FOODS",
          type: 'Card Purchase',
          amount: '-$116.51'
        },
        {
          date: 'Jun 20, 2026',
          merchant: "DOORDASH",
          type: 'Card Purchase',
          amount: '-$32.38'
        },
        {
          date: 'Jun 18, 2026',
          merchant: "PAYROLL DEPOSIT",
          type: 'Direct Deposit',
          amount: '$2,150.00'
        },
        {
          date: 'Jun 18, 2026',
          merchant: "TARGET",
          type: 'Card Purchase',
          amount: '-$48.10'
        },
        {
          date: 'Jun 18, 2026',
          merchant: "TARGET",
          type: 'Card Purchase',
          amount: '-$30.39'
        },
        {
          date: 'Jun 18, 2026',
          merchant: "AMAZON.COM",
          type: 'Card Purchase',
          amount: '-$40.11'
        },
        {
          date: 'Jun 18, 2026',
          merchant: "AMAZON.COM",
          type: 'Card Purchase',
          amount: '-$38.46'
        },
        {
          date: 'Jun 18, 2026',
          merchant: "TARGET",
          type: 'Card Purchase',
          amount: '-$103.96'
        },
        {
          date: 'Jun 17, 2026',
          merchant: "HEB GROCERY",
          type: 'Card Purchase',
          amount: '-$75.78'
        },
        {
          date: 'Jun 17, 2026',
          merchant: "CHIPOTLE",
          type: 'Card Purchase',
          amount: '-$15.83'
        },
        {
          date: 'Jun 17, 2026',
          merchant: "BEST BUY",
          type: 'Card Purchase',
          amount: '-$297.15'
        },
        {
          date: 'Jun 17, 2026',
          merchant: "CHIPOTLE",
          type: 'Card Purchase',
          amount: '-$14.67'
        },
        {
          date: 'Jun 17, 2026',
          merchant: "SHELL OIL",
          type: 'Fuel Purchase',
          amount: '-$51.42'
        },
        {
          date: 'Jun 15, 2026',
          merchant: "NETFLIX",
          type: 'Subscription',
          amount: '-$22.99'
        },
        {
          date: 'Jun 15, 2026',
          merchant: "AMAZON.COM",
          type: 'Card Purchase',
          amount: '-$28.84'
        },
        {
          date: 'Jun 15, 2026',
          merchant: "WHOLE FOODS",
          type: 'Card Purchase',
          amount: '-$111.17'
        },
        {
          date: 'Jun 15, 2026',
          merchant: "TARGET",
          type: 'Card Purchase',
          amount: '-$80.16'
        },
        {
          date: 'Jun 15, 2026',
          merchant: "ATM WITHDRAWAL",
          type: 'Cash Withdrawal',
          amount: '-$157.10'
        },
        {
          date: 'Jun 15, 2026',
          merchant: "ATM WITHDRAWAL",
          type: 'Cash Withdrawal',
          amount: '-$82.64'
        },
        {
          date: 'Jun 14, 2026',
          merchant: "UBER",
          type: 'Card Purchase',
          amount: '-$19.53'
        },
        {
          date: 'Jun 14, 2026',
          merchant: "WALMART",
          type: 'Card Purchase',
          amount: '-$47.80'
        },
        {
          date: 'Jun 14, 2026',
          merchant: "TARGET",
          type: 'Card Purchase',
          amount: '-$59.90'
        },
        {
          date: 'Jun 14, 2026',
          merchant: "HEB GROCERY",
          type: 'Card Purchase',
          amount: '-$93.49'
        },
        {
          date: 'Jun 14, 2026',
          merchant: "WALMART",
          type: 'Card Purchase',
          amount: '-$107.26'
        },
        {
          date: 'Jun 12, 2026',
          merchant: "HEB GROCERY",
          type: 'Card Purchase',
          amount: '-$136.88'
        },
        {
          date: 'Jun 12, 2026',
          merchant: "CHIPOTLE",
          type: 'Card Purchase',
          amount: '-$15.30'
        },
        {
          date: 'Jun 12, 2026',
          merchant: "SHELL OIL",
          type: 'Fuel Purchase',
          amount: '-$59.28'
        },
        {
          date: 'Jun 12, 2026',
          merchant: "AMAZON.COM",
          type: 'Card Purchase',
          amount: '-$87.45'
        },
        {
          date: 'Jun 12, 2026',
          merchant: "STARBUCKS",
          type: 'Card Purchase',
          amount: '-$11.89'
        },
        {
          date: 'Jun 12, 2026',
          merchant: "UBER",
          type: 'Card Purchase',
          amount: '-$19.07'
        },
        {
          date: 'Jun 10, 2026',
          merchant: "STARBUCKS",
          type: 'Card Purchase',
          amount: '-$6.62'
        },
        {
          date: 'Jun 10, 2026',
          merchant: "WHOLE FOODS",
          type: 'Card Purchase',
          amount: '-$94.27'
        },
        {
          date: 'Jun 10, 2026',
          merchant: "HEB GROCERY",
          type: 'Card Purchase',
          amount: '-$137.75'
        },
        {
          date: 'Jun 10, 2026',
          merchant: "UBER",
          type: 'Card Purchase',
          amount: '-$27.10'
        },
        {
          date: 'Jun 10, 2026',
          merchant: "CVS PHARMACY",
          type: 'Card Purchase',
          amount: '-$32.93'
        },
        {
          date: 'Jun 9, 2026',
          merchant: "BEST BUY",
          type: 'Card Purchase',
          amount: '-$77.02'
        },
        {
          date: 'Jun 9, 2026',
          merchant: "BEST BUY",
          type: 'Card Purchase',
          amount: '-$53.23'
        },
        {
          date: 'Jun 9, 2026',
          merchant: "SHELL OIL",
          type: 'Fuel Purchase',
          amount: '-$54.55'
        },
        {
          date: 'Jun 9, 2026',
          merchant: "UBER",
          type: 'Card Purchase',
          amount: '-$13.54'
        },
        {
          date: 'Jun 9, 2026',
          merchant: "TARGET",
          type: 'Card Purchase',
          amount: '-$60.12'
        },
        {
          date: 'Jun 9, 2026',
          merchant: "CVS PHARMACY",
          type: 'Card Purchase',
          amount: '-$22.26'
        },
        {
          date: 'Jun 7, 2026',
          merchant: "COSTCO WHOLESALE",
          type: 'Card Purchase',
          amount: '-$207.19'
        },
        {
          date: 'Jun 7, 2026',
          merchant: "AMAZON.COM",
          type: 'Card Purchase',
          amount: '-$67.95'
        },
        {
          date: 'Jun 7, 2026',
          merchant: "HEB GROCERY",
          type: 'Card Purchase',
          amount: '-$67.66'
        },
        {
          date: 'Jun 7, 2026',
          merchant: "WALMART",
          type: 'Card Purchase',
          amount: '-$83.87'
        },
        {
          date: 'Jun 7, 2026',
          merchant: "TARGET",
          type: 'Card Purchase',
          amount: '-$124.96'
        },
        {
          date: 'Jun 5, 2026',
          merchant: "HEB GROCERY",
          type: 'Card Purchase',
          amount: '-$84.96'
        },
        {
          date: 'Jun 5, 2026',
          merchant: "MCDONALD'S",
          type: 'Card Purchase',
          amount: '-$13.61'
        },
        {
          date: 'Jun 5, 2026',
          merchant: "WALMART",
          type: 'Card Purchase',
          amount: '-$45.04'
        },
        {
          date: 'Jun 5, 2026',
          merchant: "DOORDASH",
          type: 'Card Purchase',
          amount: '-$39.72'
        },
        {
          date: 'Jun 5, 2026',
          merchant: "ATM WITHDRAWAL",
          type: 'Cash Withdrawal',
          amount: '-$138.17'
        },
        {
          date: 'Jun 3, 2026',
          merchant: "HEB GROCERY",
          type: 'Card Purchase',
          amount: '-$129.23'
        },
        {
          date: 'Jun 3, 2026',
          merchant: "BEST BUY",
          type: 'Card Purchase',
          amount: '-$110.19'
        },
        {
          date: 'Jun 3, 2026',
          merchant: "TARGET",
          type: 'Card Purchase',
          amount: '-$72.07'
        },
        {
          date: 'Jun 3, 2026',
          merchant: "CHIPOTLE",
          type: 'Card Purchase',
          amount: '-$18.34'
        },
        {
          date: 'Jun 3, 2026',
          merchant: "AMAZON.COM",
          type: 'Card Purchase',
          amount: '-$26.50'
        },
        {
          date: 'Jun 3, 2026',
          merchant: "MCDONALD'S",
          type: 'Card Purchase',
          amount: '-$9.91'
        },
        {
          date: 'Jun 1, 2026',
          merchant: "RENT PAYMENT",
          type: 'Bill Payment',
          amount: '-$1,450.00'
        },
        {
          date: 'Jun 1, 2026',
          merchant: "VERIZON WIRELESS",
          type: 'Bill Payment',
          amount: '-$89.99'
        },
        {
          date: 'Jun 1, 2026',
          merchant: "ELECTRIC COMPANY",
          type: 'Bill Payment',
          amount: '-$132.45'
        },
        {
          date: 'Jun 1, 2026',
          merchant: "ATM WITHDRAWAL",
          type: 'Cash Withdrawal',
          amount: '-$189.02'
        },
        {
          date: 'Jun 1, 2026',
          merchant: "ATM WITHDRAWAL",
          type: 'Cash Withdrawal',
          amount: '-$159.26'
        },
        {
          date: 'May 30, 2026',
          merchant: "UBER",
          type: 'Card Purchase',
          amount: '-$20.83'
        },
        {
          date: 'May 30, 2026',
          merchant: "WHOLE FOODS",
          type: 'Card Purchase',
          amount: '-$101.31'
        },
        {
          date: 'May 30, 2026',
          merchant: "TARGET",
          type: 'Card Purchase',
          amount: '-$51.64'
        },
        {
          date: 'May 30, 2026',
          merchant: "SHELL OIL",
          type: 'Fuel Purchase',
          amount: '-$59.73'
        },
        {
          date: 'May 30, 2026',
          merchant: "ATM WITHDRAWAL",
          type: 'Cash Withdrawal',
          amount: '-$160.36'
        },
        {
          date: 'May 30, 2026',
          merchant: "SHELL OIL",
          type: 'Fuel Purchase',
          amount: '-$43.96'
        },
        {
          date: 'May 28, 2026',
          merchant: "CHIPOTLE",
          type: 'Card Purchase',
          amount: '-$13.45'
        },
        {
          date: 'May 28, 2026',
          merchant: "UBER",
          type: 'Card Purchase',
          amount: '-$18.24'
        },
        {
          date: 'May 28, 2026',
          merchant: "BEST BUY",
          type: 'Card Purchase',
          amount: '-$205.17'
        },
        {
          date: 'May 28, 2026',
          merchant: "STARBUCKS",
          type: 'Card Purchase',
          amount: '-$6.87'
        },
        {
          date: 'May 28, 2026',
          merchant: "COSTCO WHOLESALE",
          type: 'Card Purchase',
          amount: '-$116.78'
        },
        {
          date: 'May 27, 2026',
          merchant: "MCDONALD'S",
          type: 'Card Purchase',
          amount: '-$8.59'
        },
        {
          date: 'May 27, 2026',
          merchant: "UBER",
          type: 'Card Purchase',
          amount: '-$27.54'
        },
        {
          date: 'May 27, 2026',
          merchant: "BEST BUY",
          type: 'Card Purchase',
          amount: '-$120.05'
        },
        {
          date: 'May 27, 2026',
          merchant: "ATM WITHDRAWAL",
          type: 'Cash Withdrawal',
          amount: '-$89.11'
        },
        {
          date: 'May 27, 2026',
          merchant: "CVS PHARMACY",
          type: 'Card Purchase',
          amount: '-$30.52'
        },
        {
          date: 'May 27, 2026',
          merchant: "CHIPOTLE",
          type: 'Card Purchase',
          amount: '-$12.16'
        },
        {
          date: 'May 25, 2026',
          merchant: "PAYROLL DEPOSIT",
          type: 'Direct Deposit',
          amount: '$2,150.00'
        },
        {
          date: 'May 25, 2026',
          merchant: "HEB GROCERY",
          type: 'Card Purchase',
          amount: '-$139.73'
        },
        {
          date: 'May 25, 2026',
          merchant: "ATM WITHDRAWAL",
          type: 'Cash Withdrawal',
          amount: '-$175.67'
        },
        {
          date: 'May 25, 2026',
          merchant: "CVS PHARMACY",
          type: 'Card Purchase',
          amount: '-$16.50'
        },
        {
          date: 'May 25, 2026',
          merchant: "COSTCO WHOLESALE",
          type: 'Card Purchase',
          amount: '-$185.02'
        },
        {
          date: 'May 22, 2026',
          merchant: "PAYROLL DEPOSIT",
          type: 'Direct Deposit',
          amount: '$2,150.00'
        },
        {
          date: 'May 22, 2026',
          merchant: "WHOLE FOODS",
          type: 'Card Purchase',
          amount: '-$102.30'
        },
        {
          date: 'May 22, 2026',
          merchant: "CHIPOTLE",
          type: 'Card Purchase',
          amount: '-$16.54'
        },
        {
          date: 'May 22, 2026',
          merchant: "SHELL OIL",
          type: 'Fuel Purchase',
          amount: '-$47.02'
        },
        {
          date: 'May 22, 2026',
          merchant: "CHIPOTLE",
          type: 'Card Purchase',
          amount: '-$13.89'
        },
        {
          date: 'May 20, 2026',
          merchant: "MCDONALD'S",
          type: 'Card Purchase',
          amount: '-$13.17'
        },
        {
          date: 'May 20, 2026',
          merchant: "AMAZON.COM",
          type: 'Card Purchase',
          amount: '-$17.87'
        },
        {
          date: 'May 20, 2026',
          merchant: "WHOLE FOODS",
          type: 'Card Purchase',
          amount: '-$73.41'
        },
        {
          date: 'May 20, 2026',
          merchant: "DOORDASH",
          type: 'Card Purchase',
          amount: '-$34.48'
        },
        {
          date: 'May 20, 2026',
          merchant: "WALMART",
          type: 'Card Purchase',
          amount: '-$53.70'
        },
        {
          date: 'May 18, 2026',
          merchant: "PAYROLL DEPOSIT",
          type: 'Direct Deposit',
          amount: '$2,150.00'
        },
        {
          date: 'May 18, 2026',
          merchant: "AMAZON.COM",
          type: 'Card Purchase',
          amount: '-$70.18'
        },
        {
          date: 'May 18, 2026',
          merchant: "HEB GROCERY",
          type: 'Card Purchase',
          amount: '-$142.48'
        },
        {
          date: 'May 18, 2026',
          merchant: "COSTCO WHOLESALE",
          type: 'Card Purchase',
          amount: '-$199.60'
        },
        {
          date: 'May 18, 2026',
          merchant: "STARBUCKS",
          type: 'Card Purchase',
          amount: '-$11.02'
        },
        {
          date: 'May 18, 2026',
          merchant: "AMAZON.COM",
          type: 'Card Purchase',
          amount: '-$27.75'
        },
        {
          date: 'May 16, 2026',
          merchant: "SHELL OIL",
          type: 'Fuel Purchase',
          amount: '-$46.53'
        },
        {
          date: 'May 16, 2026',
          merchant: "MCDONALD'S",
          type: 'Card Purchase',
          amount: '-$10.62'
        },
        {
          date: 'May 16, 2026',
          merchant: "CVS PHARMACY",
          type: 'Card Purchase',
          amount: '-$13.98'
        },
        {
          date: 'May 16, 2026',
          merchant: "DOORDASH",
          type: 'Card Purchase',
          amount: '-$22.34'
        },
        {
          date: 'May 16, 2026',
          merchant: "ATM WITHDRAWAL",
          type: 'Cash Withdrawal',
          amount: '-$103.60'
        },
        {
          date: 'May 15, 2026',
          merchant: "NETFLIX",
          type: 'Subscription',
          amount: '-$22.99'
        },
        {
          date: 'May 15, 2026',
          merchant: "UBER",
          type: 'Card Purchase',
          amount: '-$22.09'
        },
        {
          date: 'May 15, 2026',
          merchant: "CVS PHARMACY",
          type: 'Card Purchase',
          amount: '-$35.28'
        },
        {
          date: 'May 15, 2026',
          merchant: "ATM WITHDRAWAL",
          type: 'Cash Withdrawal',
          amount: '-$176.29'
        },
        {
          date: 'May 15, 2026',
          merchant: "BEST BUY",
          type: 'Card Purchase',
          amount: '-$60.05'
        },
        {
          date: 'May 15, 2026',
          merchant: "AMAZON.COM",
          type: 'Card Purchase',
          amount: '-$41.98'
        },
        {
          date: 'May 13, 2026',
          merchant: "MCDONALD'S",
          type: 'Card Purchase',
          amount: '-$9.05'
        },
        {
          date: 'May 13, 2026',
          merchant: "AMAZON.COM",
          type: 'Card Purchase',
          amount: '-$21.58'
        },
        {
          date: 'May 13, 2026',
          merchant: "CHIPOTLE",
          type: 'Card Purchase',
          amount: '-$15.97'
        },
        {
          date: 'May 13, 2026',
          merchant: "HEB GROCERY",
          type: 'Card Purchase',
          amount: '-$132.25'
        },
        {
          date: 'May 13, 2026',
          merchant: "HEB GROCERY",
          type: 'Card Purchase',
          amount: '-$98.23'
        },
        {
          date: 'May 11, 2026',
          merchant: "UBER",
          type: 'Card Purchase',
          amount: '-$26.31'
        },
        {
          date: 'May 11, 2026',
          merchant: "COSTCO WHOLESALE",
          type: 'Card Purchase',
          amount: '-$158.69'
        },
        {
          date: 'May 11, 2026',
          merchant: "TARGET",
          type: 'Card Purchase',
          amount: '-$59.66'
        },
        {
          date: 'May 11, 2026',
          merchant: "WHOLE FOODS",
          type: 'Card Purchase',
          amount: '-$93.86'
        },
        {
          date: 'May 11, 2026',
          merchant: "DOORDASH",
          type: 'Card Purchase',
          amount: '-$23.08'
        },
        {
          date: 'May 9, 2026',
          merchant: "CVS PHARMACY",
          type: 'Card Purchase',
          amount: '-$20.17'
        },
        {
          date: 'May 9, 2026',
          merchant: "CHIPOTLE",
          type: 'Card Purchase',
          amount: '-$14.77'
        },
        {
          date: 'May 9, 2026',
          merchant: "HEB GROCERY",
          type: 'Card Purchase',
          amount: '-$64.11'
        },
        {
          date: 'May 9, 2026',
          merchant: "SHELL OIL",
          type: 'Fuel Purchase',
          amount: '-$62.93'
        },
        {
          date: 'May 9, 2026',
          merchant: "CVS PHARMACY",
          type: 'Card Purchase',
          amount: '-$31.56'
        },
        {
          date: 'May 9, 2026',
          merchant: "CVS PHARMACY",
          type: 'Card Purchase',
          amount: '-$15.56'
        },
        {
          date: 'May 8, 2026',
          merchant: "APPLE.COM/BILL",
          type: 'Subscription',
          amount: '-$11.99'
        },
        {
          date: 'May 8, 2026',
          merchant: "BEST BUY",
          type: 'Card Purchase',
          amount: '-$217.87'
        },
        {
          date: 'May 8, 2026',
          merchant: "WHOLE FOODS",
          type: 'Card Purchase',
          amount: '-$74.97'
        },
        {
          date: 'May 8, 2026',
          merchant: "HEB GROCERY",
          type: 'Card Purchase',
          amount: '-$116.84'
        },
        {
          date: 'May 8, 2026',
          merchant: "AMAZON.COM",
          type: 'Card Purchase',
          amount: '-$26.82'
        },
        {
          date: 'May 6, 2026',
          merchant: "WHOLE FOODS",
          type: 'Card Purchase',
          amount: '-$51.91'
        },
        {
          date: 'May 6, 2026',
          merchant: "UBER",
          type: 'Card Purchase',
          amount: '-$19.48'
        },
        {
          date: 'May 6, 2026',
          merchant: "COSTCO WHOLESALE",
          type: 'Card Purchase',
          amount: '-$196.94'
        },
        {
          date: 'May 6, 2026',
          merchant: "AMAZON.COM",
          type: 'Card Purchase',
          amount: '-$60.21'
        },
        {
          date: 'May 6, 2026',
          merchant: "SHELL OIL",
          type: 'Fuel Purchase',
          amount: '-$46.26'
        },
        {
          date: 'May 6, 2026',
          merchant: "AMAZON.COM",
          type: 'Card Purchase',
          amount: '-$61.57'
        },
        {
          date: 'May 4, 2026',
          merchant: "COSTCO WHOLESALE",
          type: 'Card Purchase',
          amount: '-$119.67'
        },
        {
          date: 'May 4, 2026',
          merchant: "STARBUCKS",
          type: 'Card Purchase',
          amount: '-$6.98'
        },
        {
          date: 'May 4, 2026',
          merchant: "ATM WITHDRAWAL",
          type: 'Cash Withdrawal',
          amount: '-$161.22'
        },
        {
          date: 'May 4, 2026',
          merchant: "AMAZON.COM",
          type: 'Card Purchase',
          amount: '-$59.55'
        },
        {
          date: 'May 4, 2026',
          merchant: "UBER",
          type: 'Card Purchase',
          amount: '-$14.26'
        },
        {
          date: 'May 2, 2026',
          merchant: "RENT PAYMENT",
          type: 'Bill Payment',
          amount: '-$1,450.00'
        },
        {
          date: 'May 2, 2026',
          merchant: "VERIZON WIRELESS",
          type: 'Bill Payment',
          amount: '-$89.99'
        },
        {
          date: 'May 2, 2026',
          merchant: "DOORDASH",
          type: 'Card Purchase',
          amount: '-$25.20'
        },
        {
          date: 'May 2, 2026',
          merchant: "WALMART",
          type: 'Card Purchase',
          amount: '-$61.93'
        },
        {
          date: 'May 2, 2026',
          merchant: "STARBUCKS",
          type: 'Card Purchase',
          amount: '-$7.18'
        },
        {
          date: 'May 1, 2026',
          merchant: "RENT PAYMENT",
          type: 'Bill Payment',
          amount: '-$1,450.00'
        },
        {
          date: 'May 1, 2026',
          merchant: "VERIZON WIRELESS",
          type: 'Bill Payment',
          amount: '-$89.99'
        },
        {
          date: 'May 1, 2026',
          merchant: "ELECTRIC COMPANY",
          type: 'Bill Payment',
          amount: '-$118.22'
        },
        {
          date: 'May 1, 2026',
          merchant: "COSTCO WHOLESALE",
          type: 'Card Purchase',
          amount: '-$93.75'
        },
        {
          date: 'May 1, 2026',
          merchant: "ATM WITHDRAWAL",
          type: 'Cash Withdrawal',
          amount: '-$175.71'
        },
        {
          date: 'Apr 30, 2026',
          merchant: "AMAZON.COM",
          type: 'Card Purchase',
          amount: '-$36.56'
        },
        {
          date: 'Apr 30, 2026',
          merchant: "SHELL OIL",
          type: 'Fuel Purchase',
          amount: '-$56.82'
        },
        {
          date: 'Apr 30, 2026',
          merchant: "BEST BUY",
          type: 'Card Purchase',
          amount: '-$161.22'
        },
        {
          date: 'Apr 30, 2026',
          merchant: "HEB GROCERY",
          type: 'Card Purchase',
          amount: '-$130.19'
        },
        {
          date: 'Apr 30, 2026',
          merchant: "TARGET",
          type: 'Card Purchase',
          amount: '-$51.53'
        },
        {
          date: 'Apr 30, 2026',
          merchant: "COSTCO WHOLESALE",
          type: 'Card Purchase',
          amount: '-$97.20'
        },
        {
          date: 'Apr 28, 2026',
          merchant: "CVS PHARMACY",
          type: 'Card Purchase',
          amount: '-$16.12'
        },
        {
          date: 'Apr 28, 2026',
          merchant: "CVS PHARMACY",
          type: 'Card Purchase',
          amount: '-$37.22'
        },
        {
          date: 'Apr 28, 2026',
          merchant: "CHIPOTLE",
          type: 'Card Purchase',
          amount: '-$16.15'
        },
        {
          date: 'Apr 28, 2026',
          merchant: "ATM WITHDRAWAL",
          type: 'Cash Withdrawal',
          amount: '-$102.67'
        },
        {
          date: 'Apr 28, 2026',
          merchant: "HEB GROCERY",
          type: 'Card Purchase',
          amount: '-$66.61'
        },
        {
          date: 'Apr 26, 2026',
          merchant: "SHELL OIL",
          type: 'Fuel Purchase',
          amount: '-$56.90'
        },
        {
          date: 'Apr 26, 2026',
          merchant: "UBER",
          type: 'Card Purchase',
          amount: '-$14.34'
        },
        {
          date: 'Apr 26, 2026',
          merchant: "WHOLE FOODS",
          type: 'Card Purchase',
          amount: '-$69.03'
        },
        {
          date: 'Apr 26, 2026',
          merchant: "WHOLE FOODS",
          type: 'Card Purchase',
          amount: '-$64.51'
        },
        {
          date: 'Apr 26, 2026',
          merchant: "CHIPOTLE",
          type: 'Card Purchase',
          amount: '-$15.83'
        },
        {
          date: 'Apr 24, 2026',
          merchant: "TARGET",
          type: 'Card Purchase',
          amount: '-$49.19'
        },
        {
          date: 'Apr 24, 2026',
          merchant: "TARGET",
          type: 'Card Purchase',
          amount: '-$36.35'
        },
        {
          date: 'Apr 24, 2026',
          merchant: "MCDONALD'S",
          type: 'Card Purchase',
          amount: '-$9.90'
        },
        {
          date: 'Apr 24, 2026',
          merchant: "CVS PHARMACY",
          type: 'Card Purchase',
          amount: '-$18.76'
        },
        {
          date: 'Apr 24, 2026',
          merchant: "HEB GROCERY",
          type: 'Card Purchase',
          amount: '-$87.53'
        },
        {
          date: 'Apr 24, 2026',
          merchant: "SHELL OIL",
          type: 'Fuel Purchase',
          amount: '-$49.64'
        },
        {
          date: 'Apr 22, 2026',
          merchant: "PAYROLL DEPOSIT",
          type: 'Direct Deposit',
          amount: '$2,150.00'
        },
        {
          date: 'Apr 22, 2026',
          merchant: "MCDONALD'S",
          type: 'Card Purchase',
          amount: '-$9.91'
        },
        {
          date: 'Apr 22, 2026',
          merchant: "CVS PHARMACY",
          type: 'Card Purchase',
          amount: '-$32.27'
        },
        {
          date: 'Apr 22, 2026',
          merchant: "STARBUCKS",
          type: 'Card Purchase',
          amount: '-$6.11'
        },
        {
          date: 'Apr 22, 2026',
          merchant: "SHELL OIL",
          type: 'Fuel Purchase',
          amount: '-$57.05'
        },
        {
          date: 'Apr 20, 2026',
          merchant: "STARBUCKS",
          type: 'Card Purchase',
          amount: '-$11.22'
        },
        {
          date: 'Apr 20, 2026',
          merchant: "WALMART",
          type: 'Card Purchase',
          amount: '-$95.26'
        },
        {
          date: 'Apr 20, 2026',
          merchant: "WALMART",
          type: 'Card Purchase',
          amount: '-$104.52'
        },
        {
          date: 'Apr 20, 2026',
          merchant: "BEST BUY",
          type: 'Card Purchase',
          amount: '-$143.61'
        },
        {
          date: 'Apr 20, 2026',
          merchant: "BEST BUY",
          type: 'Card Purchase',
          amount: '-$252.55'
        },
        {
          date: 'Apr 18, 2026',
          merchant: "PAYROLL DEPOSIT",
          type: 'Direct Deposit',
          amount: '$2,150.00'
        },
        {
          date: 'Apr 18, 2026',
          merchant: "CVS PHARMACY",
          type: 'Card Purchase',
          amount: '-$26.00'
        },
        {
          date: 'Apr 18, 2026',
          merchant: "WALMART",
          type: 'Card Purchase',
          amount: '-$62.44'
        },
        {
          date: 'Apr 18, 2026',
          merchant: "TARGET",
          type: 'Card Purchase',
          amount: '-$100.13'
        },
        {
          date: 'Apr 18, 2026',
          merchant: "AMAZON.COM",
          type: 'Card Purchase',
          amount: '-$59.99'
        },
        {
          date: 'Apr 18, 2026',
          merchant: "WHOLE FOODS",
          type: 'Card Purchase',
          amount: '-$67.08'
        },
        {
          date: 'Apr 16, 2026',
          merchant: "DOORDASH",
          type: 'Card Purchase',
          amount: '-$29.86'
        },
        {
          date: 'Apr 16, 2026',
          merchant: "BEST BUY",
          type: 'Card Purchase',
          amount: '-$50.33'
        },
        {
          date: 'Apr 16, 2026',
          merchant: "DOORDASH",
          type: 'Card Purchase',
          amount: '-$27.24'
        },
        {
          date: 'Apr 16, 2026',
          merchant: "TARGET",
          type: 'Card Purchase',
          amount: '-$108.85'
        },
        {
          date: 'Apr 16, 2026',
          merchant: "BEST BUY",
          type: 'Card Purchase',
          amount: '-$241.49'
        },
        {
          date: 'Apr 14, 2026',
          merchant: "WALMART",
          type: 'Card Purchase',
          amount: '-$91.01'
        },
        {
          date: 'Apr 14, 2026',
          merchant: "CHIPOTLE",
          type: 'Card Purchase',
          amount: '-$18.57'
        },
        {
          date: 'Apr 14, 2026',
          merchant: "AMAZON.COM",
          type: 'Card Purchase',
          amount: '-$77.25'
        },
        {
          date: 'Apr 14, 2026',
          merchant: "WALMART",
          type: 'Card Purchase',
          amount: '-$74.89'
        },
        {
          date: 'Apr 14, 2026',
          merchant: "DOORDASH",
          type: 'Card Purchase',
          amount: '-$24.95'
        },
        {
          date: 'Apr 12, 2026',
          merchant: "MCDONALD'S",
          type: 'Card Purchase',
          amount: '-$11.73'
        },
        {
          date: 'Apr 12, 2026',
          merchant: "COSTCO WHOLESALE",
          type: 'Card Purchase',
          amount: '-$205.79'
        },
        {
          date: 'Apr 12, 2026',
          merchant: "ATM WITHDRAWAL",
          type: 'Cash Withdrawal',
          amount: '-$109.42'
        },
        {
          date: 'Apr 12, 2026',
          merchant: "AMAZON.COM",
          type: 'Card Purchase',
          amount: '-$70.48'
        },
        {
          date: 'Apr 12, 2026',
          merchant: "MCDONALD'S",
          type: 'Card Purchase',
          amount: '-$14.49'
        },
        {
          date: 'Apr 12, 2026',
          merchant: "SHELL OIL",
          type: 'Fuel Purchase',
          amount: '-$54.25'
        },
        {
          date: 'Apr 10, 2026',
          merchant: "AMAZON.COM",
          type: 'Card Purchase',
          amount: '-$67.97'
        },
        {
          date: 'Apr 10, 2026',
          merchant: "UBER",
          type: 'Card Purchase',
          amount: '-$25.44'
        },
        {
          date: 'Apr 10, 2026',
          merchant: "DOORDASH",
          type: 'Card Purchase',
          amount: '-$31.72'
        },
        {
          date: 'Apr 10, 2026',
          merchant: "UBER",
          type: 'Card Purchase',
          amount: '-$15.81'
        },
        {
          date: 'Apr 10, 2026',
          merchant: "MCDONALD'S",
          type: 'Card Purchase',
          amount: '-$15.35'
        },
        {
          date: 'Apr 8, 2026',
          merchant: "APPLE.COM/BILL",
          type: 'Subscription',
          amount: '-$11.99'
        },
        {
          date: 'Apr 8, 2026',
          merchant: "COSTCO WHOLESALE",
          type: 'Card Purchase',
          amount: '-$168.81'
        },
        {
          date: 'Apr 8, 2026',
          merchant: "DOORDASH",
          type: 'Card Purchase',
          amount: '-$31.59'
        },
        {
          date: 'Apr 8, 2026',
          merchant: "WALMART",
          type: 'Card Purchase',
          amount: '-$65.74'
        },
        {
          date: 'Apr 8, 2026',
          merchant: "AMAZON.COM",
          type: 'Card Purchase',
          amount: '-$30.03'
        },
        {
          date: 'Apr 6, 2026',
          merchant: "ATM WITHDRAWAL",
          type: 'Cash Withdrawal',
          amount: '-$89.65'
        },
        {
          date: 'Apr 6, 2026',
          merchant: "ATM WITHDRAWAL",
          type: 'Cash Withdrawal',
          amount: '-$175.22'
        },
        {
          date: 'Apr 6, 2026',
          merchant: "TARGET",
          type: 'Card Purchase',
          amount: '-$65.90'
        },
        {
          date: 'Apr 6, 2026',
          merchant: "COSTCO WHOLESALE",
          type: 'Card Purchase',
          amount: '-$199.96'
        },
        {
          date: 'Apr 6, 2026',
          merchant: "STARBUCKS",
          type: 'Card Purchase',
          amount: '-$11.58'
        },
        {
          date: 'Apr 6, 2026',
          merchant: "CHIPOTLE",
          type: 'Card Purchase',
          amount: '-$16.98'
        },
        {
          date: 'Apr 4, 2026',
          merchant: "WALMART",
          type: 'Card Purchase',
          amount: '-$109.49'
        },
        {
          date: 'Apr 4, 2026',
          merchant: "UBER",
          type: 'Card Purchase',
          amount: '-$27.38'
        },
        {
          date: 'Apr 4, 2026',
          merchant: "UBER",
          type: 'Card Purchase',
          amount: '-$21.32'
        },
        {
          date: 'Apr 4, 2026',
          merchant: "WHOLE FOODS",
          type: 'Card Purchase',
          amount: '-$82.03'
        },
        {
          date: 'Apr 4, 2026',
          merchant: "CHIPOTLE",
          type: 'Card Purchase',
          amount: '-$19.14'
        },
        {
          date: 'Apr 2, 2026',
          merchant: "RENT PAYMENT",
          type: 'Bill Payment',
          amount: '-$1,450.00'
        },
        {
          date: 'Apr 2, 2026',
          merchant: "VERIZON WIRELESS",
          type: 'Bill Payment',
          amount: '-$89.99'
        },
        {
          date: 'Apr 2, 2026',
          merchant: "WHOLE FOODS",
          type: 'Card Purchase',
          amount: '-$56.18'
        },
        {
          date: 'Apr 2, 2026',
          merchant: "BEST BUY",
          type: 'Card Purchase',
          amount: '-$118.29'
        },
        {
          date: 'Apr 2, 2026',
          merchant: "HEB GROCERY",
          type: 'Card Purchase',
          amount: '-$90.96'
        },
        {
          date: 'Apr 1, 2026',
          merchant: "RENT PAYMENT",
          type: 'Bill Payment',
          amount: '-$1,450.00'
        },
        {
          date: 'Apr 1, 2026',
          merchant: "VERIZON WIRELESS",
          type: 'Bill Payment',
          amount: '-$89.99'
        },
        {
          date: 'Apr 1, 2026',
          merchant: "ELECTRIC COMPANY",
          type: 'Bill Payment',
          amount: '-$110.25'
        },
        {
          date: 'Apr 1, 2026',
          merchant: "MCDONALD'S",
          type: 'Card Purchase',
          amount: '-$9.71'
        },
        {
          date: 'Apr 1, 2026',
          merchant: "COSTCO WHOLESALE",
          type: 'Card Purchase',
          amount: '-$125.68'
        },
        {
          date: 'Mar 30, 2026',
          merchant: "STARBUCKS",
          type: 'Card Purchase',
          amount: '-$11.18'
        },
        {
          date: 'Mar 30, 2026',
          merchant: "BEST BUY",
          type: 'Card Purchase',
          amount: '-$200.24'
        },
        {
          date: 'Mar 30, 2026',
          merchant: "UBER",
          type: 'Card Purchase',
          amount: '-$16.54'
        },
        {
          date: 'Mar 30, 2026',
          merchant: "AMAZON.COM",
          type: 'Card Purchase',
          amount: '-$19.40'
        },
        {
          date: 'Mar 30, 2026',
          merchant: "TARGET",
          type: 'Card Purchase',
          amount: '-$75.17'
        },
        {
          date: 'Mar 30, 2026',
          merchant: "STARBUCKS",
          type: 'Card Purchase',
          amount: '-$6.66'
        },
        {
          date: 'Mar 28, 2026',
          merchant: "UBER",
          type: 'Card Purchase',
          amount: '-$16.36'
        },
        {
          date: 'Mar 28, 2026',
          merchant: "SHELL OIL",
          type: 'Fuel Purchase',
          amount: '-$50.43'
        },
        {
          date: 'Mar 28, 2026',
          merchant: "AMAZON.COM",
          type: 'Card Purchase',
          amount: '-$66.52'
        },
        {
          date: 'Mar 28, 2026',
          merchant: "CVS PHARMACY",
          type: 'Card Purchase',
          amount: '-$38.28'
        },
        {
          date: 'Mar 28, 2026',
          merchant: "WHOLE FOODS",
          type: 'Card Purchase',
          amount: '-$66.70'
        },
        {
          date: 'Mar 26, 2026',
          merchant: "STARBUCKS",
          type: 'Card Purchase',
          amount: '-$8.71'
        },
        {
          date: 'Mar 26, 2026',
          merchant: "ATM WITHDRAWAL",
          type: 'Cash Withdrawal',
          amount: '-$151.79'
        },
        {
          date: 'Mar 26, 2026',
          merchant: "UBER",
          type: 'Card Purchase',
          amount: '-$27.43'
        },
        {
          date: 'Mar 26, 2026',
          merchant: "CVS PHARMACY",
          type: 'Card Purchase',
          amount: '-$38.24'
        },
        {
          date: 'Mar 26, 2026',
          merchant: "COSTCO WHOLESALE",
          type: 'Card Purchase',
          amount: '-$82.29'
        },
        {
          date: 'Mar 24, 2026',
          merchant: "DOORDASH",
          type: 'Card Purchase',
          amount: '-$33.03'
        },
        {
          date: 'Mar 24, 2026',
          merchant: "WHOLE FOODS",
          type: 'Card Purchase',
          amount: '-$113.15'
        },
        {
          date: 'Mar 24, 2026',
          merchant: "WALMART",
          type: 'Card Purchase',
          amount: '-$88.08'
        },
        {
          date: 'Mar 24, 2026',
          merchant: "MCDONALD'S",
          type: 'Card Purchase',
          amount: '-$10.97'
        },
        {
          date: 'Mar 24, 2026',
          merchant: "SHELL OIL",
          type: 'Fuel Purchase',
          amount: '-$44.90'
        },
        {
          date: 'Mar 24, 2026',
          merchant: "MCDONALD'S",
          type: 'Card Purchase',
          amount: '-$16.00'
        },
        {
          date: 'Mar 22, 2026',
          merchant: "PAYROLL DEPOSIT",
          type: 'Direct Deposit',
          amount: '$2,150.00'
        },
        {
          date: 'Mar 22, 2026',
          merchant: "ATM WITHDRAWAL",
          type: 'Cash Withdrawal',
          amount: '-$106.46'
        },
        {
          date: 'Mar 22, 2026',
          merchant: "AMAZON.COM",
          type: 'Card Purchase',
          amount: '-$76.30'
        },
        {
          date: 'Mar 22, 2026',
          merchant: "CVS PHARMACY",
          type: 'Card Purchase',
          amount: '-$29.36'
        },
        {
          date: 'Mar 22, 2026',
          merchant: "WHOLE FOODS",
          type: 'Card Purchase',
          amount: '-$40.96'
        },
        {
          date: 'Mar 20, 2026',
          merchant: "WALMART",
          type: 'Card Purchase',
          amount: '-$41.63'
        },
        {
          date: 'Mar 20, 2026',
          merchant: "ATM WITHDRAWAL",
          type: 'Cash Withdrawal',
          amount: '-$127.58'
        },
        {
          date: 'Mar 20, 2026',
          merchant: "UBER",
          type: 'Card Purchase',
          amount: '-$27.29'
        },
        {
          date: 'Mar 20, 2026',
          merchant: "WHOLE FOODS",
          type: 'Card Purchase',
          amount: '-$67.26'
        },
        {
          date: 'Mar 20, 2026',
          merchant: "COSTCO WHOLESALE",
          type: 'Card Purchase',
          amount: '-$187.43'
        },
        {
          date: 'Mar 18, 2026',
          merchant: "PAYROLL DEPOSIT",
          type: 'Direct Deposit',
          amount: '$2,150.00'
        },
        {
          date: 'Mar 18, 2026',
          merchant: "AMAZON.COM",
          type: 'Card Purchase',
          amount: '-$63.05'
        },
        {
          date: 'Mar 18, 2026',
          merchant: "AMAZON.COM",
          type: 'Card Purchase',
          amount: '-$23.75'
        },
        {
          date: 'Mar 18, 2026',
          merchant: "WHOLE FOODS",
          type: 'Card Purchase',
          amount: '-$99.44'
        },
        {
          date: 'Mar 18, 2026',
          merchant: "AMAZON.COM",
          type: 'Card Purchase',
          amount: '-$77.36'
        },
        {
          date: 'Mar 18, 2026',
          merchant: "WHOLE FOODS",
          type: 'Card Purchase',
          amount: '-$73.83'
        },
        {
          date: 'Mar 16, 2026',
          merchant: "ATM WITHDRAWAL",
          type: 'Cash Withdrawal',
          amount: '-$134.30'
        },
        {
          date: 'Mar 16, 2026',
          merchant: "TARGET",
          type: 'Card Purchase',
          amount: '-$77.51'
        },
        {
          date: 'Mar 16, 2026',
          merchant: "UBER",
          type: 'Card Purchase',
          amount: '-$14.85'
        },
        {
          date: 'Mar 16, 2026',
          merchant: "MCDONALD'S",
          type: 'Card Purchase',
          amount: '-$10.96'
        },
        {
          date: 'Mar 16, 2026',
          merchant: "ATM WITHDRAWAL",
          type: 'Cash Withdrawal',
          amount: '-$137.51'
        },
        {
          date: 'Mar 14, 2026',
          merchant: "CHIPOTLE",
          type: 'Card Purchase',
          amount: '-$12.08'
        },
        {
          date: 'Mar 14, 2026',
          merchant: "CVS PHARMACY",
          type: 'Card Purchase',
          amount: '-$35.15'
        },
        {
          date: 'Mar 14, 2026',
          merchant: "CVS PHARMACY",
          type: 'Card Purchase',
          amount: '-$22.98'
        },
        {
          date: 'Mar 14, 2026',
          merchant: "STARBUCKS",
          type: 'Card Purchase',
          amount: '-$7.45'
        },
        {
          date: 'Mar 14, 2026',
          merchant: "CVS PHARMACY",
          type: 'Card Purchase',
          amount: '-$17.15'
        },
        {
          date: 'Mar 12, 2026',
          merchant: "AMAZON.COM",
          type: 'Card Purchase',
          amount: '-$76.84'
        },
        {
          date: 'Mar 12, 2026',
          merchant: "WALMART",
          type: 'Card Purchase',
          amount: '-$45.12'
        },
        {
          date: 'Mar 12, 2026',
          merchant: "ATM WITHDRAWAL",
          type: 'Cash Withdrawal',
          amount: '-$195.87'
        },
        {
          date: 'Mar 12, 2026',
          merchant: "BEST BUY",
          type: 'Card Purchase',
          amount: '-$171.90'
        },
        {
          date: 'Mar 12, 2026',
          merchant: "MCDONALD'S",
          type: 'Card Purchase',
          amount: '-$8.74'
        },
        {
          date: 'Mar 12, 2026',
          merchant: "MCDONALD'S",
          type: 'Card Purchase',
          amount: '-$11.49'
        },
        {
          date: 'Mar 10, 2026',
          merchant: "CVS PHARMACY",
          type: 'Card Purchase',
          amount: '-$38.95'
        },
        {
          date: 'Mar 10, 2026',
          merchant: "UBER",
          type: 'Card Purchase',
          amount: '-$12.01'
        },
        {
          date: 'Mar 10, 2026',
          merchant: "TARGET",
          type: 'Card Purchase',
          amount: '-$52.90'
        },
        {
          date: 'Mar 10, 2026',
          merchant: "COSTCO WHOLESALE",
          type: 'Card Purchase',
          amount: '-$193.92'
        },
        {
          date: 'Mar 10, 2026',
          merchant: "AMAZON.COM",
          type: 'Card Purchase',
          amount: '-$38.14'
        },
        {
          date: 'Mar 8, 2026',
          merchant: "APPLE.COM/BILL",
          type: 'Subscription',
          amount: '-$11.99'
        },
        {
          date: 'Mar 8, 2026',
          merchant: "COSTCO WHOLESALE",
          type: 'Card Purchase',
          amount: '-$197.21'
        },
        {
          date: 'Mar 8, 2026',
          merchant: "CHIPOTLE",
          type: 'Card Purchase',
          amount: '-$18.48'
        },
        {
          date: 'Mar 8, 2026',
          merchant: "COSTCO WHOLESALE",
          type: 'Card Purchase',
          amount: '-$97.14'
        },
        {
          date: 'Mar 8, 2026',
          merchant: "WALMART",
          type: 'Card Purchase',
          amount: '-$85.72'
        },
        {
          date: 'Mar 6, 2026',
          merchant: "TARGET",
          type: 'Card Purchase',
          amount: '-$123.84'
        },
        {
          date: 'Mar 6, 2026',
          merchant: "CVS PHARMACY",
          type: 'Card Purchase',
          amount: '-$27.40'
        },
        {
          date: 'Mar 6, 2026',
          merchant: "SHELL OIL",
          type: 'Fuel Purchase',
          amount: '-$52.37'
        },
        {
          date: 'Mar 6, 2026',
          merchant: "CHIPOTLE",
          type: 'Card Purchase',
          amount: '-$17.75'
        },
        {
          date: 'Mar 6, 2026',
          merchant: "STARBUCKS",
          type: 'Card Purchase',
          amount: '-$9.44'
        },
        {
          date: 'Mar 6, 2026',
          merchant: "HEB GROCERY",
          type: 'Card Purchase',
          amount: '-$97.23'
        },
        {
          date: 'Mar 4, 2026',
          merchant: "MCDONALD'S",
          type: 'Card Purchase',
          amount: '-$14.15'
        },
        {
          date: 'Mar 4, 2026',
          merchant: "WALMART",
          type: 'Card Purchase',
          amount: '-$74.88'
        },
        {
          date: 'Mar 4, 2026',
          merchant: "TARGET",
          type: 'Card Purchase',
          amount: '-$90.67'
        },
        {
          date: 'Mar 4, 2026',
          merchant: "UBER",
          type: 'Card Purchase',
          amount: '-$16.76'
        },
        {
          date: 'Mar 4, 2026',
          merchant: "CHIPOTLE",
          type: 'Card Purchase',
          amount: '-$15.28'
        },
        {
          date: 'Mar 2, 2026',
          merchant: "RENT PAYMENT",
          type: 'Bill Payment',
          amount: '-$1,450.00'
        },
        {
          date: 'Mar 2, 2026',
          merchant: "VERIZON WIRELESS",
          type: 'Bill Payment',
          amount: '-$89.99'
        },
        {
          date: 'Mar 2, 2026',
          merchant: "CHIPOTLE",
          type: 'Card Purchase',
          amount: '-$15.16'
        },
        {
          date: 'Mar 2, 2026',
          merchant: "COSTCO WHOLESALE",
          type: 'Card Purchase',
          amount: '-$110.01'
        },
        {
          date: 'Mar 2, 2026',
          merchant: "WALMART",
          type: 'Card Purchase',
          amount: '-$82.52'
        },
        {
          date: 'Mar 1, 2026',
          merchant: "RENT PAYMENT",
          type: 'Bill Payment',
          amount: '-$1,450.00'
        },
        {
          date: 'Mar 1, 2026',
          merchant: "VERIZON WIRELESS",
          type: 'Bill Payment',
          amount: '-$89.99'
        },
        {
          date: 'Mar 1, 2026',
          merchant: "ELECTRIC COMPANY",
          type: 'Bill Payment',
          amount: '-$128.90'
        },
        {
          date: 'Mar 1, 2026',
          merchant: "STARBUCKS",
          type: 'Card Purchase',
          amount: '-$8.82'
        },
        {
          date: 'Mar 1, 2026',
          merchant: "DOORDASH",
          type: 'Card Purchase',
          amount: '-$28.12'
        },
        {
          date: 'Feb 28, 2026',
          merchant: "DOORDASH",
          type: 'Card Purchase',
          amount: '-$38.96'
        },
        {
          date: 'Feb 28, 2026',
          merchant: "TARGET",
          type: 'Card Purchase',
          amount: '-$85.26'
        },
        {
          date: 'Feb 28, 2026',
          merchant: "WALMART",
          type: 'Card Purchase',
          amount: '-$55.01'
        },
        {
          date: 'Feb 28, 2026',
          merchant: "STARBUCKS",
          type: 'Card Purchase',
          amount: '-$11.66'
        },
        {
          date: 'Feb 28, 2026',
          merchant: "WALMART",
          type: 'Card Purchase',
          amount: '-$98.89'
        },
        {
          date: 'Feb 26, 2026',
          merchant: "BEST BUY",
          type: 'Card Purchase',
          amount: '-$88.10'
        },
        {
          date: 'Feb 26, 2026',
          merchant: "COSTCO WHOLESALE",
          type: 'Card Purchase',
          amount: '-$155.38'
        },
        {
          date: 'Feb 26, 2026',
          merchant: "CHIPOTLE",
          type: 'Card Purchase',
          amount: '-$12.19'
        },
        {
          date: 'Feb 26, 2026',
          merchant: "WALMART",
          type: 'Card Purchase',
          amount: '-$58.58'
        },
        {
          date: 'Feb 26, 2026',
          merchant: "AMAZON.COM",
          type: 'Card Purchase',
          amount: '-$17.76'
        },
        {
          date: 'Feb 24, 2026',
          merchant: "COSTCO WHOLESALE",
          type: 'Card Purchase',
          amount: '-$178.21'
        },
        {
          date: 'Feb 24, 2026',
          merchant: "DOORDASH",
          type: 'Card Purchase',
          amount: '-$31.34'
        },
        {
          date: 'Feb 24, 2026',
          merchant: "SHELL OIL",
          type: 'Fuel Purchase',
          amount: '-$54.92'
        },
        {
          date: 'Feb 24, 2026',
          merchant: "WHOLE FOODS",
          type: 'Card Purchase',
          amount: '-$66.75'
        },
        {
          date: 'Feb 24, 2026',
          merchant: "WALMART",
          type: 'Card Purchase',
          amount: '-$62.33'
        },
        {
          date: 'Feb 24, 2026',
          merchant: "COSTCO WHOLESALE",
          type: 'Card Purchase',
          amount: '-$103.01'
        },
        {
          date: 'Feb 22, 2026',
          merchant: "PAYROLL DEPOSIT",
          type: 'Direct Deposit',
          amount: '$2,150.00'
        },
        {
          date: 'Feb 22, 2026',
          merchant: "MCDONALD'S",
          type: 'Card Purchase',
          amount: '-$10.71'
        },
        {
          date: 'Feb 22, 2026',
          merchant: "HEB GROCERY",
          type: 'Card Purchase',
          amount: '-$158.27'
        },
        {
          date: 'Feb 22, 2026',
          merchant: "CVS PHARMACY",
          type: 'Card Purchase',
          amount: '-$29.52'
        },
        {
          date: 'Feb 22, 2026',
          merchant: "WHOLE FOODS",
          type: 'Card Purchase',
          amount: '-$54.51'
        },
        {
          date: 'Feb 20, 2026',
          merchant: "BEST BUY",
          type: 'Card Purchase',
          amount: '-$198.30'
        },
        {
          date: 'Feb 20, 2026',
          merchant: "CVS PHARMACY",
          type: 'Card Purchase',
          amount: '-$33.04'
        },
        {
          date: 'Feb 20, 2026',
          merchant: "SHELL OIL",
          type: 'Fuel Purchase',
          amount: '-$51.99'
        },
        {
          date: 'Feb 20, 2026',
          merchant: "AMAZON.COM",
          type: 'Card Purchase',
          amount: '-$34.00'
        },
        {
          date: 'Feb 20, 2026',
          merchant: "WHOLE FOODS",
          type: 'Card Purchase',
          amount: '-$79.63'
        },
        {
          date: 'Feb 18, 2026',
          merchant: "PAYROLL DEPOSIT",
          type: 'Direct Deposit',
          amount: '$2,150.00'
        },
        {
          date: 'Feb 18, 2026',
          merchant: "CHIPOTLE",
          type: 'Card Purchase',
          amount: '-$16.16'
        },
        {
          date: 'Feb 18, 2026',
          merchant: "COSTCO WHOLESALE",
          type: 'Card Purchase',
          amount: '-$125.70'
        },
        {
          date: 'Feb 18, 2026',
          merchant: "COSTCO WHOLESALE",
          type: 'Card Purchase',
          amount: '-$96.38'
        },
        {
          date: 'Feb 18, 2026',
          merchant: "WHOLE FOODS",
          type: 'Card Purchase',
          amount: '-$56.81'
        },
        {
          date: 'Feb 18, 2026',
          merchant: "TARGET",
          type: 'Card Purchase',
          amount: '-$115.76'
        },
        {
          date: 'Feb 16, 2026',
          merchant: "STARBUCKS",
          type: 'Card Purchase',
          amount: '-$8.35'
        },
        {
          date: 'Feb 16, 2026',
          merchant: "STARBUCKS",
          type: 'Card Purchase',
          amount: '-$7.07'
        },
        {
          date: 'Feb 16, 2026',
          merchant: "STARBUCKS",
          type: 'Card Purchase',
          amount: '-$10.01'
        },
        {
          date: 'Feb 16, 2026',
          merchant: "CVS PHARMACY",
          type: 'Card Purchase',
          amount: '-$24.11'
        },
        {
          date: 'Feb 16, 2026',
          merchant: "STARBUCKS",
          type: 'Card Purchase',
          amount: '-$9.21'
        },
        {
          date: 'Feb 14, 2026',
          merchant: "WHOLE FOODS",
          type: 'Card Purchase',
          amount: '-$64.95'
        },
        {
          date: 'Feb 14, 2026',
          merchant: "CHIPOTLE",
          type: 'Card Purchase',
          amount: '-$18.04'
        },
        {
          date: 'Feb 14, 2026',
          merchant: "MCDONALD'S",
          type: 'Card Purchase',
          amount: '-$9.43'
        },
        {
          date: 'Feb 14, 2026',
          merchant: "DOORDASH",
          type: 'Card Purchase',
          amount: '-$25.25'
        },
        {
          date: 'Feb 14, 2026',
          merchant: "WHOLE FOODS",
          type: 'Card Purchase',
          amount: '-$76.44'
        },
        {
          date: 'Feb 12, 2026',
          merchant: "COSTCO WHOLESALE",
          type: 'Card Purchase',
          amount: '-$177.86'
        },
        {
          date: 'Feb 12, 2026',
          merchant: "SHELL OIL",
          type: 'Fuel Purchase',
          amount: '-$64.85'
        },
        {
          date: 'Feb 12, 2026',
          merchant: "AMAZON.COM",
          type: 'Card Purchase',
          amount: '-$70.93'
        },
        {
          date: 'Feb 12, 2026',
          merchant: "WALMART",
          type: 'Card Purchase',
          amount: '-$43.24'
        },
        {
          date: 'Feb 12, 2026',
          merchant: "UBER",
          type: 'Card Purchase',
          amount: '-$14.12'
        },
        {
          date: 'Feb 12, 2026',
          merchant: "TARGET",
          type: 'Card Purchase',
          amount: '-$118.07'
        },
        {
          date: 'Feb 10, 2026',
          merchant: "AMAZON.COM",
          type: 'Card Purchase',
          amount: '-$50.90'
        },
        {
          date: 'Feb 10, 2026',
          merchant: "TARGET",
          type: 'Card Purchase',
          amount: '-$53.58'
        },
        {
          date: 'Feb 10, 2026',
          merchant: "BEST BUY",
          type: 'Card Purchase',
          amount: '-$162.19'
        },
        {
          date: 'Feb 10, 2026',
          merchant: "CHIPOTLE",
          type: 'Card Purchase',
          amount: '-$12.35'
        },
        {
          date: 'Feb 10, 2026',
          merchant: "AMAZON.COM",
          type: 'Card Purchase',
          amount: '-$33.40'
        },
        {
          date: 'Feb 8, 2026',
          merchant: "APPLE.COM/BILL",
          type: 'Subscription',
          amount: '-$11.99'
        },
        {
          date: 'Feb 8, 2026',
          merchant: "SHELL OIL",
          type: 'Fuel Purchase',
          amount: '-$47.56'
        },
        {
          date: 'Feb 8, 2026',
          merchant: "HEB GROCERY",
          type: 'Card Purchase',
          amount: '-$95.80'
        },
        {
          date: 'Feb 8, 2026',
          merchant: "BEST BUY",
          type: 'Card Purchase',
          amount: '-$284.01'
        },
        {
          date: 'Feb 8, 2026',
          merchant: "BEST BUY",
          type: 'Card Purchase',
          amount: '-$180.61'
        },
        {
          date: 'Feb 6, 2026',
          merchant: "DOORDASH",
          type: 'Card Purchase',
          amount: '-$31.10'
        },
        {
          date: 'Feb 6, 2026',
          merchant: "COSTCO WHOLESALE",
          type: 'Card Purchase',
          amount: '-$90.39'
        },
        {
          date: 'Feb 6, 2026',
          merchant: "MCDONALD'S",
          type: 'Card Purchase',
          amount: '-$14.15'
        },
        {
          date: 'Feb 6, 2026',
          merchant: "CHIPOTLE",
          type: 'Card Purchase',
          amount: '-$16.82'
        },
        {
          date: 'Feb 6, 2026',
          merchant: "CVS PHARMACY",
          type: 'Card Purchase',
          amount: '-$37.06'
        },
        {
          date: 'Feb 6, 2026',
          merchant: "DOORDASH",
          type: 'Card Purchase',
          amount: '-$39.29'
        },
        {
          date: 'Feb 4, 2026',
          merchant: "AMAZON.COM",
          type: 'Card Purchase',
          amount: '-$29.39'
        },
        {
          date: 'Feb 4, 2026',
          merchant: "STARBUCKS",
          type: 'Card Purchase',
          amount: '-$11.03'
        },
        {
          date: 'Feb 4, 2026',
          merchant: "WHOLE FOODS",
          type: 'Card Purchase',
          amount: '-$111.31'
        },
        {
          date: 'Feb 4, 2026',
          merchant: "ATM WITHDRAWAL",
          type: 'Cash Withdrawal',
          amount: '-$94.64'
        },
        {
          date: 'Feb 4, 2026',
          merchant: "CHIPOTLE",
          type: 'Card Purchase',
          amount: '-$17.28'
        },
        {
          date: 'Feb 2, 2026',
          merchant: "RENT PAYMENT",
          type: 'Bill Payment',
          amount: '-$1,450.00'
        },
        {
          date: 'Feb 2, 2026',
          merchant: "VERIZON WIRELESS",
          type: 'Bill Payment',
          amount: '-$89.99'
        },
        {
          date: 'Feb 2, 2026',
          merchant: "CHIPOTLE",
          type: 'Card Purchase',
          amount: '-$16.64'
        },
        {
          date: 'Feb 2, 2026',
          merchant: "TARGET",
          type: 'Card Purchase',
          amount: '-$75.69'
        },
        {
          date: 'Feb 2, 2026',
          merchant: "COSTCO WHOLESALE",
          type: 'Card Purchase',
          amount: '-$196.71'
        },
        {
          date: 'Feb 1, 2026',
          merchant: "RENT PAYMENT",
          type: 'Bill Payment',
          amount: '-$1,450.00'
        },
        {
          date: 'Feb 1, 2026',
          merchant: "VERIZON WIRELESS",
          type: 'Bill Payment',
          amount: '-$89.99'
        },
        {
          date: 'Feb 1, 2026',
          merchant: "ELECTRIC COMPANY",
          type: 'Bill Payment',
          amount: '-$119.70'
        },
        {
          date: 'Feb 1, 2026',
          merchant: "MCDONALD'S",
          type: 'Card Purchase',
          amount: '-$14.42'
        },
        {
          date: 'Feb 1, 2026',
          merchant: "CVS PHARMACY",
          type: 'Card Purchase',
          amount: '-$19.71'
        },
        {
          date: 'Jan 30, 2026',
          merchant: "DOORDASH",
          type: 'Card Purchase',
          amount: '-$27.46'
        },
        {
          date: 'Jan 30, 2026',
          merchant: "CHIPOTLE",
          type: 'Card Purchase',
          amount: '-$12.39'
        },
        {
          date: 'Jan 30, 2026',
          merchant: "UBER",
          type: 'Card Purchase',
          amount: '-$14.40'
        },
        {
          date: 'Jan 30, 2026',
          merchant: "WALMART",
          type: 'Card Purchase',
          amount: '-$99.97'
        },
        {
          date: 'Jan 30, 2026',
          merchant: "HEB GROCERY",
          type: 'Card Purchase',
          amount: '-$145.87'
        },
        {
          date: 'Jan 30, 2026',
          merchant: "BEST BUY",
          type: 'Card Purchase',
          amount: '-$258.33'
        },
        {
          date: 'Jan 28, 2026',
          merchant: "ATM WITHDRAWAL",
          type: 'Cash Withdrawal',
          amount: '-$134.64'
        },
        {
          date: 'Jan 28, 2026',
          merchant: "CVS PHARMACY",
          type: 'Card Purchase',
          amount: '-$29.79'
        },
        {
          date: 'Jan 28, 2026',
          merchant: "WALMART",
          type: 'Card Purchase',
          amount: '-$99.33'
        },
        {
          date: 'Jan 28, 2026',
          merchant: "WALMART",
          type: 'Card Purchase',
          amount: '-$82.72'
        },
        {
          date: 'Jan 28, 2026',
          merchant: "CVS PHARMACY",
          type: 'Card Purchase',
          amount: '-$24.97'
        },
        {
          date: 'Jan 26, 2026',
          merchant: "HEB GROCERY",
          type: 'Card Purchase',
          amount: '-$104.05'
        },
        {
          date: 'Jan 26, 2026',
          merchant: "WALMART",
          type: 'Card Purchase',
          amount: '-$61.81'
        },
        {
          date: 'Jan 26, 2026',
          merchant: "DOORDASH",
          type: 'Card Purchase',
          amount: '-$18.66'
        },
        {
          date: 'Jan 26, 2026',
          merchant: "COSTCO WHOLESALE",
          type: 'Card Purchase',
          amount: '-$219.64'
        },
        {
          date: 'Jan 26, 2026',
          merchant: "AMAZON.COM",
          type: 'Card Purchase',
          amount: '-$43.46'
        },
        {
          date: 'Jan 24, 2026',
          merchant: "AMAZON.COM",
          type: 'Card Purchase',
          amount: '-$85.88'
        },
        {
          date: 'Jan 24, 2026',
          merchant: "MCDONALD'S",
          type: 'Card Purchase',
          amount: '-$8.14'
        },
        {
          date: 'Jan 24, 2026',
          merchant: "SHELL OIL",
          type: 'Fuel Purchase',
          amount: '-$44.21'
        },
        {
          date: 'Jan 24, 2026',
          merchant: "AMAZON.COM",
          type: 'Card Purchase',
          amount: '-$31.58'
        },
        {
          date: 'Jan 24, 2026',
          merchant: "COSTCO WHOLESALE",
          type: 'Card Purchase',
          amount: '-$192.66'
        },
        {
          date: 'Jan 24, 2026',
          merchant: "CVS PHARMACY",
          type: 'Card Purchase',
          amount: '-$35.02'
        },
        {
          date: 'Jan 22, 2026',
          merchant: "PAYROLL DEPOSIT",
          type: 'Direct Deposit',
          amount: '$2,150.00'
        },
        {
          date: 'Jan 22, 2026',
          merchant: "TARGET",
          type: 'Card Purchase',
          amount: '-$113.53'
        },
        {
          date: 'Jan 22, 2026',
          merchant: "SHELL OIL",
          type: 'Fuel Purchase',
          amount: '-$54.52'
        },
        {
          date: 'Jan 22, 2026',
          merchant: "AMAZON.COM",
          type: 'Card Purchase',
          amount: '-$54.38'
        },
        {
          date: 'Jan 22, 2026',
          merchant: "HEB GROCERY",
          type: 'Card Purchase',
          amount: '-$88.32'
        },
        {
          date: 'Jan 20, 2026',
          merchant: "WALMART",
          type: 'Card Purchase',
          amount: '-$96.88'
        },
        {
          date: 'Jan 20, 2026',
          merchant: "DOORDASH",
          type: 'Card Purchase',
          amount: '-$28.00'
        },
        {
          date: 'Jan 20, 2026',
          merchant: "BEST BUY",
          type: 'Card Purchase',
          amount: '-$152.66'
        },
        {
          date: 'Jan 20, 2026',
          merchant: "WHOLE FOODS",
          type: 'Card Purchase',
          amount: '-$40.00'
        },
        {
          date: 'Jan 20, 2026',
          merchant: "STARBUCKS",
          type: 'Card Purchase',
          amount: '-$11.03'
        },
        {
          date: 'Jan 18, 2026',
          merchant: "PAYROLL DEPOSIT",
          type: 'Direct Deposit',
          amount: '$2,150.00'
        },
        {
          date: 'Jan 18, 2026',
          merchant: "TARGET",
          type: 'Card Purchase',
          amount: '-$75.82'
        },
        {
          date: 'Jan 18, 2026',
          merchant: "WHOLE FOODS",
          type: 'Card Purchase',
          amount: '-$76.07'
        },
        {
          date: 'Jan 18, 2026',
          merchant: "CVS PHARMACY",
          type: 'Card Purchase',
          amount: '-$27.14'
        },
        {
          date: 'Jan 18, 2026',
          merchant: "MCDONALD'S",
          type: 'Card Purchase',
          amount: '-$8.64'
        },
        {
          date: 'Jan 18, 2026',
          merchant: "WHOLE FOODS",
          type: 'Card Purchase',
          amount: '-$109.28'
        },
        {
          date: 'Jan 16, 2026',
          merchant: "WALMART",
          type: 'Card Purchase',
          amount: '-$50.41'
        },
        {
          date: 'Jan 16, 2026',
          merchant: "CHIPOTLE",
          type: 'Card Purchase',
          amount: '-$14.19'
        },
        {
          date: 'Jan 16, 2026',
          merchant: "CHIPOTLE",
          type: 'Card Purchase',
          amount: '-$12.14'
        },
        {
          date: 'Jan 16, 2026',
          merchant: "CVS PHARMACY",
          type: 'Card Purchase',
          amount: '-$38.81'
        },
        {
          date: 'Jan 16, 2026',
          merchant: "STARBUCKS",
          type: 'Card Purchase',
          amount: '-$7.69'
        },
        {
          date: 'Jan 14, 2026',
          merchant: "COSTCO WHOLESALE",
          type: 'Card Purchase',
          amount: '-$179.62'
        },
        {
          date: 'Jan 14, 2026',
          merchant: "WALMART",
          type: 'Card Purchase',
          amount: '-$86.01'
        },
        {
          date: 'Jan 14, 2026',
          merchant: "STARBUCKS",
          type: 'Card Purchase',
          amount: '-$7.75'
        },
        {
          date: 'Jan 14, 2026',
          merchant: "CHIPOTLE",
          type: 'Card Purchase',
          amount: '-$16.93'
        },
        {
          date: 'Jan 14, 2026',
          merchant: "STARBUCKS",
          type: 'Card Purchase',
          amount: '-$9.95'
        },
        {
          date: 'Jan 12, 2026',
          merchant: "MCDONALD'S",
          type: 'Card Purchase',
          amount: '-$8.98'
        },
        {
          date: 'Jan 12, 2026',
          merchant: "CHIPOTLE",
          type: 'Card Purchase',
          amount: '-$16.21'
        },
        {
          date: 'Jan 12, 2026',
          merchant: "BEST BUY",
          type: 'Card Purchase',
          amount: '-$200.52'
        },
        {
          date: 'Jan 12, 2026',
          merchant: "AMAZON.COM",
          type: 'Card Purchase',
          amount: '-$18.62'
        },
        {
          date: 'Jan 12, 2026',
          merchant: "SHELL OIL",
          type: 'Fuel Purchase',
          amount: '-$58.38'
        },
        {
          date: 'Jan 12, 2026',
          merchant: "UBER",
          type: 'Card Purchase',
          amount: '-$27.10'
        },
        {
          date: 'Jan 10, 2026',
          merchant: "DOORDASH",
          type: 'Card Purchase',
          amount: '-$28.19'
        },
        {
          date: 'Jan 10, 2026',
          merchant: "ATM WITHDRAWAL",
          type: 'Cash Withdrawal',
          amount: '-$179.89'
        },
        {
          date: 'Jan 10, 2026',
          merchant: "HEB GROCERY",
          type: 'Card Purchase',
          amount: '-$89.59'
        },
        {
          date: 'Jan 10, 2026',
          merchant: "COSTCO WHOLESALE",
          type: 'Card Purchase',
          amount: '-$104.97'
        },
        {
          date: 'Jan 10, 2026',
          merchant: "STARBUCKS",
          type: 'Card Purchase',
          amount: '-$9.72'
        },
        {
          date: 'Jan 8, 2026',
          merchant: "APPLE.COM/BILL",
          type: 'Subscription',
          amount: '-$11.99'
        },
        {
          date: 'Jan 8, 2026',
          merchant: "BEST BUY",
          type: 'Card Purchase',
          amount: '-$202.71'
        },
        {
          date: 'Jan 8, 2026',
          merchant: "CHIPOTLE",
          type: 'Card Purchase',
          amount: '-$13.23'
        },
        {
          date: 'Jan 8, 2026',
          merchant: "HEB GROCERY",
          type: 'Card Purchase',
          amount: '-$69.92'
        },
        {
          date: 'Jan 8, 2026',
          merchant: "TARGET",
          type: 'Card Purchase',
          amount: '-$64.38'
        },
        {
          date: 'Jan 6, 2026',
          merchant: "MCDONALD'S",
          type: 'Card Purchase',
          amount: '-$14.57'
        },
        {
          date: 'Jan 6, 2026',
          merchant: "ATM WITHDRAWAL",
          type: 'Cash Withdrawal',
          amount: '-$142.18'
        },
        {
          date: 'Jan 6, 2026',
          merchant: "ATM WITHDRAWAL",
          type: 'Cash Withdrawal',
          amount: '-$67.65'
        },
        {
          date: 'Jan 6, 2026',
          merchant: "COSTCO WHOLESALE",
          type: 'Card Purchase',
          amount: '-$127.41'
        },
        {
          date: 'Jan 6, 2026',
          merchant: "BEST BUY",
          type: 'Card Purchase',
          amount: '-$108.74'
        },
        {
          date: 'Jan 6, 2026',
          merchant: "BEST BUY",
          type: 'Card Purchase',
          amount: '-$161.33'
        },
        {
          date: 'Jan 4, 2026',
          merchant: "TARGET",
          type: 'Card Purchase',
          amount: '-$113.02'
        },
        {
          date: 'Jan 4, 2026',
          merchant: "TARGET",
          type: 'Card Purchase',
          amount: '-$59.80'
        },
        {
          date: 'Jan 4, 2026',
          merchant: "ATM WITHDRAWAL",
          type: 'Cash Withdrawal',
          amount: '-$102.62'
        },
        {
          date: 'Jan 4, 2026',
          merchant: "MCDONALD'S",
          type: 'Card Purchase',
          amount: '-$10.96'
        },
        {
          date: 'Jan 4, 2026',
          merchant: "HEB GROCERY",
          type: 'Card Purchase',
          amount: '-$133.12'
        },
        {
          date: 'Jan 2, 2026',
          merchant: "RENT PAYMENT",
          type: 'Bill Payment',
          amount: '-$1,450.00'
        },
        {
          date: 'Jan 2, 2026',
          merchant: "VERIZON WIRELESS",
          type: 'Bill Payment',
          amount: '-$89.99'
        },
        {
          date: 'Jan 2, 2026',
          merchant: "UBER",
          type: 'Card Purchase',
          amount: '-$22.90'
        },
        {
          date: 'Jan 2, 2026',
          merchant: "ATM WITHDRAWAL",
          type: 'Cash Withdrawal',
          amount: '-$140.16'
        },
        {
          date: 'Jan 2, 2026',
          merchant: "DOORDASH",
          type: 'Card Purchase',
          amount: '-$23.02'
        },
        {
          date: 'Jan 1, 2026',
          merchant: "RENT PAYMENT",
          type: 'Bill Payment',
          amount: '-$1,450.00'
        },
        {
          date: 'Jan 1, 2026',
          merchant: "VERIZON WIRELESS",
          type: 'Bill Payment',
          amount: '-$89.99'
        },
        {
          date: 'Jan 1, 2026',
          merchant: "ELECTRIC COMPANY",
          type: 'Bill Payment',
          amount: '-$119.70'
        },
        {
          date: 'Jan 1, 2026',
          merchant: "SHELL OIL",
          type: 'Fuel Purchase',
          amount: '-$55.06'
        },
        {
          date: 'Jan 1, 2026',
          merchant: "SHELL OIL",
          type: 'Fuel Purchase',
          amount: '-$48.47'
        },
      ],


    },
    vivian: {
      id: 'vivian',
      username: 'Vivian1997@',
      password: 'Vivian$1997',
      name: 'Vivian Jasmine Yu',
      firstName: 'Vivian Jasmine Yu',
      dob: '',
      sex: 'Female',
      relationship: 'Single',
      address: '11616 Ruthelen St',
      state: 'CA',
      zip: '90047',
      email: 'vivianjasmineyu40@gmail.com',
      phone: '+1 (939) 232-0311',
      photo: 'images/vivian.jpg',
      since: 'Since 2026',
      showAddress: true,
      accountNumber: '4859201743',
      routingNumber: '121000248',
      accounts: [
        { title: 'Everyday Checking...1743', balance: '$650.73', theme: 'dark', dot: 'wf-dot-black' },
      ],
      cardBalance: '$650.73',
      spendingBalance: '$0.00',
      showSpendingCard: false,
      showRestrictionNotice: false,
      historyExtras: [
        {
          date: 'Sep 24, 2026',
          merchant: 'STARBUCKS',
          type: 'Card Purchase',
          amount: '-$5.78'
        },
        {
          date: 'Sep 24, 2026',
          merchant: 'UBER',
          type: 'Card Purchase',
          amount: '-$13.87'
        },
        {
          date: 'Sep 24, 2026',
          merchant: 'TARGET',
          type: 'Card Purchase',
          amount: '-$42.37'
        },
        {
          date: 'Sep 23, 2026',
          merchant: 'WHOLE FOODS',
          type: 'Card Purchase',
          amount: '-$42.37'
        },
        {
          date: 'Sep 23, 2026',
          merchant: 'SHELL OIL',
          type: 'Fuel Purchase',
          amount: '-$36.98'
        },
        {
          date: 'Sep 23, 2026',
          merchant: 'AMAZON.COM',
          type: 'Card Purchase',
          amount: '-$26.96'
        },
        {
          date: 'Sep 22, 2026',
          merchant: 'WALMART',
          type: 'Card Purchase',
          amount: '-$42.37'
        },
        {
          date: 'Sep 22, 2026',
          merchant: 'CHIPOTLE',
          type: 'Card Purchase',
          amount: '-$13.87'
        },
        {
          date: 'Sep 22, 2026',
          merchant: 'CVS PHARMACY',
          type: 'Card Purchase',
          amount: '-$13.87'
        },
        {
          date: 'Sep 21, 2026',
          merchant: 'DOORDASH',
          type: 'Card Purchase',
          amount: '-$26.96'
        },
        {
          date: 'Sep 21, 2026',
          merchant: 'UBER',
          type: 'Card Purchase',
          amount: '-$13.87'
        },
        {
          date: 'Sep 21, 2026',
          merchant: 'NETFLIX',
          type: 'Subscription',
          amount: '-$17.71'
        },
        {
          date: 'Sep 20, 2026',
          merchant: 'TRADER JOE\'S',
          type: 'Card Purchase',
          amount: '-$42.37'
        },
        {
          date: 'Sep 20, 2026',
          merchant: 'SHELL OIL',
          type: 'Fuel Purchase',
          amount: '-$36.98'
        },
        {
          date: 'Sep 20, 2026',
          merchant: 'SPOTIFY',
          type: 'Subscription',
          amount: '-$9.24'
        },
        {
          date: 'Sep 19, 2026',
          merchant: 'TARGET',
          type: 'Card Purchase',
          amount: '-$42.37'
        },
        {
          date: 'Sep 19, 2026',
          merchant: 'STARBUCKS',
          type: 'Card Purchase',
          amount: '-$5.78'
        },
        {
          date: 'Sep 19, 2026',
          merchant: 'AMAZON.COM',
          type: 'Card Purchase',
          amount: '-$26.96'
        },
        {
          date: 'Sep 18, 2026',
          merchant: 'ELECTRIC COMPANY',
          type: 'Bill Payment',
          amount: '-$84.74'
        },
        {
          date: 'Sep 18, 2026',
          merchant: 'UBER',
          type: 'Card Purchase',
          amount: '-$13.87'
        },
        {
          date: 'Sep 18, 2026',
          merchant: 'MCDONALD\'S',
          type: 'Card Purchase',
          amount: '-$13.87'
        },
        {
          date: 'Sep 17, 2026',
          merchant: 'WHOLE FOODS',
          type: 'Card Purchase',
          amount: '-$42.37'
        },
        {
          date: 'Sep 17, 2026',
          merchant: 'VERIZON WIRELESS',
          type: 'Bill Payment',
          amount: '-$61.63'
        },
        {
          date: 'Sep 17, 2026',
          merchant: 'CHIPOTLE',
          type: 'Card Purchase',
          amount: '-$13.87'
        },
        {
          date: 'Sep 16, 2026',
          merchant: 'WALMART',
          type: 'Card Purchase',
          amount: '-$42.37'
        },
        {
          date: 'Sep 16, 2026',
          merchant: 'SHELL OIL',
          type: 'Fuel Purchase',
          amount: '-$36.98'
        },
        {
          date: 'Sep 16, 2026',
          merchant: 'APPLE.COM/BILL',
          type: 'Subscription',
          amount: '-$9.24'
        },
        {
          date: 'Sep 15, 2026',
          merchant: 'TARGET',
          type: 'Card Purchase',
          amount: '-$42.37'
        },
        {
          date: 'Sep 15, 2026',
          merchant: 'DOORDASH',
          type: 'Card Purchase',
          amount: '-$26.96'
        },
        {
          date: 'Sep 15, 2026',
          merchant: 'STARBUCKS',
          type: 'Card Purchase',
          amount: '-$5.78'
        },
        {
          date: 'Sep 14, 2026',
          merchant: 'RENT PAYMENT',
          type: 'Bill Payment',
          amount: '-$924.43'
        },
        {
          date: 'Sep 14, 2026',
          merchant: 'TRADER JOE\'S',
          type: 'Card Purchase',
          amount: '-$42.37'
        },
        {
          date: 'Sep 14, 2026',
          merchant: 'UBER',
          type: 'Card Purchase',
          amount: '-$13.87'
        },
        {
          date: 'Sep 14, 2026',
          merchant: 'CVS PHARMACY',
          type: 'Card Purchase',
          amount: '-$13.87'
        },
        {
          date: 'Sep 14, 2026',
          merchant: 'PAYROLL DEPOSIT',
          type: 'Direct Deposit',
          amount: '$2,500.00'
        },
        {
          date: 'Sep 13, 2026',
          merchant: 'TARGET',
          type: 'Card Purchase',
          amount: '-$35.52'
        },
        {
          date: 'Sep 13, 2026',
          merchant: 'AMAZON.COM',
          type: 'Card Purchase',
          amount: '-$30.21'
        },
        {
          date: 'Sep 12, 2026',
          merchant: 'VERIZON WIRELESS',
          type: 'Bill Payment',
          amount: '-$79.99'
        },
        {
          date: 'Sep 12, 2026',
          merchant: 'UBER',
          type: 'Card Purchase',
          amount: '-$17.70'
        },
        {
          date: 'Sep 11, 2026',
          merchant: 'SPOTIFY',
          type: 'Subscription',
          amount: '-$11.99'
        },
        {
          date: 'Sep 11, 2026',
          merchant: 'ELECTRIC COMPANY',
          type: 'Bill Payment',
          amount: '-$99.35'
        },
        {
          date: 'Sep 10, 2026',
          merchant: 'WALMART',
          type: 'Card Purchase',
          amount: '-$51.80'
        },
        {
          date: 'Sep 10, 2026',
          merchant: 'MCDONALD\'S',
          type: 'Card Purchase',
          amount: '-$11.70'
        },
        {
          date: 'Sep 9, 2026',
          merchant: 'WHOLE FOODS',
          type: 'Card Purchase',
          amount: '-$54.40'
        },
        {
          date: 'Sep 9, 2026',
          merchant: 'CVS PHARMACY',
          type: 'Card Purchase',
          amount: '-$20.82'
        },
        {
          date: 'Sep 8, 2026',
          merchant: 'STARBUCKS',
          type: 'Card Purchase',
          amount: '-$7.58'
        },
        {
          date: 'Sep 8, 2026',
          merchant: 'SHELL OIL',
          type: 'Fuel Purchase',
          amount: '-$50.48'
        },
        {
          date: 'Sep 7, 2026',
          merchant: 'APPLE.COM/BILL',
          type: 'Subscription',
          amount: '-$11.99'
        },
        {
          date: 'Sep 7, 2026',
          merchant: 'UBER',
          type: 'Card Purchase',
          amount: '-$21.10'
        },
        {
          date: 'Sep 6, 2026',
          merchant: 'TRADER JOE\'S',
          type: 'Card Purchase',
          amount: '-$53.20'
        },
        {
          date: 'Sep 6, 2026',
          merchant: 'NETFLIX',
          type: 'Subscription',
          amount: '-$22.99'
        },
        {
          date: 'Sep 5, 2026',
          merchant: 'CHIPOTLE',
          type: 'Card Purchase',
          amount: '-$14.88'
        },
        {
          date: 'Sep 5, 2026',
          merchant: 'DOORDASH',
          type: 'Card Purchase',
          amount: '-$29.05'
        },
        {
          date: 'Sep 4, 2026',
          merchant: 'TARGET',
          type: 'Card Purchase',
          amount: '-$52.44'
        },
        {
          date: 'Sep 4, 2026',
          merchant: 'AMAZON.COM',
          type: 'Card Purchase',
          amount: '-$43.53'
        },
        {
          date: 'Sep 3, 2026',
          merchant: 'VERIZON WIRELESS',
          type: 'Bill Payment',
          amount: '-$79.99'
        },
        {
          date: 'Sep 3, 2026',
          merchant: 'UBER',
          type: 'Card Purchase',
          amount: '-$21.30'
        },
        {
          date: 'Sep 2, 2026',
          merchant: 'SPOTIFY',
          type: 'Subscription',
          amount: '-$11.99'
        },
        {
          date: 'Sep 2, 2026',
          merchant: 'ELECTRIC COMPANY',
          type: 'Bill Payment',
          amount: '-$111.95'
        },
        {
          date: 'Sep 1, 2026',
          merchant: 'WALMART',
          type: 'Card Purchase',
          amount: '-$73.40'
        },
        {
          date: 'Sep 1, 2026',
          merchant: 'MCDONALD\'S',
          type: 'Card Purchase',
          amount: '-$13.86'
        },
        {
          date: 'Aug 31, 2026',
          merchant: 'CHIPOTLE',
          type: 'Card Purchase',
          amount: '-$16.80'
        },
        {
          date: 'Aug 31, 2026',
          merchant: 'DOORDASH',
          type: 'Card Purchase',
          amount: '-$34.49'
        },
        {
          date: 'Aug 31, 2026',
          merchant: 'SPOTIFY',
          type: 'Subscription',
          amount: '-$11.99'
        },
        {
          date: 'Aug 31, 2026',
          merchant: 'PAYROLL DEPOSIT',
          type: 'Direct Deposit',
          amount: '$2,500.00'
        },
        {
          date: 'Aug 31, 2026',
          merchant: 'TRADER JOE\'S',
          type: 'Card Purchase',
          amount: '-$46.00'
        },
        {
          date: 'Aug 31, 2026',
          merchant: 'NETFLIX',
          type: 'Subscription',
          amount: '-$22.99'
        },
        {
          date: 'Aug 30, 2026',
          merchant: 'CHIPOTLE',
          type: 'Card Purchase',
          amount: '-$13.44'
        },
        {
          date: 'Aug 30, 2026',
          merchant: 'DOORDASH',
          type: 'Card Purchase',
          amount: '-$24.97'
        },
        {
          date: 'Aug 29, 2026',
          merchant: 'TARGET',
          type: 'Card Purchase',
          amount: '-$41.16'
        },
        {
          date: 'Aug 29, 2026',
          merchant: 'AMAZON.COM',
          type: 'Card Purchase',
          amount: '-$34.65'
        },
        {
          date: 'Aug 28, 2026',
          merchant: 'VERIZON WIRELESS',
          type: 'Bill Payment',
          amount: '-$79.99'
        },
        {
          date: 'Aug 28, 2026',
          merchant: 'UBER',
          type: 'Card Purchase',
          amount: '-$18.90'
        },
        {
          date: 'Aug 27, 2026',
          merchant: 'SPOTIFY',
          type: 'Subscription',
          amount: '-$11.99'
        },
        {
          date: 'Aug 27, 2026',
          merchant: 'ELECTRIC COMPANY',
          type: 'Bill Payment',
          amount: '-$103.55'
        },
        {
          date: 'Aug 26, 2026',
          merchant: 'WALMART',
          type: 'Card Purchase',
          amount: '-$59.00'
        },
        {
          date: 'Aug 26, 2026',
          merchant: 'MCDONALD\'S',
          type: 'Card Purchase',
          amount: '-$12.42'
        },
        {
          date: 'Aug 25, 2026',
          merchant: 'WHOLE FOODS',
          type: 'Card Purchase',
          amount: '-$59.80'
        },
        {
          date: 'Aug 25, 2026',
          merchant: 'CVS PHARMACY',
          type: 'Card Purchase',
          amount: '-$22.98'
        },
        {
          date: 'Aug 24, 2026',
          merchant: 'STARBUCKS',
          type: 'Card Purchase',
          amount: '-$7.94'
        },
        {
          date: 'Aug 24, 2026',
          merchant: 'SHELL OIL',
          type: 'Fuel Purchase',
          amount: '-$52.40'
        },
        {
          date: 'Aug 23, 2026',
          merchant: 'APPLE.COM/BILL',
          type: 'Subscription',
          amount: '-$11.99'
        },
        {
          date: 'Aug 23, 2026',
          merchant: 'SPOTIFY',
          type: 'Subscription',
          amount: '-$11.99'
        },
        {
          date: 'Aug 22, 2026',
          merchant: 'TRADER JOE\'S',
          type: 'Card Purchase',
          amount: '-$56.80'
        },
        {
          date: 'Aug 22, 2026',
          merchant: 'NETFLIX',
          type: 'Subscription',
          amount: '-$22.99'
        },
        {
          date: 'Aug 21, 2026',
          merchant: 'CHIPOTLE',
          type: 'Card Purchase',
          amount: '-$15.60'
        },
        {
          date: 'Aug 21, 2026',
          merchant: 'DOORDASH',
          type: 'Card Purchase',
          amount: '-$31.09'
        },
        {
          date: 'Aug 20, 2026',
          merchant: 'TARGET',
          type: 'Card Purchase',
          amount: '-$58.08'
        },
        {
          date: 'Aug 20, 2026',
          merchant: 'AMAZON.COM',
          type: 'Card Purchase',
          amount: '-$47.97'
        },
        {
          date: 'Aug 19, 2026',
          merchant: 'VERIZON WIRELESS',
          type: 'Bill Payment',
          amount: '-$79.99'
        },
        {
          date: 'Aug 19, 2026',
          merchant: 'UBER',
          type: 'Card Purchase',
          amount: '-$22.50'
        },
        {
          date: 'Aug 18, 2026',
          merchant: 'SPOTIFY',
          type: 'Subscription',
          amount: '-$11.99'
        },
        {
          date: 'Aug 18, 2026',
          merchant: 'ELECTRIC COMPANY',
          type: 'Bill Payment',
          amount: '-$116.15'
        },
        {
          date: 'Aug 17, 2026',
          merchant: 'WALMART',
          type: 'Card Purchase',
          amount: '-$64.00'
        },
        {
          date: 'Aug 17, 2026',
          merchant: 'TARGET',
          type: 'Card Purchase',
          amount: '-$67.48'
        },
        {
          date: 'Aug 17, 2026',
          merchant: 'AMAZON.COM',
          type: 'Card Purchase',
          amount: '-$18.37'
        },
        {
          date: 'Aug 17, 2026',
          merchant: 'PAYROLL DEPOSIT',
          type: 'Direct Deposit',
          amount: '$2,500.00'
        },
        {
          date: 'Aug 17, 2026',
          merchant: 'NETFLIX',
          type: 'Subscription',
          amount: '-$22.99'
        },
        {
          date: 'Aug 17, 2026',
          merchant: 'VERIZON WIRELESS',
          type: 'Bill Payment',
          amount: '-$79.99'
        },
        {
          date: 'Aug 16, 2026',
          merchant: 'DOORDASH',
          type: 'Card Purchase',
          amount: '-$22.93'
        },
        {
          date: 'Aug 16, 2026',
          merchant: 'SPOTIFY',
          type: 'Subscription',
          amount: '-$11.99'
        },
        {
          date: 'Aug 15, 2026',
          merchant: 'AMAZON.COM',
          type: 'Card Purchase',
          amount: '-$30.21'
        },
        {
          date: 'Aug 15, 2026',
          merchant: 'WALMART',
          type: 'Card Purchase',
          amount: '-$65.00'
        },
        {
          date: 'Aug 14, 2026',
          merchant: 'UBER',
          type: 'Card Purchase',
          amount: '-$17.70'
        },
        {
          date: 'Aug 14, 2026',
          merchant: 'WHOLE FOODS',
          type: 'Card Purchase',
          amount: '-$64.30'
        },
        {
          date: 'Aug 13, 2026',
          merchant: 'ELECTRIC COMPANY',
          type: 'Bill Payment',
          amount: '-$99.35'
        },
        {
          date: 'Aug 13, 2026',
          merchant: 'STARBUCKS',
          type: 'Card Purchase',
          amount: '-$8.24'
        },
        {
          date: 'Aug 12, 2026',
          merchant: 'MCDONALD\'S',
          type: 'Card Purchase',
          amount: '-$11.70'
        },
        {
          date: 'Aug 12, 2026',
          merchant: 'APPLE.COM/BILL',
          type: 'Subscription',
          amount: '-$11.99'
        },
        {
          date: 'Aug 11, 2026',
          merchant: 'CVS PHARMACY',
          type: 'Card Purchase',
          amount: '-$20.82'
        },
        {
          date: 'Aug 11, 2026',
          merchant: 'TRADER JOE\'S',
          type: 'Card Purchase',
          amount: '-$59.80'
        },
        {
          date: 'Aug 10, 2026',
          merchant: 'SHELL OIL',
          type: 'Fuel Purchase',
          amount: '-$50.48'
        },
        {
          date: 'Aug 10, 2026',
          merchant: 'CHIPOTLE',
          type: 'Card Purchase',
          amount: '-$16.20'
        },
        {
          date: 'Aug 9, 2026',
          merchant: 'TARGET',
          type: 'Card Purchase',
          amount: '-$41.16'
        },
        {
          date: 'Aug 9, 2026',
          merchant: 'TARGET',
          type: 'Card Purchase',
          amount: '-$62.78'
        },
        {
          date: 'Aug 8, 2026',
          merchant: 'NETFLIX',
          type: 'Subscription',
          amount: '-$22.99'
        },
        {
          date: 'Aug 8, 2026',
          merchant: 'VERIZON WIRELESS',
          type: 'Bill Payment',
          amount: '-$79.99'
        },
        {
          date: 'Aug 7, 2026',
          merchant: 'DOORDASH',
          type: 'Card Purchase',
          amount: '-$29.05'
        },
        {
          date: 'Aug 7, 2026',
          merchant: 'SPOTIFY',
          type: 'Subscription',
          amount: '-$11.99'
        },
        {
          date: 'Aug 6, 2026',
          merchant: 'AMAZON.COM',
          type: 'Card Purchase',
          amount: '-$43.53'
        },
        {
          date: 'Aug 6, 2026',
          merchant: 'WALMART',
          type: 'Card Purchase',
          amount: '-$86.60'
        },
        {
          date: 'Aug 5, 2026',
          merchant: 'UBER',
          type: 'Card Purchase',
          amount: '-$21.30'
        },
        {
          date: 'Aug 5, 2026',
          merchant: 'WHOLE FOODS',
          type: 'Card Purchase',
          amount: '-$80.50'
        },
        {
          date: 'Aug 4, 2026',
          merchant: 'ELECTRIC COMPANY',
          type: 'Bill Payment',
          amount: '-$111.95'
        },
        {
          date: 'Aug 4, 2026',
          merchant: 'STARBUCKS',
          type: 'Card Purchase',
          amount: '-$9.32'
        },
        {
          date: 'Aug 3, 2026',
          merchant: 'TRADER JOE\'S',
          type: 'Card Purchase',
          amount: '-$56.20'
        },
        {
          date: 'Aug 3, 2026',
          merchant: 'NETFLIX',
          type: 'Subscription',
          amount: '-$22.99'
        },
        {
          date: 'Aug 3, 2026',
          merchant: 'VERIZON WIRELESS',
          type: 'Bill Payment',
          amount: '-$79.99'
        },
        {
          date: 'Aug 3, 2026',
          merchant: 'PAYROLL DEPOSIT',
          type: 'Direct Deposit',
          amount: '$2,500.00'
        },
        {
          date: 'Aug 3, 2026',
          merchant: 'VERIZON WIRELESS',
          type: 'Bill Payment',
          amount: '-$79.99'
        },
        {
          date: 'Aug 3, 2026',
          merchant: 'UBER',
          type: 'Card Purchase',
          amount: '-$18.70'
        },
        {
          date: 'Aug 2, 2026',
          merchant: 'SPOTIFY',
          type: 'Subscription',
          amount: '-$11.99'
        },
        {
          date: 'Aug 2, 2026',
          merchant: 'ELECTRIC COMPANY',
          type: 'Bill Payment',
          amount: '-$102.85'
        },
        {
          date: 'Aug 1, 2026',
          merchant: 'WALMART',
          type: 'Card Purchase',
          amount: '-$57.80'
        },
        {
          date: 'Aug 1, 2026',
          merchant: 'MCDONALD\'S',
          type: 'Card Purchase',
          amount: '-$12.30'
        },
        {
          date: 'Jul 31, 2026',
          merchant: 'AMAZON.COM',
          type: 'Card Purchase',
          amount: '-$34.65'
        },
        {
          date: 'Jul 31, 2026',
          merchant: 'WALMART',
          type: 'Card Purchase',
          amount: '-$72.20'
        },
        {
          date: 'Jul 30, 2026',
          merchant: 'UBER',
          type: 'Card Purchase',
          amount: '-$18.90'
        },
        {
          date: 'Jul 30, 2026',
          merchant: 'WHOLE FOODS',
          type: 'Card Purchase',
          amount: '-$69.70'
        },
        {
          date: 'Jul 29, 2026',
          merchant: 'ELECTRIC COMPANY',
          type: 'Bill Payment',
          amount: '-$103.55'
        },
        {
          date: 'Jul 29, 2026',
          merchant: 'STARBUCKS',
          type: 'Card Purchase',
          amount: '-$8.60'
        },
        {
          date: 'Jul 28, 2026',
          merchant: 'MCDONALD\'S',
          type: 'Card Purchase',
          amount: '-$12.42'
        },
        {
          date: 'Jul 28, 2026',
          merchant: 'APPLE.COM/BILL',
          type: 'Subscription',
          amount: '-$11.99'
        },
        {
          date: 'Jul 27, 2026',
          merchant: 'CVS PHARMACY',
          type: 'Card Purchase',
          amount: '-$22.98'
        },
        {
          date: 'Jul 27, 2026',
          merchant: 'TRADER JOE\'S',
          type: 'Card Purchase',
          amount: '-$63.40'
        },
        {
          date: 'Jul 26, 2026',
          merchant: 'SHELL OIL',
          type: 'Fuel Purchase',
          amount: '-$52.40'
        },
        {
          date: 'Jul 26, 2026',
          merchant: 'CHIPOTLE',
          type: 'Card Purchase',
          amount: '-$16.92'
        },
        {
          date: 'Jul 25, 2026',
          merchant: 'NETFLIX',
          type: 'Subscription',
          amount: '-$22.99'
        },
        {
          date: 'Jul 25, 2026',
          merchant: 'TARGET',
          type: 'Card Purchase',
          amount: '-$68.42'
        },
        {
          date: 'Jul 24, 2026',
          merchant: 'NETFLIX',
          type: 'Subscription',
          amount: '-$22.99'
        },
        {
          date: 'Jul 24, 2026',
          merchant: 'VERIZON WIRELESS',
          type: 'Bill Payment',
          amount: '-$79.99'
        },
        {
          date: 'Jul 23, 2026',
          merchant: 'DOORDASH',
          type: 'Card Purchase',
          amount: '-$31.09'
        },
        {
          date: 'Jul 23, 2026',
          merchant: 'SPOTIFY',
          type: 'Subscription',
          amount: '-$11.99'
        },
        {
          date: 'Jul 22, 2026',
          merchant: 'AMAZON.COM',
          type: 'Card Purchase',
          amount: '-$47.97'
        },
        {
          date: 'Jul 22, 2026',
          merchant: 'WALMART',
          type: 'Card Purchase',
          amount: '-$93.80'
        },
        {
          date: 'Jul 21, 2026',
          merchant: 'UBER',
          type: 'Card Purchase',
          amount: '-$22.50'
        },
        {
          date: 'Jul 21, 2026',
          merchant: 'WHOLE FOODS',
          type: 'Card Purchase',
          amount: '-$40.90'
        },
        {
          date: 'Jul 20, 2026',
          merchant: 'SHELL OIL',
          type: 'Fuel Purchase',
          amount: '-$48.56'
        },
        {
          date: 'Jul 20, 2026',
          merchant: 'CHIPOTLE',
          type: 'Card Purchase',
          amount: '-$15.48'
        },
        {
          date: 'Jul 20, 2026',
          merchant: 'DOORDASH',
          type: 'Card Purchase',
          amount: '-$30.75'
        },
        {
          date: 'Jul 20, 2026',
          merchant: 'PAYROLL DEPOSIT',
          type: 'Direct Deposit',
          amount: '$2,500.00'
        },
        {
          date: 'Jul 20, 2026',
          merchant: 'TARGET',
          type: 'Card Purchase',
          amount: '-$45.86'
        },
        {
          date: 'Jul 20, 2026',
          merchant: 'AMAZON.COM',
          type: 'Card Purchase',
          amount: '-$38.35'
        },
        {
          date: 'Jul 19, 2026',
          merchant: 'VERIZON WIRELESS',
          type: 'Bill Payment',
          amount: '-$79.99'
        },
        {
          date: 'Jul 19, 2026',
          merchant: 'UBER',
          type: 'Card Purchase',
          amount: '-$19.90'
        },
        {
          date: 'Jul 18, 2026',
          merchant: 'SPOTIFY',
          type: 'Subscription',
          amount: '-$11.99'
        },
        {
          date: 'Jul 18, 2026',
          merchant: 'ELECTRIC COMPANY',
          type: 'Bill Payment',
          amount: '-$107.05'
        },
        {
          date: 'Jul 17, 2026',
          merchant: 'WALMART',
          type: 'Card Purchase',
          amount: '-$65.00'
        },
        {
          date: 'Jul 17, 2026',
          merchant: 'MCDONALD\'S',
          type: 'Card Purchase',
          amount: '-$13.02'
        },
        {
          date: 'Jul 16, 2026',
          merchant: 'WHOLE FOODS',
          type: 'Card Purchase',
          amount: '-$64.30'
        },
        {
          date: 'Jul 16, 2026',
          merchant: 'CVS PHARMACY',
          type: 'Card Purchase',
          amount: '-$24.78'
        },
        {
          date: 'Jul 15, 2026',
          merchant: 'STARBUCKS',
          type: 'Card Purchase',
          amount: '-$8.24'
        },
        {
          date: 'Jul 15, 2026',
          merchant: 'SHELL OIL',
          type: 'Fuel Purchase',
          amount: '-$54.00'
        },
        {
          date: 'Jul 14, 2026',
          merchant: 'APPLE.COM/BILL',
          type: 'Subscription',
          amount: '-$11.99'
        },
        {
          date: 'Jul 14, 2026',
          merchant: 'DOORDASH',
          type: 'Card Purchase',
          amount: '-$21.23'
        },
        {
          date: 'Jul 13, 2026',
          merchant: 'TRADER JOE\'S',
          type: 'Card Purchase',
          amount: '-$59.80'
        },
        {
          date: 'Jul 13, 2026',
          merchant: 'NETFLIX',
          type: 'Subscription',
          amount: '-$22.99'
        },
        {
          date: 'Jul 12, 2026',
          merchant: 'CHIPOTLE',
          type: 'Card Purchase',
          amount: '-$16.20'
        },
        {
          date: 'Jul 12, 2026',
          merchant: 'DOORDASH',
          type: 'Card Purchase',
          amount: '-$32.79'
        },
        {
          date: 'Jul 11, 2026',
          merchant: 'TARGET',
          type: 'Card Purchase',
          amount: '-$62.78'
        },
        {
          date: 'Jul 11, 2026',
          merchant: 'AMAZON.COM',
          type: 'Card Purchase',
          amount: '-$51.67'
        },
        {
          date: 'Jul 10, 2026',
          merchant: 'VERIZON WIRELESS',
          type: 'Bill Payment',
          amount: '-$79.99'
        },
        {
          date: 'Jul 10, 2026',
          merchant: 'UBER',
          type: 'Card Purchase',
          amount: '-$23.50'
        },
        {
          date: 'Jul 9, 2026',
          merchant: 'SPOTIFY',
          type: 'Subscription',
          amount: '-$11.99'
        },
        {
          date: 'Jul 9, 2026',
          merchant: 'ELECTRIC COMPANY',
          type: 'Bill Payment',
          amount: '-$119.65'
        },
        {
          date: 'Jul 8, 2026',
          merchant: 'WALMART',
          type: 'Card Purchase',
          amount: '-$86.60'
        },
        {
          date: 'Jul 8, 2026',
          merchant: 'MCDONALD\'S',
          type: 'Card Purchase',
          amount: '-$9.18'
        },
        {
          date: 'Jul 7, 2026',
          merchant: 'WHOLE FOODS',
          type: 'Card Purchase',
          amount: '-$80.50'
        },
        {
          date: 'Jul 7, 2026',
          merchant: 'CVS PHARMACY',
          type: 'Card Purchase',
          amount: '-$13.26'
        },
        {
          date: 'Jul 6, 2026',
          merchant: 'APPLE.COM/BILL',
          type: 'Subscription',
          amount: '-$11.99'
        },
        {
          date: 'Jul 6, 2026',
          merchant: 'WALMART',
          type: 'Card Purchase',
          amount: '-$61.00'
        },
        {
          date: 'Jul 6, 2026',
          merchant: 'TARGET',
          type: 'Card Purchase',
          amount: '-$57.14'
        },
        {
          date: 'Jul 6, 2026',
          merchant: 'PAYROLL DEPOSIT',
          type: 'Direct Deposit',
          amount: '$2,500.00'
        },
        {
          date: 'Jul 6, 2026',
          merchant: 'AMAZON.COM',
          type: 'Card Purchase',
          amount: '-$33.91'
        },
        {
          date: 'Jul 6, 2026',
          merchant: 'WALMART',
          type: 'Card Purchase',
          amount: '-$71.00'
        },
        {
          date: 'Jul 5, 2026',
          merchant: 'UBER',
          type: 'Card Purchase',
          amount: '-$18.70'
        },
        {
          date: 'Jul 5, 2026',
          merchant: 'WHOLE FOODS',
          type: 'Card Purchase',
          amount: '-$68.80'
        },
        {
          date: 'Jul 4, 2026',
          merchant: 'ELECTRIC COMPANY',
          type: 'Bill Payment',
          amount: '-$102.85'
        },
        {
          date: 'Jul 4, 2026',
          merchant: 'STARBUCKS',
          type: 'Card Purchase',
          amount: '-$8.54'
        },
        {
          date: 'Jul 3, 2026',
          merchant: 'MCDONALD\'S',
          type: 'Card Purchase',
          amount: '-$12.30'
        },
        {
          date: 'Jul 3, 2026',
          merchant: 'APPLE.COM/BILL',
          type: 'Subscription',
          amount: '-$11.99'
        },
        {
          date: 'Jul 2, 2026',
          merchant: 'CVS PHARMACY',
          type: 'Card Purchase',
          amount: '-$22.62'
        },
        {
          date: 'Jul 2, 2026',
          merchant: 'TRADER JOE\'S',
          type: 'Card Purchase',
          amount: '-$62.80'
        },
        {
          date: 'Jul 1, 2026',
          merchant: 'SHELL OIL',
          type: 'Fuel Purchase',
          amount: '-$52.08'
        },
        {
          date: 'Jul 1, 2026',
          merchant: 'CHIPOTLE',
          type: 'Card Purchase',
          amount: '-$16.80'
        },
        {
          date: 'Jun 30, 2026',
          merchant: 'MCDONALD\'S',
          type: 'Card Purchase',
          amount: '-$12.42'
        },
        {
          date: 'Jun 30, 2026',
          merchant: 'APPLE.COM/BILL',
          type: 'Subscription',
          amount: '-$11.99'
        },
        {
          date: 'Jun 29, 2026',
          merchant: 'CVS PHARMACY',
          type: 'Card Purchase',
          amount: '-$22.98'
        },
        {
          date: 'Jun 29, 2026',
          merchant: 'TRADER JOE\'S',
          type: 'Card Purchase',
          amount: '-$63.40'
        },
        {
          date: 'Jun 28, 2026',
          merchant: 'SHELL OIL',
          type: 'Fuel Purchase',
          amount: '-$52.40'
        },
        {
          date: 'Jun 28, 2026',
          merchant: 'CHIPOTLE',
          type: 'Card Purchase',
          amount: '-$16.92'
        },
        {
          date: 'Jun 27, 2026',
          merchant: 'TARGET',
          type: 'Card Purchase',
          amount: '-$47.50'
        },
        {
          date: 'Jun 27, 2026',
          merchant: 'TARGET',
          type: 'Card Purchase',
          amount: '-$68.42'
        },
        {
          date: 'Jun 26, 2026',
          merchant: 'NETFLIX',
          type: 'Subscription',
          amount: '-$22.99'
        },
        {
          date: 'Jun 26, 2026',
          merchant: 'VERIZON WIRELESS',
          type: 'Bill Payment',
          amount: '-$79.99'
        },
        {
          date: 'Jun 25, 2026',
          merchant: 'DOORDASH',
          type: 'Card Purchase',
          amount: '-$31.09'
        },
        {
          date: 'Jun 25, 2026',
          merchant: 'SPOTIFY',
          type: 'Subscription',
          amount: '-$11.99'
        },
        {
          date: 'Jun 24, 2026',
          merchant: 'AMAZON.COM',
          type: 'Card Purchase',
          amount: '-$47.97'
        },
        {
          date: 'Jun 24, 2026',
          merchant: 'WALMART',
          type: 'Card Purchase',
          amount: '-$93.80'
        },
        {
          date: 'Jun 23, 2026',
          merchant: 'UBER',
          type: 'Card Purchase',
          amount: '-$22.50'
        },
        {
          date: 'Jun 23, 2026',
          merchant: 'WHOLE FOODS',
          type: 'Card Purchase',
          amount: '-$40.90'
        },
        {
          date: 'Jun 22, 2026',
          merchant: 'CVS PHARMACY',
          type: 'Card Purchase',
          amount: '-$14.70'
        },
        {
          date: 'Jun 22, 2026',
          merchant: 'TRADER JOE\'S',
          type: 'Card Purchase',
          amount: '-$49.60'
        },
        {
          date: 'Jun 22, 2026',
          merchant: 'NETFLIX',
          type: 'Subscription',
          amount: '-$22.99'
        },
        {
          date: 'Jun 22, 2026',
          merchant: 'PAYROLL DEPOSIT',
          type: 'Direct Deposit',
          amount: '$2,500.00'
        },
        {
          date: 'Jun 22, 2026',
          merchant: 'TARGET',
          type: 'Card Purchase',
          amount: '-$45.86'
        },
        {
          date: 'Jun 22, 2026',
          merchant: 'AMAZON.COM',
          type: 'Card Purchase',
          amount: '-$38.35'
        },
        {
          date: 'Jun 21, 2026',
          merchant: 'VERIZON WIRELESS',
          type: 'Bill Payment',
          amount: '-$79.99'
        },
        {
          date: 'Jun 21, 2026',
          merchant: 'UBER',
          type: 'Card Purchase',
          amount: '-$19.90'
        },
        {
          date: 'Jun 20, 2026',
          merchant: 'SPOTIFY',
          type: 'Subscription',
          amount: '-$11.99'
        },
        {
          date: 'Jun 20, 2026',
          merchant: 'ELECTRIC COMPANY',
          type: 'Bill Payment',
          amount: '-$107.05'
        },
        {
          date: 'Jun 19, 2026',
          merchant: 'WALMART',
          type: 'Card Purchase',
          amount: '-$65.00'
        },
        {
          date: 'Jun 19, 2026',
          merchant: 'MCDONALD\'S',
          type: 'Card Purchase',
          amount: '-$13.02'
        },
        {
          date: 'Jun 18, 2026',
          merchant: 'WHOLE FOODS',
          type: 'Card Purchase',
          amount: '-$64.30'
        },
        {
          date: 'Jun 18, 2026',
          merchant: 'CVS PHARMACY',
          type: 'Card Purchase',
          amount: '-$24.78'
        },
        {
          date: 'Jun 17, 2026',
          merchant: 'STARBUCKS',
          type: 'Card Purchase',
          amount: '-$8.24'
        },
        {
          date: 'Jun 17, 2026',
          merchant: 'SHELL OIL',
          type: 'Fuel Purchase',
          amount: '-$54.00'
        },
        {
          date: 'Jun 16, 2026',
          merchant: 'APPLE.COM/BILL',
          type: 'Subscription',
          amount: '-$11.99'
        },
        {
          date: 'Jun 16, 2026',
          merchant: 'NETFLIX',
          type: 'Subscription',
          amount: '-$22.99'
        },
        {
          date: 'Jun 15, 2026',
          merchant: 'TRADER JOE\'S',
          type: 'Card Purchase',
          amount: '-$59.80'
        },
        {
          date: 'Jun 15, 2026',
          merchant: 'NETFLIX',
          type: 'Subscription',
          amount: '-$22.99'
        },
        {
          date: 'Jun 14, 2026',
          merchant: 'CHIPOTLE',
          type: 'Card Purchase',
          amount: '-$16.20'
        },
        {
          date: 'Jun 14, 2026',
          merchant: 'DOORDASH',
          type: 'Card Purchase',
          amount: '-$32.79'
        },
        {
          date: 'Jun 13, 2026',
          merchant: 'TARGET',
          type: 'Card Purchase',
          amount: '-$62.78'
        },
        {
          date: 'Jun 13, 2026',
          merchant: 'AMAZON.COM',
          type: 'Card Purchase',
          amount: '-$51.67'
        },
        {
          date: 'Jun 12, 2026',
          merchant: 'VERIZON WIRELESS',
          type: 'Bill Payment',
          amount: '-$79.99'
        },
        {
          date: 'Jun 12, 2026',
          merchant: 'UBER',
          type: 'Card Purchase',
          amount: '-$23.50'
        },
        {
          date: 'Jun 11, 2026',
          merchant: 'SPOTIFY',
          type: 'Subscription',
          amount: '-$11.99'
        },
        {
          date: 'Jun 11, 2026',
          merchant: 'ELECTRIC COMPANY',
          type: 'Bill Payment',
          amount: '-$119.65'
        },
        {
          date: 'Jun 10, 2026',
          merchant: 'WALMART',
          type: 'Card Purchase',
          amount: '-$86.60'
        },
        {
          date: 'Jun 10, 2026',
          merchant: 'MCDONALD\'S',
          type: 'Card Purchase',
          amount: '-$9.18'
        },
        {
          date: 'Jun 9, 2026',
          merchant: 'WHOLE FOODS',
          type: 'Card Purchase',
          amount: '-$80.50'
        },
        {
          date: 'Jun 9, 2026',
          merchant: 'CVS PHARMACY',
          type: 'Card Purchase',
          amount: '-$13.26'
        },
        {
          date: 'Jun 8, 2026',
          merchant: 'STARBUCKS',
          type: 'Card Purchase',
          amount: '-$6.56'
        },
        {
          date: 'Jun 8, 2026',
          merchant: 'SHELL OIL',
          type: 'Fuel Purchase',
          amount: '-$45.04'
        },
        {
          date: 'Jun 8, 2026',
          merchant: 'CHIPOTLE',
          type: 'Card Purchase',
          amount: '-$14.16'
        },
        {
          date: 'Jun 8, 2026',
          merchant: 'PAYROLL DEPOSIT',
          type: 'Direct Deposit',
          amount: '$2,500.00'
        },
        {
          date: 'Jun 8, 2026',
          merchant: 'AMAZON.COM',
          type: 'Card Purchase',
          amount: '-$33.91'
        },
        {
          date: 'Jun 8, 2026',
          merchant: 'WALMART',
          type: 'Card Purchase',
          amount: '-$71.00'
        },
        {
          date: 'Jun 7, 2026',
          merchant: 'UBER',
          type: 'Card Purchase',
          amount: '-$18.70'
        },
        {
          date: 'Jun 7, 2026',
          merchant: 'WHOLE FOODS',
          type: 'Card Purchase',
          amount: '-$68.80'
        },
        {
          date: 'Jun 6, 2026',
          merchant: 'ELECTRIC COMPANY',
          type: 'Bill Payment',
          amount: '-$102.85'
        },
        {
          date: 'Jun 6, 2026',
          merchant: 'STARBUCKS',
          type: 'Card Purchase',
          amount: '-$8.54'
        },
        {
          date: 'Jun 5, 2026',
          merchant: 'MCDONALD\'S',
          type: 'Card Purchase',
          amount: '-$12.30'
        },
        {
          date: 'Jun 5, 2026',
          merchant: 'APPLE.COM/BILL',
          type: 'Subscription',
          amount: '-$11.99'
        },
        {
          date: 'Jun 4, 2026',
          merchant: 'CVS PHARMACY',
          type: 'Card Purchase',
          amount: '-$22.62'
        },
        {
          date: 'Jun 4, 2026',
          merchant: 'TRADER JOE\'S',
          type: 'Card Purchase',
          amount: '-$62.80'
        },
        {
          date: 'Jun 3, 2026',
          merchant: 'SHELL OIL',
          type: 'Fuel Purchase',
          amount: '-$52.08'
        },
        {
          date: 'Jun 3, 2026',
          merchant: 'CHIPOTLE',
          type: 'Card Purchase',
          amount: '-$16.80'
        },
        {
          date: 'Jun 2, 2026',
          merchant: 'SHELL OIL',
          type: 'Fuel Purchase',
          amount: '-$52.08'
        },
        {
          date: 'Jun 2, 2026',
          merchant: 'TARGET',
          type: 'Card Purchase',
          amount: '-$67.48'
        },
        {
          date: 'Jun 1, 2026',
          merchant: 'NETFLIX',
          type: 'Subscription',
          amount: '-$22.99'
        },
        {
          date: 'Jun 1, 2026',
          merchant: 'VERIZON WIRELESS',
          type: 'Bill Payment',
          amount: '-$79.99'
        },
        {
          date: 'May 31, 2026',
          merchant: 'TRADER JOE\'S',
          type: 'Card Purchase',
          amount: '-$63.40'
        },
        {
          date: 'May 31, 2026',
          merchant: 'NETFLIX',
          type: 'Subscription',
          amount: '-$22.99'
        },
        {
          date: 'May 30, 2026',
          merchant: 'CHIPOTLE',
          type: 'Card Purchase',
          amount: '-$16.92'
        },
        {
          date: 'May 30, 2026',
          merchant: 'DOORDASH',
          type: 'Card Purchase',
          amount: '-$34.83'
        },
        {
          date: 'May 29, 2026',
          merchant: 'TARGET',
          type: 'Card Purchase',
          amount: '-$68.42'
        },
        {
          date: 'May 29, 2026',
          merchant: 'AMAZON.COM',
          type: 'Card Purchase',
          amount: '-$19.11'
        },
        {
          date: 'May 28, 2026',
          merchant: 'VERIZON WIRELESS',
          type: 'Bill Payment',
          amount: '-$79.99'
        },
        {
          date: 'May 28, 2026',
          merchant: 'UBER',
          type: 'Card Purchase',
          amount: '-$14.70'
        },
        {
          date: 'May 27, 2026',
          merchant: 'SPOTIFY',
          type: 'Subscription',
          amount: '-$11.99'
        },
        {
          date: 'May 27, 2026',
          merchant: 'ELECTRIC COMPANY',
          type: 'Bill Payment',
          amount: '-$88.85'
        },
        {
          date: 'May 26, 2026',
          merchant: 'WALMART',
          type: 'Card Purchase',
          amount: '-$93.80'
        },
        {
          date: 'May 26, 2026',
          merchant: 'MCDONALD\'S',
          type: 'Card Purchase',
          amount: '-$9.90'
        },
        {
          date: 'May 25, 2026',
          merchant: 'MCDONALD\'S',
          type: 'Card Purchase',
          amount: '-$14.34'
        },
        {
          date: 'May 25, 2026',
          merchant: 'APPLE.COM/BILL',
          type: 'Subscription',
          amount: '-$11.99'
        },
        {
          date: 'May 25, 2026',
          merchant: 'WALMART',
          type: 'Card Purchase',
          amount: '-$58.00'
        },
        {
          date: 'May 25, 2026',
          merchant: 'PAYROLL DEPOSIT',
          type: 'Direct Deposit',
          amount: '$2,500.00'
        },
        {
          date: 'May 25, 2026',
          merchant: 'DOORDASH',
          type: 'Card Purchase',
          amount: '-$26.67'
        },
        {
          date: 'May 25, 2026',
          merchant: 'SPOTIFY',
          type: 'Subscription',
          amount: '-$11.99'
        },
        {
          date: 'May 24, 2026',
          merchant: 'AMAZON.COM',
          type: 'Card Purchase',
          amount: '-$38.35'
        },
        {
          date: 'May 24, 2026',
          merchant: 'WALMART',
          type: 'Card Purchase',
          amount: '-$78.20'
        },
        {
          date: 'May 23, 2026',
          merchant: 'UBER',
          type: 'Card Purchase',
          amount: '-$19.90'
        },
        {
          date: 'May 23, 2026',
          merchant: 'WHOLE FOODS',
          type: 'Card Purchase',
          amount: '-$74.20'
        },
        {
          date: 'May 22, 2026',
          merchant: 'ELECTRIC COMPANY',
          type: 'Bill Payment',
          amount: '-$107.05'
        },
        {
          date: 'May 22, 2026',
          merchant: 'STARBUCKS',
          type: 'Card Purchase',
          amount: '-$8.90'
        },
        {
          date: 'May 21, 2026',
          merchant: 'MCDONALD\'S',
          type: 'Card Purchase',
          amount: '-$13.02'
        },
        {
          date: 'May 21, 2026',
          merchant: 'APPLE.COM/BILL',
          type: 'Subscription',
          amount: '-$11.99'
        },
        {
          date: 'May 20, 2026',
          merchant: 'CVS PHARMACY',
          type: 'Card Purchase',
          amount: '-$24.78'
        },
        {
          date: 'May 20, 2026',
          merchant: 'TRADER JOE\'S',
          type: 'Card Purchase',
          amount: '-$66.40'
        },
        {
          date: 'May 19, 2026',
          merchant: 'SHELL OIL',
          type: 'Fuel Purchase',
          amount: '-$54.00'
        },
        {
          date: 'May 19, 2026',
          merchant: 'CHIPOTLE',
          type: 'Card Purchase',
          amount: '-$17.52'
        },
        {
          date: 'May 18, 2026',
          merchant: 'RENT PAYMENT',
          type: 'Bill Payment',
          amount: '-$1,200.00'
        },
        {
          date: 'May 18, 2026',
          merchant: 'TARGET',
          type: 'Card Purchase',
          amount: '-$73.12'
        },
        {
          date: 'May 17, 2026',
          merchant: 'NETFLIX',
          type: 'Subscription',
          amount: '-$22.99'
        },
        {
          date: 'May 17, 2026',
          merchant: 'VERIZON WIRELESS',
          type: 'Bill Payment',
          amount: '-$79.99'
        },
        {
          date: 'May 16, 2026',
          merchant: 'DOORDASH',
          type: 'Card Purchase',
          amount: '-$32.79'
        },
        {
          date: 'May 16, 2026',
          merchant: 'SPOTIFY',
          type: 'Subscription',
          amount: '-$11.99'
        },
        {
          date: 'May 15, 2026',
          merchant: 'AMAZON.COM',
          type: 'Card Purchase',
          amount: '-$51.67'
        },
        {
          date: 'May 15, 2026',
          merchant: 'WALMART',
          type: 'Card Purchase',
          amount: '-$39.80'
        },
        {
          date: 'May 14, 2026',
          merchant: 'UBER',
          type: 'Card Purchase',
          amount: '-$23.50'
        },
        {
          date: 'May 14, 2026',
          merchant: 'WHOLE FOODS',
          type: 'Card Purchase',
          amount: '-$45.40'
        },
        {
          date: 'May 13, 2026',
          merchant: 'ELECTRIC COMPANY',
          type: 'Bill Payment',
          amount: '-$119.65'
        },
        {
          date: 'May 13, 2026',
          merchant: 'STARBUCKS',
          type: 'Card Purchase',
          amount: '-$6.98'
        },
        {
          date: 'May 12, 2026',
          merchant: 'MCDONALD\'S',
          type: 'Card Purchase',
          amount: '-$9.18'
        },
        {
          date: 'May 12, 2026',
          merchant: 'APPLE.COM/BILL',
          type: 'Subscription',
          amount: '-$11.99'
        },
        {
          date: 'May 11, 2026',
          merchant: 'WHOLE FOODS',
          type: 'Card Purchase',
          amount: '-$74.20'
        },
        {
          date: 'May 11, 2026',
          merchant: 'CVS PHARMACY',
          type: 'Card Purchase',
          amount: '-$28.74'
        },
        {
          date: 'May 11, 2026',
          merchant: 'TRADER JOE\'S',
          type: 'Card Purchase',
          amount: '-$43.00'
        },
        {
          date: 'May 11, 2026',
          merchant: 'PAYROLL DEPOSIT',
          type: 'Direct Deposit',
          amount: '$2,500.00'
        },
        {
          date: 'May 11, 2026',
          merchant: 'SPOTIFY',
          type: 'Subscription',
          amount: '-$11.99'
        },
        {
          date: 'May 11, 2026',
          merchant: 'ELECTRIC COMPANY',
          type: 'Bill Payment',
          amount: '-$110.55'
        },
        {
          date: 'May 10, 2026',
          merchant: 'WALMART',
          type: 'Card Purchase',
          amount: '-$71.00'
        },
        {
          date: 'May 10, 2026',
          merchant: 'MCDONALD\'S',
          type: 'Card Purchase',
          amount: '-$13.62'
        },
        {
          date: 'May 9, 2026',
          merchant: 'WHOLE FOODS',
          type: 'Card Purchase',
          amount: '-$68.80'
        },
        {
          date: 'May 9, 2026',
          merchant: 'CVS PHARMACY',
          type: 'Card Purchase',
          amount: '-$26.58'
        },
        {
          date: 'May 8, 2026',
          merchant: 'STARBUCKS',
          type: 'Card Purchase',
          amount: '-$8.54'
        },
        {
          date: 'May 8, 2026',
          merchant: 'SHELL OIL',
          type: 'Fuel Purchase',
          amount: '-$55.60'
        },
        {
          date: 'May 7, 2026',
          merchant: 'APPLE.COM/BILL',
          type: 'Subscription',
          amount: '-$11.99'
        },
        {
          date: 'May 7, 2026',
          merchant: 'TRADER JOE\'S',
          type: 'Card Purchase',
          amount: '-$56.20'
        },
        {
          date: 'May 6, 2026',
          merchant: 'TRADER JOE\'S',
          type: 'Card Purchase',
          amount: '-$62.80'
        },
        {
          date: 'May 6, 2026',
          merchant: 'NETFLIX',
          type: 'Subscription',
          amount: '-$22.99'
        },
        {
          date: 'May 5, 2026',
          merchant: 'CHIPOTLE',
          type: 'Card Purchase',
          amount: '-$16.80'
        },
        {
          date: 'May 5, 2026',
          merchant: 'DOORDASH',
          type: 'Card Purchase',
          amount: '-$34.49'
        },
        {
          date: 'May 4, 2026',
          merchant: 'TARGET',
          type: 'Card Purchase',
          amount: '-$67.48'
        },
        {
          date: 'May 4, 2026',
          merchant: 'AMAZON.COM',
          type: 'Card Purchase',
          amount: '-$18.37'
        },
        {
          date: 'May 3, 2026',
          merchant: 'VERIZON WIRELESS',
          type: 'Bill Payment',
          amount: '-$79.99'
        },
        {
          date: 'May 3, 2026',
          merchant: 'UBER',
          type: 'Card Purchase',
          amount: '-$14.50'
        },
        {
          date: 'May 2, 2026',
          merchant: 'SPOTIFY',
          type: 'Subscription',
          amount: '-$11.99'
        },
        {
          date: 'May 2, 2026',
          merchant: 'ELECTRIC COMPANY',
          type: 'Bill Payment',
          amount: '-$88.15'
        },
        {
          date: 'May 1, 2026',
          merchant: 'WALMART',
          type: 'Card Purchase',
          amount: '-$92.60'
        },
        {
          date: 'May 1, 2026',
          merchant: 'MCDONALD\'S',
          type: 'Card Purchase',
          amount: '-$9.78'
        },
        {
          date: 'Apr 30, 2026',
          merchant: 'VERIZON WIRELESS',
          type: 'Bill Payment',
          amount: '-$79.99'
        },
        {
          date: 'Apr 30, 2026',
          merchant: 'UBER',
          type: 'Card Purchase',
          amount: '-$14.70'
        },
        {
          date: 'Apr 29, 2026',
          merchant: 'SPOTIFY',
          type: 'Subscription',
          amount: '-$11.99'
        },
        {
          date: 'Apr 29, 2026',
          merchant: 'ELECTRIC COMPANY',
          type: 'Bill Payment',
          amount: '-$88.85'
        },
        {
          date: 'Apr 28, 2026',
          merchant: 'WALMART',
          type: 'Card Purchase',
          amount: '-$93.80'
        },
        {
          date: 'Apr 28, 2026',
          merchant: 'MCDONALD\'S',
          type: 'Card Purchase',
          amount: '-$9.90'
        },
        {
          date: 'Apr 27, 2026',
          merchant: 'ELECTRIC COMPANY',
          type: 'Bill Payment',
          amount: '-$107.05'
        },
        {
          date: 'Apr 27, 2026',
          merchant: 'STARBUCKS',
          type: 'Card Purchase',
          amount: '-$8.90'
        },
        {
          date: 'Apr 27, 2026',
          merchant: 'SHELL OIL',
          type: 'Fuel Purchase',
          amount: '-$57.52'
        },
        {
          date: 'Apr 27, 2026',
          merchant: 'PAYROLL DEPOSIT',
          type: 'Direct Deposit',
          amount: '$2,500.00'
        },
        {
          date: 'Apr 27, 2026',
          merchant: 'DOORDASH',
          type: 'Card Purchase',
          amount: '-$26.67'
        },
        {
          date: 'Apr 27, 2026',
          merchant: 'SPOTIFY',
          type: 'Subscription',
          amount: '-$11.99'
        },
        {
          date: 'Apr 26, 2026',
          merchant: 'AMAZON.COM',
          type: 'Card Purchase',
          amount: '-$38.35'
        },
        {
          date: 'Apr 26, 2026',
          merchant: 'WALMART',
          type: 'Card Purchase',
          amount: '-$78.20'
        },
        {
          date: 'Apr 25, 2026',
          merchant: 'UBER',
          type: 'Card Purchase',
          amount: '-$19.90'
        },
        {
          date: 'Apr 25, 2026',
          merchant: 'WHOLE FOODS',
          type: 'Card Purchase',
          amount: '-$74.20'
        },
        {
          date: 'Apr 24, 2026',
          merchant: 'ELECTRIC COMPANY',
          type: 'Bill Payment',
          amount: '-$107.05'
        },
        {
          date: 'Apr 24, 2026',
          merchant: 'STARBUCKS',
          type: 'Card Purchase',
          amount: '-$8.90'
        },
        {
          date: 'Apr 23, 2026',
          merchant: 'MCDONALD\'S',
          type: 'Card Purchase',
          amount: '-$13.02'
        },
        {
          date: 'Apr 23, 2026',
          merchant: 'APPLE.COM/BILL',
          type: 'Subscription',
          amount: '-$11.99'
        },
        {
          date: 'Apr 22, 2026',
          merchant: 'CVS PHARMACY',
          type: 'Card Purchase',
          amount: '-$24.78'
        },
        {
          date: 'Apr 22, 2026',
          merchant: 'TRADER JOE\'S',
          type: 'Card Purchase',
          amount: '-$66.40'
        },
        {
          date: 'Apr 21, 2026',
          merchant: 'SHELL OIL',
          type: 'Fuel Purchase',
          amount: '-$54.00'
        },
        {
          date: 'Apr 21, 2026',
          merchant: 'CHIPOTLE',
          type: 'Card Purchase',
          amount: '-$17.52'
        },
        {
          date: 'Apr 20, 2026',
          merchant: 'RENT PAYMENT',
          type: 'Bill Payment',
          amount: '-$1,200.00'
        },
        {
          date: 'Apr 20, 2026',
          merchant: 'TARGET',
          type: 'Card Purchase',
          amount: '-$73.12'
        },
        {
          date: 'Apr 19, 2026',
          merchant: 'NETFLIX',
          type: 'Subscription',
          amount: '-$22.99'
        },
        {
          date: 'Apr 19, 2026',
          merchant: 'VERIZON WIRELESS',
          type: 'Bill Payment',
          amount: '-$79.99'
        },
        {
          date: 'Apr 18, 2026',
          merchant: 'DOORDASH',
          type: 'Card Purchase',
          amount: '-$32.79'
        },
        {
          date: 'Apr 18, 2026',
          merchant: 'SPOTIFY',
          type: 'Subscription',
          amount: '-$11.99'
        },
        {
          date: 'Apr 17, 2026',
          merchant: 'AMAZON.COM',
          type: 'Card Purchase',
          amount: '-$51.67'
        },
        {
          date: 'Apr 17, 2026',
          merchant: 'WALMART',
          type: 'Card Purchase',
          amount: '-$39.80'
        },
        {
          date: 'Apr 16, 2026',
          merchant: 'UBER',
          type: 'Card Purchase',
          amount: '-$23.50'
        },
        {
          date: 'Apr 16, 2026',
          merchant: 'WHOLE FOODS',
          type: 'Card Purchase',
          amount: '-$45.40'
        },
        {
          date: 'Apr 15, 2026',
          merchant: 'ELECTRIC COMPANY',
          type: 'Bill Payment',
          amount: '-$119.65'
        },
        {
          date: 'Apr 15, 2026',
          merchant: 'STARBUCKS',
          type: 'Card Purchase',
          amount: '-$6.98'
        },
        {
          date: 'Apr 14, 2026',
          merchant: 'MCDONALD\'S',
          type: 'Card Purchase',
          amount: '-$9.18'
        },
        {
          date: 'Apr 14, 2026',
          merchant: 'APPLE.COM/BILL',
          type: 'Subscription',
          amount: '-$11.99'
        },
        {
          date: 'Apr 13, 2026',
          merchant: 'WALMART',
          type: 'Card Purchase',
          amount: '-$65.00'
        },
        {
          date: 'Apr 13, 2026',
          merchant: 'MCDONALD\'S',
          type: 'Card Purchase',
          amount: '-$13.02'
        },
        {
          date: 'Apr 13, 2026',
          merchant: 'APPLE.COM/BILL',
          type: 'Subscription',
          amount: '-$11.99'
        },
        {
          date: 'Apr 13, 2026',
          merchant: 'PAYROLL DEPOSIT',
          type: 'Direct Deposit',
          amount: '$2,500.00'
        },
      ],
    },
  };

  function currentPage() {
    const path = window.location.pathname || '';
    const page = path.split('/').pop();
    return page || 'index.html';
  }

  function isLoggedIn() {
    return localStorage.getItem(KEY) === '1';
  }

  function getUserId() {
    return localStorage.getItem(USER_KEY) || 'melissa';
  }

  function getCurrentUser() {
    return USERS[getUserId()] || USERS.melissa;
  }

  function findUserByCredentials(username, password) {
    const u = String(username || '').trim();
    const p = String(password || '');
    return Object.values(USERS).find((user) => user.username === u && user.password === p) || null;
  }

  function login(userId) {
    localStorage.setItem(KEY, '1');
    if (userId && USERS[userId]) {
      localStorage.setItem(USER_KEY, userId);
    }
    localStorage.removeItem('pendingTransfer');
  }

  function logout() {
    localStorage.removeItem(KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem('pendingTransfer');
    window.location.href = 'index.html';
  }

  function requireAuth() {
    if (!isLoggedIn()) {
      window.location.replace('index.html');
      return false;
    }
    return true;
  }

  function setText(selector, value) {
    document.querySelectorAll(selector).forEach((el) => {
      el.textContent = value;
    });
  }

  function encodeAccountQuery(title, balance, theme) {
    const params = new URLSearchParams({
      name: title,
      available: balance,
      current: balance,
      theme: theme || 'blue',
    });
    return 'account.html?' + params.toString();
  }

  function renderAccounts(user) {
    const list = document.getElementById('userAccountsList');
    if (!list || !user.accounts) return;

    list.innerHTML = user.accounts.map((acct) => {
      return (
        '<a class="wf-acct-card wf-acct-link" href="' + encodeAccountQuery(acct.title, acct.balance, acct.theme) + '">' +
          '<div class="wf-acct-title">' + acct.title + '</div>' +
          '<div class="wf-acct-balance">' + acct.balance + '</div>' +
          '<div class="wf-acct-label">Available balance</div>' +
          '<span class="wf-acct-dot ' + acct.dot + '" aria-hidden="true"></span>' +
        '</a>'
      );
    }).join('');
  }

  function renderTransferAccounts(user) {
    const select = document.getElementById('fromAccount');
    if (!select || !user.accounts) return;
    select.innerHTML = user.accounts.map((acct) => {
      return '<option>' + acct.title + ' - ' + acct.balance + '</option>';
    }).join('');
  }

  function renderHistoryExtras(user) {
    const host = document.getElementById('userHistoryExtras');
    if (!host) return;

    const extras = user.historyExtras || [];
    if (!extras.length) {
      host.innerHTML = '';
      host.style.display = 'none';
      return;
    }

    host.style.display = '';
    let html = '';
    let lastDate = null;
    extras.forEach((item) => {
      if (item.date !== lastDate) {
        html += '<div class="wf-history-date">' + item.date + '</div>';
        lastDate = item.date;
      }
      const pending = !!item.pending;
      const itemClass = pending ? 'wf-history-item wf-history-item-pending' : 'wf-history-item';
      const merchantClass = pending ? 'wf-history-merchant wf-history-merchant-pending' : 'wf-history-merchant';
      const rightClass = pending ? 'wf-history-right wf-history-right-pending' : 'wf-history-right';
      const amountHtml = pending
        ? item.amount + '<span class="wf-history-status">Pending</span>'
        : item.amount;
      html += (
        '<div class="' + itemClass + '">' +
          '<div class="wf-history-left">' +
            '<div class="' + merchantClass + '">' + item.merchant + '</div>' +
            '<div class="wf-history-type">' + item.type + '</div>' +
          '</div>' +
          '<div class="' + rightClass + '">' + amountHtml + '</div>' +
        '</div>'
      );
    });
    host.innerHTML = html;

    host.querySelectorAll('.wf-history-right').forEach((el) => {
      if (el.classList.contains('wf-history-right-pending')) return;
      const value = (el.textContent || '').trim();
      if (value.startsWith('-')) el.classList.add('wf-history-right-debit');
      else el.classList.add('wf-history-right-credit');
    });
  }

  function applyProfile() {
    if (!isLoggedIn()) {
      document.documentElement.classList.add('wf-profile-ready');
      document.documentElement.classList.remove('wf-auth-pending');
      return getCurrentUser();
    }
    const user = getCurrentUser();

    setText('[data-user-name]', user.name);
    setText('[data-user-greeting-name]', user.firstName);
    setText('[data-user-dob]', user.dob || '');
    setText('[data-user-email]', user.email);
    setText('[data-user-state]', user.state);
    setText('[data-user-since]', user.since);
    setText('[data-user-spending-name]', user.name + ' Spending Cards');
    const checkingLast4 = (user.accountNumber || '5688').slice(-4);
    setText('[data-user-card-checking]', user.name + "'s Checking..." + checkingLast4);
    setText('[data-user-card-savings]', user.name + "'s Savings...1902");
    setText('[data-user-card-balance]', user.cardBalance || '$0.00');
    setText('[data-user-spending-balance]', user.spendingBalance || '$0.00');
    setText('[data-user-sex]', user.sex || '');
    setText('[data-user-relationship]', user.relationship || '');
    setText('[data-user-account-number]', user.accountNumber || '');
    setText('[data-user-routing-number]', user.routingNumber || '');

    if (user.phone) setText('[data-user-phone]', user.phone);
    if (user.address) setText('[data-user-address]', user.address);
    if (user.zip) setText('[data-user-zip]', user.zip);
    if (user.age) setText('[data-user-age]', user.age);

    document.querySelectorAll('[data-user-photo]').forEach((el) => {
      el.setAttribute('src', user.photo);
      el.setAttribute('alt', user.name + ' profile photo');
    });

    document.querySelectorAll('[data-hide-if-no-address]').forEach((el) => {
      el.style.display = user.showAddress ? '' : 'none';
    });

    document.querySelectorAll('[data-show-if-age]').forEach((el) => {
      el.style.display = user.age ? '' : 'none';
    });

    document.querySelectorAll('[data-hide-if-no-dob]').forEach((el) => {
      el.style.display = user.dob ? '' : 'none';
    });

    document.querySelectorAll('[data-show-if-sex]').forEach((el) => {
      el.style.display = user.sex ? '' : 'none';
    });

    document.querySelectorAll('[data-show-if-relationship]').forEach((el) => {
      el.style.display = user.relationship ? '' : 'none';
    });

    document.querySelectorAll('[data-show-if-account-details]').forEach((el) => {
      el.style.display = user.accountNumber || user.routingNumber ? '' : 'none';
    });

    document.querySelectorAll('[data-hide-if-no-phone]').forEach((el) => {
      el.style.display = user.phone ? '' : 'none';
    });

    document.querySelectorAll('[data-hide-if-no-spending]').forEach((el) => {
      el.style.display = user.showSpendingCard === false ? 'none' : '';
    });

    document.querySelectorAll('[data-show-for-user]').forEach((el) => {
      const allowed = el.getAttribute('data-show-for-user');
      el.style.display = allowed === user.id ? '' : 'none';
    });

    // Melissa uses shared HTML history; other users use historyExtras only.
    const sharedHistory = document.getElementById('sharedHistory');
    if (sharedHistory) {
      sharedHistory.style.display = user.id === 'melissa' ? '' : 'none';
    }

    const showRestriction = user.showRestrictionNotice !== false;
    document.querySelectorAll('[data-restriction-badge]').forEach((el) => {
      el.style.display = showRestriction ? '' : 'none';
    });
    const noticeTitle = document.querySelector('[data-notice-title]');
    const noticeLine1 = document.querySelector('[data-notice-line1]');
    const noticeLine2 = document.querySelector('[data-notice-line2]');
    if (noticeTitle && noticeLine1 && noticeLine2) {
      if (showRestriction) {
        noticeTitle.textContent = 'Account Restricted';
        noticeLine1.textContent = 'Your account has been restricted.';
        noticeLine2.textContent = 'Reason: Unusual transfer activity was detected and outgoing transfers are temporarily blocked.';
        noticeLine2.style.display = '';
      } else {
        noticeTitle.textContent = 'Notifications';
        noticeLine1.textContent = 'You have no new account alerts.';
        noticeLine2.textContent = '';
        noticeLine2.style.display = 'none';
      }
    }

    renderAccounts(user);
    renderTransferAccounts(user);
    renderHistoryExtras(user);

    document.documentElement.classList.add('wf-profile-ready');
    document.documentElement.classList.remove('wf-auth-pending');

    return user;
  }

  window.wfAuth = {
    isLoggedIn,
    login,
    logout,
    requireAuth,
    getCurrentUser,
    findUserByCredentials,
    applyProfile,
    USERS,
  };

  if (PROTECTED_PAGES.has(currentPage())) {
    document.documentElement.classList.add('wf-auth-pending');
    if (!document.getElementById('wf-auth-pending-style')) {
      const style = document.createElement('style');
      style.id = 'wf-auth-pending-style';
      style.textContent =
        'html.wf-auth-pending body{opacity:0!important;}' +
        'html.wf-profile-ready body{opacity:1!important;}';
      document.head.appendChild(style);
    }
    requireAuth();
  }

  function bootProfile() {
    applyProfile();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootProfile);
  } else {
    bootProfile();
  }
})();
