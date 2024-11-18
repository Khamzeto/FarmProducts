// components/NewArrivalsCarousel.js
'use client';

import { useEffect, useState } from 'react';
import { IconHeart, IconMinus, IconPlus, IconShoppingCart } from '@tabler/icons-react';
import { Carousel } from '@mantine/carousel';
import { ActionIcon, Badge, Button, Card, Group, Image, Rating, Text, Title } from '@mantine/core';
import ProductModal from '../ProductModal/ProductModal';

function ProductCard({
  image,
  isNew,
  discount,
  title,
  description,
  price,
  oldPrice,
  rating,
  _id,
  onClick,
}) {
  const [quantity, setQuantity] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const syncWithLocalStorage = () => {
      const cartData = JSON.parse(localStorage.getItem('cart')) || {};
      const favoritesData = JSON.parse(localStorage.getItem('favorites')) || {};
      setQuantity(cartData[_id]?.quantity || 0);
      setIsFavorite(!!favoritesData[_id]);
    };

    syncWithLocalStorage();

    window.addEventListener('cartUpdated', syncWithLocalStorage);
    window.addEventListener('favoritesUpdated', syncWithLocalStorage);

    return () => {
      window.removeEventListener('cartUpdated', syncWithLocalStorage);
      window.removeEventListener('favoritesUpdated', syncWithLocalStorage);
    };
  }, [_id]);

  const updateLocalStorage = (newQuantity) => {
    const cartData = JSON.parse(localStorage.getItem('cart')) || {};
    if (newQuantity === 0) {
      delete cartData[_id];
    } else {
      cartData[_id] = {
        id: _id,
        title,
        image,
        price: Number(price),
        quantity: newQuantity,
      };
    }
    localStorage.setItem('cart', JSON.stringify(cartData));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const handleAddToCart = (event) => {
    event.stopPropagation();
    setQuantity(1);
    updateLocalStorage(1);
  };

  const incrementQuantity = (event) => {
    event.stopPropagation();
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    updateLocalStorage(newQuantity);
  };

  const decrementQuantity = (event) => {
    event.stopPropagation();
    const newQuantity = quantity > 1 ? quantity - 1 : 0;
    setQuantity(newQuantity);
    updateLocalStorage(newQuantity);
  };

  const toggleFavorite = (event) => {
    event.stopPropagation();
    const favoritesData = JSON.parse(localStorage.getItem('favorites')) || {};
    if (isFavorite) {
      delete favoritesData[_id];
    } else {
      favoritesData[_id] = { id: _id, title, image, price };
    }
    localStorage.setItem('favorites', JSON.stringify(favoritesData));
    setIsFavorite(!isFavorite);
    window.dispatchEvent(new Event('favoritesUpdated'));
  };

  return (
    <Card
      padding="lg"
      radius="18"
      style={{ minHeight: '400px', cursor: 'pointer' }}
      onClick={onClick}
    >
      <Card.Section>
        <Image src={image} height={160} alt={title} />
        {isNew && (
          <Badge
            color="teal"
            size="sm"
            radius="sm"
            variant="filled"
            style={{ position: 'absolute', top: 14, left: 10 }}
          >
            Новинка
          </Badge>
        )}

        <ActionIcon
          variant="default"
          radius="xl"
          size="lg"
          style={{ position: 'absolute', top: 10, right: 10, color: isFavorite ? 'red' : 'gray' }}
          onClick={toggleFavorite}
        >
          <IconHeart
            color={isFavorite ? 'red' : 'gray'}
            fill={isFavorite ? 'red' : 'none'}
            size={18}
          />
        </ActionIcon>
      </Card.Section>

      <Group mt="md" mb="xs">
        <Text>{title}</Text>
      </Group>
      <Group>
        <Text color="dimmed" size="xs">
          {description}
        </Text>
      </Group>

      <Group mt="xs">
        {oldPrice && (
          <Text color="dimmed" style={{ textDecoration: 'line-through' }}>
            {oldPrice} ₽
          </Text>
        )}
        <Text color="red" size="xl">
          {price} ₽
        </Text>
      </Group>

      <Rating value={rating} readOnly mt="xs" />

      {quantity === 0 ? (
        <Button
          style={{ backgroundColor: '#54e382', color: 'black' }}
          fullWidth
          mt="md"
          radius="md"
          leftSection={<IconShoppingCart size={18} />}
          onClick={handleAddToCart}
        >
          В корзину
        </Button>
      ) : (
        <Group
          mt="md"
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
            color="teal"
            onClick={decrementQuantity}
            style={{ backgroundColor: '#54e382', color: 'black' }}
          >
            <IconMinus size={16} />
          </ActionIcon>
          <Text size="lg" style={{ margin: '0 15px' }}>
            {quantity}
          </Text>
          <ActionIcon
            size="lg"
            radius="xl"
            color="teal"
            onClick={incrementQuantity}
            style={{ backgroundColor: '#54e382', color: 'black' }}
          >
            <IconPlus size={16} />
          </ActionIcon>
        </Group>
      )}
    </Card>
  );
}

export function NewArrivalsCarousel() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function fetchLatestProducts() {
      try {
        const response = await fetch('http://localhost:5001/api/products/latest');
        const data = await response.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching latest products:', error);
      }
    }

    fetchLatestProducts();
  }, []);

  const openModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  return (
    <div style={{ backgroundColor: '#f4f4f4', padding: '40px 0', maxHeight: '600px' }}>
      <div style={{ maxWidth: '90%', margin: 'auto', padding: '20px 0' }}>
        <Title size="30" mb="40" mt="20">
          Новинки
        </Title>

        <Carousel slideSize="25%" slideGap="20" loop align="start">
          {products.map((product) => (
            <Carousel.Slide key={product._id}>
              <ProductCard {...product} isNew={true} onClick={() => openModal(product)} />
            </Carousel.Slide>
          ))}
        </Carousel>
      </div>

      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

export default NewArrivalsCarousel;
