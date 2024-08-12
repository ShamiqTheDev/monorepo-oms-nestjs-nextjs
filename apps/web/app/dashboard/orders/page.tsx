'use client';

import Orders from './orders';

export default function OpenOrders() {
  return Orders({ closed: false });
}
