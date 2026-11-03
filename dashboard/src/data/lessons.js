// Beginner academy content. Add a lesson here and it appears on the Learn page.
// Step types: text, tug, candle, calc, quiz
export const lessons = [
  { id: 'stock', emoji: '🍕', title: 'What is a stock?', mins: 3, xp: 50, steps: [
    { type: 'text', emoji: '🍕', title: 'Imagine a giant pizza', body: 'A company is like a giant pizza. A stock (or share) is one slice. Buy a stock and you own a tiny slice of that company.' },
    { type: 'text', emoji: '🏭', title: 'Why sell slices?', body: 'Companies sell slices to raise money and grow. In return, you share in their wins and their bad days.' },
    { type: 'quiz', q: 'You own 1 share of a company. What do you own?', options: ['A tiny slice of the company', 'A loan you gave the company', 'A coupon for its products'], answer: 0, why: 'Yes! A share is a small piece of ownership.' },
  ] },
  { id: 'price', emoji: '⚖️', title: 'Why prices move', mins: 3, xp: 50, steps: [
    { type: 'text', emoji: '⚖️', title: 'A tug-of-war', body: 'Every price is a tug-of-war between buyers and sellers. Whoever pulls harder moves the price.' },
    { type: 'tug' },
    { type: 'quiz', q: 'More buyers than sellers. What usually happens to the price?', options: ['It rises', 'It falls', 'Nothing'], answer: 0, why: 'Right! Eager buyers push the price up.' },
  ] },
  { id: 'chart', emoji: '🕯️', title: 'Reading a candle', mins: 4, xp: 60, steps: [
    { type: 'text', emoji: '🕯️', title: 'Charts tell a story', body: 'Traders read price history with candles. One candle shows what the price did in one period, like one day.' },
    { type: 'candle' },
    { type: 'quiz', q: 'A green candle means…', options: ['Price closed higher than it opened', 'Price closed lower than it opened', 'The market was closed'], answer: 0, why: 'Green = up, red = down.' },
  ] },
  { id: 'order', emoji: '🛒', title: 'Buying: market vs limit', mins: 4, xp: 60, steps: [
    { type: 'text', emoji: '⚡', title: 'Market order', body: 'Buy right now at the current price. Fast, but you take whatever price is available.' },
    { type: 'text', emoji: '🎯', title: 'Limit order', body: 'You name your price. The order only happens if the market reaches it. Slower, but you control the price.' },
    { type: 'quiz', q: 'You want to buy only if the price drops to ₹100. Which order?', options: ['Market order', 'Limit order', 'Neither'], answer: 1, why: 'A limit order waits for your price.' },
  ] },
  { id: 'risk', emoji: '🧺', title: "Don't drop all your eggs", mins: 4, xp: 60, steps: [
    { type: 'text', emoji: '🥚', title: 'Diversify', body: 'Spread money across different companies and sectors. If one falls, the others cushion it.' },
    { type: 'text', emoji: '🛑', title: 'Stop-loss', body: 'A stop-loss is a safety exit: you decide in advance how much loss you accept, then stick to it.' },
    { type: 'quiz', q: 'Which plan is safer?', options: ['All money in one stock', 'Spread across several companies and sectors', 'Only buy what is trending'], answer: 1, why: 'Spreading risk is the oldest rule in investing.' },
  ] },
  { id: 'grow', emoji: '🌱', title: 'The magic of compounding', mins: 5, xp: 70, steps: [
    { type: 'text', emoji: '❄️', title: 'A snowball', body: 'Gains start earning their own gains, like a snowball rolling downhill. Time makes it huge.' },
    { type: 'calc' },
    { type: 'quiz', q: 'What helps compounding the most?', options: ['Starting early and staying invested', 'Checking prices every minute', 'Waiting for the perfect moment'], answer: 0, why: 'Time in the market beats timing the market.' },
  ] },
];

export const glossary = [
  ['Bull market', 'Prices are rising and people feel confident 🐂'],
  ['Bear market', 'Prices are falling and people feel nervous 🐻'],
  ['Dividend', 'A share of company profit paid to its shareholders 💰'],
  ['Portfolio', 'All your investments together, in one place 🧺'],
  ['Volume', 'How many shares changed hands today 📊'],
  ['Stop-loss', 'An automatic exit if the price falls to a level you chose 🛑'],
  ['IPO', 'The first time a company sells its shares to the public 🎉'],
  ['NIFTY 50', 'A score that tracks 50 of India’s biggest companies 🇮🇳'],
];
