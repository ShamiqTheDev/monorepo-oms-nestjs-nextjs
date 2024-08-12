'use client';

import { styled } from '@atdb/design-system';
import { OrdersDataTable } from './table';
import { fetchOrders } from './server-utils';
import { useEffect, useState } from 'react';
import { Order } from './type';
import Head from 'next/head';
import { autoRefresh } from './client-utils';

export default function Orders({ closed }: { closed: boolean }) {
  const [orders, setOrders] = useState([] as Order[]);
  useEffect(() => {
    const getOrders = async () => {
      try {
        const orders = await fetchOrders(closed);
        setOrders(orders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };
    return autoRefresh(getOrders, 15000);
  }, []);

  return (
    <>
      <Head>
        <title>Orders List</title>
      </Head>
      <styled.h2 textStyle={'textStyles.headings.h2'} fontWeight={600} mb={'xl'}>
        Orders List
      </styled.h2>
      <styled.div fontSize={'14px'}>
        <OrdersDataTable data={orders.filter((order) => !order.deleted)} />
      </styled.div>
    </>
  );
}
