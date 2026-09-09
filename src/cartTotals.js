// Prices in db.json are mostly numbers, but a few hotel tax values are strings
// and one hotel has none at all, so coerce before doing any arithmetic.
const money = (value) => Number(value) || 0;

export const lineTotal = (item) => money(item.price) + money(item.taxes);

export const cartTotals = (hotels = [], flights = []) => {
  const items = [...hotels, ...flights];
  const subtotal = items.reduce((sum, item) => sum + money(item.price), 0);
  const taxes = items.reduce((sum, item) => sum + money(item.taxes), 0);
  return { subtotal, taxes, total: subtotal + taxes, count: items.length };
};

export const formatRupees = (value) => `₹${money(value).toLocaleString("en-IN")}`;
