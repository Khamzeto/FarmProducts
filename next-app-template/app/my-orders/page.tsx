'use client';

import { useEffect, useState } from 'react';
import { Badge, Card, Divider, Group, Stack, Text, Title } from '@mantine/core';
import { HeaderMegaMenu } from '@/components/ui/Header/Header';
import StickyHeader from '@/components/ui/StickyHeader/StickyHeader';

function OrderCard({ order }) {
  return (
    <Card shadow="sm" padding="lg" radius="md" style={{ marginBottom: '20px' }}>
      <Group>
        <Title order={4}>Заказ № {order._id}</Title>
        <Badge
          color={
            order.status === 'completed' ? 'green' : order.status === 'pending' ? 'yellow' : 'red'
          }
        >
          {order.status === 'pending'
            ? 'В ожидании'
            : order.status === 'completed'
              ? 'Выполнен'
              : 'Отклонен'}
        </Badge>
      </Group>

      <Divider my="sm" />

      <Text>Контактные данные:</Text>
      <Text>Имя: {order.buyerDetails.name}</Text>
      <Text>Телефон: {order.buyerDetails.phone}</Text>
      <Text>Адрес: {order.buyerDetails.address}</Text>
      <Text>Email: {order.buyerDetails.email}</Text>

      <Divider my="sm" />

      <Text>Товары:</Text>
      {order.items.map((item, index) => (
        <Group key={index} style={{ width: '100%' }}>
          <Text>Продукт: {item.productId?.title}</Text>
          <Text>Цена: {item.productId?.price} ₽</Text>
          <Text>Кол-во: {item.quantity}</Text>
          <Text>Сумма: {item.productId?.price * item.quantity} ₽</Text>
        </Group>
      ))}

      <Divider my="sm" />

      <Text>Общая сумма: {order.totalAmount} ₽</Text>
    </Card>
  );
}

export default function UserOrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    async function fetchOrders() {
      const userId = localStorage.getItem('user');

      if (!userId) {
        console.error('User ID отсутствует в локальном хранилище');
        return;
      }

      try {
        const response = await fetch(`http://localhost:5001/api/orders/user/${userId}`);
        if (!response.ok) throw new Error('Ошибка при получении заказов');

        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error('Ошибка при загрузке заказов:', error);
      }
    }

    fetchOrders();
  }, []);

  return (
    <>
      <HeaderMegaMenu />
      <StickyHeader />
      <div style={{ maxWidth: '800px', margin: 'auto', padding: '20px' }}>
        <Title order={2} mb="lg">
          Мои заказы
        </Title>
        <Stack>
          {orders.length > 0 ? (
            orders.map((order) => <OrderCard key={order._id} order={order} />)
          ) : (
            <Text color="dimmed" mt="md">
              Заказы отсутствуют.
            </Text>
          )}
        </Stack>
      </div>
    </>
  );
}
