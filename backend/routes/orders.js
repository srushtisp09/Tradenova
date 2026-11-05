import { Router } from 'express';
import Order from '../models/Order.js';
import Instrument from '../models/Instrument.js';
import asyncHandler from '../utils/asyncHandler.js';
import { HttpError } from '../utils/httpError.js';

const router = Router();

// GET /api/orders -> the 50 newest orders
router.get('/', asyncHandler(async (req, res) => {
  res.json(await Order.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(50).lean());
}));

// POST /api/orders -> saves an order after checking every field.
// It is stored as OPEN. Step 9 will execute it and update cash and holdings.
router.post('/', asyncHandler(async (req, res) => {
  const { side, type = 'MARKET', product = 'CNC' } = req.body;
  const symbol = String(req.body.symbol || '').toUpperCase().trim();
  const qty = Number(req.body.qty);
  const price = Number(req.body.price);

  if (!['BUY', 'SELL'].includes(side)) throw new HttpError(400, 'side must be BUY or SELL');
  if (!['MARKET', 'LIMIT'].includes(type)) throw new HttpError(400, 'type must be MARKET or LIMIT');
  if (!['CNC', 'MIS'].includes(product)) throw new HttpError(400, 'product must be CNC or MIS');
  if (!Number.isInteger(qty) || qty < 1 || qty > 10000) throw new HttpError(400, 'qty must be a whole number from 1 to 10000');
  if (type === 'LIMIT' && !(price > 0)) throw new HttpError(400, 'LIMIT orders need a price above 0');
  if (!(await Instrument.exists({ symbol, isIndex: false }))) throw new HttpError(404, 'Unknown symbol');

  const order = await Order.create({ user: req.user._id, symbol, side, type, product, qty, price: type === 'LIMIT' ? price : undefined });
  res.status(201).json(order);
}));

export default router;
