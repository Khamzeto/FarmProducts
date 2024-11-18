// Favorites.js

'use client';

import { useEffect, useState } from 'react';
import { IconTrash } from '@tabler/icons-react';
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

function FavoriteItem({ item, removeFavorite }) {
  const { id, image, title, price, weight } = item;

  return (
    <Group mt="md" style={{ width: '100%', alignItems: 'center' }}>
      <Image src={image} width={70} height={70} alt={title} radius="sm" />
      <div style={{ flex: 1, marginLeft: '10px' }}>
        <Text style={{ fontSize: '1rem', lineHeight: 1.2 }}>{title}</Text>
        <Text size="xs" color="dimmed" mt={4}>
          {price} ₽ / {weight}
        </Text>
      </div>
      <ActionIcon onClick={() => removeFavorite(id)} color="red" variant="subtle">
        <IconTrash size={18} />
      </ActionIcon>
    </Group>
  );
}

export function Favorites() {
  const [favoriteItems, setFavoriteItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const favoritesData = JSON.parse(localStorage.getItem('favorites'));
    let items = [];

    if (favoritesData) {
      if (Array.isArray(favoritesData)) {
        items = favoritesData;
      } else if (typeof favoritesData === 'object') {
        items = Object.values(favoritesData);
      }
    }

    setFavoriteItems(items);
    calculateTotalPrice(items);
  }, []);

  const calculateTotalPrice = (items) => {
    let price = 0;

    if (Array.isArray(items)) {
      items.forEach((item) => {
        price += item.price;
      });
    }

    setTotalPrice(price);
  };

  const removeFavorite = (id) => {
    const updatedFavorites = favoriteItems.filter((item) => item.id !== id);
    setFavoriteItems(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    calculateTotalPrice(updatedFavorites);
  };

  const clearFavorites = () => {
    setFavoriteItems([]);
    localStorage.removeItem('favorites');
    setTotalPrice(0);
  };

  const addAllToCart = () => {
    const cartData = JSON.parse(localStorage.getItem('cart')) || [];
    const favoriteItemsArray = Array.isArray(favoriteItems)
      ? favoriteItems
      : Object.values(favoriteItems);

    // Добавляем товары в корзину
    favoriteItemsArray.forEach((favoriteItem) => {
      const existingItemIndex = cartData.findIndex((cartItem) => cartItem.id === favoriteItem.id);

      if (existingItemIndex !== -1) {
        // Если товар уже есть в корзине, увеличиваем количество
        cartData[existingItemIndex].quantity += 1;
      } else {
        // Если товара нет в корзине, добавляем его с количеством 1
        cartData.push({ ...favoriteItem, quantity: 1 });
      }
    });

    // Обновляем localStorage для корзины
    localStorage.setItem('cart', JSON.stringify(cartData));

    // Очищаем избранные товары
    setFavoriteItems([]);
    localStorage.removeItem('favorites');
    setTotalPrice(0);

    // Отправляем событие для обновления других компонентов
    window.dispatchEvent(new Event('cartUpdated'));

    // Можно показать уведомление пользователю
    alert('Все избранные товары добавлены в корзину');
  };

  return (
    <Card
      radius="lg"
      padding="lg"
      style={{
        maxWidth: '600px',
        backgroundColor: '#f8f9fa',
        border: '1px solid #e0e0e0',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
      }}
    >
      <Text size="lg" mb="sm" color="teal">
        Избранные товары
      </Text>
      <Badge color="cyan" size="sm" radius="sm" variant="outline" mb="sm">
        Товары, которые вы хотите сохранить
      </Badge>
      <ScrollArea style={{ height: '300px', overflowY: 'auto' }} offsetScrollbars>
        {favoriteItems.length > 0 ? (
          favoriteItems.map((item) => (
            <FavoriteItem key={item.id} item={item} removeFavorite={removeFavorite} />
          ))
        ) : (
          <Text color="dimmed" mt="lg">
            У вас пока нет избранных товаров.
          </Text>
        )}
      </ScrollArea>
      <Divider my="lg" style={{ borderColor: '#d3d3d3' }} />
      <Stack>
        <Group>
          <Text size="sm" color="dimmed">
            Кол-во товаров:
          </Text>
          <Text size="sm">{favoriteItems.length}</Text>
        </Group>
        <Group>
          <Text size="sm" color="dimmed">
            Общая стоимость:
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
        radius="md"
        size="md"
        style={{
          backgroundColor: '#4caf50',
          color: '#ffffff',
          fontWeight: 600,
        }}
        onClick={addAllToCart}
      >
        Добавить все в корзину
      </Button>
      <Button
        variant="subtle"
        color="red"
        fullWidth
        mt="xs"
        radius="md"
        onClick={clearFavorites}
        style={{ fontWeight: 500 }}
      >
        Очистить избранные
      </Button>
    </Card>
  );
}

export default Favorites;
