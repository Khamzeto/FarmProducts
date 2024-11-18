'use client';

import { useEffect, useState } from 'react';
import { Badge, Button, Card, Divider, Group, Stack, Text, Title } from '@mantine/core';
import { HeaderMegaMenu } from '@/components/ui/Header/Header';
import StickyHeader from '@/components/ui/StickyHeader/StickyHeader';

function OrderCard({ order, onComplete, onReject }) {
  return (
    <Card shadow="sm" padding="lg" radius="md" style={{ marginBottom: '20px' }}>
      <Group>
        <Title order={4}>Заказ № {order._id}</Title>
        <Badge color={order.status === 'completed' ? 'green' : 'yellow'}>
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

      <Group mt="lg">
        <Button
          color="green"
          disabled={order.status !== 'pending'}
          onClick={() => onComplete(order._id)}
        >
          Выполнить
        </Button>
        <Button
          color="red"
          variant="outline"
          disabled={order.status !== 'pending'}
          onClick={() => onReject(order._id)}
        >
          Отклонить
        </Button>
      </Group>
    </Card>
  );
}

export default function OrderManagementPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    async function fetchOrders() {
      const userId = localStorage.getItem('user'); // Получаем userId из localStorage

      if (!userId) {
        console.error('User ID отсутствует в локальном хранилище');
        return;
      }

      try {
        const response = await fetch(`http://localhost:5001/api/orders/seller/${userId}`);
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error('Ошибка при загрузке заказов:', error);
      }
    }
    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId, status) => {
    try {
      const response = await fetch(`http://localhost:5001/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error(`Ошибка при обновлении статуса заказа: ${errorData.message}`);
        return;
      }

      const updatedOrder = await response.json();
      setOrders((prevOrders) =>
        prevOrders.map((order) => (order._id === orderId ? updatedOrder : order))
      );
    } catch (error) {
      console.error('Ошибка при обновлении статуса заказа:', error);
    }
  };

  const handleCompleteOrder = (orderId) => updateOrderStatus(orderId, 'completed');
  const handleRejectOrder = (orderId) => updateOrderStatus(orderId, 'rejected');

  return (
    <>
      <HeaderMegaMenu />
      <StickyHeader />
      <div style={{ maxWidth: '800px', margin: 'auto', padding: '20px' }}>
        <Title order={2} mb="lg">
          Управление заказами
        </Title>
        <Stack>
          {orders.map((order) => (
            <OrderCard
              key={order._id}
              order={order}
              onComplete={handleCompleteOrder}
              onReject={handleRejectOrder}
            />
          ))}
        </Stack>
      </div>
    </>
  );
}
