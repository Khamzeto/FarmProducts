'use client';

import { useEffect, useState } from 'react';
import { Button, Card, Divider, Group, Image, Stack, Text, TextInput, Title } from '@mantine/core';
import { HeaderMegaMenu } from '@/components/ui/Header/Header';
import StickyHeader from '@/components/ui/StickyHeader/StickyHeader';

function OrderSummaryItem({ item }) {
  const { image, title, price, quantity } = item;
  return (
    <Group mt="md" style={{ width: '100%' }}>
      <Image src={image} width={70} height={70} alt={title} radius="sm" />
      <Text size="sm" style={{ flex: 1, marginLeft: '10px' }}>
        {title}
      </Text>
      <Text size="sm">
        {quantity} x {price} ₽
      </Text>
      <Text size="sm" style={{ marginRight: '10px' }}>
        {price * quantity} ₽
      </Text>
    </Group>
  );
}

export default function OrderPage() {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [contactInfo, setContactInfo] = useState({
    name: '',
    phone: '',
    address: '',
    email: '', // Добавляем поле для email
  });
  console.log(cartItems);

  useEffect(() => {
    const cartData = JSON.parse(localStorage.getItem('cart')) || [];
    const itemsArray = Array.isArray(cartData) ? cartData : Object.values(cartData);
    setCartItems(itemsArray);
    setTotalPrice(itemsArray.reduce((sum, item) => sum + item.price * item.quantity, 0));
  }, []);
  console.log(cartItems);
  const handlePlaceOrder = async () => {
    if (!contactInfo.name || !contactInfo.phone || !contactInfo.address || !contactInfo.email) {
      alert('Пожалуйста, заполните все поля.');
      return;
    }

    const orderData = {
      items: cartItems.map((item) => ({
        productId: item._id || item.id,
        quantity: item.quantity,
      })),
      buyerDetails: contactInfo,
      totalAmount: totalPrice,
      userId: '6730bf46e48003f8f4842432', // Здесь установите ID текущего покупателя
    };

    try {
      const response = await fetch('http://localhost:5001/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        alert('Ваш заказ успешно оформлен!');
        localStorage.removeItem('cart'); // Очистка корзины
        setCartItems([]);
        setTotalPrice(0);
      } else {
        const errorData = await response.json();
        alert(`Ошибка при оформлении заказа: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Ошибка при оформлении заказа');
    }
  };

  return (
    <>
      <HeaderMegaMenu />
      <StickyHeader />
      <div style={{ maxWidth: '800px', margin: 'auto', padding: '20px' }}>
        <Title order={2} mb="lg">
          Ваш заказ
        </Title>
        <Card padding="lg" radius="lg" style={{ marginBottom: '20px' }}>
          <Text size="lg">Корзина</Text>
          {cartItems.map((item) => (
            <OrderSummaryItem key={item.id} item={item} />
          ))}
          <Divider my="lg" />
          <Group>
            <Text size="md">Итого:</Text>
            <Text size="md" color="teal">
              {totalPrice} ₽
            </Text>
          </Group>
        </Card>

        <Card padding="lg" radius="lg">
          <Text size="lg" mb="md">
            Контактные данные
          </Text>
          <Stack>
            <TextInput
              label="Имя"
              placeholder="Введите ваше имя"
              value={contactInfo.name}
              onChange={(e) => setContactInfo({ ...contactInfo, name: e.currentTarget.value })}
              required
            />
            <TextInput
              label="Телефон"
              placeholder="Введите ваш телефон"
              value={contactInfo.phone}
              onChange={(e) => setContactInfo({ ...contactInfo, phone: e.currentTarget.value })}
              required
            />
            <TextInput
              label="Адрес"
              placeholder="Введите ваш адрес"
              value={contactInfo.address}
              onChange={(e) => setContactInfo({ ...contactInfo, address: e.currentTarget.value })}
              required
            />
            <TextInput
              label="Email" // Добавляем поле для email
              placeholder="Введите ваш email"
              value={contactInfo.email}
              onChange={(e) => setContactInfo({ ...contactInfo, email: e.currentTarget.value })}
              required
            />
            <Button
              radius="9"
              variant="filled"
              color="teal"
              fullWidth
              mt="md"
              onClick={handlePlaceOrder}
            >
              Заказать
            </Button>
          </Stack>
        </Card>
      </div>
    </>
  );
}
