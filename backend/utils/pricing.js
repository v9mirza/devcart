const TAX_RATE = 0.08;
const SHIPPING_FLAT = 15;
const FREE_SHIPPING_THRESHOLD = 350;

const roundMoney = (value) => Math.round((value + Number.EPSILON) * 100) / 100;

const calculatePricing = (items = []) => {
  const itemsPrice = roundMoney(
    items.reduce((total, item) => total + Number(item.price || 0) * Number(item.qty || 0), 0)
  );
  const taxPrice = roundMoney(itemsPrice * TAX_RATE);
  const shippingPrice = itemsPrice === 0
    ? 0
    : itemsPrice > FREE_SHIPPING_THRESHOLD
      ? 0
      : SHIPPING_FLAT;
  const totalPrice = roundMoney(itemsPrice + taxPrice + shippingPrice);

  return { itemsPrice, taxPrice, shippingPrice, totalPrice };
};

module.exports = {
  TAX_RATE,
  SHIPPING_FLAT,
  FREE_SHIPPING_THRESHOLD,
  calculatePricing,
};
