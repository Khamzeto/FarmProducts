'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { IconMinus, IconPlus, IconTrash } from '@tabler/icons-react';
import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Divider,
  Group,
  Image,
  ScrollArea,
  Stack,
  Text,
} from '@mantine/core';

function CartItem({ item, updateQuantity, removeItem }) {
  const { id, image, title, price, quantity, weight } = item;

  const handleIncrement = () => updateQuantity(id, quantity + 1);
  const handleDecrement = () => updateQuantity(id, quantity - 1);

  return (
    <Group mt="md" style={{ width: '100%' }}>
      <Image src={image} width={70} height={70} alt={title} radius="sm" />
      <div style={{ flex: 1, marginLeft: '10px' }}>
        <Text style={{ fontSize: '1rem' }}>{title}</Text>
        <Text size="xs" color="dimmed" mt={4}>
          {price} ₽ / {weight}
        </Text>
        <Group mt="xs" align="center">
          <ActionIcon
            onClick={handleDecrement}
            disabled={quantity === 1}
            variant="light"
            size="sm"
            color={quantity === 1 ? 'gray' : 'teal'}
          >
            <IconMinus size={14} />
          </ActionIcon>
          <Text size="sm">{quantity}</Text>
          <ActionIcon onClick={handleIncrement} variant="light" size="sm" color="teal">
            <IconPlus size={14} />
          </ActionIcon>
        </Group>
      </div>
      <Text size="sm" style={{ marginRight: '10px' }}>
        {price * quantity} ₽
      </Text>
      <ActionIcon onClick={() => removeItem(id)} color="red" variant="subtle">
        <IconTrash size={16} />
      </ActionIcon>
    </Group>
  );
}

export function ShoppingCart() {
  const [cartItems, setCartItems] = useState([]);
  const [totalWeight, setTotalWeight] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const router = useRouter();
  useEffect(() => {
    const cartData = JSON.parse(localStorage.getItem('cart')) || [];
    console.log(cartData);
    const itemsArray = Array.isArray(cartData) ? cartData : Object.values(cartData);
    setCartItems(itemsArray);
    calculateSummary(itemsArray);
  }, []);
  useEffect(() => {
    const handleCartUpdate = () => {
      const cartData = JSON.parse(localStorage.getItem('cart')) || [];
      const itemsArray = Array.isArray(cartData) ? cartData : Object.values(cartData);
      setCartItems(itemsArray);
      calculateSummary(itemsArray);
    };

    window.addEventListener('cartUpdated', handleCartUpdate);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);
  const calculateSummary = (items) => {
    let weight = 0;
    let price = 0;
    let quantity = 0;

    items.forEach((item) => {
      if (item && item.weight && item.price && item.quantity) {
        weight += parseFloat(item.weight) * item.quantity;
        price += item.price * item.quantity;
        quantity += item.quantity;
      }
    });

    setTotalPrice(price);
    setTotalQuantity(quantity);
  };

  const updateQuantity = (id, newQuantity) => {
    const updatedCart = cartItems
      .map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item))
      .filter((item) => item.quantity > 0);

    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));

    calculateSummary(updatedCart);

    // Отправка события для обновления StickyHeader
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const removeItem = (id) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    calculateSummary(updatedCart);

    // Отправка события для обновления StickyHeader
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
    setTotalWeight(0);
    setTotalPrice(0);
    setTotalQuantity(0);

    // Отправка события для обновления StickyHeader
    window.dispatchEvent(new Event('cartUpdated'));
  };

  return (
    <Card
      radius="lg"
      padding="lg"
      style={{
        maxWidth: '700px',
        backgroundColor: '#ffffff',
        border: '1px solid #f0f0f0',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
      }}
    >
      <Text size="lg" mb="sm">
        Корзина
      </Text>
      <Badge
        color="teal"
        size="sm"
        radius="xl"
        variant="filled"
        style={{ padding: '4px 8px', fontWeight: 500 }}
      >
        Скидка на доставку от 3900 ₽
      </Badge>
      <ScrollArea style={{ maxHeight: '400px', paddingTop: '12px' }}>
        {cartItems.map((item) => (
          <CartItem
            key={item.id}
            item={item}
            updateQuantity={updateQuantity}
            removeItem={removeItem}
          />
        ))}
      </ScrollArea>

      <Divider my="lg" style={{ borderColor: '#e9ecef' }} />
      <Stack>
        <Group>
          <Text size="sm" color="dimmed">
            Кол-во товаров:
          </Text>
          <Text size="sm">{totalQuantity}</Text>
        </Group>
        <Group>
          <Text size="sm" color="dimmed">
            Вес посылки:
          </Text>
          <Text size="sm">{totalWeight} кг</Text>
        </Group>
        <Group>
          <Text size="sm" color="dimmed">
            Стоимость продуктов:
          </Text>
          <Text size="sm" color="teal">
            {totalPrice} ₽
          </Text>
        </Group>
      </Stack>
      <Button
        variant="filled"
        fullWidth
        mt="lg"
        radius="lg"
        size="md"
        color="teal"
        style={{
          backgroundColor: '#54e382',
          color: '#ffffff',
          fontWeight: 600,
        }}
        onClick={() => router.push('/order')} // Navigate to /order on click
      >
        Оформить заказ
      </Button>
      <Text mt="sm" size="xs" color="dimmed">
        Минимальная сумма заказа 900 ₽
      </Text>
      <Button radius="lg" variant="subtle" color="red" fullWidth mt="xs" onClick={clearCart}>
        Очистить корзину
      </Button>
    </Card>
  );
}

export default ShoppingCart;
