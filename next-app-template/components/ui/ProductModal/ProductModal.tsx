'use client';

import { useEffect, useState } from 'react';
import { IconHeart, IconMinus, IconPlus, IconShoppingCart } from '@tabler/icons-react';
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Divider,
  Group,
  Image,
  Modal,
  Rating,
  Text,
  Title,
} from '@mantine/core';

export default function ProductModal({ product, isOpen, onClose }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [quantity, setQuantity] = useState(0);
  console.log(product);

  // Load initial state from localStorage and add event listeners
  useEffect(() => {
    if (product) {
      const loadInitialData = () => {
        const favorites = JSON.parse(localStorage.getItem('favorites')) || {};
        const cart = JSON.parse(localStorage.getItem('cart')) || {};
        setIsFavorite(!!favorites[product._id]);
        setQuantity(cart[product._id]?.quantity || 0);
      };

      loadInitialData();

      const handleCartUpdated = () => loadInitialData();
      const handleFavoritesUpdated = () => loadInitialData();

      window.addEventListener('cartUpdated', handleCartUpdated);
      window.addEventListener('favoritesUpdated', handleFavoritesUpdated);

      return () => {
        window.removeEventListener('cartUpdated', handleCartUpdated);
        window.removeEventListener('favoritesUpdated', handleFavoritesUpdated);
      };
    }
  }, [product]);

  // Toggle favorite status and update localStorage
  const handleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || {};
    if (isFavorite) {
      delete favorites[product._id];
    } else {
      favorites[product._id] = product;
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
    setIsFavorite(!isFavorite);

    // Dispatch favorites update event
    window.dispatchEvent(new Event('favoritesUpdated'));
  };

  // Update cart in localStorage and set quantity
  const updateCart = (newQuantity) => {
    const cart = JSON.parse(localStorage.getItem('cart')) || {};
    if (newQuantity === 0) {
      delete cart[product._id];
    } else {
      cart[product._id] = { ...product, quantity: newQuantity };
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    setQuantity(newQuantity);

    // Dispatch cart update event
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const handleAddToCart = () => updateCart(1);
  const incrementQuantity = () => updateCart(quantity + 1);
  const decrementQuantity = () => updateCart(quantity > 1 ? quantity - 1 : 0);

  if (!product) return null;

  return (
    <Modal opened={isOpen} onClose={onClose} centered radius="24" size="60%">
      <Box
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '30px',
          padding: '30px',
          borderRadius: '16px',
          backgroundColor: '#fff',
        }}
      >
        {/* Product Info */}
        <Box style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
          <Image
            src={product.image}
            alt={product.title}
            width={300}
            height={300}
            style={{
              width: '300px',
              height: '300px',
              borderRadius: '16px',
              objectFit: 'cover',
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
            }}
          />
          <Box style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Title order={2}>{product.title}</Title>
              <IconHeart
                size={20}
                color={isFavorite ? 'red' : 'gray'}
                fill={isFavorite ? 'red' : 'none'}
                style={{ cursor: 'pointer' }}
                onClick={handleFavorite}
              />
            </div>
            <Text color="dimmed" size="sm" mt="xs">
              От {product.autor}
            </Text>
            <Rating value={product.rating} readOnly mt="sm" />
            <Text mt="md" size="sm" style={{ lineHeight: 1.6 }}>
              {product.description}
            </Text>
            <Group mt="lg" align="center">
              <Text size="xl" color="red">
                {product.price} ₽
              </Text>
              {product.oldPrice && (
                <Text color="dimmed" style={{ textDecoration: 'line-through' }}>
                  {product.oldPrice} ₽
                </Text>
              )}
              {product.discount && (
                <Badge color="green" radius="sm" size="lg">
                  -{product.discount}%
                </Badge>
              )}
            </Group>
            <Text size="xs" color="dimmed" mt="xs">
              Скидка действует до {new Date(product.discountValidUntil).toLocaleDateString()}
            </Text>

            {quantity === 0 ? (
              <Button
                mt="lg"
                radius="md"
                fullWidth
                variant="filled"
                leftSection={<IconShoppingCart size={18} />}
                style={{
                  backgroundColor: '#54e382',
                  color: '#000',
                  boxShadow: '0px 4px 12px rgba(84, 227, 130, 0.3)',
                  transition: 'transform 0.2s',
                }}
                onClick={handleAddToCart}
              >
                Добавить в корзину
              </Button>
            ) : (
              <Group
                mt="lg"
                style={{
                  backgroundColor: '#f0f0f0',
                  padding: '10px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <ActionIcon
                  size="lg"
                  radius="xl"
                  variant="filled"
                  style={{ backgroundColor: '#54e382', color: 'black' }}
                  onClick={decrementQuantity}
                >
                  <IconMinus size={16} />
                </ActionIcon>
                <Text size="lg" style={{ margin: '0 15px' }}>
                  {quantity}
                </Text>
                <ActionIcon
                  size="lg"
                  radius="xl"
                  variant="filled"
                  style={{ backgroundColor: '#54e382', color: 'black' }}
                  onClick={incrementQuantity}
                >
                  <IconPlus size={16} />
                </ActionIcon>
              </Group>
            )}
          </Box>
        </Box>

        {/* Product Details */}
        <Divider my="xl" />
        <Box>
          <Title order={4} mb="sm">
            Детали товара
          </Title>
          <Box style={{ lineHeight: 1.6 }}>
            <Text size="sm">
              Пищевая ценность: белки - {product.nutrition?.proteins || 'N/A'}, жиры -{' '}
              {product.nutrition?.fats || 'N/A'}, углеводы -{' '}
              {product.nutrition?.carbohydrates || 'N/A'}
            </Text>
            <Text size="sm" mt="xs">
              Энергетическая ценность: {product.energyValue?.kcal} ккал / {product.energyValue?.kJ}{' '}
              кДж
            </Text>
            <Text size="sm" mt="xs">
              Срок годности: {product.expiration}
            </Text>
            <Text size="sm" mt="xs">
              Условия хранения: {product.storageConditions}
            </Text>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}
